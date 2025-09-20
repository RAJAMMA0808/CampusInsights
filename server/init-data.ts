import { storage } from "./storage";
import { insertCollegeSchema, insertDepartmentSchema, insertStudentSchema, insertFacultySchema, insertStaffSchema } from "@shared/schema";

// Initialize sample data for the 3 colleges
export async function initializeSampleData() {
  try {
    console.log("Initializing sample data...");

    // Create colleges
    const colleges = [
      {
        name: "Big Institute of Engineering and Technology",
        shortName: "BIET",
        address: "123 Engineering Street, Tech City",
        principalName: "Dr. Rajesh Kumar",
      },
      {
        name: "Brilliant Institute of Engineering and Technology", 
        shortName: "BGIIG",
        address: "456 Innovation Avenue, Smart City",
        principalName: "Dr. Priya Sharma",
      },
      {
        name: "Kasireddy Narayanreddy College of Engineering and Research",
        shortName: "KNRCER", 
        address: "789 Research Boulevard, Knowledge City",
        principalName: "Dr. Suresh Reddy",
      }
    ];

    const createdColleges = [];
    for (const college of colleges) {
      const created = await storage.createCollege(college);
      createdColleges.push(created);
      console.log(`Created college: ${created.name}`);
    }

    // Create departments for each college
    const departments = [
      { name: "Computer Science and Engineering", shortName: "CSE" },
      { name: "Electronics and Communication Engineering", shortName: "ECE" },
      { name: "Electrical and Electronics Engineering", shortName: "EEE" },
      { name: "Mechanical Engineering", shortName: "ME" },
      { name: "Civil Engineering", shortName: "CE" },
      { name: "Artificial Intelligence and Machine Learning", shortName: "AIML" },
      { name: "Data Science", shortName: "DS" },
      { name: "Cyber Security", shortName: "CS" }
    ];

    const createdDepartments = [];
    for (const college of createdColleges) {
      for (const dept of departments) {
        const created = await storage.createDepartment({
          ...dept,
          collegeId: college.id,
        });
        createdDepartments.push(created);
        console.log(`Created department: ${dept.name} in ${college.shortName}`);
      }
    }

    // Generate sample students for each college and department
    const studentNames = [
      "Aarav Kapoor", "Bharat Rani", "Chirag Kapoor", "Deepak Dutta", "Dinesh Joshi",
      "Eeshan Reddy", "Firoz Pillai", "Firoz Sarin", "Gautam Jain", "Harsh Patel",
      "Ishaan Kumar", "Jatin Singh", "Karan Verma", "Lakshmi Nair", "Manish Gupta",
      "Neha Sharma", "Omkar Desai", "Priya Agarwal", "Rahul Mehta", "Sneha Joshi",
      "Tushar Shah", "Uma Reddy", "Vikram Pandey", "Yash Agarwal", "Zara Khan"
    ];

    const createdStudents = [];
    for (const college of createdColleges) {
      const collegeDepts = createdDepartments.filter(d => d.collegeId === college.id);
      
      for (const dept of collegeDepts) {
        // Generate students for each year (1-4) and semester (1-8)
        for (let year = 1; year <= 4; year++) {
          for (let semester = 1; semester <= 2; semester++) {
            const currentSemester = (year - 1) * 2 + semester;
            
            // Generate 30 students per year (15 boys, 15 girls)
            for (let i = 1; i <= 30; i++) {
              const studentNumber = i.toString().padStart(2, '0');
              const admissionNumber = `${college.shortName}${dept.shortName}${year}${studentNumber}`;
              
              const isMale = i <= 15;
              const nameIndex = ((year - 1) * 30 + i - 1) % studentNames.length;
              const fullName = studentNames[nameIndex];
              const [firstName, lastName] = fullName.split(' ');

              const student = await storage.createStudent({
                admissionNumber,
                firstName,
                lastName,
                email: `${admissionNumber.toLowerCase()}@${college.shortName.toLowerCase()}.edu`,
                phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                collegeId: college.id,
                departmentId: dept.id,
                year,
                semester: currentSemester,
                gender: isMale ? "Male" : "Female",
              });

              createdStudents.push(student);
            }
          }
        }
      }
    }

    console.log(`Created ${createdStudents.length} students`);

    // Generate sample faculty
    const facultyNames = [
      "Dr. Rajesh Kumar", "Dr. Priya Sharma", "Dr. Suresh Reddy", "Dr. Anjali Patel",
      "Dr. Vikram Singh", "Dr. Meera Joshi", "Dr. Ravi Agarwal", "Dr. Sunita Verma",
      "Dr. Amit Kumar", "Dr. Kavita Singh", "Dr. Rajesh Gupta", "Dr. Pooja Sharma"
    ];

    const createdFaculty = [];
    for (const college of createdColleges) {
      const collegeDepts = createdDepartments.filter(d => d.collegeId === college.id);
      
      for (const dept of collegeDepts) {
        // Generate 3-5 faculty per department
        const facultyCount = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 1; i <= facultyCount; i++) {
          const facultyNumber = `${college.shortName}${dept.shortName}F2020-${(20000 + i).toString()}`;
          const nameIndex = (createdFaculty.length) % facultyNames.length;
          const fullName = facultyNames[nameIndex];
          const [title, firstName, lastName] = fullName.split(' ');

          const faculty = await storage.createFaculty({
            facultyNumber,
            firstName: `${title} ${firstName}`,
            lastName,
            email: `${facultyNumber.toLowerCase()}@${college.shortName.toLowerCase()}.edu`,
            phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            collegeId: college.id,
            departmentId: dept.id,
            designation: ["Professor", "Associate Professor", "Assistant Professor"][Math.floor(Math.random() * 3)],
            joinedYear: 2020 + Math.floor(Math.random() * 4),
          });

          createdFaculty.push(faculty);
        }
      }
    }

    console.log(`Created ${createdFaculty.length} faculty members`);

    // Generate sample staff
    const staffNames = [
      "Mahesh Kumar", "Thota Reddy", "Usha Devi", "Acharya Sharma",
      "Ravi Patel", "Sunita Singh", "Kumar Verma", "Priya Agarwal"
    ];

    const createdStaff = [];
    for (const college of createdColleges) {
      // Generate 5-8 staff per college
      const staffCount = Math.floor(Math.random() * 4) + 5;
      
      for (let i = 1; i <= staffCount; i++) {
        const staffNumber = `${college.shortName}STAFF2020-${(30000 + i).toString()}`;
        const nameIndex = (createdStaff.length) % staffNames.length;
        const fullName = staffNames[nameIndex];
        const [firstName, lastName] = fullName.split(' ');

        const staff = await storage.createStaff({
          staffNumber,
          firstName,
          lastName,
          email: `${staffNumber.toLowerCase()}@${college.shortName.toLowerCase()}.edu`,
          phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          collegeId: college.id,
          departmentId: createdDepartments.find(d => d.collegeId === college.id)?.id || createdDepartments[0].id,
          designation: ["Admin", "Accountant", "Librarian", "Clerk", "Peon"][Math.floor(Math.random() * 5)],
          joinedYear: 2020 + Math.floor(Math.random() * 4),
        });

        createdStaff.push(staff);
      }
    }

    console.log(`Created ${createdStaff.length} staff members`);

    // Generate sample attendance records for the last 30 days
    const attendanceRecords = [];
    const today = new Date();
    
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Generate attendance for students
      for (const student of createdStudents.slice(0, 100)) { // Limit to first 100 students for performance
        const isPresent = Math.random() > 0.1; // 90% attendance rate
        const morningAttendance = isPresent ? "Present" : (Math.random() > 0.5 ? "Absent" : "Off-day");
        const eveningAttendance = isPresent ? "Present" : (Math.random() > 0.5 ? "Absent" : "Off-day");

        attendanceRecords.push({
          studentId: student.id,
          date,
          isPresent,
          morningAttendance,
          eveningAttendance,
          remarks: isPresent ? "" : "Absent without leave",
          uploadedBy: "system", // System generated
        });
      }

      // Generate attendance for faculty
      for (const faculty of createdFaculty.slice(0, 50)) { // Limit to first 50 faculty
        const isPresent = Math.random() > 0.05; // 95% attendance rate
        const morningAttendance = isPresent ? "Present" : (Math.random() > 0.5 ? "Absent" : "Off-day");
        const eveningAttendance = isPresent ? "Present" : (Math.random() > 0.5 ? "Absent" : "Off-day");

        attendanceRecords.push({
          facultyId: faculty.id,
          date,
          isPresent,
          morningAttendance,
          eveningAttendance,
          remarks: isPresent ? "" : "On leave",
          uploadedBy: "system",
        });
      }

      // Generate attendance for staff
      for (const staff of createdStaff.slice(0, 30)) { // Limit to first 30 staff
        const isPresent = Math.random() > 0.05; // 95% attendance rate
        const morningAttendance = isPresent ? "Present" : (Math.random() > 0.5 ? "Absent" : "Off-day");

        attendanceRecords.push({
          staffId: staff.id,
          date,
          isPresent,
          morningAttendance,
          remarks: isPresent ? "" : "On leave",
          uploadedBy: "system",
        });
      }
    }

    // Batch create attendance records
    if (attendanceRecords.length > 0) {
      await storage.createAttendance(attendanceRecords);
      console.log(`Created ${attendanceRecords.length} attendance records`);
    }

    // Generate sample marks records
    const subjects = [
      "Mathematics", "Physics", "Chemistry", "Computer Programming", "Data Structures",
      "Algorithms", "Database Systems", "Operating Systems", "Computer Networks", "Software Engineering"
    ];

    const marksRecords = [];
    for (const student of createdStudents.slice(0, 200)) { // Limit to first 200 students
      for (let semester = 1; semester <= student.semester; semester++) {
        for (const subject of subjects.slice(0, 5)) { // 5 subjects per semester
          const marksObtained = Math.floor(Math.random() * 40) + 20; // 20-60 marks
          const totalMarks = 100;
          const isPassed = marksObtained >= 40;

          marksRecords.push({
            studentId: student.id,
            subject,
            subjectCode: `${subject.substring(0, 3).toUpperCase()}${semester}01`,
            subjectName: subject,
            semester,
            examType: ["Mid1", "Mid2", "Final"][Math.floor(Math.random() * 3)],
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
      }
    }

    // Batch create marks records
    if (marksRecords.length > 0) {
      await storage.createMarks(marksRecords);
      console.log(`Created ${marksRecords.length} marks records`);
    }

    console.log("Sample data initialization completed successfully!");
    return {
      colleges: createdColleges,
      departments: createdDepartments,
      students: createdStudents,
      faculty: createdFaculty,
      staff: createdStaff,
    };

  } catch (error) {
    console.error("Error initializing sample data:", error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeSampleData()
    .then(() => {
      console.log("Database initialization completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database initialization failed:", error);
      process.exit(1);
    });
}

