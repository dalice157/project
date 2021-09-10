import React, { Fragment } from 'react';
import {
  Form, Radio, SubmitButton
} from 'formik-antd';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../ui/days';
import { payOpts, statusTypes, roleTypes } from './options';

const formSchema = Yup.object().shape({
  yearMonth: Yup.string().nullable().required('請選月份'),
});

const Default = ({ onSubmit, initialValues }) => {
  const mtStyle = {
    marginTop: '10px',
  };
  const mrStyle = {
    marginRight: '20px',
  };
  return (
    <Fragment>
      <h2> 多條件查詢 </h2>
      <Formik
        initialValues={ initialValues }
        validationSchema={ formSchema }
        onSubmit={
        async (values, { setSubmitting }) => {
          console.log('values sub:', values);
          const { yearMonth } = values;
          const searchLists = {
            ...values,
            year: dayjs(yearMonth).format('YYYY'),
            month: dayjs(yearMonth).format('MM'),
          };
          await onSubmit(searchLists);
          setSubmitting(false);
        } }
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <div>
                <label style={ mrStyle }>訂單日期</label>
                <DatePicker
                  locale={ locale }
                  picker="month"
                  name="yearMonth"
                  allowClear={ false }
                  placeholder="請選擇月份"
                  value={ dayjs(values.yearMonth) }
                  onChange={ (value) => {
                    setFieldValue('yearMonth', dayjs(value));
                  } }
                />
                <ErrorMessage name="yearMonth" component="div" />
                <br />
              </div>
              <div style={ mtStyle }>
                <label style={ mrStyle }>押金狀態</label><Radio.Group name="status" options={ statusTypes } />
              </div>
              <div style={ mtStyle }>
                <label style={ mrStyle }>押金來源</label><Radio.Group name="targetSource" options={ roleTypes } />
              </div>
              <div style={ mtStyle }>
                <label style={ mrStyle }>付款狀態</label><Radio.Group name="payState" options={ payOpts } />
              </div>
              <div style={ { textAlign: 'center', marginTop: '20px' } }>
                <SubmitButton>送出</SubmitButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default Default;
