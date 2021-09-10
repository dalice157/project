import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import dayjs from 'dayjs';
import Header from './components/layout/header';
import Sider from './components/layout/sider';
import Home from './containers/home';
import Deposit from './containers/order/deposit';
import DepositTodos from './containers/order/deposit/todos';
import OrderSearch from './components/order/payment';
import ViolationTodos from './containers/violation/todos';
import ViolationSearch from './containers/violation';
import ViolationContent from './containers/violation/content';
import MemberSearch from './containers/member';
import Member from './containers/member/content.js';
import GigHistory from './containers/member/gig/GigHistory.js';
import GigApplyRecord from './containers/member/gig/GigApplyRecord.js';
import GigClientInvitation from './containers/member/gig/GigClientInvitation.js';
import GigConfirmCase from './containers/member/gig/GigConfirmCase.js';
import GigAcceptConfirm from './containers/member/gig/GigAcceptConfirm.js';
import GigInvitingCase from './containers/member/gig/GigInvitingCase.js';
import GigCooperationCase from './containers/member/gig/GigCooperationCase.js';
import GigClosedCase from './containers/member/gig/GigClosedCase.js';
import MemoAll from './containers/member/memoAll.js';
import MemoBasic from './containers/member/memoBasic.js';
import MemoGig from './containers/member/memoGig.js';
import MemoDemand from './containers/member/memoDemand.js';
import MemoViolation from './containers/member/memoViolation.js';
import MemoChatMeta from './containers/member/MemoChatMeta.js';
import MemoReview from './containers/member/MemoReview.js';
import DeleteAccountList from './containers/member/deleteAccountList.js';
import DeleteAccountRecord from './containers/member/deleteAccountRecord.js';
import OldSiteImport from './containers/member/oldSiteImport.js';
import InviteCode from './containers/tools/inviteCode.js';
import ActiveTopMember from './containers/tools/activeTopMember.js';
import AcManual from './containers/tools/acManual.js';
import DemandSearch from './containers/demand_v3';
import EditDemand from './containers/demand_v3/edit';
import AddDemand from './containers/demand_v3/add';
import GigContact from './containers/member/gig/GigContact';
import DemandWindow from './containers/demand_v3/window';
import DemandVerification from './containers/demand_v3/verification';
import CheckList from './containers/demand_v3/checklist';
import Assignment from './containers/setting/Assignment';
import EditService from './containers/member/gig/Management';
import Manage from './containers/statistics/manage';
import Sales from './containers/statistics/sales';
import MarketingSales from './containers/statistics/marketingSales';
import marketingPlans from './containers/statistics/marketingPlans';
import Plans from './containers/statistics/plans';
import TestAccount from './containers/setting/TestAccount';
import { loginCheck } from './actions/common';
import 'antd/dist/antd.css';

const { Content, Footer } = Layout;


class Default extends Component {
  componentDidMount() {
    this.props.initUser();
  }

  render() {
    const { user } = this.props;

    dayjs.locale('zh-tw');
    return (
      <>
        <meta property="og:ttl" content="345600" />
        <meta property="og:title" content="104 高手後台" />
        <meta property="og:url" content="https://admintop.104.com.tw/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Top 個人品牌，打造你最亮眼的專業形象，顛覆你對履歷表的想像。"
        />
        <meta
          property="og:image"
          content="https://static.104.com.tw/cProfile/FacebookImage_1080x562.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Top 管理後台" />
        <meta
          name="description"
          content="Top 個人品牌，打造你最亮眼的專業形象，顛覆你對履歷表的想像。"
        />
        <title>104 高手後台</title>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider />
          <Layout>
            <Header user={user} />
            <Content style={{ margin: '0 16px' }}>
              <Route exact path="/" component={Home} />
              <Route exact path="/deposit/todos" component={DepositTodos} />
              <Route exact path="/deposit" component={Deposit} />
              <Route exact path="/order/payment" component={OrderSearch} />
              <Route exact path="/violation/todos" component={ViolationTodos} />
              <Route exact path="/violationSearch" component={ViolationSearch} />
              <Route exact path="/violation/content" component={ViolationContent} />
              <Route exact path="/memberSearch" component={MemberSearch} />
              <Route exact path="/member/:basicId" component={Member} />
              <Route exact path="/member/gig/history/:basicId" component={GigHistory} />
              <Route exact path="/member/gig/applyRecord/:basicId" component={GigApplyRecord} />
              <Route exact path="/member/gig/clientInvitation/:basicId" component={GigClientInvitation} />
              <Route exact path="/member/gig/acceptConfirm/:basicId" component={GigAcceptConfirm} />
              <Route exact path="/member/gig/invitingCase/:basicId" component={GigInvitingCase} />
              <Route exact path="/member/gig/confirmCase/:basicId" component={GigConfirmCase} />
              <Route exact path="/member/gig/cooperationCase/:basicId" component={GigCooperationCase} />
              <Route exact path="/member/gig/closedCase/:basicId" component={GigClosedCase} />
              <Route exact path="/member/memo/all/:basicId" component={MemoAll} />
              <Route exact path="/member/memo/basic/:basicId" component={MemoBasic} />
              <Route exact path="/member/memo/gig/:basicId" component={MemoGig} />
              <Route exact path="/member/memo/demand/:basicId" component={MemoDemand} />
              <Route exact path="/member/memo/violation/:basicId" component={MemoViolation} />
              <Route exact path="/member/memo/chatMeta/:basicId" component={MemoChatMeta} />
              <Route exact path="/member/memo/review/:basicId" component={MemoReview} />
              <Route exact path="/deleteAccountList" component={DeleteAccountList} />
              <Route exact path="/deleteAccountRecord/:recordId" component={DeleteAccountRecord} />
              <Route exact path="/oldSiteImport" component={OldSiteImport} />
              <Route exact path="/activeTopMember" component={ActiveTopMember} />
              <Route exact path="/acManual" component={AcManual} />
              <Route exact path="/inviteCode" component={InviteCode} />
              <Route exact path="/demandSearch" component={DemandSearch} />
              <Route exact path="/demand/add/:basicId" component={AddDemand} />
              <Route exact path="/demand/edit/:basicId" component={EditDemand} />
              <Route exact path="/demandWindow" component={DemandWindow} />
              <Route exact path="/assignment" component={Assignment} />
              <Route exact path="/demandVerification" component={DemandVerification} />
              <Route exact path="/demandChecklist" component={CheckList} />
              <Route exact path="/member/gig/edit/:basicId" component={EditService} />
              <Route exact path="/member/gig/demand/contact/:basicId" component={GigContact} />
              <Route exact path="/testAccount" component={TestAccount} />
              <Route exact path="/statistics/sales" component={Sales} />
              <Route exact path="/statistics/marketingSales" component={MarketingSales} />
              <Route exact path="/statistics/marketingPlans" component={marketingPlans} />
              <Route exact path="/statistics/plans" component={Plans} />
              <Route exact path="/statistics/manage" component={Manage} />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              104高手 ©
              {new Date().getFullYear()}
              {' '}
              Created by 加值工程團隊
            </Footer>
          </Layout>
        </Layout>
      </>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  initUser: () => dispatch(loginCheck()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Default);
