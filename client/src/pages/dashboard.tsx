import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import CollegeCard from "@/components/college-card";
import StudentSearch from "@/components/student-search";
import FileUpload from "@/components/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Users, SearchSlash, Trophy, Bell, Settings, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedCollege, setSelectedCollege] = useState<string>("all");
  const [showUpload, setShowUpload] = useState(false);

  // Fetch dashboard KPIs
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["/api/dashboard/kpis", selectedCollege === "all" ? undefined : selectedCollege],
    enabled: !!user,
  });

  // Fetch colleges
  const { data: colleges } = useQuery({
    queryKey: ["/api/colleges"],
    enabled: !!user,
  });

  if (!user) return null;

  const isChairman = user.role === "chairman";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50" data-testid="button-mobile-menu">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 ml-12 lg:ml-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
                  {user.role === "chairman" ? "Chairman Dashboard" : 
                   user.role === "hod" ? "HOD Dashboard" : "Staff Dashboard"}
                </h1>
                <Badge variant="secondary" data-testid="badge-role">
                  {user.role === "chairman" ? "Chairman Access" : 
                   user.role === "hod" ? "HOD Access" : "Staff Access"}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* College Filter - Only for Chairman */}
              {isChairman && (
                <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                  <SelectTrigger className="w-48" data-testid="select-college-filter">
                    <SelectValue placeholder="Select College" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    {colleges?.map((college: any) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" data-testid="button-settings">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Global KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Students Present</p>
                    <p className="text-2xl font-bold text-chart-2" data-testid="kpi-students-present">
                      {kpisLoading ? "..." : kpis?.studentsPresent || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-chart-2">↗ 2.3%</span> from yesterday
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Students Absent</p>
                    <p className="text-2xl font-bold text-chart-4" data-testid="kpi-students-absent">
                      {kpisLoading ? "..." : kpis?.studentsAbsent || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-chart-4">↘ 1.1%</span> from yesterday
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <UserX className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Faculty Present</p>
                    <p className="text-2xl font-bold text-chart-2" data-testid="kpi-faculty-present">
                      {kpisLoading ? "..." : kpis?.facultyPresent || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-chart-2">↗ 0.5%</span> from yesterday
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Faculty Absent</p>
                    <p className="text-2xl font-bold text-chart-4" data-testid="kpi-faculty-absent">
                      {kpisLoading ? "..." : kpis?.facultyAbsent || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-chart-2">↘ 0.2%</span> from yesterday
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <SearchSlash className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pass Percentage</p>
                    <p className="text-2xl font-bold text-chart-1" data-testid="kpi-pass-percentage">
                      {kpisLoading ? "..." : `${kpis?.passPercentage?.toFixed(1) || 0}%`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-chart-2">↗ 1.8%</span> from last semester
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-chart-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* College Cards - Only for Chairman */}
          {isChairman && selectedCollege === "all" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {colleges?.map((college: any) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}

          {/* Student Search and File Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudentSearch />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowUpload(true)}
                  data-testid="button-upload-data"
                >
                  Upload Data Files
                </Button>
                <div className="text-sm text-muted-foreground">
                  Upload attendance and marks data from Excel files
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Upload Modal */}
          {showUpload && (
            <FileUpload onClose={() => setShowUpload(false)} />
          )}
        </main>
      </div>
    </div>
  );
}
