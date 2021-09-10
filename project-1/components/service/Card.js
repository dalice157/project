import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { uaIsMobile } from 'react-device-detect';
import {
  School, Room, Star, Favorite, FavoriteBorder, Schedule
} from '@material-ui/icons';
import { Card } from 'antd';
import { showAreaText, showText } from '../../util/commonUtil';
import styles from './Card.scss';

import {
  experienceData, priceType
} from '../../config/selectData.js';

class CardWarp extends Component {
  onAddFavorite = (gigId) => {
    this.props.chkActiveProcess().then((resp) => {
      if (resp.payload.success) {
        this.props.addFavorite(gigId);
      }
    });
  };

  onRemoveFavorite = (favoriteId) => {
    this.props.chkActiveProcess().then((resp) => {
      if (resp.payload.success) {
        this.props.removeFavorite(favoriteId);
      }
    });
  };

  render() {
    const {
      areaData, basicId, reviewScore, reviewCount, gigId, title, expCat, areaCats, price, unit, favoriteId, basic, catNo
    } = this.props;
    const isReviewScore = reviewScore || 0;
    const isReviewCount = reviewCount || 0;
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    const isCatNo = (catNo && catNo != 'undefined') ? catNo : '1000000';
    const areaText = (areaData && areaData.length !== 0 && areaCats !== 0) ? showAreaText(areaData, areaCats) : '';
    return (
      <>
        <div className={`${styles.card} ${isMobileStyle}`} onClick={() => { open(`/service/${basicId}?gigId=${gigId}&cats=${isCatNo}`, '_self'); }}>
          <Card key={gigId} bordered={false}>
            <div className={styles.tutor} />
            <span className={styles.title}>{title}</span>
            <div className={styles.userAttr}>
              <Schedule /><span className={styles.text}>{showText(experienceData, expCat)}</span>
            </div>
            {
              basic.edu
              && (
                <div className={styles.userAttr}>
                  <School />
                  {basic.edu ? (<span className={styles.text}>{basic.edu.schoolName} - {basic.edu.majorName}</span>) : <span className={styles.text}>未填寫</span>}
                </div>
              )
            }
            <div className={styles.userAttr}>
              <Room /><span className={`${styles.text} ${styles.area}`}>{areaText}</span>
            </div>
            <div className={styles.description}>
              {reviewScore ? (
                <div className={styles.starWarp}>
                  <Star /><span className={styles.star}>{isReviewScore}</span>(
                  { isReviewCount})
                </div>
              ) : ''}
              <div className={styles.cash}>NT$
                {price}<span className={styles.textSmall}> 起 {priceType[unit] === '時薪' && '/ hr'}</span>
              </div>
            </div>
            {
              favoriteId
                ? (
                  <div
                    className={styles.favoritIcon}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.onRemoveFavorite(favoriteId);
                    }}
                  >
                    <Favorite style={{ color: '#ff6363' }} />
                  </div>
                )
                : (
                  <div
                    className={styles.favoritIcon}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.onAddFavorite(gigId);
                    }}
                  >
                    <FavoriteBorder style={{ color: '#aaa' }} />
                  </div>
                )
              }
          </Card>
        </div>
      </>
    );
  }
}

export default withRouter(CardWarp);
