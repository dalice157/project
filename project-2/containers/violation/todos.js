import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import List from '../../components/violation/list.js';

import { queryViolationTodo } from '../../actions/violation.js';

class ViolationTodos extends Component {
  render() {
    return (
      <Fragment>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>檢舉管理</Breadcrumb.Item>
          <Breadcrumb.Item>待處理</Breadcrumb.Item>
        </Breadcrumb>
        <List data={ this.props.violationList } />
      </Fragment>
    );
  }

  componentDidMount() {
    this.props.load();
  }
}

const mapStateToProps = state => ({
  violationList: state.violation.violationList
});

const mapDispatchToProps = {
  load: queryViolationTodo,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViolationTodos);
