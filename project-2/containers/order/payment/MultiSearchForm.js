import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import {
  Radio,
  SubmitButton,
  Form,
} from 'formik-antd';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../../components/ui/days';
import { orderGroup } from '../../../config/selectData';
import { getMultiPaymentList } from '../../../actions/order';

class MultiSearchForm extends Component {
    state = {
      endOpen: false,
      trigger: false,
      startValue: dayjs().startOf('month'),
      endValue: dayjs().endOf('month'),
      monthStartValue: dayjs().startOf('month'),
      monthEndValue: dayjs().endOf('month'),
    };

    onSubmit = async (values, { setSubmitting }) => {
      const searchList = {
        ...values,
        times: {
          yearMonth: dayjs(values.times.yearMonth).format('YYYY-MM'),
          start: values.times.start ? dayjs(values.times.start).format('DD') : '',
          end: values.times.end ? dayjs(values.times.end).format('DD') : '',
        },
      };
      this.props.updateSearchOptions(searchList, 'multi');
      await this.props.getMultiPaymentList(searchList);
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
      console.log('values:', values);
      const { times } = values;
      const monthFormat = 'YYYY-MM';
      const dayFormat = 'MM-DD';
      const mtStyle = {
        marginTop: '10px',
      };
      const mrStyle = {
        marginRight: '20px',
      };

      const isValid = times.yearMonth !== '' && times.yearMonth !== null;
      const {
        name, dateTypeObj, paymentTypeObj, paymentStatusObj, orderStatusObj, purchaseProducts,
      } = orderGroup;
      return (
        <Form>
          {/* 日期選擇 */}
          <div>
            <label style={mrStyle}> 日期條件 </label>
            <Radio.Group
              name={name.dateType}
              options={dateTypeObj}
            />
            <br />
          </div>
          <div style={mtStyle}>
            <label style={mrStyle}>
              月份
            </label>
            <DatePicker
              locale={locale}
              picker="month"
              name={name.yearMonth}
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
                  monthEndValue: dayjs(value).clone().endOf('month'),
                });
              }}
            />
          </div>
          <div style={mtStyle}>
            <label style={mrStyle}>
              {' '}
              範圍
            </label>
            <DatePicker
              locale={locale}
              style={{ marginRight: '10px' }}
              format={dayFormat}
              name={name.start}
              allowClear={false}
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
              format={dayFormat}
              name={name.end}
              allowClear={false}
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
          </div>

          {/* 付款方式 */}
          <div style={mtStyle}>
            <label style={mrStyle}> 付款方式 </label>
            <Radio.Group
              name={name.paymentType}
              options={paymentTypeObj}
            />
            <br />
          </div>

          {/* 付款狀態 */}
          <div style={mtStyle}>
            <label style={mrStyle}> 付款狀態 </label>
            <Radio.Group
              name={name.paymentStatus}
              options={paymentStatusObj}
            />
            <br />
          </div>
          {/* 訂單狀態 */}
          <div style={mtStyle}>
            <label style={mrStyle}> 訂單狀態 </label>
            <Radio.Group
              name={name.orderStatus}
              options={orderStatusObj}
            />
            <br />
          </div>
          {/* 購買方案 */}
          <div style={mtStyle}>
            <label style={mrStyle}> 購買方案 </label>
            <Radio.Group
              name={name.purchaseProduct}
              options={purchaseProducts}
            />
            <br />
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <SubmitButton type="primary" disabled={!isValid} style={mrStyle}>查詢</SubmitButton>
            <Button type="button" className="outline" onClick={handleReset}> 重置 </Button>
          </div>
        </Form>
      );
    }

    render() {
      const { searchList } = this.props;
      return (
        <>
          <h2> 多條件查詢 </h2>
          <Formik
            initialValues={searchList}
            onSubmit={this.onSubmit}
          >
            { this.renderForm }
          </Formik>
        </>
      );
    }
}

const mapDispatchToProps = {
  getMultiPaymentList,
};

export default connect(null, mapDispatchToProps)(MultiSearchForm);
