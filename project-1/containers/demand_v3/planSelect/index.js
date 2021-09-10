import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { demandOrderTXStatus, planTypeList } from '../../../config/selectData';
import PlanSelect from '../../../components/demand_v3/PlanSelect';
import { addDemand } from '../../../components/ui/step/stepData';
import Step from '../../../components/ui/step';
import { sendVerifySMS } from '../../../actions/common';
import styles from './PlanSelectForm.scss';
import {
  checkDemanderAccount,
  getDemanderInfo,
  demandPaidSubmit,
} from '../../../actions/demand';
import { getDemandOrder, loadUserInfo } from '../../../actions/basic';

class PlanSelectForm extends PureComponent {
  state = {
    demandBody: {
      placeType: 'no',
      desc: '',
    },
    planType: planTypeList[0].value,
    cellphone: '',
    telArea: '',
    tel: '',
    userRequestTelephoneVerify: false,
    cellphoneVerifiedCode: '',
    spec: false,
    email: '',
    isEmailVerified: false,
  }

  componentDidMount() {
    this.props.loadUserInfo(); // 重刷會員狀態, 為了讀demander = true

    this.props.getDemanderInfo(this.getDemandId())
      .then(() => {
        const { defaultDemanderForm } = this.props;
        const {
          cellphoneRecord, telephoneRecord, emailInfo,
        } = defaultDemanderForm;
        this.setState(prevState => ({
          ...prevState,
          email: emailInfo.email,
          // AC回傳字串型態
          isEmailVerified: emailInfo.isVerified === 'true',
          telArea: telephoneRecord ? telephoneRecord.telArea : '',
          tel: telephoneRecord ? telephoneRecord.tel : '',
          isTelephoneVerified: telephoneRecord ? telephoneRecord.certificate : false,
          cellphone: cellphoneRecord ? cellphoneRecord.cellphone : '',
          isCellphoneVerified: cellphoneRecord ? cellphoneRecord.certificate : false,
        }));
      });
  }

  // 回上一步
  onPrev = () => {
    const { location, history } = this.props;
    const { demandType } = location.query;
    history.push(`/caseForm?demandId=${this.getDemandId()}&demandType=${demandType}`);
  }

  onSubmit = async (values, actions) => {
    // 使用者可能更動的資料
    const {
      cellphone, tel, telArea, planType, cellphoneVerifiedCode, userRequestTelephoneVerify,
    } = values;
    // 送出欄位
    const demandVerifyForm = {
      cellphone: cellphone === null ? '' : cellphone,
      cellphone_token: cellphoneVerifiedCode,
      demandId: this.getDemandId(),
      solution: planType,
      telArea,
      tel,
      telCertifyRequest: userRequestTelephoneVerify,
    };
    await this.props.checkDemanderAccount(demandVerifyForm).then((response) => {
      if (response.error) {
        const errorMassage = response.payload.response.sysMsgKey;
        throw new Error(errorMassage);
      }
      if (planType === planTypeList[0].value) {
        // 基本方案
        this.props.history.push(`/finished?demandId=${this.getDemandId()}&planType=0`);
      }
    }).catch((errorMassage) => {
      if (errorMassage.message === 'demand-has-been-submitted') {
        // 重複刊登導向頁面
        Modal.warning({
          title: '重複送審',
          content: '此需求已完成送審，將導入需求管理查看',
          onOk: () => this.props.history.push('/demand'),
          okText: '前往案件管理頁',
        });
      }
    });
    actions.setSubmitting(false);
  }

  getDemandId = () => {
    const demandIdFromQuerystring = this.props.location.query.demandId;
    return demandIdFromQuerystring;
  }

  // 驗證手機號碼
  onVerifyCellphone = (cellphone) => {
    this.props.sendVerifySMS(cellphone);
  }

  render() {
    const {
      defaultDemanderForm, isLoadingDemandStep2, isLoadingcellphoneVerity, isCellphoneVerifiedSubmit, paid,
    } = this.props;
    const casePage = {
      orderTXStatus: 3,
    };
    const {
      cellphoneRecord, email, telephoneRecord,
    } = defaultDemanderForm;
    const originalDemandInfo = {
      cellphone: cellphoneRecord ? cellphoneRecord.cellphone : '',
      telArea: telephoneRecord ? telephoneRecord.telArea : '',
      tel: telephoneRecord ? telephoneRecord.tel : '',
      email,
    };
    return (
      <div className={styles.wrap}>
        {
          casePage.orderTXStatus !== demandOrderTXStatus.PAY
          && <Step current={1} stepData={addDemand} stepModel />
        }
        <PlanSelect
          paid={paid}
          initialData={this.state}
          onPrev={this.onPrev}
          onSubmit={this.onSubmit}
          onVerifyCellphone={this.onVerifyCellphone}
          originalDemandInfo={originalDemandInfo}
          isLoadingDemandStep2={isLoadingDemandStep2}
          isLoadingcellphoneVerity={isLoadingcellphoneVerity}
          isCellphoneVerifiedSubmit={isCellphoneVerifiedSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  area: state.common.area,
  demandInfo: state.demand.saveDemand,
  defaultDemanderForm: state.demand.defaultDemanderForm,
  isLoadingDemandStep2: state.demand.isLoadingDemandStep2,
  isLoadingcellphoneVerity: state.common.isLoadingcellphoneVerity,
  isCellphoneVerifiedSubmit: state.common.isCellphoneVerifiedSubmit,
  paid: state.demand.paid,
});
const mapDispatchToProps = {
  getDemanderInfo,
  sendVerifySMS,
  checkDemanderAccount,
  loadPaidSubmit: demandPaidSubmit,
  getDemandOrder,
  loadUserInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlanSelectForm);
