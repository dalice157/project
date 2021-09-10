import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Modal } from 'antd';
import Button from '../ui/button';
import styles from './StatusButton.scss';
import EvaluationModal from './EvaluationModal';
import { chatNotifyType } from '../../config/selectData';
import * as chatmetaUtil from '../../util/chatmetaUtil';
import { COOPERATE_TYPE } from '../../config/constant';

class StatusButton extends Component {
  static propTypes = {
    chatRole: PropTypes.string.isRequired,
    chatStatus: PropTypes.string.isRequired,
    gigs: PropTypes.array.isRequired,
    chatmetaEvent: PropTypes.object.isRequired,
    topperMeta: PropTypes.object, // for 案主
  }

  constructor(props) {
    super(props);
    const { evaluableDemands, gigs } = props;
    this.state = {
      loading: false,
      topperId: 0,
      selectedDemand: [],
      // 合作評價
      evaluationVisible: false,
      eveluateDemandId: evaluableDemands.length ? evaluableDemands[0].demandId : '',
      gigId: gigs.length ? gigs[0].gigId : '',
      ranking1Rating: 0,
      ranking2Rating: 0,
      ranking3Rating: 0,
      comment: '好溝通，設計符合需求，值得再次合作!',
      // 邀請案主評價
      evaluateDemands: [],
      notifyType: 2, // 1: 快速簡評, 2: 自行填寫評論
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.evaluableDemands != prevProps.evaluableDemands) {
      if (this.props.chatRole === chatmetaUtil.ROLE.DEMANDER) { // 預設選項
        this.setState({
          eveluateDemandId: this.props.evaluableDemands.length ? this.props.evaluableDemands[0].demandId : '',
          topperId: this.props.topperMeta ? this.props.topperMeta.topperId : '',
          gigId: this.props.gigs.length ? this.props.gigs[0].gigId : '',
          comment: chatmetaUtil.uiMessage.evaluate.evaluateTopper,
        });
      } else {
        this.setState({
          comment: chatmetaUtil.uiMessage.evaluate.askDemander,
        });
      }
    }
  }

  /**
   * 開啟回報合作
   */
  showReturnModal = (target, demandId, type, roomId, chatRole, topperMeta) => {
    // type [0: 回報合作, 1: 確認合作]
    // TODO: demandIdList變成demandId
    const targetDate = dayjs(target).format('YYYY/MM/DD');
    const today = dayjs().format('YYYY/MM/DD');
    if (targetDate === today) {
      Modal.info({
        content: <b>今日已回報過，無法再次回報。</b>,
        okText: '確認',
      });
    } else if (chatRole === chatmetaUtil.ROLE.DEMANDER) {
      // ReportTopper
      if (type === COOPERATE_TYPE.report) {
        Modal.confirm({
          title: '請確認',
          content: '您是否確認想邀請高手此案件？確認後，將同步發送邀請合作通知給高手，合作需待高手確認回覆同意合作。',
          okText: '確認邀請',
          cancelText: '取消',
          onOk: async () => {
            await this.props.chatmetaEvent.onDemanderReportCoperation(topperMeta.topperId, demandId);
            this.props.loadDeskDemand(roomId);
          }
        });
      } else if (type === COOPERATE_TYPE.confirm) {
        Modal.confirm({
          title: '請確認',
          content: '高手主動邀請您合作此案件，您是否確認要與此高手合作？確認後，將同步回覆高手您確認合作通知。',
          okText: '確認合作',
          cancelText: '取消',
          onOk: async () => {
            await this.props.confirmChat(roomId, [demandId]);
            this.props.loadDeskDemand(roomId);
          }
        });
      }
    } else if (chatRole === chatmetaUtil.ROLE.TOPPER) {
      // ReportDemander
      if (type === COOPERATE_TYPE.report) {
        Modal.confirm({
          title: '回報合作',
          content: (
            <>
              <p>您確認要向案主回報合作嗎？</p><br />
              <p>按下「確認」後，將會通知案主你的回報，請案主確認合作! 以利後續溝通並累積您的成交評價！ </p>
            </>
          ),
          okText: '確認',
          cancelText: '取消',
          onOk: async () => {
            await this.props.chatmetaEvent.onTopperReportCoperation(demandId);
            this.props.loadDeskDemand(roomId);
          }
        });
      } else if (type === COOPERATE_TYPE.confirm) {
        Modal.confirm({
          title: '確認合作',
          content: (
            <>
              <p>您確認已與案主完成溝通並已確定合作嗎?</p><br />
              <p>按下「送出」後，將會通知案主你已確認合作! 以後續溝通及評價！</p>
            </>
          ),
          okText: '送出',
          cancelText: '取消',
          onOk: async () => {
            await this.props.confirmChat(roomId, [demandId]);
            this.props.loadDeskDemand(roomId);
          }
        });
      }
    }
  }

  /**
   * 開啟合作評價 modal
   */
  showEvaluationModal = (target, setDropdownUnVisible) => {
    const targetDate = dayjs(target).format('YYYY/MM/DD');
    const today = dayjs().format('YYYY/MM/DD');
    if (targetDate === today) {
      Modal.info({
        content: <b>本日已邀請過，每日限邀請 1 次</b>,
        okText: '確認',
      });
    } else {
      setDropdownUnVisible && setDropdownUnVisible();
      this.setState({
        evaluationVisible: true,
      });
    }
  }

  /**
   * 高手邀請評價 - 需求
   */
  handleDemandsChange = (checkedValues) => {
    let evaluateDemands = this.state.evaluateDemands;
    evaluateDemands = evaluateDemands.filter(evaluateDemand => checkedValues.includes(evaluateDemand.demandId)); // filter 服務項目

    this.setState({
      selectedDemand: checkedValues,
      evaluateDemands: evaluateDemands
    });
  };

  /**
   * 高手邀請評價 - 服務項目
   */
  handleGigsChange = (gigId, demand) => {
    let evaluateDemands = this.state.evaluateDemands;

    if (this.isDemandSelected(demand)) {
      if (evaluateDemands.some(evaluateDemand => evaluateDemand.demandId === demand.demandId)) { // 更新服務項目
        evaluateDemands.forEach((evaluateDemand) => {
          if (evaluateDemand.demandId === demand.demandId) {
            evaluateDemand.gigId = gigId;
          }
        });
      } else { // 新增服務項目
        evaluateDemands = [{
          demandId: demand.demandId,
          gigId: gigId,
        }, ...evaluateDemands];
      }
    } else { // 移除服務項目
      evaluateDemands = evaluateDemands
        .filter(evaluateDemand => this.state.selectedDemand
          .includes(evaluateDemand.demandId));
    }

    this.setState({
      gigId: gigId,
      evaluateDemands: evaluateDemands
    });
  }

  /**
   * 高手邀請評價 - 通知訊息類別
   */
  handleNotifyTypeChange = (e) => {
    const notifyType = e.target.value;
    const comment = notifyType == chatNotifyType[0].value ? '好溝通' : this.state.comment;

    this.setState({
      notifyType: notifyType,
      comment: comment,
    });
  }

  /**
   * 高手邀請評價 - 通知訊息
   */
  handleCommentTextChange = (event) => {
    this.setState({ comment: event.target.value });
  }

  isDemandSelected = (demand) => {
    return this.state.selectedDemand.includes(demand.demandId);
  }

  /**
   * 關閉合作評價 modal
   */
  handleEvaluationCancel = () => {
    this.setState({
      loading: false,
      topperId: this.props.topperMeta ? this.props.topperMeta.topperId : '',
      selectedDemand: [],
      evaluationVisible: false,
      eveluateDemandId: this.props.evaluableDemands.length ? this.props.evaluableDemands[0].demandId : '',
      gigId: this.props.gigs.length ? this.props.gigs[0].gigId : '',
      ranking1Rating: 0,
      ranking2Rating: 0,
      ranking3Rating: 0,
      comment: this.props.chatRole === chatmetaUtil.ROLE.DEMANDER
        ? chatmetaUtil.uiMessage.evaluate.evaluateTopper
        : chatmetaUtil.uiMessage.evaluate.askDemander,
      evaluateDemands: [],
      notifyType: 2,
    });
  }

  handleEvaluationOk = async () => {
    this.setState({ loading: true });
    if (this.props.chatRole === chatmetaUtil.ROLE.DEMANDER) { // 案主合作評價
      let reviewBody = {
        demandId: this.state.eveluateDemandId,
        gigId: this.state.gigId,
        ranking1: this.state.ranking1Rating,
        ranking2: this.state.ranking2Rating,
        ranking3: this.state.ranking3Rating,
        comment: this.state.comment,
      };

      await this.props.chatmetaEvent.onDemanderEvaluation(reviewBody);
    } else { // 高手邀請評價
      await this.props.chatmetaEvent.onTopperRequestEvaluation(this.state.evaluateDemands, this.state.comment);
    }
    this.props.loadDeskDemand(this.props.roomId);
    setTimeout(() => {
      this.handleEvaluationCancel();
      // this.setState({ loading: false, evaluationVisible: false });
    }, 3000);
  }

  /**
   * 評價高手: 需求
   */
  handleDemandChange = (value) => {
    this.setState({
      eveluateDemandId: value
    });
  }

  /**
   * 評價高手: 高手
   */
  handleTopperChange = (value) => {
    this.setState({
      topperId: value
    });
  }

  /**
   * 評價高手: 服務項目
   */
  handleGigChange = (value) => {
    this.setState({
      gigId: value
    });
  }

  /**
   * 評價高手: 溝通及處理的態度
   */
  ranking1RatingChange = (value) => {
    this.setState({
      ranking1Rating: value
    });
  }

  /**
   * 評價高手: 服務的品質滿意度
   */
  ranking2RatingChange = (value) => {
    this.setState({
      ranking2Rating: value
    });
  }

  /**
   * 評價高手: 是否會推薦給朋友
   */
  ranking3RatingChange = (value) => {
    this.setState({
      ranking3Rating: value
    });
  }

  /**
   * 評價高手: 簡評
   */
  handleCommentChange = (value) => {
    const comment = typeof value == 'object' ? value.target.value : value;

    this.setState({
      comment: comment
    });
  }

  renderDealButton = (chatRole, dealStep, demand, roomId, topperMeta, setDropdownUnVisible) => {
    const {
      topperId, demandId, topperReplyDate, demanderReplyDate
    } = demand;
    const type = 'primary';
    const isDemanderReplied = demanderReplyDate;
    const isTopperReplied = topperReplyDate;
    const evaluationPath = '/evaluation/' + topperId;

    if (chatRole === chatmetaUtil.ROLE.DEMANDER) {
      // 我的高手[案主視角]
      switch (dealStep) {
        case chatmetaUtil.DEMAND_STEP.NEGOTIATING: {
          if (!isTopperReplied && !isDemanderReplied) {
            return <Button onClick={() => this.showReturnModal(demanderReplyDate, demandId, COOPERATE_TYPE.report, roomId, chatRole, topperMeta)} type={type}>回報合作</Button>;
          } else if (!isTopperReplied && isDemanderReplied) {
            return <Button onClick={() => this.showReturnModal(demanderReplyDate, demandId, COOPERATE_TYPE.report, roomId, chatRole, topperMeta)} type={type}>再次回報合作</Button>;
          } else if (isTopperReplied && !isDemanderReplied) {
            return <Button onClick={() => this.showReturnModal(demanderReplyDate, demandId, COOPERATE_TYPE.confirm, roomId, chatRole, topperMeta)} type={type}>確認合作</Button>;
          } else {
            return <></>;
          }
        }
        case chatmetaUtil.DEMAND_STEP.COPERATION: {
          return <Button onClick={() => this.showEvaluationModal(demanderReplyDate, setDropdownUnVisible)} type={type}>合作評價</Button>;
        }
        case chatmetaUtil.DEMAND_STEP.EVALUATION: {
          return <span className={styles.evaluation} onClick={(event) => { event.preventDefault(); open(evaluationPath, '_blank'); }}>已評價</span>;
        }
        default:
          return <></>;
      }
    } else {
      // 我的案主[高手視角]
      switch (dealStep) {
        case chatmetaUtil.DEMAND_STEP.NEGOTIATING: {
          if (!isTopperReplied && !isDemanderReplied) {
            return <Button onClick={() => this.showReturnModal(topperReplyDate, demandId, COOPERATE_TYPE.report, roomId, chatRole, topperMeta)} type={type}>回報合作</Button>;
          } else if (!isTopperReplied && isDemanderReplied) {
            return <Button onClick={() => this.showReturnModal(topperReplyDate, demandId, COOPERATE_TYPE.confirm, roomId, chatRole, topperMeta)} type={type}>確認合作</Button>;
          } else if (isTopperReplied && !isDemanderReplied) {
            return <Button onClick={() => this.showReturnModal(topperReplyDate, demandId, COOPERATE_TYPE.report, roomId, chatRole, topperMeta)} type={type}>再次回報合作</Button>;
          } else {
            return <></>;
          }
        }
        case chatmetaUtil.DEMAND_STEP.COPERATION: {
          return <><Button onClick={() => this.showEvaluationModal(topperReplyDate, setDropdownUnVisible)} type={type}>{isTopperReplied ? '再次邀請評價' : '邀請評價'}</Button></>;
        }
        case chatmetaUtil.DEMAND_STEP.EVALUATION: {
          return <span className={styles.evaluation} onClick={(event) => { event.preventDefault(); open(evaluationPath, '_blank'); }}>已評價</span>;
        }
        default:
          return <></>;
      }
    }
  }

  render() {
    const {
      chatRole,
      chatStatus,
      gigs,
      demand,
      roomId,
      setDropdownUnVisible,
      topperMeta,
      evaluableDemands,
    } = this.props;
    const {
      eveluateDemandId,
      reportableDemandId,
      gigId,
      ranking1Rating,
      ranking2Rating,
      ranking3Rating,
      comment,
      selectedDemand,
      evaluateDemands,
      loading,
      evaluationVisible,
      notifyType
    } = this.state;
    const evaluateDemandChange = chatRole === chatmetaUtil.ROLE.DEMANDER
      ? {
        eveluateDemandId: eveluateDemandId,
        reportableDemandId: reportableDemandId,
        gigId: gigId,
        starChange: {
          ranking1Rating: ranking1Rating,
          ranking2Rating: ranking2Rating,
          ranking3Rating: ranking3Rating,
          ranking1RatingChange: this.ranking1RatingChange,
          ranking2RatingChange: this.ranking2RatingChange,
          ranking3RatingChange: this.ranking3RatingChange
        },
        comment: comment,
        onDemandChange: this.handleDemandChange,
        onTopperChange: this.handleTopperChange,
        onGigChange: this.handleGigChange,
        onCommentChange: this.handleCommentChange,
      } : {
        eveluateDemandId: selectedDemand,
        evaluateDemands: evaluateDemands,
        reportableDemandId: reportableDemandId,
        onDemandChange: this.handleDemandsChange,
        onGigChange: this.handleGigsChange,
        onCommentChange: this.handleCommentTextChange,
      };
    return (
      <>
        {this.renderDealButton(chatRole, chatStatus, demand, roomId, topperMeta, setDropdownUnVisible)}
        <EvaluationModal
          chatRole={chatRole}
          topperMeta={topperMeta}
          evaluableDemands={evaluableDemands}
          gigs={gigs}
          loading={loading}
          visible={evaluationVisible}
          onOk={this.handleEvaluationOk}
          onCancel={this.handleEvaluationCancel}
          onEvaluateDemandChange={evaluateDemandChange}
          notifyType={notifyType}
          onNotifyTypeChange={this.handleNotifyTypeChange}
        />
      </>
    );
  }
}

export default StatusButton;
