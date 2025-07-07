import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 旧ホームページからのリダイレクト処理
  if (pathname.startsWith('/yama/') || pathname.startsWith('/tabi/') || pathname.startsWith('/tsuri/') ||
      pathname.startsWith('/other/') ||
      pathname === '/yama' || pathname === '/tabi' || pathname === '/tsuri') {
    return handleLegacyRedirect(request);
  }

  // /record/[type]/[year]/[filename] パターンもレガシーリダイレクト処理
  if (pathname.startsWith('/record/')) {
    const pathSegments = pathname.split('/').filter(Boolean);
    // /record/yama/2022/filename のように4つ以上のセグメントがある場合
    if (pathSegments.length >= 4 && 
        (pathSegments[1] === 'yama' || pathSegments[1] === 'tabi' || pathSegments[1] === 'tsuri')) {
      return handleLegacyRedirect(request);
    }
  }

  return await updateSession(request);
}

function handleLegacyRedirect(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // レガシーリダイレクトページに転送し、元のパスをクエリパラメータで渡す
  const redirectUrl = new URL('/legacy-redirect', request.url);
  redirectUrl.searchParams.set('originalPath', pathname);
  
  console.log(`Legacy redirect detected: ${pathname} -> ${redirectUrl.toString()}`);
  
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
