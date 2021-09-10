import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import CreateForm from '../../components/tools/createForm.js';
import SingleSearchForm from './singleSearchForm.js';
import MultiSearchForm from './multiSearchForm.js';
import List from '../../components/tools/list.js';
import SearchForm from '../../components/tools/searchForm.js';
import config from '../../config/config.js';

import { queryInviteCode, createInviteCode, getInviteCode } from '../../actions/inviteCode.js';

class InviteCode extends Component {
  componentDidMount() {

  }

  render() {
    const dottedLine = <Fragment><br /><hr style={ { border: '1px dashed #DDDDDD' } } /><br /></Fragment>;
    return (
      <Fragment>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>邀請碼管理</Breadcrumb.Item>
        </Breadcrumb>
        <CreateForm onSubmit={ this.props.createForm } />
        {dottedLine}
        {
          config.VL9231Switch ? (
            <>
              <SingleSearchForm />
              {dottedLine}
              <MultiSearchForm />
            </>
          ) : (
            <SearchForm
              onSubmit={ this.props.query }
              queryCode={ this.props.queryByCode }
            />
          )
        }
        <List isTodos={ false } data={ this.props.list } />
      </Fragment>
    );
  }
}


const mapStateToProps = state => ({
  list: state.inviteCode.list
});

const mapDispatchToProps = {
  query: queryInviteCode,
  queryByCode: getInviteCode,
  createForm: createInviteCode
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteCode);
