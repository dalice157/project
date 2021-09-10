import React from 'react';
import { Card, Divider, Spin } from 'antd';
import dayjs from 'dayjs';
import { Star } from '@material-ui/icons';
import { dateFormat } from '../../config/constant';
import styles from './CardList.scss';


const InviteesCardList = ({
  list, renderDateField, renderButtonField, loading
}) => {
  return (
    <Spin spinning={loading.isLoadingList} tip="載入邀請高手中">
      {
          list.map((record) => {
            const {
              dealMeta, dealCount, profileName, nowMember, topperId, topperPid, reviewScore
            } = record;
            const topperName = (
              <>
                <a href={`/service/${topperId}`} target="_blank">{profileName}</a>
                <br />
                <span className={styles.title}>高手編號：</span>{topperPid}
              </>
            );
            return (
              <Card className={styles.card} key={topperId}>
                <div className={styles.line}>
                  <span className={styles.title}>邀請日：</span>
                  <span>{(dealMeta && dealMeta.inviteDate ? dayjs(dealMeta.inviteDate).format(dateFormat) : '-')}</span>
                </div>
                <div className={styles.line}>
                  {nowMember ? topperName : '已刪除高手服務'}
                </div>
                <div className={styles.line}>
                  <span className={styles.content}>
                    <span className={styles.title}>合作總數：</span>
                    <span>{(dealCount !== null && dealCount !== undefined) ? dealCount : '-'}</span>
                  </span>
                  <span className={styles.content}>
                    <span className={styles.title}>整體評價：</span>
                    <Star style={{ color: '#f8b422', width: '16px', height: '16px' }} />
                    <span className={styles.score}>{reviewScore !== null ? reviewScore : '-'}</span>
                  </span>
                </div>
                <Divider />
                <div className={styles.line}>
                  <div className={styles.date}>{renderDateField(dealMeta, record)}</div>
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

export default InviteesCardList;
