import {
  users,
  colleges,
  departments,
  students,
  faculty,
  attendance,
  marks,
  auditLogs,
  type User,
  type InsertUser,
  type College,
  type InsertCollege,
  type Department,
  type InsertDepartment,
  type Student,
  type InsertStudent,
  type Faculty,
  type InsertFaculty,
  type Attendance,
  type InsertAttendance,
  type Marks,
  type InsertMarks,
  type AuditLog,
  type InsertAuditLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count, avg } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: any;
  
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // College operations
  getColleges(): Promise<College[]>;
  getCollege(id: string): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;
  
  // Department operations
  getDepartments(collegeId?: string): Promise<Department[]>;
  getDepartment(id: string): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Student operations
  getStudents(collegeId?: string, departmentId?: string): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByAdmissionNumber(admissionNumber: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  createStudents(students: InsertStudent[]): Promise<Student[]>;
  
  // Faculty operations
  getFaculty(collegeId?: string, departmentId?: string): Promise<Faculty[]>;
  getFacultyMember(id: string): Promise<Faculty | undefined>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;
  createFacultyMembers(facultyMembers: InsertFaculty[]): Promise<Faculty[]>;
  
  // Attendance operations
  getAttendance(studentId?: string, facultyId?: string, date?: Date): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance[]): Promise<Attendance[]>;
  getAttendanceStats(collegeId?: string, departmentId?: string): Promise<{
    studentsPresent: number;
    studentsAbsent: number;
    facultyPresent: number;
    facultyAbsent: number;
  }>;
  
  // Marks operations
  getMarks(studentId?: string, semester?: number): Promise<Marks[]>;
  createMarks(marks: InsertMarks[]): Promise<Marks[]>;
  getPassPercentage(collegeId?: string, departmentId?: string): Promise<number>;
  
  // Student profile operations
  getStudentProfile(admissionNumber: string): Promise<{
    student: Student;
    attendanceRate: number;
    cgpa: number;
    totalCredits: number;
    recentAttendance: Attendance[];
    recentMarks: Marks[];
  } | undefined>;
  
  // Dashboard KPIs
  getDashboardKPIs(collegeId?: string): Promise<{
    studentsPresent: number;
    studentsAbsent: number;
    facultyPresent: number;
    facultyAbsent: number;
    passPercentage: number;
  }>;
  
  // Audit operations
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(userId?: string, limit?: number): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false, // Table already exists
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getColleges(): Promise<College[]> {
    return await db.select().from(colleges).where(eq(colleges.isActive, true));
  }

  async getCollege(id: string): Promise<College | undefined> {
    const [college] = await db.select().from(colleges).where(eq(colleges.id, id));
    return college;
  }

  async createCollege(college: InsertCollege): Promise<College> {
    const [newCollege] = await db.insert(colleges).values(college).returning();
    return newCollege;
  }

  async getDepartments(collegeId?: string): Promise<Department[]> {
    const conditions = [eq(departments.isActive, true)];
    if (collegeId) {
      conditions.push(eq(departments.collegeId, collegeId));
    }
    return await db.select().from(departments).where(and(...conditions));
  }

  async getDepartment(id: string): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }

  async getStudents(collegeId?: string, departmentId?: string): Promise<Student[]> {
    const conditions = [eq(students.isActive, true)];
    
    if (collegeId) {
      conditions.push(eq(students.collegeId, collegeId));
    }
    if (departmentId) {
      conditions.push(eq(students.departmentId, departmentId));
    }
    
    return await db.select().from(students).where(and(...conditions));
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentByAdmissionNumber(admissionNumber: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.admissionNumber, admissionNumber));
    return student;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }

  async createStudents(studentList: InsertStudent[]): Promise<Student[]> {
    return await db.insert(students).values(studentList).returning();
  }

  async getFaculty(collegeId?: string, departmentId?: string): Promise<Faculty[]> {
    const conditions = [eq(faculty.isActive, true)];
    
    if (collegeId) {
      conditions.push(eq(faculty.collegeId, collegeId));
    }
    if (departmentId) {
      conditions.push(eq(faculty.departmentId, departmentId));
    }
    
    return await db.select().from(faculty).where(and(...conditions));
  }

  async getFacultyMember(id: string): Promise<Faculty | undefined> {
    const [facultyMember] = await db.select().from(faculty).where(eq(faculty.id, id));
    return facultyMember;
  }

  async createFaculty(facultyMember: InsertFaculty): Promise<Faculty> {
    const [newFaculty] = await db.insert(faculty).values(facultyMember).returning();
    return newFaculty;
  }

  async createFacultyMembers(facultyMembers: InsertFaculty[]): Promise<Faculty[]> {
    return await db.insert(faculty).values(facultyMembers).returning();
  }

  async getAttendance(studentId?: string, facultyId?: string, date?: Date): Promise<Attendance[]> {
    const conditions = [];
    if (studentId) conditions.push(eq(attendance.studentId, studentId));
    if (facultyId) conditions.push(eq(attendance.facultyId, facultyId));
    if (date) conditions.push(eq(attendance.date, date));
    
    if (conditions.length > 0) {
      return await db.select().from(attendance).where(and(...conditions)).orderBy(desc(attendance.date));
    }
    
    return await db.select().from(attendance).orderBy(desc(attendance.date));
  }

  async createAttendance(attendanceRecords: InsertAttendance[]): Promise<Attendance[]> {
    return await db.insert(attendance).values(attendanceRecords).returning();
  }

  async getAttendanceStats(collegeId?: string, departmentId?: string): Promise<{
    studentsPresent: number;
    studentsAbsent: number;
    facultyPresent: number;
    facultyAbsent: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get student attendance for today
    const studentAttendanceConditions = [sql`DATE(${attendance.date}) = DATE(${today})`];
    if (collegeId) {
      studentAttendanceConditions.push(eq(students.collegeId, collegeId));
    }
    if (departmentId) {
      studentAttendanceConditions.push(eq(students.departmentId, departmentId));
    }

    const studentAttendanceQuery = db
      .select({
        isPresent: attendance.isPresent,
        count: count()
      })
      .from(attendance)
      .innerJoin(students, eq(attendance.studentId, students.id))
      .where(and(...studentAttendanceConditions))
      .groupBy(attendance.isPresent);

    // Get faculty attendance for today
    const facultyAttendanceConditions = [sql`DATE(${attendance.date}) = DATE(${today})`];
    if (collegeId) {
      facultyAttendanceConditions.push(eq(faculty.collegeId, collegeId));
    }
    if (departmentId) {
      facultyAttendanceConditions.push(eq(faculty.departmentId, departmentId));
    }

    const facultyAttendanceQuery = db
      .select({
        isPresent: attendance.isPresent,
        count: count()
      })
      .from(attendance)
      .innerJoin(faculty, eq(attendance.facultyId, faculty.id))
      .where(and(...facultyAttendanceConditions))
      .groupBy(attendance.isPresent);

    const [studentAttendanceStats, facultyAttendanceStats] = await Promise.all([
      studentAttendanceQuery,
      facultyAttendanceQuery
    ]);

    const stats = {
      studentsPresent: 0,
      studentsAbsent: 0,
      facultyPresent: 0,
      facultyAbsent: 0,
    };

    studentAttendanceStats.forEach(stat => {
      if (stat.isPresent) {
        stats.studentsPresent = stat.count;
      } else {
        stats.studentsAbsent = stat.count;
      }
    });

    facultyAttendanceStats.forEach(stat => {
      if (stat.isPresent) {
        stats.facultyPresent = stat.count;
      } else {
        stats.facultyAbsent = stat.count;
      }
    });

    return stats;
  }

  async getMarks(studentId?: string, semester?: number): Promise<Marks[]> {
    const conditions = [];
    if (studentId) conditions.push(eq(marks.studentId, studentId));
    if (semester) conditions.push(eq(marks.semester, semester));
    
    if (conditions.length > 0) {
      return await db.select().from(marks).where(and(...conditions)).orderBy(desc(marks.createdAt));
    }
    
    return await db.select().from(marks).orderBy(desc(marks.createdAt));
  }

  async createMarks(marksList: InsertMarks[]): Promise<Marks[]> {
    return await db.insert(marks).values(marksList).returning();
  }

  async getPassPercentage(collegeId?: string, departmentId?: string): Promise<number> {
    const conditions = [];
    if (collegeId) {
      conditions.push(eq(students.collegeId, collegeId));
    }
    if (departmentId) {
      conditions.push(eq(students.departmentId, departmentId));
    }

    let query = db
      .select({
        totalStudents: count(),
        passedStudents: count(sql`CASE WHEN ${marks.isPassed} = true THEN 1 END`),
      })
      .from(marks)
      .innerJoin(students, eq(marks.studentId, students.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const [result] = await query;
    
    if (!result || result.totalStudents === 0) return 0;
    
    return (result.passedStudents / result.totalStudents) * 100;
  }

  async getStudentProfile(admissionNumber: string): Promise<{
    student: Student;
    attendanceRate: number;
    cgpa: number;
    totalCredits: number;
    recentAttendance: Attendance[];
    recentMarks: Marks[];
  } | undefined> {
    const student = await this.getStudentByAdmissionNumber(admissionNumber);
    if (!student) return undefined;

    // Get attendance rate
    const [totalAttendance] = await db
      .select({ count: count() })
      .from(attendance)
      .where(eq(attendance.studentId, student.id));

    const [presentAttendance] = await db
      .select({ count: count() })
      .from(attendance)
      .where(and(eq(attendance.studentId, student.id), eq(attendance.isPresent, true)));

    const attendanceRate = totalAttendance.count > 0 ? 
      (presentAttendance.count / totalAttendance.count) * 100 : 0;

    // Get CGPA
    const [cgpaResult] = await db
      .select({ 
        cgpa: avg(sql`CASE WHEN ${marks.totalMarks} > 0 THEN (${marks.marksObtained} / ${marks.totalMarks}) * 10 ELSE 0 END`)
      })
      .from(marks)
      .where(eq(marks.studentId, student.id));

    const cgpa = cgpaResult.cgpa ? Number(cgpaResult.cgpa) : 0;

    // Get total credits (approximate based on passed subjects)
    const [creditsResult] = await db
      .select({ count: count() })
      .from(marks)
      .where(and(eq(marks.studentId, student.id), eq(marks.isPassed, true)));

    const totalCredits = creditsResult.count * 3; // Assuming 3 credits per subject

    // Get recent attendance and marks
    const recentAttendance = await db
      .select()
      .from(attendance)
      .where(eq(attendance.studentId, student.id))
      .orderBy(desc(attendance.date))
      .limit(10);

    const recentMarks = await db
      .select()
      .from(marks)
      .where(eq(marks.studentId, student.id))
      .orderBy(desc(marks.createdAt))
      .limit(10);

    return {
      student,
      attendanceRate,
      cgpa,
      totalCredits,
      recentAttendance,
      recentMarks,
    };
  }

  async getDashboardKPIs(collegeId?: string): Promise<{
    studentsPresent: number;
    studentsAbsent: number;
    facultyPresent: number;
    facultyAbsent: number;
    passPercentage: number;
  }> {
    const attendanceStats = await this.getAttendanceStats(collegeId);
    const passPercentage = await this.getPassPercentage(collegeId);

    return {
      ...attendanceStats,
      passPercentage,
    };
  }

  async createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog> {
    const [newAuditLog] = await db.insert(auditLogs).values(auditLog).returning();
    return newAuditLog;
  }

  async getAuditLogs(userId?: string, limit: number = 50): Promise<AuditLog[]> {
    if (userId) {
      return await db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.createdAt)).limit(limit);
    }
    
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
