import React, { PureComponent } from 'react';
import {
  Form, Select, Checkbox, SubmitButton
} from 'formik-antd';
import { Formik } from 'formik';
import './DurationSearch.scss';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../ui/days';
import { salesSearchTypeOptions } from '../../../config/selectData';

class DurationSearch extends PureComponent {
onChangeCompareDate = (element, values, setFieldValue) => {
  if (element === salesSearchTypeOptions[1].value) {
    setFieldValue('comparedDate', dayjs(values.targetDate).add(-1, 'months'));
  }
}

renderForm = ({ values, setFieldValue }) => {
  const {
    isCompared, targetDate, comparedDate, compareSearchType
  } = values;
  const isValid = isCompared ? (targetDate && comparedDate) : (targetDate);
  return (
    <Form className="dsWrap">
      <div className="dsItem">
        <span>目標月份</span>
        <DatePicker
          locale={ locale }
          picker="month"
          name="targetDate"
          defaultValue={ dayjs(targetDate) }
          value={ dayjs(targetDate) }
          className="date-picker"
          onChange={ (dateString) => {
            setFieldValue('targetDate', dayjs(dateString).format('YYYY/MM/DD'));
          } }
        />
      </div>
      <div className="dsItem">
        <Checkbox
          name="isCompared"
          onChange={ () => this.onChangeCompareDate(compareSearchType, values, setFieldValue) }
        >相較於
        </Checkbox>
        <Select name="compareSearchType" className="w100" onChange={ element => this.onChangeCompareDate(element, values, setFieldValue) }>
          {salesSearchTypeOptions.map(options => <Select.Option key={ options.value } value={ options.value }>{options.label}</Select.Option>)}
        </Select>
      </div>
      {
        isCompared
          ? (
            <div className="dsItem">
              <span>比較月份</span>
              <DatePicker
                locale={ locale }
                picker="month"
                name="comparedDate"
                defaultValue={ dayjs(comparedDate) }
                value={ dayjs(comparedDate) }
                className="date-picker"
                onChange={ (dateString) => {
                  setFieldValue('comparedDate', dayjs(dateString).format('YYYY/MM/DD'));
                } }
                disabled={ compareSearchType === salesSearchTypeOptions[1].value }
              />
            </div>
          )
          : null
      }
      <SubmitButton type="primary" disabled={ !isValid }>查詢</SubmitButton>
    </Form>
  );
};

render() {
  const { onSubmitSearch } = this.props;
  const init = {
    searchType: 0,
    targetDate: dayjs(),
    comparedDate: dayjs(),
    isCompared: false,
    compareSearchType: 0,
  };
  return (
    <Formik
      initialValues={ init }
      onSubmit={ onSubmitSearch }
      enableReinitialize={ true }
    >
      { this.renderForm }
    </Formik>
  );
}
}

export default DurationSearch;
