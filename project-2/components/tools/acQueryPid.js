import React from 'react';
import { Form, SubmitButton, Input } from 'formik-antd';
import { Formik } from 'formik';
import { Card, Table } from 'antd';
import { validateAcEmail } from '../common/Validates';

const columns = [
  {
    title: 'PID',
    dataIndex: 'pid',
  },
  {
    title: '主要email',
    dataIndex: 'isMain',
    render: text => (text === 'true' ? '主要' : '備援'),
  },
  {
    title: '是否被驗證',
    dataIndex: 'isVerified',
    render: text => (text === 'true' ? '己驗證' : '未驗證'),
  }
];


const renderForm = ({ values }) => {
  const { email } = values;
  const isDisabledSubmit = email === '';
  return (
    <Form>
      <Card>
        <h3>AC-EMAIL查PID</h3>
        <p style={ { color: '#979797' } }>請輸入會員EMAIL</p>
        <Input name="email" style={ { width: 200, marginRight: '10px' } } />
        <SubmitButton type="primary" disabled={ isDisabledSubmit }>換PID</SubmitButton>
      </Card>
      {/* <DebugFormik /> */}
    </Form>
  );
};

const AcEmailForm = ({ onSubmit, list }) => {
  const initialData = {
    email: '',
  };
  return (
    <>
      <Formik
        initialValues={ initialData }
        onSubmit={ onSubmit }
        validationSchema={ validateAcEmail }
      >
        { renderForm }
      </Formik>
      { list.length > 0 && <Table rowKey="pid" columns={ columns } dataSource={ list } pagination={ false } />}
    </>
  );
};

export default AcEmailForm;
