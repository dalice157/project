import React, { Component } from 'react';
import { uaIsMobile, } from 'react-device-detect';
import { Button } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import decoLeft from '../../img/common_v2/blue-deco-left.svg';
import decoRight from '../../img/common_v2/blue-deco-right.svg';
import Steps from '../../components/home_v2/Steps';
import titleImg from '../../img/common_v2/icon-title.svg';
import FindCard from '../../components/home_v2/FindCard.js';
import { caseData, caseStep } from '../../config/homeData.js';
import styles from './FindCase.scss';

class FindCase extends Component {
  render() {
    const isMobile = uaIsMobile() ? styles.mobile : '';
    return (
      <>
        <div className={`${styles.wrap} ${isMobile}`}>
          <h2 className={styles.title}>
            <img src={decoLeft} alt="left標題" />三步驟免費發案，接案人才立即應徵<img src={decoRight} alt="right標題" />
          </h2>
          <Steps data={caseStep} />
          <div className={styles.btnWrap}>
            <Button size="large" type="primary" data-gtm-index="post-外包案件"><Link to="/caseForm">免費發案</Link></Button>
          </div>
        </div>
        <div className={`${styles.tagsWrap} ${isMobile}`}>
          <h3 className={styles.title}><img src={titleImg} alt="標題" /> 來自各領域的接案人才，為您提供專業服務 <img src={titleImg} alt="標題" /></h3>
          <h4 className={styles.substandard}>從創意設計、翻譯編輯、社群行銷到程式開發等，只要您想得到的技能服務，在104高手通通有！</h4>
          <FindCard data={caseData} btnLink="/search" dataGtmIndex="more-接案人才" />
        </div>
      </>
    );
  }
}

export default withRouter(FindCase);
