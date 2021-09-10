import React, { Fragment, Component } from 'react';
import { LoginOutlined, SolutionOutlined, FilterFilled } from '@ant-design/icons';
import { Table, Button } from 'antd';

import { creditOpts } from '../../config/selectData.js';
import { dateFormat } from '../../util/formatUtil.js';
import { showPersonalData } from '../../util/commonUtil.js';
import PagerInfo from '../ui/pagerInfo.js';
import config from '../../config/config';
import './list.scss';

const creditStatusDesc = creditOpts.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});

class Default extends Component {
  columns = [
    {
      title: '高手會員',
      dataIndex: 'memberDeleteStatus',
      render: (memberDeleteStatus, record) => (
        <Fragment>
          <div>
            {memberDeleteStatus === 1 ? '會員' : memberDeleteStatus === 2 ? '非會員(刪高手)' : '非會員(刪AC)'}
            <br />
            <span style={{ color: (record.credit === -1 ? 'red' : 'blue') }}>{creditStatusDesc[record.credit]}</span>
          </div>
        </Fragment>
      ),
    },
    {
      title: (
        <div>
          PID
          <br />
          IDNO
          <br />
          e-mail
        </div>
      ),
      dataIndex: 'pid',
      render: (pid, record) => (
        <Fragment>
          {record.memberDeleteStatus === 3 ? '-' : (
            <div>
              {pid}
              &nbsp;&nbsp;
              <LoginOutlined onClick={() => this.props.proxyLogin(pid)} />
              <br />
              {record.idNo}
              <hr />
              {showPersonalData(record.email, record.memberDeleteStatus, 'email')}
              <br />
              {record.memberDeleteStatus !== 1 ? '' : record.emailVerifyStatus === true ? '已驗證' : '未驗證'}
            </div>
          )}
        </Fragment>
      ),
    },
    {
      title: (
        <>
          會員編號
          <br />
          AC姓名
          <br />
          暱稱
        </>
      ),
      dataIndex: 'basicId',
      render: (basicId, record) => (
        <Fragment>
          <a href={`/admin/member/${basicId}?tabs=basic`} target="_blank" rel="noopener noreferrer">{basicId}</a>
          <div>{record.memberDeleteStatus === 3 ? '-' : record.familyName + showPersonalData(record.firstName, record.memberDeleteStatus, 'firstName')}</div>
          <hr />
          <div>
            {record.topNickName || '-'}
            &nbsp;
            <Button className="topNickName" type="text" target="_blank" href={`${config.topSite.domain}/profile/${basicId}`} icon={<SolutionOutlined />} />
          </div>
        </Fragment>
      ),
    },
    {
      title: '身分證or護照 / 統一編號',
      dataIndex: 'identityOrPassport',
      render: (identityOrPassport, record) => (
        <div>
          {identityOrPassport}
          <br />
          {record.invoice}
        </div>
      ),
    },
    {
      title: (
        <div>
          加入日期
          <br />
          最近登入時間
        </div>
      ),
      dataIndex: 'joinDate',
      render: (joinDate, record) => (
        <Fragment>
          <div>{dateFormat(joinDate, false)}</div>
          <hr />
          <div>{dateFormat(record.lastLoginDate, true)}</div>
        </Fragment>
      ),
    },
    {
      title: '會員角色',
      dataIndex: 'usingService',
      render: usingService => usingService.join('/'),
    },
    {
      title: '服務項目',
      dataIndex: 'gigCount',
    },
    {
      title: '服務評價',
      dataIndex: 'reviewCount',
      render: (reviewCount, record) => (
        <>
          {
          reviewCount > 0 ? <a href={`/admin/member/${record.basicId}?tabs=review`} target="_blank" rel="noopener noreferrer">{reviewCount}</a> : reviewCount
          }
        </>
      ),
    },
    {
      title: '案件',
      dataIndex: 'demandCount',
      render: (demandCount, record) => (
        <>
          {
            demandCount > 0 ? <a href={`/admin/demandSearch?basicId=${record.basicId}`} target="_blank" rel="noopener noreferrer">{demandCount}</a> : demandCount
          }
        </>
      ),
    },
    {
      title: '舊站接案會員(曾是VIP)',
      dataIndex: 'memberType',
      render: memberType => memberType.join('/'),
    },
    {
      title: '黑名單',
      dataIndex: 'isBlackList',
      render: isBlackList => (isBlackList === true ? '是' : '否'),
    },
  ];

  render() {
    const {
      data, nextKey, nextPage, isFilter, handleFilter,
    } = this.props;
    const { columns } = this;
    // 變換表頭的方式
    if (isFilter && data) {
      columns[2].title = (
        <>
          會員編號
          <br />
          AC姓名
          <br />
          暱稱&nbsp;&nbsp;
          <FilterFilled
            style={{ color: '#1890ff', fontSize: '16px' }}
            onClick={handleFilter}
          />
        </>
      );
    } else if (!isFilter && data) {
      columns[2].title = (
        <>
          會員編號
          <br />
          AC姓名
          <br />
          暱稱&nbsp;&nbsp;
          <FilterFilled
            style={{ fontSize: '16px' }}
            onClick={handleFilter}
          />
        </>
      );
    }


    return (
      <Fragment>
        <PagerInfo data={data} nextKey={nextKey} nextPage={nextPage} />
        <Table id="memberList" rowKey="basicId" columns={columns} dataSource={data} scroll={{ x: 1000 }} />
        <PagerInfo data={data} nextKey={nextKey} nextPage={nextPage} />
      </Fragment>
    );
  }
}


export default Default;
