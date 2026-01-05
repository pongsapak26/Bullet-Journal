"use client";

import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-tan-600 hover:text-brown-800 transition-colors text-sm"
    >
      ออกจากระบบ
    </button>
  );
}
