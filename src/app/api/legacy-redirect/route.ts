import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * レガシーリダイレクトAPI
 * 旧URL形式（/yama/2022/filename など）を新URL形式にマッピング
 * ファイル名からコンテンツを検索して、正確にリダイレクト
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get('pathname');
    
    if (!pathname) {
      return NextResponse.json({ error: 'pathname is required' }, { status: 400 });
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    
    console.log(`[Legacy Redirect API] Processing: ${pathname}`);
    console.log(`[Legacy Redirect API] Segments: ${JSON.stringify(pathSegments)}`);
    
    // /other/shinkan2025 パターンの処理
    if (pathSegments[0] === 'other' && pathSegments[1] === 'shinkan2025') {
      console.log(`[Legacy Redirect] Direct: ${pathname} -> /shinkan`);
      return NextResponse.json({
        redirect: `/shinkan`,
        found: true,
        statusCode: 301
      });
    }
    
    // 単一セグメントのパターン処理
    if (pathSegments.length === 1) {
      const segment = pathSegments[0];
      
      const directRedirects: Record<string, string> = {
        'qa': '/qa',
        'member': '/member',
        'yama': '/record/yama',
        'tabi': '/record/tabi',
        'tsuri': '/record/tsuri',
      };

      if (directRedirects[segment]) {
        console.log(`[Legacy Redirect] Direct: ${pathname} -> ${directRedirects[segment]}`);
        return NextResponse.json({
          redirect: directRedirects[segment],
          found: true,
          statusCode: 301
        });
      }

      return NextResponse.json({
        redirect: `/record`,
        found: false,
        statusCode: 301
      });
    }
    
    // /record/yama/year/filename パターンの場合
    if (pathSegments[0] === 'record' && pathSegments.length >= 4) {
      const activityType = pathSegments[1]; // yama, tabi, tsuri
      const year = pathSegments[2];
      
      // ファイル名は year 以降のすべてのセグメントを結合
      let filename: string;
      if (pathSegments.length === 4) {
        // /record/yama/2007/filename 形式
        filename = pathSegments[3];
      } else {
        // /record/yama/2007/dir/filename 形式
        filename = pathSegments.slice(3).join('/');
      }
      
      console.log(`[Legacy Redirect API] Record pattern: activityType=${activityType}, year=${year}, filename=${filename}`);
      
      return await processLegacyRedirect(activityType, year, filename, pathname);
    }
    
    // 従来の /yama/year/filename パターンの場合
    const activityType = pathSegments[0]; // yama, tabi, tsuri
    const year = pathSegments[1];
    
    // 検証：activityType が正しいか確認
    if (!['yama', 'tabi', 'tsuri'].includes(activityType)) {
      console.log(`[Legacy Redirect] Invalid activity type: ${activityType}`);
      return NextResponse.json({
        redirect: `/record`,
        found: false,
        statusCode: 301
      });
    }
    
    // ファイル名は year 以降のすべてのセグメントを結合
    let filename: string;
    if (pathSegments.length === 3) {
      // /yama/2007/filename 形式
      filename = pathSegments[2];
    } else if (pathSegments.length > 3) {
      // /yama/2007/dir/filename 形式
      filename = pathSegments.slice(2).join('/');
    } else {
      // year のみの場合は年度フィルタ付き一覧ページへ
      console.log(`[Legacy Redirect] Year only: ${pathname} -> /record/${activityType}?year=${year}`);
      return NextResponse.json({
        redirect: `/record/${activityType}?year=${year}`,
        found: false,
        statusCode: 301
      });
    }

    console.log(`[Legacy Redirect API] Traditional pattern: activityType=${activityType}, year=${year}, filename=${filename}`);

    return await processLegacyRedirect(activityType, year, filename, pathname);

  } catch (error) {
    console.error('[Legacy Redirect Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * ファイル名からコンテンツを検索し、適切なリダイレクト先を決定
 * 
 * マッピング例：
 * - /yama/2022/filename → /record/yama/contentId?year=2022 (contentIdが見つかった場合)
 * - /yama/2022/filename → /record/yama?year=2022 (contentIdが見つからない場合)
 */
async function processLegacyRedirect(
  activityType: string,
  year: string,
  filename: string,
  originalPathname: string
) {
  try {
    // ファイル名の拡張子を削除（.html, .mdなど）
    const filenameWithoutExt = filename.replace(/\.(html|md|mdx)$/, '');
    
    console.log(`[processLegacyRedirect] Searching for: filename=${filename}, filenameWithoutExt=${filenameWithoutExt}`);
    
    // Contentテーブルからfilenameで検索
    // filenameはディレクトリ構造を含む可能性あり（例：2022/2022_kurikoma_RYUTA）
    const content = await prisma.content.findFirst({
      where: {
        OR: [
          // 完全一致
          { filename: filename },
          // 拡張子なしで検索
          { filename: filenameWithoutExt },
          // ディレクトリを含めた検索
          { filename: { contains: filenameWithoutExt } },
        ],
      },
      include: {
        Record: {
          select: {
            id: true,
            year: true,
            activityType: true,
          },
        },
      },
    });

    if (content && content.Record) {
      const redirectUrl = `/record/${activityType}/${content.id}?year=${content.Record.year || year}`;
      console.log(`[processLegacyRedirect] Found content: ${originalPathname} -> ${redirectUrl}`);
      
      return NextResponse.json({
        redirect: redirectUrl,
        found: true,
        statusCode: 301,
        contentId: content.id
      });
    } else {
      // 該当するコンテンツが見つからない場合は年度フィルタ付き一覧ページへ
      const fallbackUrl = `/record/${activityType}?year=${year}`;
      console.log(`[processLegacyRedirect] Content not found: ${originalPathname}, fallback to ${fallbackUrl}`);
      
      return NextResponse.json({
        redirect: fallbackUrl,
        found: false,
        statusCode: 301
      });
    }
  } catch (error) {
    console.error('[processLegacyRedirect Error]', error);
    
    // エラー時のフォールバック
    const fallbackUrl = `/record/${activityType}?year=${year}`;
    return NextResponse.json({
      redirect: fallbackUrl,
      found: false,
      statusCode: 301,
      error: String(error)
    });
  }
}
