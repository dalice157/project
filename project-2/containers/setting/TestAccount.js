import React, { PureComponent } from 'react';
import { Breadcrumb, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TestAccountForm from '../../components/setting/TestAccountForm';
import TestAccountTable from '../../components/setting/TestAccountTable';
import { loadTestAccountList, addTestAccount, removeTestAccount } from '../../actions/setting';

class testAccount extends PureComponent {
  componentDidMount() {
    this.props.loadTestAccountList();
  }

  onAddTestAccount = async (values, actions) => {
    const { basicId } = values;
    const result = await this.props.addTestAccount(basicId);
    if (result.payload.success) {
      this.props.loadTestAccountList();
    }
    actions.setSubmitting(false);
  }

  onRemoveTestAccount = async (basicId) => {
    const result = await this.props.removeTestAccount(basicId);
    if (result.payload.success) {
      this.props.loadTestAccountList();
    }
  }

  render() {
    const { data, loading } = this.props.testAccount;
    return (
      <>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item><h1 className="breadcrumb-header">測試帳號設定</h1></Breadcrumb.Item>
        </Breadcrumb>
        <TestAccountForm onAddTestAccount={ this.onAddTestAccount } />
        <Divider />
        <TestAccountTable data={ data } loading={ loading } onRemoveTestAccount={ this.onRemoveTestAccount } />
      </>
    );
  }
}

const mapStateToProps = state => ({
  testAccount: state.setting.testAccount,
});

const mapDispatchToProps = {
  loadTestAccountList,
  addTestAccount,
  removeTestAccount,
};
export default connect(mapStateToProps, mapDispatchToProps)(testAccount);
