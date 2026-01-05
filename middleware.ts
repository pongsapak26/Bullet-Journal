import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "session";

// หน้าที่ต้อง login ก่อน
const protectedRoutes = ["/dashboard"];

// หน้าสำหรับคนที่ยังไม่ login (ไม่ต้อง auth)
// publicRoutes: ["/", "/verify"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isLoggedIn = !!sessionCookie?.value;

  // เช็คว่าเป็น protected route หรือไม่
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // ถ้าเป็น protected route และยังไม่ login -> redirect ไปหน้า login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ถ้า login แล้วและพยายามเข้าหน้า login -> redirect ไป dashboard
  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - auth routes (callback)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
