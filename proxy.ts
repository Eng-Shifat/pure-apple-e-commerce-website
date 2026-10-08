import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Check for Supabase auth cookie — any sb- prefixed cookie means logged in
  const hasCookie = request.cookies.getAll().some(c => c.name.startsWith("sb-"));

  if (!hasCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
