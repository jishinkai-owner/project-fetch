import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const prisma = new PrismaClient();

export default async function RecordDetailPage({
  params: { filename },
}: {
  params: { filename: string };
}) {
  // URL パラメータをデコード
  const decodedFilename = decodeURIComponent(filename);

  // Content テーブルから filename が一致するレコードを取得
  // 同時に Record テーブルも include して紐づく情報を参照
  const content = await prisma.content.findFirst({
    where: { filename: decodedFilename },
    include: { Record: true },
  });

  if (!content) {
    notFound();
  }

  // images があれば、それらを有効な URL のみフィルタリング
  const imageUrls: string[] = Array.isArray(content.images) ? content.images : [];
  const validImageUrls = imageUrls.filter(
    (url) => typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))
  );

  return (
    <div className={styles.container}>
      {/* Record テーブルの情報を表示 (year, place など) */}
      <h1 className={styles.heading}>
        {content.Record?.year}年 {content.Record?.place} / {content.title}
      </h1>

      {/* 本文 */}
      <div
        className={styles.recordBody}
        dangerouslySetInnerHTML={{ __html: content.content || "" }}
      />

      {/* 画像一覧 */}
      {validImageUrls.length > 0 && (
        <div className={styles.imageGrid}>
          <h2 className={styles.imageTitle}>画像一覧</h2>
          <div className={styles.imagesWrapper}>
            {validImageUrls.map((imgUrl, idx) => (
              <Image
                key={idx}
                src={imgUrl}
                alt={`image-${idx}`}
                width={400}
                height={300}
                style={{ objectFit: "cover" }}
                unoptimized
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
