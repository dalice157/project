import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmitButton, Form } from 'formik-antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { Formik } from 'formik';
import { DatePicker } from '../../../components/ui/days';
import { dailyOrCurrentFormat } from '../../../util/formatUtil.js';
import {
  loadHistory, loadGigQuotation, loadGigContacts, loadGigClosed, loadCooperatedRecord, loadInvitedRecord,
} from '../../../actions/member.js';

import './gig.scss';

class GigDate extends Component {
  state = {
    isopen: false,
    time: dailyOrCurrentFormat('current', 'YYYY'),
  }

  componentDidMount() {
    const { basicId, getType, getYear } = this.props;
    const { time } = this.state;
    const yearVal = time;
    const pageType = {
      history: this.props.loadHistory,
      quotation: this.props.loadGigQuotation,
      contact: this.props.loadGigContacts,
      closed: this.props.loadGigClosed,
      accept: this.props.loadCooperatedRecord,
      invitation: this.props.loadInvitedRecord,
      none: () => {},
    };
    pageType[getType](basicId, '', yearVal);
    getYear(yearVal);
  }

  handelSubmit = async (values, { setSubmitting }) => {
    const { basicId, getType, getYear } = this.props;
    const year = values.yearMonth;
    const pageType = {
      history: this.props.loadHistory,
      quotation: this.props.loadGigQuotation,
      loadGigContacts: this.props.loadGigContacts,
      closed: this.props.loadGigClosed,
      accept: this.props.loadCooperatedRecord,
      invitation: this.props.loadInvitedRecord,
      none: () => {},
    };
    getYear(year);
    await pageType[getType](basicId, '', dailyOrCurrentFormat(year, 'YYYY'));
    setSubmitting(false);
  }

  handelOpenChange = (status) => {
    if (status) {
      this.setState({ isopen: true });
    } else {
      this.setState({ isopen: false });
    }
  }

  handelPanelChange = (props, val) => {
    const { setFieldValue } = props;
    setFieldValue('yearMonth', dayjs(val));
    this.setState({
      time: val,
      isopen: false,
    });
  }

  handelChange = () => {
    this.setState({ time: null });
  }

  render() {
    const { isopen } = this.state;
    return (
      <Formik
        initialValues={{
          yearMonth: dayjs(),
        }}
        onSubmit={this.handelSubmit}
      >
        { props => (
          <Form>
            <DatePicker
              locale={locale}
              picker="year"
              name="yearMonth"
              format="YYYY"
              allowClear={false}
              placeholder="請選擇年份"
              value={dayjs(props.values.yearMonth)}
              open={isopen}
              onOpenChange={this.handelOpenChange}
              onPanelChange={value => this.handelPanelChange(props, value)}
              onChange={this.handelChange}
            />
            <SubmitButton type="primary">送出</SubmitButton>
          </Form>
        ) }
      </Formik>
    );
  }
}

const mapDispatchToProps = {
  loadHistory,
  loadGigQuotation,
  loadGigContacts,
  loadGigClosed,
  loadCooperatedRecord,
  loadInvitedRecord,
};

export default connect(null, mapDispatchToProps)(GigDate);
