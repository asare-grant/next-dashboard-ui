// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Allow login page always
//   if (pathname === "/admin-login") {
//     return NextResponse.next();
//   }

//   // Protect admin routes
//   if (pathname.startsWith("/admin")) {
//     const sessionCookie = req.cookies
//       .getAll()
//       .find((c) => c.name.startsWith("a_session_"));

//     if (!sessionCookie) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/admin-login";
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTE_ACCESS_MAP } from "@/lib/access-control";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* =========================
     ALLOW LOGIN PAGE
  ========================= */
  if (pathname === "/admin-login") {
    return NextResponse.next();
  }

  /* =========================
     ONLY PROTECT /admin
  ========================= */
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  /* =========================
     AUTH CHECK (SESSION)
  ========================= */
  const sessionCookie = req.cookies
    .getAll()
    .find((c) => c.name.startsWith("a_session_"));

  if (!sessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin-login";
    return NextResponse.redirect(url);
  }

  /* =========================
     ROLE CHECK
  ========================= */
  const role = req.cookies.get("admin_role")?.value as
    | "admin"
    | "manager"
    | "staff"
    | undefined;

  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin-login";
    return NextResponse.redirect(url);
  }

  /* =========================
     MATCH ROUTE ACCESS
  ========================= */
  const matchedRoute = Object.keys(ROUTE_ACCESS_MAP).find((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!matchedRoute) {
    // If route is not defined, deny by default
    return NextResponse.redirect(new URL("/admin/orders", req.url));
  }

  const allowedRoles = ROUTE_ACCESS_MAP[matchedRoute];

  if (!allowedRoles.includes(role)) {
    // 🚫 Unauthorized access
    return NextResponse.redirect(new URL("/admin/orders", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
