import React from 'react';
import {
  Form, Input, SubmitButton
} from 'formik-antd';
import { Formik } from 'formik';
import './TestAccountForm.scss';

const renderForm = ({ values }) => {
  const { basicId } = values;
  const isDisabledSubmit = basicId === '';
  return (
    <Form className="test-account-form">
      <Input name="basicId" className="account-field" placeholder="請輸入測試帳號會員編號" />
      <SubmitButton type="primary" disabled={ isDisabledSubmit }>送出</SubmitButton>
    </Form>
  );
};

const TestAccountForm = ({ onAddTestAccount }) => {
  const init = {
    basicId: '',
  };
  return (
    <Formik
      initialValues={ init }
      onSubmit={ onAddTestAccount }
    >
      { renderForm }
    </Formik>
  );
};

export default TestAccountForm;
