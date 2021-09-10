import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { uaIsMobile } from 'react-device-detect';
import { PersonOutlineOutlined, PhoneOutlined, EmailOutlined } from '@material-ui/icons';
import dayjs from 'dayjs';
import { stepIterator } from '../../util/editStepUtil';
import {
  loadUserInfo, loadDefaultProfile, sendPaymentOrderReceiver, loadTestUser
} from '../../actions/basic';
import { isVip } from '../../util/topperUtil';
import { dateFormat } from '../../config/constant';
import config from '../../config/config';
import Step from '../../components/ui/step';
import Button from '../../components/ui/button';
import EasyPay from '../../components/editProfile_v2/EasyPay';
import styles from './Payment.scss';

class Payment extends Component {
  state = {
    result: null,
  };

  componentDidMount() {
    this.props.loadTestUser();
    this.props.initUser().then(() => {
      this.props.loadDefaultProfile();
    });
  }

  componentDidUpdate() {
    const {
      userStatus, user
    } = this.props;
    const { meta } = user;
    const freeToDeposit = isVip(user);
    window.payComplete = (result) => {
      console.log('result:', result);
      const { paymentType } = result;
      this.props.sendPaymentOrderReceiver(result, this.props._csrf).then(() => {
        if (paymentType == 1) {
          if (this.props.location.query.checkOk == 'true') {
            // 體驗轉換付費
            this.props.history.push('/success?convertFreeDepositPay=success');
          } else if (userStatus != 2 && (meta.credit != 1 || !meta.deposit) && ((meta.tutorRemainingPoint == 0 && freeToDeposit) || (meta.tutorRemainingPoint > 0))) {
            // vip付費
            this.props.history.push('/success?vipPay=success');
          } else {
            // 一般付費
            this.props.history.push('/success?pay=success');
          }
        }
      });
      this.setState({
        result: result
      });
    };
  }


  render() {
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    const productMap = config.products.json;
    const {
      user, userStatus, payOrderInfo, location, testUser
    } = this.props;
    const { meta } = user;
    const {
      productNo, estimateStartDate, estimateEndDate, orderHashList, name, email, invoiceType, carrierType, invoiceTitle, invoiceAddress, cellphone, telArea, tel, price, planType
    } = payOrderInfo;
    const caseType = productMap[planType][productNo];
    const startDate = dayjs(estimateStartDate).format(dateFormat);
    const endDate = dayjs(estimateEndDate).format(dateFormat);
    const isInvoiceType = invoiceType == '2' ? '二聯式' : '三聯式';
    const freeToDeposit = isVip(user);
    const carrierTypeObj = {
      4: '手機條碼載具',
      5: '捐贈給創世基金會',
      9: '104會員載具'
    };
    const isStepCurrent = () => {
      if (userStatus == 2 && (meta.topperInPaymentPeriod || (meta.credit == 1 || meta.deposit)) && meta.tutorRemainingPoint > 0) {
        return 1;
      }
      if (userStatus == 2 && (meta.topperInPaymentPeriod || (meta.credit == 1 || meta.deposit)) && meta.tutorRemainingPoint == 0) {
        return 1;
      }
      if (userStatus != 2 && (meta.credit != 1 || !meta.deposit) && ((meta.tutorRemainingPoint == 0 && freeToDeposit) || (meta.tutorRemainingPoint > 0))) {
        return 3;
      }
      if (userStatus != 2 && ((meta.credit != 1 || !meta.deposit) && meta.tutorRemainingPoint == 0 && !freeToDeposit && !meta.topperInPaymentPeriod)) {
        return 3;
      }
    };

    return (
      <div className={styles.bg}>
        <div className={`${styles.wrap} ${isMobileStyle}`}>
          <div className={styles.block}>
            <h2 className={styles.title}>訂單內容 </h2>
            {
              isMobile ? (
                <>
                  <table className={styles.table}>
                    <tr>
                      <td colSpan="2" className={`${styles.info} ${styles.type}`}>
                        刊登方案：{caseType.productName}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.price}>數量 1</td>
                      <td align="right" className={styles.price}>${price}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.info} colSpan="2">
                        訂單編號： {orderHashList[0].orderId}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.info} colSpan="2">
                        刊登日期： {startDate} ~ {endDate}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.ps} colSpan="2">
                        *如延後繳款將以付款日為主
                      </td>
                    </tr>
                  </table>
                  <table className={`${styles.table} ${styles.borderTop}`}>
                    <tr>
                      <td className={styles.totalWrap}>
                        訂單總額 &nbsp;&nbsp; <span className={`${styles.price} ${styles.total}`}>${price}</span>
                      </td>
                    </tr>
                  </table>
                </>
              )
                : (
                  <>
                    <table className={styles.table}>
                      <tr>
                        <td className={`${styles.info} ${styles.type}`}>
                          刊登方案：{caseType.productName}
                        </td>
                        <td className={styles.price}>1</td>
                        <td className={styles.price}>${price}</td>
                      </tr>
                      <tr>
                        <td className={styles.info} colSpan="3">
                          訂單編號： {orderHashList[0].orderId}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.info} colSpan="3">
                          刊登日期： {startDate} ~ {endDate}(如延後繳款將以付款日為主)
                        </td>
                      </tr>
                    </table>
                    <table className={`${styles.table} ${styles.borderTop}`}>
                      <tr>
                        <td className={styles.totalWrap}>
                          訂單總額 &nbsp;&nbsp; <span className={`${styles.price} ${styles.total}`}>${price}</span>
                        </td>
                      </tr>
                    </table>
                  </>
                )
            }
          </div>
          {
            payOrderInfo && (
              <div className={styles.block}>
                <h2 className={styles.title}>選付款方式</h2>
                <EasyPay payOrderInfo={payOrderInfo} />
              </div>
            )
          }
          <div className={styles.block}>
            <h2 className={styles.title}>聯絡人資訊 </h2>
            {
              isMobile ? (
                <>
                  <div className={styles.profileInfo}>
                    <div className={styles.label}>聯絡方式</div>
                    <div className={styles.item}><PersonOutlineOutlined />&nbsp;&nbsp; {name}</div>
                    <div className={styles.item}><PhoneOutlined />&nbsp;&nbsp; {`${cellphone},${telArea}-${tel}`}</div>
                    <div className={styles.item}><EmailOutlined />&nbsp;&nbsp; {email}</div>
                  </div>
                  <div className={styles.profileInfo}>
                    <div className={styles.label}>發票資訊</div>
                    <div className={styles.item}>{isInvoiceType}-{carrierTypeObj[carrierType]}</div>
                    <div className={styles.item}>抬頭-{invoiceTitle}</div>
                    <div className={styles.item} />地址- {invoiceAddress}
                  </div>
                </>
              )
                : (
                  <>
                    <div className={styles.profileInfo}><label className={styles.label}>聯絡方式</label> <span className={styles.item}>{name} / 電話-{`${cellphone},${telArea}-${tel}`}  / Email-{email} </span></div>
                    <div className={styles.profileInfo}><label className={styles.label}>發票資訊</label> <span className={styles.item}>{isInvoiceType}-{carrierTypeObj[carrierType]} / 抬頭-{invoiceTitle} / 地址- {invoiceAddress}</span></div>
                  </>
                )
            }
          </div>
          <div className={styles.warning}>
            注意：除信用卡付款外，其他付款方式，需待完成付款後1小時內，才會完成高手檔案發佈刊登及開始應徵或查閱案件聯絡資料。<br />
            若確認選擇「ibon」或「ATM」付款，則請點選下方「關閉」後，將會帶您前往接案管理頁。
            {
              this.state.result && (this.state.result.paymentType == '3' || this.state.result.paymentType == '5') && (
                <div className={styles.btn}>
                  <Link to="/topper-dashboard/home">
                    <Button>
                      關閉前往接案管理
                    </Button>
                  </Link>
                </div>
              )
            }
          </div>

          {
            meta && (
              <div className={`${styles.step} ${isMobileStyle}`}>
                <Step current={isStepCurrent()} stepData={stepIterator(user, testUser, '', location.query.checkOk || '')}>
                  <Button disabled={true}>
                    上一步
                  </Button>
                  <Button disabled={true}>
                    下一步
                  </Button>
                </Step>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  userStatus: state.user.status,
  payOrderInfo: state.basic.payOrderInfo,
  defaultProfileData: state.basic.profile,
  testUser: state.basic.testUser,
  _csrf: state.basic.payInfoData._csrf
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  loadDefaultProfile,
  sendPaymentOrderReceiver,
  loadTestUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
