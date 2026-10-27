import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "session_token";

// Rute publik yang dapat diakses oleh tamu
const PUBLIC_PATHS = ["/masuk", "/daftar", "/"];

/**
 * Middleware untuk gerbang autentikasi awal berbasis cookie JWT.
 * Berjalan di Edge runtime tanpa menyentuh basis data.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dapatkan token sesi dari cookie
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let session: { userId: string; role: "pasien" | "admin" } | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.SESSION_SECRET || "default_development_secret_key_at_least_32_chars_long"
      );
      const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
      if (payload.userId && payload.role) {
        session = {
          userId: payload.userId as string,
          role: payload.role as "pasien" | "admin",
        };
      }
    } catch {
      session = null;
    }
  }

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(path))
  );

  // 1. Jika pengguna tidak terautentikasi dan mencoba mengakses rute terproteksi
  if (!session && !isPublicPath && !pathname.startsWith("/api/public")) {
    const loginUrl = new URL("/masuk", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika pengguna terautentikasi mengakses halaman login / daftar (/masuk atau /daftar)
  if (session && (pathname === "/masuk" || pathname === "/daftar")) {
    const destination = session.role === "admin" ? "/admin" : "/profil";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. Jika pasien mencoba mengakses rute khusus admin (/admin/**)
  if (session && session.role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/profil", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset files (e.g. .png, .jpg, .svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
