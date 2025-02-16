"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Menu.module.scss';

const Menu: React.FC = () => {
  const router = useRouter();
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return (
    <div className={styles.container}>
        <div className={styles.imagecontainer}>
            <Image 
                src="/Record.svg" 
                alt="活動記録" 
                className={styles.Recordimage}
                width={100}
                height={50}
                priority
                onClick={() => handleNavigate('/record')}
                style={{ cursor: 'pointer' }}
            />
            <Image 
                src="/Qa.svg" 
                alt="Q&A" 
                className={styles.Qaimage}
                width={200}
                height={100}
                priority
                onClick={() => handleNavigate('/qa')}
                style={{ cursor: 'pointer' }}
            />
            <Image 
                src="/Member.svg" 
                alt="member" 
                className={styles.Memberimage}
                width={200}
                height={100}
                priority
                onClick={() => handleNavigate('/member')}
                style={{ cursor: 'pointer' }}
            />
            <Image 
                src="/Shinkan.svg" 
                alt="新歓情報" 
                className={styles.Shinkanimage}
                width={200}
                height={50}
                priority
                onClick={() => handleNavigate('/shinkan')}
                style={{ cursor: 'pointer' }}
            />
            <Image 
                src="/login.webp" 
                alt="ログイン" 
                className={styles.Loginimage}
                width={190}
                height={190}
                priority
            />
        </div>
    </div>
  );
};

export default Menu;