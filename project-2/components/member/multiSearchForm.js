import React, { Component, Fragment } from 'react';
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
import { DatePicker } from '../ui/days';
import { memberMultiSearchOptions } from '../../config/selectData';
// import { DisplayFormikState } from '../tools/debug';

class MultiSearchForm extends Component {
    state = {
      endOpen: false,
      trigger: false,
      startValue: dayjs().startOf('month'),
      endValue: dayjs().endOf('month'),
      monthStartValue: dayjs().startOf('month'),
      monthEndValue: dayjs().endOf('month')
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
      const { handleReset, values, setFieldValue } = props;
      let { times } = values;
      const tab = '\u2003\u2003\u2003\u2003\u2003\u2003\u2003';
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
            <label style={ { float: 'left' } }> 日期條件{tab} </label>
            <Radio.Group
              name={ memberMultiSearchOptions.name.dateType }
              options={ memberMultiSearchOptions.dateType }
            />
            <br />
          </div>
          <div style={ { position: 'relative' } }>
            <label style={ {
              position: 'absolute', float: 'left', left: '170px', top: '15px'
            } }
            >月份{tab}
            </label>
            <DatePicker
              locale={ locale }
              picker="month"
              style={ {
                position: 'absolute', float: 'left', left: '270px', top: '10px'
              } }
              name={ memberMultiSearchOptions.name.yearMonth }
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
            > 範圍{tab}
            </label>
            <DatePicker
              locale={ locale }
              style={ {
                position: 'absolute', float: 'left', left: '270px', top: '50px'
              } }
              name={ memberMultiSearchOptions.name.start }
              allowClear={ false }
              format={ dayFormat }
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
              name={ memberMultiSearchOptions.name.end }
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

          {/* 會員角色 */}
          <div style={ { marginTop: '50px', marginLeft: '10px' } }>
            <label style={ { float: 'left' } }> 會員角色{tab} </label>
            <Radio.Group
              name={ memberMultiSearchOptions.name.serviceStatus }
              options={ memberMultiSearchOptions.serviceStatus }
            />
            <br />
          </div>

          {/* 接案刊登狀態 */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 接案刊登狀態{'\u2003\u2003\u2003\u2003\u2003'} </label>
            <Radio.Group
              name={ memberMultiSearchOptions.name.onlineStatus }
              options={ memberMultiSearchOptions.onlineStatus }
            />
            <br />
          </div>

          {/* 黑名單 */}
          {/* <div style = { blockStyle }>
                    <label style = {{ float: "left" }}> 黑名單&emsp;{tab} </label>
                    <Radio.Group
                        name={memberMultiSearchOptions.name.blockStatus}
                        options={memberMultiSearchOptions.blockStatus}
                    />
                    <br />
                </div> */}

          {/* 高手會員 */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 高手會員{tab} </label>
            <Radio.Group
              name={ memberMultiSearchOptions.name.memberStatus }
              options={ memberMultiSearchOptions.memberStatus }
            />
            <br />
          </div>
          {/* 舊站會員 */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 舊站會員{tab} </label>
            <Radio.Group
              name={ memberMultiSearchOptions.name.oldSiteType }
              options={ memberMultiSearchOptions.oldSiteType }
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
      const searchList = this.props.multiSearchList;
      return (
        <Fragment>
          <h2> 多條件查詢 </h2>
          <Formik
            initialValues={ searchList }
            onSubmit={
            async (values, actions) => {
              const searchQuery = {
                ...values,
                times: {
                  yearMonth: dayjs(values.times.yearMonth).format('YYYY-MM'),
                  start: values.times.start ? dayjs(values.times.start).format('DD') : '',
                  end: values.times.end ? dayjs(values.times.end).format('DD') : ''
                }
              };
              console.log('searchQuery:', searchQuery);
              await this.props.getMemberMultiSearch(searchQuery);
              actions.setSubmitting(false);
            } }
          >
            { this.renderForm }
          </Formik>
        </Fragment>
      );
    }
}

export default MultiSearchForm;
