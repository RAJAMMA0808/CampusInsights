import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCheck, 
  UserX, 
  Users, 
  GraduationCap, 
  Trophy, 
  TrendingUp,
  Building2,
  Download,
  FileSpreadsheet,
  Search,
  BarChart3,
  PieChart
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CollegeKPIs {
  studentsPresent: number;
  studentsAbsent: number;
  facultyPresent: number;
  facultyAbsent: number;
  staffPresent: number;
  staffAbsent: number;
  passPercentage: number;
  totalStudents: number;
  totalFaculty: number;
  totalStaff: number;
}

interface College {
  id: string;
  name: string;
  shortName: string;
}

export default function ComprehensiveDashboard() {
  const [selectedCollege, setSelectedCollege] = useState<string>("all");
  const [selectedView, setSelectedView] = useState<"overview" | "college-wise">("overview");

  // Fetch colleges
  const { data: colleges } = useQuery({
    queryKey: ["/api/colleges"],
  });

  // Fetch all colleges KPIs (for chairman overview)
  const { data: allCollegesKPIs, isLoading: allKPIsLoading } = useQuery({
    queryKey: ["/api/dashboard/kpis"],
    enabled: selectedCollege === "all",
  });

  // Fetch specific college KPIs
  const { data: collegeKPIs, isLoading: collegeKPIsLoading } = useQuery({
    queryKey: ["/api/colleges", selectedCollege, "kpis"],
    enabled: selectedCollege !== "all",
  });

  const currentKPIs = selectedCollege === "all" ? allCollegesKPIs : collegeKPIs;
  const isLoading = selectedCollege === "all" ? allKPIsLoading : collegeKPIsLoading;

  const calculateAttendancePercentage = (present: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Chairman Dashboard</h2>
          <Badge variant="outline" className="text-sm">
            <Building2 className="w-4 h-4 mr-1" />
            All 3 Colleges Access
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCollege} onValueChange={setSelectedCollege}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select College" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges Overview</SelectItem>
              {colleges?.map((college: College) => (
                <SelectItem key={college.id} value={college.id}>
                  {college.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as "overview" | "college-wise")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview Dashboard</TabsTrigger>
          <TabsTrigger value="college-wise">College-wise Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* All Colleges Overview */}
          {selectedCollege === "all" && (
            <div className="space-y-6">
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {isLoading ? "..." : currentKPIs?.totalStudents || 0}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Across all 3 colleges
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Faculty</p>
                        <p className="text-2xl font-bold text-green-600">
                          {isLoading ? "..." : currentKPIs?.totalFaculty || 0}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Teaching staff
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {isLoading ? "..." : currentKPIs?.totalStaff || 0}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Administrative staff
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pass Percentage</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {isLoading ? "..." : `${currentKPIs?.passPercentage?.toFixed(1) || 0}%`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Overall performance
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Students Attendance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Students Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Present Today</span>
                      <span className="font-semibold text-green-600">
                        {isLoading ? "..." : currentKPIs?.studentsPresent || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Absent Today</span>
                      <span className="font-semibold text-red-600">
                        {isLoading ? "..." : currentKPIs?.studentsAbsent || 0}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance Rate</span>
                        <span className={getAttendanceColor(
                          calculateAttendancePercentage(
                            currentKPIs?.studentsPresent || 0,
                            (currentKPIs?.studentsPresent || 0) + (currentKPIs?.studentsAbsent || 0)
                          )
                        )}>
                          {isLoading ? "..." : `${calculateAttendancePercentage(
                            currentKPIs?.studentsPresent || 0,
                            (currentKPIs?.studentsPresent || 0) + (currentKPIs?.studentsAbsent || 0)
                          )}%`}
                        </span>
                      </div>
                      <Progress 
                        value={calculateAttendancePercentage(
                          currentKPIs?.studentsPresent || 0,
                          (currentKPIs?.studentsPresent || 0) + (currentKPIs?.studentsAbsent || 0)
                        )} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Faculty Attendance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Faculty Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Present Today</span>
                      <span className="font-semibold text-green-600">
                        {isLoading ? "..." : currentKPIs?.facultyPresent || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Absent Today</span>
                      <span className="font-semibold text-red-600">
                        {isLoading ? "..." : currentKPIs?.facultyAbsent || 0}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance Rate</span>
                        <span className={getAttendanceColor(
                          calculateAttendancePercentage(
                            currentKPIs?.facultyPresent || 0,
                            (currentKPIs?.facultyPresent || 0) + (currentKPIs?.facultyAbsent || 0)
                          )
                        )}>
                          {isLoading ? "..." : `${calculateAttendancePercentage(
                            currentKPIs?.facultyPresent || 0,
                            (currentKPIs?.facultyPresent || 0) + (currentKPIs?.facultyAbsent || 0)
                          )}%`}
                        </span>
                      </div>
                      <Progress 
                        value={calculateAttendancePercentage(
                          currentKPIs?.facultyPresent || 0,
                          (currentKPIs?.facultyPresent || 0) + (currentKPIs?.facultyAbsent || 0)
                        )} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Staff Attendance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Staff Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Present Today</span>
                      <span className="font-semibold text-green-600">
                        {isLoading ? "..." : currentKPIs?.staffPresent || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Absent Today</span>
                      <span className="font-semibold text-red-600">
                        {isLoading ? "..." : currentKPIs?.staffAbsent || 0}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance Rate</span>
                        <span className={getAttendanceColor(
                          calculateAttendancePercentage(
                            currentKPIs?.staffPresent || 0,
                            (currentKPIs?.staffPresent || 0) + (currentKPIs?.staffAbsent || 0)
                          )
                        )}>
                          {isLoading ? "..." : `${calculateAttendancePercentage(
                            currentKPIs?.staffPresent || 0,
                            (currentKPIs?.staffPresent || 0) + (currentKPIs?.staffAbsent || 0)
                          )}%`}
                        </span>
                      </div>
                      <Progress 
                        value={calculateAttendancePercentage(
                          currentKPIs?.staffPresent || 0,
                          (currentKPIs?.staffPresent || 0) + (currentKPIs?.staffAbsent || 0)
                        )} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Academic Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pass Percentage</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {isLoading ? "..." : `${currentKPIs?.passPercentage?.toFixed(1) || 0}%`}
                      </span>
                    </div>
                    <Progress 
                      value={currentKPIs?.passPercentage || 0} 
                      className="h-3"
                    />
                    <div className="text-xs text-muted-foreground">
                      Based on all semester results across all colleges
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Search className="w-4 h-4 mr-2" />
                      Search Student by Admission Number
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Upload Attendance Data
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Individual College View */}
          {selectedCollege !== "all" && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">
                  {colleges?.find((c: College) => c.id === selectedCollege)?.name} Dashboard
                </h3>
                <p className="text-muted-foreground">
                  Detailed view for the selected college
                </p>
              </div>
              {/* Similar structure as all colleges but for individual college */}
            </div>
          )}
        </TabsContent>

        <TabsContent value="college-wise" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {colleges?.map((college: College) => (
              <Card key={college.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {college.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {college.shortName}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setSelectedCollege(college.id)}
                    >
                      View Detailed Dashboard
                    </Button>
                    <div className="text-xs text-muted-foreground text-center">
                      Click to view college-specific metrics
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

