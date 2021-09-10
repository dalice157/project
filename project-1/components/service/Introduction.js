/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';
import {
  Star, Favorite, FavoriteBorder
} from '@material-ui/icons';
import { Tag } from 'antd';
import { imgUrlByfileMap } from '../../util/fileMapUtil.js';
import {
  targetData, methodData, experienceData, priorityData, priceType
} from '../../config/selectData.js';
import { showAreaText, showText, showArrayText } from '../../util/commonUtil';
import { showCat } from '../../util/lablesUtils.js';
import CreateMarkup from '../common_v2/CreateMarkup';

import Avatar from '../ui/avatar';
import Button from '../ui/button';
import styles from './Introduction.scss';


function showCatTags(arr, handelSearch) {
  let _rootKey = null;
  let _midKey = null;
  let _Key = null;
  let result = null;
  for (let key of arr) {
    let rootKey = null;
    let midKey = null;
    if (key % 1000 === 0) {
      rootKey = Math.floor(key / 1000000) * 1000000;
    } else {
      rootKey = Math.floor(key / 1000000) * 1000000;
      midKey = Math.floor(key / 1000) * 1000;
    }

    if (_rootKey) {
      result = (
        <>
          <a onClick={() => handelSearch(_rootKey, true)}>
            <Tag color="blue" key={_rootKey} itemProp="tag" property="article:tag">
              {showCat(_rootKey)}
            </Tag>
          </a>
          {_midKey && (
            <a onClick={() => handelSearch(_midKey, true)}>
              <Tag color="blue" key={_midKey} itemProp="tag" property="article:tag">
                {showCat(_midKey)}
              </Tag>
            </a>
          )}
          <a onClick={() => handelSearch(_Key, true)}>
            <Tag color="blue" key={_Key} itemProp="tag" property="article:tag">
              {showCat(_Key)}
            </Tag>
          </a>
          {_rootKey !== rootKey && (
            <a onClick={() => handelSearch(rootKey, true)}>
              <Tag color="blue" key={rootKey} itemProp="tag" property="article:tag">
                {showCat(rootKey)}
              </Tag>
            </a>
          )}
          {midKey && _midKey !== midKey && (
            <a onClick={() => handelSearch(midKey, true)}>
              <Tag color="blue" key={midKey} itemProp="tag" property="article:tag">
                {showCat(midKey)}
              </Tag>
            </a>
          )}
          <a onClick={() => handelSearch(key, true)}>
            <Tag color="blue" key={key} itemProp="tag" property="article:tag">
              {showCat(key)}
            </Tag>
          </a>
        </>
      );
    }

    if (!_rootKey) { _rootKey = rootKey; }
    if (!_midKey) { _midKey = midKey; }
    if (!_Key) { _Key = key; }
  }

  if (!result) {
    result = (
      <>
        {
          _rootKey && (
            <a onClick={() => handelSearch(_rootKey, true)}>
              <Tag color="blue" key={_rootKey} itemProp="tag" property="article:tag">
                {showCat(_rootKey)}
              </Tag>
            </a>
          )
        }
        {_midKey && (
          <a onClick={() => handelSearch(_midKey, true)}>
            <Tag color="blue" key={_midKey} itemProp="tag" property="article:tag">
              {showCat(_midKey)}
            </Tag>
          </a>
        )}
        <a onClick={() => handelSearch(_Key, true)}>
          <Tag color="blue" key={_Key} itemProp="tag" property="article:tag">
            {showCat(_Key)}
          </Tag>
        </a>
      </>
    );
  }

  return result;
}

const Introduction = ({
  gigDetail, areaData, handelSearch, basicId, removeFavorite, addFavorite, profileInfo, chkActiveProcess
}) => {
  const {
    focusGig, haveGithub, haveBehance, fileMap, // , haveGalleries
  } = gigDetail;
  const {
    title, reviewScore, reviewCount, body, cats, catTag, favoriteId, gigId
  } = focusGig;
  const { topperName } = profileInfo;
  const isGigId = gigId ? `?gigId=${gigId}` : '';
  const areaText = (areaData && areaData.length !== 0 && Object.keys(body).length !== 0) ? showAreaText(areaData, body.area) : '';
  return (
    <>
      <BrowserView>
        <div className={styles.wrap}>
          {
            (fileMap && body.coverPic) && (
              <div className={styles.banner}>
                <img className={styles.blur} src={imgUrlByfileMap(body.coverPic, fileMap)} alt={title} />
                <img className={styles.img} src={imgUrlByfileMap(body.coverPic, fileMap)} alt={title} />
              </div>
            )
          }
          <div className={styles.sort}>
            <h1 className={styles.titleWrap}><span className={styles.hide}>{topperName}-</span><span className={styles.headerTitle}>{title}</span></h1>
            {
              favoriteId
                ? (
                  <span
                    className={styles.icon}
                    onClick={() => chkActiveProcess().then(() => removeFavorite(favoriteId))}
                  >
                    <Favorite style={{ color: '#ff6363' }} />
                  </span>
                )
                : (
                  <span
                    className={styles.icon}
                    onClick={() => chkActiveProcess().then(() => addFavorite(gigId))}
                  >
                    <FavoriteBorder style={{ color: '#aaa' }} />
                  </span>
                )
              }
          </div>
          <div className={styles.money}>
            {
              reviewScore ? (
                <div className={styles.starWarp}><span className={styles.icon}><Star />{reviewScore}</span><span className={styles.reviewCount}>(<Link to={`/evaluation/${basicId}`} target="_blank">{reviewCount}</Link>)</span></div>
              ) : ''
            }
            NT${body.price}<span className={styles.up}> 起 {priceType[body.unit] === '時薪' && '/ hr'}</span>
          </div>
          <ul className={styles.intro}>
            <li>
              <span className={styles.title}>經驗</span><span className={styles.info}>{showText(experienceData, body.exp)}</span>
            </li>
            <li>
              <span className={styles.title}>地區</span>
              <span className={styles.info}>{areaText}</span>
            </li>
            <li>
              <span className={styles.title}>方式</span><span className={styles.info}>{showArrayText(methodData, body.onsiteOpts)}</span>
            </li>
            <li>
              <span className={styles.title}>對象</span><span className={styles.info}>{showArrayText(targetData, body.clientCats)}</span>
            </li>
            <li>
              <span className={styles.title}>時段</span><span className={styles.info}>{showArrayText(priorityData, body.priority)}</span>
            </li>
            {
              body.desc && (
                <li>
                  <span className={styles.title}>描述</span>
                  <span className={styles.info}>
                    <CreateMarkup text={body.desc} />
                  </span>
                </li>
              )
            }
          </ul>
          {
            (profileInfo.hasGalleries || haveGithub || haveBehance)
            && (
              <div className={styles.btnWrap}>
                <Button type="danger">
                  <Link to={`/profile/${basicId}${isGigId}`}>查看完整作品</Link>
                </Button>
              </div>
            )
          }
          <div className={styles.tagWrap}>
            {
              showCatTags(cats, handelSearch)
            }
            {
              catTag.map((tag, index) => (
                <a onClick={() => handelSearch(tag)}>
                  <Tag key={index} itemProp="tag" property="article:tag">{tag}</Tag>
                </a>
              ))
            }
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className={`${styles.wrap} ${styles.mobile}`}>
          <div className={styles.sort}>
            <h1 className={styles.titleWrap}><span className={styles.hide}>{topperName}-</span><span className={styles.headerTitle}>{title}</span></h1>
            {
              favoriteId
                ? (
                  <span
                    className={styles.icon}
                    onClick={() => chkActiveProcess().then(() => removeFavorite(favoriteId))}
                  >
                    <Favorite style={{ color: '#ff6363' }} />
                  </span>
                )
                : (
                  <span
                    className={styles.icon}
                    onClick={() => chkActiveProcess().then(() => addFavorite(gigId))}
                  >
                    <FavoriteBorder style={{ color: '#aaa' }} />
                  </span>
                )
              }
          </div>
          {
            profileInfo
            && (
              <div className={styles.userInfo}>
                <Avatar size={20} userImg={profileInfo.coverPic} />
                <span className={styles.userName}>{profileInfo.topperName}</span>
              </div>
            )
          }
          {
            (fileMap && body.coverPic) && (
              <div className={styles.banner}>
                <img src={imgUrlByfileMap(body.coverPic, fileMap)} alt={title} />
              </div>
            )
          }
          <div className={styles.money}>
            {
              reviewScore ? (
                <div className={styles.starWarp}><span className={styles.icon}><Star />{reviewScore}</span><span className={styles.reviewCount}>(<Link to={`/evaluation/${basicId}`} target="_blank">{reviewCount}</Link>)</span></div>
              ) : ''
            }
            NT$ {body.price}<span className={styles.up}> 起 {priceType[body.unit] === '時薪' && '/ hr'}</span>
          </div>
          <ul className={styles.intro}>
            <li>
              <span className={styles.title}>經驗</span><span className={styles.info}>{showText(experienceData, body.exp)}</span>
            </li>
            <li>
              <span className={styles.title}>地區</span>
              <span className={styles.info}>{areaText}</span>
            </li>
            <li>
              <span className={styles.title}>方式</span><span className={styles.info}>{showArrayText(methodData, body.onsiteOpts)}</span>
            </li>
            <li>
              <span className={styles.title}>對象</span><span className={styles.info}>{showArrayText(targetData, body.clientCats)}</span>
            </li>
            <li>
              <span className={styles.title}>時段</span><span className={styles.info}>{showArrayText(priorityData, body.priority)}</span>
            </li>
            {body.desc && (
              <li>
                <span className={styles.title}>描述</span>
                <span className={styles.info}>
                  <CreateMarkup text={body.desc} />
                </span>
              </li>
            )}
          </ul>
          {
            (profileInfo.hasGalleries || haveGithub || haveBehance) && (
              <div className={styles.btnWrap}>
                <Button type="danger">
                  <Link to={`/profile/${basicId}${isGigId}`}>查看完整作品</Link>
                </Button>
              </div>
            )}
          <div className={styles.tagWrap}>
            {showCatTags(cats, handelSearch)}
            {catTag.map((tag, index) => (
              <a onClick={() => handelSearch(tag)}>
                <Tag key={index} itemProp="tag" property="article:tag">
                  {tag}
                </Tag>
              </a>
            ))}
          </div>
        </div>
      </MobileView>
    </>
  );
};

export default Introduction;
