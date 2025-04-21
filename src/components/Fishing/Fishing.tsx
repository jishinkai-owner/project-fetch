import React from 'react';
import Image from 'next/image';
import styles from './Fishing.module.scss';
import Link from 'next/link';
interface FishingProps {
  className?: string;
}

const Fishing: React.FC<FishingProps> = () => {
  return (
    <Link href={`/record/tsuri`} className={styles.container}>
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
    </Link>
  );
};

export default Fishing;