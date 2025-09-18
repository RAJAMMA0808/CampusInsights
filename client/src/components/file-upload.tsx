import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";

interface FileUploadProps {
  onClose: () => void;
}

export default function FileUpload({ onClose }: FileUploadProps) {
  const [uploadType, setUploadType] = useState<"attendance" | "marks">("attendance");
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: string }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/upload/${type}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Upload failed");
      }

      return await response.json();
    },
    onSuccess: (result) => {
      setUploadResult(result);
      toast({
        title: "Upload successful",
        description: `${result.recordsCreated} records were created successfully`,
      });
      // Invalidate KPIs to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/kpis"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ file, type: uploadType });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="dialog-file-upload">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Data Files</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="uploadType">Data Type</Label>
            <Select value={uploadType} onValueChange={(value: any) => setUploadType(value)}>
              <SelectTrigger data-testid="select-upload-type">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance Data</SelectItem>
                <SelectItem value="marks">Marks Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file">Excel File</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              data-testid="input-file"
            />
            <div className="text-sm text-muted-foreground">
              Select an Excel file (.xlsx or .xls) containing {uploadType} data
            </div>
          </div>

          {/* Expected Format Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Expected Format</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {uploadType === "attendance" ? (
                <div>
                  <p className="font-medium mb-2">Attendance file should contain:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>admissionNumber - Student admission number</li>
                    <li>date - Date in YYYY-MM-DD format</li>
                    <li>isPresent - true/false or 1/0</li>
                    <li>remarks - Optional remarks</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-2">Marks file should contain:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>admissionNumber - Student admission number</li>
                    <li>subject - Subject name</li>
                    <li>semester - Semester number (1-8)</li>
                    <li>marksObtained - Marks obtained</li>
                    <li>totalMarks - Total marks</li>
                    <li>grade - Grade (optional)</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Result */}
          {uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-chart-2" />
                  <span>Upload Result</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Records Processed:</span>
                  <span className="font-medium" data-testid="upload-processed">{uploadResult.recordsProcessed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Records Created:</span>
                  <span className="font-medium text-chart-2" data-testid="upload-created">{uploadResult.recordsCreated}</span>
                </div>
                {uploadResult.errors?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Errors:</span>
                      <span className="font-medium text-chart-4" data-testid="upload-errors">{uploadResult.errors.length}</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {uploadResult.errors.map((error: string, index: number) => (
                        <div key={index} className="text-xs text-chart-4 flex items-start space-x-1">
                          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel-upload">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploadMutation.isPending}
              data-testid="button-submit-upload"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
