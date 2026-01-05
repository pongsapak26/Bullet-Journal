"use server";

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Invalid email address" };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Supabase auth error:", error);
      return { error: error.message };
    }

    return {
      success: true,
      message: "Magic link sent to your email",
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
