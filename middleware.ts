// SAVE PATH: middleware.ts
/**
 * Pure Apple — Middleware
 *
 * ডিজাইন সিদ্ধান্ত:
 * ─────────────────
 * ১. Admin auth → client-side (AdminLayout) করা আছে। Middleware-এ
 *    Supabase call করলে প্রতিটা page navigate-এ একটা extra Edge
 *    round-trip যোগ হয় এবং Fluid CPU বাড়ে। তাই এখানে কোনো
 *    session/token check করা হয়নি।
 *
 * ২. Matcher শুধু page route-এ সীমাবদ্ধ:
 *    Vercel dashboard-এর "middleware" CPU (আগে 77.5%) এই
 *    exclusion-গুলো দিলে প্রায় শূন্যে নামে।
 *
 * ৩. Redirect loop বন্ধ:
 *    Middleware-এ কোনো redirect নেই, তাই loop-এর সুযোগ নেই।
 *    /login ↔ /admin redirect AdminLayout + AuthStore handle করে।
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // এই project-এ middleware শুধু page-level headers বা
  // future geo-redirect-এর জন্য রাখা হয়েছে।
  // Session check এখানে করা হয় না — AdminLayout করে।
  return NextResponse.next();
}

export const config = {
  /*
   * Exclude হওয়া pattern — এগুলোতে middleware একদম চলবে না:
   *
   *   api/            → /api/products, /api/orders, /api/auth/*, ...
   *   _next/static    → JS / CSS bundles
   *   _next/image     → Next.js image optimisation
   *   favicon.ico
   *   images/         → public/images (Happy Client, Phone, Banner, ...)
   *   *.webp|png|...  → static image / font / video / data files
   *
   * বাকি সব page route (/, /about, /products, /admin/*, /login, ...) ✅
   */
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:webp|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|json|txt|xml|csv)$).*)",
  ],
};
