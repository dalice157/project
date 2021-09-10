import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Breadcrumb } from 'antd';
import { formValueSelector } from 'redux-form';

import ViolationContent from '../../components/violation/violationContent.js';
import ViolationMemoForm from '../../components/violation/violationMemoForm.js';
import { queryViolation, memoFormSubmit } from '../../actions/violation.js';

class Content extends Component {
    onClick = () => {
      window.close();
    }

    render() {
      // console.log('this.props', this.props);
      const { violation, user } = this.props;
      const initData = {
        yyyyMM: violation.yyyyMM,
        recordId: violation.recordId,
        staff: user.id,
        receiptTitle: violation.targetName,
        carrierType: '1',
        hostingHandleStatus: violation.causeType === 6 ? (violation.hasHostingMoney ? '3' : '2') : '1',
      };

      return (
        <Fragment>
          <Breadcrumb style={ { margin: '16px 0' } }>
            <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>檢舉案件管理</Breadcrumb.Item>
            <Breadcrumb.Item>檢舉案件內容頁</Breadcrumb.Item>
          </Breadcrumb>
          <hr />
          <ViolationContent violation={ this.props.violation } />
          {violation.handleStatus < 2
                    && (
                    <ViolationMemoForm
                      violation={ this.props.violation }
                      onSubmit={ this.props.memoFormSubmit }
                      initialValues={ initData }
                      handleFormValue={ this.props.handleFormValue }
                    />
                    )}
          {violation.handleStatus === 2
                    && <div><br /><Button type="close" onClick={ this.onClick }>關閉回列表</Button></div>}
        </Fragment>
      );
    }

    componentDidMount() {
      // console.log(this.props)
      const { yyyyMM, recordId } = this.props.location.query;
      this.props.load(yyyyMM, recordId);
    }
}


const mapStateToProps = (state) => {
  // console.log('state', state);
  const selectorForm = formValueSelector('ViolationMemoForm');
  const { staffHandleStatus, hostingHandleStatus, carrierType } = selectorForm(state, 'staffHandleStatus', 'hostingHandleStatus', 'carrierType');

  return {
    violation: state.violation.violation,
    user: state.user,
    handleFormValue: {
      staffHandleStatus: staffHandleStatus,
      hostingHandleStatus: hostingHandleStatus,
      carrierType: carrierType
    },
  };
};

const mapDispatchToProps = {
  load: queryViolation,
  memoFormSubmit,
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
