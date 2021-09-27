import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { Breadcrumb, Spin, Modal } from 'antd';
import moment from 'moment';
import { acDateFormat } from '../../config/constant';
import { catSearch } from '../../util/categoryUtils';
import { validateCaseUser } from '../../components/common_v2/Validates';
import CaseUserRenderForm from '../../components/demand_v3/CaseUserRenderForm';
import TerminateModal from '../../components/terminateModal';
import { loadStaticArea, loadStaticIndust } from '../../actions/common';
import { getFormDefault, saveTopForm } from '../../actions/basic';
import styles from './EnableCaseUser.scss';


const { confirm } = Modal;
class EnableCaseUser extends Component {
  state = {
    loading: false
  };

  async componentDidMount() {
    await this.props.loadStaticArea();
    await this.props.loadStaticIndust();
    this.setState({
      loading: true
    });
    await this.props.getFormDefault().then(() => {
      this.setState({
        loading: false
      });
    });
  }


  onBackPage = () => {
    confirm({
      title: '您確認要取消啟用高手的資料編輯嗎?',
      content: '若您點選「確認」，則會將您已填寫的資料皆清空將不會儲存。',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        location.href = '/api/dispatch';
      },
    });
  }

  onEnableCaseSubmit = (values, actions) => {
    const {
      address, birthday, cellphone, chosenRole, companyName, email, employeeCount, identity, identityType, industry, invoice, jobTitle, postNum, roleType, sex, tel, telArea
    } = values;
    const { isSubscribeEdm304, isSubscribeEdm305 } = values;
    let subscribeEpaperId = [];
    let unSubscribeEpaperId = [];
    if (isSubscribeEdm304) {
      subscribeEpaperId.push(304);
    } else {
      unSubscribeEpaperId.push(304);
    }
    if (isSubscribeEdm305) {
      subscribeEpaperId.push(305);
    } else {
      unSubscribeEpaperId.push(305);
    }
    const { familyName, firstName } = this.props.enableForm;
    const inputTopForm = {
      address: address,
      birthday: moment(birthday, acDateFormat).format(acDateFormat),
      cellphone: cellphone,
      chosenRole: chosenRole,
      companyName: companyName,
      emailInfo: {
        email: email,
      },
      employeeCount: Number(employeeCount) || 0,
      familyName: familyName,
      firstName: firstName,
      identity: identity,
      identityType: identityType,
      industry: industry.no || '',
      invoice: invoice,
      jobTitle: Number(jobTitle) || 0,
      postNum: postNum.no || '',
      roleType: Number(roleType) || 0,
      sex: sex,
      tel: tel,
      telArea: telArea,
      subscribeEpaperId: subscribeEpaperId,
      unSubscribeEpaperId: unSubscribeEpaperId,
    };
    console.log('inputTopForm:', inputTopForm);
    this.props.saveTopForm(inputTopForm)
      .then((resp) => {
        if (resp.payload.success) {
          if (this.props.location.query.nextStep) {
            location.href = decodeURIComponent(this.props.location.query.nextStep);
          } else {
            location.href = '/api/dispatch';
          }
        }
      });
    actions.setSubmitting(false);
  }

  modalContext = (
    <>
      <p>104高手預計於 2021年11月30日(二) 結束平台服務，即日起停止加入會員，感謝您的使用與支持，造成您的不便敬請見諒。</p>
    </>
  )

  render() {
    const {
      familyName, firstName, identityType, identity, sex, emailInfo, cellphone, address, invoice, tel,
      telArea, companyName, chosenRole, birthday, employeeCount, jobTitle, roleType,
      subscribeEpaperId, postNum, industry
    } = this.props.enableForm;
    const isSubscribeEdm304 = subscribeEpaperId.includes(304);
    const isSubscribeEdm305 = subscribeEpaperId.includes(305);
    const area = this.props.areaData;
    const indust = this.props.industData;

    const searchArea = postNum && postNum !== null && postNum.length > 0 && area.length > 0
      ? catSearch(area, postNum)
      : { des: '', no: '' };
    const searchIndustry = industry && industry !== null && industry.length > 0 && indust.length > 0 ? catSearch(indust, industry) : { des: '', no: '' };


    const initVal = {
      chosenRole: chosenRole || 'personal',
      sex: sex,
      companyName: companyName,
      familyName: familyName,
      firstName: firstName,
      postNum: searchArea,
      address: address,
      birthday: birthday || null,
      identityType: identityType,
      identity: identity,
      industry: searchIndustry,
      email: emailInfo.email,
      cellphone: cellphone,
      originCellphone: cellphone,
      invoice: invoice,
      tel: tel,
      telArea: telArea,
      spec: false,
      jobTitle: String(jobTitle) || '0',
      roleType: String(roleType) || '0',
      employeeCount: String(employeeCount) || '0',
      isSubscribeEdm304: isSubscribeEdm304,
      isSubscribeEdm305: isSubscribeEdm305
    };
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <div className={styles.wrap}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
            <Breadcrumb.Item>啟用104高手服務</Breadcrumb.Item>
          </Breadcrumb>
          <h2 className={styles.title}>啟用 104高手 服務</h2>
          <div className={styles.msgWrap}>請完成 104高手會員啟用資料填寫，即可使用104高手 接案/發案…等服務。</div>
          <Formik
            initialValues={initVal}
            onSubmit={this.onEnableCaseSubmit}
            validationSchema={validateCaseUser}
            render={props => (
              <CaseUserRenderForm
                initialData={initVal}
                onBackPage={this.onBackPage}
                data={props}
                emailInfo={emailInfo}
                birthday={birthday}
              />
            )}
            enableReinitialize
          />
          <TerminateModal
            title="104高手平台服務終止通知"
            context={this.modalContext}
          />
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  industData: state.common.indust,
  areaData: state.common.area,
  enableForm: state.basic.enableForm,
});
const mapDispatchToProps = {
  saveTopForm,
  getFormDefault,
  loadStaticArea,
  loadStaticIndust
};

export default connect(mapStateToProps, mapDispatchToProps)(EnableCaseUser);
