import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  User, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  FileText,
  Download
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StudentProfile {
  student: {
    id: string;
    admissionNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    collegeId: string;
    departmentId: string;
    year: number;
    semester: number;
    gender: string;
  };
  attendanceRate: number;
  cgpa: number;
  totalCredits: number;
  recentAttendance: Array<{
    id: string;
    date: string;
    isPresent: boolean;
    remarks?: string;
  }>;
  recentMarks: Array<{
    id: string;
    subject: string;
    subjectCode?: string;
    subjectName?: string;
    semester: number;
    examType?: string;
    marksObtained: string;
    totalMarks: string;
    grade?: string;
    isPassed: boolean;
    createdAt: string;
  }>;
}

export default function StudentSearchEnhanced() {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const { data: studentProfile, isLoading, error } = useQuery({
    queryKey: ["/api/students", admissionNumber],
    enabled: searchPerformed && admissionNumber.length > 0,
  });

  const handleSearch = () => {
    if (admissionNumber.trim()) {
      setSearchPerformed(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return "text-gray-600";
    const gradeValue = grade.toUpperCase();
    if (gradeValue === "A" || gradeValue === "A+") return "text-green-600";
    if (gradeValue === "B" || gradeValue === "B+") return "text-blue-600";
    if (gradeValue === "C" || gradeValue === "C+") return "text-yellow-600";
    if (gradeValue === "D") return "text-orange-600";
    return "text-red-600";
  };

  const getAttendanceStatus = (isPresent: boolean) => {
    return isPresent ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Present
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Absent
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Student Search by Admission Number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter admission number (e.g., KCSE202001, AIML202101)"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!admissionNumber.trim()}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Search for any student across all 3 colleges using their admission number
          </p>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchPerformed && (
        <div className="space-y-6">
          {isLoading && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Searching for student...</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Student not found with admission number: {admissionNumber}
              </AlertDescription>
            </Alert>
          )}

          {studentProfile && (
            <div className="space-y-6">
              {/* Student Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {studentProfile.student.firstName} {studentProfile.student.lastName}
                      </h3>
                      <p className="text-muted-foreground">
                        {studentProfile.student.admissionNumber}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Year:</span>
                        <span className="font-medium">{studentProfile.student.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Semester:</span>
                        <span className="font-medium">{studentProfile.student.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Gender:</span>
                        <span className="font-medium">{studentProfile.student.gender}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {studentProfile.attendanceRate.toFixed(1)}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <Progress value={studentProfile.attendanceRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">CGPA</p>
                        <p className="text-2xl font-bold text-green-600">
                          {studentProfile.cgpa.toFixed(2)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Total Credits: {studentProfile.totalCredits}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Performance</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {studentProfile.cgpa >= 7.5 ? "Excellent" : 
                           studentProfile.cgpa >= 6.0 ? "Good" : 
                           studentProfile.cgpa >= 4.0 ? "Average" : "Needs Improvement"}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information Tabs */}
              <Tabs defaultValue="attendance" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="attendance">Recent Attendance</TabsTrigger>
                  <TabsTrigger value="marks">Recent Marks</TabsTrigger>
                </TabsList>

                <TabsContent value="attendance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Attendance Records
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {studentProfile.recentAttendance.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No attendance records found
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {studentProfile.recentAttendance.map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {getAttendanceStatus(record.isPresent)}
                                </div>
                                <div>
                                  <p className="font-medium">{formatDate(record.date)}</p>
                                  {record.remarks && (
                                    <p className="text-sm text-muted-foreground">{record.remarks}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="marks" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Recent Marks Records
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {studentProfile.recentMarks.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No marks records found
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {studentProfile.recentMarks.map((mark) => (
                            <div key={mark.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">{mark.subjectName || mark.subject}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {mark.subjectCode} • Semester {mark.semester}
                                    {mark.examType && ` • ${mark.examType}`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    {mark.marksObtained}/{mark.totalMarks}
                                  </p>
                                  <p className={`text-sm font-medium ${getGradeColor(mark.grade)}`}>
                                    {mark.grade || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge variant={mark.isPassed ? "default" : "destructive"}>
                                  {mark.isPassed ? "Passed" : "Failed"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(mark.createdAt)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

