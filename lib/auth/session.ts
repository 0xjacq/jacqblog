import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Signed cookie sessions - no server-side storage needed.
 * Token format: {timestamp}.{signature}
 * The signature is HMAC-SHA256 of the timestamp using SESSION_SECRET.
 */

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters");
  }
  return secret;
}

function signToken(timestamp: number): string {
  const secret = getSessionSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(String(timestamp))
    .digest("hex");
  return `${timestamp}.${signature}`;
}

function verifyToken(token: string): { valid: boolean; timestamp?: number } {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) {
    return { valid: false };
  }

  try {
    const secret = getSessionSecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(String(timestamp))
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(providedSignature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (sigBuffer.length !== expectedBuffer.length) {
      return { valid: false };
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false };
    }

    return { valid: true, timestamp };
  } catch {
    return { valid: false };
  }
}

export async function createSession(): Promise<string> {
  const timestamp = Date.now();
  const token = signToken(timestamp);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return token;
}

export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  const result = verifyToken(token);
  if (!result.valid || !result.timestamp) {
    return false;
  }

  // Check if session has expired
  const now = Date.now();
  const sessionAge = now - result.timestamp;
  if (sessionAge > SESSION_MAX_AGE * 1000) {
    return false;
  }

  return true;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    console.error("ADMIN_PASSWORD_HASH environment variable is not set");
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

// Rate limiting for login attempts (still in-memory, acceptable for rate limiting)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (now > attempt.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    const retryAfter = Math.ceil((attempt.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  attempt.count++;
  return { allowed: true };
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}
