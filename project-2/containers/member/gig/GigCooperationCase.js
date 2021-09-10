import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb } from 'antd';
import { dateFormat } from '../../../util/formatUtil.js';
import { loadTopperName, loadGigCooperating } from '../../../actions/member.js';
import GigConfirmBtn from './GigConfirmBtn';
import PagerInfo from '../../../components/ui/pagerInfo.js';

import './gig.scss';

class GigCooperationCase extends Component {
  componentDidMount() {
    const { basicId } = this.props.match.params;
    this.props.loadTopperName(basicId);
    this.props.loadGigCooperating(basicId);
  }

  columns = [
    {
      title: '案件編號',
      dataIndex: 'demandId',
    },
    {
      title: '案件標題',
      dataIndex: 'demandTitle',
      render: (val, record) => (
        <a target="_blank" href={`/admin/demand/edit/${record.demanderId}?demandId=${record.demandId.split('-')[1]}`} rel="noopener noreferrer">
          { val }
        </a>
      ),
    },
    {
      title: '發案會員姓名/會員編號',
      dataIndex: 'demanderName',
      render: (val, record) => (
        <>
          <a target="_blank" href={`/admin/member/${record.demanderId}?tabs=basic`} rel="noopener noreferrer">{val}</a>
          <div>{record.demanderId}</div>
        </>
      ),
    },
    {
      title: '案件聯絡人姓名',
      dataIndex: ['demandContact', 'name'],
    },
    {
      title: '案件聯絡人電話',
      dataIndex: 'demandContact',
      render: (demandContact) => {
        if (demandContact) {
          return (
            <>
              <p>
                {demandContact.telArea || '—'}
                -
                {demandContact.tel || '—'}
              </p>
              <p>{demandContact.cellphone || '—'}</p>
            </>
          );
        }
        return <p>—</p>;
      },
    },
    {
      title: '案主回報日期',
      dataIndex: 'partARequestCooperationDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '高手回報日期',
      dataIndex: 'partBRequestCooperationDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '確認合作日期',
      dataIndex: 'cooperatedDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '評價日期',
      dataIndex: 'reviewDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '評價紀錄',
      dataIndex: 'reviewDate',
      render: (val, record) => (val === null ? <GigConfirmBtn data={record} statusType={2} /> : <a target="_blank" href={`/admin/member/${record.topperId}?tabs=review`} rel="noopener noreferrer">已評價</a>),
    },
  ]

  nextPage = (key) => {
    const { basicId } = this.props.match.params;
    this.props.loadGigCooperating(basicId, key);
  }


  render() {
    const { basicId } = this.props.match.params;
    const { name } = this.props.topperName;
    const { data } = this.props.cooperatingList;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={`/member/${basicId}?tabs=gig`}>
              {name}
              的接案服務管理
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>合作中案件列表</Breadcrumb.Item>
        </Breadcrumb>
        <PagerInfo
          data={data}
          nextKey={this.props.nextKey}
          nextPage={this.nextPage}
        />
        <Table
          rowKey="demandId"
          bordered
          columns={this.columns}
          dataSource={data}
          scroll={{ x: 1000 }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topperName: state.member.topperName,
  cooperatingList: state.member.cooperatingList,
  nextKey: state.member.cooperatingList.cursor,
});
const mapDispatchToProps = {
  loadTopperName,
  loadGigCooperating,
};


export default connect(mapStateToProps, mapDispatchToProps)(GigCooperationCase);
