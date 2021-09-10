import React, { Fragment, Component } from 'react';
import { Table } from 'antd';
import { dateFormat } from '../../util/formatUtil.js'

const options = {
  1: 'PID',
  2: 'BasicID',
  3: 'EMail'
}; 


const effectOptions = {
  1: '高手刊登',
  2: '案件刊登'
}


class Default extends Component {
    
    columns = [
      {
        title: '申請日期',
        dataIndex: 'createDate',
        render: (text, record) => dateFormat(text),
      },
      {
        title: '申請人',
        dataIndex: 'clerk'
      },
      {
        title: '需求說明',
        dataIndex: 'note'
      },
      {
        title: '綁定人',
        dataIndex: 'value',
        render: (text, record) => options[record.bindType] + ' : ' + text
      },
      {
        title: '綁定流程',
        dataIndex: 'effectType',
        render: (text, record) => effectOptions[text]
      },
      {
        title: '使用期限',
        dataIndex: 'expireDate',
        render: (text, record) => text ? dateFormat(text) : '無限期'
      },
      {
        title: '代碼',
        dataIndex: 'code'
      },
      {
        title: '閱換狀態',
        dataIndex: 'usedDate',
        render: (text, record) => text ? '己使用: ' + dateFormat(text) : '未使用'
      }
    ];


    render() {

        const { data } = this.props;
        return (
            <Fragment>
                <span>查詢資料 共 {data ? data.length : 0} 筆</span>
                <Table rowKey="id" columns={this.columns} dataSource={data} />
            </Fragment>
        );
    }
}


export default Default;