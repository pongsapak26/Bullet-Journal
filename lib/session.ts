"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year - อยู่ในระบบตลอดจนกว่าจะ logout

interface SessionData {
  userId: string;
  email: string;
}

// เข้ารหัส session data แบบง่าย (ใน production ควรใช้ JWT หรือ encryption)
function encodeSession(data: SessionData): string {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

function decodeSession(encoded: string): SessionData | null {
  try {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

export async function createSession(userId: string, email: string) {
  const sessionData = encodeSession({ userId, email });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return decodeSession(sessionCookie.value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
