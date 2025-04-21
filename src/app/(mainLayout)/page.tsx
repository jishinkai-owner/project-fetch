"use client";

import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import Climbing from "@/components/Climbing/Climbing";
import Fishing from "@/components/Fishing/Fishing";
import Traveling from "@/components/Traveling/Traveling";
import SNSHolder from "@/components/SNSHolder/SNSHolder";

const Page: React.FC = () => {
  return (
    <>
      <div className={styles.header}>
        <Image
          src="/jishinkaiboard.svg"
          alt="自親会の看板"
          className={styles.board}
          width={500}
          height={160}
          priority
        ></Image>
      </div>

      <div className={styles.recordcontainer}>
        <div className={styles.Climbing}><Climbing /></div>
        <div className={styles.Traveling}><Traveling /></div>
        <div className={styles.Fishing}><Fishing /></div>
        <div className={styles.SNSHolder}>
          <SNSHolder
            twitterUrl="https://x.com/jishinkai"
            instagramUrl="https://www.instagram.com/jishinkai_tohoku"
          />
        </div>
      </div>
    </>
  );
};

export default Page;
