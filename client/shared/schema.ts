import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  integer, 
  decimal, 
  boolean,
  jsonb,
  index,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Role enum
export const roleEnum = pgEnum("role", ["chairman", "hod", "staff"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  collegeId: varchar("college_id"),
  departmentId: varchar("department_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Colleges table
export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(), // BGIIG, BIET, KNRCER
  address: text("address"),
  principalName: text("principal_name"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Departments table
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  collegeId: varchar("college_id").notNull(),
  name: text("name").notNull(), // CSE, ECE, EEE, ME, CE, etc.
  shortName: text("short_name").notNull(), // CSE, ECE, etc.
  hodId: varchar("hod_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Students table
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  admissionNumber: text("admission_number").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  collegeId: varchar("college_id").notNull(),
  departmentId: varchar("department_id").notNull(),
  year: integer("year").notNull(), // 1, 2, 3, 4
  semester: integer("semester").notNull(), // 1-8
  gender: text("gender"), // Male, Female
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Faculty table
export const faculty = pgTable("faculty", {
  id: varchar("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  facultyNumber: text("faculty_number").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  collegeId: varchar("college_id").notNull(),
  departmentId: varchar("department_id").notNull(),
  designation: text("designation"), // Professor, Associate Professor, etc.
  joinedYear: integer("joined_year").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  studentId: varchar("student_id"),
  facultyId: varchar("faculty_id"),
  date: timestamp("date").notNull(),
  isPresent: boolean("is_present").notNull(),
  remarks: text("remarks"),
  uploadedBy: varchar("uploaded_by").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Marks table
export const marks = pgTable("marks", {
  id: varchar("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  studentId: varchar("student_id").notNull(),
  subject: text("subject").notNull(),
  semester: integer("semester").notNull(),
  marksObtained: decimal("marks_obtained", { precision: 5, scale: 2 }),
  totalMarks: decimal("total_marks", { precision: 5, scale: 2 }),
  grade: text("grade"),
  isPassed: boolean("is_passed").default(false),
  uploadedBy: varchar("uploaded_by").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`lower(hex(randomblob(16)))`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // student_lookup, data_upload, etc.
  entityType: text("entity_type"), // student, faculty, attendance, marks
  entityId: varchar("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  college: one(colleges, {
    fields: [users.collegeId],
    references: [colleges.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
}));

export const collegesRelations = relations(colleges, ({ many }) => ({
  departments: many(departments),
  students: many(students),
  faculty: many(faculty),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  college: one(colleges, {
    fields: [departments.collegeId],
    references: [colleges.id],
  }),
  hod: one(users, {
    fields: [departments.hodId],
    references: [users.id],
  }),
  students: many(students),
  faculty: many(faculty),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  college: one(colleges, {
    fields: [students.collegeId],
    references: [colleges.id],
  }),
  department: one(departments, {
    fields: [students.departmentId],
    references: [departments.id],
  }),
  attendance: many(attendance),
  marks: many(marks),
}));

export const facultyRelations = relations(faculty, ({ one, many }) => ({
  college: one(colleges, {
    fields: [faculty.collegeId],
    references: [colleges.id],
  }),
  department: one(departments, {
    fields: [faculty.departmentId],
    references: [departments.id],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  faculty: one(faculty, {
    fields: [attendance.facultyId],
    references: [faculty.id],
  }),
  uploadedByUser: one(users, {
    fields: [attendance.uploadedBy],
    references: [users.id],
  }),
}));

export const marksRelations = relations(marks, ({ one }) => ({
  student: one(students, {
    fields: [marks.studentId],
    references: [students.id],
  }),
  uploadedByUser: one(users, {
    fields: [marks.uploadedBy],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
  createdAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertFacultySchema = createInsertSchema(faculty).omit({
  id: true,
  createdAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertMarksSchema = createInsertSchema(marks).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type College = typeof colleges.$inferSelect;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Faculty = typeof faculty.$inferSelect;
export type InsertFaculty = z.infer<typeof insertFacultySchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Marks = typeof marks.$inferSelect;
export type InsertMarks = z.infer<typeof insertMarksSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
