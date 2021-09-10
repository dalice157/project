import React from 'react';
import { Card } from 'antd';
import { Form, SubmitButton, Input } from 'formik-antd';
import { Formik } from 'formik';
import { validateAcManual } from '../common/Validates';

const renderForm = ({ values }) => {
  const { pid } = values;
  const isDisabledSubmit = pid === '';
  return (
    <Form>
      <Card>
        <h3>AC刪除手動服務</h3>
        <p style={ { color: '#979797' } }>請輸入會員PID(半形數字)</p>
        <Input name="pid" style={ { width: 200, marginRight: '10px' } } />
        <SubmitButton type="primary" disabled={ isDisabledSubmit }>查詢AC帳號</SubmitButton>
      </Card>
      {/* <DebugFormik /> */}
    </Form>
  );
};

const AcManualForm = ({ onSubmit }) => {
  const initialData = {
    pid: '',
  };
  return (
    <Formik
      initialValues={ initialData }
      onSubmit={ onSubmit }
      validationSchema={ validateAcManual }
    >
      { renderForm }
    </Formik>
  );
};

export default AcManualForm;
