import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = ["/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  console.log("Middleware", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // Check if trying to access protected route without token
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if trying to access auth routes with token
  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedRoutes, ...authRoutes],
};
