import { db } from "./db";
import { sql } from "drizzle-orm";

// Generate a simple UUID-like ID
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function manualInit() {
  try {
    console.log("Starting manual database initialization...");

    // Create a test college
    const collegeId = generateId();
    await db.run(sql`
      INSERT INTO colleges (id, name, short_name, address, principal_name)
      VALUES (${collegeId}, 'Big Institute of Engineering and Technology', 'BIET', '123 Engineering Street, Tech City', 'Dr. Rajesh Kumar')
    `);

    console.log("✅ Created college: Big Institute of Engineering and Technology");

    // Create a test department
    const departmentId = generateId();
    await db.run(sql`
      INSERT INTO departments (id, college_id, name, short_name)
      VALUES (${departmentId}, ${collegeId}, 'Computer Science and Engineering', 'CSE')
    `);

    console.log("✅ Created department: Computer Science and Engineering");

    // Create a test student
    const studentId = generateId();
    await db.run(sql`
      INSERT INTO students (id, admission_number, first_name, last_name, email, phone, college_id, department_id, year, semester, gender)
      VALUES (${studentId}, 'KCSE202001', 'Aarav', 'Kapoor', 'kcse202001@biet.edu', '+919876543210', ${collegeId}, ${departmentId}, 1, 1, 'Male')
    `);

    console.log("✅ Created student: Aarav Kapoor (KCSE202001)");

    // Create a test faculty member
    const facultyId = generateId();
    await db.run(sql`
      INSERT INTO faculty (id, faculty_number, first_name, last_name, email, phone, college_id, department_id, designation, joined_year)
      VALUES (${facultyId}, 'KCSEF2021-21001', 'Dr. Rajesh', 'Kumar', 'kcsef2021-21001@biet.edu', '+919876543211', ${collegeId}, ${departmentId}, 'Professor', 2021)
    `);

    console.log("✅ Created faculty: Dr. Rajesh Kumar");

    // Create a test staff member
    const staffId = generateId();
    await db.run(sql`
      INSERT INTO staff (id, staff_number, first_name, last_name, email, phone, college_id, department_id, designation, joined_year)
      VALUES (${staffId}, 'GCSEF2020-23001', 'Mahesh', 'Kumar', 'gcsef2020-23001@biet.edu', '+919876543212', ${collegeId}, ${departmentId}, 'Admin', 2020)
    `);

    console.log("✅ Created staff: Mahesh Kumar");

    // Create some test attendance records
    const today = new Date();
    const attendanceRecords = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const attendanceId = generateId();

      // Student attendance
      await db.run(sql`
        INSERT INTO attendance (id, student_id, date, is_present, morning_attendance, evening_attendance, remarks, uploaded_by)
        VALUES (${attendanceId}, ${studentId}, ${date.toISOString()}, ${Math.random() > 0.1}, 'Present', 'Present', '', 'system')
      `);

      // Faculty attendance
      const facultyAttendanceId = generateId();
      await db.run(sql`
        INSERT INTO attendance (id, faculty_id, date, is_present, morning_attendance, evening_attendance, remarks, uploaded_by)
        VALUES (${facultyAttendanceId}, ${facultyId}, ${date.toISOString()}, ${Math.random() > 0.05}, 'Present', 'Present', '', 'system')
      `);

      // Staff attendance
      const staffAttendanceId = generateId();
      await db.run(sql`
        INSERT INTO attendance (id, staff_id, date, is_present, morning_attendance, remarks, uploaded_by)
        VALUES (${staffAttendanceId}, ${staffId}, ${date.toISOString()}, ${Math.random() > 0.05}, 'Present', '', 'system')
      `);
    }

    console.log("✅ Created 15 attendance records (5 days × 3 people)");

    // Create some test marks
    const subjects = ["Mathematics", "Physics", "Chemistry", "Computer Programming"];

    for (const subject of subjects) {
      const marksId = generateId();
      const marksObtained = Math.floor(Math.random() * 40) + 20;
      const totalMarks = 100;
      const isPassed = marksObtained >= 40;
      const grade = marksObtained >= 90 ? "A+" : 
                   marksObtained >= 80 ? "A" : 
                   marksObtained >= 70 ? "B+" : 
                   marksObtained >= 60 ? "B" : 
                   marksObtained >= 50 ? "C+" : 
                   marksObtained >= 40 ? "C" : "F";

      await db.run(sql`
        INSERT INTO marks (id, student_id, subject, subject_code, subject_name, semester, exam_type, marks_obtained, total_marks, grade, is_passed, uploaded_by)
        VALUES (${marksId}, ${studentId}, ${subject}, ${subject.substring(0, 3).toUpperCase() + '101'}, ${subject}, 1, 'Mid1', ${marksObtained.toString()}, ${totalMarks.toString()}, ${grade}, ${isPassed}, 'system')
      `);
    }

    console.log("✅ Created 4 marks records");

    // Create a chairman user
    const chairmanId = generateId();
    await db.run(sql`
      INSERT INTO users (id, username, password, role, first_name, last_name, email, college_id, department_id)
      VALUES (${chairmanId}, 'chairman', 'password123', 'chairman', 'Dr. Chairman', 'Admin', 'chairman@campus.edu', ${collegeId}, ${departmentId})
    `);

    console.log("✅ Created chairman user: chairman / password123");

    // Create an HOD user
    const hodId = generateId();
    await db.run(sql`
      INSERT INTO users (id, username, password, role, first_name, last_name, email, college_id, department_id)
      VALUES (${hodId}, 'hod', 'password123', 'hod', 'Dr. HOD', 'Manager', 'hod@campus.edu', ${collegeId}, ${departmentId})
    `);

    console.log("✅ Created HOD user: hod / password123");

    // Create a staff user
    const staffUserId = generateId();
    await db.run(sql`
      INSERT INTO users (id, username, password, role, first_name, last_name, email, college_id, department_id)
      VALUES (${staffUserId}, 'staff', 'password123', 'staff', 'Staff', 'Member', 'staff@campus.edu', ${collegeId}, ${departmentId})
    `);

    console.log("✅ Created staff user: staff / password123");

    console.log("🎉 Manual database initialization completed successfully!");
    console.log("📊 Summary:");
    console.log("   - 1 College (BIET)");
    console.log("   - 1 Department (CSE)");
    console.log("   - 1 Student (KCSE202001)");
    console.log("   - 1 Faculty member");
    console.log("   - 1 Staff member");
    console.log("   - 15 Attendance records");
    console.log("   - 4 Marks records");
    console.log("   - 3 Users (chairman, hod, staff)");
    console.log("");
    console.log("🔑 Login credentials:");
    console.log("   Chairman: username='chairman', password='password123'");
    console.log("   HOD: username='hod', password='password123'");
    console.log("   Staff: username='staff', password='password123'");
    console.log("");
    console.log("🚀 You can now start the development server with: npm run dev");

  } catch (error) {
    console.error("❌ Error during initialization:", error);
    throw error;
  }
}

// Run initialization
manualInit()
  .then(() => {
    console.log("✅ Database initialization completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Database initialization failed:", error);
    process.exit(1);
  });
