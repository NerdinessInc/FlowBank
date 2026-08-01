import { NextRequest, NextResponse } from "next/server";

const DOMAIN_TO_TENANT: Record<string, string> = {
  "banka.com": "bank-a",
  "betafinance.org": "bank-b",
  "flowbank.io": "default",
};

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const url = request.nextUrl;

  // 1. Get the Host header (e.g., "banka.com", "localhost:3000")
  const hostname = request.headers.get("host") || "";

  // Strip the port if present (localhost:3000 -> localhost)
  const domain = hostname.split(":")[0];

  // 2. Look up the tenant ID based on the domain
  let institutionId = DOMAIN_TO_TENANT[domain];

  // 3. Fallbacks for local development testing
  if (!institutionId) {
    institutionId =
      url.searchParams.get("institutionId") ||
      cookies.get("institutionId")?.value ||
      "default";
  }

  // 4. Create a new Headers object from the incoming request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", institutionId);

  // 5. Create the response and attach the modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Optional: Also set it on the response so the browser sees it in the network tab
  response.headers.set("x-tenant-id", institutionId);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
