import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import React from "react";

async function register(data: { username: string; email?: string; password: string; role: "chairman" | "hod" | "staff" }) {
  const res = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export function Register() {
  const [, setLocation] = useLocation();
  const [form, setForm] = React.useState({ username: "", email: "", password: "", role: "staff" as const });
  const mutation = useMutation({ mutationFn: () => register(form) });

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="p-10 flex items-center bg-gradient-to-br from-sky-200 to-sky-50">
        <div>
          <h1 className="text-3xl font-bold mb-2">EduManage</h1>
          <p className="text-gray-700 max-w-md">Create an account to get started with EduManage.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Create account</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate(undefined, { onSuccess: () => setLocation("/") });
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Username</label>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })} className="w-full border rounded px-3 py-2">
                  <option value="chairman">Chairman</option>
                  <option value="hod">HOD</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <button disabled={mutation.isPending} className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded py-2">
              {mutation.isPending ? "Creating..." : "Create Account"}
            </button>
            <p className="text-sm text-center">
              Already have an account? <a className="text-sky-600" href="/">Sign in</a>
            </p>
            {mutation.isError && <p className="text-sm text-red-600">{(mutation.error as Error).message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

