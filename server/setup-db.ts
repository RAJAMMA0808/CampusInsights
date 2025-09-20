import { db } from "./db";
import { sql } from "drizzle-orm";

async function setupDatabase() {
  try {
    console.log("Setting up database schema...");

    // Create tables manually for SQLite
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expire TIMESTAMP NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('chairman', 'hod', 'staff')),
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        college_id TEXT,
        department_id TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS colleges (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        short_name TEXT NOT NULL,
        address TEXT,
        principal_name TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        college_id TEXT NOT NULL,
        name TEXT NOT NULL,
        short_name TEXT NOT NULL,
        hod_id TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        admission_number TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        college_id TEXT NOT NULL,
        department_id TEXT NOT NULL,
        year INTEGER NOT NULL,
        semester INTEGER NOT NULL,
        gender TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS faculty (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        faculty_number TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        college_id TEXT NOT NULL,
        department_id TEXT NOT NULL,
        designation TEXT,
        joined_year INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        staff_number TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        college_id TEXT NOT NULL,
        department_id TEXT NOT NULL,
        designation TEXT,
        joined_year INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        student_id TEXT,
        faculty_id TEXT,
        staff_id TEXT,
        date TIMESTAMP NOT NULL,
        is_present BOOLEAN NOT NULL,
        morning_attendance TEXT,
        evening_attendance TEXT,
        remarks TEXT,
        uploaded_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS marks (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        student_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        subject_code TEXT,
        subject_name TEXT,
        semester INTEGER NOT NULL,
        exam_type TEXT,
        marks_obtained TEXT,
        total_marks TEXT,
        grade TEXT,
        is_passed BOOLEAN DEFAULT 0,
        uploaded_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database schema created successfully!");

    // Create indexes
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_session_expire ON sessions(expire)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_attendance_faculty ON attendance(faculty_id)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_attendance_staff ON attendance(staff_id)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_marks_student ON marks(student_id)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`);

    console.log("✅ Database indexes created successfully!");

  } catch (error) {
    console.error("❌ Error setting up database:", error);
    throw error;
  }
}

// Run setup
setupDatabase()
  .then(() => {
    console.log("🎉 Database setup completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Database setup failed:", error);
    process.exit(1);
  });
