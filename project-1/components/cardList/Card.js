import React from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Card, Comment, Tooltip } from 'antd';
import {
  Star, Favorite, FavoriteBorder, Schedule, School, Room,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { imgUrlByfileMap } from '../../util/fileMapUtil.js';
import { experienceData } from '../../config/selectData.js';
import { showText } from '../../util/commonUtil';
import bronze from '../../img/common_v2/badge-bronze.png';
import gold from '../../img/common_v2/badge-gold.png';
import silver from '../../img/common_v2/badge-silver.png';
import Avatar from '../ui/avatar';
import styles from './Card.scss';

const ContentFooter = ({
  dealCount, userName, medal, activeInSevenDays,
}) => {
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
  return (
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
  );
};

const gigCard = ({
  isTutor, card, fileMap, areaData, loading, showAreaText,
  addFavoriteGig, removeFavoriteGig, catNo, chkActiveProcess, location,
}) => {
  const {
    gigId, coverPic, basic, basicId, reviewScore, reviewCount, medal, activeInSevenDays,
    title, desc, price, unit, expCat, areaCats, dealCount, favoriteId,
  } = card;
  const isMobileCard = uaIsMobile() ? styles.mobile : '';
  const isReviewScore = reviewScore || 0;
  const isReviewCount = reviewCount || 0;
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

  const {
    avatarFileUrls, userName, edu,
  } = basic;
  const params = location.query;
  const stickerMode = params && params.stickerMode && !uaIsMobile() ? styles.stickerMobile : '';

  return (
    <div className={`${styles.cardWrap} ${isMobileCard}`}>
      <Link to={`/service/${basicId}?gigId=${gigId}${catNo ? `&cats=${catNo}` : ''}`} target="_blank">
        {/* 顯示gig的圖片 */}
        <Card
          className={`${styles.card} ${stickerMode}`}
          loading={loading}
          cover={!isTutor && <img alt={desc || userName} src={imgUrlByfileMap(coverPic, fileMap)} />}
          actions={[
            <Comment
              author=""
              avatar={<Avatar size={38} userImg={avatarFileUrls ? avatarFileUrls.avatarWeb : null} alt={userName} />}
              content={(
                <>
                  <ContentFooter
                    dealCount={dealCount}
                    userName={userName}
                    medal={medal}
                    activeInSevenDays={activeInSevenDays}
                  />
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
            <span className={styles.icon}><Schedule /></span>
            <span className={styles.text}>{showText(experienceData, expCat)}</span>
          </div>
          {
          isTutor
          && (
            <div className={styles.userAttr}>
              <span className={styles.icon}>
                <School />
              </span>
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
            <span className={styles.icon}><Room /></span>
            <span className={`${styles.text} ${styles.area}`}>{showAreaText(areaData, areaCats)}</span>
          </div>
          )
        }
          <div className={styles.description}>
            {
            reviewScore ? (
              <div className={styles.starWarp}>
                <Star />
                <span className={styles.star}>{isReviewScore}</span>
                (
                { isReviewCount}
                )
              </div>
            ) : ''
          }
            <div className={styles.cash}>
              NT
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
