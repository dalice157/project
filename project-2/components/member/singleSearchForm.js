import React, { Component, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import { Select, Input, Button } from 'antd';
// import {
//     RadioField, DatePickerField
// } from 'redux-form-antd';
// import { byKeyOptions, dateType, orderType, serviceType, memberType, blackList } from './options'
import { byKeyOptions } from './options';

const { Option } = Select;

class Default extends Component {
    state = {
      keyType: 'cellphone',
      keyVal: '',
      familyName: '',
      firstName: '',
    }

    handleKeySearch = (key) => {
      console.log('key', key);
      this.props.onSubmitKey(this.state.keyType, key).then(() => {
        this.props.getMemberList();
      });
    }

    handleAcNameSearch = () => {
      console.log('this.state= ', this.state);
      // console.log('this.state.familyName = ', this.state.familyName);
      // console.log('this.state.firstName = ', this.state.firstName);
      let fullName = '';
      if (this.state.firstName !== '') {
        fullName = `${this.state.familyName}-${this.state.firstName}`;
      } else {
        fullName = this.state.familyName;
      }
      this.props.onSubmitKey(this.state.keyType, fullName);
    }

    render() {
      // const { handleSubmit, submitting } = this.props;
      const {
        keyType, keyVal, familyName, firstName,
      } = this.state;
      const { singleSearchLoading } = this.props;
      const isDisabledSearch = keyVal === '';
      const isDisabledACSearch = familyName === '' && firstName === '';

      return (
        <Fragment>
          <h2> 單一條件查詢 </h2>
          <Select defaultValue={keyType} onChange={value => this.setState({ keyType: value })} style={{ width: 200, margin: '10px' }}>
            {
              byKeyOptions.map(item => (
                <Option key={item.value} value={item.value}>{item.label}</Option>
              ))
            }
          </Select>
          {
            this.state.keyType !== 'acName'
              ? (
                <div style={{ display: 'inline-block' }}>
                  <Input defaultValue={keyVal} style={{ width: 200, margin: 'auto 10px' }} onChange={element => this.setState({ keyVal: element.target.value })} />
                  <Button type="primary" onClick={() => this.handleKeySearch(keyVal)} disabled={isDisabledSearch} loading={singleSearchLoading}>送出</Button>
                </div>
              )
              : (
                <div>
                  姓氏：
                  <Input name="familyName" type="text" style={{ width: 150 }} onChange={e => this.setState({ familyName: e.target.value })} />
                  名字：
                  <Input name="firstName" type="text" style={{ width: 200 }} onChange={e => this.setState({ firstName: e.target.value })} />
                  <Button type="primary" onClick={() => this.handleAcNameSearch()} style={{ marginLeft: '10px' }} disabled={isDisabledACSearch} loading={singleSearchLoading}>送出</Button>
                </div>
              )
        }
        </Fragment>
      );
    }
}

export default reduxForm({
  form: 'MemberSearchForm', // a unique name for this form
})(Default);
