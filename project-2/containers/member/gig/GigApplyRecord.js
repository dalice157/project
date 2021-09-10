import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb } from 'antd';
import { dateFormat, dailyOrCurrentFormat } from '../../../util/formatUtil.js';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import GigDate from './GigDate';
import { loadTopperName, loadGigQuotation } from '../../../actions/member';
import './gig.scss';

class GigApplyRecord extends Component {
  columns = [
    {
      title: '應徵編號',
      dataIndex: 'showId',
    },
    {
      title: '應徵日期',
      dataIndex: 'applyDate',
      render: applyDate => dateFormat(applyDate, true),
    },
    {
      title: '自選服務',
      dataIndex: 'gig',
      render: gig => (gig && gig.title ? <a href={`/admin/member/gig/edit/${gig.basicId}?gigId=${gig.gigId}`} target="_blank" rel="noreferrer noopener">{gig.title}</a> : '服務已刪除'),
    },
    {
      title: '案件編號',
      dataIndex: ['demand', 'demandId'],
    },
    {
      title: '案件標題',
      dataIndex: 'demand',
      render: demand => <a href={`/admin/demand/edit/${demand.basicId}?demandId=${demand.demandId.split('-')[1]}`} target="_blank" rel="noreferrer noopener">{demand.demandBody.title}</a>,
    },
    {
      title: '發案會員姓名/會員編號',
      dataIndex: 'demanderName',
      render: (demanderName, qoutation) => {
        const { demand } = qoutation;
        return (
          demand
        && (
        <>
          <a href={`/admin/member/${demand.basicId}?tabs=basic`} target="_blank" rel="noreferrer noopener">{`${demanderName}`}</a>
          <div>{demand.basicId}</div>
        </>
        )
        );
      },
    },
    {
      title: '查閱聯絡資料',
      dataIndex: 'getContact',
      render: getContact => (getContact ? '是' : '否'),
    },
    {
      title: '應徵讀取',
      dataIndex: 'viewed',
      render: viewed => (viewed ? '已讀' : '未讀'),
    },
  ]

  state = {
    year: '',
  };


  componentDidMount() {
    const { match } = this.props;
    const { basicId } = match.params;
    this.props.loadTopperName(basicId);
  }

  nextPage = (key) => {
    const { match } = this.props;
    const { basicId } = match.params;
    const { year } = this.state;
    this.props.loadGigQuotation(basicId, key, year);
  }

  getYear = (val) => {
    this.setState({
      year: dailyOrCurrentFormat(val, 'YYYY'),
    });
  }

  render() {
    const { topperName, quotationList, match } = this.props;
    const { basicId } = match.params;
    const nextKey = quotationList.cursor;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={`/member/${basicId}?tabs=gig`}>{`${topperName.name}的接案服務管理`}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>主動應徵紀錄</Breadcrumb.Item>
        </Breadcrumb>
        <div className="dateWrap">
          應徵日期：
          <GigDate
            getType="quotation"
            basicId={basicId}
            getYear={this.getYear}
          />
        </div>
        <PagerInfo data={quotationList.data} nextKey={nextKey} nextPage={this.nextPage} />
        <Table
          rowKey="showId"
          bordered
          columns={this.columns}
          dataSource={quotationList.data}
          scroll={{ x: 1000 }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topperName: state.member.topperName,
  quotationList: state.member.quotationList,
});
const mapDispatchToProps = {
  loadTopperName,
  loadGigQuotation,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigApplyRecord);
