
import React, { PureComponent } from 'react';
import CommunitingForm from '../demandFlowForm/CommunitingForm';
import NotFoundForm from '../demandFlowForm/NotFoundForm';
import CooperatingForm from '../demandFlowForm/CooperatingForm';
import EvaluationForm from '../demandFlowForm/EvaluationForm';

class ApplyClosedDemand extends PureComponent {
  render() {
    const {
      showNotFoundForm, showCommunitingForm, data, onCloseModal, onOpenFinishedModal, demandCloseSubmit, gigList, openNotFoundForm, showCooperatingForm, showEvaluationForm, evaluationQueue, handleNextEvaluation, evaluateTopper, openEvaluation, evaluationTopper,
    } = this.props;
    if (showNotFoundForm) {
      return (
        <NotFoundForm
          data={data}
          onCloseModal={onCloseModal}
          onOpenFinishedModal={onOpenFinishedModal}
          demandCloseSubmit={demandCloseSubmit}
        />
      );
    } else if (showCommunitingForm) {
      return (
        <CommunitingForm
          data={data}
          gigList={gigList}
          onCloseModal={onCloseModal}
          onOpenFinishedModal={onOpenFinishedModal}
          demandCloseSubmit={demandCloseSubmit}
          openNotFoundForm={openNotFoundForm}
        />
      );
    } else if (showCooperatingForm) {
      return (
        <CooperatingForm
          data={data}
          gigList={gigList}
          onCloseModal={onCloseModal}
          onOpenFinishedModal={onOpenFinishedModal}
          demandCloseSubmit={demandCloseSubmit}
          openNotFoundForm={openNotFoundForm}
          openEvaluation={openEvaluation}
        />
      );
    } else if (showEvaluationForm) {
      return (
        <EvaluationForm
          data={data}
          evaluationTopper={evaluationTopper}
          evaluationQueue={evaluationQueue}
          gigList={gigList}
          handleNextEvaluation={handleNextEvaluation}
          evaluateTopper={evaluateTopper}
        />
      );
    }
    return <></>;
  }
}


export default ApplyClosedDemand;
