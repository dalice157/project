import React, { Fragment, Component } from 'react';
import { FilterFilled } from '@ant-design/icons';
import { Table, Select } from 'antd';
import { customerServiceMember, clerkSlotData } from '../../config/selectData.js';
import { onlineStatusOpts, depositResourceOpts, solutionType } from '../../config/demandOptions';
import { dateFormat } from '../../util/formatUtil.js';
import { findNodeDesc } from '../../util/lablesUtils';
import { mappingStaffName } from '../../util/commonUtil';

import PagerInfo from '../ui/pagerInfo.js';

const { Option } = Select;

const depositResourcMap = depositResourceOpts.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});

const onlineStatusMap = onlineStatusOpts.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});


// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

function showResult(state) {
  if (state && !state.startsWith('todo')) {
    return '[' + state + ']';
  }
  return '';
}

class demandVerificationList extends Component {
    state = {
      filterValue: null
    }

    showFilter = record => (record.basicCnt > 1 ? (
      <FilterFilled
        style={ { color: this.state.filterValue ? '#1890ff' : undefined } }
        onClick={ () => this.setState(this.state.filterValue ? { filterValue: null } : { filterValue: [record.basicId] }) }
      />
    ) : '');


    getColumns = () => [
      {
        title: '負責專員',
        dataIndex: 'assignSlot',
        render: slot => (slot > -1 ? clerkSlotData[slot].name : '未分派')
      },
      {
        title: '會員姓名',
        dataIndex: 'userName',
        sorter: (a, b) => a.userName.localeCompare(b.userName),
        onFilter: (value, record) => record.basicId.includes(value),
        filteredValue: this.state.filterValue,
        sortDirections: ['descend'],
        render: (userName, record) => (
          <Fragment>
            <div><a href={ `/admin/member/${record.basicId}?tabs=basic` } target="_blank" rel="noopener noreferrer">{`${userName}`}</a>{this.showFilter(record)}</div>
          </Fragment>
        )
      },
      {
        title: 'e-mail驗證狀態',
        dataIndex: 'emailVerified',
        render: state => (state ? '己驗證' : '未驗證')
      },
      {
        title: '電話驗證請求',
        dataIndex: 'telCertityRequest',
        render: state => (state ? 'YES' : '')
      },
      {
        title: '案件編號',
        dataIndex: 'demandId',
      },
      {
        title: '案件標題',
        dataIndex: ['demand', 'demandBody', 'title'],
        render: (demandTitle, record) => <div><a href={ `/admin/demand/edit/${record.basicId}?demandId=${record.demandId.split('-')[1]}` } target="_blank" rel="noopener noreferrer">{demandTitle}</a></div>,
      },
      {
        title: '案件類別',
        dataIndex: ['demand', 'demandCategory'],
        render: cats => cats.map(cat => findNodeDesc(cat)).join(','),
      },
      {
        title: '送審日期',
        dataIndex: 'applyDate',
        sorter: (a, b) => a.applyDate.localeCompare(b.applyDate),
        sortDirections: ['ascend'],
        render: (text, record) => '[' + solutionType[record.solution].label + ']　' + dateFormat(text, true),
      },
      {
        title: '刊登狀態',
        dataIndex: ['demand', 'onlineStatusOption'],
        render: (code, record) => {
          return showResult(record.approveDateFlag) + onlineStatusMap[code];
        }
      },
      {
        title: '押金狀態',
        dataIndex: ['demand', 'depositResource'],
        render: code => depositResourcMap[code]
      },
      {
        title: '客服備註',
        dataIndex: ['lastMemo', 'memo'],
        render: (text, record) => (text && text + '　' + dateFormat(record.lastMemo.createDate, false) + ` (${record.lastMemo.staff ? mappingStaffName(record.lastMemo.staff) : record.lastMemo.clerk}) `)
      }
    ];


    render() {
      const {
        data, nextKey, nextPage, filterBySlot
      } = this.props;
      const columnSetting = this.getColumns();

      return (
        <Fragment>
          <PagerInfo data={ data } nextKey={ nextKey } nextPage={ nextPage } />
          <Select defaultValue={ -2 } onChange={ filterBySlot }>
            { customerServiceMember.map((customerService, key) => <Option value={ customerService.value } key={ key }>{customerService.name}</Option>) }
          </Select>　※當月全部: 唯每月1號早上會抓上個月待辦, 若By專員則不受日期影响
          <Table rowKey="demandId" rowSelection={ rowSelection } columns={ columnSetting } dataSource={ data } scroll={ { x: 1000 } } />
          <PagerInfo data={ data } nextKey={ nextKey } nextPage={ nextPage } />
        </Fragment>
      );
    }
}
export default demandVerificationList;
