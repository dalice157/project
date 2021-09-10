import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select, Input, Button } from 'antd';
import { paySingleOpts } from '../../../config/selectData';
import { getSinglePaymentList } from '../../../actions/order';

const { Option } = Select;

class SingleSearchForm extends Component {
  constructor(props) {
    super(props);
    const isKeyType = props.history.location.search ? 'orderId' : 'basicId';
    const iskeyVal = props.history.location.search ? props.history.location.query.orderId : '';
    this.state = {
      keyType: isKeyType,
      keyVal: iskeyVal,
    };
  }

  componentDidMount() {
    if (this.props.history.location.search) {
      this.props.getSinglePaymentList('orderId', this.props.history.location.query.orderId);
    }
  }

    onChange = (val) => {
      this.setState({
        keyType: val,
      });
    }

    handleKeySearch = (key) => {
      const { keyType } = this.state;
      this.props.updateSearchOptions({ keyType, keyBasicId: key }, 'single');
      this.props.getSinglePaymentList(keyType, key);
    }


    render() {
      const { keyType, keyVal } = this.state;
      const { singleSearchLoading } = this.props;
      return (
        <>
          <h2> 單一條件查詢 </h2>
          <Select defaultValue={keyType} onChange={this.onChange} style={{ width: 200, margin: 'auto 10px' }}>
            {
              paySingleOpts.map(item => (
                <Option key={item.value} value={item.value}>{item.label}</Option>
              ))
            }
          </Select>
          <div style={{ display: 'inline-block' }}>
            <Input defaultValue={keyVal} style={{ width: 200, margin: '10px' }} onChange={element => this.setState({ keyVal: element.target.value })} />
            <Button type="primary" onClick={() => this.handleKeySearch(keyVal)} disabled={keyVal === ''} loading={singleSearchLoading}>送出</Button>
          </div>
        </>
      );
    }
}

const mapStateToProps = state => ({
  singleSearchLoading: state.order.singleSearchLoading,
});

const mapDispatchToProps = {
  getSinglePaymentList,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SingleSearchForm));
