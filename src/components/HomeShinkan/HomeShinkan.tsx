import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeShinkan.module.scss";

const DUMMY_PHOTO = "/Climbing2.webp";

const HomeShinkan: React.FC = () => {
  return (
    <Link href="/shinkan" className={styles.container}>
      <div className={styles.Frontimagecontainer}>
        <Image
          src={DUMMY_PHOTO}
          alt="新歓情報（仮画像）"
          className={styles.image}
          width={1000}
          height={600}
        />
        <div className={styles.triangletop}></div>
        <div className={styles.trianglebuttom}></div>
        <div className={styles.Middleimagecontainer}>
          <Image
            src={DUMMY_PHOTO}
            alt=""
            className={styles.image}
            width={1000}
            height={600}
          />
        </div>
        <div className={styles.Backimagecontainer}>
          <Image
            src={DUMMY_PHOTO}
            alt=""
            className={styles.image}
            width={1000}
            height={600}
          />
        </div>
        <Image
          src="/Shinkan.svg"
          alt="新歓情報"
          className={styles.sticker}
          width={2000}
          height={500}
        />
      </div>
    </Link>
  );
};

export default HomeShinkan;
