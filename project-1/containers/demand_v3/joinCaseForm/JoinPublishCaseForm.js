import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  addDemandv2,
  modifyDemandv2,
  getDefaultDemanderForm,
  getSavedDemand,
} from '../../../actions/demand';
import { loadUserInfo, saveTopForm } from '../../../actions/basic';
import JoinOtherCaseForm from '../../../components/demand_v3/joinCaseForm/JoinOtherCaseForm';
import {
  caseRoleTypes, personTypeOpts, moneyData, sexTitle
} from '../../../config/selectData';
import { catSearch } from '../../../util/categoryUtils';
import { acDateFormat } from '../../../config/constant';
import { isContainTutorCats } from '../../../util/lablesUtils';

class JoinPublishCaseForm extends PureComponent {
    state ={
      isSubmitting: false,
    }

    onSubmit = async (values, actions) => {
      console.log('values ', values);
      const demandType = this.props.location.query.demandType;
      const {
        enableUserData, postAddress, demandCategory, title, unit, minPrice, maxPrice, placeType, assignPlace, partnerCount, desc, name, email, sex, cellphone, tel, telArea, otherContactWay, experience, jobOccupation, contactTimeBegin, contactTimeEnd
      } = values;
      const {
        roleType, identityType, employeeCount, jobTitle, industry, birthday
      } = enableUserData;
      // 使用者是否手機號碼與區域號碼二擇一
      const isPhoneFilled = (cellphone !== '' && cellphone !== null) || (telArea !== '' && tel !== '' && telArea !== null && tel !== null);

      let demandBody = {
        title: title,
        unit: unit,
        minPrice: minPrice,
        maxPrice: maxPrice,
        assignPlace: placeType === 'no' ? null : [assignPlace.no],
        partnerCount: partnerCount,
        desc: desc,
        demandCategory: demandCategory,
        demandContactDTO: {
          cellphone: cellphone,
          email: email,
          name: name,
          other: otherContactWay,
          sex: sex,
          tel: tel,
          telArea: telArea,
          contactTimeBegin,
          contactTimeEnd,
        },
        character: 2,
        demandOutsourceInfo: {
          experience, jobOccupation: jobOccupation.find(value => value === caseRoleTypes[0].value) ? [caseRoleTypes[0].value] : jobOccupation,
        }
      };

      const enableUserDataBody = {
        ...enableUserData,
        postNum: postAddress.no,
        roleType: Number(roleType),
        identityType: Number(identityType),
        employeeCount: Number(employeeCount),
        jobTitle: Number(jobTitle),
        industry: industry?.no,
        birthday: dayjs(birthday).format(acDateFormat),
      };

      this.setState({ isSubmitting: true });
      if (isPhoneFilled) {
        const enableUserResponse = await this.props.saveTopForm(enableUserDataBody);
        if (enableUserResponse.payload.success) {
          await this.props.loadUserInfo();
          const response = await this.props.onSaveDemand(demandBody);
          if (response.payload.success) {
            const createdDemandId = response.payload.data.demandId;
            this.props.history.push(`/planSelect?demandId=${createdDemandId}&demandType=${demandType}`);
          }
        }
      }
      this.setState({ isSubmitting: false });
      actions.setSubmitting(false);
    }

    // 使用者點選回上一步時，詢問是否取消
  onPrev = () => {
    const onCancel = () => this.props.history.push('/demand');
    Modal.confirm({
      title: '確認取消需求資料編輯',
      content: '是否確認取消需求資料編輯？點選【確認】將不會儲存所填寫之所有內容。',
      okText: '確認',
      cancelText: '取消',
      onOk() {
        onCancel();
      },
    });
  }

  initializeData = (initialCaseForm, enableUserData, area) => {
    const {
      assignPlace, demandCategory
    } = initialCaseForm;
    const {
      postNum, birthday, roleType, identityType, employeeCount, jobTitle, cellphone, sex, identity
    } = enableUserData;
    const isDemandCatValid = !isContainTutorCats(demandCategory);
    const searchArea = Array.isArray(assignPlace) && Array.isArray(area) && area.length > 0
      ? catSearch(area, assignPlace[0])
      : { des: '', no: '' };
    const postArea = postNum && Array.isArray(area) && area.length > 0 ? catSearch(area, postNum) : { des: '', no: '' };
    const initialData = {
      ...initialCaseForm,
      demandCategory: isDemandCatValid ? demandCategory : [],
      placeType: 'no',
      assignPlace: searchArea,
      postAddress: postArea,
      spec: false,
      unit: moneyData[0].value,
      enableUserData: {
        ...enableUserData,
        originCellphone: cellphone,
        chosenRole: personTypeOpts[0].value,
        birthday: moment(birthday || '1900/01/01', acDateFormat).format(acDateFormat),
        industry: { des: '', no: '' },
        roleType: String(roleType),
        identityType: String(identityType),
        employeeCount: String(employeeCount),
        jobTitle: String(jobTitle),
        disabledBirthday: typeof birthday === 'string' && dayjs(birthday).format(acDateFormat) !== dayjs('1900/01/01').format(acDateFormat),
        disabledSex: typeof sex === 'string' && (sex === sexTitle[0].value || sex === sexTitle[1].value),
        disabledIdentityType: typeof identity === 'string' && identity.length !== 0,
        disabledIdentity: typeof identity === 'string' && identity.length !== 0,
      },
    };
    return initialData;
  }

  render() {
    const { isSubmitting } = this.state;
    const {
      initialCaseForm, defaultDemanderForm, formRef, isLoadingDemandForm, area, enableUserData, isInitializeForm
    } = this.props;
    const initialData = this.initializeData(initialCaseForm, enableUserData, area);
    return (
      <JoinOtherCaseForm
        formRef={formRef}
        initialData={initialData}
        defaultDemanderForm={defaultDemanderForm}
        isLoadingDemandForm={isLoadingDemandForm}
        onSubmit={this.onSubmit}
        onPrev={this.onPrev}
        isSubmitting={isSubmitting}
        isInitializeForm={isInitializeForm}
      />
    );
  }
}

const mapStateToProps = state => ({
  defaultDemanderForm: state.demand.defaultDemanderForm,
  initialCaseForm: state.demand.initialCaseForm,
});
const mapDispatchToProps = {
  loadDefaultDemanderForm: getDefaultDemanderForm,
  onSaveDemand: addDemandv2,
  onModifyDemand: modifyDemandv2,
  getSavedDemand,
  saveTopForm,
  loadUserInfo,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JoinPublishCaseForm));
