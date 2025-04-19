import React from 'react';
import styles from './MainHeader.module.scss';
import Link from 'next/link';

interface Props {
  breadcrumb?: {
    title: string;
    url?: string;
  }[];
  title: string;
}
const MainHeader: React.FC<Props> = ({ breadcrumb, title }) => {
  return (
    <>
      {/* ナビゲーション */}
      <nav className={styles.breadcrumb}>
        {breadcrumb && breadcrumb.map((item, index) => (
          <span key={index}>
            {item.url ? (
              <Link href={item.url}>{item.title}</Link>
            ) : (
              <span>{item.title}</span>
            )}
            {index < breadcrumb.length - 1 && (
              <span> &gt; </span>
            )}
          </span>
        ))}
      </nav>
      <h1 className={styles.circleTitle}>{title}</h1>
    </>
  );
};

export default MainHeader;
