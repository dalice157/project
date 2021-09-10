import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { REJECTOR } from '../../config/constant';
import FlowArrow from './FlowArrow';
// import ChatMetaButton from '../../containers/caseManagement_v2/ChatMetaButton.js';
import ReportCooperateButton from '../../containers/caseManagement_v2/ReportCooperateButton.js';
import ReviewButton from '../../containers/caseManagement_v2/ReviewButton.js';
import CaseInfo from './CaseInfo.js';
import styles from './ClosedCard.scss';
import { renderDateInfo } from '../../util/formatUtil';

class ClosedCard extends Component {
  render() {
    const {
      isMobile, area, isCheckPublish, getListClosed, dateOpt
    } = this.props.cardObj;
    const { history } = this.props;
    const currentPage = history.location.pathname.split('/')[2];
    const {
      applierCount, partARequestCooperationDate, partBRequestCooperationDate, reviewDate, requireReviewDate, educationalStage, cooperatedDate, demandId, demanderId, demanderName, closedDate, communicateDate, rejectDate, rejector, step, demanderFamilyName, demanderSex
    } = this.props.item;
    const {
      title, unit, minPrice, maxPrice, assignPlace
    } = this.props.item.demandBody;

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
      demanderSex
    };

    const requestCooperationDateObj = {
      partARequestCooperationDate,
      partBRequestCooperationDate,
      demandId,
      demanderId,
      title,
      demanderName,
      history,
      isCheckPublish,
      currentPage,
      cooperatedDate,
      communicateDate,
      dateOpt
    };
    const reviewDateObj = {
      reviewDate,
      requireReviewDate,
      cooperatedDate,
      demandId,
      demanderId,
      history,
      isCheckPublish,
      communicateDate,
      currentPage,
      dateOpt
    };

    const flowArrowObj = {
      communicateDate,
      cooperatedDate,
      reviewDate,
      closedDate,
      rejectDate,
    };

    const dateList = [
      {
        date: dayjs(rejectDate),
        text: `${rejector === REJECTOR.demander ? '案主' : '您已'}婉拒合作`,
        isShow: rejector && rejectDate,
        isWarningStyle: rejector,
      },
      {
        date: dayjs(closedDate),
        text: '結案關閉日期',
        isShow: closedDate,
      },
      {
        date: dayjs(partARequestCooperationDate),
        text: '案主回報合作',
        isShow: partARequestCooperationDate && partBRequestCooperationDate === null && cooperatedDate === null,
      },
      {
        date: dayjs(partBRequestCooperationDate),
        text: '已回報合作',
        isShow: partARequestCooperationDate === null && partBRequestCooperationDate && cooperatedDate === null,
      },
      {
        date: dayjs(cooperatedDate),
        text: '已確認合作',
        isShow: cooperatedDate && requireReviewDate === null && reviewDate === null,
      },
      {
        date: dayjs(requireReviewDate),
        text: '已邀請案主評價',
        isShow: (requireReviewDate && reviewDate === null),
      },
      {
        date: dayjs(reviewDate),
        text: '案主已給予評價',
        isShow: reviewDate,
      }
    ].filter(data => data.isShow);

    if (isMobile) {
      return (
        <>
          <div className={styles.card}>
            <FlowArrow
              flowArrowObj={flowArrowObj}
              isMobile={isMobile}
            />
            <CaseInfo
              demandData={demandData}
              currentPage={currentPage}
              isMobile={isMobile}
            />
            <div className={`${styles.footer} ${styles.mobile}`}>
              <div className={`${styles.dateInfo}`}>
                {renderDateInfo(dateList, styles)}
              </div>
              { !rejector && (
              <div className={styles.btnWrap}>
                {/* <ChatMetaButton item={this.props.item} history={history} /> */}
                <ReportCooperateButton
                  requestCooperationDateObj={requestCooperationDateObj}
                  onReloadList={getListClosed}
                />
                <ReviewButton
                  reviewDateObj={reviewDateObj}
                  onReloadList={getListClosed}
                />
              </div>
              ) }
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.card}>
            <FlowArrow
              flowArrowObj={flowArrowObj}
            />
            <CaseInfo
              demandData={demandData}
              currentPage={currentPage}
            />
            <div className={styles.footer}>
              <div className={`${styles.dateInfo}`}>
                {renderDateInfo(dateList, styles)}
              </div>
              {
                !rejector && (
                  <div className={styles.btnWrap}>
                    {/* <ChatMetaButton item={this.props.item} history={history} /> */}
                    <ReportCooperateButton
                      requestCooperationDateObj={requestCooperationDateObj}
                      onReloadList={getListClosed}
                    />
                    <ReviewButton
                      reviewDateObj={reviewDateObj}
                      onReloadList={getListClosed}
                    />
                  </div>
                )
              }
            </div>
          </div>
        </>
      );
    }
  }
}

export default withRouter(ClosedCard);
