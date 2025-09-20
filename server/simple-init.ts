import { storage } from "./storage";

async function simpleInit() {
  try {
    console.log("Starting simple database initialization...");

    // Create a test college
    const college = await storage.createCollege({
      name: "Big Institute of Engineering and Technology",
      shortName: "BIET",
      address: "123 Engineering Street, Tech City",
      principalName: "Dr. Rajesh Kumar",
    });

    console.log(`Created college: ${college.name}`);

    // Create a test department
    const department = await storage.createDepartment({
      collegeId: college.id,
      name: "Computer Science and Engineering",
      shortName: "CSE",
    });

    console.log(`Created department: ${department.name}`);

    // Create a test student
    const student = await storage.createStudent({
      admissionNumber: "KCSE202001",
      firstName: "Aarav",
      lastName: "Kapoor",
      email: "kcse202001@biet.edu",
      phone: "+919876543210",
      collegeId: college.id,
      departmentId: department.id,
      year: 1,
      semester: 1,
      gender: "Male",
    });

    console.log(`Created student: ${student.firstName} ${student.lastName}`);

    // Create a test faculty member
    const faculty = await storage.createFaculty({
      facultyNumber: "KCSEF2021-21001",
      firstName: "Dr. Rajesh",
      lastName: "Kumar",
      email: "kcsef2021-21001@biet.edu",
      phone: "+919876543211",
      collegeId: college.id,
      departmentId: department.id,
      designation: "Professor",
      joinedYear: 2021,
    });

    console.log(`Created faculty: ${faculty.firstName} ${faculty.lastName}`);

    // Create a test staff member
    const staff = await storage.createStaff({
      staffNumber: "GCSEF2020-23001",
      firstName: "Mahesh",
      lastName: "Kumar",
      email: "gcsef2020-23001@biet.edu",
      phone: "+919876543212",
      collegeId: college.id,
      departmentId: department.id,
      designation: "Admin",
      joinedYear: 2020,
    });

    console.log(`Created staff: ${staff.firstName} ${staff.lastName}`);

    // Create some test attendance records
    const today = new Date();
    const attendanceRecords = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Student attendance
      attendanceRecords.push({
        studentId: student.id,
        date,
        isPresent: Math.random() > 0.1,
        morningAttendance: "Present",
        eveningAttendance: "Present",
        remarks: "",
        uploadedBy: "system",
      });

      // Faculty attendance
      attendanceRecords.push({
        facultyId: faculty.id,
        date,
        isPresent: Math.random() > 0.05,
        morningAttendance: "Present",
        eveningAttendance: "Present",
        remarks: "",
        uploadedBy: "system",
      });

      // Staff attendance
      attendanceRecords.push({
        staffId: staff.id,
        date,
        isPresent: Math.random() > 0.05,
        morningAttendance: "Present",
        remarks: "",
        uploadedBy: "system",
      });
    }

    await storage.createAttendance(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);

    // Create some test marks
    const marksRecords = [];
    const subjects = ["Mathematics", "Physics", "Chemistry", "Computer Programming"];

    for (const subject of subjects) {
      const marksObtained = Math.floor(Math.random() * 40) + 20;
      const totalMarks = 100;
      const isPassed = marksObtained >= 40;

      marksRecords.push({
        studentId: student.id,
        subject,
        subjectCode: `${subject.substring(0, 3).toUpperCase()}101`,
        subjectName: subject,
        semester: 1,
        examType: "Mid1",
        marksObtained: marksObtained.toString(),
        totalMarks: totalMarks.toString(),
        grade: marksObtained >= 90 ? "A+" : 
               marksObtained >= 80 ? "A" : 
               marksObtained >= 70 ? "B+" : 
               marksObtained >= 60 ? "B" : 
               marksObtained >= 50 ? "C+" : 
               marksObtained >= 40 ? "C" : "F",
        isPassed,
        uploadedBy: "system",
      });
    }

    await storage.createMarks(marksRecords);
    console.log(`Created ${marksRecords.length} marks records`);

    console.log("Simple database initialization completed successfully!");
    console.log("You can now start the development server with: npm run dev");

  } catch (error) {
    console.error("Error during initialization:", error);
    throw error;
  }
}

// Run initialization
simpleInit()
  .then(() => {
    console.log("✅ Database initialization completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  });
