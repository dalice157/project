import React, { Component } from 'react';
import { uaIsMobile, } from 'react-device-detect';
import decoLeft from '../../img/common_v2/blue-deco-left.svg';
import decoRight from '../../img/common_v2/blue-deco-right.svg';
import FindCard from '../../components/home_v2/FindCard.js';
import { caseData } from '../../config/homeData.js';
import styles from './TakeCase.scss';

class TakeCase extends Component {
  render() {
    const isMobile = uaIsMobile() ? styles.mobile : '';
    return (
      <div className={`${styles.wrap} ${isMobile}`}>
        <h2 className={styles.title}><img src={decoLeft} alt="標題" /> 多元案件類別 <img src={decoRight} alt="標題" /></h2>
        <h3 className={styles.substandard}>從創意設計、翻譯編輯、社群行銷到程式開發等，我們提供各種類型的案件需求，立即成為高手，為自己加薪！</h3>
        <FindCard data={caseData} btnLink="/caseList" dataGtmIndex="more-外包案件" />
      </div>
    );
  }
}

export default TakeCase;
