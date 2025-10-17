import React from 'react';
import Image from 'next/image';
import styles from './SNSHolder.module.scss';
import Link from 'next/link';

interface SNSHolderProps {
  className?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  oldhomepageUrl?: string;
}

const SNSHolder: React.FC<SNSHolderProps> = ({
  className,
  twitterUrl = "https://x.com/jishinkai",
  instagramUrl = "https://www.instagram.com/jishinkai_tohoku",
  oldhomepageUrl = "https://old.jishinkai.club"
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* 右上のピン */}
      <div className={styles.PinTopRight}></div>

      {/* 左下のピン */}
      <div className={styles.PinBottomLeft}></div>

      {/* SNSアイコンのコンテナ */}
      <div className={styles.iconsContainer}>
        {/* Twitter(X)アイコン */}
        <Link
          href={twitterUrl}
          target="_blank"
          className={styles.twitterBox}
        >
          <Image
            src="/x-icon.svg"
            alt="Twitter/X"
            className={styles.xIcon}
            width={80}
            height={80}
            priority
          />
        </Link>

        {/* Instagramアイコン */}
        <Link
          href={instagramUrl}
          target="_blank"
          className={styles.instagramBox}
        >
          <Image
            src="/instagram-icon.webp"
            alt="Instagram"
            className={styles.instagramIcon}
            width={80}
            height={80}
            priority
          />
        </Link>
      </div>

      {/* 新しいテキスト */}
      <p className={styles.additionalText}>
        自親会旧ホームページはこちらから! →
      </p>

      {/* くま画像 */}
      <div className={styles.kumaContainer}>
        <Link
          href={oldhomepageUrl}
          target="_blank"
        >
        <Image
          src="/kuma.png"
          alt="くま"
          className={styles.kuma}
          width={150}
          height={150}
          priority
        />
        </Link>
      </div>
    </div >
  );
};

export default SNSHolder;
