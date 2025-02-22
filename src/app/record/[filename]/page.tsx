import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

interface PageProps {
  params: { filename: string };
}

export default async function RecordDetailPage({ params }: PageProps) {
  if (!params || !params.filename) {
    return notFound();
  }

  const decodedFilename = decodeURIComponent(params.filename);

  const record = await prisma.recordContent.findFirst({
    where: { filename: decodedFilename },
  });

  if (!record) {
    return notFound();
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{record.filename}</h1>

      {/* 記録本文 (HTMLを解釈) */}
      <div
        style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}
        dangerouslySetInnerHTML={{ __html: record.content || "" }}
      />

      {/* 画像一覧 */}
      {record.images && record.images.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>画像一覧</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {record.images.map((imgUrl, idx) => (
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
