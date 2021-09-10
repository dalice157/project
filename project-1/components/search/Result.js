import React, { Fragment } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';

import { Select, Tag, Switch } from 'antd';
import { tagText } from '../../util/commonUtil';
import { SHOW_KEY } from '../../config/constant.js';
import styles from './Result.scss';

const { Option } = Select;

const Result = ({
  type, ferretOut, total, sort, onFiliterChange, onTagClose, areaData, onMedalChange,
  pagePath,
}) => {
  const isPage = Object.keys(ferretOut) != 'pageNum';
  const switchIsOnlyMedalChecked = Object.keys(ferretOut).includes('isOnlyMedal');
  return (
    <Fragment>
      <BrowserView>
        <div className={styles.result}>
          搜尋條件：
          {
            Object.keys(ferretOut).length !== 0 && isPage ? Object.keys(ferretOut).map(key => (
              SHOW_KEY.includes(key) ? <Tag key={key} closable onClose={() => onTagClose(key)} itemProp="tag" property="article:tag">{tagText(key, ferretOut[key], areaData)}</Tag> : ''
            )) : '尚未設定條件'
            }
        </div>
        <div className={styles.items}>
          <div className={styles.number}>
            {total}
            {' '}
            {type === 1 ? '筆案件' : '個服務項目'}
            。
          </div>
          <div className={styles.filter}>
            {
              pagePath && (
                <>
                  <Switch onChange={onMedalChange} checked={!!switchIsOnlyMedalChecked} />
                  {' '}
                  僅顯示獎牌高手
                </>
              )
            }
            <Select value={sort || '0'} className={styles.select} onChange={onFiliterChange}>
              <Option value="0">{type === 1 ? '最新案件' : '預設排序'}</Option>
              {(type === 1 && ferretOut.q) && <Option value="1">相關性排序</Option>}
              <Option value="2">{type === 1 ? '預算高至低' : '評價排序'}</Option>
              <Option value="3">{type === 1 ? '預算低至高' : '價格排序'}</Option>
            </Select>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className={styles.mobile}>
          <div className={styles.result}>
            <span className={styles.searchAll}>搜尋條件：</span>
            {
            Object.keys(ferretOut).length !== 0 && isPage ? Object.keys(ferretOut).map(key => (
              SHOW_KEY.includes(key) ? <Tag key={key} closable onClose={() => onTagClose(key)}>{tagText(key, ferretOut[key], areaData)}</Tag> : ''
            )) : '尚未設定條件'
            }
          </div>
          <div className={styles.items}>
            <div className={styles.number}>
              {total}
              {' '}
              {type === 1 ? '筆案件' : '個服務項目'}
            </div>
            {
              !pagePath && (
                <div className={styles.filter}>
                  <Select value={sort || '0'} className={styles.select} onChange={onFiliterChange}>
                    <Option value="0">{type === 1 ? '最新案件' : '預設排序'}</Option>
                    {(type === 1 && ferretOut.q) && <Option value="1">相關性排序</Option>}
                    <Option value="2">{type === 1 ? '預算高至低' : '評價排序'}</Option>
                    <Option value="3">{type === 1 ? '預算低至高' : '價格排序'}</Option>
                  </Select>
                </div>
              )
            }
          </div>
          {
            pagePath && (
              <div className={styles.filter}>
                <Switch onChange={onMedalChange} checked={!!switchIsOnlyMedalChecked} />
                {' '}
                僅顯示獎牌
                <Select value={sort || '0'} className={styles.select} onChange={onFiliterChange}>
                  <Option value="0">{type === 1 ? '最新案件' : '預設排序'}</Option>
                  {(type === 1 && ferretOut.q) && <Option value="1">相關性排序</Option>}
                  <Option value="2">{type === 1 ? '預算高至低' : '評價排序'}</Option>
                  <Option value="3">{type === 1 ? '預算低至高' : '價格排序'}</Option>
                </Select>
              </div>
            )
          }
        </div>
      </MobileView>
    </Fragment>
  );
};

export default Result;
