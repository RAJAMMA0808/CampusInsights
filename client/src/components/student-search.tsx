import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, GraduationCap, History, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface StudentProfile {
  student: {
    id: string;
    admissionNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    year: number;
  };
  attendanceRate: number;
  cgpa: number;
  totalCredits: number;
}

export default function StudentSearch() {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: async (admissionNumber: string) => {
      const response = await apiRequest("GET", `/api/students/${admissionNumber}`);
      return await response.json();
    },
    onSuccess: (data) => {
      setStudentProfile(data);
      // Invalidate audit logs to refresh the recent searches
      queryClient.invalidateQueries({ queryKey: ["/api/audit-logs"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Student not found",
        description: error.message,
        variant: "destructive",
      });
      setStudentProfile(null);
    },
  });

  const handleSearch = () => {
    if (!admissionNumber.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter an admission number",
        variant: "destructive",
      });
      return;
    }
    searchMutation.mutate(admissionNumber.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Student Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Student Lookup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter Admission Number (e.g., KCSE202045)"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="input-admission-number"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={searchMutation.isPending}
              data-testid="button-search-student"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Format examples:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>BGIIG: GCSE202045 (CSE), GAIML202030 (AI/ML)</li>
              <li>BIET: BCSE202045 (CSE), BAIML202030 (AI/ML)</li>
              <li>KNRCER: KCSE202045 (CSE), KAIML202030 (AI/ML)</li>
            </ul>
          </div>
          
          {/* Recent Search Info */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center text-xs text-muted-foreground">
              <History className="h-4 w-4 mr-2" />
              <span>Searches are logged for audit purposes</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Student Profile Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Student Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {searchMutation.isPending ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Searching for student...</p>
            </div>
          ) : studentProfile ? (
            <div className="space-y-4">
              {/* Student Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground" data-testid="student-name">
                      {studentProfile.student.firstName} {studentProfile.student.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid="student-admission-number">
                      {studentProfile.student.admissionNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span data-testid="student-department">{studentProfile.student.department}</span> • 
                      <span data-testid="student-year"> Year {studentProfile.student.year}</span>
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" data-testid="student-status">Active</Badge>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-bold text-chart-2" data-testid="student-attendance-rate">
                    {studentProfile.attendanceRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-chart-1" data-testid="student-cgpa">
                    {studentProfile.cgpa.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">CGPA</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-chart-3" data-testid="student-credits">
                    {studentProfile.totalCredits}
                  </p>
                  <p className="text-xs text-muted-foreground">Credits</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1" variant="default" data-testid="button-view-details">
                  View Details
                </Button>
                <Button className="flex-1" variant="outline" data-testid="button-download-report">
                  <Download className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Search for a student by admission number to view their profile</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
