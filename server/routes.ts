import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import * as XLSX from "xlsx";
import { insertStudentSchema, insertFacultySchema, insertAttendanceSchema, insertMarksSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to check authentication
function requireAuth(req: any, res: Response, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Middleware to check role permissions
function requireRole(roles: string[]) {
  return (req: any, res: Response, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

// Audit logging middleware
async function logAudit(req: any, action: string, entityType?: string, entityId?: string, details?: any) {
  if (req.user) {
    await storage.createAuditLog({
      userId: req.user.id,
      action,
      entityType,
      entityId,
      details,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Dashboard KPIs endpoint
  app.get("/api/dashboard/kpis", requireAuth, async (req: any, res: Response) => {
    try {
      const { collegeId } = req.query;
      
      // Filter by user's college if not chairman
      let targetCollegeId = collegeId;
      if (req.user.role !== 'chairman') {
        targetCollegeId = req.user.collegeId;
      }

      const kpis = await storage.getDashboardKPIs(targetCollegeId);
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching dashboard KPIs:", error);
      res.status(500).json({ message: "Failed to fetch dashboard KPIs" });
    }
  });

  // Colleges endpoint
  app.get("/api/colleges", requireAuth, async (req: any, res: Response) => {
    try {
      const colleges = await storage.getColleges();
      res.json(colleges);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      res.status(500).json({ message: "Failed to fetch colleges" });
    }
  });

  // College-specific KPIs
  app.get("/api/colleges/:id/kpis", requireAuth, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check permissions
      if (req.user.role !== 'chairman' && req.user.collegeId !== id) {
        return res.status(403).json({ message: "Access denied to this college" });
      }

      const kpis = await storage.getDashboardKPIs(id);
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching college KPIs:", error);
      res.status(500).json({ message: "Failed to fetch college KPIs" });
    }
  });

  // Student search endpoint
  app.get("/api/students/:admissionNumber", requireAuth, async (req: any, res: Response) => {
    try {
      const { admissionNumber } = req.params;
      
      const studentProfile = await storage.getStudentProfile(admissionNumber);
      if (!studentProfile) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Check permissions
      if (req.user.role !== 'chairman') {
        if (req.user.collegeId !== studentProfile.student.collegeId) {
          return res.status(403).json({ message: "Access denied to this student" });
        }
        if (req.user.role === 'hod' && req.user.departmentId !== studentProfile.student.departmentId) {
          return res.status(403).json({ message: "Access denied to this student" });
        }
      }

      // Log the student lookup
      await logAudit(req, 'student_lookup', 'student', studentProfile.student.id, {
        admissionNumber,
        studentName: `${studentProfile.student.firstName} ${studentProfile.student.lastName}`,
      });

      res.json(studentProfile);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      res.status(500).json({ message: "Failed to fetch student profile" });
    }
  });

  // File upload endpoints
  app.post("/api/upload/attendance", requireAuth, requireRole(['chairman', 'hod', 'staff']), upload.single('file'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const attendanceRecords = [];
      const errors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any;
        try {
          // Validate and process each row
          const student = await storage.getStudentByAdmissionNumber(row.admissionNumber);
          if (!student) {
            errors.push(`Row ${i + 1}: Student not found with admission number ${row.admissionNumber}`);
            continue;
          }

          attendanceRecords.push({
            studentId: student.id,
            date: new Date(row.date),
            isPresent: row.isPresent === 'true' || row.isPresent === 1 || row.isPresent === true,
            remarks: row.remarks || null,
            uploadedBy: req.user.id,
          });
        } catch (error) {
          errors.push(`Row ${i + 1}: Invalid data format`);
        }
      }

      if (attendanceRecords.length > 0) {
        await storage.createAttendance(attendanceRecords);
      }

      await logAudit(req, 'attendance_upload', 'attendance', undefined, {
        recordsProcessed: data.length,
        recordsCreated: attendanceRecords.length,
        errors: errors.length,
      });

      res.json({
        message: "Attendance data processed",
        recordsProcessed: data.length,
        recordsCreated: attendanceRecords.length,
        errors,
      });
    } catch (error) {
      console.error("Error uploading attendance:", error);
      res.status(500).json({ message: "Failed to upload attendance data" });
    }
  });

  app.post("/api/upload/marks", requireAuth, requireRole(['chairman', 'hod', 'staff']), upload.single('file'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const marksRecords = [];
      const errors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any;
        try {
          const student = await storage.getStudentByAdmissionNumber(row.admissionNumber);
          if (!student) {
            errors.push(`Row ${i + 1}: Student not found with admission number ${row.admissionNumber}`);
            continue;
          }

          const marksObtained = parseFloat(row.marksObtained);
          const totalMarks = parseFloat(row.totalMarks);
          const isPassed = marksObtained >= (totalMarks * 0.4); // 40% passing criteria

          marksRecords.push({
            studentId: student.id,
            subject: row.subject,
            semester: parseInt(row.semester),
            marksObtained: marksObtained.toString(),
            totalMarks: totalMarks.toString(),
            grade: row.grade || null,
            isPassed,
            uploadedBy: req.user.id,
          });
        } catch (error) {
          errors.push(`Row ${i + 1}: Invalid data format`);
        }
      }

      if (marksRecords.length > 0) {
        await storage.createMarks(marksRecords);
      }

      await logAudit(req, 'marks_upload', 'marks', undefined, {
        recordsProcessed: data.length,
        recordsCreated: marksRecords.length,
        errors: errors.length,
      });

      res.json({
        message: "Marks data processed",
        recordsProcessed: data.length,
        recordsCreated: marksRecords.length,
        errors,
      });
    } catch (error) {
      console.error("Error uploading marks:", error);
      res.status(500).json({ message: "Failed to upload marks data" });
    }
  });

  // Audit logs endpoint
  app.get("/api/audit-logs", requireAuth, requireRole(['chairman']), async (req: any, res: Response) => {
    try {
      const { userId, limit } = req.query;
      const logs = await storage.getAuditLogs(userId, limit ? parseInt(limit) : 50);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Departments endpoint
  app.get("/api/departments", requireAuth, async (req: any, res: Response) => {
    try {
      const { collegeId } = req.query;
      let targetCollegeId = collegeId;
      
      // Filter by user's college if not chairman
      if (req.user.role !== 'chairman') {
        targetCollegeId = req.user.collegeId;
      }

      const departments = await storage.getDepartments(targetCollegeId);
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
