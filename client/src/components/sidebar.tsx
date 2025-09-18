import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3, Users, UserCheck, FileUp, History, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", icon: BarChart3, href: "#", current: true },
  { name: "Students", icon: Users, href: "#", current: false },
  { name: "Faculty", icon: UserCheck, href: "#", current: false },
  { name: "Attendance", icon: UserCheck, href: "#", current: false },
  { name: "Reports", icon: BarChart3, href: "#", current: false },
  { name: "Data Upload", icon: FileUp, href: "#", current: false },
  { name: "Audit Logs", icon: History, href: "#", current: false },
];

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="flex flex-col w-64 bg-card border-r border-border h-screen">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground" data-testid="text-app-name">EduManage</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.current ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">
              {user.firstName?.[0] || user.username[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" data-testid="text-user-name">
              {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
            </p>
            <p className="text-xs text-muted-foreground truncate capitalize" data-testid="text-user-role">
              {user.role}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </aside>
  );
}
