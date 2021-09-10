import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { REJECTOR } from '../../config/constant';
import ChatMetaButton from '../../containers/caseManagement_v2/ChatMetaButton.js';
import ProfileButton from '../../containers/caseManagement_v2/ProfileButton.js';
import ReportCooperateButton from '../../containers/caseManagement_v2/ReportCooperateButton.js';
import ReviewButton from '../../containers/caseManagement_v2/ReviewButton.js';
import CaseInfo from './CaseInfo.js';
import styles from './ContactCard.scss';
import { renderDateInfo } from '../../util/formatUtil';

class ContactCard extends Component {
  render() {
    const {
      isMobile, area, isCheckPublish, getListContact, dateOpt
    } = this.props.cardObj;
    const { history } = this.props;
    const currentPage = history.location.pathname.split('/')[2];
    const {
      rejectDate, rejector, applierCount, partARequestCooperationDate, partBRequestCooperationDate, reviewDate, requireReviewDate, educationalStage, step, getContactsDate, cooperatedDate, demandId, demanderId, demanderName, communicateDate, getContacts, demanderFamilyName, demanderSex
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
    const profileDataObj = {
      getContacts,
      step,
      demandId
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
    const dateList = [
      {
        date: dayjs(rejectDate),
        text: `${rejector === REJECTOR.demander ? '案主' : '您已'}婉拒合作`,
        isShow: rejector && rejectDate,
        isWarningStyle: rejector,
      },
      {
        date: dayjs(partARequestCooperationDate),
        text: '案主回報合作',
        isShow: partARequestCooperationDate && partBRequestCooperationDate === null,
      },
      {
        date: dayjs(partBRequestCooperationDate),
        text: '已回報合作',
        isShow: partARequestCooperationDate === null && partBRequestCooperationDate,
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
      },
      {
        date: dayjs(getContactsDate),
        text: '查閱日期',
        isShow: getContactsDate,
      }
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
            {
            !rejector && (
            <div className={styles.btnWrap}>
              <ChatMetaButton item={this.props.item} />
              <ProfileButton profileDataObj={profileDataObj} />
              <ReportCooperateButton
                requestCooperationDateObj={requestCooperationDateObj}
                onReloadList={getListContact}
              />
              <ReviewButton
                reviewDateObj={reviewDateObj}
                onReloadList={getListContact}
              />
            </div>
            )
          }
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className={styles.card}>
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
                    <ChatMetaButton item={this.props.item} />
                    <ProfileButton profileDataObj={profileDataObj} />
                    <ReportCooperateButton
                      requestCooperationDateObj={requestCooperationDateObj}
                      onReloadList={getListContact}
                    />
                    <ReviewButton
                      reviewDateObj={reviewDateObj}
                      onReloadList={getListContact}
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

export default withRouter(ContactCard);
