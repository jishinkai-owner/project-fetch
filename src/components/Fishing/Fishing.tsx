"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Fishing.module.scss';

const Fishing: React.FC = () => {
  const router = useRouter();

  const navigateToFishing = (category: string) => {
    router.push(`/record?case=${category}`);
  };

  return (
      <div className={styles.container} onClick={() => navigateToFishing("釣行記録")}>
        <div className={styles.Frontimagecontainer}>
          <Image 
            src="/釣行記録.webp" 
            alt="釣りの風景" 
            className={styles.image}
            width={1000}
            height={600}
            priority
          />
          <div className={styles.triangletop}></div>
          <div className={styles.trianglebuttom}></div>
          <div className={styles.Middleimagecontainer}>
            <Image 
              src="/Fishing2.webp" 
              alt="釣りの風景" 
              className={styles.image}
              width={1000}
              height={600}
              priority
            />
          </div>  
          <div className={styles.Backimagecontainer}>
            <Image 
              src="/Fishing3.webp" 
              alt="釣りの風景" 
              className={styles.image}
              width={1000}
              height={600}
              priority
            />
          </div>
          <Image 
            src="/Fishing.svg" 
            alt="釣りのアイコン" 
            className={styles.sticker}
            width={2000} 
            height={2000} 
            priority
          />
      </div>
    </div>
  );
};

export default Fishing;