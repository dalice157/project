import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import Button from '../ui/button_v2';
import publish from '../../img/case/overview3.png';
import styles from './NonMember.scss';
import Warning from './Warning';

class NonMember extends Component {
  render() {
    const { isMobile, gigDashboard } = this.props;
    const isFreePay = gigDashboard && (gigDashboard.outsourcePlan || gigDashboard.tutorPlan);
    const hasDiscount = gigDashboard && (gigDashboard.tutorPlan === null && gigDashboard.outsourcePlan === null && dayjs(gigDashboard.lastExpiredDate).add(29, 'day').diff(dayjs(), 'd') >= 1);
    const isPayStyle = isFreePay ? '' : styles.pay;
    const isPromoteStyle = hasDiscount ? styles.promote : '';
    const getPlanParameter = () => {
      if ((gigDashboard.outsourcePlan && gigDashboard.tutorPlan === null) || (gigDashboard.outsourcePlan && gigDashboard.tutorPlan)) {
        return '?type=outsource&memberType=new';
      } else if (gigDashboard.outsourcePlan === null && gigDashboard.tutorPlan) {
        return '?type=tutor&memberType=new';
      } else {
        return '?memberType=new';
      }
    };
    if (isMobile) {
      return (
        <ul className={styles.planList}>
          <li className={styles.planElement}>
            <p className={styles.planContent}>
              您的高手檔案目前為未發佈刊登狀態，可能已到期或尚未完成編輯發佈，請完成發佈刊登，即可開始接案喔！！
            </p>
          </li>
          <li className={styles.planElement}>
            {
            isFreePay ? (
              <>
                <Warning gigDashboard={gigDashboard} type="non" />
                <p className={styles.planContent}><Link to={`/editor${getPlanParameter()}`}>立即轉換</Link></p>
              </>
            ) : (
              <>
                <Warning gigDashboard={gigDashboard} type="promote" hasDiscount={hasDiscount} />
                <p className={styles.planContent}>
                  {
                    hasDiscount
                      ? <Link target="_blank" to="/editProfile"><Button type="primary">立即續購享9折</Button></Link>
                      : <Link target="_blank" to="/publication-plan"><Button type="primary">立即刊登</Button></Link>
                  }
                </p>
              </>
            )
          }
          </li>
        </ul>
      );
    }
    return (
      <div className={styles.publishWrap}>
        <img className={styles.pic} src={publish} alt="刊登日期" />
        <div className={styles.content}>
          <div className={`${styles.list} ${isPayStyle} ${isPromoteStyle}`}>
            <p>您的高手檔案目前為未發佈刊登狀態，可能已到期或尚未完成編輯發佈，請完成發佈刊登，即可開始接案喔！！</p>
            {
              isFreePay ? (
                <div className={styles.copywriting}>
                  <Warning gigDashboard={gigDashboard} type="non" />
                  <p className={styles.planContent}><Link to={`/editor${getPlanParameter()}`}><Button type="primary">立即轉換</Button></Link></p>
                </div>
              ) : (
                <div className={styles.copywriting}>
                  <Warning gigDashboard={gigDashboard} type="promote" hasDiscount={hasDiscount} />
                  {
                    hasDiscount
                      ? <Link target="_blank" to="/editProfile"><Button type="primary">立即續購享9折</Button></Link>
                      : <Link target="_blank" to="/publication-plan"><Button type="primary">立即刊登</Button></Link>
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default NonMember;
