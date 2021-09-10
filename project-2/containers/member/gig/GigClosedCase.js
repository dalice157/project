import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb, Select } from 'antd';
import { dateFormat, dailyOrCurrentFormat } from '../../../util/formatUtil';
import { closedOptions } from '../../../config/selectData';
import { loadTopperName, loadGigClosed } from '../../../actions/member';
import GigConfirmBtn from './GigConfirmBtn';
import GigDate from './GigDate';
import PagerInfo from '../../../components/ui/pagerInfo';
import './gig.scss';

const { Option } = Select;

class GigClosedCase extends Component {
  state = {
    keyType: 0,
    year: '',
    list: [],
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
      title: '案件刊登日期',
      dataIndex: 'demandOnlineDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '案件結案日期',
      dataIndex: 'closedDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '案主婉拒合作日期',
      dataIndex: 'rejector',
      render: (val, record) => (val === 1 ? dateFormat(record.rejectDate, true) : '-'),
    },
    {
      title: '高手婉拒合作日期',
      dataIndex: 'rejector',
      render: (val, record) => (val === 2 ? dateFormat(record.rejectDate, true) : '-'),
    },
    {
      title: '溝通開始日期',
      dataIndex: 'communicateDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '案主回報合作',
      dataIndex: 'partARequestCooperationDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '高手回報日期',
      dataIndex: 'partBRequestCooperationDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '評價日期',
      dataIndex: 'reviewDate',
      render: val => (val === null ? '-' : dateFormat(val, true)),
    },
    {
      title: '回報合作',
      dataIndex: 'communicateDate',
      render: (val, record) => {
        if (val === null && record.cooperatedDate === null) {
          return '-';
        } else if (val && record.cooperatedDate) {
          return (
            <>
              <div>已確認合作</div>
              <div>{ dateFormat(record.cooperatedDate, true)}</div>
            </>
          );
        } else if (val && record.partARequestCooperationDate === null && record.partBRequestCooperationDate === null) {
          return <GigConfirmBtn data={record} statusType={3} />;
        } else if (val && record.partARequestCooperationDate === null && record.partBRequestCooperationDate) {
          return <GigConfirmBtn data={record} statusType={1} />;
        } else if (val && record.partARequestCooperationDate && record.partBRequestCooperationDate === null) {
          return <GigConfirmBtn data={record} statusType={0} />;
        }
      },
    },
    {
      title: '評價紀錄',
      dataIndex: 'communicateDate',
      render: (val, record) => {
        if (val && record.cooperatedDate === null) {
          return <GigConfirmBtn data={record} statusType={2.5} />;
        } else if (val && record.reviewDate === null) {
          return <GigConfirmBtn data={record} statusType={2} />;
        } else if (record.reviewDate) {
          return <a target="_blank" href={`/admin/member/${record.topperId}?tabs=review`} rel="noopener noreferrer">已評價</a>;
        } else if (record.cooperatedDate === null && record.reviewDate === null) {
          return '-';
        }
      },
    },
  ]

  componentDidMount() {
    const { match } = this.props;
    const { basicId } = match.params;
    this.props.loadTopperName(basicId);
  }

  componentDidUpdate(prevProps) {
    const { closedList } = this.props;
    if (prevProps.closedList !== closedList) {
      this.getListData(closedList.data);
    }
  }


  nextPage = (key) => {
    const { match } = this.props;
    const { basicId } = match.params;
    const { year } = this.state;
    this.props.loadGigClosed(basicId, key, year).then(() => {
      this.setState({
        list: this.props.closedList.data,
        keyType: 0,
      });
    });
  }

  handleChange = (value) => {
    const { closedList } = this.props;
    this.setState({
      keyType: value,
    });
    if (value === 1) {
      const filterData = closedList.data.filter(item => item.cooperatedDate !== null);
      this.setState({
        list: filterData,
      });
    } else if (value === 2) {
      const filterData = closedList.data.filter(item => item.cooperatedDate === null);
      this.setState({
        list: filterData,
      });
    } else {
      this.setState({
        list: closedList.data,
      });
    }
  }

  getListData = (data) => {
    this.setState({
      list: data,
    });
  }

  getYear = (val) => {
    this.setState({
      year: dailyOrCurrentFormat(val, 'YYYY'),
      keyType: 0,
    });
  }


  render() {
    const {
      match, topperName, closedList, nextKey,
    } = this.props;
    const { keyType, list } = this.state;
    const { basicId } = match.params;
    const { name } = topperName;
    const { data } = closedList;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={`/member/${basicId}?tabs=gig`}>
              {name}
              的接案服務管理
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>已關閉案件列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className="dateWrap">
          結案日期：
          <GigDate
            getType="closed"
            basicId={basicId}
            getYear={this.getYear}
            getListData={this.getListData}
          />
        </div>
        <div className="pageWrap">
          <PagerInfo
            data={data}
            nextKey={nextKey}
            nextPage={this.nextPage}
          />
          <Select value={keyType} style={{ width: 120 }} onChange={this.handleChange}>
            { closedOptions.map(item => (
              <Option key={item.value} value={item.value}>
                { item.label }
              </Option>
            )) }
          </Select>
        </div>
        {
          list && (
            <Table
              rowKey="demandId"
              bordered
              columns={this.columns}
              dataSource={list}
              scroll={{ x: 1000 }}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topperName: state.member.topperName,
  closedList: state.member.closedList,
  nextKey: state.member.closedList.cursor,
});
const mapDispatchToProps = {
  loadTopperName,
  loadGigClosed,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigClosedCase);
