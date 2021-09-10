import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import { dateFormat } from '../../../util/formatUtil.js';
import { payOrderTypeObj, paymentTypeObj, statisticsType } from '../../../config/selectData';
import { loadPaymentList } from '../../../actions/order';


class PaidRecord extends Component {
  columns = [
    {
      title: '訂單編號 / 訂單狀態',
      dataIndex: 'orderId',
      render: (val, record) => (
        <>
          <div><a target="_blank" href={`/admin/order/payment?orderId=${val}`} rel="noopener noreferrer">{val}</a></div>
          <div>{payOrderTypeObj[record.orderStatus]}</div>
        </>
      ),
    },
    {
      title: '委刊單號 / 原方案委刊單 / 新續回',
      dataIndex: 'statisticsType',
      render: (val, record) => (
        <>
          {
            record.soNo && typeof record.soNo === 'string' && record.soNo.startsWith('30') ? (
              <>
                <div>{record.soNo}</div>
                <div>{record.upgradeFromSoNo}</div>
                <div>{statisticsType[val]}</div>
              </>
            ) : '-'
        }
        </>
      ),
    },
    {
      title: '內服單號',
      dataIndex: 'soNo',
      render: val => (
        <>
          {
          val && typeof val === 'string' && val.startsWith('31') ? (
            <>
              <div>{val}</div>
            </>
          ) : '-'
        }
        </>
      ),
    },
    {
      title: '銷帳編號(ATM/ibon)',
      dataIndex: 'ibonVirtualAccount',
      render: (val, record) => (
        <>
          {
          (val || record.atmVirtualAccount) ? (
            <>
              {val && <div>{val}</div>}
              {record.atmVirtualAccount && <div>{record.atmVirtualAccount}</div>}
            </>
          ) : '-'
        }
        </>
      ),
    },
    {
      title: '購買方案 / 實付金額',
      dataIndex: 'productName',
      render: (val, record) => (
        <>
          <div>{val}</div>
          <div>{record.price}</div>
        </>
      ),
    },
    {
      title: '付費方式',
      dataIndex: 'paymentType',
      render: val => (<div>{ paymentTypeObj[val] }</div>),
    },
    {
      title: '付款日期',
      dataIndex: 'payDate',
      render: val => (
        <>
          {val ? dateFormat(val, true) : '-'}
        </>
      ),
    },
    {
      title: '預計開始日期 / 預計結束日期',
      dataIndex: 'estimateStartDate',
      render: (val, record) => (
        <>
          <div>{dateFormat(val, false)}</div>
          <div>{dateFormat(record.estimateEndDate, false)}</div>
        </>
      ),
    },
    {
      title: '實際開始日期 / 實際結束日期',
      dataIndex: 'startDate',
      render: (val, record) => (
        <>
          {
            val && (<div>{dateFormat(val, true)}</div>)
          }
          {
            record.endDate && (<div>{dateFormat(record.endDate, true)}</div>)
          }
        </>
      ),
    },
    {
      title: '查閱',
      dataIndex: 'getContactsCount',
      render: (val, record) => (
        <a target="_blank" href={`/admin/member/gig/demand/contact/${record.basicId}?orderId=${record.orderId}`} rel="noopener noreferrer">{val > 0 ? val : '0'}</a>
      ),
    },
    {
      title: '款項處理',
      dataIndex: 'orderStatus',
      render: (val, record) => {
        const {
          refundDate, modifyDate, refundPrice, clerk,
        } = record;
        return (
          <>
            {
              val === 4 && refundDate && clerk && (
                <>
                  <div>
                    退款日期：
                    {' '}
                    {dateFormat(refundDate, false)}
                  </div>
                  <div>
                    退款金額：
                    {' '}
                    {refundPrice}
                  </div>
                  <div>
                    處理時間：
                    {' '}
                    {dateFormat(modifyDate, true)}
                  </div>
                  <div>
                    處理人：
                    {' '}
                    {clerk}
                  </div>
                </>
              )
            }
          </>
        );
      },
    },
  ]

  render() {
    const { paymentPersonList, nextKey } = this.props;
    const { data } = paymentPersonList;
    return (
      <div>
        <PagerInfo data={data} nextKey={nextKey} nextPage={this.nextPage} />
        <Table
          rowKey="orderId"
          columns={this.columns}
          dataSource={data}
          scroll={{ x: 1000 }}
        />
        <PagerInfo data={data} nextKey={nextKey} nextPage={this.nextPage} />
      </div>
    );
  }
}


const mapStateToProps = state => ({
  paymentPersonList: state.order.paymentPersonList,
  nextKey: state.order.paymentPersonList.cursor,
});

const mapDispatchToProps = {
  loadPaymentList,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaidRecord);
