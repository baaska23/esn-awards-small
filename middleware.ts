import { NextResponse, type NextRequest } from "next/server";
import { pollPhase } from "@/lib/poll-window";

// Gates the whole app on the voting window (lib/poll-window.ts).
// nextUrl.pathname has the /mea basePath stripped.
const NOTICE_PAGES = { upcoming: "/coming-soon", closed: "/closed" } as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static assets (Next chunks, fonts, background media, favicon) always load.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/new-bg/") ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const phase = pollPhase();
  const isNoticePage = pathname === NOTICE_PAGES.upcoming || pathname === NOTICE_PAGES.closed;

  if (phase === "open") {
    if (isNoticePage) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    const error =
      phase === "upcoming" ? "Санал хураалт хараахан эхлээгүй байна." : "Санал хураалт хаагдсан.";
    return NextResponse.json({ error }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  const url = req.nextUrl.clone();
  url.pathname = NOTICE_PAGES[phase];
  const res = NextResponse.rewrite(url);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
