/* eslint-disable jsx-a11y/anchor-has-content */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Modal } from 'antd';
import {
  loadUserInfo, importTopperProfile,
} from '../../actions/basic';
import { chkActiveProcess } from '../../actions/common';

import { paidTypes } from '../../config/constant.js';
import BrandModel from '../../components/marketing_v3/BrandModel';
import styles from './BeTopperButton.scss';

class BeTopperButton extends Component {
  state = {
    promptVisible: ''
  }

  componentDidMount() {
    const { user } = this.props;
    const isTopper = user && user.meta && user.meta.topper;
    const openModel = this.props.location.query.openModel || false;
    if (isTopper && openModel) {
      this.showTopperEditorModal(this.redirectToProfile);
    }
  }

  showTopperEditorModal = (redirectOk, redirectCancel) => {
    const { user } = this.props;
    const userStatus = user.status;
    const meta = user.meta;
    this.setState({
      promptVisible: false
    });
    this.props.chkActiveProcess().then((resp) => {
      if (resp.payload.success) {
        if (userStatus == 2 && meta.topperInPaymentPeriod) {
          Modal.confirm({
            okText: '查看案件',
            cancelText: '接案管理',
            content: (
              <div className={styles.content}>
                你已發佈高手檔案，並還在 刊期中，可直接 查看案件，或 接案管理查看。
              </div>
            ),
            onOk: () => {
              this.props.history.push('/caseList');
            },
            onCancel() {
              redirectCancel();
            }
          });
        } else if (userStatus == 2 && (meta.credit == 1 || meta.deposit) && !meta.topperInPaymentPeriod) {
          Modal.confirm({
            title: '請確認',
            okText: '前往購買',
            cancelText: '繼續體驗',
            content: (
              <div className={styles.content}>
                您目前為體驗會員！<br />
                在完成購買後，系統會同時將您的「體驗會員」身分轉換為所選擇的方案刊登。<br /><br />
                **若您有支付押金體驗，亦會於14天後刷退。<br />
              </div>
            ),
            onOk() {
              redirectOk();
            },
          });
        } else {
          redirectOk();
        }
      }
    });
  }

  redirectToProfile = () => {
    const { user } = this.props;
    const userStatus = user.status;
    const meta = user.meta;
    const { paidList, outsourcePlan, tutorPlan } = this.props.paidPlanInfo;
    // isTrialMember: 體驗會員, isPaidMember: 已付費
    const isTrialMember = (paidList && paidList.length >= 1) ? paidList.find(order => order.orderType === paidTypes.freeTrial) : false;
    const isPaidMember = (paidList && paidList.length >= 1) ? paidList.find(order => (order.orderType === paidTypes.valuable || order.orderType === paidTypes.infinite)) : false;
    const isChangeMember = !!(((paidList && paidList.length >= 1 && paidList.find(plan => plan.planType === 'outsource' || plan.planType === 'tutor')) || (outsourcePlan || tutorPlan)));
    if (isChangeMember) { // 轉換
      if (!isTrialMember && !isPaidMember && paidList.length === 0) { // 新會員
        if (outsourcePlan) {
          this.props.history.push('/editor?type=outsource&memberType=new');
        } else if (tutorPlan) {
          this.props.history.push('/editor?type=tutor&memberType=new');
        } else {
          this.props.history.push('/editor?memberType=new');
        }
      }
      if (isTrialMember) {
        if (outsourcePlan) {
          this.props.history.push('/editProfile?type=outsource&memberType=trial');
        } else if (tutorPlan) {
          this.props.history.push('/editProfile?type=tutor&memberType=trial');
        } else {
          this.props.history.push('/editProfile?memberType=trial');
        }
      }
      if (isPaidMember) {
        if (outsourcePlan) {
          this.props.history.push('/editProfile?type=outsource&memberType=paid');
        } else if (tutorPlan) {
          this.props.history.push('/editProfile?type=tutor&memberType=paid');
        } else {
          this.props.history.push('/editProfile?memberType=paid');
        }
      }
    } else if (userStatus == 2 && (meta.credit == 1 || meta.deposit) && !meta.topperInPaymentPeriod) { // 體驗轉換
      this.props.history.push('/editProfile?checkOk=true');
    } else {
      this.props.history.push('/editor');
    }
  }

  redirectToTopper = () => {
    this.props.history.push('/topper-dashboard/home');
  }

  render() {
    const openModel = this.props.location.query.openModel || false;
    const {
      user,
      initUser,
      plusList,
      text,
      gtmFrom,
      isBanner
    } = this.props;

    const brandForm = {
      isBanner,
      btnText: text,
      btnType: 'primary',
      importTopperProfile: this.props.importTopperProfile,
      importSource: this.props.importSource
    };
    const isTopper = user && user.meta && user.meta.topper;
    // 傳props使用dataGtmJoin
    const gtmConfig = {
      // [位置: join]
      join: {
        'data-gtm-join': '遮罩-加入接案',
        dataGtmJoin: '遮罩-加入接案',
      },
      'join-step': {
        'data-gtm-join': '內容-加入接案',
        dataGtmJoin: '內容-加入接案',
      },
      'join-freeTrial': {
        'data-gtm-join': '立即申請體驗',
        dataGtmJoin: '立即申請體驗',
      },
      'join-valuable': {
        'data-gtm-join': '購買方案-超值',
        dataGtmJoin: '購買方案-超值',
      },
      'join-infinite': {
        'data-gtm-join': '購買方案-無限',
        dataGtmJoin: '購買方案-無限',
      },
      // [位置: publication-plan]
      'publish-plan': {
        'data-gtm-plan': '立即購買',
        dataGtmPlan: '立即購買',
      },
    };
    const linkToLoginCheck = isBanner ? <a onClick={() => this.showTopperEditorModal(this.redirectToProfile, this.redirectToTopper)} {...gtmConfig[gtmFrom]} title={text} /> : <Button type="primary" onClick={() => this.showTopperEditorModal(this.redirectToProfile, this.redirectToTopper)} {...gtmConfig[gtmFrom]}>{text}</Button>;

    return (
      <>
        {isTopper
          ? linkToLoginCheck : (
            <BrandModel
              brandForm={brandForm}
              initUser={initUser}
              plusList={plusList}
              redirectToProfile={this.redirectToProfile}
              visible={openModel}
              chkActiveProcess={this.props.chkActiveProcess}
              {...gtmConfig[gtmFrom]}
            />
          )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    import: state.basic.import,
    importSource: state.basic.importSource,
    newBrand: state.basic.newBrand,
    plusList: state.basic.plusList,
    articles: state.wordpress.marketingArticles,
    paidPlanInfo: state.basic.paidPlanInfo
  };
};
const mapDispatchToProps = {
  initUser: loadUserInfo,
  importTopperProfile,
  chkActiveProcess,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BeTopperButton));
