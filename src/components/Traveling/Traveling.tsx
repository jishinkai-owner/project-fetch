"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Traveling.module.scss';

const Traveling: React.FC = () => {
  const router = useRouter();

  const navigateToTraveling = (category: string) => {
    router.push(`/record?case=${category}`);
  };

  return (
    <div>
      <div className={styles.container} onClick={() => navigateToTraveling("旅行記録")}>
        <div className={styles.Frontimagecontainer}>
          <Image 
            src="/旅行記録.webp" 
            alt="旅行の風景" 
            className={styles.image}
            width={1000}
            height={600}
            priority
          />
          <div className={styles.triangletop}></div>
          <div className={styles.trianglebuttom}></div>
          <div className={styles.Middleimagecontainer}>
            <Image 
              src="/Traveling2.webp" 
              alt="旅行の風景" 
              className={styles.image}
              width={1000}
              height={600}
              priority
            />
          </div>  
          <div className={styles.Backimagecontainer}>
            <Image 
              src="/Traveling3.webp" 
              alt="旅行の風景" 
              className={styles.image}
              width={1000}
              height={600}
              priority
            />
          </div>
          <Image 
            src="/Traveling.svg" 
            alt="旅行のアイコン" 
            className={styles.sticker}
            width={2000}
            height={2000}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Traveling;