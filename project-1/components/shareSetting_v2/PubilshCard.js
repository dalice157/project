import React from 'react';
import { Link } from 'react-router-dom';
import { uaIsMobile } from 'react-device-detect';
import dayjs from 'dayjs';
import decoLeft from '../../img/common_v2/blue-deco-left.svg';
import decoRight from '../../img/common_v2/blue-deco-right.svg';
import config from '../../config/config';
import { dateFormat } from '../../config/constant';
import Button from '../ui/button';
import styles from './PubilshCard.scss';

const PubilshCard = ({ query, payOrderInfo }) => {
  console.log('payOrderInfo:', payOrderInfo);
  const productMap = config.products.json;
  const chooseTitle = query.publish ? (<>高手檔案<br />已完成更新發佈</>) : '你已完成刊登';

  const isMobileStyle = uaIsMobile() ? styles.mobile : '';
  const caseType = (query.publish || query.newFree) ? '' : productMap[payOrderInfo.planType][payOrderInfo.productNo];
  let estimatePublishDate = '';
  let startDate = '';
  let endDate = '';
  let publicationPlan = '';
  let periodDay = '0';
  let prices = '0';

  if (query.type === 'outsourcePlan') {
    publicationPlan = '無限方案';
  } else if (query.newFree) {
    startDate = dayjs(payOrderInfo.data.experienceMemberStartDate).format(dateFormat);
    endDate = dayjs(payOrderInfo.data.experienceMemberEstimateEndDate).format(dateFormat);
    estimatePublishDate = `刊登日期 ${startDate} ~ ${endDate}`;
    publicationPlan = '體驗方案';
  } else {
    startDate = dayjs(payOrderInfo.estimateStartDate).format(dateFormat);
    endDate = dayjs(payOrderInfo.estimateEndDate).format(dateFormat);
    periodDay = (dayjs(payOrderInfo.estimateEndDate).diff(startDate, 'day')) + 1;
    estimatePublishDate = `預計刊登日期 ${startDate} ~ ${endDate} 止，共 ${payOrderInfo.productNo == undefined ? '0' : periodDay} 天`;
    publicationPlan = caseType.productName;
    prices = payOrderInfo.price;
  }

  return (
    <>
      <h2 className={`${styles.title} ${isMobileStyle}`}>
        <img src={decoLeft} alt="icon" />
        {chooseTitle}
        <img src={decoRight} alt="icon" />
      </h2>
      {
        (query.pay || query.point || query.newFree || query.convertFreeDepositPay || query.vipPay || query.caseVip) && (
          <>
            <div className={styles.proposal}>刊登方案： <span className={styles.plan}>{publicationPlan}</span></div>
            <div className={styles.info}>付款金額 NT${prices}｜{estimatePublishDate} </div>
            <div className={styles.btnWrap}>
              <Link to="/topper-dashboard/home">
                <Button>
                  前往接案管理查看
                </Button>
              </Link>
              <Link to="/caseList">
                <Button type="primary">
                  立即查看案件
                </Button>
              </Link>
            </div>
          </>
        )
      }
    </>
  );
};

export default PubilshCard;
