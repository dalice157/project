import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import Evaluate from '../../components/evaluation/EvaluationEDM';
import { loadAskReviewInfo, evaluateTopperFromEDM } from '../../actions/common';

class EvaluationEDM extends PureComponent {
  state = {
    hasSubmit: false,
  };

  async componentDidMount() {
    const { payload } = this.props.history.location.query;
    const initialResult = await this.props.loadAskReviewInfo(payload);
    if (initialResult.error) {
      this.props.history.push('/');
    }
  }

  onSubmitEvaluation = async (evaluationData, target) => {
    const {
      commentType, commentOption, comment, gigTitle, demandTitle, communicationScore, qualityScore, recommandationScore
    } = evaluationData;
    const { setSubmitting } = target;
    const { payload } = this.props.history.location.query;
    const submitComment = commentType === 1 ? comment : commentOption;
    const body = {
      comment: submitComment,
      demandTitle: demandTitle,
      gigTitle: gigTitle,
      ranking1: communicationScore,
      ranking2: qualityScore,
      ranking3: recommandationScore,
    };
    const submitResult = await this.props.evaluateTopperFromEDM(payload, body);
    if (!submitResult.error) {
      this.setState({ hasSubmit: true });
    }
    setSubmitting(false);
  };

  render() {
    const { hasSubmit } = this.state;
    const { evaluateTopperInfo } = this.props;
    const { demandTitle, gigTitle, topperName } = evaluateTopperInfo;
    const initialData = {
      demandTitle: demandTitle,
      topper: topperName,
      gigTitle: gigTitle,
      communicationScore: 0,
      qualityScore: 0,
      recommandationScore: 0,
      commentType: 1,
      commentOption: '品質好，態度佳，速度快，值得再次合作!',
      comment: '',
      hasSubmit: hasSubmit,
    };
    return (
      <Spin tip="讀取合作評價中" size="large" spinning={demandTitle === ''}>
        <Evaluate initialData={initialData} onSubmitEvaluation={this.onSubmitEvaluation} />
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  evaluateTopperInfo: state.common.evaluateTopperInfo,
});

const mapDispatchToProps = {
  loadAskReviewInfo,
  evaluateTopperFromEDM,
};

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationEDM);
