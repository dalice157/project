import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tabs } from 'antd';
import { loadDepositList, loadPaymentList } from '../../../actions/order';
import DepositRecord from './DepositRecord';
import PaidRecord from './PaidRecord';

const { TabPane } = Tabs;
const defaultActiveKey = 'deposit';

class OrderRecord extends Component {
  componentDidMount() {
    this.onChange(defaultActiveKey);
  }


  onChange = (key) => {
    console.log('key:', key);
    const { match } = this.props;
    const { basicId } = match.params;
    if (key === 'deposit') {
      this.props.loadDepositList(basicId);
    } else {
      this.props.loadPaymentList(basicId);
    }
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey={defaultActiveKey} onChange={this.onChange}>
          <TabPane tab="押金訂單紀錄" key="deposit">
            <DepositRecord />
          </TabPane>
          <TabPane tab="付費訂單紀錄" key="paid">
            <PaidRecord />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapDispatchToProps = {
  loadDepositList,
  loadPaymentList,
};

export default withRouter(connect(null, mapDispatchToProps)(OrderRecord));
