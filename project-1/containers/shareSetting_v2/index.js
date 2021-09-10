import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import {
  Input, Alert, Spin, message
} from 'antd';
import { Link } from 'react-router-dom';
import { stepIterator } from '../../util/editStepUtil';
import {
  getPublishCheck, loadUserInfo, getCancel, cancel, loadDefaultProfile, loadTestUser
} from '../../actions/basic';
import girlPic from '../../img/editProfile/girl.svg';
import Button from '../../components/ui/button';
import Step from '../../components/ui/step';
import PubilshCard from '../../components/shareSetting_v2/PubilshCard';
import config from '../../config/config';
import styles from './ShareSetting.scss';

class ShareSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plushCheckError: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    this.props.loadTestUser();
    this.props.initUser().then(() => {
      this.props.getPublishCheck();
      this.props.loadDefaultProfile().then(() => {
        this.setState({
          loading: false,
        });
      });
    });
  }

  componentDidUpdate = async (prevProps) => {
    const { user, } = this.props;

    if (user.id && user.id != prevProps.user.id) {
      this.props.getPublishCheck();
    }
  }

  onCopyUrl = () => {
    document.getElementById('copyLink').select();
    document.execCommand('copy');
    message.success('您已複製網址');
  };


  render() {
    const {
      user, payOrderInfo, testUser, location, chargeTopperFreeResult
    } = this.props;
    const { query } = location;
    const isUser = user && user.id ? styles.show : styles.hide;
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    const isPublish = query.publish ? 'publish' : '';
    const getInfoData = query.newFree ? chargeTopperFreeResult : payOrderInfo;
    let publishErrors = [];
    const isStepCurrent = () => {
      if (query.publish) {
        return 2;
      }
      if (query.vipPay || query.pay) {
        return 4;
      }
      if (query.newFree) {
        return 3;
      }
      if (query.convertFreeDepositPay) {
        return 2;
      }
      if (query.memberType === 'new') {
        return 3;
      } else {
        return 1;
      }
    };


    if (this.props.publishCheck.length) {
      this.props.publishCheck.forEach((errorKey) => {
        if (errorKey === 'gallery') {
          publishErrors = [...publishErrors, (<div>接案檔案『作品集』上傳失敗，造成無法公開，請重新上傳發布。<a href="/editor" target="_blank">前往編輯接案檔案</a></div>)];
        } else if (errorKey === 'honor') {
          publishErrors = [...publishErrors, (<div>接案檔案『專案成就』上傳失敗，造成無法公開，請重新上傳發布。<a href="/editor" target="_blank">前往編輯接案檔案</a></div>)];
        } else if (errorKey === 'custom') {
          publishErrors = [...publishErrors, (<div>接案檔案『客製化專區』上傳失敗，造成無法公開，請重新上傳發布。<a href="/editor" target="_blank">前往編輯接案檔案</a></div>)];
        }
      });
    }

    let publishErrorWarnings = [];

    if (publishErrors.length) {
      for (let i = 0; i < publishErrors.length; i++) {
        const alertMsg = (
          <Alert
            key={i}
            message={publishErrors[i]}
            banner
            closable
          />
        );
        publishErrorWarnings = [...publishErrorWarnings, alertMsg];
      }
    }
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <div className={`${styles.wrap} ${isUser} ${isMobileStyle}`}>
          { publishErrorWarnings.length > 0 && publishErrorWarnings }
          <div className={styles.block}>
            <PubilshCard
              query={query}
              payOrderInfo={getInfoData}
            />
            <h3 className={styles.title}>讓更多人知道你</h3>
            <p className={styles.text}>
              透過網路分享，加強宣傳你的接案檔案<br />
              並定期更新與充實作品集及服務資訊，會大大提升案主主動邀請機會唷！
            </p>
            <div className={styles.copyUrl}>
              <Input
                className={styles.link}
                id="copyLink"
                value={`${config.topSite.domain}/profile/${user && user.id}`}
              />
              <Button onClick={this.onCopyUrl} type="primary">
                複製網址
              </Button>
            </div>
            <img className={styles.img} src={girlPic} alt="讓更多人知道你" />
          </div>
        </div>
        {
          user.meta && (
            <div className={`${styles.step} ${isMobileStyle}`}>
              <Step current={isStepCurrent()} stepData={stepIterator(user, testUser, isPublish, query.checkOk || '', location)}>
                <Link to="/caseList">
                  <Button>
                    立即查看案件
                  </Button>
                </Link>
              </Step>
            </div>
          )
        }
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  userStatus: state.user.status,
  publishCheck: state.basic.publishCheck,
  chargeTopperFreeResult: state.basic.chargeTopperFree,
  getCancel: state.basic.getCancel,
  defaultProfileData: state.basic.profile,
  payOrderInfo: state.basic.payOrderInfo,
  testUser: state.basic.testUser,
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  getPublishCheck,
  loadGetCancel: getCancel,
  putCancel: cancel,
  loadDefaultProfile,
  loadTestUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareSetting);
