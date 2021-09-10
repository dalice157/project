import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import config from '../../config/config';
import { acDeleteProcess } from '../../actions/member.js';
import { email2pid, clean } from '../../actions/setting.js';
import AcManualForm from '../../components/tools/acManualForm.js';
import AcQueryPid from '../../components/tools/acQueryPid.js';

const AC_MANAGER_URL = config.acManagerUrl;

class Default extends Component {
  componentDidMount() {
    this.props.clean();
  }

    onAcDeleteProcess = async (data, { setSubmitting }) => {
      const result = await this.props.loadAcDeleteProcess(data.pid, true);
      if (result.payload && result.payload.success) {
        let token = result.payload.data.token;
        window.open(AC_MANAGER_URL + '/delete?token=' + token);
      }
      setSubmitting(false);
    }

    render() {
      return (
        <Fragment>
          <Breadcrumb style={ { margin: '16px 0' } }>
            <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>AC啟用暨刪除查詢</Breadcrumb.Item>
          </Breadcrumb>
          <AcQueryPid
            onSubmit={ async (data, { setSubmitting }) => { await this.props.changeEmail2pid(data.email); setSubmitting(false); } }
            list={ this.props.list }
          />
          <AcManualForm
            onSubmit={ this.onAcDeleteProcess }
          />
        </Fragment>
      );
    }
}

const mapStateToProps = state => ({
  list: state.setting.pidList
});

const mapDispatchToProps = {
  loadAcDeleteProcess: acDeleteProcess,
  changeEmail2pid: email2pid,
  clean
};

export default connect(mapStateToProps, mapDispatchToProps)(Default);
