import { NextResponse } from "next/server";
import { validateSession } from "@/lib/auth/session";

export async function GET() {
  const authenticated = await validateSession();
  return NextResponse.json({ authenticated });
}
