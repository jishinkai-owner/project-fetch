import React from 'react';
import Image from 'next/image';
import styles from './Traveling.module.scss';
import Link from 'next/link';

interface TravelingProps {
  className?: string;
}


const Traveling: React.FC<TravelingProps> = () => {
  return (
    <Link href={`/record/tabi`} className={styles.container}>
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
    </Link>
  );
};

export default Traveling;