import { NextResponse, type NextRequest } from "next/server";

/** "/" vai para /en ou /es pelo idioma do navegador; o idioma da rota vai no header x-lang para o layout raiz. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    const al = request.headers.get("accept-language")?.toLowerCase() ?? "";
    const lang = /(^|,)\s*es\b/.test(al) || (al.includes("es") && !al.startsWith("en")) ? "es" : "en";
    return NextResponse.redirect(new URL(`/${lang}`, request.url));
  }
  const lang = pathname.startsWith("/es") ? "es" : "en";
  const headers = new Headers(request.headers);
  headers.set("x-lang", lang);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api/|_next/|media/|favicon|robots.txt|sitemap.xml).*)"] };
