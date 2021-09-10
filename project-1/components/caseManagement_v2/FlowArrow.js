import React, { Component } from 'react';
import styles from './FlowArrow.scss';

class FlowArrow extends Component {
  render() {
    const { isMobile } = this.props;
    const {
      communicateDate, cooperatedDate, reviewDate, closedDate, rejectDate
    } = this.props.flowArrowObj;
    const content = {
      communication: isMobile ? '溝通' : '溝通中',
      cooperation: isMobile ? '合作' : '合作中',
      evaluated: isMobile ? '評價' : '已評價',
      closed: isMobile ? '結案' : '已結案',
      reject: isMobile ? '回絕' : '回絕未合作',
    };
    const isCommunication = (communicateDate || cooperatedDate) ? styles.active : '';
    const isCooperation = cooperatedDate ? styles.active : '';
    const isEvaluated = reviewDate ? styles.active : '';
    const isClosed = (closedDate && rejectDate === null) ? styles.active : '';
    const isReject = (rejectDate) ? styles.active : '';
    return (
      <div className={styles.wrap}>
        <div className={`${styles.tag} ${isCommunication}`}>{content.communication}</div>
        <div className={`${styles.triangle} ${isCooperation}`} />
        <div className={`${styles.tag} ${isCooperation}`}>{content.cooperation}</div>
        <div className={`${styles.triangle} ${isEvaluated}`} />
        <div className={`${styles.tag} ${isEvaluated}`}>{content.evaluated}</div>
        <div className={`${styles.triangle} ${isClosed}`} />
        <div className={`${styles.tag} ${isClosed}`}>{content.closed}</div>
        <div className={`${styles.triangle} ${isReject}`} />
        <div className={`${styles.tag} ${isReject}`}>{content.reject}</div>
      </div>
    );
  }
}

export default FlowArrow;
