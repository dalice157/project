import React, { Component } from 'react';
import config from '../../config/config';
import styles from './Warning.scss';

export default class Warning extends Component {
  noneRender = () => {

  }

  render() {
    const productMap = config.products.json;
    const { gigDashboard, type, hasDiscount } = this.props;
    return (
      <>
        {
            ((gigDashboard.outsourcePlan && gigDashboard.tutorPlan === null) || (gigDashboard.outsourcePlan && gigDashboard.tutorPlan)) && (
            <div className={styles.warn}>
              {
                type === 'trial' && (
                  <>
                    每日5筆不夠看嗎?<br />
                    提醒您：您尚有外包剩餘刊期
                    <span className={styles.ps}>{Object.values(gigDashboard.outsourcePlan)[0]}</span>
                    天 可免費轉換 無限方案  刊期共
                    <span className={styles.ps}>{Object.values(gigDashboard.outsourcePlan)[0]}</span> 天！<br />
                    於轉換後的刊期期間，於每日查閱筆數不限。
                  </>
                )
              }
              {
                type === 'premium' && (
                <>
                  提醒您：您的刊期即將到期，尚有外包剩餘刊期
                  <span className={styles.ps}>{Object.values(gigDashboard.outsourcePlan)[0]}</span>
                  天 可免費轉換
                  <span className={styles.ps}>無限方案</span>
                  刊期 共
                  <span className={styles.ps}>{Object.values(gigDashboard.outsourcePlan)[0]}</span> 天！
                </>
                )
              }
              {
                type === 'non' && (
                  <>
                    提醒您：您尚有外包剩餘刊期
                    <span className={styles.ps}>{Object.values(gigDashboard.outsourcePlan)[0]}</span>
                    天 可免費轉換 無限方案  刊期共
                    <span className={styles.ps}>{Object.values(gigDashboard.outsourcePlan)[0]}</span> 天！
                  </>
                )
              }
            </div>
            )
        }
        {
          gigDashboard.outsourcePlan === null && gigDashboard.tutorPlan && (
          <div className={styles.warn}>
            <div className={styles.pointLink}>
              {
              type === 'premium' && '提醒您，您的刊期即將到期，您尚有剩餘家教網點數'
            }
              {
              (type === 'trial' || type === 'non') && '提醒您，您尚有剩餘家教網點數'
            }
              <a href={`${config.contentSite.domain}/tutorpoint202101/`} target="_blank" rel="noopener noreferrer">查看點數轉換說明範例</a>
            </div>

            目前可選擇轉換以下方案：{Object.keys(gigDashboard.tutorPlan).length >= 2 ? (
              <b>
                <span className={styles.ps}>{productMap.tutor[Object.keys(gigDashboard.tutorPlan)[0]].productName}</span>
                ${productMap.tutor[Object.keys(gigDashboard.tutorPlan)[0]].productAmount}/{productMap.tutor[Object.keys(gigDashboard.tutorPlan)[0]].contentQuantity}天
                <span className={styles.ps}>{Object.values(gigDashboard.tutorPlan)[0]}</span> 次
                <span className={styles.or}>或</span>
                <span className={styles.ps}>{productMap.tutor[Object.keys(gigDashboard.tutorPlan)[1]].productName}</span>
                ${productMap.tutor[Object.keys(gigDashboard.tutorPlan)[1]].productAmount}/{productMap.tutor[Object.keys(gigDashboard.tutorPlan)[1]].contentQuantity}天
                <span className={styles.ps}>{Object.values(gigDashboard.tutorPlan)[1]}</span> 次
              </b>
            ) : (
              <b>
                <span className={styles.ps}>{productMap.tutor[Object.keys(gigDashboard.tutorPlan)[0]].productName}</span>
                <span>${productMap.tutor[Object.keys(gigDashboard.tutorPlan)[0]].productAmount}/{productMap.tutor[Object.keys(gigDashboard.tutorPlan)[0]].contentQuantity}天 </span>
                <span className={styles.ps}>{Object.values(gigDashboard.tutorPlan)[0]}</span>
                <span>次</span>
              </b>
            )}
          </div>
          )
        }
        {
          gigDashboard.outsourcePlan === null && gigDashboard.tutorPlan === null && (
          <div className={styles.warn}>
            {
                type === 'promote' && hasDiscount && (
                  <p>
                    提醒您：您的刊期已到期，立即續購 超值 或 無限 方案，立即享 9 折優惠！
                  </p>
                )
              }
          </div>
          )
        }
      </>
    );
  }
}
