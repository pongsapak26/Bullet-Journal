"use server";

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import crypto from "crypto";

const TOKEN_EXPIRY_HOURS = 24;

export async function sendMagicLink(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Invalid email address" };
  }

  try {
    // ลบ token เก่าออก
    await prisma.magicToken.deleteMany({
      where: { email },
    });

    // สร้าง token ใหม่
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    await prisma.magicToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // ในการ production ให้ส่ง email จริง
    const magicLink = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/verify?token=${token}&email=${encodeURIComponent(email)}`;
    console.log("Magic Link:", magicLink);

    // TODO: ส่ง email ด้วย Resend หรือ SendGrid
    return {
      success: true,
      message: "Magic link sent to your email",
      // dev only - ลบออกในการ production
      debugLink: process.env.NODE_ENV === "development" ? magicLink : undefined,
    };
  } catch (error) {
    console.error("Error sending magic link:", error);
    return { error: "Failed to send magic link" };
  }
}

export async function verifyMagicLink(token: string, email: string) {
  try {
    const magicToken = await prisma.magicToken.findFirst({
      where: {
        token,
        email,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!magicToken) {
      return { error: "Invalid or expired token" };
    }

    // สร้างหรืออัปเดต user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // ลบ token ที่ใช้ไปแล้ว
    await prisma.magicToken.delete({
      where: { id: magicToken.id },
    });

    // สร้าง session cookie
    await createSession(user.id, user.email);

    return {
      success: true,
      userId: user.id,
      email: user.email,
    };
  } catch (error) {
    console.error("Error verifying magic link:", error);
    return { error: "Failed to verify token" };
  }
}

export async function logout() {
  await deleteSession();
  return { success: true };
}
