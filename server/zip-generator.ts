import * as XLSX from "xlsx";
import * as JSZip from "jszip";
import { storage } from "./storage";

export interface ZipExportOptions {
  dataTypes: string[];
  colleges: string[];
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
}

export async function generateZipExport(options: ZipExportOptions): Promise<Buffer> {
  const zip = new JSZip();

  // Create Excel files for each data type
  for (const dataType of options.dataTypes) {
    const workbook = XLSX.utils.book_new();
    let sheetData = [];
    let sheetName = "";

    switch (dataType) {
      case "students":
        sheetName = "Students";
        const students = await storage.getStudents(
          options.colleges.length > 0 ? options.colleges[0] : undefined
        );
        sheetData = students.map(student => ({
          "Admission Number": student.admissionNumber,
          "First Name": student.firstName,
          "Last Name": student.lastName,
          "Email": student.email || "",
          "Phone": student.phone || "",
          "Year": student.year,
          "Semester": student.semester,
          "Gender": student.gender,
          "College ID": student.collegeId,
          "Department ID": student.departmentId,
          "Created At": student.createdAt
        }));
        break;

      case "attendance":
        sheetName = "Attendance";
        const attendance = await storage.getAttendance();
        sheetData = attendance.map(record => ({
          "Date": record.date,
          "Student ID": record.studentId || "",
          "Faculty ID": record.facultyId || "",
          "Staff ID": record.staffId || "",
          "Is Present": record.isPresent ? "Yes" : "No",
          "Morning Attendance": record.morningAttendance || "",
          "Evening Attendance": record.eveningAttendance || "",
          "Remarks": record.remarks || "",
          "Uploaded By": record.uploadedBy,
          "Created At": record.createdAt
        }));
        break;

      case "marks":
        sheetName = "Marks";
        const marks = await storage.getMarks();
        sheetData = marks.map(mark => ({
          "Student ID": mark.studentId,
          "Subject": mark.subject,
          "Subject Code": mark.subjectCode || "",
          "Subject Name": mark.subjectName || "",
          "Semester": mark.semester,
          "Exam Type": mark.examType || "",
          "Marks Obtained": mark.marksObtained,
          "Total Marks": mark.totalMarks,
          "Grade": mark.grade || "",
          "Is Passed": mark.isPassed ? "Yes" : "No",
          "Uploaded By": mark.uploadedBy,
          "Created At": mark.createdAt
        }));
        break;

      case "faculty":
        sheetName = "Faculty";
        const faculty = await storage.getFaculty(
          options.colleges.length > 0 ? options.colleges[0] : undefined
        );
        sheetData = faculty.map(member => ({
          "Faculty Number": member.facultyNumber,
          "First Name": member.firstName,
          "Last Name": member.lastName,
          "Email": member.email || "",
          "Phone": member.phone || "",
          "Designation": member.designation || "",
          "Joined Year": member.joinedYear,
          "College ID": member.collegeId,
          "Department ID": member.departmentId,
          "Created At": member.createdAt
        }));
        break;

      case "staff":
        sheetName = "Staff";
        const staff = await storage.getStaff(
          options.colleges.length > 0 ? options.colleges[0] : undefined
        );
        sheetData = staff.map(member => ({
          "Staff Number": member.staffNumber,
          "First Name": member.firstName,
          "Last Name": member.lastName,
          "Email": member.email || "",
          "Phone": member.phone || "",
          "Designation": member.designation || "",
          "Joined Year": member.joinedYear,
          "College ID": member.collegeId,
          "Department ID": member.departmentId,
          "Created At": member.createdAt
        }));
        break;

      case "reports":
        sheetName = "Analytics";
        const kpis = await storage.getDashboardKPIs(
          options.colleges.length > 0 ? options.colleges[0] : undefined
        );
        sheetData = [{
          "Students Present": kpis.studentsPresent,
          "Students Absent": kpis.studentsAbsent,
          "Faculty Present": kpis.facultyPresent,
          "Faculty Absent": kpis.facultyAbsent,
          "Staff Present": kpis.staffPresent,
          "Staff Absent": kpis.staffAbsent,
          "Pass Percentage": kpis.passPercentage,
          "Total Students": kpis.totalStudents,
          "Total Faculty": kpis.totalFaculty,
          "Total Staff": kpis.totalStaff
        }];
        break;
    }

    if (sheetData.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      // Convert workbook to buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      // Add to zip
      zip.file(`${dataType}_data.xlsx`, buffer);
    }
  }

  // Add README file
  const readmeContent = `
# Campus Insights Data Export

## Export Information
- Export Date: ${new Date().toISOString()}
- Data Types: ${options.dataTypes.join(', ')}
- Colleges: ${options.colleges.length > 0 ? options.colleges.join(', ') : 'All Colleges'}
- Date Range: ${options.dateRange.start} to ${options.dateRange.end}

## File Contents
${options.dataTypes.map(type => `- ${type}_data.xlsx: ${type} information`).join('\n')}

## Data Format
All Excel files contain structured data with appropriate headers and formatting.

## Contact
For questions about this data export, please contact the system administrator.
`;

  zip.file("README.txt", readmeContent);

  // Generate zip buffer
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  return zipBuffer;
}

export async function generateTemplateZip(): Promise<Buffer> {
  const zip = new JSZip();

  // Attendance template
  const attendanceTemplate = [
    {
      "CollegeCode": "KNRCER",
      "ProgramCode": "CSE", 
      "AdmissionNumber": "KCSE202001",
      "StudentName": "Aarav Kapoor",
      "Gender": "M",
      "Semester": 1,
      "Date": "2025-01-15",
      "MorningAttendance": "Present",
      "EveningAttendance": "Present"
    }
  ];

  const attendanceWorkbook = XLSX.utils.book_new();
  const attendanceSheet = XLSX.utils.json_to_sheet(attendanceTemplate);
  XLSX.utils.book_append_sheet(attendanceWorkbook, attendanceSheet, "Attendance");
  const attendanceBuffer = XLSX.write(attendanceWorkbook, { type: 'buffer', bookType: 'xlsx' });
  zip.file("attendance_template.xlsx", attendanceBuffer);

  // Marks template
  const marksTemplate = [
    {
      "CollegeCode": "KNRCER",
      "ProgramCode": "CSE",
      "AdmissionNumber": "KCSE202001", 
      "StudentName": "Aarav Kapoor",
      "Gender": "M",
      "Semester": 1,
      "SubjectCode": "CSE101",
      "SubjectName": "Mathematics",
      "ExamType": "Mid1",
      "MarksObtained": 28,
      "MaxMarks": 40
    }
  ];

  const marksWorkbook = XLSX.utils.book_new();
  const marksSheet = XLSX.utils.json_to_sheet(marksTemplate);
  XLSX.utils.book_append_sheet(marksWorkbook, marksSheet, "Marks");
  const marksBuffer = XLSX.write(marksWorkbook, { type: 'buffer', bookType: 'xlsx' });
  zip.file("marks_template.xlsx", marksBuffer);

  // Students template
  const studentsTemplate = [
    {
      "AdmissionNumber": "KCSE202001",
      "FirstName": "Aarav",
      "LastName": "Kapoor", 
      "Email": "kcse202001@knrcer.edu",
      "Phone": "+919876543210",
      "Year": 1,
      "Semester": 1,
      "Gender": "Male",
      "CollegeId": "college-id",
      "DepartmentId": "dept-id"
    }
  ];

  const studentsWorkbook = XLSX.utils.book_new();
  const studentsSheet = XLSX.utils.json_to_sheet(studentsTemplate);
  XLSX.utils.book_append_sheet(studentsWorkbook, studentsSheet, "Students");
  const studentsBuffer = XLSX.write(studentsWorkbook, { type: 'buffer', bookType: 'xlsx' });
  zip.file("students_template.xlsx", studentsBuffer);

  // Add template instructions
  const instructionsContent = `
# Campus Insights Data Templates

## Available Templates

### 1. attendance_template.xlsx
Use this template to upload daily attendance records.
Required columns:
- CollegeCode: College identifier (KNRCER, BIET, BGIIG)
- ProgramCode: Department code (CSE, ECE, EEE, etc.)
- AdmissionNumber: Student admission number
- StudentName: Full student name
- Gender: M/F
- Semester: Current semester (1-8)
- Date: Attendance date (YYYY-MM-DD)
- MorningAttendance: Present/Absent/Off-day
- EveningAttendance: Present/Absent/Off-day

### 2. marks_template.xlsx
Use this template to upload student marks and grades.
Required columns:
- CollegeCode: College identifier
- ProgramCode: Department code
- AdmissionNumber: Student admission number
- StudentName: Full student name
- Gender: M/F
- Semester: Current semester (1-8)
- SubjectCode: Subject code (e.g., CSE101)
- SubjectName: Subject name
- ExamType: Mid1/Mid2/Final
- MarksObtained: Marks scored
- MaxMarks: Maximum marks

### 3. students_template.xlsx
Use this template to upload student information.
Required columns:
- AdmissionNumber: Unique admission number
- FirstName: Student first name
- LastName: Student last name
- Email: Student email
- Phone: Contact number
- Year: Academic year (1-4)
- Semester: Current semester (1-8)
- Gender: Male/Female
- CollegeId: College identifier
- DepartmentId: Department identifier

## Usage Instructions
1. Download the appropriate template
2. Fill in the data following the format
3. Upload the completed file through the system interface
4. The system will validate and process the data

## Data Validation
- All required fields must be filled
- Date formats must be YYYY-MM-DD
- Admission numbers must be unique
- Email addresses must be valid format
- Phone numbers should include country code

## Support
For technical support, contact the system administrator.
`;

  zip.file("TEMPLATE_INSTRUCTIONS.txt", instructionsContent);

  // Generate zip buffer
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  return zipBuffer;
}

