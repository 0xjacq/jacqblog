"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Replace with your newsletter provider (Buttondown, ConvertKit, etc.)
    // For now, we'll just simulate a successful subscription
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
    setEmail("");
  };

  return (
    <div className="rounded-lg border border-border p-6">
      <h3 className="mb-2 text-lg font-semibold text-white">Newsletter</h3>
      <p className="mb-4 text-sm text-muted">
        Subscribe to get notified about new articles and projects.
      </p>
      {status === "success" ? (
        <p className="text-sm text-accent">Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
