import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Spin } from 'antd';
import { moneyFormat } from '../../util/commonUtil';
import styles from './TutorCard.scss';
import config from '../../config/config';

class TutorCard extends Component {
  handleMaxCount = (list) => {
    const countList = list.map(element => element.applyCount);
    const maxCount = Math.max(...countList);
    return maxCount;
  }

  render() {
    const isMobile = uaIsMobile() ? styles.mobile : '';
    const { typeTitle, data } = this.props;
    const maxApplyCount = this.handleMaxCount(data);
    return (
      <div className={`${styles.wrap} ${isMobile}`}>
        <h2 className={styles.title}>{typeTitle}</h2>
        <div className={styles.line}>
          <div className={styles.triangle} />
        </div>
        <Spin spinning={data.length === 0} size="large">
          {
            data.map((item) => {
              const {
                demandId, maxPrice, title, applyCount, basicId,
              } = item;
              const link = `${config.topSite.domain}/caseInfo?basicId=${basicId}&demandId=${demandId}`;
              return (
                <a href={link} target="_blank" key={item.demandId} className={styles.list}>
                  {
                  (applyCount !== 0 && maxApplyCount === applyCount) ? (
                    <div className={styles.hot}>
                      熱門
                    </div>
                  ) : (<div className={`${styles.hot} ${styles.nopic}`} />)
                }
                  <div className={styles.infoWrap}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.footer}>
                      <div className={styles.price}>
                        預算
                        {' '}
                        <span className={styles.text}>
                          $
                          { moneyFormat(String(maxPrice)) }
                        </span>
                      </div>
                      <div className={styles.count}>
                        應徵數
                        {' '}
                        {applyCount}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          }
        </Spin>
      </div>
    );
  }
}

export default TutorCard;
