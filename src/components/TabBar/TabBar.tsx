import React from 'react';
import styles from './TabBar.module.scss';
import Link from 'next/link';

interface Props {
  tabs?: {
    title: string;
    icon: string;
    url: string;
    isCurrent?: boolean;
  }[];
}
const TabBar: React.FC<Props> = ({ tabs }) => {
  return (
    <>
      {/* カテゴリ選択タブ */}
      <div className={styles.tabContainer}>
        {tabs && tabs.map((tab, index) => (
          <Link
            href={tab.url}
            className={`${styles.tab} ${tab.isCurrent ? styles.activeTab : ''}`}
            key={index}
          >
            <span className={styles.placeIcon}>{tab.icon}</span> {tab.title}
          </Link>
        ))}
      </div>
    </>
  );
};

export default TabBar;
