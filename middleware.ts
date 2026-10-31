// SAVE PATH: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  /*
   * Only run middleware on actual page routes.
   * Excluding /api/* and static assets eliminates the edge (middleware)
   * CPU spike — previously middleware ran on every API call, driving
   * the 77.5% edge share shown in Vercel's CPU usage dashboard.
   *
   * Excluded from middleware:
   *   - /api/*            → server functions, no middleware needed
   *   - /_next/static/*   → static JS/CSS chunks
   *   - /_next/image/*    → image optimisation
   *   - /favicon.ico
   *   - /images/*         → public image assets
   *   - Any static file extension (svg, png, jpg, webp, …)
   */
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot)$).*)",
  ],
};
