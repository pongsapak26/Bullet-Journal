import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      // สร้างหรืออัปเดต user ใน Prisma
      const user = await prisma.user.upsert({
        where: { email: data.user.email },
        update: {},
        create: { email: data.user.email },
      });

      // สร้าง session cookie
      await createSession(user.id, user.email);

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?error=auth_failed`);
}
