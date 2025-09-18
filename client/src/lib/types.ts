export interface DashboardKPIs {
  studentsPresent: number;
  studentsAbsent: number;
  facultyPresent: number;
  facultyAbsent: number;
  passPercentage: number;
}

export interface StudentProfile {
  student: {
    id: string;
    admissionNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    collegeId: string;
    departmentId: string;
    year: number;
    semester: number;
    gender?: string;
    isActive: boolean;
  };
  attendanceRate: number;
  cgpa: number;
  totalCredits: number;
  recentAttendance: any[];
  recentMarks: any[];
}

export interface UploadResult {
  message: string;
  recordsProcessed: number;
  recordsCreated: number;
  errors: string[];
}
