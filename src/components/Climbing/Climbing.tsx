"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Climbing.module.scss';

const Climbing: React.FC = () => {
  const router = useRouter(); // useRouterフックの使用

  const navigateToClimbing = (category: string) => {
    router.push(`/record?case=${category}`); // 遷移先のパスを指定
  };

  return (
    <div>
      <div className={styles.container} onClick={() => navigateToClimbing("山行記録")}>
        <div className={styles.Frontimagecontainer}>
          <Image 
            src="/山行記録.webp" 
            alt="山の風景" 
            className={styles.image}
            width={1000} // 必要な幅を指定
            height={600} // 必要な高さを指定
            priority // LCP改善のために優先的にロード
          />
          <div className={styles.triangletop}></div>
          <div className={styles.trianglebuttom}></div>
          <div className={styles.Middleimagecontainer}>
            <Image 
              src="/Climbing2.webp" 
              alt="山の風景" 
              className={styles.image}
              width={1000} // 必要な幅を指定
              height={600} // 必要な高さを指定
              priority // LCP改善のために優先的にロード
            />
          </div>  
          <div className={styles.Backimagecontainer}>
            <Image 
              src="/Climbing3.webp" 
              alt="山の風景" 
              className={styles.image}
              width={1000} // 必要な幅を指定
              height={600} // 必要な高さを指定
              priority // LCP改善のために優先的にロード
            />
          </div>
          <Image 
            src="/Mountain.svg" 
            alt="山のアイコン" 
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

export default Climbing;