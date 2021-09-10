import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { dateFormat } from '../../../util/formatUtil.js';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import { statusTypes, applyType } from '../../../config/selectData';
import { loadDepositList } from '../../../actions/order';


class DepositRecord extends Component {
  columns = [
    {
      title: '訂單日期',
      dataIndex: 'createDate',
      render: text => dateFormat(text, true),
    },
    {
      title: '押金來源',
      dataIndex: 'targetType',
      render: text => (text === 1 ? '高手' : '案件'),
    },
    {
      title: '案件編號 / 案件名稱',
      dataIndex: 'demandTitle',
      render: (val, record) => (
        record.targetType === 2 && (
          <>
            <div>{ record.targetId }</div>
            <a target="_blank" href={`/admin/demand/edit/${record.owner}?demandId=${record.targetId.split('-')[1]}`} rel="noopener noreferrer">{val}</a>
          </>
        )
      ),
    },
    {
      title: '付款序號',
      dataIndex: 'order_pay_id',
    },
    {
      title: '代收單號',
      dataIndex: 'id',
      render: val => (
        <a target="_blank" href={`/admin/deposit?orderNo=${val}`} rel="noopener noreferrer">{val}</a>
      ),
    },
    {
      title: '押金狀態',
      dataIndex: 'applySource',
      render: (val, record) => (
        <>
          <div>{statusTypes[record.status].label}</div>
          <div>{val && applyType[val]}</div>
        </>
      ),
    },
    {
      title: '款項處理',
      dataIndex: 'status',
      render: (val, record) => (
        <>
          {
              val === 4 && (
                <>
                  <div>
                    退刷日期:
                    {dateFormat(record.refundDate)}
                  </div>
                  <div>
                    {dateFormat(record.modifyDate, true)}
                    已處理
                  </div>
                  <div>
                    處理人:
                    {record.clerk}
                  </div>
                </>
              )
            }
        </>
      ),
    },
  ];

  nextPage = () => {
    const { match } = this.props;
    const { basicId } = match.params;
    this.props.loadDepositList(basicId, this.props.nextKey);
  }

  render() {
    const { depositPersonList, nextKey } = this.props;
    const { data } = depositPersonList;
    console.log('data:', data);
    return (
      <div>
        <PagerInfo data={data} nextKey={nextKey} nextPage={this.nextPage} />
        <Table
          rowKey="id"
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
  depositPersonList: state.order.depositPersonList,
  nextKey: state.order.depositPersonList.cursor,
});

const mapDispatchToProps = {
  loadDepositList,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DepositRecord));
