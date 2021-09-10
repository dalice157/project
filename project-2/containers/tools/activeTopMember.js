import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Modal } from 'antd';
import { generateDemanderBasic } from '../../actions/member.js';
import ActiveTopMemberForm from '../../components/tools/activeTopMemberForm.js';


class ActiveTopMember extends Component {
    handleFormSubmit = async (data, { setSubmitting }) => {
      try {
        const result = await this.props.generateDemanderBasic(data);
        this.handleActiveStatus(result.payload);
      } catch (error) {
        console.log(error);
      }
      setSubmitting(false);
    }

    handleActiveStatus = (resp) => {
      const { basicId, message } = resp.data;
      switch (message) {
        case 'notAcMember':
          Modal.error({
            title: '非AC會員，不可啟用高手產品服務',
            okText: '關閉提示'
          });
          break;
        case 'errorPid':
          Modal.error({
            title: '請確認輸入的PID格式，應為半形數字!',
            okText: '關閉'
          });
          break;
        case 'alreadyActived':
          Modal.warning({
            title: '該會員已啟用高手產品服務！'
          });
          break;
        case 'generateBasicSuccess':
        case 'activeAcTopSuccess':
          Modal.success({
            title: <Fragment><p>已成功啟用高手產品服務<br />請繼續建立完整會員資料</p></Fragment>,
            okText: '前往會員資料頁',
            onOk: () => this.directToBasic(basicId)
          });
          break;
        default:
          break;
      }
    }

    directToBasic = (basicId) => {
      window.location.href = `/admin/member/${basicId}?tabs=basic`;
    }

    render() {
      return (
        <Fragment>
          <Breadcrumb style={ { margin: '16px 0' } }>
            <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>啟用高手產品服務</Breadcrumb.Item>
          </Breadcrumb>
          <ActiveTopMemberForm
            onSubmit={ this.handleFormSubmit }
          />
        </Fragment>
      );
    }
}

const mapDispatchToProps = {
  generateDemanderBasic,
};

export default connect(null, mapDispatchToProps)(ActiveTopMember);
