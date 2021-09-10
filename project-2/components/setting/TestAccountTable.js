import React, { PureComponent } from 'react';
import { Table, Button } from 'antd';

class testAccountTable extends PureComponent {
  columns = [
    {
      title: 'PID',
      dataIndex: 'pid',
    },
    {
      title: '會員編號',
      dataIndex: 'basicId',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: '操作者',
      dataIndex: 'owner',
    },
    {
      title: '取消測試設定',
      dataIndex: 'cancel',
      render: (val, payload) => <Button onClick={ () => this.props.onRemoveTestAccount(payload.basicId) }>取消</Button>
    },
  ];

  render() {
    const { data, loading } = this.props;
    return (
      <>
        <Table
          rowKey="pid"
          bordered
          columns={ this.columns }
          dataSource={ data }
          loading={ loading }
        />
      </>
    );
  }
}
export default testAccountTable;
