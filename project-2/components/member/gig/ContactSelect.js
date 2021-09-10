import React, { PureComponent } from 'react';
import './ContactSelect.scss';
import {
  Select, Radio, Form
} from 'formik-antd';
import { Formik } from 'formik';
import { demandContactType } from '../../../config/selectData.js';
// import { DebugFormik } from '../tools/DebugFormik';

class ContactSelect extends PureComponent {
  renderForm = () => {
    const { durations, submitContact, onChangeContactType } = this.props;
    return (
      <Form>
        <Radio.Group className="type" name="contactType" options={ demandContactType } onChange={ onChangeContactType } />
        <Select className="duration" name="selectedDuration" options={ durations } onChange={ submitContact }>
          {durations.map(duration => <Select.Option key={ duration.value } value={ duration.value }>{duration.label}</Select.Option>)}
        </Select>
        {/* <DebugFormik /> */}
      </Form>
    );
  };

  render() {
    const { contactType, selectedDuration } = this.props;
    const initialData = {
      contactType: contactType,
      selectedDuration: selectedDuration,
    };
    return (
      <Formik
        initialValues={ initialData }
        enableReinitialize
      >
        { this.renderForm }
      </Formik>
    );
  }
}

export default ContactSelect;
