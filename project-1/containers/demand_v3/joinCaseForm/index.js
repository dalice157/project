import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { demandTypes } from '../../../config/selectData';
import JoinSelectDemand from '../../../components/demand_v3/joinCaseForm/JoinSelectDemand';
import { addDemand as addDemandStepData } from '../../../components/ui/step/stepData';
import Step from '../../../components/ui/step';
import { loadStaticArea, loadStaticIndust } from '../../../actions/common';
import { getFormDefault } from '../../../actions/basic';
import styles from './JoinCaseForm.scss';
import {
  addDemandv2,
  modifyDemandv2,
  getSavedDemand,
  updateDemandFormInCaseForm,
  unmountCaseFormData,
} from '../../../actions/demand';
import JoinPublishTutorForm from './JoinPublishTutorForm';
import JoinPublishCaseForm from './JoinPublishCaseForm';


class JoinCaseForm extends PureComponent {
  constructor(props) {
    super(props);
    this.pageRef = React.createRef();
    this.formRef = React.createRef();
  }

  state = {
    isLoadingDemandForm: false,
    isInitializeForm: true,
  }

  componentDidMount = () => {
    this.props.loadStaticArea();
    this.props.loadStaticIndust();
    this.props.getFormDefault().then(() => this.setState({ isInitializeForm: false }));
  }

  componentWillUnmount = () => {
    this.props.unmountCaseFormData();
  }

  onChangeDemandType = (demandType) => {
    this.props.history.push(`/joincaseForm?demandType=${demandType}`);
    setTimeout(() => this.pageRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  renderForm = (demandType, formRef, enableUserData, area) => {
    const { isLoadingDemandForm, isInitializeForm } = this.state;
    if (demandType === demandTypes.tutor) {
      return (
        <JoinPublishTutorForm
          formRef={formRef}
          area={area}
          enableUserData={enableUserData}
          isLoadingDemandForm={isLoadingDemandForm}
          isInitializeForm={isInitializeForm}
        />
      );
    } else if (demandType === demandTypes.case) {
      return (
        <JoinPublishCaseForm
          formRef={formRef}
          area={area}
          enableUserData={enableUserData}
          isLoadingDemandForm={isLoadingDemandForm}
          isInitializeForm={isInitializeForm}
        />
      );
    } else {
      return <></>;
    }
  }

  render() {
    const { enableUserData, area } = this.props;
    const demandType = this.props.location.query.demandType;
    return (
      <div className={styles.wrap}>
        <Step current={0} stepData={addDemandStepData} stepModel />
        <JoinSelectDemand
          formRef={this.formRef}
          demandType={demandType}
          onChangeDemandType={this.onChangeDemandType}
          updateDemandFormInCaseForm={this.props.updateDemandFormInCaseForm}
        />
        <div className={styles.block} />
        <div className={styles.pageRef} ref={this.pageRef} />
        {this.renderForm(demandType, this.formRef, enableUserData, area)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  area: state.common.area,
  defaultDemanderForm: state.demand.defaultDemanderForm,
  saveDemand: state.demand.saveDemand,
  initialCaseForm: state.demand.initialCaseForm,
  enableUserData: state.basic.enableForm,
});
const mapDispatchToProps = {
  loadStaticArea,
  onSaveDemand: addDemandv2,
  onModifyDemand: modifyDemandv2,
  getSavedDemand,
  updateDemandFormInCaseForm,
  getFormDefault,
  loadStaticIndust,
  unmountCaseFormData,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JoinCaseForm));
