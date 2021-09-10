import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb, Button } from 'antd';
import { dateFormat } from '../../../util/formatUtil.js';
import { loadTopperName, loadCommunicating } from '../../../actions/member.js';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import GigConfirmBtn from './GigConfirmBtn';
// import GigSearch from './GigSearch'; 因暫不開發所以先註解起來
import './gig.scss';

class GigConfirmCase extends Component {
  componentDidMount() {
    const { basicId } = this.props.match.params;
    this.props.loadTopperName(basicId);
    this.props.loadCommunicating(basicId);
  }

  columns =[
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
      title: '溝通開始日期',
      dataIndex: 'communicateDate',
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
      title: '回報合作',
      dataIndex: 'partARequestCooperationDate',
      render: (val, record) => {
        if (val === null && record.partBRequestCooperationDate === null) {
          return <GigConfirmBtn data={record} statusType={3} />;
        } else if (val === null && record.partBRequestCooperationDate) {
          return <GigConfirmBtn data={record} statusType={1} />;
        } else if (val && record.partBRequestCooperationDate === null) {
          return <GigConfirmBtn data={record} statusType={0} />;
        }
      },
    },
    {
      title: '聊天室訊息',
      dataIndex: 'chatMetaId',
      render: chatMetaId => chatMetaId && <Button>查閱</Button>,
    },
  ]

  nextPage = (key) => {
    const { basicId } = this.props.match.params;
    this.props.loadCommunicating(basicId, key);
  }


  render() {
    const { basicId } = this.props.match.params;
    const { name } = this.props.topperName;
    const { data } = this.props.communicatingList;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={`/member/${basicId}?tabs=gig`}>
              {name}
              的接案服務管理
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>溝通中案件列表</Breadcrumb.Item>
        </Breadcrumb>
        <p className="psText">包含案主邀請，高手主動應徵或查閱聯絡資料，進入溝通中的案件</p>
        <PagerInfo
          data={data}
          nextKey={this.props.nextKey}
          nextPage={this.nextPage}
        />
        <Table rowKey="demandId" bordered columns={this.columns} dataSource={data} scroll={{ x: 1000 }} />
        {/* <GigSearch basicId={ basicId } /> 因暫不開發所以先註解起來 */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topperName: state.member.topperName,
  communicatingList: state.member.communicatingList,
  nextKey: state.member.communicatingList.cursor,
});
const mapDispatchToProps = {
  loadTopperName,
  loadCommunicating,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigConfirmCase);
