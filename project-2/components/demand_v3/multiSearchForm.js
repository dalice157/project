import React, { Component } from 'react';
import { Button } from 'antd';
import {
  Radio,
  SubmitButton,
  Select,
  Form,
} from 'formik-antd';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../ui/days';
import { validateMultiSearchData } from '../common/Validates';
import { demandMultiSearchOptions } from '../../config/selectData';
import { getCatNoByTitle, getCategoriesByNo } from '../../util/lablesUtils';
// import { DisplayFormikState } from '../tools/debug';

class MultiSearchForm extends Component {
    state = {
      endOpen: false,
      trigger: false,
      startValue: dayjs().startOf('month'),
      endValue: dayjs().endOf('month'),
      monthStartValue: dayjs().startOf('month'),
      monthEndValue: dayjs().endOf('month'),
    };

    // type can be 1. all, 2. tutor
    isCategoryTypeEqual = (categoryNo, subCategoryNo, type) => {
      const size = type === 'all' ? 1 : 4;
      return categoryNo.toString().substring(0, size) === subCategoryNo.toString().substring(0, size);
    };

    disabledStartDate = (pickedDate) => {
      const { endValue, monthStartValue, monthEndValue } = this.state;

      if (!pickedDate || !endValue) {
        return false;
      }
      return pickedDate.valueOf() < monthStartValue.valueOf() || pickedDate.valueOf() > monthEndValue.valueOf();
    };

    disabledEndDate = (pickedDate) => {
      const { startValue, monthEndValue, monthStartValue } = this.state;
      if (!pickedDate || !startValue) {
        return false;
      }
      return pickedDate.valueOf() < monthStartValue.valueOf() || pickedDate.valueOf() > monthEndValue.valueOf();
    };

    renderForm = (props) => {
      const { handleReset, setFieldValue, values } = props;
      const { times, demandOptions } = values;
      const tab = '\u2003\u2003\u2003\u2003\u2003\u2003\u2003';
      const monthFormat = 'YYYY-MM';
      const dayFormat = 'MM-DD';

      const allOptions = getCategoriesByNo();
      const tutorOptions = getCategoriesByNo(demandOptions.allOptions);
      const partnerOptions = getCategoriesByNo(demandOptions.tutorOptions);

      const blockStyle = {
        margin: '10px 10px',
      };

      const errorStyle = {
        color: 'red',
        marginTop: '2px',
        position: 'relative',
        display: 'inline',
      };

      // 選單小項和中項不同則清空
      if (!this.isCategoryTypeEqual(demandOptions.tutorOptions, demandOptions.partnerOptions, 'tutor')) {
        if (demandOptions.tutorOptions === '請選擇中項') {
          demandOptions.partnerOptions = '';
        } else if (demandOptions.allOptions === '家教技能' || demandOptions.allOptions === '1000000') {
          demandOptions.partnerOptions = '請選擇小項';
        }
      }

      // 選單中項和大項不同則清空（先清小項再清大項）
      if (!this.isCategoryTypeEqual(demandOptions.allOptions, demandOptions.tutorOptions, 'all')) {
        if (demandOptions.allOptions === '全部' || demandOptions.allOptions === '0') {
          demandOptions.tutorOptions = '';
          demandOptions.partnerOptions = '';
        } else {
          demandOptions.tutorOptions = '請選擇中項';
          demandOptions.partnerOptions = '';
        }
      }


      // 針對選單賦予值
      if (demandOptions.partnerOptions !== '' && demandOptions.partnerOptions !== '請選擇小項') {
        demandOptions.demandType = demandOptions.partnerOptions;
      } else if (demandOptions.tutorOptions !== '' && demandOptions.tutorOptions !== '請選擇中項') {
        demandOptions.demandType = demandOptions.tutorOptions;
      } else {
        demandOptions.demandType = demandOptions.allOptions;
      }

      const isValid = times.yearMonth !== '' && times.yearMonth !== null && demandOptions.demandType !== '-1';
      return (
        <Form>
          {/* 日期選擇 */}
          <div style={blockStyle}>
            <label style={{ float: 'left' }}>
              {' '}
              日期條件
              {tab}
              {' '}
            </label>
            <Radio.Group
              name="dateType"
              options={demandMultiSearchOptions.dateType}
            />
            <br />
          </div>
          <div style={{ position: 'relative' }}>
            <label style={{
              position: 'absolute', float: 'left', left: '170px', top: '15px',
            }}
            >
              月份
              {tab}
            </label>
            <DatePicker
              locale={locale}
              picker="month"
              style={{
                position: 'absolute', float: 'left', left: '270px', top: '10px',
              }}
              name="times.yearMonth"
              format={monthFormat}
              allowClear={false}
              placeholder="請選擇月份"
              value={dayjs(times.yearMonth)}
              onChange={(value) => {
                setFieldValue('times.yearMonth', dayjs(value));
                setFieldValue('times.start', null);
                setFieldValue('times.end', null);
                this.setState({
                  monthStartValue: dayjs(value).startOf('month'),
                  monthEndValue: dayjs(value).endOf('month'),
                });
              }}
            />
            <br />
            <label style={{
              position: 'absolute', float: 'left', left: '170px', top: '55px',
            }}
            >
              {' '}
              範圍
              {tab}
            </label>
            <DatePicker
              locale={locale}
              style={{
                position: 'absolute', float: 'left', left: '270px', top: '50px',
              }}
              name="times.start"
              allowClear={false}
              format={dayFormat}
              placeholder="開始日期"
              disabledDate={this.disabledStartDate}
              value={times.start !== null ? dayjs(times.start) : ''}
              onOpenChange={(open) => {
                if (times.start === null) {
                  setFieldValue('times.start', dayjs(times.yearMonth).startOf('month'));
                }
                if (times.end === null) {
                  setFieldValue('times.end', dayjs(times.yearMonth).endOf('month'));
                }
                const { trigger } = this.state;
                this.setState({ trigger: !trigger });
                if (!open) {
                  this.setState({ endOpen: true });
                }
              }}
              onChange={(value) => {
                setFieldValue('times.start', dayjs(value));
                this.setState({ startValue: value });
                if (value === null) {
                  setFieldValue('times.end', null);
                }
              }}
            />
            <DatePicker
              locale={locale}
              style={{
                position: 'absolute', float: 'left', left: '470px', top: '50px',
              }}
              format={dayFormat}
              allowClear={false}
              name="times.end"
              placeholder="結束日期"
              disabledDate={this.disabledEndDate}
              value={times.end !== null ? dayjs(times.end) : ''}
              open={this.state.endOpen}
              onOpenChange={(open) => {
                if (!open) {
                  this.setState({ endOpen: open });
                }
              }}
              onChange={(value) => {
                this.setState({ endValue: value });
                setFieldValue('times.end', dayjs(value));
                if (value === null) {
                  setFieldValue('times.start', null);
                }
              }}
            />
            <br />
          </div>

          {/* 案件類別 - allOptions -> tutorOptions -> partnerOptions */}
          <div style={{ marginTop: '50px', marginLeft: '10px' }}>
            <label style={{ float: 'left' }}>
              {' '}
              案件類別
              {tab}
              {' '}
            </label>
            {/* 全部的選單 */}
            <Select
              defaultValue={allOptions[0]}
              name="demandOptions.allOptions"
              style={{ width: 150, margin: 'auto 10px' }}
            >
              { allOptions.map(option => <Select.Option key={getCatNoByTitle(option)}>{option}</Select.Option>) }
            </Select>

            {/* 家教類別 */}
            <Select
              defaultValue={tutorOptions[0]}
              name="demandOptions.tutorOptions"
              style={{ width: 150, margin: 'auto 10px' }}
            >
              { tutorOptions.map(option => <Select.Option key={getCatNoByTitle(option)}>{option}</Select.Option>) }
            </Select>

            {/* 保姆選單 */}
            <Select
              defaultValue={partnerOptions[0]}
              name="demandOptions.partnerOptions"
              style={{ width: 150, margin: 'auto 10px' }}
            >
              { partnerOptions.map(option => <Select.Option key={getCatNoByTitle(option)}>{option}</Select.Option>) }
            </Select>
            { demandOptions.demandType === '' ? <span style={errorStyle}>類別資料錯誤，請檢查資料或重新整理</span> : <></> }
            <br />
          </div>

          {/* 刊登狀態 */}
          <div style={{ display: 'flex', marginLeft: '10px', marginTop: '10px' }}>
            <label style={{ float: 'left', width: '155px' }}>
              {' '}
              刊登狀態
              {tab}
              {' '}
            </label>
            <Radio.Group
              name="onlineStatus"
              options={demandMultiSearchOptions.onlineStatus}
            />
            <br />
          </div>

          {/* 押金狀態 */}
          <div style={blockStyle}>
            <label style={{ float: 'left' }}>
              {' '}
              押金狀態
              {tab}
              {' '}
            </label>
            <Radio.Group
              name="depositStatus"
              options={demandMultiSearchOptions.depositStatus}
            />
            <br />
          </div>

          {/* 檢舉狀態 - 暫時拿掉 */}
          {/* <div style = { blockStyle }>
                    <label style = {{ float: "left" }}> 檢舉狀態{tab} </label>
                    <Radio.Group
                        name="violationStatus"
                        options={demandMultiSearchOptions.violationStatus}
                    />
                    <br />
                </div> */}

          <div style={{ textAlign: 'center' }}>
            <SubmitButton type="primary" disabled={!isValid} style={blockStyle}>查詢</SubmitButton>
            <Button type="button" className="outline" onClick={handleReset} style={blockStyle}> 重置 </Button>
          </div>
          {/* debug mode */}
          {/* <DisplayFormikState {...props} /> */}
        </Form>
      );
    }

    render() {
      const searchList = this.props.multiSearchList;
      const { nextKey } = this.props;
      console.log('searchList:', searchList);
      return (
        <>
          <h2> 多條件查詢 </h2>
          <Formik
            initialValues={searchList}
            onSubmit={
              async (values, actions) => {
                const searchQuery = {
                  ...values,
                  times: {
                    yearMonth: dayjs(values.times.yearMonth).format('YYYY-MM'),
                    start: values.times.start ? dayjs(values.times.start).format('DD') : '',
                    end: values.times.end ? dayjs(values.times.end).format('DD') : '',
                  },
                };
                console.log('searchQuery:', searchQuery);
                await this.props.getDemandMultiSearch(searchQuery, nextKey);
                actions.setSubmitting(false);
              }}
            validationSchema={validateMultiSearchData}
          >
            { this.renderForm }
          </Formik>
        </>
      );
    }
}

export default MultiSearchForm;
