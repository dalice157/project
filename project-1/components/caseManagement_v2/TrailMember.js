import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { Help, ArrowForwardIos } from '@material-ui/icons';
import dayjs from 'dayjs';
import { dateFormat, paidTypes } from '../../config/constant';
import Button from '../ui/button_v2';
import usedImage from '../../img/case/overview1.png';
import unusedImage from '../../img/case/overview3.png';
import styles from './TrailMember.scss';
import Warning from './Warning';

class TrailMember extends Component {
  onChangeBox = () => {
    const { gigDashboard } = this.props;
    Modal.info({
      title: '提醒您',
      icon: null,
      okText: '確認繼續轉換',
      content: (
        <div className={styles.modalInfo}>
          您目前的刊登身份為體驗會員，免費轉換為「<b>無限方案</b>」刊登完成後，系統會同時將您於高手的「<b>體驗會員</b>」身分轉換為「<b>無限方案</b>」刊登會員。
          <br /><br />
          使用期限將依原外包網VIP刊期所剩餘之天數計算。
        </div>
      ),
      onOk: () => {
        const getPlanParameter = () => {
          if ((gigDashboard.outsourcePlan && gigDashboard.tutorPlan === null) || (gigDashboard.outsourcePlan && gigDashboard.tutorPlan)) {
            return '?type=outsource&memberType=trial';
          } else if (gigDashboard.outsourcePlan === null && gigDashboard.tutorPlan) {
            return '?type=tutor&memberType=trial';
          } else {
            return '?memberType=trial';
          }
        };
        this.props.history.push(`/editProfile${getPlanParameter()}`);
      },
    });
  }

  render() {
    const {
      isMobile, depositResource, experienceMemberEstimateEndDate, publishDate, paidList, showUnpaidInfo, gigDashboard
    } = this.props;
    const isFreePay = gigDashboard && (gigDashboard.outsourcePlan || gigDashboard.tutorPlan);
    if (paidList === null) {
      return <></>;
    } else if (isMobile) {
      return (
        paidList.map((order) => {
          const {
            orderType, usedCnt, capacity, atmVirtualAccount, ibonVirtualAccount, paymentDueDate, price, payDate
          } = order;
          if (orderType === paidTypes.freeTrial) {
            return (
              <ul className={styles.planList}>
                <li className={styles.planElement}>
                  <p className={styles.planContent}>{publishDate ? `體驗方案（${dayjs(publishDate).format(dateFormat)}啟用）` : ''}</p>
                  <p className={styles.planContent}><span className={styles.month}>本週</span>可查閱案件聯絡數：<span className={styles.no}>{usedCnt}</span> / {capacity}</p>
                  <Link className={styles.arrow} to="/caseList" target="_blank"><ArrowForwardIos /></Link>
                </li>
                <li className={styles.planElement}>
                  {
                    isFreePay ? (
                      <p className={styles.planContent}>
                        <Warning gigDashboard={gigDashboard} type="trial" />
                        <a onClick={this.onChangeBox}>立即轉換</a>
                      </p>
                    ) : (<p className={styles.planContent}><Link target="_blank" to="/publication-plan">每周2次不夠嗎?立即購買升級享9折</Link></p>)
                  }

                </li>
              </ul>
            );
          } else if ((orderType === paidTypes.valuable || orderType === paidTypes.infinite) && !payDate) {
            return (
              <ul className={styles.planList}>
                <li className={styles.planElement}>
                  <p className={styles.planContent}>您已取得刊期方案付款帳號，請於 {dayjs(paymentDueDate).format(dateFormat)} 前完成付款，將於付費後 1 小時內完成刊登方案之上刊，並可開始應徵及查閱案件聯絡人資料。</p>
                </li>
                <li className={styles.planElement}>
                  <Button type="primary" onClick={() => showUnpaidInfo(atmVirtualAccount, ibonVirtualAccount, paymentDueDate, price)}>顯示繳費帳號</Button>
                </li>
              </ul>
            );
          }
        })
      );
    }
    return (
      paidList.map((order) => {
        const {
          orderType, endDate, usedCnt, capacity, startDate, atmVirtualAccount, ibonVirtualAccount, paymentDueDate, price, payDate
        } = order;
        if (orderType === paidTypes.freeTrial) {
          return (
            <div className={styles.publishWrap}>
              <img className={styles.pic} src={usedImage} alt="刊登日期" />
              <ul className={styles.content}>
                <li className={styles.line}>
                  刊登日期：
                  <span className={styles.date}>
                    {publishDate ? dayjs(publishDate).format(dateFormat) : ''}
                    {experienceMemberEstimateEndDate ? `~${dayjs(experienceMemberEstimateEndDate).format(dateFormat)}` : ''}
                  </span>
                  {
                    depositResource === 'orderTX'
                      ? <a href="https://blog.top.104.com.tw/2019/09/20/security_deposit/" target="_blank"><Help /></a>
                      : null
                  }
                </li>
                <li className={styles.line}>
                  <p>本週可查閱的案件聯絡資料數：<span className={styles.date}><span className={styles.no}>{usedCnt}</span> / {capacity} 件 ({dayjs(startDate).format(dateFormat)}~{dayjs(endDate).format(dateFormat)})</span></p>
                  {
                    !isFreePay && <Link target="_blank" to="/publication-plan"><Button type="primary">每周2次不夠嗎?立即購買升級享9折</Button></Link>
                  }
                </li>
                {
                  isFreePay && (
                    <li className={`${styles.line} ${styles.sbw}`}>
                      <Warning gigDashboard={gigDashboard} type="trial" />
                      <Button type="primary" onClick={this.onChangeBox}>立即轉換</Button>
                    </li>
                  )
                }
              </ul>
            </div>
          );
        } else if ((orderType === paidTypes.valuable || orderType === paidTypes.infinite) && !payDate) {
          return (
            <div className={styles.publishWrap}>
              <img className={styles.pic} src={unusedImage} alt="刊登日期" />
              <ul className={styles.content}>
                <div className={styles.line}>
                  <p>您已取得刊期方案付款帳號，請於 {dayjs(paymentDueDate).format(dateFormat)} 前完成付款，將於付費後 1 小時內完成刊登方案之上刊，並可開始應徵及查閱案件聯絡人資料。</p>
                  <Button type="primary" onClick={() => showUnpaidInfo(atmVirtualAccount, ibonVirtualAccount, paymentDueDate, price)}>顯示繳費帳號</Button>
                </div>
              </ul>
            </div>
          );
        }
      })
    );
  }
}

export default TrailMember;
