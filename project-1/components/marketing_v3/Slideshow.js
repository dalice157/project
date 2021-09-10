/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import BeTopperButton from '../../containers/common_v2/BeTopperButton';
import styles from './Slideshow.scss';

class Slideshow extends Component {
  render() {
    return (
      <>
        <BrowserView>
          <div title="加入會員，立即開始接案" className={styles.bg}>
            <BeTopperButton text="免費註冊" isBanner={true} />
          </div>
        </BrowserView>
        <MobileView>
          <div title="加入會員，立即開始接案" className={styles.bg}>
            <BeTopperButton text="免費註冊" isBanner={true} />
          </div>
        </MobileView>
      </>
    );
  }
}

export default Slideshow;
