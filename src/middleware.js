import { NextResponse } from "next/server";

const NEW_DOMAIN = "robotgames.ecsc-uok.com";
const OLD_DOMAIN = "robotbattles.ecsc-uok.com";

export function middleware(request) {
  const hostname = request.headers.get("host")?.replace(/:\d+$/, "");

  // Redirect old domain to new domain (permanent 301 for SEO)
  if (hostname === OLD_DOMAIN) {
    const url = request.nextUrl.clone();
    url.hostname = NEW_DOMAIN;
    url.host = NEW_DOMAIN;
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and Next internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
