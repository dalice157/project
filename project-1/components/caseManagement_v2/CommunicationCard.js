import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { REJECTOR } from '../../config/constant';
import ChatMetaButton from '../../containers/caseManagement_v2/ChatMetaButton.js';
import ReportCooperateButton from '../../containers/caseManagement_v2/ReportCooperateButton.js';
import ProfileButton from '../../containers/caseManagement_v2/ProfileButton.js';
import FlowArrow from './FlowArrow';
import CaseInfo from './CaseInfo.js';
import styles from './CommunicationCard.scss';
import { renderDateInfo } from '../../util/formatUtil';

class CommunicationCard extends Component {
  render() {
    const {
      item, cardObj
    } = this.props;
    const {
      isMobile, area, dealLists, isCheckPublish, loadCommunicatingList, dateOpt
    } = cardObj;
    const { history } = this.props;
    const currentPage = history.location.pathname.split('/')[2];
    const {
      demandBody, applierCount, communicateDate, cooperatedDate, reviewDate, closedDate, rejectDate, rejector, partARequestCooperationDate, partBRequestCooperationDate, educationalStage, demandId, demanderId, step, demanderName, getContacts, demanderFamilyName, demanderSex
    } = item;
    const {
      title, minPrice, maxPrice, assignPlace, unit
    } = demandBody;

    const profileDataObj = {
      getContacts,
      step,
      demandId
    };
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
      communicateDate,
      demandId,
      demanderId,
      dealLists,
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
        date: dayjs(communicateDate),
        text: '溝通開始日期',
        isShow: communicateDate,
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
      }
    ].filter(data => data.isShow);
    if (isMobile) {
      return (
        <>
          <div className={styles.card}>
            <FlowArrow type="communication" flowArrowObj={flowArrowObj} isMobile={isMobile} />
            <CaseInfo
              demandData={demandData}
              isMobile={isMobile}
              currentPage={currentPage}
            />
            <div className={`${styles.footer} ${styles.mobile}`}>
              <div className={`${styles.dateInfo}`}>
                {renderDateInfo(dateList, styles)}
              </div>
              {!rejector && (
                <div className={styles.btnWrap}>
                  <ChatMetaButton item={this.props.item} />
                  <ProfileButton profileDataObj={profileDataObj} />
                  <ReportCooperateButton
                    requestCooperationDateObj={requestCooperationDateObj}
                    onReloadList={loadCommunicatingList}
                  />
                </div>
              )}
            </div>

          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.card}>
            <FlowArrow type="communication" flowArrowObj={flowArrowObj} />
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
                      onReloadList={loadCommunicatingList}
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

export default withRouter(CommunicationCard);
