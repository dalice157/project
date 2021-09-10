import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Select, Input, SubmitButton
} from 'formik-antd';
import { Formik, } from 'formik';
import { toolList } from '../../config/selectData.js';

const Option = Select.Option;

class SingleSearchForm extends Component {
    state = {
      keyType: '代碼',
    }

    /**
     * onSubmit是打api
     */
    handelSubmit = async (values, { setSubmitting }) => {
      console.log('values:', values);
      // await onSubmit(values.type, values.key);
      setSubmitting(false);
    }

    render() {
      const initVal = {
        type: 0
      };
      return (
        <>
          <Formik
            initialValues={ initVal }
              // validationSchema={ formSchema }
            onSubmit={ this.handelSubmit }
          >
            { () => (
              <Form className="single">
                <h2>單一條件查詢</h2>
                <Select name="type" style={ { width: 150 } }>
                  { toolList.map(item => (
                    <Option key={ item.value } value={ item.value }>
                      { item.label }
                    </Option>
                  )) }
                </Select>
                <Input
                  name="key"
                  placeholder="請輸入"
                  style={ {
                    width: 200, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, marginLeft: 8
                  } }
                />
                <SubmitButton style={ { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } }>送出</SubmitButton>
              </Form>
            ) }
          </Formik>
        </>
      );
    }
}

const mapDispatchToProps = {

};

export default connect(null, mapDispatchToProps)(SingleSearchForm);
