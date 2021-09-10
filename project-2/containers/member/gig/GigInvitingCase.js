import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb } from 'antd';
import { loadTopperName, loadGigInviting } from '../../../actions/member.js';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import { dateFormat } from '../../../util/formatUtil.js';

import './gig.scss';

class GigInvitingCase extends Component {
  componentDidMount() {
    const { basicId } = this.props.match.params;
    this.props.loadTopperName(basicId);
    this.props.loadGigInviting(basicId);
  }

  columns = [
    {
      title: '邀請日期',
      dataIndex: 'inviteDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
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
      title: '拒絕接案日期',
      dataIndex: 'rejectDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
  ]

  nextPage = (key) => {
    const { basicId } = this.props.match.params;
    this.props.loadGigInviting(basicId, key);
  }


  render() {
    const { basicId } = this.props.match.params;
    const { name } = this.props.topperName;
    const { data } = this.props.invitingList;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={`/member/${basicId}?tabs=gig`}>
              {name}
              的接案服務管理
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>邀請中案件列表</Breadcrumb.Item>
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
  invitingList: state.member.invitingList,
  nextKey: state.member.invitingList.cursor,
});
const mapDispatchToProps = {
  loadTopperName,
  loadGigInviting,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigInvitingCase);
