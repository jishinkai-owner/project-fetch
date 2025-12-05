"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams, notFound } from "next/navigation";
import activityTypes from "../activityTypes";

export default function ResolveFilenamePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const recordType = params.type as string;
  const filename = searchParams.get('filename');
  const yearParam = searchParams.get('year');

  // タイプのバリデーション
  const activityType = activityTypes.find((e) => e.id === recordType);

  useEffect(() => {
    const resolveFilename = async () => {
      if (!filename || !activityType) {
        return notFound();
      }

      try {
        // filenameでAPIを呼び出してIDを取得
        const res = await fetch(`/api/Record/${activityType.id}/resolve?filename=${encodeURIComponent(filename)}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            return notFound();
          }
          throw new Error('Failed to resolve filename');
        }

        const data = await res.json();
        
        if (data.id) {
          // IDが取得できたらそのページにリダイレクト
          const redirectUrl = yearParam
            ? `/record/${activityType.id}/${data.id}?year=${yearParam}`
            : `/record/${activityType.id}/${data.id}`;
          router.replace(redirectUrl);
        } else {
          return notFound();
        }
      } catch (error) {
        console.error('Error resolving filename:', error);
        return notFound();
      }
    };

    resolveFilename();
  }, [filename, activityType, yearParam, router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>読み込み中...</p>
    </div>
  );
}
