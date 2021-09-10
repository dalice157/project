import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb } from 'antd';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import { loadTopperName, loadInvitedRecord } from '../../../actions/member';
import GigDate from './GigDate';
import { dateFormat, dailyOrCurrentFormat } from '../../../util/formatUtil.js';
import './gig.scss';

class GigClientInvitation extends Component {
  columns = [
    {
      title: '邀請日期',
      key: 'inviteDate',
      dataIndex: 'inviteDate',
      render: inviteDate => dateFormat(inviteDate, true),
    },
    {
      title: '案件編號',
      key: 'demandId',
      dataIndex: 'demandId',
    },
    {
      title: '案件標題',
      key: 'demandTitle',
      dataIndex: 'demandTitle',
      render: (demandTitle, demandData) => {
        const { demanderId } = demandData;
        const demandId = demandData.demandId.split('-')[1];
        return (
          <a href={`/admin/demand/edit/${demanderId}?demandId=${demandId}`} target="_blank" rel="noreferrer noopener">{demandTitle}</a>
        );
      },
    },
    {
      title: '發案會員姓名/會員編號',
      key: 'demanderName',
      dataIndex: 'demanderName',
      render: (demanderName, demandData) => {
        const { demanderId } = demandData;
        return (
          <>
            <a href={`/admin/member/${demanderId}?tabs=basic`} target="_blank" rel="noreferrer noopener">{`${demanderName}`}</a>
            <div>{demanderId}</div>
          </>
        );
      },
    },
    {
      title: '案件聯絡人姓名',
      key: 'demandContactName',
      dataIndex: 'demandContact',
      render: demandContact => demandContact.name,
    },
    {
      title: '案件聯絡人電話',
      key: 'demandPhone',
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
      title: '進入溝通',
      key: 'communicateDate',
      dataIndex: 'communicateDate',
      render: communicateDate => (communicateDate ? '是' : '否'),
    },
  ]

  componentDidMount() {
    const { match } = this.props;
    const { basicId } = match.params;
    this.props.loadTopperName(basicId);
  }

  nextPage = (key) => {
    const { match } = this.props;
    const { basicId } = match.params;
    const { year } = this.state;
    this.props.loadInvitedRecord(basicId, key, year);
  }

  getYear = (val) => {
    this.setState({
      year: dailyOrCurrentFormat(val, 'YYYY'),
    });
  }


  render() {
    const { topperName, invitedList, match } = this.props;
    const { basicId } = match.params;
    const nextKey = invitedList.cursor;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={`/member/${basicId}?tabs=gig`}>{`${topperName.name}的接案服務管理`}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>案主邀請紀錄</Breadcrumb.Item>
        </Breadcrumb>
        <div className="dateWrap">
          邀請日期：
          <GigDate
            getType="invitation"
            basicId={basicId}
            getYear={this.getYear}
          />
        </div>
        <PagerInfo data={invitedList.data} nextKey={nextKey} nextPage={this.nextPage} />
        <Table
          rowKey="demandId"
          bordered
          columns={this.columns}
          dataSource={invitedList.data}
          scroll={{ x: 1000 }}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  topperName: state.member.topperName,
  invitedList: state.member.invitedList,
});

const mapDispatchToProps = {
  loadTopperName,
  loadInvitedRecord,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigClientInvitation);
