import { NextResponse, type NextRequest } from "next/server";

// Site-wide username/password gate (HTTP Basic Auth).
// Set SITE_USER and SITE_PASSWORD in Vercel (Production and Preview). If either is missing,
// the site stays closed rather than silently becoming public.

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function proxy(request: NextRequest) {
  const user = process.env.SITE_USER;
  const pass = process.env.SITE_PASSWORD;
  if (!user || !pass) {
    return new NextResponse("Site access is not configured.", { status: 503 });
  }
  const header = request.headers.get("authorization");
  if (header && header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const i = decoded.indexOf(":");
      if (i >= 0 && safeEqual(decoded.slice(0, i), user) && safeEqual(decoded.slice(i + 1), pass)) {
        return NextResponse.next();
      }
    } catch {
      // fall through to the challenge
    }
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="AI Futures", charset="UTF-8"' },
  });
}

export const config = { matcher: "/:path*" };
