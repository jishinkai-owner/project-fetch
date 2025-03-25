"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Image from "next/image";
import Climbing from "@/components/Climbing/Climbing";
import Fishing from "@/components/Fishing/Fishing";
import Traveling from "@/components/Traveling/Traveling";
import Menu from "@/components/Menu/Menu";

const Page: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <div className={styles.recordcontainer}>
          <Image
            src="/jishinkaiboard.svg"
            alt="自親会の看板"
            className={styles.board}
            width={600}
            height={200}
            priority
          />
          <div className={styles.Climbing}>
            <Climbing />
          </div>
          <div className={styles.Traveling}>
            <Traveling />
          </div>
          <div className={styles.Fishing}>
            <Fishing />
          </div>
        </div>
        {/* <div className={styles.mascot}>
          <Image
            src="/login.webp"
            alt="自親会のキャラクター"
            className={styles.character}
            width={200}
            height={400}
            priority
          />
          <div className={styles.speechBalloon}>
            Hello! Welcome to our club website!
          </div>
          <Image
            src="/Fukidashi.svg"
            alt="自親会の吹き出し"
            className={styles.balloon}
            width={600}
            height={800}
          />
        </div> */}
      </div>

      <button className={styles.hamburgerButton} onClick={toggleMenu}>
        ☰
      </button>

      <div
        className={`${styles.paperContainer} ${isMenuOpen ? styles.open : ""}`}
      >
        <Menu onClick={handleNavigate} />
      </div>
    </div>
  );
};

export default Page;
