import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';
import { Spin, Modal, message } from 'antd';
import config from '../../config/config';
import {
  getBasic,
  getProfileGigs,
  loadStaticArea,
  loadProfileInvitableDemands,
  sendVerifySMS,
  sendVerifyCellphone,
  loadBlockInfo,
  loadReviewCheck,
  loadTopperIntro,
  chkActiveProcess
} from '../../actions/common';
import { inviteChat } from '../../actions/chatmeta_v2';
import {
  addProfileDemand,
  modifyProfileDemand,
  getDefaultProfileDemanderForm,
  activateProfileDemander,
  demandPaidSubmit,
} from '../../actions/profile';
import Iframe from '../../components/ui/iframe';
import Button from '../../components/ui/button';
import HiddenOrderForm from '../../components/pay/HiddenOrderForm';
import ChooseModel from '../../components/profile/ChooseModel';
import styles from './Profile.scss';
import { isNumber } from '../../util/commonUtil';

const { info } = Modal;
class Profile extends Component {
  state = {
    redirect: false,
    loading: false,
    checkPublish: false
  }

  async componentDidMount() {
    const topperBasicId = this.props.match.params.basicId;
    if (isNumber(topperBasicId)) {
      // 確認Topper的發布狀態 resp.payload = [true: 已發布] [false: 未發布]
      const resp = await this.props.loadReviewCheck(topperBasicId);

      // payload = false:未發布
      if (resp.payload) {
        this.setState({
          checkPublish: true
        });
        this.props.loadBasic(topperBasicId);
        this.props.loadBlockInfo(topperBasicId);
        await this.props.getProfileGigs(topperBasicId).then((json) => {
          if (json && json.data && json.data.length === 0) {
            setTimeout(() => this.props.getProfileGigs(topperBasicId), 3000); // 啟用後可能profile gigs 沒那麼快
          }
        });
        await this.props.loadTopperIntro(topperBasicId).then(() => {
          this.props.loadStaticArea();
        });
      } else {
        message.warning('此用戶未公開個人檔案，即將導頁至服務列表。');
        setTimeout(() => location.href = '/search', 3000);
      }
    }
  }

  handelLoading = () => {
    this.setState({
      loading: true
    });
  }

  // initializeProfile = async () => {
  //   this.alreadyInit = true;
  //   try {
  //     await this.props.loadDefaultDemanderForm();
  //     await this.props.loadProfileInvitableDemands(this.props.match.params.basicId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }


  /**
   * 聯絡高手
   */
  handleChooseLink = async (selectedDemands) => {
    const { basic } = this.props;
    let redirect = true;
    let vals = [];
    let isOrderTXStatus = selectedDemands.filter((item) => {
      if (!item.alreadyIM || item.alreadyIM != 3) {
        vals.push(item.demandId); // 排除溝通中的值, 不作邀請 (會直接進IM)
      }
      return item.orderTXStatus != '0.5';
    });
    try {
      if (isOrderTXStatus.length != 0) {
        this.setState({
          loading: true,
          childerVisible: true
        });
        await this.props.inviteChat(basic.basicId, vals);
      } else { // 全部都選擇審核中
        this.setState({
          childerVisible: false
        });
        redirect = false;
        await this.props.inviteChat(basic.basicId, vals);
        this.info();
      }
    } catch (error) {
      redirect = false;
      console.error(error);
    }

    this.setState({
      redirect: redirect,
      redirectDemandId: selectedDemands.length > 0 ? selectedDemands[0].demandId : null
    });
  }

  handelSearch = (value, isCat) => {
    if (isCat) {
      open('/search?cats=' + value);
      // this.props.history.push('/search?cats=' + value);
    } else {
      open('/search?q=' + value);
      // this.props.history.push('/search?q=' + value);
    }
  }


  info = () => {
    info({
      title: '已記錄您本次的邀請!!',
      content: (
        <p>案件尚在審核中，邀請後不會立即通知高手，待審核上線刊登時，才會發送邀請訊息通知給高手。</p>
      ),
      okText: '關閉',
      onOk() {
        location.reload();
      },
    });
  }


  render() {
    const {
      user,
      blockInfo,
      basic,
      invitableDemands,
      // eslint-disable-next-line no-unused-vars
      checkBool
    } = this.props;

    const gigId = this.props.location.query.gigId;
    // console.log('checkBool', checkBool);

    const pid = this.props.basic.pid;
    const chooseForm = {
      btnText: '聯繫',
      btnType: 'primary',
      isAvatar: true,
      handleChooseLink: this.handleChooseLink,
      onChooseChange: this.onChooseChange,
      selectedDemands: this.state.selectedDemands
    };
    const demandAction = {
      partBId: this.props.match.params.basicId,
      loadInvitableDemands: () => this.props.loadProfileInvitableDemands(this.props.match.params.basicId)
    };
    const addDemandForm = {
      btnText: '新增需求',
      btnType: '',
    };
    const userBasicId = user.id;
    if (this.state.redirect) { // 聯絡高手有選擇案件會跳轉
      return <Redirect push to={`/chat?demandId=${this.state.redirectDemandId}&topperId=${demandAction.partBId}`} />;
    }
    const isPersonalProfile = this.props.match.params.basicId === String(user.id);
    const topperBasicId = this.props.match.params.basicId;
    const isGigId = gigId ? `?gigId=${gigId}` : '';
    // 檔案未公開 or 觀看自己的品牌頁，不顯示聯繫按鈕
    const contactButton = !this.state.checkPublish || isPersonalProfile ? '' : (
      <ChooseModel
        addDemandForm={addDemandForm}
        demandAction={demandAction}
        chooseForm={chooseForm}
        chkActiveProcess={this.props.chkActiveProcess}
        invitableDemands={invitableDemands}
        user={user}
        userBasicId={userBasicId}
        handelLoading={this.handelLoading}
      />
    );
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <h1 style={{ display: 'none' }}>{blockInfo ? blockInfo.topperName : ''}高手檔案介紹</h1>
        <div className={styles.wrap}>
          {
            pid && <Iframe title="觀看頁" src={`${config.profileSite.domain}/profile/${pid}/commonMode`} />
          }
          <BrowserView>
            <div className={styles.block}>
              { contactButton }
              <Link to={`/service/${topperBasicId}${isGigId}`}>
                <Button type="danger" dataGtmProfile="gig">
                  服務項目
                </Button>
              </Link>
              <ul className={styles.list}>
                <li>
                  <span className={styles.title}>瀏覽數</span>
                  <span className={styles.number}>{ blockInfo ? blockInfo.visitCount : 0 }
                  </span>
                </li>
                <li>
                  <span className={styles.title}>合作數</span>
                  <span className={styles.number}>{ blockInfo ? blockInfo.dealCount : 0 }</span>
                </li>
                <li>
                  <span className={styles.title}>評價數</span>
                  {
              blockInfo && blockInfo.reviewCount != 0 ? (<Link className={styles.number} to={`/evaluation/${basic.basicId}`} data-gtm-profile="evaluation">{blockInfo.reviewCount}</Link>) : (<span className={styles.number}>0</span>)
            }
                </li>
              </ul>
            </div>
          </BrowserView>
          <MobileView>
            <div className={styles.footer}>
              <ul className={styles.list}>
                <li>
                  <span className={styles.title}>瀏覽數</span>
                  <span className={styles.number}>{ blockInfo ? blockInfo.visitCount : 0 }
                  </span>
                </li>
              </ul>
              { contactButton }
              <Link to={`/service/${topperBasicId}${isGigId}`}>
                <Button type="danger" dataGtmProfile="gig">
                  服務項目
                </Button>
              </Link>
            </div>
          </MobileView>
          {
        this.props.paid
        && <HiddenOrderForm formData={this.props.paid} />
        }
        </div>
      </Spin>
    );
  }
}
const mapStateToProps = (state) => {
  // console.log('state.common.gigs.data', state.common.gigs.data);
  return {
    basic: state.common.basic,
    gigs: state.common.gigs.data,
    fileMap: state.common.gigs.fileMap,
    areaData: state.common.area,
    user: state.user,
    invitableDemands: state.common.invitableDemands,
    saveDemand: state.profile.saveDemand,
    defaultDemanderForm: state.profile.defaultDemanderForm,
    verifySMS: state.common.verifySMS,
    verifyPhone: state.common.verifyPhone,
    activate: state.profile.activate,
    paid: state.profile.paid,
    blockInfo: state.common.blockInfo,
    checkBool: state.common.checkBool
  };
};

const mapDispatchToProps = {
  loadBasic: getBasic,
  loadStaticArea,
  getProfileGigs,
  // IM相關API
  inviteChat,
  loadProfileInvitableDemands,
  // Profile 相關 API
  loadAddDemand: addProfileDemand,
  loadModifyDemand: modifyProfileDemand,
  loadDefaultDemanderForm: getDefaultProfileDemanderForm,
  loadActivateDemander: activateProfileDemander,
  loadPaidSubmit: demandPaidSubmit,
  loadBlockInfo,
  // Verify 相關 API
  loadSendVerifySMS: sendVerifySMS,
  loadSendVerifyCellphone: sendVerifyCellphone,
  loadReviewCheck,
  loadTopperIntro,
  chkActiveProcess,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
