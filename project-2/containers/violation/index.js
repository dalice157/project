import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import dayjs from 'dayjs';
import SearchForm from '../../components/violation/searchForm.js';
import List from '../../components/violation/list.js';

import { queryViolationList, queryViolationListByKey } from '../../actions/violation.js';


const initFormValue = {
  yearMonth: dayjs().format('YYYY-MM'),
  targetType: 0,
  causeType: 0,
  handleStatus: 0,
};

class Violation extends Component {
  render() {
    return (
      <Fragment>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><a href="/admin/">Home</a></Breadcrumb.Item>
          <Breadcrumb.Item>檢舉管理</Breadcrumb.Item>
        </Breadcrumb>
        <SearchForm onSubmit={ this.props.query } onSubmitKey={ this.props.queryByKey } initialValues={ initFormValue } />
        <hr />
        <List data={ this.props.violationList } />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  violationList: state.violation.violationList
});

const mapDispatchToProps = {
  query: queryViolationList,
  queryByKey: queryViolationListByKey,
};

export default connect(mapStateToProps, mapDispatchToProps)(Violation);
