import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get('pathname');
    
    if (!pathname) {
      return NextResponse.json({ error: 'pathname is required' }, { status: 400 });
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    
    // /other/shinkan2025 パターンの処理
    if (pathSegments[0] === 'other' && pathSegments[1] === 'shinkan2025') {
      console.log(`Direct redirect: ${pathname} -> /shinkan`);
      return NextResponse.json({
        redirect: `/shinkan`,
        found: true
      });
    }
    
    // 単一セグメントのパターン処理
    if (pathSegments.length === 1) {
      const segment = pathSegments[0];
      
      switch (segment) {
        case 'qa':
          console.log(`Direct redirect: ${pathname} -> /qa`);
          return NextResponse.json({
            redirect: `/qa`,
            found: true
          });
        case 'member':
          console.log(`Direct redirect: ${pathname} -> /member`);
          return NextResponse.json({
            redirect: `/member`,
            found: true
          });
        case 'yama':
          console.log(`Direct redirect: ${pathname} -> /record/yama`);
          return NextResponse.json({
            redirect: `/record/yama`,
            found: true
          });
        case 'tabi':
          console.log(`Direct redirect: ${pathname} -> /record/tabi`);
          return NextResponse.json({
            redirect: `/record/tabi`,
            found: true
          });
        case 'tsuri':
          console.log(`Direct redirect: ${pathname} -> /record/tsuri`);
          return NextResponse.json({
            redirect: `/record/tsuri`,
            found: true
          });
        default:
          return NextResponse.json({
            redirect: `/record`,
            found: false
          });
      }
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
        filename = pathSegments.slice(2).join('/');
      }
      
      console.log(`Legacy redirect API (record pattern): ${pathname}`);
      console.log(`Activity type: ${activityType}, Year: ${year}, Filename: ${filename}`);
      
      return await processLegacyRedirect(activityType, year, filename, pathname);
    }
    
    // 従来の /yama/year/filename パターンの場合
    if (pathSegments.length < 2) {
      const activityType = pathSegments[0];
      return NextResponse.json({
        redirect: `/record/${activityType}`,
        found: false
      });
    }

    const activityType = pathSegments[0]; // yama, tabi, tsuri
    const year = pathSegments[1];
    
    // ファイル名は year 以降のすべてのセグメントを結合
    let filename: string;
    if (pathSegments.length === 3) {
      // /yama/2007/filename 形式
      filename = pathSegments[2];
    } else if (pathSegments.length > 3) {
      // /yama/2007/dir/filename 形式
      filename = pathSegments.slice(1).join('/');
    } else {
      // year のみの場合は年度フィルタ付き一覧ページへ
      return NextResponse.json({
        redirect: `/record/${activityType}?year=${year}`,
        found: false
      });
    }

    console.log(`Legacy redirect API: ${pathname}`);
    console.log(`Activity type: ${activityType}, Year: ${year}, Filename: ${filename}`);

    return await processLegacyRedirect(activityType, year, filename, pathname);

  } catch (error) {
    console.error('Error in legacy redirect API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function processLegacyRedirect(activityType: string, year: string, filename: string, pathname: string) {
  // Contentテーブルからfilenameで検索し、関連するRecordも取得
  const content = await prisma.content.findFirst({
    where: {
      filename: filename,
    },
    include: {
      Record: {
        select: {
          year: true,
          activityType: true,
        },
      },
    },
  });

  if (content) {
    const redirectUrl = `/record/${activityType}/${content.id}?year=${content.Record.year || year}`;
    console.log(`Legacy redirect: ${pathname} -> ${redirectUrl}`);
    
    return NextResponse.json({
      redirect: redirectUrl,
      found: true,
      contentId: content.id
    });
  } else {
    // 該当するコンテンツが見つからない場合は年度フィルタ付き一覧ページへ
    console.log(`Content not found for filename: ${filename}, redirecting to year list`);
    return NextResponse.json({
      redirect: `/record/${activityType}?year=${year}`,
      found: false
    });
  }
}
