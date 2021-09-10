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
import TutorForm from '../../../components/demand_v3/caseForm/TutorForm';
import { tutorRoleTypes, moneyData } from '../../../config/selectData';
import { catSearch } from '../../../util/categoryUtils';
import { isContainTutorCats } from '../../../util/lablesUtils';

class PublishTutorForm extends PureComponent {
  state = {
    isSubmitting: false,
  }

    onSubmit = async (values, actions) => {
      const demandType = this.props.location.query.demandType;
      const demandId = this.props.location.query.demandId;
      const isPublishingSameDemand = this.props.location.query.isNewDemand === 'yes';
      const isNewDemand = !demandId || isPublishingSameDemand;
      const {
        demandCategory, title, unit, minPrice, maxPrice, placeType, assignPlace, partnerCount, desc, educationalStage, name, email, sex, cellphone, tel, telArea, otherContactWay, experience, classEveryWeekDay, classEveryWeekHourBegin, classEveryWeekHourEnd, classFrequencyHour, classFrequencyTime, classFrequencyUnit, jobOccupation, educationalGrade, studentSex, studentTotal, contactTimeBegin, contactTimeEnd, classPlace, classDuration, classPlaceDesc, classWay
      } = values;
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
        character: 1,
        educationalStage: educationalStage,
        demandTutorInfo: {
          classPlace, classDuration, classPlaceDesc, classWay, classEveryWeekDay, classEveryWeekHourBegin, classEveryWeekHourEnd, classFrequencyHour, classFrequencyTime, classFrequencyUnit, educationalGrade, studentSex, studentTotal, experience, jobOccupation: jobOccupation.find(value => value === tutorRoleTypes[0].value) ? [tutorRoleTypes[0].value] : jobOccupation
        }
      };
      if (isPhoneFilled) {
        this.setState({ isSubmitting: true });
        if (isNewDemand) {
          // 新增案件
          const response = await this.props.onSaveDemand(demandBody);
          if (response.payload.success) {
            const createdDemandId = response.payload.data.demandId;
            this.props.history.push(`/planSelect?demandId=${createdDemandId}&demandType=${demandType}`);
          }
        } else {
          // 修改案件
          const response = await this.props.onModifyDemand(demandId, demandBody);
          if (response.payload.success) {
            this.props.history.push(`/planSelect?demandId=${demandId}&demandType=${demandType}`);
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

  initializeData = (initialCaseForm, area, isNewDemandForm) => {
    const {
      assignPlace, contactTimeBegin, contactTimeEnd, demandCategory, unit, placeType
    } = initialCaseForm;
    const searchArea = Array.isArray(assignPlace) && Array.isArray(area) && area.length > 0
      ? catSearch(area, assignPlace[0])
      : { des: '', no: '' };
    const isDemandCatValid = isContainTutorCats(demandCategory);
    const isUnitExist = unit === moneyData[0].value || unit === moneyData[1].value;
    // 新開案預設yes, 載入案件由reducer判斷
    const newPlaceType = isNewDemandForm ? placeType : 'yes';
    const initialData = {
      ...initialCaseForm,
      demandCategory: isDemandCatValid ? demandCategory : [],
      placeType: newPlaceType,
      assignPlace: searchArea,
      unit: isUnitExist ? moneyData[unit].value : moneyData[1].value,
      contactTime: contactTimeBegin && contactTimeEnd && '0',
    };
    return initialData;
  }

  render() {
    const { isSubmitting } = this.state;
    const {
      initialCaseForm, defaultDemanderForm, formRef, isLoadingDemandForm, area, isInitializeForm
    } = this.props;
    const isPublishingSameDemand = this.props.location.query.isNewDemand === 'yes';
    const isEditDemandPage = this.props.location.query.demandId && !isPublishingSameDemand;
    const isNewDemandForm = isEditDemandPage || isPublishingSameDemand;
    const initialData = this.initializeData(initialCaseForm, area, isNewDemandForm);
    return (
      <TutorForm
        formRef={formRef}
        initialData={initialData}
        defaultDemanderForm={defaultDemanderForm}
        isLoadingDemandForm={isLoadingDemandForm}
        isEditDemandPage={isEditDemandPage}
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
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PublishTutorForm));
