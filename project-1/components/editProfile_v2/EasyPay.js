import React, { Component } from 'react';

export default class EasyPay extends Component {
  componentDidMount() {
    // 金流那自訂了一個事件叫 easyPayReady，然後事件是掛在 document 下面
    document.addEventListener('easyPayReady', this.renderEasyPay);
  }

  componentWillUnmount() {
    document.removeEventListener('easyPayReady', this.renderEasyPay);
  }

  renderEasyPay = () => {
    const { orderHashList, idTokenHash } = this.props.payOrderInfo;
    const orderList = JSON.parse(JSON.stringify(orderHashList));
    let easyPay = document.querySelector('easy-pay');
    easyPay.orderHashList = [{
      orderHash: orderList[0].orderHash
    }];
    easyPay.idTokenHash = idTokenHash;
  }

  render() {
    return <easy-pay width="100%" />;
  }
}
