import React, { PureComponent } from 'react';
import {
  Form, Select, Checkbox, SubmitButton,
} from 'formik-antd';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../ui/days';
import { searchDateOptions, plansSearchTypeOptions } from '../../../config/selectData';
// import { DebugFormik } from '../../tools/DebugFormik';

class DateSearch extends PureComponent {
  onChangeTargetDate = (element, setFieldValue) => {
    switch (element) {
      case searchDateOptions[0].value: {
        setFieldValue('targetStartDate', dayjs());
        setFieldValue('targetEndDate', dayjs());
        break;
      }
      case searchDateOptions[1].value: {
        setFieldValue('targetStartDate', dayjs().add(-7, 'days'));
        setFieldValue('targetEndDate', dayjs().add(-1, 'days'));
        break;
      }
      case searchDateOptions[2].value: {
        setFieldValue('targetStartDate', dayjs().add(-1, 'months').startOf('months'));
        setFieldValue('targetEndDate', dayjs().add(-1, 'months').endOf('months'));
        break;
      }
      default: {
        return null;
      }
    }
  }

  onChangeCompareSearchType = (element, searchType, values, setFieldValue) => {
    switch (element) {
      case searchDateOptions[0].value: {
        if (searchType === searchDateOptions[0].value) {
          setFieldValue('comparedStartDate', dayjs(values.targetStartDate).add(-1, 'days'));
          setFieldValue('comparedEndDate', dayjs(values.targetEndDate).add(-1, 'days'));
        } else if (searchType === searchDateOptions[1].value) {
          setFieldValue('comparedStartDate', dayjs(values.targetStartDate).add(-7, 'days'));
          setFieldValue('comparedEndDate', dayjs(values.targetEndDate).add(-7, 'days'));
        } else if (searchType === searchDateOptions[2].value) {
          const offset = 0 - Number(dayjs(values.targetStartDate).endOf('months').format('D'));
          setFieldValue('comparedStartDate', dayjs(values.targetStartDate).add(offset, 'days'));
          setFieldValue('comparedEndDate', dayjs(values.targetEndDate).add(offset, 'days'));
        } else if (searchType === searchDateOptions[3].value) {
          const offset = Number(dayjs(values.targetStartDate).diff(dayjs(values.targetEndDate), 'days')) - 1;
          setFieldValue('comparedStartDate', dayjs(values.targetStartDate).add(offset, 'days'));
          setFieldValue('comparedEndDate', dayjs(values.targetEndDate).add(offset, 'days'));
        }
        break;
      }
      case searchDateOptions[1].value: {
        setFieldValue('comparedStartDate', dayjs(values.targetStartDate).add(-1, 'year'));
        setFieldValue('comparedEndDate', dayjs(values.targetEndDate).add(-1, 'year'));
        break;
      }
      default: {
        break;
      }
    }
  }

  disabledStartDate = (pickedDate, endDate) => endDate.valueOf() < pickedDate.valueOf() || dayjs().valueOf() < pickedDate.valueOf();

  disabledEndDate = (pickedDate, startDate) => startDate.valueOf() < pickedDate.valueOf() || dayjs().valueOf() < pickedDate.valueOf();

renderForm = (props) => {
  const { values, setFieldValue } = props;
  console.log('values:', values);
  const {
    isCompared, targetStartDate, targetEndDate, comparedStartDate, comparedEndDate, searchType, compareSearchType,
  } = values;
  const isValid = isCompared ? (targetStartDate && targetEndDate && comparedStartDate && comparedEndDate) : (targetStartDate && targetEndDate);
  const DatePickerField = ({ ...field }) => {
    const {
      dateVal, name, disabledDate, disabled,
    } = field;
    return (
      <DatePicker
        locale={locale}
        defaultValue={dayjs(dateVal)}
        disabledDate={disabledDate}
        disabled={disabled}
        allowClear={false}
        className="date-picker"
        value={dayjs(dateVal)}
        onChange={(dateString) => {
          setFieldValue(name, dayjs(dateString).format());
        }}
      />
    );
  };
  return (
    <Form className="dsWrap">
      <div className="dsItem">
        <span>目標日期區間</span>
        <Select
          name="searchType"
          className="w100 ml-10"
          onChange={(element) => {
            this.onChangeTargetDate(element, setFieldValue);
            this.onChangeCompareSearchType(values.compareSearchType, element, values, setFieldValue);
          }}
        >
          {searchDateOptions.map(options => <Select.Option key={options.value} value={options.value}>{options.label}</Select.Option>)}
        </Select>
      </div>
      <div className="dsItem">
        <DatePickerField
          name="targetStartDate"
          dateVal={targetStartDate}
          disabledDate={pickedDate => this.disabledStartDate(pickedDate, targetEndDate)}
          disabled={searchType !== searchDateOptions[3].value}
        />
        <span>  ～</span>
        <DatePickerField
          name="targetEndDate"
          dateVal={targetEndDate}
          disabledDate={pickedDate => this.disabledEndDate(pickedDate, targetStartDate)}
          disabled={searchType !== searchDateOptions[3].value}
        />
      </div>
      <div className="dsItem">
        <Checkbox
          name="isCompared"
          onChange={() => {
            this.onChangeCompareSearchType(compareSearchType, searchType, values, setFieldValue);
            this.onChangeTargetDate(values.searchType, setFieldValue);
          }}
        >
          相較於
        </Checkbox>
        <Select
          name="compareSearchType"
          className="w150"
          onChange={(element) => {
            this.onChangeCompareSearchType(element, searchType, values, setFieldValue);
            this.onChangeTargetDate(values.searchType, setFieldValue);
          }}
          disabled={!isCompared}
        >
          {plansSearchTypeOptions.map(options => <Select.Option key={options.value} value={options.value}>{options.label}</Select.Option>)}
        </Select>
      </div>
      {
        isCompared
          ? (
            <div className="dsItem">
              <DatePickerField
                name="comparedStartDate"
                dateVal={comparedStartDate}
                disabledDate={pickedDate => this.disabledStartDate(pickedDate, comparedEndDate)}
                disabled
              />
              <span>  ～</span>
              <DatePickerField
                name="comparedEndDate"
                dateVal={comparedEndDate}
                disabledDate={pickedDate => this.disabledEndDate(pickedDate, comparedStartDate)}
                disabled
              />
            </div>
          )
          : null
      }
      <SubmitButton type="primary" disabled={!isValid}>查詢</SubmitButton>
      {/* <DebugFormik /> */}
    </Form>
  );
};

render() {
  const { onSubmitSearch } = this.props;
  const init = {
    searchType: 0,
    targetStartDate: dayjs(),
    targetEndDate: dayjs(),
    comparedStartDate: dayjs(),
    comparedEndDate: dayjs(),
    isCompared: false,
    compareSearchType: 0,
  };
  return (
    <Formik
      initialValues={init}
      onSubmit={onSubmitSearch}
    >
      { this.renderForm }
    </Formik>
  );
}
}

export default DateSearch;
