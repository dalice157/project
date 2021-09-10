import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Breadcrumb, Button, Input } from 'antd';
import { TextField, customMap, createComponent } from 'redux-form-antd';

import { login } from '../../actions/common.js';

function mapFunction(mapProps, { input: { onChange } }) {
  return {
    ...mapProps,
    onChange: event => onChange(event.nativeEvent.target.value)
  };
}
const textFieldMap = customMap(mapFunction);

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><a href="/admin/">Home</a></Breadcrumb.Item>
        </Breadcrumb>
        { this.props.user.id
          && <span>this is content</span>
        }
        { !this.props.user.id
          && (
          <form onSubmit={ this.props.handleSubmit }>
            <div>
              <label>操作人員登入</label>
            </div>
            <div>
              帳號:<Field name="id" component={ TextField } />
            </div>
            <div>
              密碼:<Field name="pwd" component={ createComponent(Input.Password, textFieldMap) } />
            </div>

            <div className="accountGroup">
              <div className="buttonArea">
                <Button htmlType="submit" type="primary" disabled={ this.props.submitting }>送出</Button>
              </div>
            </div>
          </form>
          )
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  onSubmit: login
};

const MyForm = reduxForm({
  form: 'loginForm'
})(Home);

export default connect(mapStateToProps, mapDispatchToProps)(MyForm);
