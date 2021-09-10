import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { REJECTOR } from '../../config/constant';
// import DeletedButton from '../../containers/caseManagement_v2/DeletedButton.js';
// import ApplyButton from '../../containers/caseManagement_v2/ApplyButton.js';
import CaseInfo from './CaseInfo.js';
import styles from './InvitedRecordCard.scss';
import { renderDateInfo } from '../../util/formatUtil';

class InvitedRecordCard extends Component {
  render() {
    const {
      isMobile, area,
    } = this.props.cardObj;
    const {
      rejector, rejectDate, applierCount, educationalStage, offDate, applyDate, viewed, viewDate, cooperatedDate, communicateDate, step, demandId, demanderId, demanderFamilyName, demanderSex
    } = this.props.item;
    const {
      title, unit, minPrice, maxPrice, assignPlace
    } = this.props.item.demandBody;
    const currentPage = this.props.history.location.pathname.split('/')[2];
    const demandData = {
      title,
      unit,
      minPrice,
      maxPrice,
      assignPlace,
      educationalStage,
      applierCount,
      area,
      step,
      cooperatedDate,
      demandId,
      demanderId,
      demanderFamilyName,
      demanderSex,
    };
    const dateList = [
      {
        date: dayjs(rejectDate),
        text: `${rejector === REJECTOR.demander ? '案主' : '您已'}婉拒合作`,
        isShow: rejector && rejectDate,
        isWarningStyle: rejector,
      },
      {
        date: dayjs(cooperatedDate),
        text: '已確認合作',
        isShow: (offDate === null && cooperatedDate),
      },
      {
        date: dayjs(communicateDate),
        text: '已進溝通中',
        isShow: (offDate === null && cooperatedDate === null && communicateDate),
      },
      {
        date: dayjs(viewDate),
        text: '案主已讀',
        isShow: (offDate === null && cooperatedDate === null && communicateDate === null && viewed === true),
      },
      {
        date: dayjs(applyDate),
        text: '應徵日期',
        isShow: applyDate,
      },
    ].filter(data => data.isShow);

    if (isMobile) {
      return (
        <div className={styles.card}>
          <CaseInfo
            demandData={demandData}
            currentPage={currentPage}
            isMobile={isMobile}
          />
          <div className={styles.footer}>
            <div className={`${styles.dateInfo}`}>
              {renderDateInfo(dateList, styles)}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.card}>
          <CaseInfo
            demandData={demandData}
            currentPage={currentPage}
          />
          <div className={styles.footer}>
            <div className={`${styles.dateInfo}`}>
              {renderDateInfo(dateList, styles)}
              {(offDate === null && cooperatedDate === null && communicateDate === null && viewed === false) && <div className={`${styles.infoNo}`}>案主未讀</div>}
            </div>
            <div className={styles.btnWrap}>
              {/* {onlineStatus === 0 && <DeletedButton />} */}
              {/* <ApplyButton demandBody={demandBody} title={title} /> */}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(InvitedRecordCard);
