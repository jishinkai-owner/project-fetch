import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 旧ホームページからのリダイレクト処理
  if (pathname.startsWith('/yama/') || pathname.startsWith('/tabi/') || pathname.startsWith('/tsuri/') ||
      pathname.startsWith('/other/') ||
      pathname === '/yama' || pathname === '/tabi' || pathname === '/tsuri') {
    const redirectUrl = handleLegacyRedirect(pathname);
    if (redirectUrl) {
      console.log(`[301 Redirect] ${pathname} -> ${redirectUrl}`);
      return NextResponse.redirect(redirectUrl, { status: 301 });
    }
  }

  // /record/[type]/[year]/[filename] パターンもレガシーリダイレクト処理
  if (pathname.startsWith('/record/')) {
    const pathSegments = pathname.split('/').filter(Boolean);
    // /record/yama/2022/filename のように4つ以上のセグメントがある場合
    if (pathSegments.length >= 4 && 
        (pathSegments[1] === 'yama' || pathSegments[1] === 'tabi' || pathSegments[1] === 'tsuri')) {
      // 詳細ページはAPI経由で処理（legacy-redirectページへ）
      const redirectUrl = new URL('/legacy-redirect', request.url);
      redirectUrl.searchParams.set('originalPath', pathname);
      console.log(`[API Redirect] ${pathname} -> /legacy-redirect (API処理)`);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return await updateSession(request);
}

/**
 * 旧URL形式を新URL形式にマッピング
 * @param pathname 旧パス
 * @returns 新URL（マッピングできない場合はnull）
 */
function handleLegacyRedirect(pathname: string): string | null {
  // 直接マッピング可能なパターン
  const directMap: Record<string, string> = {
    '/': '/',
    '/yama': '/record/yama',
    '/tabi': '/record/tabi',
    '/tsuri': '/record/tsuri',
    '/qa': '/qa',
    '/member': '/member',
    '/other/shinkan2025': '/shinkan',
  };

  if (directMap[pathname]) {
    return directMap[pathname];
  }

  const pathSegments = pathname.split('/').filter(Boolean);

  // /yama/year または /yama/year/filename パターン
  if (['yama', 'tabi', 'tsuri'].includes(pathSegments[0]) && pathSegments.length >= 2) {
    const activityType = pathSegments[0];
    const year = pathSegments[1];
    
    // ファイル名がある場合は詳細検索が必要なのでAPIで処理
    if (pathSegments.length >= 3) {
      return null; // APIで処理させる
    }
    
    // 年度フィルタ付きリダイレクト
    return `/record/${activityType}?year=${year}`;
  }

  return null;
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
