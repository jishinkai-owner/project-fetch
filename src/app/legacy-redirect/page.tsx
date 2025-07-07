"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LegacyRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const originalPath = searchParams.get('originalPath');

  useEffect(() => {
    if (!originalPath) {
      router.push('/record');
      return;
    }

    const handleRedirect = async () => {
      try {
        const response = await fetch(`/api/legacy-redirect?pathname=${encodeURIComponent(originalPath)}`);
        const data = await response.json();

        if (response.ok && data.redirect) {
          console.log(`Redirecting from ${originalPath} to ${data.redirect}`);
          router.push(data.redirect);
        } else {
          throw new Error('Failed to get redirect information');
        }
      } catch (error) {
        console.error('Error in legacy redirect:', error);
        
        // エラーが発生した場合のフォールバック処理
        const pathSegments = originalPath.split('/').filter(Boolean);
        const activityType = pathSegments[0];
        const year = pathSegments[1];
        
        if (activityType && year) {
          router.push(`/record/${activityType}?year=${year}`);
        } else if (activityType) {
          router.push(`/record/${activityType}`);
        } else {
          router.push('/record');
        }
      }
    };

    handleRedirect();
  }, [originalPath, router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      gap: '1rem'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(220, 75, 75, 0.1)',
        borderRadius: '50%',
        borderTopColor: 'rgba(220, 75, 75, 0.7)',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        ページを読み込み中...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
