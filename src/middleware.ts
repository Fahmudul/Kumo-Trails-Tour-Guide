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
  console.log("from line 13", path);
  // Define public paths
  const isPublicPath =
    path.startsWith("/sign-in") || path.startsWith("/sign-up");

  // Redirect to sign-in if no token and not on a public path
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (!token && isPublicPath) {
    return NextResponse.next();
  }
  //* */ approach 1
  // If user has a token and is trying to access a public page, redirect them to their appropriate dashboard
  // if (token && isPublicPath) {
  //   if (role === "Admin" && path !== "/dashboard") {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   } else if (role === "Tourist" && path !== "/member-dashboard") {
  //     return NextResponse.redirect(new URL("/member-dashboard", request.url));
  //   } else if (role === "Guide" && path !== "/guide") {
  //     return NextResponse.redirect(new URL("/guide", request.url));
  //   }
  // }
  // console.log("from line 33", role);
  //* */ approach 2
  if (
    (role === "Admin" && path.startsWith("/admin-dashboard")) ||
    (role === "Tourist" && path.startsWith("/tourist-dashboard")) ||
    (role === "Guide" && path.startsWith("/guide-dashboard"))
  ) {
    return NextResponse.next();
  }
  if (
    (role === "Admin" || role === "Tourist" || role === "Guide") &&
    isPublicPath
  ) {
    console.log("hitting");
    return NextResponse.redirect(
      new URL(`/${role.toLowerCase()}-dashboard/profile`, request.url)
    );
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/tourist-dashboard",
    "/guide",
    "/sign-in",
  ],
};
