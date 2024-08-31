import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("from middleware Token:", token);
  const role = token?.role;
  const path = request.nextUrl.pathname;

  // Define public paths
  const isPublicPath =
    path.startsWith("/sign-in") || path.startsWith("/sign-up");

  // Redirect to sign-in if no token and not on a public path
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If user has a token and is trying to access a public page, redirect them to their appropriate dashboard
  if (token && isPublicPath) {
    if (role === "Admin" && path !== "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (role === "Tourist" && path !== "/member-dashboard") {
      return NextResponse.redirect(new URL("/member-dashboard", request.url));
    } else if (role === "Guide" && path !== "/guide") {
      return NextResponse.redirect(new URL("/guide", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/member-dashboard", "/guide", "/sign-in"],
};
