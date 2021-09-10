import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import DeleteAccountForm from '../../components/member/deleteAccountForm.js';

import { loadDeleteAccountRecord, updateDeleteAccountRecord } from '../../actions/member.js';

class DeleteAccountRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderDeleteAccountForm: false
    };
  }

  componentDidMount() {
    const recordId = this.props.match.params.recordId;
    this.props.loadDeleteAccountRecord(recordId).then(() => {
      this.setState({ renderDeleteAccountForm: true });
    });
  }

  render() {
    const { deleteAccountRecord, loadUpdateDeleteAccountRecord } = this.props;
    const formInitData = {
      recordId: deleteAccountRecord.recordId
    };
    return (
      <Fragment>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>會員管理</Breadcrumb.Item>
          <Breadcrumb.Item>刪除通知回覆頁</Breadcrumb.Item>
        </Breadcrumb>
        <hr />
        {this.state.renderDeleteAccountForm
          ? (
            <DeleteAccountForm
              deleteAccountRecord={ deleteAccountRecord }
              onSubmit={ loadUpdateDeleteAccountRecord }
              initialValues={ formInitData }
            />
          )
          : <LoadingOutlined />
                }
      </Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    deleteAccountRecord: state.member.deleteAccountRecord
  };
};

const mapDispatchToProps = {
  loadDeleteAccountRecord,
  loadUpdateDeleteAccountRecord: updateDeleteAccountRecord,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountRecord);
