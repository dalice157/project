
import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import PopModal from '../../../components/common_v2/PopModal';
import { OFF_DEMAND_PATH } from '../../../config/constant';
import ApplyClosedDemand from '../../../components/demand_v3/modal/ApplyClosedDemand';
import { demandOrderTXStatus } from '../../../config/selectData';
import {
  demandCloseSubmit, evaluateTopper, getGigTitleList,
} from '../../../actions/demand';
import { chkActiveProcess } from '../../../actions/common';

class ApplyClosedDemandModal extends Component {
  state = {
    isModalVisible: false,
    showNotFoundForm: false,
    showCommunitingForm: false,
    showCooperatingForm: false,
    showEvaluationForm: false,
    evaluationQueue: [{ topperId: -1, topperName: '' }],
    evaluationTopper: { topperId: -1, topperName: '' },
  };

  onOpenModal = async () => {
    const { data } = this.props;
    const {
      offDemandPath, negotiatedTopper, confirmedTopper, reviewedTopper,
    } = data;
    const isNotFoundTopper = Array.isArray(negotiatedTopper) && Array.isArray(confirmedTopper) && Array.isArray(reviewedTopper) && negotiatedTopper.length === 0 && confirmedTopper.length === 0 && reviewedTopper.length === 0;
    const checkUserResult = await this.props.chkActiveProcess();
    if (checkUserResult.payload?.success) {
      if (isNotFoundTopper) {
        /* 沒有溝通高手 */
        this.setState({
          isModalVisible: true,
          showNotFoundForm: true,
          showCommunitingForm: false,
          showCooperatingForm: false,
          showEvaluationForm: false,
        });
      } else if (offDemandPath === OFF_DEMAND_PATH.communicateUncooperate) {
        /* 有溝通高手但未確認合作 */
        this.setState({
          isModalVisible: true,
          showNotFoundForm: false,
          showCommunitingForm: true,
          showCooperatingForm: false,
          showEvaluationForm: false,

        });
      } else if (offDemandPath === OFF_DEMAND_PATH.multiCooperateNotEvaluate) {
        /* 有多位確認合作但未評價 */
        this.setState({
          isModalVisible: true,
          showNotFoundForm: false,
          showCommunitingForm: false,
          showCooperatingForm: true,
          showEvaluationForm: false,

        });
      } else if (offDemandPath === OFF_DEMAND_PATH.evaluated) {
        /* 已確認已評價 */
        this.setState({
          isModalVisible: true,
          showNotFoundForm: false,
          showCommunitingForm: false,
          showCooperatingForm: true,
          showEvaluationForm: false,
        });
      }
    }
  }

  onCloseModal = (isReloadList) => {
    this.setState({
      isModalVisible: false,
    }, () => {
      if (isReloadList) {
        this.props.onUpdateDemandList();
      }
    });
  }

  onOpenFinishedModal = (depositeStatus, finishedCallback, callbackParams) => {
    this.setState({
      isModalVisible: false,
      showNotFoundForm: false,
      showCommunitingForm: false,
      showCooperatingForm: false,
      showEvaluationForm: false,
    }, () => {
      Modal.info({
        title: '您的需求結案申請已完成',
        content: (
          <>
            <p>感謝您的使用，您的案件已完成結案關閉。</p>
            {depositeStatus === demandOrderTXStatus.depositeStatus.PAY
              && <p>＊＊若您有支付押金NT$1,000，則將會14天內退刷至原信用卡，因各銀行作業時間不同，敬請注意近二期帳單。</p> }
          </>
        ),
        okText: '關閉',
        onOk: () => finishedCallback(callbackParams),
        onCancel: () => finishedCallback(callbackParams),
        maskClosable: true,
      });
    });
  }

  openNotFoundForm = () => {
    this.setState({
      isModalVisible: true,
      showNotFoundForm: true,
      showCommunitingForm: false,
      showCooperatingForm: false,
      showEvaluationForm: false,
    });
  }

  openEvaluation = (evaluationQueue) => {
    if (Array.isArray(evaluationQueue) && evaluationQueue.length >= 1) {
      // 從頭開始評價
      const evaluationTopper = evaluationQueue.shift();
      this.props.getGigTitleList(evaluationTopper.topperId);
      this.setState({
        evaluationQueue,
        evaluationTopper,
        isModalVisible: true,
        showNotFoundForm: false,
        showCommunitingForm: false,
        showCooperatingForm: false,
        showEvaluationForm: true,
      });
    } else {
      // 例外處理，不是正常的流程
      this.setState({
        isModalVisible: false,
        showNotFoundForm: false,
        showCommunitingForm: false,
        showCooperatingForm: false,
        showEvaluationForm: false,
      });
    }
  }

  handleNextEvaluation = (hasNextEvaluation) => {
    if (hasNextEvaluation) {
      // re-mount form
      this.setState((prevState) => {
        const { evaluationQueue } = prevState;
        const evaluationTopper = evaluationQueue.shift();
        this.props.getGigTitleList(evaluationTopper.topperId);
        return ({
          evaluationQueue,
          evaluationTopper,
          showEvaluationForm: true,
        });
      });
    } else {
      this.props.onUpdateDemandList();
      // 沒有下一位評價則關閉modal
      this.setState({
        isModalVisible: false,
        showNotFoundForm: false,
        showCommunitingForm: false,
        showCooperatingForm: false,
      });
    }
  }

  render() {
    const { data, gigList } = this.props;
    const {
      isModalVisible, showNotFoundForm, showCommunitingForm, evaluationTopper, showCooperatingForm, showEvaluationForm, evaluationQueue,
    } = this.state;
    return (
      <PopModal
        btnText="申請結案"
        title="需求結案申請"
        onClick={this.onOpenModal}
        onClose={() => this.onCloseModal(false)}
        visible={isModalVisible}
      >
        <ApplyClosedDemand
          data={data}
          gigList={gigList}
          evaluationQueue={evaluationQueue}
          evaluationTopper={evaluationTopper}
          showNotFoundForm={showNotFoundForm}
          showCommunitingForm={showCommunitingForm}
          showCooperatingForm={showCooperatingForm}
          showEvaluationForm={showEvaluationForm}
          onCloseModal={this.onCloseModal}
          onOpenFinishedModal={this.onOpenFinishedModal}
          openNotFoundForm={this.openNotFoundForm}
          handleNextEvaluation={this.handleNextEvaluation}
          openEvaluation={this.openEvaluation}
          demandCloseSubmit={this.props.demandCloseSubmit}
          evaluateTopper={this.props.evaluateTopper}
        />
      </PopModal>
    );
  }
}

const mapStateToProps = state => ({
  gigList: state.demand.tableList.gigTitleList,
});
const mapDispatchToProps = {
  demandCloseSubmit,
  evaluateTopper,
  chkActiveProcess,
  getGigTitleList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplyClosedDemandModal);
