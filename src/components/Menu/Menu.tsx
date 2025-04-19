import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Menu.module.scss';

const Menu: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imagecontainer}>
        <Link href="/record">
          <Image
            src="/Record.svg"
            alt="活動記録"
            className={styles.Recordimage}
            width={100}
            height={50}
            priority
          />
        </Link>
        <Link href="/qa">
          <Image
            src="/Qa.svg"
            alt="Q&A"
            className={styles.Qaimage}
            width={200}
            height={100}
            priority
          />
        </Link>
        <Link href="/member">
          <Image
            src="/Member.svg"
            alt="member"
            className={styles.Memberimage}
            width={200}
            height={100}
            priority
          />
        </Link>
        <Link href="/shinkan">
          <Image
            src="/Shinkan.svg"
            alt="新歓情報"
            className={styles.Shinkanimage}
            width={200}
            height={50}
            priority
          />
        </Link>
        <Link href="/shinkan">
          <Image
            src="/login.webp"
            alt="ログイン"
            className={styles.Loginimage}
            width={200}
            height={200}
            priority
          />
        </Link>
      </div>
    </div>
  );
};

export default Menu;