import React, { Fragment, Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { statusTypes, applyType } from './options';
import DateSubmit from './dateSubmit.js';
import { dateFormat } from '../../../util/formatUtil.js';
import PagerInfo from '../../ui/pagerInfo.js';

const statusMap = statusTypes.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});


// rowSelection object indicates the need for row selection


class Default extends Component {
    showStatus = (record) => {
      return (<div>{statusMap[record.status]}<br />{record.applySource && applyType[record.applySource]}</div>);
    }

    confirmBeRevenue = (yyyyMM, recordId) => (<Popconfirm title="押金轉收入?" onConfirm={ () => this.props.putBeRevenue(yyyyMM, recordId) }><Button type="primary">提交承包單及結帳拋ERP</Button></Popconfirm>);

    showStatusHandle = (record) => {
      switch (record.status) {
        case 1:
        case 2:
          return '';
        case 3:
          return record.applySource === 3 ? this.confirmBeRevenue(record.yyyyMM, record.id) : (
            <DateSubmit updateRefound={ v => this.props.putOrderRefound({ yyyyMM: record.yyyyMM, orderId: record.id, refoundDate: v }) } />
          );
        case 4:
          return (
            <div>退刷日期:{dateFormat(record.refundDate)}<br />{dateFormat(record.modifyDate, true)}已處理<br />處理人:{record.clerk}</div>
          );
        case 5:
          return (
            <div>ERP :{record.orderNo}<br />承包單:{record.ship_head_id}<br />{dateFormat(record.payDate, true)}<br />處理人:{record.clerk}</div>
          );
        default:
          return '';
      }
    }


    columns = [
      {
        title: '會員編號 / PID / 姓名',
        dataIndex: 'owner',
        render: (text, record) => <div><a href={ `/admin/member/${text}?tabs=basic` } target="_blank" rel="noopener noreferrer">{text}</a><br />{record.pid}<br />{record.userName}</div>,
      },
      {
        title: '押金來源',
        dataIndex: 'targetType',
        render: text => (text === 1 ? '高手' : '案件'),
      },
      {
        title: '案件編號',
        dataIndex: 'targetId',
        render: (text, record) => (record.targetType === 2 ? (<div>{text}<br />{record.demandTitle}</div>) : ''),
      },
      {
        title: '付款序號',
        dataIndex: 'order_pay_id',
      },
      {
        title: '代收單號 / 付款狀態',
        dataIndex: 'id',
        render: (text, record) => (<div>{text}<br />{record.responseCode ? `付款失敗:${record.responseCode}` : (record.order_pay_id ? '付款成功' : '取號未付')}</div>)
      },
      {
        title: 'MDM (ERP_NO)',
        dataIndex: 'mdmKey',
        render: (text, record) => (<div>{text}<br />({record.erpNo})</div>)
      },
      {
        title: '押金狀態',
        dataIndex: 'status',
        render: (text, record) => this.showStatus(record)
      },
      {
        title: '款項處理',
        dataIndex: 'refoundSource',
        render: (text, record) => this.showStatusHandle(record)
      }
    ];


    render() {
      const columnSetting = this.props.isTodos ? [{
        title: '申請日期',
        dataIndex: 'applyDate',
        render: text => dateFormat(text, true),
      }].concat(this.columns)
        : [{
          title: '訂單日期',
          dataIndex: 'createDate',
          align: 'center',
          render: text => dateFormat(text, true),
        }].concat(this.columns);

      const {
        data, nextKey, nextPage, keepSelected
      } = this.props;
      const rowSelection = {
        selectedRowKeys: this.props.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({ selectedRowKeys });
          if (keepSelected) {
            keepSelected(selectedRowKeys, selectedRows);
          }
        },
        getCheckboxProps: record => ({
          disabled: record.applySource === 3 || record.status > 3, // Column configuration not to be checked
          name: record.id,
        }),
      };

      return (
        <Fragment>
          <PagerInfo data={ data } nextKey={ nextKey } nextPage={ nextPage } />
          <Table rowKey="id" rowSelection={ rowSelection } columns={ columnSetting } dataSource={ data } />
          <PagerInfo data={ data } nextKey={ nextKey } nextPage={ nextPage } />
        </Fragment>
      );
    }
}


export default Default;
