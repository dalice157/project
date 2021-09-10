import React from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { Card, Comment, Tooltip } from 'antd';
import {
  School, Room, Star, Favorite, FavoriteBorder, Schedule,
} from '@material-ui/icons';
import { imgUrlByfileMap } from '../../util/fileMapUtil.js';
import { experienceData } from '../../config/selectData.js';
import { showText } from '../../util/commonUtil';
import bronze from '../../img/common_v2/badge-bronze.png';
import gold from '../../img/common_v2/badge-gold.png';
import silver from '../../img/common_v2/badge-silver.png';
import Avatar from '../ui/avatar';
import styles from './Card.scss';

const gigCard = ({
  isTutor, card, fileMap, areaData, loading, showAreaText, addFavoriteGig, removeFavoriteGig, chkActiveProcess,
}) => {
  const {
    gigId, coverPic, basic, basicId, reviewScore, reviewCount, title, desc,
    price, unit, expCat, areaCats, dealCount, favoriteId, medal, activeInSevenDays,
  } = card;
  console.log('card:', card);
  const isMobile = uaIsMobile();
  const badges = new Map([
    [1, [{
      img: silver,
      alt: '銀牌',
      title: '至少完成3次合作，且整體評價4顆星以上的高手',
    }]],
    [2, [{
      img: gold,
      alt: '金牌',
      title: '至少完成10次合作，且整體評價4.5顆星以上的高手',
    }]],
  ]);
  const badge = badges.get(medal);
  const getTooltipTrigger = uaIsMobile() ? 'click' : 'hover';
  const isMobileCard = isMobile ? styles.mobile : '';
  if (Object.keys(card).length === 0) {
    return (
      <div className={`${styles.cardWrap} ${isMobileCard}`}>
        <Card
          className={styles.card}
          loading={loading}
          actions={[
            <Comment
              author={null}
              avatar={<Avatar size={38} userImg={null} />}
              content=""
            />,
          ]}
        />
      </div>
    );
  }
  const isReviewScore = reviewScore || 0;
  const isReviewCount = reviewCount || 0;
  const {
    avatarFileUrls, userName, edu, pid,
  } = basic;
  const isInvalid = (title === null && price === null);
  if (isInvalid) {
    return (
      <div className={`${styles.cardWrap} ${styles.disableCard} ${isMobileCard}`}>
        {/* 顯示gig的圖片 */}
        <Card
          className={styles.card}
          loading={loading}
          cover={<img alt={desc} src={imgUrlByfileMap(coverPic, fileMap)} />}
          actions={[
            <Comment
              author={userName}
              avatar={<Avatar size={38} userImg={null} />}
              content=""
            />,
          ]}
        >
          {/* 判斷是否為家教來渲染 */}
          {
        isTutor
          && (
            <div className={styles.tutor} />
          )
        }
          {/* gig的資料 */}
          <span className={styles.title}>服務已失效</span>
          <div className={styles.userAttr}>
            <School />
            <span className={styles.text}> - </span>
          </div>
          {
          isTutor
              && (
              <div className={styles.userAttr}>
                <School />
                -
              </div>
              )
        }
          {
          isTutor && (
          <div className={styles.userAttr}>
            <Room />
            <span className={`${styles.text} ${styles.area}`}> - </span>
          </div>
          )
        }
          <div className={styles.description}>
            <div className={styles.starWarp}>
              <Star />
              {' '}
              -
            </div>
            <div className={styles.disableService}>服務已下架</div>
          </div>
          <div className={styles.pick}>
            {/* 收藏狀態 */}
            {
              favoriteId
                ? <Favorite style={{ color: '#ff6363' }} onClick={(event) => { event.stopPropagation(); chkActiveProcess().then(() => removeFavoriteGig(favoriteId)); }} />
                : <FavoriteBorder style={{ color: '#aaa' }} onClick={(event) => { event.stopPropagation(); chkActiveProcess().then(() => addFavoriteGig(gigId)); }} />
            }
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className={`${styles.cardWrap} ${isMobileCard}`}>
      <Link to={`/service/${basicId}?gigId=${gigId}`} target="_blank">
        {/* 顯示gig的圖片 */}
        <Card
          className={styles.card}
          loading={loading}
          cover={<img alt={desc} src={imgUrlByfileMap(coverPic, fileMap)} />}
          actions={[
            <Comment
              author=""
              avatar={<Avatar size={38} userImg={avatarFileUrls ? avatarFileUrls.avatarWeb : null} alt={userName} />}
              content={(
                <>
                  <div className={styles.userInfo}>
                    <div className={styles.author}>
                      <span className={styles.authorName}>{userName}</span>
                    </div>
                    {
                    dealCount ? (
                      <>
                        合作數
                        {' '}
                        <span className={styles.dealCount}>{dealCount}</span>
                        {' '}
                        筆
                      </>
                    ) : '積極尋求合作機會'
                  }
                  </div>
                  <div className={styles.badgeInfo}>
                    {
                    medal !== 0 && (
                      <Tooltip trigger={getTooltipTrigger} title={badge[0].title}>
                        <img src={badge[0].img} alt={badge[0].alt} />
                      </Tooltip>
                    )
                  }

                    {
                    activeInSevenDays && (
                    <Tooltip placement="topRight" trigger={getTooltipTrigger} title="活耀於高手網站，積極應徵展現接案意願">
                      <img src={bronze} alt="活躍" />
                    </Tooltip>
                    )
                  }
                  </div>
                </>
            )}
            />,
          ]}
        >
          {/* 判斷是否為家教來渲染 */}
          {
        isTutor
          && (
            <div className={styles.tutor} />
          )
        }
          {/* gig的資料 */}
          <span className={styles.title}>{title}</span>
          <div className={styles.userAttr}>
            <Schedule />
            <span className={styles.text}>{showText(experienceData, expCat)}</span>
          </div>
          {
          isTutor
              && (
              <div className={styles.userAttr}>
                <School />
                {edu ? (
                  <span className={styles.text}>
                    {edu.schoolName}
                    {' '}
                    -
                    {' '}
                    {edu.majorName}
                  </span>
                ) : <span className={styles.text}>未填寫</span>}
              </div>
              )
        }
          {
          isTutor && (
          <div className={styles.userAttr}>
            <Room />
            <span className={`${styles.text} ${styles.area}`}>{showAreaText(areaData, areaCats)}</span>
          </div>
          )
        }
          <div className={styles.description}>
            {
              reviewScore ? (
                <div className={styles.starWarp}>
                  <Star />
                  <span className={styles.star}>{ isReviewScore }</span>
                  (
                  { isReviewCount }
                  )
                </div>
              ) : ''
            }
            <div className={styles.cash}>
              NT$
              {price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
              <span className={styles.textSmall}>
                {' '}
                起
                {unit === 1 && '/ hr'}
              </span>
            </div>
          </div>
          <div className={styles.pick}>
            {/* 收藏狀態 */}
            {
              favoriteId
                ? <Favorite style={{ color: '#ff6363' }} onClick={(event) => { event.preventDefault(); chkActiveProcess().then(() => removeFavoriteGig(favoriteId)); }} />
                : <FavoriteBorder style={{ color: '#aaa' }} onClick={(event) => { event.preventDefault(); chkActiveProcess().then(() => addFavoriteGig(gigId)); }} />
            }
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default gigCard;
