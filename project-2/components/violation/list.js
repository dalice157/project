import React, { Fragment, Component } from 'react';
import { Table } from 'antd';

import { causeType, handleStatus } from './options';
import { dateFormat } from '../../util/formatUtil.js';

const causeMap = causeType.reduce((causeList, item) => {
  causeList[item.value] = item.label;
  return causeList;
}, {});

const handleStatusMap = handleStatus.reduce((handleStatusList, item) => {
  handleStatusList[item.value] = item.label;
  return handleStatusList;
}, {});

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

class Default extends Component {
    // 檢舉狀態mapping
    showCause = (record) => {
      return (<div>{causeMap[record.causeType]}</div>);
    }

    // 處理狀態mapping
    showHandleStatus = (record) => {
      return (<div>{handleStatusMap[record.handleStatus]}</div>);
    }

    columns = [
      {
        title: '檢舉日期',
        dataIndex: 'createDate',
        render: text => dateFormat(text, true),
      },
      {
        title: '檢舉編號',
        dataIndex: 'recordId',
        render: (text, record) => <a href={ `/admin/violation/content?yyyyMM=${record.yyyyMM}&recordId=${record.recordId}` } target="_blank" rel="noopener noreferrer">{text.split('-')[1]}</a>,
      },
      {
        title: '檢舉人',
        dataIndex: 'reporterName',
        render: text => <a href="/admin/member" target="_blank">{text}</a>,
      },
      {
        title: '被檢舉人',
        dataIndex: 'targetName',
        render: text => <a href="/admin/member" target="_blank">{text}</a>,
      },
      {
        title: '被檢舉人身分',
        dataIndex: 'targetType',
        render: text => (text === 1 ? '高手' : '案件'),
      },
      {
        title: '檢舉案件編號',
        dataIndex: 'targetDemandId',
        render: (text, record) => (record.targetType === 2 ? (<div><a href={ `/admin/demand/edit/${record.targetId}?demandId=${text.split('-')[1]}` } target="_blank" rel="noopener noreferrer">{text.split('-')[1]}<br />{record.targetDemandTitle}</a></div>) : ''),
      },
      {
        title: '檢舉項目',
        dataIndex: 'causeType',
        render: (text, record) => this.showCause(record)
      },
      {
        title: '檢舉事證說明',
        dataIndex: 'causeBody',
        render: (causeBody, record) => <a href={ `/admin/violation/content?yyyyMM=${record.yyyyMM}&recordId=${record.recordId}` } target="_blank" rel="noopener noreferrer">{causeBody.causeDesc}</a>,
      },
      {
        title: '負責專員',
        dataIndex: 'clerk',
        render: (text, record) => (record.handleStatus === 0 ? '' : `【${text}】`)
      },
      {
        title: '處理狀態',
        dataIndex: 'handleStatus',
        render: (text, record) => this.showHandleStatus(record)
      },
      {
        title: '客服註記(最近一次)',
        dataIndex: 'lastMemo',
      }
    ];

    render() {
      const { data } = this.props;
      return (
        <Fragment>
          <span>查詢資料 共 {data ? data.length : 0} 筆</span>
          <Table rowKey="recordId" rowSelection={ rowSelection } columns={ this.columns } dataSource={ data } />
        </Fragment>
      );
    }
}


export default Default;
