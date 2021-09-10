import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button, Dropdown, Menu, Tabs, Modal,
} from 'antd';
import config from '../../config/config';
import PersonalForm from '../../containers/member/basic/personalForm.js';
import GigMeta from './gig/GigMeta.js';
import ReviewMeta from '../../containers/member/review/reviewMeta.js';
import DemandMeta from './demand/demandMeta';
import OrderRecord from '../../containers/member/orderRecord';

const { TabPane } = Tabs;
const { confirm } = Modal;

const AC_MANAGER_URL = config.acManagerUrl;

class MemberTabs extends Component {
  onAcDeleteProcess = async (basicId) => {
    const acDeleteProcess = await this.props.loadAcDeleteProcess(basicId);

    if (acDeleteProcess.payload && acDeleteProcess.payload.success) {
      const { token } = acDeleteProcess.payload.data;
      window.open(`${AC_MANAGER_URL}/delete?token=${token}`);
    }
  }

  handleDeleteTopService = () => {
    const { match, cancelInfo } = this.props;
    const { basicId } = match.params;
    const {
      isViolation,
      isTopperHasCooperatingDemand,
      isTopperPublishing,
      isDemanderHasAuditDemand,
      isDemanderHasOnlineDemand,
      isMemberHasApplyRefundingOrder,
      isMemberHasApplyRefundingPaymentOrder,
    } = cancelInfo;

    let showTips = false;
    let cancelTips;
    if (isViolation || isTopperHasCooperatingDemand || isTopperPublishing || isDemanderHasAuditDemand || isDemanderHasOnlineDemand || isMemberHasApplyRefundingOrder || isMemberHasApplyRefundingPaymentOrder) {
      showTips = true;
      cancelTips = (
        <>
          {isViolation && (
          <>
            檢舉狀態 - 該會員有違規被檢舉紀錄尚未查核，不可刪除高手產品服務。
            <br />
          </>
          )}
          {isTopperHasCooperatingDemand && (
          <>
            合作中案件 - 該會員有合作中的案件，不可刪除高手產品服務。
            <br />
          </>
          )}
          {isTopperPublishing && (
          <>
            品牌頁刊登中 - 該會員尚未取消刊登品牌頁，不可刪除高手產品服務。
            <br />
          </>
          )}
          {isDemanderHasAuditDemand && (
          <>
            送審中案件 - 該會員有待審核案件，不可刪除高手產品服務。
            <br />
          </>
          )}
          {isDemanderHasOnlineDemand && (
          <>
            刊登中案件 - 該會員有案件尚未結案，不可刪除高手產品服務。
            <br />
          </>
          )}
          {isMemberHasApplyRefundingOrder && (
          <>
            尚未完成退款的訂單 - 該會員有訂單尚未完成退款，不可刪除高手產品服務。
            <br />
          </>
          )}
          {isMemberHasApplyRefundingPaymentOrder && (
          <>
            該會員有付費訂單尚未完成退款，不可刪除高手產品服務。
            <br />
          </>
          )}
        </>
      );
    }
    if (showTips) {
      Modal.warning({
        title: '無法刪除高手服務',
        content: cancelTips,
      });
    } else {
      confirm({
        title: '刪除高手產品服務',
        content: '刪除高手產品服務後將無法復原，確定要刪除嗎？',
        onOk: async () => this.onDeleteTop(basicId),
        okText: '確認',
        cancelText: '取消',
      });
    }
  }

  onDeleteTop = async (basicId) => {
    const deleteTop = await this.props.loadDeleteTop(basicId);

    if (deleteTop.payload && deleteTop.payload.success) {
      alert('刪除高手產品服務成功！');
      window.location.reload();
    }
  }

  onChange = (key) => {
    const { match } = this.props;
    const { basicId } = match.params;
    if (key === 'memo') {
      this.props.history.push(`/member/memo/all/${basicId}`);
    } else {
      this.props.history.push(`/member/${basicId}?tabs=${key}`);
    }
  }

  render() {
    const {
      defaultMemberData,
      history: { location },
      match,
    } = this.props;
    const isTopper = defaultMemberData && defaultMemberData.topper ? defaultMemberData.topper : true;
    const { basicId } = match.params;
    const deleteDisabled = defaultMemberData && defaultMemberData.memberDeleteStatus === 1 ? '' : 'disabled';
    const otherMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://google.com.tw">設為黑名單</a>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={() => this.onAcDeleteProcess(basicId)} disabled={deleteDisabled}>查閱已啟用服務</Button>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={() => this.handleDeleteTopService()} disabled={deleteDisabled}>刪除高手產品服務</Button>
        </Menu.Item>
      </Menu>
    );
    const dropDown = (
      <Dropdown overlay={otherMenu} placement="bottomRight" style={{ position: 'absolute', right: 0, display: 'inline-block' }} trigger={['click']}>
        <Button className="ant-dropdown-link" href="#">．．．</Button>
      </Dropdown>
    );

    return (
      <>
        <div style={{ position: 'relative' }}>
          <Tabs defaultActiveKey={location.query.tabs} onChange={this.onChange}>
            <TabPane tab="會員資料" key="basic">
              <PersonalForm />
            </TabPane>
            <TabPane tab="接案服務" key="gig">
              <GigMeta isTopper={isTopper} />
            </TabPane>
            <TabPane tab="服務評價" key="review">
              <ReviewMeta />
            </TabPane>
            <TabPane tab="案件資料" key="demand">
              <DemandMeta />
            </TabPane>
            <TabPane tab="客服備註" key="memo" />
            <TabPane tab="訂單記錄" key="orderRecord">
              <OrderRecord />
            </TabPane>
          </Tabs>
          <div style={{ position: 'absolute', right: '20px', top: '8px' }}>{dropDown}</div>
        </div>
      </>
    );
  }
}

export default withRouter(MemberTabs);
