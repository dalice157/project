import React, { Component } from 'react';
import { Modal } from 'antd';
import PopModal from '../../common_v2/PopModal';
import {
  validateCaseV1, validateEdit, validateCaptcha, validatePay
} from '../../common_v2/Validates';
import Case from '../../common_v2/Case';
import EditProfile from '../../common_v2/EditProfile';
import Pay from '../../common_v2/Pay';
import { demandOrderTXStatus, defaultMoneyData } from '../../../config/selectData';
import styles from './AddFormModal.scss';
// import { moneyData } from '../serviceItems/popoverData';
import { isContainTutorCats } from '../../../util/lablesUtils.js';

/**
 * 新增需求
 * 1. 新增案件
 * 2. 填寫聯絡資料
 * 3. 支付押金
 */
class AddFormModel extends Component {
  constructor(props) {
    super(props);

    const {
      cellphone,
      certificate,
    } = this.props.demandAction.defaultDemanderForm.cellphoneRecord;

    this.state = {
      visible: false,
      casePage: true,
      editPage: false,
      payPage: false,
      addDemand: { // 新增需求 api result
        success: false,
        data: {
          demandId: '',
          basicId: '',
        },
        message: '',
      },
      contactBody: {
        roleType: 'personal',
      },
      demandBody: {
        placeType: 'no',
        desc: '工作內容：\n執行時間：'
      },
      demandCats: [],
      target: null,
      cellphone: cellphone,
      isCellphoneCertificate: certificate,
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this.onOpen();
    }
  }

  /**
  * 新增案件
  * @param {object} values 新增需求 model
  */
  handleAddDemand = async (values, actions) => {
    // console.log('新增案件 ', JSON.stringify(values, null, 2));
    const {
      demandId
    } = this.state.addDemand.data;
    const {
      title,
      unit,
      minPrice,
      maxPrice,
      placeType,
      assignPlace,
      partnerCount,
      desc,
      demandCats,
      target,
    } = values;

    const location = placeType === 'no' ? null : [assignPlace.no];
    const demandBody = {
      title: title,
      unit: unit,
      minPrice: minPrice,
      maxPrice: maxPrice,
      assignPlace: location,
      partnerCount: partnerCount,
      desc: desc,
      demandCategory: demandCats,
    };

    if (isContainTutorCats(demandCats)) {
      demandBody.target = target;
    }

    let saveDemandResult = {
      payload: {
        data: {
          demandId: '',
        }
      },
    };

    let defaultProfile = {
      payload: {},
    };

    let casePage = true;
    let editPage = false;
    let payPage = false;

    try {
      saveDemandResult = demandId === ''
        ? await this.props.demandAction.loadAddDemand(demandBody)
        : await this.props.demandAction.loadModifyDemand(demandId, demandBody);
      defaultProfile = await this.props.demandAction.loadDefaultDemanderForm();

      casePage = false;
      editPage = true;
      payPage = false;
    } catch (error) {
      console.log(error);
    }

    let cellphone = this.state.cellphone;
    let certificate = this.state.isCellphoneCertificate;

    if (defaultProfile.payload.cellphoneRecord) {
      cellphone = defaultProfile.payload.cellphoneRecord.cellphone;
      certificate = defaultProfile.payload.cellphoneRecord.certificate;
    }

    this.setState({
      casePage: casePage,
      editPage: editPage,
      payPage: payPage,

      demandBody: values, // ui data
      demandCats: demandCats, // ui data
      addDemand: saveDemandResult.payload, // api result
      cellphone: cellphone,
      isCellphoneCertificate: certificate,
    });
    actions.setSubmitting(false);
  }

  /**
   * 返回新增案件
   */
  handleBackToAddDemand = () => {
    this.setState({
      casePage: true,
      editPage: false,
      payPage: false,
      demandBody: this.state.demandBody,
    });
  }

  /**
   * 判斷手機是否已驗證
   */
  handleCellphoneChange = (cellphone) => {
    const {
      defaultDemanderForm,
    } = this.props.demandAction;
    const {
      cellphone: prevCellphone,
      certificate,
    } = defaultDemanderForm.cellphoneRecord;
    const isCellphoneCertificate = cellphone === prevCellphone && certificate;

    // console.log(`判斷手機是否已驗證: cellphone: ${cellphone}, isCellphoneCertificate: ${isCellphoneCertificate}`);

    this.setState({
      cellphone: cellphone,
      isCellphoneCertificate: isCellphoneCertificate,
    });
  }

  onSendSMS = async (cellphone) => {
    const {
      isCellphoneCertificate,
    } = this.state;
    const {
      // addDemandForm,
      demandAction,
    } = this.props;
    const {
      loadSendVerifySMS,
      defaultDemanderForm,
    } = demandAction;
    const {
      cellphoneRecord,
    } = defaultDemanderForm;

    if (isCellphoneCertificate) { // 檢查輸入的手機號碼是否已驗證
      Modal.info({
        content: (
          <div className={styles.content}>
            此行動電話已驗證
          </div>
        )
      });
    } else if (cellphoneRecord.frequency >= 3) {
      Modal.info({
        content: (
          <div className={styles.content}>
            已超過發送次數上限，無法再發送驗證碼！<br />
            請電洽客服人員(02)29126104#8333，或來信<a href="mailto:104top@104.com.tw">104top@104.com.tw</a>
          </div>
        )
      });
    } else {
      // 成功發送驗證碼alert提示
      const verifySMS = await loadSendVerifySMS(cellphone);

      if (verifySMS.payload && verifySMS.payload.success) {
        Modal.info({
          content: (
            <div className={styles.content}>
              已發送驗證碼，請立即收取
              <br /> 輸入行動電話驗證碼，並點擊下一步送出驗證碼。
            </div>
          )
        });
      }
    }
  }

  /**
   * 填寫聯絡資料, 前往支付押金
   * - 判斷手機是否有驗證
   */
  handleActivateProfile = async (values, actions) => {
    // console.log('啟用 profile', JSON.stringify(values, null, 2));
    const {
      isCellphoneCertificate,
    } = this.state;
    const {
      orderTXStatus,
    } = this.props.addDemandForm;
    const {
      defaultDemanderForm,
      loadSendVerifyCellphone,
      loadActivateDemander,
      loadResetSendVerifySMS,
    } = this.props.demandAction;
    const {
      cellphone: prevCellphone,
      certificate,
    } = defaultDemanderForm.cellphoneRecord;
    const {
      familyName,
      firstName,
      sex,
      identityType,
      identity,
      invoice,
      email,
      telArea,
      tel,
      cellphone,
      captcha,
    } = values;

    const isCertificate = (cellphone === prevCellphone && certificate) || isCellphoneCertificate;
    let cellphoneCertificate = {
      success: true,
    };
    if (!isCertificate) { // 驗證手機
      const result = await loadSendVerifyCellphone(cellphone, captcha);
      cellphoneCertificate = result.payload;
    }
    if (cellphoneCertificate.success) { // 啟用demander
      const demandVerifyForm = {
        cellphoneRecord: {
          cellphone
        },
        emailInfo: {
          email
        },
        familyName,
        firstName,
        identity,
        identityType: String(identityType), // 0: 身分證, 1: 護照, (2: 統編)
        invoice,
        sex: String(sex),
        tel,
        telArea,
      };

      let editPage = true;
      let payPage = false;

      const result = await loadActivateDemander(demandVerifyForm);

      if (result.payload && result.payload.success) {
        editPage = false;
        payPage = true;
      }

      if (payPage && orderTXStatus === demandOrderTXStatus.PAY) {
        loadResetSendVerifySMS();
        this.onClose();
      } else {
        this.setState({
          editPage: editPage,
          payPage: payPage,
          cellphone: cellphone,
          isCellphoneCertificate: true,
        });
      }
    }
    actions.setSubmitting(false);
  }

  /**
   * 返回填寫聯絡資料
   */
  handleBackToProfileEdit = async () => {
    const defaultProfile = await this.props.demandAction.loadDefaultDemanderForm();
    const {
      cellphone,
      certificate,
    } = defaultProfile.payload.cellphoneRecord;

    this.setState({
      casePage: false,
      editPage: true,
      payPage: false,

      cellphone: cellphone,
      isCellphoneCertificate: certificate,
    });
  }

  /**
   * 繳納需求保證金
   */
  handlePaySubmit = (values, actions) => {
    // console.log('繳納需求保證金 ', JSON.stringify(values, null, 2));
    const {
      demandId,
    } = this.state.addDemand.data;
    const {
      partBId,
      loadPaidSubmit,
    } = this.props.demandAction;

    if (partBId) { // profile 支付押金
      loadPaidSubmit(demandId, partBId).then(
        () => {
          this.onClose();
        }
      );
    } else { // demand 支付押金
      loadPaidSubmit(demandId).then(
        () => {
          this.onClose();
        }
      );
    }
    actions.setSubmitting(false);
  }

  onClick = () => {
    const {
      addDemandForm,
    } = this.props;
    // console.log('addDemandForm:', addDemandForm);
    // this.props.onChooseClose ? this.props.onChooseClose() : '';

    let demandBody = {
      title: '',
      unit: 0,
      minPrice: defaultMoneyData.minCase,
      maxPrice: defaultMoneyData.minCase,
      placeType: 'no',
      assignPlace: {
        des: '', // 台北市中正區
        no: '' // 6001001001
      },
      partnerCount: 1,
      target: '',
      desc: '工作內容：\n執行時間：',
    };

    let addDemand = {
      success: false,
      data: {
        demandId: '',
        basicId: '',
      },
      message: '',
    };

    let demandCategory = [];
    let target = null;

    if (addDemandForm.demandItem) {
      addDemand.data.demandId = addDemandForm.orderTXStatus === demandOrderTXStatus.FINISH ? '' : addDemandForm.demandItem.demandId;
      demandBody = addDemandForm.demandItem.demandBody;
      demandBody.assignPlace = addDemandForm.searchArea;
      demandBody.placeType = demandBody.assignPlace ? 'yes' : 'no';
      demandCategory = addDemandForm.demandItem.demandCategory ? addDemandForm.demandItem.demandCategory : [];
      target = addDemandForm.demandItem.target;
    }

    this.setState({
      visible: true,
      casePage: true,
      editPage: false,
      payPage: false,
      addDemand: addDemand,
      demandBody: demandBody,
      demandCats: demandCategory,
      target: target,
    });
  }

  onClose = () => {
    const {
      loadDemandList, pageNum, isFilter, selectOpt, filterDemandList, isDemander
    } = this.props.demandAction;

    if (isDemander) {
      if (!isFilter) {
        loadDemandList ? loadDemandList(pageNum) : '';
      } else if (isFilter) {
        filterDemandList(selectOpt, pageNum);
      }
    }

    this.setState({
      visible: false,
      addDemand: {
        success: false,
        data: {
          demandId: '',
          basicId: '',
        },
        message: '',
      },
      casePage: false,
      editPage: false,
      payPage: false,
    });
  }

  render() {
    const {
      addDemandForm,
      demandAction,
      isTitle
    } = this.props;
    const {
      btnText,
      // btnType,
      orderTXStatus,
    } = addDemandForm;
    const {
      // saveDemandData,
      defaultDemanderForm, // 填寫資料頁的預設資訊
      verifySMS, // data
      // verifyPhone, // data
    } = demandAction;
    const {
      isCellphoneCertificate,
    } = this.state;
    const casePage = {
      validateCaseV1,
      orderTXStatus,
      demandBody: this.state.demandBody,
      demandCats: this.state.demandCats,
      target: this.state.target,
      handleAddDemand: this.handleAddDemand
    };
    const profilePage = {
      orderTXStatus,
      onCasePrev: this.handleBackToAddDemand,
      handleActivateProfile: this.handleActivateProfile,
      validateEdit: isCellphoneCertificate ? validateEdit : validateEdit.concat(validateCaptcha),

      defaultDemanderForm, // data
      onCellphoneChange: this.handleCellphoneChange,
      onSendSMS: this.onSendSMS,
      verifySMS,
      // verifyPhone,
    };

    const payPage = {
      validatePay,
      onProfilePrev: this.handleBackToProfileEdit,
      onSubmit: this.handlePaySubmit,
      onPayChange: this.onPayChange
    };
    const isTitleText = profilePage.orderTXStatus === demandOrderTXStatus.PAY ? '修改需求' : '新增需求';
    const isSize = (profilePage.orderTXStatus === demandOrderTXStatus.UNPAY || profilePage.orderTXStatus === demandOrderTXStatus.FINISH) && 'large';
    const isType = isTitle ? 'primary' : '';
    return (
      <PopModal
        btnText={btnText}
        btnType={isType}
        size={isSize}
        title={isTitleText}
        onClick={this.onClick}
        onClose={this.onClose}
        visible={this.state.visible}
        dataGtmCase="newcase"
      >
        {
          this.state.casePage
          && (
          <Case
            casePage={casePage}
            onClose={this.onClose}
          />
          )
        }
        {
          this.state.editPage
          && (
          <EditProfile
            profilePage={profilePage}
            isCellphoneCertificate={this.state.isCellphoneCertificate}
          />
          )
        }
        {
          this.state.payPage
          && (
          <Pay
            payPage={payPage}
          />
          )
        }
      </PopModal>
    );
  }
}


export default AddFormModel;
