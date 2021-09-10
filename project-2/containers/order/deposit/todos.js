import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button } from 'antd';
import List from '../../../components/order/deposit/list.js';
import DateSubmit from '../../../components/order/deposit/dateSubmit.js';

import { queryOrderTodo, putOrderRefound, putBeRevenue } from '../../../actions/order.js';

class DepositTodos extends Component {
    state = {
      selectedRowKeys: [],
      selectedRows: []
    }

    keepSelected = (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedRowKeys: selectedRowKeys,
        selectedRows: selectedRows
      });
    }

    batchRefound = (refoundDate) => {
      if (this.state.selectedRows) {
        this.state.selectedRows.map(async (record) => {
          await this.props.putOrderRefound({ yyyyMM: record.yyyyMM, orderId: record.id, refoundDate: refoundDate });
        });
      }
      this.setState({
        selectedRowKeys: [],
        selectedRows: []
      });
    }

    render() {
      const { selectedRowKeys, selectedRows } = this.state;
      const total = selectedRows.length > 0 ? selectedRows.length : null;
      return (
        <Fragment>
          <Breadcrumb style={ { margin: '16px 0' } }>
            <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>訂單管理</Breadcrumb.Item>
            <Breadcrumb.Item>待處理</Breadcrumb.Item>
          </Breadcrumb>
          <List isTodos={ true } selectedRowKeys={ selectedRowKeys } keepSelected={ this.keepSelected } data={ this.props.orders } putOrderRefound={ this.props.putOrderRefound } putBeRevenue={ this.props.putBeRevenue } nextPage={ this.props.load } nextKey={ this.props.nextKey } />
          <div align="center">
            {total && <DateSubmit total={ total } updateRefound={ refoundDate => this.batchRefound(refoundDate) } />}
            <Button type="primary" shape="round" icon={<DownloadOutlined />} href="/bs/export-deposit">
              匯出退款申請
            </Button>
          </div>
        </Fragment>
      );
    }

    componentDidMount() {
      this.props.load();
    }
}

const mapStateToProps = state => ({
  orders: state.order.orders,
  nextKey: state.order.next
});

const mapDispatchToProps = {
  load: queryOrderTodo,
  putOrderRefound,
  putBeRevenue
};

export default connect(mapStateToProps, mapDispatchToProps)(DepositTodos);
