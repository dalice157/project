import React, { Fragment } from 'react';
import {
  Form, Select, Input, SubmitButton
} from 'formik-antd';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { byUserOptions } from './options';

const Option = Select.Option;

const formSchema = Yup.object().shape({
  type: Yup.string().required('請選下拉欄位'),
  key: Yup.string().required('輸入框必填')
});

const Default = ({ onSubmit, queryKey }) => {
  const isInitValType = queryKey.location.search ? 'orderNo' : 'basicId';
  const isInitValKey = queryKey.location.search ? queryKey.location.query.orderNo : '';
  return (
    <Fragment>
      <Formik
        initialValues={ {
          type: isInitValType,
          key: isInitValKey
        } }
        validationSchema={ formSchema }
        onSubmit={
        async (values, { setSubmitting }) => {
          await onSubmit(values.type, values.key);
          setSubmitting(false);
        } }
      >
        {({ values }) => {
          return (
            <Form>
              <h2> 單一條件查詢 </h2>
              <br />
              <Select name="type" style={ { width: 150, marginRight: '10px' } }>
                {
                  byUserOptions.map(item => <Option key={ item.value } value={ item.value }>{item.label}</Option>)
                }
              </Select>
              <Input name="key" placeholder="請輸入會員資訊" style={ { width: 200 } } /><SubmitButton disabled={ values.key === '' }>送出</SubmitButton>
              <br />
              <ErrorMessage name="type" component="div" /><ErrorMessage name="key" component="div" />
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default Default;
