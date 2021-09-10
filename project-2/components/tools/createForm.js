import React, { Fragment } from 'react';
import {
  Form, Input, Radio, SubmitButton
} from 'formik-antd';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import dayjs from 'dayjs';
import { DatePicker } from '../ui/days';

const formSchema = Yup.object().shape({
  note: Yup.string()
    .max(20, 'Too Long!')
    .required('Required'),
  bindType: Yup.string()
    .required('Required'),
  value: Yup.string().required('Required')
    .when('bindType', { is: '1', then: Yup.string().matches(/^[0-9]*$/) })
    .when('bindType', { is: '2', then: Yup.string().matches(/^[0-9]*$/) })
    .when('bindType', { is: '3', then: Yup.string().email('Invalid email') }),
  effectType: Yup.string()
    .required('Required'),
  setExpired: Yup.number()
    .required('Required'),
  expireDate: Yup.string()
    .when('setExpired', { is: 2, then: Yup.string().required('Required') }),
});

const options = [
  { label: 'PID', value: '1' },
  { label: 'BasicID', value: '2' },
  { label: 'EMail', value: '3' },
];

const effectOptions = [
  { label: '高手刊登', value: '1' },
  { label: '案件刊登', value: '2' },
];

const setExpired = [
  { label: '無限期', value: '1' },
  { label: '到期日', value: '2' },
];

const Basic = ({ onSubmit }) => (
  <Fragment>
    <h2>新增邀請碼</h2>
    <Formik
      initialValues={ {
        note: '', bindType: '', effectType: '', value: '', setExpired: '', expireDate: ''
      } }
      validationSchema={ formSchema }
      onSubmit={ (values, { setSubmitting }) => {
        setTimeout(() => {
          console.log('新增values', values);
          onSubmit(values);
          setSubmitting(false);
        }, 400);
      } }
    >
      {(props) => {
        const { setFieldValue, errors } = props;
        return (
          <Form style={ { lineHeight: '2em' } }>
            <div><label>需求說明</label><Input name="note" placeholder="中英文20字以內" /></div>
            <ErrorMessage name="note">{msg => <div style={ { color: 'red' } }>{msg}</div>}</ErrorMessage>
            <div><label style={ { marginRight: '8px' } }>綁定人</label><Radio.Group name="bindType" options={ options } /><Input name="value" placeholder="輸入綁定欄位" /></div>
            <ErrorMessage name="value">{msg => <div style={ { color: 'red' } }>{msg}</div>}</ErrorMessage>
            <div style={ { marginTop: '8px' } }><label style={ { marginRight: '8px' } }>鎖定流程</label><Radio.Group name="effectType" options={ effectOptions } /></div>
            <ErrorMessage name="effectType">{msg => <div style={ { color: 'red' } }>{msg}</div>}</ErrorMessage>
            <div style={ { marginTop: '4px' } }><label style={ { marginRight: '8px' } }>使用期限</label><Radio.Group name="setExpired" options={ setExpired } /></div>
            <ErrorMessage name="setExpired">{msg => <div style={ { color: 'red' } }>{msg}</div>}</ErrorMessage>
            <div>
              <DatePicker
                locale={ locale }
                name="expireDate"
                onChange={ (date, dateString) => {
                  setFieldValue('expireDate', dateString ? dayjs(dateString).format('YYYY-MM-DD') : '');
                } }
              />
            </div>
            {errors.expireDate ? <div style={ { color: 'red' } }>{errors.expireDate}</div> : null}
            <SubmitButton style={ { marginTop: '1em' } }>送出</SubmitButton>
          </Form>
        );
      }}
    </Formik>
  </Fragment>
);

export default Basic;
