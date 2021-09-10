import React from 'react';
import { ArrowDownward } from '@material-ui/icons';
import styles from './ScrollDown.scss';

const ScrollDown = ({ scrollMessageDown, isMobile, isUserScrollToBottom }) => {
  const isStyleMobile = isMobile ? styles.mobile : '';
  if (!isUserScrollToBottom) {
    return (
      <div className={`${styles.goDown} ${isStyleMobile}`} onClick={scrollMessageDown}>
        <ArrowDownward />
      </div>
    );
  } else {
    return <></>;
  }
};

export default ScrollDown;
