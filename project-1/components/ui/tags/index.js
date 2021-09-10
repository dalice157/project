import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './Tags.scss';

const Tags = memo((props) => {
  const { title, link } = props;
  return (
    <Link
      className={styles.link}
      to={link}
    >
      {title}
    </Link>
  );
});

export default Tags;
