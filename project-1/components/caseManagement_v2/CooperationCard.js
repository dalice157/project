import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import ChatMetaButton from '../../containers/caseManagement_v2/ChatMetaButton.js';
import ReviewButton from '../../containers/caseManagement_v2/ReviewButton.js';
import ProfileButton from '../../containers/caseManagement_v2/ProfileButton.js';
import FlowArrow from './FlowArrow';
import CaseInfo from './CaseInfo.js';
import styles from './CooperationCard.scss';
import { renderDateInfo } from '../../util/formatUtil';

class CooperationCard extends Component {
  render() {
    const {
      isMobile, area, isCheckPublish, dealLists, getListCooperating
    } = this.props.cardObj;
    const { history } = this.props;
    const currentPage = history.location.pathname.split('/')[2];
    const {
      applierCount, reviewDate, requireReviewDate, educationalStage, cooperatedDate, demandId, demanderId, closedDate, communicateDate, rejectDate, getContacts, step, demanderFamilyName, demanderSex
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
      dealLists,
      demanderFamilyName,
      demanderSex
    };
    const profileDataObj = {
      getContacts,
      step,
      demandId
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
        date: dayjs(cooperatedDate),
        text: '確認合作日期',
        isShow: cooperatedDate,
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
      },
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
            <div className={styles.footer}>
              <div className={`${styles.dateInfo}`}>
                {renderDateInfo(dateList, styles)}
              </div>
              <div className={styles.btnWrap}>
                <ChatMetaButton item={this.props.item} />
                <ProfileButton profileDataObj={profileDataObj} />
                <ReviewButton
                  reviewDateObj={reviewDateObj}
                  onReloadList={getListCooperating}
                />
              </div>
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
              <div className={styles.btnWrap}>
                <ChatMetaButton item={this.props.item} />
                <ProfileButton profileDataObj={profileDataObj} />
                <ReviewButton
                  reviewDateObj={reviewDateObj}
                  onReloadList={getListCooperating}
                />
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

export default withRouter(CooperationCard);
