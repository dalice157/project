import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Table, Divider } from 'antd';
import {
  checkCancelGigPublish, cancelGigPublish, loadGigDashboard, loadTopperName, loadGigDashboardv2
} from '../../../actions/member';
import { memberDepositPublishStatus, memberPublishStatus, depositStatus } from '../../../config/selectData';
import GigUnpublish from './GigUnpublish.js';
import SyncOldSite from './SyncOldSite.js';
import { dateFormat, optionsToTable } from '../../../util/formatUtil';
import './gig.scss';

class GigMsg extends PureComponent {
  demandManagementColumns = [
    {
      title: '邀請中',
      dataIndex: 'invitingCount',
      render: invitingCount => <a href={ `/admin/member/gig/invitingCase/${this.props.basicId}` } target="_blank" rel="noopener noreferrer">{invitingCount}</a>,
    },
    {
      title: '溝通中',
      dataIndex: 'communicatingCount',
      render: communicatingCount => <a href={ `/admin/member/gig/confirmCase/${this.props.basicId}` } target="_blank" rel="noreferrer noopener">{communicatingCount}</a>,
    },
    {
      title: '合作中',
      dataIndex: 'cooperatingCount',
      render: cooperatingCount => <a href={ `/admin/member/gig/cooperationCase/${this.props.basicId}` } target="_blank" rel="noreferrer noopener">{cooperatingCount}</a>,
    },
    {
      title: '已結案關閉',
      dataIndex: 'closedCount',
      render: closedCount => <a href={ `/admin/member/gig/closedCase/${this.props.basicId}` } target="_blank" rel="noreferrer noopener">{closedCount}</a>,
    }
  ]

  demandRecordColumns = [
    {
      title: '主動應徵總數',
      dataIndex: 'quotationCount',
      render: quotationCount => <a target="_blank" rel="noopener noreferrer" href={ `/admin/member/gig/applyRecord/${this.props.basicId}` }>{quotationCount}</a>,
    },
    {
      title: '查閱聯絡資料總數',
      dataIndex: 'getContactCount',
      render: getContactCount => <a target="_blank" href={ `/admin/member/gig/demand/contact/${this.props.basicId}` } rel="noreferrer noopener">{getContactCount}</a>,
    },
    {
      title: '案主邀請總數',
      dataIndex: 'demanderInviteCount',
      render: demanderInviteCount => <a target="_blank" rel="noopener noreferrer" href={ `/admin/member/gig/clientInvitation/${this.props.basicId}` }>{demanderInviteCount}</a>,
    },
    {
      title: '高手網站合作總數',
      dataIndex: 'topSiteCooperateCount',
      render: topSiteCooperateCount => <a target="_blank" rel="noopener noreferrer" href={ `/admin/member/gig/acceptConfirm/${this.props.basicId}` }>{topSiteCooperateCount}</a>,
    },
    {
      title: '舊站匯入成交總數',
      dataIndex: 'oldSiteImportDealCount',
    },
    {
      title: '評價總數',
      dataIndex: 'reviewCount',
      render: reviewCount => <a target="_blank" rel="noopener noreferrer" href={ `/admin/member/${this.props.basicId}?tabs=review` }>{reviewCount}</a>,
    },
  ]

  gigColumns = [
    {
      title: '服務編號',
      dataIndex: 'gigId',
    },
    {
      title: '服務名稱',
      dataIndex: 'title',
      render: (title, gig) => <a href={ `/admin/member/gig/edit/${this.props.basicId}?gigId=${gig.gigId}` } target="_blank" rel="noreferrer noopener">{title}</a>,
    },
    {
      title: '建立日期',
      dataIndex: 'createDate',
      render: createDate => (createDate ? dateFormat(createDate, true) : '無'),
    },
    {
      title: '更新日期',
      dataIndex: 'modifyDate',
      render: modifyDate => (modifyDate ? dateFormat(modifyDate, true) : '無'),
    }
  ]

  async componentDidMount() {
    const { isTopper, basicId } = this.props;
    if (isTopper) {
      this.props.loadGigDashboardv2(basicId);
    }
  }

  render() {
    const { dashboard, basicId, isTopper } = this.props;
    const {
      topperDashboard, publishStatus, gigList, startDate, endDate, publishCount, violation, deposit, orderStatus, refundPaymentOrderPower, experienceMemberStartDate, experienceMemberEstimateEndDate, experienceMemberEndDate, paymentOrder, vipRecord, loading
    } = dashboard;
    const {
      invitingCount, communicatingCount, cooperatingCount, closedCount, quotationCount, getContactCount, demanderInviteCount, topSiteCooperateCount, oldSiteImportDealCount, reviewCount
    } = topperDashboard;
    const demandManagement = [{
      invitingCount, communicatingCount, cooperatingCount, closedCount
    }];
    const demandRecord = [{
      quotationCount, getContactCount, demanderInviteCount, topSiteCooperateCount, oldSiteImportDealCount, reviewCount,
    }];
    const isUnpublishBtnDisabled = !(publishStatus === 'on' || (publishStatus === 'on' && deposit !== 'orderTX' && refundPaymentOrderPower));
    return (
      <>
        {
        !loading ? (
          isTopper
            ? (
              <>
                <div className="field">
                  <label>服務刊登狀態</label>
                  <div className="rowInput">
                    {
                    publishStatus === 'on'
                      ? (
                        vipRecord
                          ? '刊登中（付費）'
                          : '刊登中（體驗）'
                      )
                      : optionsToTable(memberPublishStatus)[publishStatus]
                  }
                    <GigUnpublish basicId={ basicId } checkCancelGigPublish={ this.props.checkCancelGigPublish } cancelGigPublish={ this.props.cancelGigPublish } disabled={ isUnpublishBtnDisabled } />
                    <SyncOldSite basicId={ basicId } />
                  </div>
                </div>
                <div className="field">
                  <label>發布刊登日期</label>
                  <div className="rowInput">
                    {startDate ? dateFormat(startDate, true) : '無'}
                  </div>
                </div>
                <div className="field">
                  <label>結束刊登日期</label>
                  <div className="rowInput">
                    {endDate ? dateFormat(endDate, true) : '無'}
                  </div>
                </div>
                <div className="field">
                  <label>刊登歷史紀錄</label>
                  <div className="rowInput">
                    {
                    publishCount !== 0
                      ? <Link target="_blank" to={ `/member/gig/history/${this.props.basicId}` }>{publishCount}</Link>
                      : <>無</>
                  }
                  </div>
                </div>
                <div className="field">
                  <label>檢舉紀錄</label>
                  <div className="rowInput">
                    {
                    violation
                      ? <Link target="_blank" to="/violationSearch">有</Link>
                      : <>無</>
                  }
                  </div>
                </div>
                <Divider />
                <div className="field">
                  <label>體驗刊登方式</label>
                  <div className="rowInput">
                    {deposit
                      ? `${memberDepositPublishStatus[deposit]}${deposit === 'orderTX' && orderStatus ? '('.concat(depositStatus[orderStatus]).concat(')') : ''}`
                      : '無'
                  }
                  </div>
                </div>
                <div className="field">
                  <label>體驗開始日期</label>
                  <div className="rowInput">
                    {experienceMemberStartDate ? dateFormat(experienceMemberStartDate, true) : '無'}
                  </div>
                </div>
                <div className="field">
                  <label>體驗預計結束日期</label>
                  <div className="rowInput">
                    {experienceMemberEstimateEndDate ? dateFormat(experienceMemberEstimateEndDate, true) : '無'}
                  </div>
                </div>
                <div className="field">
                  <label>體驗實際結束日期</label>
                  <div className="rowInput">
                    {experienceMemberEndDate ? dateFormat(experienceMemberEndDate, true) : '無'}
                  </div>
                </div>
                <Divider />
                <div className="field">
                  <label>最近付費方案</label>
                  <div className="rowInput">
                    {paymentOrder && paymentOrder.productName ? paymentOrder.productName : '無'}
                  </div>
                </div>
                <div className="field">
                  <label>刊登開始日期</label>
                  <div className="rowInput">
                    {paymentOrder && paymentOrder.startDate ? dateFormat(paymentOrder.startDate, true) : '無'}
                  </div>
                </div>
                <div className="field">
                  <label>預計結束日期</label>
                  <div className="rowInput">
                    {paymentOrder && paymentOrder.estimateEndDate ? dateFormat(paymentOrder.estimateEndDate, true) : '無'}
                  </div>
                </div>
                <div className="field">
                  <label>實際結束日期</label>
                  <div className="rowInput">
                    {paymentOrder && paymentOrder.endDate ? dateFormat(paymentOrder.endDate, true) : '無'}
                  </div>
                </div>
                <Divider />
                <div className="field alignTop">
                  <label>合作案件管理<p>(自2020/10/19開始記錄)</p></label>
                  <div className="rowInput alignTop">
                    <Table
                      rowKey="invitingCount"
                      bordered
                      pagination={ false }
                      columns={ this.demandManagementColumns }
                      dataSource={ demandManagement }
                    />
                  </div>
                </div>
                <div className="field alignTop">
                  <label>合作案件紀錄<p>(自2020/10/19開始記錄)</p></label>
                  <div className="rowInput alignTop">
                    <Table
                      rowKey="quotationCount"
                      bordered
                      pagination={ false }
                      columns={ this.demandRecordColumns }
                      dataSource={ demandRecord }
                    />
                  </div>
                </div>
                <div className="field alignTop">
                  <label>服務列表</label>
                  <div className="rowInput alignTop">
                    <Table
                      rowKey="gigId"
                      bordered
                      pagination={ false }
                      columns={ this.gigColumns }
                      dataSource={ gigList }
                    />
                  </div>
                </div>
              </>
            ) : <p style={ { fontSize: '20px', textAlign: 'center', margin: '50px auto' } }>此會員尚未開啟接案服務</p>
        ) : (
          <div>
            <LoadingOutlined />
            <span style={ { fontSize: '14px', marginLeft: '10px' } }>接案服務載入中</span>
          </div>
        )
      }
      </>
    );
  }
}
const mapStateToProps = state => ({
  dashboard: state.member.gigDashboard,
  topperName: state.member.topperName,
});
const mapDispatchToProps = {
  checkCancelGigPublish,
  cancelGigPublish,
  loadGigDashboard,
  loadGigDashboardv2,
  loadTopperName,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigMsg);
