import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import Button from '../ui/button_v2';
import usedImage from '../../img/case/overview2.png';
import unusedImage from '../../img/case/overview3.png';
import styles from './PremiumMember.scss';
import {
  dateFormat, paidTypes,
} from '../../config/constant';
import config from '../../config/config';
import Warning from './Warning';

class PremiumMember extends Component {
  render() {
    const {
      isMobile, paidList, showUnpaidInfo, gigDashboard,
    } = this.props;
    const isFreePay = gigDashboard?.outsourcePlan || gigDashboard?.tutorPlan;
    const getPlanParameter = () => {
      if (
        (gigDashboard.outsourcePlan && gigDashboard.tutorPlan === null)
        || (gigDashboard.outsourcePlan && gigDashboard.tutorPlan)
      ) {
        return '?type=outsource&memberType=paid';
      } else if (gigDashboard.outsourcePlan === null && gigDashboard.tutorPlan) {
        return '?type=tutor&memberType=paid';
      }
      return '?memberType=paid';
    };

    if (paidList === null) {
      return <></>;
    } else if (isMobile) {
      return (
        <ul className={styles.planList}>
          {
          paidList.map((paid, index) => {
            const {
              orderType, usedCnt, capacity, payDate, atmVirtualAccount,
              ibonVirtualAccount, paymentDueDate, price, planType,
              productNo, endDate,
            } = paid;
            const includesOrderTypes = [paidTypes.valuable, paidTypes.infinite];
            const isTopperGettingClosed = includesOrderTypes.includes(orderType) && endDate ? dayjs(endDate).diff(dayjs(), 'd') < 7 : false;
            const isTopperGettingClosedAndNotPaied = isTopperGettingClosed && paidList?.length <= 1;
            const isUserPaying = !paidList?.[index]?.payDate;
            const hasUserPaid = payDate;
            const productMap = config.products.json;
            const caseType = productMap[planType][productNo];
            const daysDiff = dayjs(endDate).startOf('day').diff(dayjs(), 'day') + 1;
            const isMoreThan15Days = daysDiff > 15;
            if (hasUserPaid) {
              return (
                <>
                  <li className={styles.planElement} key={0}>
                    <div className={styles.planInfo}>
                      {
                      index === 0
                        ? <div className={styles.used}><p>?????????</p></div>
                        : <div className={styles.unused}><p>?????????</p></div>
                    }
                      { payDate ? (
                        <p className={styles.planDate}>
                          {dayjs(payDate).format(dateFormat)}
                          {' '}
                          ??????
                        </p>
                      ) : null }
                    </div>
                    <p className={styles.planContent}>{caseType.productName}</p>
                    <div className={styles.planSummary}>
                      <span className={styles.underline}>?????????</span>
                      <span>???????????????????????????</span>
                      <span className={styles.no}>{usedCnt}</span>
                      <span>{capacity ? `/ ${capacity}` : ''}</span>
                    </div>
                    {
                    isFreePay && (
                      <>
                        <Warning gigDashboard={gigDashboard} type="premium" />
                        <p className={styles.planContent}><Link to={`/editProfile${getPlanParameter()}`}><Button type="primary">????????????</Button></Link></p>
                      </>
                    )
                  }
                    {
                    config.featureSwitch.VL10160 && (orderType === paidTypes.valuable && isMoreThan15Days) && (
                    <Link className={styles.upgrade} target="_blank" to="/upgrade">
                      <Button type="primary">??????5???????????????? ????????????</Button>
                    </Link>
                    )
                  }
                  </li>
                  {
                  (isUserPaying || (isTopperGettingClosedAndNotPaied && !isFreePay)) && (
                    <li className={styles.planElement} key={1}>
                      <p className={styles.alert}>??????????????????????????????????????????????????????????????????????????????9????????????</p>
                      <div className={styles.footer}>
                        <Link target="_blank" to="/editProfile">
                          <Button type="primary">???????????????9???</Button>
                        </Link>
                      </div>
                    </li>
                  )
                }
                </>
              );
            }
            return (
              <li className={styles.planElement} key={0}>
                <p className={styles.planInfo}>
                  ?????????????????????????????????????????????
                  {dayjs(paymentDueDate).format(dateFormat)}
                  {' '}
                  ????????????????????????????????? 1 ??????????????????????????????????????????????????????????????????????????????????????????
                </p>
                <div className={styles.footer}>
                  <Button type="primary" onClick={() => showUnpaidInfo(atmVirtualAccount, ibonVirtualAccount, paymentDueDate, price)}>??????????????????</Button>
                </div>
              </li>
            );
          })
        }
        </ul>
      );
    }
    return (
      <ul className={styles.publishWrap}>
        {
            paidList.map((paid, index) => {
              const {
                startDate, orderType, endDate, usedCnt, payDate,
                atmVirtualAccount, ibonVirtualAccount, paymentDueDate,
                price, planType, productNo,
              } = paid;
              const includesOrderTypes = [paidTypes.valuable, paidTypes.infinite];
              const isTopperGettingClosed = includesOrderTypes.includes(orderType) && endDate ? dayjs(endDate).diff(dayjs(), 'd') < 7 : false;
              const isTopperGettingClosedAndNotPaied = isTopperGettingClosed && paidList?.length <= 1;
              const hasUserPaid = payDate;
              const productMap = config.products.json;
              const caseType = productMap[planType][productNo];
              const isUserPaying = !paidList?.[index]?.payDate;
              const daysDiff = dayjs(endDate).startOf('day').diff(dayjs(), 'day') + 1;
              const isMoreThan15Days = daysDiff > 15;
              if (hasUserPaid) {
                return (
                  <li className={styles.item} key={0}>
                    {
                      index === 0
                        ? <img className={styles.pic} src={usedImage} alt="?????????" />
                        : <img className={styles.pic} src={unusedImage} alt="?????????" />
                    }
                    <div className={styles.content}>
                      <div className={styles.note}>
                        { payDate && (
                        <span className={styles.date}>
                          {dayjs(payDate).format(dateFormat)}
                          {' '}
                          ??????
                        </span>
                        )}
                        {
                          index === 0
                            ? <span className={`${styles.tag} ${styles.use}`}>?????????</span>
                            : <span className={`${styles.tag} ${styles.notUse}`}>?????????</span>
                        }
                      </div>
                      <div className={styles.line}>
                        <div>
                          ???????????????
                          <span className={styles.date}>{caseType.productName}</span>
                        </div>
                      </div>
                      <div className={styles.line}>
                        ???????????????????????????????????????????????????
                        <span className={styles.date}>
                          <span className={styles.no}>{usedCnt}</span>
                          &nbsp;&nbsp;??? (
                          {dayjs(startDate).format(dateFormat)}
                          ???
                          {dayjs(endDate).format(dateFormat)}
                          )
                        </span>
                      </div>
                      {
                        (isUserPaying || (isTopperGettingClosedAndNotPaied && !isFreePay)) && (
                          <>
                            <div className={`${styles.line} ${styles.premium}`}>
                              <span className={styles.alert}>??????????????????????????????????????????????????????????????????????????????9????????????</span>
                              <Link target="_blank" to="/editProfile">
                                <Button type="primary">???????????????9???</Button>
                              </Link>
                            </div>
                          </>
                        )
                      }
                      {
                        isFreePay && (
                          <div className={`${styles.line} ${styles.premium}`}>
                            <Warning gigDashboard={gigDashboard} type="premium" />
                            <p className={styles.planContent}><Link to={`/editProfile${getPlanParameter()}`}><Button type="primary">????????????</Button></Link></p>
                          </div>
                        )
                      }
                      {
                        config.featureSwitch.VL10160 && (orderType === paidTypes.valuable && isMoreThan15Days) && (
                        <Link className={styles.upgrade} target="_blank" to="/upgrade">
                          <Button type="primary">??????5???????????????? ????????????</Button>
                        </Link>
                        )
                      }
                    </div>
                  </li>
                );
              }
              return (
                <li className={styles.item} key={0}>
                  <img className={styles.pic} src={unusedImage} alt="?????????" />
                  <div className={styles.content}>
                    <div className={styles.line}>
                      <p>
                        ?????????????????????????????????????????????
                        {dayjs(paymentDueDate).format(dateFormat)}
                        {' '}
                        ????????????????????????????????? 1 ??????????????????????????????????????????????????????????????????????????????????????????
                      </p>
                      <Button type="primary" onClick={() => showUnpaidInfo(atmVirtualAccount, ibonVirtualAccount, paymentDueDate, price)}>??????????????????</Button>
                    </div>
                  </div>
                </li>
              );
            })
          }
      </ul>
    );
  }
}

export default PremiumMember;
