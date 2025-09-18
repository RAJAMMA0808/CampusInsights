import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2 } from "lucide-react";
import { College } from "@shared/schema";

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  // Fetch college-specific KPIs
  const { data: kpis, isLoading } = useQuery({
    queryKey: ["/api/colleges", college.id, "kpis"],
  });

  const getGradientColor = (index: number) => {
    const colors = [
      "from-chart-1 to-chart-1/80",
      "from-chart-2 to-chart-2/80", 
      "from-chart-3 to-chart-3/80"
    ];
    return colors[index % colors.length];
  };

  const index = college.shortName === "BGIIG" ? 0 : college.shortName === "BIET" ? 1 : 2;

  return (
    <Card className="overflow-hidden" data-testid={`college-card-${college.shortName.toLowerCase()}`}>
      <div className={`bg-gradient-to-r ${getGradientColor(index)} p-6`}>
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold" data-testid={`college-name-${college.shortName.toLowerCase()}`}>
              {college.shortName}
            </h3>
            <p className="text-sm opacity-90">{college.name}</p>
          </div>
          <Building2 className="h-8 w-8 opacity-75" />
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Student Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-2" data-testid={`students-present-${college.shortName.toLowerCase()}`}>
                  {kpis?.studentsPresent || 0}
                </p>
                <p className="text-xs text-muted-foreground">Students Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-4" data-testid={`students-absent-${college.shortName.toLowerCase()}`}>
                  {kpis?.studentsAbsent || 0}
                </p>
                <p className="text-xs text-muted-foreground">Students Absent</p>
              </div>
            </div>
            
            {/* Faculty Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-chart-2" data-testid={`faculty-present-${college.shortName.toLowerCase()}`}>
                  {kpis?.facultyPresent || 0}
                </p>
                <p className="text-xs text-muted-foreground">Faculty Present</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-chart-4" data-testid={`faculty-absent-${college.shortName.toLowerCase()}`}>
                  {kpis?.facultyAbsent || 0}
                </p>
                <p className="text-xs text-muted-foreground">Faculty Absent</p>
              </div>
            </div>
            
            {/* Pass Rate */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pass Rate</span>
                <span className="text-lg font-bold text-chart-1" data-testid={`pass-rate-${college.shortName.toLowerCase()}`}>
                  {kpis?.passPercentage ? `${kpis.passPercentage.toFixed(1)}%` : "0%"}
                </span>
              </div>
              <div className="mt-2">
                <Progress 
                  value={kpis?.passPercentage || 0} 
                  className="h-2"
                />
              </div>
            </div>
            
            {/* View Details Button */}
            <Button 
              className="w-full mt-4" 
              variant="default"
              data-testid={`button-view-details-${college.shortName.toLowerCase()}`}
            >
              View Details
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
