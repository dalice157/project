import React from 'react';
import { Card, Divider, Spin } from 'antd';
import dayjs from 'dayjs';
import { Star } from '@material-ui/icons';
import { dateFormat } from '../../config/constant';
import { moneyData, experienceData } from '../../config/selectData';
import { optionsToTable } from '../../util/formatUtil';
import styles from './CardList.scss';


const CandidateCardList = ({
  list, renderDateField, renderButtonField, loading
}) => {
  return (
    <Spin spinning={loading.isLoadingList} tip="載入應徵高手中">
      {
        list.map((record) => {
          const {
            firstApplyDate, lastApplyDate, gigInfo, profileName, nowMember, topperId, topperPid, reviewScore
          } = record;
          return (
            <Card className={styles.card} key={topperId}>
              <div className={styles.line}>
                <span className={styles.title}>應徵日：</span>
                <span>{(firstApplyDate ? dayjs(firstApplyDate).format(dateFormat) : '-')}</span>
              </div>
              <div className={styles.line}>
                {nowMember ? (
                  <>
                    <a href={`/service/${topperId}`} target="_blank">{profileName}</a>
                    <br />
                    <span className={styles.title}>高手編號：</span>{topperPid}
                  </>
                ) : '高手已刪除下架'}
              </div>
              <div className={styles.line}>
                <span className={styles.title}>服務項目：</span>
                <span>{(gigInfo && gigInfo.title !== null ? <a href={`/service/${topperId}?gigId=${gigInfo && gigInfo.gigId}`} target="_blank">{gigInfo.title}</a> : '服務已刪除')}</span>
              </div>
              <div className={styles.line}>
                <span className={styles.title}>服務報價：</span>
                <span>{(gigInfo ? `${optionsToTable(moneyData)[gigInfo.unit]} NT$${gigInfo.price}元起` : '-')}</span>
              </div>
              <div className={styles.line}>
                <span className={styles.content}>
                  <span className={styles.title}>經驗：</span>
                  <span>{(gigInfo && (gigInfo.expCat !== null && gigInfo.expCat !== undefined) ? optionsToTable(experienceData)[gigInfo.expCat] : '-')}</span>
                </span>
                <span className={styles.content}>
                  <span className={styles.title}>評價：</span>
                  <Star style={{ color: '#f8b422', width: '16px', height: '16px' }} />
                  <span className={styles.score}>{reviewScore !== null ? reviewScore : '-'}</span>
                </span>
              </div>
              <Divider />
              <div className={styles.line}>
                <div className={styles.date}>{renderDateField(lastApplyDate, record)}</div>
              </div>
              <div className={styles.btnWrap}>
                {renderButtonField(record, loading)}
              </div>
            </Card>
          );
        })
      }
    </Spin>

  );
};

export default CandidateCardList;
