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
  twitterUrl = "https://twitter.com/your-account", 
  instagramUrl = "https://instagram.com/your-account" 
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
      
      {/* 大きなInstagramロゴ（背景） */}
      
      
      {/* アイコンのラッパー - 左上に配置 */}
      <div className={styles.iconWrapper}>
        {/* Twitter(X)アイコン - 黒背景 */}
        <div className={styles.iconContainer}>
            <div 
            className={styles.twitterContainer}
            onClick={handleTwitterClick}
            >
                <Image 
                    src="/x-icon.svg" 
                    alt="Twitter/X" 
                    className={styles.icon}
                    width={44}
                    height={44}
                    priority
                />
            </div>
            <div 
            className={styles.instagramContainer} 
            onClick={handleInstagramClick}
            >
                <Image 
                    src="/instagram-icon.svg" 
                    alt="Instagram" 
                    className={styles.icon}
                    width={60}
                    height={60}
                    priority
                />
            </div>
          
        </div>      
      </div>
      
      {/* くまの画像 - kuma.pngを使用 */}
      <div className={styles.kumaWrapper}>
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