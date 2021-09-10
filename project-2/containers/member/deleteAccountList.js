import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import config from '../../config/config';

import { loadDeleteAccountList, acDeleteProcess } from '../../actions/member.js';

const AC_MANAGER_URL = config.acManagerUrl;
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

class Default extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderList: false
    };
  }

    showQueueTypeDesc = (queueType, directDel) => {
      let queueDesc = '';
      switch (queueType) {
        case 1:
          if (directDel) {
            queueDesc = '刪除盜用帳號';
          } else {
            queueDesc = '刪除帳號';
          }
          break;
        case 2:
          queueDesc = '刪除服務';
          break;
        case 3:
          queueDesc = '轉拋服務';
          break;
        default:
          break;
      }
      return queueDesc;
    }

    onAcDeleteProcess = async (basicId) => {
      const loadAcDeleteProcess = await this.props.loadAcDeleteProcess(basicId);

      if (loadAcDeleteProcess.payload && loadAcDeleteProcess.payload.success) {
        let token = loadAcDeleteProcess.payload.data.token;
        window.open(AC_MANAGER_URL + '/delete?token=' + token);
      }
    }

    componentDidMount() {
      this.props.loadDeleteAccountList().then(() => {
        this.setState({ renderList: true });
      });
    }

    columns = [
      {
        title: '通知編號',
        dataIndex: 'recordId',
        // eslint-disable-next-line
            render: recordId => <a href={`/admin/deleteAccountRecord/${recordId}`} target="_blank">{recordId}</a>,
      },
      {
        title: '會員姓名',
        dataIndex: 'acName',
        render: acName => acName,
      },
      {
        title: 'e-mail',
        dataIndex: 'acMainEmail',
        render: acMainEmail => acMainEmail
      },
      {
        title: '通知類別',
        dataIndex: 'queueType',
        render: (queueType, record) => this.showQueueTypeDesc(queueType, record.directDel)
      },
      {
        title: '處理結果',
        dataIndex: 'handleStatus',
        render: handleStatus => (handleStatus === 1 ? '處理中' : ''),
      },
      {
        title: '查詢進度',
        dataIndex: 'basicId',
        render: (basicId, record) => (record.queueType === 1 ? <Button onClick={ () => this.onAcDeleteProcess(basicId) }>查詢</Button> : ''),
      }
    ];

    render() {
      const { deleteAccountList } = this.props;
      return (
        <Fragment><br />
          {this.state.renderList
            ? (
              <div>
                <p>查詢結果 共 {deleteAccountList ? deleteAccountList.length : 0} 筆</p>
                <Table rowKey="recordId" rowSelection={ rowSelection } columns={ this.columns } dataSource={ deleteAccountList } />
              </div>
            )
            : <LoadingOutlined />
                }
        </Fragment>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    deleteAccountList: state.member.deleteAccountList,
  };
};

const mapDispatchToProps = {
  loadDeleteAccountList,
  loadAcDeleteProcess: acDeleteProcess,
};
// export default Default;
export default connect(mapStateToProps, mapDispatchToProps)(Default);
