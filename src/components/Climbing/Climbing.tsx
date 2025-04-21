import React from 'react';
import Image from 'next/image';
import styles from './Climbing.module.scss';
import Link from 'next/link';

interface ClimbingProps {
  className?: string;
}
const Climbing: React.FC<ClimbingProps> = () => {
  return (
    <Link href={`/record/yama`} className={styles.container}>
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
    </Link>
  );
};

export default Climbing;