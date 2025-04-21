import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Menu.module.scss';

interface MenuProps {
  onClick?: (path: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onClick }) => {
  // メニュー項目のリスト（管理を容易にするために配列化）
  const menuItems = [
    { path: '/record', src: '/Record.svg', alt: '活動記録', className: styles.Recordimage, width: 200, height: 50 },
    { path: '/qa', src: '/Qa.svg', alt: 'Q&A', className: styles.Qaimage, width: 200, height: 100 },
    { path: '/member', src: '/Member.svg', alt: 'member', className: styles.Memberimage, width: 200, height: 100 },
    { path: '/shinkan', src: '/Shinkan.svg', alt: '新歓情報', className: styles.Shinkanimage, width: 200, height: 50 },
    { path: '/login', src: '/login.webp', alt: 'ログイン', className: styles.Loginimage, width: 200, height: 200 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.imagecontainer}>
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.path}
            onClick={() => onClick && onClick(item.path)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              className={item.className}
              width={item.width}
              height={item.height}
              priority
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;