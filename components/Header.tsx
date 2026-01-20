import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-6">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
