import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';
import {
  Room, Person,
} from '@material-ui/icons';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

import styles from './List.scss';
import { priceType, targetData } from '../../config/selectData.js';
import { moneyFormat, showAreaText } from '../../util/commonUtil';
import CreateMarkup from '../common_v2/CreateMarkup';


const List = ({
  // eslint-disable-next-line no-unused-vars
  title, maxPrice, minPrice, unit, assignPlace, viewCount, applyCount, desc, onlineDate,
  educationalStage, areaData, basicId, demandId, experience,
}) => {
  const dateDisplay = () => {
    dayjs.extend(isToday);
    dayjs.extend(isYesterday);
    // console.log('onlineDate:', dayjs(onlineDate).format('YYYY-MM-DD'));
    const isTodays = dayjs(onlineDate).isToday();
    const isYesterdays = dayjs(onlineDate).isYesterday();
    const daysDiff = dayjs().startOf('day').diff(dayjs(onlineDate), 'day') + 1;
    const isLessThan30Days = daysDiff > 1 && daysDiff <= 30;
    const isMoreThan30Days = daysDiff > 30;
    // console.log('昨天:', isLessThan30Days);
    if (isTodays) {
      return '今天';
    } else if (isYesterdays) {
      return '昨天';
    } else if (isLessThan30Days) {
      return `${daysDiff}天內`;
    } else if (isMoreThan30Days) {
      return '30天前';
    }
    return '';
  };
  const minNum = minPrice ? minPrice.toString() : '0';
  const maxNum = maxPrice ? maxPrice.toString() : '0';
  return (
    <div className={styles.wrap}>
      <div className={styles.titleWrap}>
        <h2 className={styles.title}>
          <Link target="_blank" to={`./caseInfo?basicId=${basicId}&demandId=${demandId}`}>{title}</Link>
        </h2>
&nbsp;&nbsp;
        {
          (experience === 0 || experience === 1) && <Tag color="green">歡迎新手</Tag>
        }
      </div>
      <BrowserView>
        <div className={styles.reviewWrap}>
          <div className={styles.left}>
            <div className={styles.price}>
              <span className={styles.money}>
                <span className={styles.type}>{ priceType[unit] === '時薪' ? '時薪' : '論件' }</span>
                {' '}
                NT$
                {' '}
                { moneyFormat(minNum) }
                {' '}
                ~
                {' '}
                { moneyFormat(maxNum) }
                <span className={styles.textSmall}> 元</span>
              </span>
            </div>
            <div className={styles.area}>
              <Room />
              <span className={styles.text}>
                {
                assignPlace && assignPlace.length !== 0 ? (showAreaText(areaData, assignPlace)) : ('不拘')
                }
              </span>
            </div>
            {
              educationalStage && (
              <div className={styles.person}>
                <Person />
                <span className={styles.text}>{ targetData[educationalStage - 1].title }</span>
              </div>
              )
            }
          </div>
          <ul className={styles.info}>
            {/* <li>
              <span className={styles.title}>瀏覽數</span>
              <span className={styles.number}>{ viewCount }</span>
            </li> */}
            <li>
              <span className={styles.title}>應徵數</span>
              <span className={styles.number}>{ applyCount }</span>
            </li>
            <li>
              <span className={styles.title}>刊登時間</span>
              <span className={styles.number}>{ dateDisplay() }</span>
            </li>
          </ul>
        </div>
        <div className={styles.desc}>
          <CreateMarkup text={desc} />
        </div>
      </BrowserView>
      <MobileView>
        <div className={styles.mobile}>
          <div className={styles.price}>
            <span className={styles.money}>
              <span className={styles.type}>{ priceType[unit] === '時薪' ? '時薪' : '論件' }</span>
              {' '}
              NT$
              {' '}
              { moneyFormat(minNum) }
              {' '}
              ~
              {' '}
              { moneyFormat(maxNum) }
              <span className={styles.textSmall}> 元</span>
            </span>
          </div>
          <div className={styles.infoWrap}>
            <div className={styles.area}>
              <Room />
              <span className={styles.text}>
                { assignPlace && assignPlace.length !== 0
                  ? (showAreaText(areaData, assignPlace)) : ('不拘')
                }
              </span>
            </div>
            { educationalStage && (
            <div className={styles.person}>
              <Person />
              <span className={styles.text}>{ targetData[educationalStage - 1].title }</span>
            </div>
            ) }
          </div>
          <div className={styles.desc}>
            <CreateMarkup text={desc} />
          </div>
          <ul className={styles.info}>
            {/* <li>
              <span className={styles.title}>瀏覽數</span>
              <span className={styles.number}>{ viewCount }</span>
            </li> */}
            <li>
              <span className={styles.title}>應徵數</span>
              <span className={styles.number}>{ applyCount }</span>
            </li>
            <li>
              <span className={styles.title}>刊登時間</span>
              <span className={styles.number}>{ dateDisplay() }</span>
            </li>
          </ul>
        </div>
      </MobileView>
    </div>
  );
};

export default withRouter(List);
