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
