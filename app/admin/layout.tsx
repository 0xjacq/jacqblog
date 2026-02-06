"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      return;
    }

    let cancelled = false;

    fetch("/api/auth/status")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        router.push("/admin/login");
      });

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Show loading state while checking auth
  if (isAuthenticated === null && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Login page has no header
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Admin Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-bold text-zinc-100">
                Admin
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/admin"
                  className="text-zinc-400 hover:text-zinc-100"
                >
                  Articles
                </Link>
                <Link
                  href="/admin/new"
                  className="text-zinc-400 hover:text-zinc-100"
                >
                  New Article
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
