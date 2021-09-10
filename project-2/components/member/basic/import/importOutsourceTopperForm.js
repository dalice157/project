import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import { TextField, TextAreaField } from 'redux-form-antd';
import { Button, Card } from 'antd';

const required = value => (value ? undefined : '請輸入必填欄位');
class ImportOutsourceTopperForm extends Component {
  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <Fragment><br />
        <Card>
          <form onSubmit={ handleSubmit }>
            <div>
              <h3><b>外包網建立接案預備會員</b></h3>
              <p style={ { color: '#979797' } }>輸入會員PID，以半形逗點 "," 隔開 ex:123456,654321</p>
              <Field name="pidList" component={ TextAreaField } rows={ 6 } validate={ required } />
              <Field name="importSource" component={ TextField } type="hidden" />
            </div>
            <Button htmlType="submit" type="primary" disabled={ submitting }>建立接案會員</Button>
          </form>
        </Card>
      </Fragment>
    );
  }
}

export default reduxForm({
  form: 'ImportOutsourceTopperForm', // a unique name for this form
  enableReinitialize: true,
})(ImportOutsourceTopperForm);
