import React from 'react';
import styles from './TabBar.module.scss';
import Link from 'next/link';

interface Props {
  tabs?: {
    title: string;
    icon: string;
    url: string | VoidFunction;
    isCurrent?: boolean;
  }[];
}
const TabBar: React.FC<Props> = ({ tabs }) => {
  return (
    <>
      {/* カテゴリ選択タブ */}
      <div className={styles.tabContainer}>
        {tabs && tabs.map((tab, index) => typeof tab.url === 'string' ? (
          <Link
            key={index}
            href={tab.url}
            className={`${styles.tab} ${tab.isCurrent ? styles.activeTab : ''}`}
          >
            <span className={styles.placeIcon}>{tab.icon}</span> {tab.title}
          </Link>
        ) : (
          <button
            key={index}
            onClick={tab.url}
            className={`${styles.tab} ${tab.isCurrent ? styles.activeTab : ''}`}
          >
            <span className={styles.placeIcon}>{tab.icon}</span> {tab.title}
          </button>
        ))}
      </div>
    </>
  );
};

export default TabBar;
