import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import AgreeCommunicateButton from '../../containers/caseManagement_v2/AgreeCommunicateButton.js';
import RejectCaseButton from '../../containers/caseManagement_v2/RejectCaseButton.js';
import CaseInfo from './CaseInfo.js';
import styles from './InvitingCard.scss';
import { renderDateInfo } from '../../util/formatUtil';

class InvitingCard extends Component {
  state = {
    hasRejected: false,
  };

  onRejectInviting = async (demandId, demanderId) => {
    const result = await this.props.rejectToCommunicate(demandId, demanderId);
    if (result.payload.success) {
      this.setState({ hasRejected: true });
    }
    return result;
  }

  onRenderFooter = (rejectDate) => {
    const {
      onRefreshPage, item, agreeToCommunicate, rejectToCommunicate
    } = this.props;
    const { hasRejected } = this.state;
    const { demandId, demanderId } = item;
    const isRejected = rejectDate || hasRejected;
    return (
      !isRejected && (
      <div className={styles.btnWrap}>
        <RejectCaseButton
          hasRejected={hasRejected}
          demandId={demandId}
          demanderId={demanderId}
          onRejectInviting={rejectToCommunicate}
        />
        <AgreeCommunicateButton
          demandId={demandId}
          demanderId={demanderId}
          onRefreshPage={onRefreshPage}
          agreeToCommunicate={agreeToCommunicate}
        />
      </div>
      )
    );
  }

  render() {
    const {
      item, cardObj
    } = this.props;
    const {
      isMobile, area, dealLists
    } = cardObj;
    const currentPage = this.props.history.location.pathname.split('/')[2];
    const {
      demandBody, applierCount, inviteDate, educationalStage, rejectDate, demandId, step, demanderId, demanderFamilyName, demanderSex
    } = item;
    const {
      title, unit, minPrice, maxPrice, assignPlace
    } = demandBody;
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
      inviteDate,
      demandId,
      demanderId,
      dealLists,
      demanderFamilyName,
      demanderSex
    };
    const dateList = [
      {
        date: dayjs(rejectDate),
        text: '您已婉拒合作',
        isShow: rejectDate || this.state.hasRejected,
        isWarningStyle: rejectDate,
      },
      {
        date: dayjs(inviteDate),
        text: '邀請日期',
        isShow: inviteDate,
      },
    ].filter(data => data.isShow);
    if (isMobile) {
      return (
        <>
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
              {this.onRenderFooter(rejectDate)}
            </div>
          </div>
        </>
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
              {this.onRenderFooter(rejectDate)}
            </div>
          </div>
        </>
      );
    }
  }
}

export default withRouter(InvitingCard);
