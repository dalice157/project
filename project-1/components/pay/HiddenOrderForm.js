import React, { Component } from 'react';
import config from '../../config/config';

class HiddenOrderForm extends Component {
  constructor() {
    super();
    this.btnRef = React.createRef();
  }


  componentDidMount() {
    let form = this.btnRef;
    form.orderData.value = this.toJson({
      orderData: [this.props.formData]
    });
    form.submit();
  }

  toJson(obj) {
    return JSON.stringify(obj);
  }

  render() {
    return (
      <form
        action={`${config.paymentSite.domain}/billing/billing-pay.jsp`}
        ref={(ref) => {
          this.btnRef = ref;
        }}
        method="post"
      >
        <input type="hidden" name="orderData" />
      </form>
    );
  }
}

export default HiddenOrderForm;
