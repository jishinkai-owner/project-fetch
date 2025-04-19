import React from 'react';
import styles from './BreadCrumbs.module.scss';
import Link from 'next/link';

interface Props {
  breadcrumb?: {
    title: string;
    url?: string;
  }[];
}

const BreadCrumbs: React.FC<Props> = ({ breadcrumb }) => {
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
    </>
  );
};

export default BreadCrumbs;
