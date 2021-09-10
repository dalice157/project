import React, { Component } from 'react';
import { Button, Select, Input } from 'antd';
import {
  Radio,
  SubmitButton,
  Form
} from 'formik-antd';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../ui/days';
import {
  byUserOptions, targetType, causeType, handleStatus
} from './options';
// import Joi from 'joi';
// import createValidator from '../../util/joiUtil.js';

// import BankAccountFields,{joiRule as bankFormRule} from '../components-account/BankAccountFields';
// import InvocieFields,{joiRule as invoiceRule} from '../components-account/InvoiceFields';

// const schema = Joi.object({});
const Option = Select.Option;

class Default extends Component {
    state = {
      pkType: 'basicId',
      keyVal: '',
    }

    handleKeySearch = (key) => {
      console.log('key', key);
      this.setState({
        keyVal: ''
      });
      this.props.onSubmitKey(this.state.pkType, key);
    }

    onSubmit = async (values, { setSubmitting }) => {
      const searchList = {
        ...values,
        year: dayjs(values.yearMonth).format('YYYY'),
        month: dayjs(values.yearMonth).format('MM'),
      };
      console.log('searchList:', searchList);
      await this.props.onSubmit(searchList);
      setSubmitting(false);
    }

    render() {
      const { initialValues } = this.props;
      const { pkType, keyVal } = this.state;
      const mtStyle = {
        marginTop: '10px',
      };
      const mrStyle = {
        marginRight: '20px',
      };

      return (
        <>
          <div>
            <label>依會員資料: </label>
            <Select defaultValue={ pkType } style={ { width: 200 } } onChange={ v => this.setState({ pkType: v }) }>
              {
                byUserOptions.map(item => (
                  <Option key={ item.value } value={ item.value }>{item.label}</Option>
                ))
              }
            </Select>
            <div style={ { display: 'inline-block' } }>
              <Input value={ keyVal } style={ { width: 200, margin: 'auto 10px' } } onChange={ element => this.setState({ keyVal: element.target.value }) } />
              <Button type="primary" onClick={ () => this.handleKeySearch(keyVal) } disabled={ keyVal === '' }>送出</Button>
            </div>
          </div>
          <hr className="hr" />
          <br />
          <Formik
            initialValues={ initialValues }
            onSubmit={ this.onSubmit }
          >
            {(props) => {
              const { values, setFieldValue } = props;
              return (
                <Form>
                  <div>
                    <label>依條件查詢</label>
                  </div>
                  <div style={ mtStyle }>
                    <label style={ mrStyle }> 區間查詢: </label>
                    <DatePicker
                      locale={ locale }
                      picker="month"
                      name="yearMonth"
                      format="YYYY-MM"
                      allowClear={ false }
                      placeholder="請選擇月份"
                      value={ dayjs(values.yearMonth) }
                      onChange={ (value) => {
                        setFieldValue('yearMonth', dayjs(value));
                      } }
                    />
                  </div>
                  <div style={ mtStyle }>
                    <label style={ mrStyle }> 依被檢舉人身分查: </label>
                    <Radio.Group
                      name="targetType"
                      options={ targetType }
                    />
                  </div>
                  <div style={ mtStyle }>
                    <label style={ mrStyle }> 依檢舉項目查: </label>
                    <Radio.Group
                      name="causeType"
                      options={ causeType }
                    />
                  </div>
                  <div style={ mtStyle }>
                    <label style={ mrStyle }> 依聯絡狀態查: </label>
                    <Radio.Group
                      name="handleStatus"
                      options={ handleStatus }
                    />
                  </div>

                  <div className="accountGroup">
                    <div className="buttonArea">
                      <SubmitButton type="primary">送出</SubmitButton>
                    </div>
                  </div>
                </Form>
              );
            }
        }
          </Formik>
        </>
      );
    }
}

export default Default;
