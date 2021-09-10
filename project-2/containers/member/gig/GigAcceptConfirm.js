import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb } from 'antd';
import { dateFormat, dailyOrCurrentFormat, optionsToTable } from '../../../util/formatUtil.js';
import { unitData } from '../../../config/selectData';
import { loadTopperName, loadCooperatedRecord } from '../../../actions/member.js';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import GigConfirmBtn from './GigConfirmBtn';
import GigDate from './GigDate';
import './gig.scss';

const unitTable = optionsToTable(unitData);
const unitList = unitData.map(data => data.value);

class GigAcceptConfirm extends Component {
  state ={
    year: '',
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
      render: val => (val === null ? '—' : dateFormat(val, true)),
    },
    {
      title: '高手回報日期',
      dataIndex: 'partBRequestCooperationDate',
      render: val => (val === null ? '—' : dateFormat(val, true)),
    },
    {
      title: '確認合作日期',
      dataIndex: 'cooperatedDate',
      render: val => (val === null ? '—' : dateFormat(val, true)),
    },
    {
      title: '成交金額',
      dataIndex: 'price',
      render: (val, record) => (val && unitList.includes(record.unit) ? `${unitTable[record.unit]} ${val}` : '—'),
    },
    {
      title: '評價日期',
      dataIndex: 'reviewDate',
      render: val => (val === null ? '—' : dateFormat(val, true)),
    },
    {
      title: '評價紀錄',
      dataIndex: 'reviewDate',
      render: (val, record) => (val === null ? <GigConfirmBtn data={record} statusType={2} /> : <a target="_blank" href={`/admin/member/${record.topperId}?tabs=review`} rel="noopener noreferrer">已評價</a>),
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
    this.props.loadCooperatedRecord(basicId, key, year);
  }

  getYear = (val) => {
    this.setState({
      year: dailyOrCurrentFormat(val, 'YYYY'),
    });
  }


  render() {
    const {
      match, topperName, cooperatedList, nextKey,
    } = this.props;
    const { basicId } = match.params;
    const { name } = topperName;
    const { data } = cooperatedList;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={`/member/${basicId}?tabs=gig`}>
              {name}
              的接案服務管理
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>確認合作案件紀錄</Breadcrumb.Item>
        </Breadcrumb>
        <div className="dateWrap">
          確認合作日期：
          <GigDate
            getType="accept"
            basicId={basicId}
            getYear={this.getYear}
          />
        </div>
        <PagerInfo
          data={data}
          nextKey={nextKey}
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
  cooperatedList: state.member.cooperatedList,
  nextKey: state.member.cooperatedList.cursor,
});
const mapDispatchToProps = {
  loadTopperName,
  loadCooperatedRecord,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigAcceptConfirm);
