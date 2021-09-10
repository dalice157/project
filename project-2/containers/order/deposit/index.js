import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Divider } from 'antd';
import dayjs from 'dayjs';
import SingleSearchForm from '../../../components/order/deposit/singleSearchForm.js';
import SearchForm from '../../../components/order/deposit/searchForm.js';
import List from '../../../components/order/deposit/list.js';

import {
  queryOrder, queryOrderByKey, putOrderRefound, putBeRevenue
} from '../../../actions/order.js';

const initFormValue = {
  status: 0,
  targetSource: 0,
  payState: 0,
  yearMonth: dayjs()
};

class Deposit extends Component {
  state = {
    selectedRowKeys: [],
    selectedRows: []
  }

  componentDidMount() {
    if (this.props.history.location.search) {
      this.props.queryByKey('orderNo', this.props.location.query.orderNo);
    }
  }

  keepSelected = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows
    });
  }

  queryAndKeep = (formValue) => {
    this.formValue = formValue;
    return this.props.query(formValue);
  }

  nextPage = (key) => {
    this.props.query(this.formValue, key);
  }

  render() {
    const { selectedRowKeys } = this.state;
    const dottedLine = <Fragment><br /><hr style={ { border: '1px dashed #DDDDDD' } } /><br /></Fragment>;
    return (
      <Fragment>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>訂單管理</Breadcrumb.Item>
          <Breadcrumb.Item>押金訂單查詢</Breadcrumb.Item>
        </Breadcrumb>
        <SingleSearchForm onSubmit={ this.props.queryByKey } queryKey={ this.props.history } />
        {dottedLine}
        <SearchForm onSubmit={ this.queryAndKeep } onSubmitKey={ this.props.queryByKey } initialValues={ initFormValue } />
        <Divider />
        <List isTodos={ false } selectedRowKeys={ selectedRowKeys } keepSelected={ this.keepSelected } data={ this.props.orders } putOrderRefound={ this.props.putOrderRefound } putBeRevenue={ this.props.putBeRevenue } nextPage={ this.nextPage } nextKey={ this.props.nextKey } />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.order.orders,
  nextKey: state.order.next
});

const mapDispatchToProps = {
  query: queryOrder,
  queryByKey: queryOrderByKey,
  putOrderRefound,
  putBeRevenue
};

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
