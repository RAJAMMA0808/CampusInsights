import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  FileSpreadsheet, 
  Archive,
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExportOptions {
  dataTypes: string[];
  colleges: string[];
  dateRange: {
    start: string;
    end: string;
  };
  format: "excel" | "csv";
  includeCharts: boolean;
}

export default function DataExport() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    dataTypes: [],
    colleges: [],
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0], // today
    },
    format: "excel",
    includeCharts: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  // Fetch colleges for selection
  const { data: colleges } = useQuery({
    queryKey: ["/api/colleges"],
  });

  const dataTypeOptions = [
    { id: "students", label: "Students Data", icon: Users, description: "Student information and enrollment data" },
    { id: "attendance", label: "Attendance Records", icon: Calendar, description: "Daily attendance for students, faculty, and staff" },
    { id: "marks", label: "Marks & Grades", icon: BookOpen, description: "Academic performance and examination results" },
    { id: "faculty", label: "Faculty Data", icon: GraduationCap, description: "Faculty information and teaching records" },
    { id: "staff", label: "Staff Data", icon: Users, description: "Administrative staff information" },
    { id: "reports", label: "Analytics Reports", icon: BarChart3, description: "Performance metrics and statistical reports" },
  ];

  const handleDataTypeToggle = (dataType: string) => {
    setExportOptions(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dataType)
        ? prev.dataTypes.filter(type => type !== dataType)
        : [...prev.dataTypes, dataType]
    }));
  };

  const handleCollegeToggle = (collegeId: string) => {
    setExportOptions(prev => ({
      ...prev,
      colleges: prev.colleges.includes(collegeId)
        ? prev.colleges.filter(id => id !== collegeId)
        : [...prev.colleges, collegeId]
    }));
  };

  const handleExport = async () => {
    if (exportOptions.dataTypes.length === 0) {
      alert("Please select at least one data type to export");
      return;
    }

    setIsExporting(true);
    try {
      const endpoint = exportOptions.format === "excel" ? "/api/export/data" : "/api/export/zip";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportOptions),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campus-data-export-${new Date().toISOString().split('T')[0]}.${exportOptions.format === "excel" ? "xlsx" : "zip"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = async (templateType: string) => {
    try {
      if (templateType === "all") {
        // Download all templates as ZIP
        const response = await fetch("/api/templates/download");
        if (!response.ok) throw new Error("Template download failed");
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "campus-templates.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Download individual template files
        const templates = {
          attendance: "/templates/attendance_template.xlsx",
          marks: "/templates/marks_template.xlsx",
          students: "/templates/students_template.xlsx",
        };

        const url = templates[templateType as keyof typeof templates];
        if (url) {
          const a = document.createElement("a");
          a.href = url;
          a.download = `${templateType}_template.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    } catch (error) {
      console.error("Template download error:", error);
      alert("Template download failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export & Download
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Type Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Data Types to Export</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      exportOptions.dataTypes.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleDataTypeToggle(option.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={exportOptions.dataTypes.includes(option.id)}
                        onChange={() => handleDataTypeToggle(option.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* College Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Colleges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  exportOptions.colleges.length === 0
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setExportOptions(prev => ({ ...prev, colleges: [] }))}
              >
                <div className="flex items-center gap-2">
                  <Checkbox checked={exportOptions.colleges.length === 0} />
                  <span className="font-medium">All Colleges</span>
                </div>
              </div>
              {colleges?.map((college: any) => (
                <div
                  key={college.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    exportOptions.colleges.includes(college.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleCollegeToggle(college.id)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={exportOptions.colleges.includes(college.id)} />
                    <span className="font-medium">{college.shortName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Export Format</h3>
              <Select
                value={exportOptions.format}
                onValueChange={(value: "excel" | "csv") =>
                  setExportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      ZIP Archive (.zip)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Date Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    value={exportOptions.dateRange.start}
                    onChange={(e) =>
                      setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    value={exportOptions.dateRange.end}
                    onChange={(e) =>
                      setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleExport}
              disabled={isExporting || exportOptions.dataTypes.length === 0}
              size="lg"
              className="min-w-48"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>

          {/* Template Downloads */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Download Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => handleDownloadTemplate("attendance")}
                className="justify-start"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Attendance Template
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownloadTemplate("marks")}
                className="justify-start"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Marks Template
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownloadTemplate("students")}
                className="justify-start"
              >
                <Users className="w-4 h-4 mr-2" />
                Students Template
              </Button>
              <Button
                variant="default"
                onClick={() => handleDownloadTemplate("all")}
                className="justify-start"
              >
                <Archive className="w-4 h-4 mr-2" />
                All Templates (ZIP)
              </Button>
            </div>
          </div>

          {/* Export Summary */}
          {exportOptions.dataTypes.length > 0 && (
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                <strong>Export Summary:</strong> {exportOptions.dataTypes.length} data type(s) selected
                {exportOptions.colleges.length > 0 && `, ${exportOptions.colleges.length} college(s)`}
                {exportOptions.colleges.length === 0 && ", all colleges"}
                . Format: {exportOptions.format.toUpperCase()}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
