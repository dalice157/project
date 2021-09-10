import React, { PureComponent } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Rate, Avatar } from 'antd';
import { ChevronRight } from '@material-ui/icons';
import { experienceData } from '../../config/selectData.js';
import { showText, rateAllowHalf } from '../../util/commonUtil';
import config from '../../config/config';
import defaultImg from '../../img/common_v2/avatar-default-round.svg';
import styles from './PopularCard.scss';

class PopularCard extends PureComponent {
  render() {
    const { data, type } = this.props;
    const {
      demandTitle, img, topperId, reviewScore, profileName, area, exp, reviewComment, gigId, dataGtmjoin,
    } = data;
    const isChoose = (type === 'join' && !uaIsMobile());
    const isStyle = isChoose ? styles.join : '';
    const textShow = (type === 'join' || uaIsMobile()) ? '本次評價' : '本次評價星數';
    const getLink = `${config.topSite.domain}/service/${topperId}?gigId=${gigId}`;
    const isImg = img === null ? defaultImg : img;
    const getReviewScoreVal = rateAllowHalf(reviewScore);
    const gtmAttrObj = {
      teacher: '家教成功案例',
      case: '外包成功案例',
      join: dataGtmjoin,
    };
    return (
      <div className={`${styles.wrap} ${isStyle}`}>
        <a href={getLink} target="_blank" data-gtm-join={gtmAttrObj[type]} rel="noreferrer">
          <div className={styles.line}>
            <div className={styles.triangle} />
          </div>
          <h4 className={styles.title}>{demandTitle}</h4>
          <div className={styles.rateWrap}>
            <span className={styles.title}>{textShow}</span>
            <Rate allowHalf disabled value={getReviewScoreVal || 0} />
            <span className={styles.no}>{reviewScore}</span>
          </div>
          <div className={styles.topperInfo}>
            <div className={styles.img}>
              <Avatar size={42} src={isImg} alt={profileName} icon="user" />
            </div>
            <div className={styles.infoWrap}>
              <div className={styles.title}>執案高手</div>
              <div className={styles.name}>{profileName}</div>
            </div>
          </div>
          <div className={styles.info}>
            {area}
            {' '}
            ｜
            {' '}
            { showText(experienceData, exp) }
            經驗
          </div>
          <div className={styles.desc}>
            { reviewComment }
          </div>
          <div className={styles.link}>
            查看完整服務
            <ChevronRight />
          </div>
        </a>
      </div>
    );
  }
}

export default PopularCard;
