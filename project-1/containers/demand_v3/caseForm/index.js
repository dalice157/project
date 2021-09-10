import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { demandTypes } from '../../../config/selectData';
import SelectDemand from '../../../components/demand_v3/caseForm/SelectDemand';
import { addDemand as addDemandStepData } from '../../../components/ui/step/stepData';
import Step from '../../../components/ui/step';
import { loadStaticArea, checkMemberPublishDemand } from '../../../actions/common';
import styles from './CaseForm.scss';
import {
  addDemandv2,
  modifyDemandv2,
  getDefaultDemanderForm,
  getSavedDemand,
  updateDemandFormInCaseForm,
  unmountCaseFormData,
} from '../../../actions/demand';
import { isContainTutorCats } from '../../../util/lablesUtils.js';
import PublishTutorForm from './PublishTutorForm';
import PublishCaseForm from './PublishCaseForm';


class CaseForm extends PureComponent {
  constructor(props) {
    super(props);
    this.pageRef = React.createRef();
    this.formRef = React.createRef();
  }

  state = {
    isLoadingDemandForm: false,
    isInitializeForm: true,
  }

  componentDidMount = async () => {
    this.props.loadStaticArea();
    const demandId = this.props.location.query.demandId;
    const demandType = this.props.location.query.demandType;
    // 無家教/外包類型的舊案件
    const isEditOldDemand = !demandType;

    this.setState({ isLoadingDemandForm: true });
    // step2 -> step1 或 /demand進入 （使用者點選瀏覽器的上一頁）
    if (demandId) {
      const result = await Promise.all([
        this.props.getDefaultDemanderForm(),
        this.props.getSavedDemand(demandId),
      ]);
      if (result[1].payload) {
        // 回新增頁編輯案件
        if (isEditOldDemand) {
          const { demandCategory } = this.props.initialCaseForm;
          const isTutor = isContainTutorCats(demandCategory);
          this.onChangeDemandType(isTutor ? demandTypes.tutor : demandTypes.case);
        }
      }
    } else {
      // 一開始未填寫表單，不需要await
      this.props.getDefaultDemanderForm();
    }
    this.setState({ isLoadingDemandForm: false, isInitializeForm: false });
  }

  componentWillUnmount = () => {
    this.props.unmountCaseFormData();
  }

  onChangeDemandType = async (demandType) => {
    const demandId = this.props.location.query.demandId;
    const checkResult = await this.props.checkMemberPublishDemand(demandType);
    if (checkResult.payload.success) {
      if (demandId) {
        this.props.history.push(`/caseForm?demandType=${demandType}&demandId=${demandId}`);
      } else {
        this.props.history.push(`/caseForm?demandType=${demandType}`);
      }
      setTimeout(() => this.pageRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
  }

  renderForm = (demandType, formRef, area) => {
    const { isLoadingDemandForm, isInitializeForm } = this.state;
    if (demandType === demandTypes.tutor) {
      return (
        <PublishTutorForm
          formRef={formRef}
          isLoadingDemandForm={isLoadingDemandForm}
          area={area}
          isInitializeForm={isInitializeForm}
        />
      );
    } else if (demandType === demandTypes.case) {
      return (
        <PublishCaseForm
          formRef={formRef}
          isLoadingDemandForm={isLoadingDemandForm}
          area={area}
          isInitializeForm={isInitializeForm}
        />
      );
    } else {
      return <></>;
    }
  }

  render() {
    const { area } = this.props;
    const demandType = this.props.location.query.demandType;
    const isPublishingSameDemand = this.props.location.query.isNewDemand === 'yes';
    return (
      <div className={styles.wrap}>
        {/* 三步驟的展示 */}
        <Step current={0} stepData={addDemandStepData} stepModel />
        {
          !isPublishingSameDemand && (
            <SelectDemand
              formRef={this.formRef}
              demandType={demandType}
              onChangeDemandType={this.onChangeDemandType}
              updateDemandFormInCaseForm={this.props.updateDemandFormInCaseForm}
            />
          )
        }
        <div className={styles.block} />
        <div className={styles.pageRef} ref={this.pageRef} />
        {this.renderForm(demandType, this.formRef, area)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  area: state.common.area,
  defaultDemanderForm: state.demand.defaultDemanderForm,
  saveDemand: state.demand.saveDemand,
  initialCaseForm: state.demand.initialCaseForm,
});
const mapDispatchToProps = {
  loadStaticArea,
  getDefaultDemanderForm,
  onSaveDemand: addDemandv2,
  onModifyDemand: modifyDemandv2,
  getSavedDemand,
  updateDemandFormInCaseForm,
  checkMemberPublishDemand,
  unmountCaseFormData,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CaseForm));
