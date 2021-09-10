import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import {
  Radio,
  SubmitButton,
  Form
} from 'formik-antd';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../components/ui/days';
import { toolMultiSearchOptions } from '../../config/selectData';

class MultiSearchForm extends Component {
  state = {
    endOpen: false,
    trigger: false,
    startValue: dayjs().startOf('month'),
    endValue: dayjs().endOf('month'),
    monthStartValue: dayjs().startOf('month'),
    monthEndValue: dayjs().endOf('month'),
    multiSearchList: {
      dateType: 0,
      times: {
        yearMonth: dayjs(),
        start: null,
        end: null
      },
      bindingMethod: 0,
      redemptionStatus: 0,
    }
  };

  /**
   * onSubmit是打api
   */
  handelSubmit = async (values, { setSubmitting }) => {
    console.log('values:', values);
    // await onSubmit(values.type, values.key);
    setSubmitting(false);
  }

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
    const { handleReset, values, setFieldValue } = props;
    let { times } = values;
    const monthFormat = 'YYYY-MM';
    const dayFormat = 'MM-DD';

    const blockStyle = {
      margin: '10px 10px'
    };

    let isValid = times.yearMonth !== '' && times.yearMonth !== null;
    return (
      <Form>
        {/* 日期選擇 */}
        <div style={ blockStyle }>
          <label style={ { float: 'left' } }> 日期條件{'\u2003\u2003\u2003\u2003\u2003'}</label>
          <Radio.Group
            name={ toolMultiSearchOptions.name.dateType }
            options={ toolMultiSearchOptions.dateType }
          />
          <br />
        </div>
        <div style={ { position: 'relative' } }>
          <label style={ {
            position: 'absolute', float: 'left', left: '170px', top: '15px'
          } }
          >月份
          </label>
          <DatePicker
            locale={ locale }
            picker="month"
            style={ {
              position: 'absolute', float: 'left', left: '270px', top: '10px'
            } }
            name={ toolMultiSearchOptions.name.yearMonth }
            format={ monthFormat }
            allowClear={ false }
            placeholder="請選擇月份"
            value={ dayjs(times.yearMonth) }
            onChange={ (value) => {
              setFieldValue('times.yearMonth', dayjs(value));
              setFieldValue('times.start', null);
              setFieldValue('times.end', null);
              this.setState({
                monthStartValue: dayjs(value).startOf('month'),
                monthEndValue: dayjs(value).clone().endOf('month')
              });
            } }
          />
          <br />
          <label style={ {
            position: 'absolute', float: 'left', left: '170px', top: '55px'
          } }
          > 範圍
          </label>
          <DatePicker
            locale={ locale }
            style={ {
              position: 'absolute', float: 'left', left: '270px', top: '50px'
            } }
            format={ dayFormat }
            allowClear={ false }
            name={ toolMultiSearchOptions.name.start }
            placeholder="開始日期"
            disabledDate={ this.disabledStartDate }
            value={ times.start !== null ? dayjs(times.start) : '' }
            onOpenChange={ (open) => {
              if (times.start === null) {
                setFieldValue('times.start', dayjs(times.yearMonth).startOf('month'));
              }
              if (times.end === null) {
                setFieldValue('times.end', dayjs(times.yearMonth).endOf('month'));
              }
              const trigger = this.state.trigger;
              this.setState({ trigger: !trigger });
              if (!open) {
                this.setState({ endOpen: true });
              }
            } }
            onChange={ (value) => {
              setFieldValue('times.start', dayjs(value));
              this.setState({ startValue: value });
              if (value === null) {
                setFieldValue('times.end', null);
              }
            } }
          />
          <DatePicker
            locale={ locale }
            style={ {
              position: 'absolute', float: 'left', left: '470px', top: '50px'
            } }
            format={ dayFormat }
            name={ toolMultiSearchOptions.name.end }
            allowClear={ false }
            placeholder="結束日期"
            disabledDate={ this.disabledEndDate }
            value={ times.end !== null ? dayjs(times.end) : '' }
            open={ this.state.endOpen }
            onOpenChange={ (open) => {
              if (!open) {
                this.setState({ endOpen: open });
              }
            } }
            onChange={ (value) => {
              this.setState({ endValue: value });
              setFieldValue('times.end', dayjs(value));
              if (value === null) {
                setFieldValue('times.start', null);
              }
            } }
          />
          <br />
        </div>

        {/* 綁定方式 */}
        <div style={ { marginTop: '50px', marginLeft: '10px' } }>
          <label style={ { float: 'left' } }> 綁定方式{'\u2003\u2003\u2003\u2003\u2003'}</label>
          <Radio.Group
            name={ toolMultiSearchOptions.name.bindingMethod }
            options={ toolMultiSearchOptions.bindingMethod }
          />
          <br />
        </div>

        {/* 兌換狀態 */}
        <div style={ blockStyle }>
          <label style={ { float: 'left' } }> 兌換狀態{'\u2003\u2003\u2003\u2003\u2003'} </label>
          <Radio.Group
            name={ toolMultiSearchOptions.name.redemptionStatus }
            options={ toolMultiSearchOptions.redemptionStatus }
          />
          <br />
        </div>

        <div style={ { textAlign: 'center' } }>
          <SubmitButton type="primary" disabled={ !isValid } style={ blockStyle }>查詢</SubmitButton>
          <Button type="button" className="outline" onClick={ handleReset } style={ blockStyle }> 重置 </Button>
        </div>
        {/* debug mode */}
        {/* <DisplayFormikState {...props} /> */}
      </Form>
    );
  }

  render() {
    return (
      <Fragment>
        <h2> 多條件查詢 </h2>
        <Formik
          initialValues={ this.state.multiSearchList }
          onSubmit={ this.handelSubmit }
        >
          { this.renderForm }
        </Formik>
      </Fragment>
    );
  }
}

const mapDispatchToProps = {

};

export default connect(null, mapDispatchToProps)(MultiSearchForm);
