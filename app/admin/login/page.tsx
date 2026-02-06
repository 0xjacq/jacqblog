import { LoginForm } from "@/components/admin/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-zinc-100">
          Admin Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
