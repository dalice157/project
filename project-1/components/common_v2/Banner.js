import React from 'react';
import { uaIsMobile } from 'react-device-detect';
import styles from './Banner.scss';

const Banner = ({
  link, img, imgMp, title
}) => {
  const getImg = uaIsMobile() ? imgMp : img;
  return (
    <div className={styles.wrap}>
      <a target="_blank" href={link}>
        <img src={getImg} alt={title} />
      </a>
    </div>
  );
};
export default Banner;
