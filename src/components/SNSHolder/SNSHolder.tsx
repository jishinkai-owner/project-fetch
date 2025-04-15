"use client";

import React from 'react';
import Image from 'next/image';
import styles from './SNSHolder.module.scss';

interface SNSHolderProps {
  className?: string;
  twitterUrl?: string;
  instagramUrl?: string;
}

const SNSHolder: React.FC<SNSHolderProps> = ({ 
  className, 
  twitterUrl = "https://x.com/jishinkai", 
  instagramUrl = "https://www.instagram.com/jishinkai_tohoku" 
}) => {
  
  const handleTwitterClick = () => {
    window.open(twitterUrl, '_blank');
  };

  const handleInstagramClick = () => {
    window.open(instagramUrl, '_blank');
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* 右上のピン */}
      <div className={styles.PinTopRight}></div>
      
      {/* 左下のピン */}
      <div className={styles.PinBottomLeft}></div>
      
      {/* SNSアイコンのコンテナ */}
      <div className={styles.iconsContainer}>
        {/* Twitter(X)アイコン */}
        <div className={styles.twitterBox} onClick={handleTwitterClick}>
          <Image 
            src="/x-icon.svg" 
            alt="Twitter/X" 
            className={styles.xIcon}
            width={80}
            height={80}
            priority
          />
        </div>
        
        {/* Instagramアイコン */}
        <div className={styles.instagramBox} onClick={handleInstagramClick}>
          <Image 
            src="/instagram-icon.svg" 
            alt="Instagram" 
            className={styles.instagramIcon}
            width={80}
            height={80}
            priority
          />
        </div>
      </div>
      
      {/* くま画像 */}
      <div className={styles.kumaContainer}>
        <Image 
          src="/kuma.png" 
          alt="くま" 
          className={styles.kuma}
          width={150}
          height={150}
          priority
        />
      </div>
    </div>
  );
};

export default SNSHolder;