import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Select, Form, SubmitButton, Input, Checkbox,
} from 'formik-antd';
import { Formik } from 'formik';
import { byKeyOptions } from '../../config/demandOptions';
import './singleSearchForm.scss';
// import { DebugFormik } from '../tools/DebugFormik';

class SingleSearchForm extends Component {
  componentDidMount() {
    const { history: { location: { search } }, onSubmitKey } = this.props;
    const params = new URLSearchParams(search);
    if (params.get('basicId')) {
      onSubmitKey(byKeyOptions[0].value, params.get('basicId'), true);
    }
  }

  onKeyTypeChange = (val, setFieldValue) => {
    const { history } = this.props;
    const { location: { search, pathname } } = history;

    const params = new URLSearchParams(search);
    let getSearch = search;
    if (params.get('basicId')) {
      params.delete('basicId');
      getSearch = params.toString() ? `?${params.toString()}` : '';
      setFieldValue('content', '');
    }
    history.push(`${pathname}${getSearch}`);
  }

  onSubmit = async (data, { setSubmitting }) => {
    const { onSubmitKey } = this.props;
    const {
      keyType, content, lastName, firstName, isContacter,
    } = data;
    const fullName = isContacter ? firstName : (`${lastName}-${firstName}`);
    if (keyType !== byKeyOptions[3].value) {
      await onSubmitKey(keyType, content, isContacter);
    } else {
      await onSubmitKey(keyType, fullName, isContacter);
    }
    setSubmitting(false);
  };

  renderForm = ({ values, setFieldValue }) => {
    const demandContactorList = [byKeyOptions[3], byKeyOptions[5], byKeyOptions[6], byKeyOptions[7]];
    const {
      keyType, isContacter, content, lastName, firstName,
    } = values;
    const disabledSeatch = content === '';
    const disabledACSeatch = lastName === '' && firstName === '';
    return (
      <Form className="single-form-demand">
        <h2> 單一條件查詢 </h2>
        <Select name="keyType" className="keyType" onChange={val => this.onKeyTypeChange(val, setFieldValue)}>
          {
            byKeyOptions.map(item => (
              <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
            ))
          }
        </Select>
        {
          keyType !== byKeyOptions[3].value
            ? (
              <>
                <Input name="content" className="content" />
                <SubmitButton type="primary" disabled={disabledSeatch}>送出</SubmitButton>
              </>
            )
            : (
              <div className="nameField">
                姓氏：
                <Input name="lastName" className="lastName" disabled={isContacter} />
                名字：
                <Input name="firstName" className="firstName" />
                <SubmitButton type="primary" disabled={disabledACSeatch}>送出</SubmitButton>
              </div>
            )
        }
        {
          demandContactorList.map(contactor => (contactor.value === keyType
            ? <Checkbox key="isContacter" name="isContacter" className="isContacter">案件聯絡人</Checkbox>
            : null))
        }
        {/* <DebugFormik /> */}
      </Form>
    );
  };

  render() {
    const { history: { location: { query } } } = this.props;
    const keyTypeVal = query && query.basicId ? 'basicId' : 'cellphone';
    const contentVal = query && query.basicId ? query.basicId : '';
    const initialData = {
      keyType: keyTypeVal,
      content: contentVal,
      lastName: '',
      firstName: '',
      isContacter: true,
    };
    return (
      <Formik
        initialValues={initialData}
        onSubmit={this.onSubmit}
      >
        { this.renderForm }
      </Formik>
    );
  }
}

export default withRouter(SingleSearchForm);
