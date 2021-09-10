import React, { Fragment } from 'react';
import { Form, SubmitButton } from 'formik-antd';
import { Formik } from 'formik';
import { Input } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../ui/days';

const Search = Input.Search;

const Basic = ({ onSubmit, queryCode }) => {
  const monthFormat = 'YYYY-MM';
  const initFormValue = {
    yearMonth: dayjs(),
  };
  return (
    <Fragment>
      <h2>查詢</h2>
      <Search onSearch={ v => queryCode(v) } style={ { width: 250 } } placeholder="代碼查詢" enterButton="送出" />
      <Formik
        initialValues={ initFormValue }
        onSubmit={ (values, { setSubmitting }) => {
          setTimeout(() => {
            const { yearMonth } = values;
            const searchList = {
              yearMonth: dayjs(yearMonth).format('YYYYMM'),
            };
            onSubmit(searchList);
            setSubmitting(false);
          }, 400);
        } }
      >
        {({ ...props }) => {
          console.log('props:', props);
          const { values, setFieldValue } = props;
          console.log('values:', values);
          return (
            <Form>
              <label>依月份列表</label>
              <DatePicker
                locale={ locale }
                picker="month"
                name="yearMonth"
                format={ monthFormat }
                allowClear={ false }
                placeholder="請選擇月份"
                value={ dayjs(values.yearMonth) }
                onChange={ (value) => {
                  setFieldValue('yearMonth', dayjs(value));
                } }
              />
              <SubmitButton>送出</SubmitButton>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default Basic;
