import React, { Component } from 'react';
import { uaIsMobile, } from 'react-device-detect';
import { withRouter, Link } from 'react-router-dom';
import { Button } from 'antd';
import decoLeft from '../../img/common_v2/blue-deco-left.svg';
import decoRight from '../../img/common_v2/blue-deco-right.svg';
import Steps from '../../components/home_v2/Steps';
import titleImg from '../../img/common_v2/icon-title.svg';
import FindCard from '../../components/home_v2/FindCard.js';
import { teacherData, teacherStep } from '../../config/homeData.js';
import styles from './FindTeacher.scss';

class FindTeacher extends Component {
  render() {
    const isMobile = uaIsMobile() ? styles.mobile : '';
    return (
      <div className={`${styles.wrap} ${isMobile}`}>
        <h2 className={styles.title}>
          <img src={decoLeft} alt="left標題" />三步驟免費發案，家教老師立即應徵<img src={decoRight} alt="right標題" />
        </h2>
        <Steps data={teacherStep} />
        <div className={styles.btnWrap}>
          <Button size="large" type="primary" data-gtm-index="post-家教老師"><Link to="/caseForm">免費發案</Link></Button>
        </div>
        <h3 className={styles.title}><img src={titleImg} alt="標題" /> 來自各領域的專業師資 <img src={titleImg} alt="標題" /></h3>
        <h4 className={styles.substandard}>無論您想加強孩子的學科、精進外語能力或是學才藝，104高手應有盡有！</h4>
        <FindCard data={teacherData} btnLink="/search-tutor" />
      </div>
    );
  }
}

export default withRouter(FindTeacher);
