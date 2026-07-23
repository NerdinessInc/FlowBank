import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies;

  const userData = cookies.get("flowbank_user")?.value || null;

  const path = request.nextUrl.pathname;

  // Determine institution ID for white-labeling
  // 1. Check query parameter (e.g. ?institutionId=bank-a) for easy testing
  // 2. Fallback to a cookie 'institutionId'
  let institutionId = request.nextUrl.searchParams.get('institutionId') || cookies.get('institutionId')?.value || 'default';
  
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', institutionId);

  // if (userData) {
  //   // User is logged in
  //   if (path === "/") {
  //     // Redirect to dashboard if trying to access login page
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // } else {
  //   // User is not logged in
  //   if (path !== "/") {
  //     // Redirect to login for any page other than login
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  // Allow the request to continue
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
