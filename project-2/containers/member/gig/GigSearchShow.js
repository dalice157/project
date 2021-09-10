import React, { Component } from 'react';
import { Table } from 'antd';
import GigConfirmBtn from './GigConfirmBtn';
import PagerInfo from '../../../components/ui/pagerInfo.js';

import './gig.scss';

const data = [
  {
    no1: 'demand-188057',
    no2: '英文家教',
    no3: '刊登中_公開',
    no4: '黃太太',
    no5: ['0987654321', '022926104'],
    no6: '2019/07/10 下午4:45:12'
  },
  {
    no1: 'demand-188058',
    no2: '中文家教',
    no3: '刊登中_公開',
    no4: '林太太',
    no5: ['0987654321'],
    no6: '2019/07/05 下午4:45:12'
  },
  {
    no1: 'demand-188059',
    no2: '中文家教',
    no3: '刊登中_公開',
    no4: '鐘太太',
    no5: ['0987654321'],
    no6: '2019/07/10 下午4:45:12'
  },
];
class GigSearchShow extends Component {
  columns = [
    {
      title: '案件編號',
      dataIndex: 'no1',
    },
    {
      title: '案件標題',
      dataIndex: 'no2',
      render: val => <a href={ `/admin/member/gig/edit/${this.props.basicId}` }>{val}</a>
    },
    {
      title: '案件刊登狀態',
      dataIndex: 'no3',
    },
    {
      title: '案件聯絡人姓名',
      dataIndex: 'no4',
    },
    {
      title: '案件聯絡人電話',
      dataIndex: 'no5',
      render: (val) => {
        return val.map(t => <>{t}<br /></>);
      }
    },
    {
      title: '查閱聯絡資料日期',
      dataIndex: 'no6',
    },
    {
      title: '回報合作',
      dataIndex: 'no7',
      render: () => <GigConfirmBtn statusType={ 3 } />
    }
  ]

  nextPage = (key) => {
    console.log('key:', key);
    // this.props.getMemberMultiSearch(this.formValue, key);
  }


  render() {
    const nextKey = data.length > 50;
    return (
      <div className="searchShow">
        <PagerInfo data={ data } nextKey={ nextKey } nextPage={ this.nextPage } />
        <Table
          bordered
          pagination={ false }
          columns={ this.columns }
          dataSource={ data }
          scroll={ { x: 1000 } }
        />
      </div>
    );
  }
}

export default GigSearchShow;
