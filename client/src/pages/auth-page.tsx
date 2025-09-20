import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "../../shared/schema";
import { z } from "zod";
import { Redirect } from "wouter";
import { GraduationCap, Building2, Users, BarChart3 } from "lucide-react";

const loginSchema = insertUserSchema.pick({ username: true, password: true });
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "staff",
      firstName: "",
      lastName: "",
      email: "",
      collegeId: "",
      departmentId: "",
    },
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterForm) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="flex flex-col justify-center px-12 py-16">
          <div className="flex items-center space-x-3 mb-8">
            <GraduationCap className="h-12 w-12" />
            <h1 className="text-4xl font-bold">EduManage</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">
            Multi-College Management System
          </h2>
          
          <p className="text-lg mb-8 opacity-90">
            Comprehensive attendance and academic management dashboard for engineering colleges.
            Role-based access for Chairman, HODs, and staff with real-time analytics.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6" />
              <span>Manage multiple college campuses</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6" />
              <span>Student & faculty attendance tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6" />
              <span>Real-time analytics and reporting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex lg:hidden items-center justify-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">EduManage</h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin 
                ? "Sign in to your account to continue" 
                : "Sign up to get started with EduManage"
              }
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? "Sign In" : "Sign Up"}</CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Enter your credentials to access the dashboard"
                  : "Fill in your details to create a new account"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      data-testid="input-username"
                      {...loginForm.register("username")}
                      placeholder="Enter your username"
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      data-testid="input-password"
                      {...loginForm.register("password")}
                      placeholder="Enter your password"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    data-testid="button-login"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        data-testid="input-firstName"
                        {...registerForm.register("firstName")}
                        placeholder="First name"
                      />
                      {registerForm.formState.errors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        data-testid="input-lastName"
                        {...registerForm.register("lastName")}
                        placeholder="Last name"
                      />
                      {registerForm.formState.errors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      data-testid="input-email"
                      {...registerForm.register("email")}
                      placeholder="Enter your email"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      data-testid="input-register-username"
                      {...registerForm.register("username")}
                      placeholder="Choose a username"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={(value) => registerForm.setValue("role", value as any)}>
                      <SelectTrigger data-testid="select-role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chairman">Chairman</SelectItem>
                        <SelectItem value="hod">Head of Department</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    {registerForm.formState.errors.role && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.role.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="collegeId">College ID</Label>
                    <Input
                      id="collegeId"
                      data-testid="input-collegeId"
                      {...registerForm.register("collegeId")}
                      placeholder="Enter your college ID"
                    />
                    {registerForm.formState.errors.collegeId && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.collegeId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="departmentId">Department ID</Label>
                    <Input
                      id="departmentId"
                      data-testid="input-departmentId"
                      {...registerForm.register("departmentId")}
                      placeholder="Enter your department ID"
                    />
                    {registerForm.formState.errors.departmentId && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.departmentId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      data-testid="input-register-password"
                      {...registerForm.register("password")}
                      placeholder="Create a password"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      data-testid="input-confirmPassword"
                      {...registerForm.register("confirmPassword")}
                      placeholder="Confirm your password"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    data-testid="button-register"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Button
                  variant="link"
                  data-testid="button-toggle-auth"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
