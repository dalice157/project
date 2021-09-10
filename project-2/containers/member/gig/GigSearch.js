import React, { Component } from 'react';
import {
  Form, Select, Input, SubmitButton
} from 'formik-antd';
import { Formik, } from 'formik';
import GigSearchShow from './GigSearchShow';
import { searchOpts } from '../../../config/selectData';

import './gig.scss';

const Option = Select.Option;

class GigSearch extends Component {
  state = {
    keyType: '聯絡人手機',
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
    const dottedLine = <><br /><hr style={ { border: '1px dashed #DDDDDD' } } /><br /></>;
    const initVal = {
      type: 1
    };
    return (
      <>
        {dottedLine}
        <h2 className="title">查閱聯絡資料線下溝通案件</h2>
        <p className="psText">有查閱聯絡資料紀錄，但未進入溝通中的案件</p>
        <Formik
          initialValues={ initVal }
          // validationSchema={ formSchema }
          onSubmit={ this.handelSubmit }
        >
          { () => (
            <Form className="single">
              <Select name="type" style={ { width: 150 } }>
                { searchOpts.map(item => (
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
        <GigSearchShow basicId={ this.props.basicId } />
      </>
    );
  }
}

export default GigSearch;
