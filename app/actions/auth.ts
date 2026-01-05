"use server";

import { deleteSession } from "@/lib/session";
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

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await deleteSession();
  return { success: true };
}
