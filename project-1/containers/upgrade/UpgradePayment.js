import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import Step from '../../components/ui/step';
import { stepIterator } from '../../util/editStepUtil';
import { moneyFormat } from '../../util/commonUtil';
import { dayFormat } from '../../util/formatUtil';
import config from '../../config/config';
import EasyPay from '../../components/editProfile_v2/EasyPay';
import {
  loadTestUser, sendPaymentOrderReceiver,
} from '../../actions/basic';
import styles from './UpgradePayment.scss';


class UpgradePayment extends Component {
  state = {
    remainSecond: 0,
    loading: false,
  }

  componentDidMount() {
    this.props.loadTestUser();
    this.countDown();
  }

  componentDidUpdate() {
    const { history, _csrf } = this.props;
    window.payComplete = (result) => {
      this.setState({
        loading: true,
      });
      this.props.sendPaymentOrderReceiver(result, _csrf).then(() => {
        history.push('/upgrade-success');
      }).finally(() => {
        this.setState({
          loading: false,
        });
      });
    };
  }


  countDown = () => {
    const { history } = this.props;
    const countDownSecond = 300; // 60秒為一個基數
    const startTime = Date.now();
    const countDownTimer = setInterval(() => {
      // 計算剩餘秒數
      const pastSeconds = parseFloat((Date.now() - startTime) / 1000);
      const remain = (countDownSecond - pastSeconds);
      this.setState({
        remainSecond: remain < 0 ? 0 : remain,
      });

      // 檢查是否結束
      if (remain <= 0) {
        clearInterval(countDownTimer);
        history.push('/upgrade');
      }
    }, 1000);
  }

  render() {
    const { location, testUser, payOrderInfo } = this.props;
    const {
      productNo, estimateStartDate, estimateEndDate, orderHashList, price, planType,
    } = payOrderInfo;
    const { remainSecond, loading } = this.state;
    const productMap = config.products.json;
    const productType = productMap[planType][productNo];
    const periodOfUse = `${dayFormat(estimateStartDate)} ~ ${dayFormat(estimateEndDate)}`;

    return (
      <Spin size="large" spinning={loading} tip="Loading...">
        <div className={styles.bg}>
          <div className={styles.wrap}>
            <div className={styles.card}>
              <h2 className={styles.title}>升級方案訂單內容</h2>
              <div className={styles.infoWrap}>
                <ul className={styles.info}>
                  <li className={styles.productName}>
                    升級
                    {' '}
                    <span className={styles.upgradeProductName}>{productType.categoryName}</span>
                  </li>
                  <li data-label="訂單編號：" className={styles.item}>{orderHashList[0].orderId}</li>
                  <li data-label="使用期間：" className={styles.item}>{periodOfUse}</li>
                </ul>
                <ul className={styles.info}>
                  <li data-label="應付升級差額：" className={styles.item}>
                    NT$
                    {' '}
                    <span className={styles.price}>{moneyFormat(String(price))}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.card}>
              <h2 className={styles.title}>
                信用卡付款
                <div className={`${styles.item} ${styles.payment}`} data-label="本次刷卡金額：">
                  NT$
                  {' '}
                  <span className={styles.price}>{moneyFormat(String(price))}</span>
                </div>
                <div className={styles.countDown}>
                  請點選下方「VISA / Master」付款方式，並於5分鐘內完成付款  剩餘
                  {' '}
                  {new Date(remainSecond * 1000).toISOString().substr(14, 5)}
                </div>
              </h2>
              <div className={styles.easyPay}>
                <EasyPay payOrderInfo={payOrderInfo} />
              </div>
            </div>
            <div className={styles.step}>
              <Step current={1} stepData={stepIterator('', testUser, '', '', location)} />
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  testUser: state.basic.testUser,
  payOrderInfo: state.basic.payOrderInfo,
  _csrf: state.basic.preUpgradePlanInfo._csrf,
});

const mapDispatchToProps = {
  loadTestUser,
  sendPaymentOrderReceiver,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradePayment);
