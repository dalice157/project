import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb } from 'antd';
import { loadTopperName, loadHistory } from '../../../actions/member.js';
import { memberDepositPublishStatus, orderStatusTypes } from '../../../config/selectData.js';
import { dateFormat, dailyOrCurrentFormat } from '../../../util/formatUtil.js';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import GigDate from './GigDate';

import './gig.scss';

class GigHistory extends Component {
  state ={
    year: '',
  }

  columns = [
    {
      title: '服務刊登狀態',
      dataIndex: 'publishing',
      render: (publishing, payload) => {
        const { vipRecord } = payload;
        if (publishing && vipRecord) {
          return '刊登中（付費）';
        } else if (publishing && !vipRecord) {
          return '刊登中（體驗）';
        } else if (!publishing) {
          return '結束刊登';
        }
        return '';
      },
    },
    {
      title: '體驗刊登方式',
      dataIndex: 'depositResource',
      render: (depositResource, payload) => {
        const { orderStatus } = payload;
        if (depositResource === 'orderTX') {
          return `押金（${orderStatusTypes[orderStatus]}）`;
        }
        return memberDepositPublishStatus[depositResource];
      },
    },
    {
      title: '發佈刊登日期',
      dataIndex: 'startDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '結束刊登日期',
      dataIndex: 'endDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '有付費訂單',
      dataIndex: 'vipRecord',
      render: (val) => {
        const { match } = this.props;
        return (val ? <a target="_blank" href={`/admin/member/${match.params.basicId}?tabs=orderRecord`} rel="noopener noreferrer">有</a> : '無');
      },
    },
    {
      title: '查閱聯絡資料',
      dataIndex: 'contactCnt',
      render: (val, data) => {
        const { match } = this.props;
        return (val === 0 ? '0' : <a target="_blank" href={`/admin/member/gig/demand/contact/${match.params.basicId}?startDate=${encodeURIComponent(data.startDateStr)}`} rel="noopener noreferrer">{val}</a>);
      },
    },
  ]


  componentDidMount() {
    const { match } = this.props;
    const { basicId } = match.params;
    this.props.loadTopperName(basicId);
  }

  getYear = (val) => {
    this.setState({
      year: dailyOrCurrentFormat(val, 'YYYY'),
    });
  }

  nextPage = (key) => {
    const { match } = this.props;
    const { basicId } = match.params;
    const { year } = this.state;
    this.props.loadHistory(basicId, key, year);
  }


  render() {
    const {
      match, topperName, historyList, nextKey,
    } = this.props;
    const { basicId } = match.params;
    const { name } = topperName;
    const { data } = historyList;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={`/member/${basicId}?tabs=gig`}>
              {name}
              的接案服務管理
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>服務刊登歷史紀錄</Breadcrumb.Item>
        </Breadcrumb>
        <div className="dateWrap">
          刊登日期：
          <GigDate
            getType="history"
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
  historyList: state.member.historyList,
  nextKey: state.member.historyList.cursor,
});
const mapDispatchToProps = {
  loadTopperName,
  loadHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigHistory);
