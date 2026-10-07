import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const authHeader = request.cookies.get("sb-access-token")?.value
      ?? request.headers.get("authorization")?.replace("Bearer ", "");

    if (!authHeader) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data } = await supabase.auth.getUser(authHeader);
    if (!data.user || data.user.user_metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
