import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Menu, Dropdown, Button, Modal, Spin
} from 'antd';
import { loadStaticArea } from '../../actions/common.js';
import {
  getMember,
  acDeleteProcess,
  getCancelInfo,
} from '../../actions/member.js';

import { getMemo } from '../../actions/memo.js';

import MemoMenu from '../../components/member/memo/memoMenu.js';
import MemoTabs from '../../components/member/memo/memoTabs.js';
import TabBasic from '../../components/member/memo/tabBasic.js';

import config from '../../config/config';

import { tabs } from '../../config/selectData.js';
import './memo.scss';

const AC_MANAGER_URL = config.acManagerUrl;
const { confirm } = Modal;


class MemoBasic extends Component {
  state = {
    postNum: '',
    editing: false,
    loading: false,
    visible: 50,
    cursor: null,
    items: []
  }

  async componentDidMount() {
    const basicId = this.props.match.params.basicId;
    this.setState({
      loading: true
    });
    this.props.loadStaticArea();
    if (basicId) {
      await this.props.loadDefaultMemberData(basicId);
      await this.props.loadCancelInfo(basicId);
      this.props.loadMemoList(basicId, '', 'basic').then(() => {
        this.setState({
          loading: false,
          cursor: this.props.memoList.cursor ? this.props.memoList.cursor : '',
          items: this.props.memoList.data,
          memberFullName: this.props.defaultMemberData.topperVerifyForm.familyName + this.props.defaultMemberData.topperVerifyForm.firstName
        });
      });
    }
  }


  onAcDeleteProcess = async (basicId) => {
    const resp = await this.props.loadAcDeleteProcess(basicId);

    if (resp.payload && resp.payload.success) {
      let token = resp.payload.data.token;
      window.open(AC_MANAGER_URL + '/delete?token=' + token);
    }
  }

  handleDeleteTopService = () => {
    const {
      isViolation,
      isTopperHasCooperatingDemand,
      isTopperPublishing,
      isDemanderHasAuditDemand,
      isDemanderHasOnlineDemand,
      isMemberHasApplyRefundingOrder
    } = this.props.cancelInfo;

    let showTips = false;
    let cancelTips;
    if (isViolation || isTopperHasCooperatingDemand || isTopperPublishing || isDemanderHasAuditDemand || isDemanderHasOnlineDemand || isMemberHasApplyRefundingOrder) {
      showTips = true;
      cancelTips = (
        <>
          {isViolation && <>檢舉狀態 - 該會員有違規被檢舉紀錄尚未查核，不可刪除高手產品服務。<br /></>}
          {isTopperHasCooperatingDemand && <>合作中案件 - 該會員有合作中的案件，不可刪除高手產品服務。<br /></>}
          {isTopperPublishing && <>品牌頁刊登中 - 該會員尚未取消刊登品牌頁，不可刪除高手產品服務。<br /></>}
          {isDemanderHasAuditDemand && <>送審中案件 - 該會員有待審核案件，不可刪除高手產品服務。<br /></>}
          {isDemanderHasOnlineDemand && <>刊登中案件 - 該會員有案件尚未結案，不可刪除高手產品服務。<br /></>}
          {isMemberHasApplyRefundingOrder && <>尚未完成退款的訂單 - 該會員有訂單尚未完成退款，不可刪除高手產品服務。<br /></>}
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
        onOk: async () => {
          return this.onDeleteTop(this.props.defaultMemberData.basicId);
        },
        okText: '確認',
        cancelText: '取消'
      });
    }
  }

  onDeleteTop = async (basicId) => {
    const deleteTop = await this.props.loadDeleteTop(basicId);

    if (deleteTop.payload && deleteTop.payload.success) {
      // eslint-disable-next-line
      alert('刪除高手產品服務成功！');
      window.location.reload();
    }
  }

  loadMore = () => {
    const basicId = this.props.match.params.basicId;
    this.setState({
      loading: true
    });
    this.props.loadMemoList(basicId, this.state.cursor, 'basic').then((res) => {
      const isCursor = res.payload.cursor ? res.payload.cursor : '';
      this.setState((prev) => {
        return {
          loading: false,
          visible: prev.visible + res.payload.data.length,
          cursor: isCursor,
          items: prev.items.concat(res.payload.data)
        };
      });
    });
  }

  render() {
    const deleteDisabled = this.props.defaultMemberData && this.props.defaultMemberData.memberDeleteStatus === 1 ? '' : 'disabled';
    let otherMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://google.com.tw">設為黑名單</a>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={ () => this.onAcDeleteProcess(this.props.defaultMemberData.basicId) } disabled={ deleteDisabled }>查閱已啟用服務</Button>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={ () => this.handleDeleteTopService() } disabled={ deleteDisabled }>刪除高手產品服務</Button>
        </Menu.Item>
      </Menu>
    );
    let dropDown = (
      <Dropdown overlay={ otherMenu } placement="bottomRight" style={ { position: 'absolute', right: 0, display: 'inline-block' } } trigger={ ['click'] }>
        <Button className="ant-dropdown-link" href="#">．．．</Button>
      </Dropdown>
    );
    const basicId = this.props.match.params.basicId;
    const { items, visible, cursor } = this.state;
    return (
      <Spin tip="Loading..." spinning={ this.state.loading }>
        <h1>{this.state.memberFullName}會員資料</h1>
        <div className="memoWrap">
          <MemoMenu
            basicId={ basicId }
          />
          <div style={ { position: 'absolute', right: '20px', top: '8px' } }>{dropDown}</div>
          <div className="memoContent">
            <MemoTabs
              basicId={ basicId }
              tabs={ tabs }
              current="basic"
            />
            {
              items.length > 0 ? <TabBasic data={ items } visible={ visible } area={ this.props.area } /> : <div className="noData">無會員備註資料</div>
            }
            {
              cursor
              && (
              <Button className="more" type="primary" onClick={ this.loadMore } block>
                Load more
              </Button>
              )
            }
          </div>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    area: state.common.area,
    cancelInfo: state.member.cancelInfo,
    defaultMemberData: state.member.memberData,
    memoList: state.memo.memoList
  };
};

const mapDispatchToProps = {
  loadStaticArea: loadStaticArea,
  loadDefaultMemberData: getMember,
  loadAcDeleteProcess: acDeleteProcess,
  loadCancelInfo: getCancelInfo,
  loadMemoList: getMemo
};

export default connect(mapStateToProps, mapDispatchToProps)(MemoBasic);
