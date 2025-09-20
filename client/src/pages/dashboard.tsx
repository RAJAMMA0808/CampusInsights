import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import CollegeCard from "@/components/college-card";
import StudentSearch from "@/components/student-search";
import StudentSearchEnhanced from "@/components/student-search-enhanced";
import ComprehensiveDashboard from "@/components/comprehensive-dashboard";
import DataExport from "@/components/data-export";
import FileUpload from "@/components/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, UserX, Users, SearchSlash, Trophy, Bell, Settings, Menu, Download, Search, BarChart3 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedCollege, setSelectedCollege] = useState<string>("all");
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

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
        <main className="flex-1 p-4 lg:p-6">
          {isChairman ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Student Search
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Data Export
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Upload Data
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6">
                <ComprehensiveDashboard />
              </TabsContent>

              <TabsContent value="search" className="mt-6">
                <StudentSearchEnhanced />
              </TabsContent>

              <TabsContent value="export" className="mt-6">
                <DataExport />
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Data Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FileUpload onClose={() => {}} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            // Non-chairman users see limited dashboard
            <div className="space-y-6">
              {/* Limited KPIs for HOD/Staff */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Student Search for HOD/Staff */}
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
