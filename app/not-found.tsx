import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
      <h2 className="mb-4 text-2xl font-semibold text-white">Page Not Found</h2>
      <p className="mb-8 text-muted">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Go Home
      </Link>
    </div>
  );
}
