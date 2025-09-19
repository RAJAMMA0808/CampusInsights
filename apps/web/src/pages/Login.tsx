import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import React from "react";

async function login(username: string, password: string) {
  const res = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const mutation = useMutation({ mutationFn: () => login(username, password) });

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="p-10 flex items-center bg-gradient-to-br from-sky-200 to-sky-50">
        <div>
          <h1 className="text-3xl font-bold mb-2">EduManage</h1>
          <p className="text-gray-700 max-w-md">Comprehensive attendance and academic management dashboard for engineering colleges.</p>
          <ul className="mt-6 space-y-2 text-gray-700">
            <li>Manage multiple college campuses</li>
            <li>Student & faculty attendance tracking</li>
            <li>Real-time analytics and reporting</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Sign In</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate(undefined, {
                onSuccess: () => setLocation("/dashboard"),
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <button disabled={mutation.isPending} className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded py-2">
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-sm text-center">
              Don’t have an account? <a className="text-sky-600" href="/register">Sign up</a>
            </p>
            {mutation.isError && <p className="text-sm text-red-600">{(mutation.error as Error).message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

