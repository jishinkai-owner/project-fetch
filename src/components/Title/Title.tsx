import React from 'react';
import styles from './Title.module.scss';

interface Props {
  title: string;
}
const Title: React.FC<Props> = ({ title }) => {
  return (
    <h1 className={styles.circleTitle}>{title}</h1>
  );
};

export default Title;
