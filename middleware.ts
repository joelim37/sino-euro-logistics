import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import {
  ADMIN_GATE_PASSWORD,
  ADMIN_GATE_REALM_LABEL,
  ADMIN_GATE_USERNAME,
} from "@/lib/admin-gate";

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${ADMIN_GATE_REALM_LABEL}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
}

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;

  const encoded = authHeader.slice(6).trim();
  if (!encoded) return false;

  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return safeEqual(username, ADMIN_GATE_USERNAME) && safeEqual(password, ADMIN_GATE_PASSWORD);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (pathname === ADMIN_BASE_PATH || pathname.startsWith(`${ADMIN_BASE_PATH}/`)) {
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    const url = request.nextUrl.clone();
    const rewrittenPath = pathname.replace(ADMIN_BASE_PATH, "/admin") || "/admin";
    url.pathname = rewrittenPath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/portal-se-eu-7k9x2m/:path*", "/portal-se-eu-7k9x2m"],
};
