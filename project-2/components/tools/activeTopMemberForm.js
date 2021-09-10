import React from 'react';
import { Card } from 'antd';
import { Form, SubmitButton, Input } from 'formik-antd';
import { Formik } from 'formik';
import { validateActiveMember } from '../common/Validates';
// import { DebugFormik } from './DebugFormik';

const renderForm = ({ values }) => {
  const { pid } = values;
  const isDisabledSubmit = pid === '';
  return (
    <Form>
      <Card>
        <h3>啟用高手產品服務</h3>
        <p style={ { color: '#979797' } }>此功能為協助AC帳號啟用高手產品服務，並建立發案會員身分</p>
        <p style={ { color: '#979797' } }>請輸入會員PID(半形數字)</p>
        <Input name="pid" style={ { width: 200, marginRight: '10px' } } />
        <SubmitButton type="primary" disabled={ isDisabledSubmit }>啟用</SubmitButton>
      </Card>
      {/* <DebugFormik /> */}
    </Form>
  );
};

const ActiveTopMemberForm = ({ onSubmit }) => {
  const initialData = {
    pid: '',
  };
  return (
    <Formik
      initialValues={ initialData }
      onSubmit={ onSubmit }
      validationSchema={ validateActiveMember }
    >
      { renderForm }
    </Formik>
  );
};

export default ActiveTopMemberForm;
