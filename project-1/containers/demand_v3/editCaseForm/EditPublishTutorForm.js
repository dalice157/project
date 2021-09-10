import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import {
  addDemandv2,
  modifyDemandv2,
  getDefaultDemanderForm,
  getSavedDemand,
} from '../../../actions/demand';
import TutorForm from '../../../components/demand_v3/editCaseForm/EditTutorForm';
import { tutorRoleTypes, planTypeList } from '../../../config/selectData';
import { catSearch } from '../../../util/categoryUtils';

class PublishTutorForm extends PureComponent {
  state = {
    isSubmitting: false,
  }

  onSubmit = async (values, actions) => {
    const demandId = this.props.location.query.demandId;
    const {
      hideOtherContactWay, hideTelephone, hideCellphone, solution, demandCategory, title, unit, minPrice, maxPrice, placeType, assignPlace, partnerCount, desc, educationalStage, name, email, sex, cellphone, tel, telArea, otherContactWay, experience, classEveryWeekDay, classEveryWeekHourBegin, classEveryWeekHourEnd, classFrequencyHour, classFrequencyTime, classFrequencyUnit, jobOccupation, educationalGrade, studentSex, studentTotal, contactTimeBegin, contactTimeEnd, classPlace, classDuration, classPlaceDesc, classWay
    } = values;
    const planType = String(solution);
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
        displayOther: planType === planTypeList[1].value ? !hideOtherContactWay : false,
        displayTel: planType === planTypeList[1].value ? !hideTelephone : false,
        displayCellphone: planType === planTypeList[1].value ? !hideCellphone : false,
      },
      character: 1,
      educationalStage: educationalStage,
      demandTutorInfo: {
        classPlace, classDuration, classPlaceDesc, classWay, classEveryWeekDay, classEveryWeekHourBegin, classEveryWeekHourEnd, classFrequencyHour, classFrequencyTime, classFrequencyUnit, educationalGrade, studentSex, studentTotal, experience, jobOccupation: jobOccupation.find(value => value === tutorRoleTypes[0].value) ? [tutorRoleTypes[0].value] : jobOccupation
      }
    };
    if (isPhoneFilled) {
      this.setState({ isSubmitting: true });
      const response = await this.props.onModifyDemand(demandId, demandBody);
      if (response.payload.success) {
        this.props.history.push('/demand');
      }
      this.setState({ isSubmitting: false });
    }
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

  initializeData = (initialCaseForm, area, isNewDemandForm) => {
    const {
      assignPlace, contactTimeBegin, contactTimeEnd, placeType
    } = initialCaseForm;
    const searchArea = Array.isArray(assignPlace) && Array.isArray(area) && area.length > 0
      ? catSearch(area, assignPlace[0])
      : { des: '', no: '' };
    const newPlaceType = isNewDemandForm ? placeType : 'yes';
    const initialData = {
      ...initialCaseForm,
      placeType: newPlaceType,
      assignPlace: searchArea,
      contactTime: contactTimeBegin && contactTimeEnd && '0',
    };
    return initialData;
  }

  render() {
    const { isSubmitting } = this.state;
    const {
      initialCaseForm, defaultDemanderForm, formRef, isLoadingDemandForm, area, isInitializeForm
    } = this.props;
    const { solution } = initialCaseForm;
    const planType = String(solution);
    const isNewDemandForm = true;
    const initialData = this.initializeData(initialCaseForm, area, isNewDemandForm);
    return (
      <TutorForm
        formRef={formRef}
        initialData={initialData}
        defaultDemanderForm={defaultDemanderForm}
        isLoadingDemandForm={isLoadingDemandForm}
        onSubmit={this.onSubmit}
        onPrev={this.onPrev}
        isSubmitting={isSubmitting}
        isInitializeForm={isInitializeForm}
        planType={planType}
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
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PublishTutorForm));
