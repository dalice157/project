import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { Description, ArrowForwardIos } from '@material-ui/icons';
import styles from './Message.scss';
import Button from '../../ui/button';
// import Avatar from '../../ui/avatar';
import CreateMarkup from '../../common_v2/CreateMarkup';
import EvaluationModal from '../EvaluationModal';
import { chatNotifyType } from '../../../config/selectData';
import * as chatmetaUtil from '../../../util/chatmetaUtil';
import { formatFileSize } from '../../../util/formatUtil';
/**
 * 聊天訊息
 */
class Message extends Component {
  static propTypes = {
    author: PropTypes.string,
    body: PropTypes.string.isRequired,
    me: PropTypes.bool,
    onRejectNegotating: PropTypes.func.isRequired,
    onAcceptNegotating: PropTypes.func.isRequired,
    onCheckOtherTopper: PropTypes.func.isRequired,
    onTopperRejectCoperation: PropTypes.func.isRequired,
    onTopperAcceptCoperation: PropTypes.func.isRequired,
    onDemanderRejectCoperation: PropTypes.func.isRequired,
    onDemanderAcceptCoperation: PropTypes.func.isRequired,
    onDemanderEvaluation: PropTypes.func.isRequired,
    onDemanderCheckOtherDemand: PropTypes.func.isRequired,
  }

  defaultEvaluation = {};

  state = {
    topperRejectNegotatingLoading: false,
    topperAcceptNegotatingLoading: false,
    topperAcceptCoperationLoading: false,
    topperRejectCoperationLoading: false,
    demanderRejectCoperationLoading: false,
    demanderAcceptCoperationLoading: false,
    loading: false,
    topperId: 0,
    ranking1Rating: 0,
    ranking2Rating: 0,
    ranking3Rating: 0,
    evaluationVisible: false,
    eveluateDemandId: this.props.modalCase && this.props.modalCase.length ? this.props.modalCase[0].demandId : '',
    gigId: this.props.gigs && this.props.gigs.length ? this.props.gigs[0].gigId : '',
    comment: chatmetaUtil.uiMessage.evaluate.evaluateTopper,
    notifyType: 2, // 1: 快速簡評, 2: 自行填寫評論
    isLoadingLeaveChat: false,
  };

  // eslint-disable-next-line no-unused-vars
  showEvaluationModal = (e) => {
    const { attributes } = this.props;

    if (attributes.type && attributes.type == chatmetaUtil.SYSTEM_MESSAGE.MESSAGE12.type) {
      this.defaultEvaluation.demandId = attributes.demandId; // 高手發送邀請的需求
      this.defaultEvaluation.gigId = attributes.gigId; // 依高手選擇送出的服務項
    } else {
      this.defaultEvaluation.demandId = this.props.selectedDemand.demandId; // 開啟的案件
      this.defaultEvaluation.gigId = ''; // 先不帶入任一項目
    }

    // 預設選項
    this.setState({
      evaluationVisible: true,
      eveluateDemandId: this.defaultEvaluation.demandId,
      topperId: this.props.topperMeta ? this.props.topperMeta.topperId : '',
      gigId: this.defaultEvaluation.gigId,
      comment: chatmetaUtil.uiMessage.evaluate.evaluateTopper,
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

  handleEvaluationOk = () => {
    this.setState({
      loading: true
    });

    let reviewBody = {
      demandId: this.state.eveluateDemandId,
      gigId: this.state.gigId,
      ranking1: this.state.ranking1Rating,
      ranking2: this.state.ranking2Rating,
      ranking3: this.state.ranking3Rating,
      comment: this.state.comment,
    };

    this.props.onDemanderEvaluation(reviewBody);

    setTimeout(() => {
      this.handleEvaluationCancel();
    }, 1000);
  }

  handleEvaluationCancel = () => {
    this.setState({
      loading: false,
      evaluationVisible: false,
      eveluateDemandId: this.props.modalCase.length ? this.props.modalCase[0].demandId : '',
      topperId: this.props.topperMeta ? this.props.topperMeta.topperId : '',
      gigId: this.props.gigs.length ? this.props.gigs[0].gigId : '',
      ranking1Rating: 0,
      ranking2Rating: 0,
      ranking3Rating: 0,
      comment: chatmetaUtil.uiMessage.evaluate.evaluateTopper,
      notifyType: 2,
    });
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
   * 評價高手: 服務的品質及滿意度
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

  // loading 效果
  handleTopperRejectNegotating = async (attributes, demandId) => {
    this.setState({ topperRejectNegotatingLoading: true, });
    await this.props.onRejectNegotating(attributes, demandId);
    this.setState({ topperRejectNegotatingLoading: false, });
  }

  // loading 效果
  handleTopperAcceptNegotating = async (attributes, demandId) => {
    this.setState({ topperAcceptNegotatingLoading: true, });
    await this.props.onAcceptNegotating(attributes, demandId);
    this.setState({ topperAcceptNegotatingLoading: false, });
  }

  // loading 效果
  handleTopperRejectCoperation = async (attributes) => {
    this.setState({ topperRejectCoperationLoading: true, });
    await this.props.onTopperRejectCoperation(attributes);
    this.setState({ topperRejectCoperationLoading: false, });
  }

  // loading 效果
  handleTopperAcceptCoperation = async (attributes) => {
    this.setState({ topperAcceptCoperationLoading: true, });
    await this.props.onTopperAcceptCoperation(attributes);
    this.setState({ topperAcceptCoperationLoading: false, });
  }

  // loading 效果
  handleDemanderRejectCoperation = async (attributes) => {
    this.setState({ demanderRejectCoperationLoading: true, });
    await this.props.onDemanderRejectCoperation(attributes);
    this.setState({ demanderRejectCoperationLoading: false, });
  }

  // loading 效果
  handleDemanderAcceptCoperation = async (attributes) => {
    this.setState({ demanderAcceptCoperationLoading: true, });
    await this.props.onDemanderAcceptCoperation(attributes);
    this.setState({ demanderAcceptCoperationLoading: false, });
  }

  onLeaveChatroom = async () => {
    this.setState({ isLoadingLeaveChat: true });
    const result = await this.props.userDenyNegotiating(this.props.roomId, false);
    if (result.payload.success) {
      this.props.reloadChatMeta();
    }
    this.setState({ isLoadingLeaveChat: false });
  }

  ActionButton = (attributes, deskDemand) => {
    const {
      topperRejectNegotatingLoading,
      topperAcceptNegotatingLoading,
      topperRejectCoperationLoading,
      topperAcceptCoperationLoading,
      demanderRejectCoperationLoading,
      demanderAcceptCoperationLoading,
    } = this.state;

    const actionButton = attributes && attributes.action_button;
    const demand = deskDemand.deskItem.find(tmpDemand => tmpDemand.demandId == attributes.demandId);

    switch (actionButton) {
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE1.action_button:
        return demand && demand.dealStep == chatmetaUtil.DEMAND_STEP.INVITING ? (
          <>
            <Button
              type={topperAcceptNegotatingLoading ? 'disabled' : ''}
              loading={topperRejectNegotatingLoading}
              onClick={() => this.handleTopperRejectNegotating(attributes, demand.demandId)}
            >無法接案
            </Button> &nbsp;&nbsp;
            <Button
              type={topperRejectNegotatingLoading ? 'disabled' : 'primary'}
              loading={topperAcceptNegotatingLoading}
              onClick={() => this.handleTopperAcceptNegotating(attributes, demand.demandId)}
            >繼續溝通
            </Button>
          </>
        ) : null;
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE3.action_button:
        // TODO: 導入該高手服務類型條件的高手列表
        return <Button onClick={this.props.onCheckOtherTopper(attributes)} href="/search?cats=1000000" target="_blank">查看其他高手</Button>;
      // case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE2.action_button:
      // case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE2_1.action_button:
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE5.action_button:
        return demand && demand.dealStep == chatmetaUtil.DEMAND_STEP.NEGOTIATING ? (
          <>
            <Button
              type={topperAcceptCoperationLoading ? 'disabled' : ''}
              loading={topperRejectCoperationLoading}
              onClick={() => this.handleTopperRejectCoperation(attributes)}
            >尚未確認合作
            </Button> &nbsp;&nbsp;
            <Button
              type={topperRejectCoperationLoading ? 'disabled' : 'primary'}
              loading={topperAcceptCoperationLoading}
              onClick={() => this.handleTopperAcceptCoperation(attributes)}
            >確認合作
            </Button>
          </>
        ) : null;
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE6.action_button:
        return demand && demand.dealStep == chatmetaUtil.DEMAND_STEP.NEGOTIATING ? (
          <>
            <Button
              type={topperAcceptCoperationLoading ? 'disabled' : ''}
              loading={topperRejectCoperationLoading}
              onClick={() => this.handleTopperRejectCoperation(attributes)}
            >尚未確認合作
            </Button> &nbsp;&nbsp;
            <Button
              type={topperRejectCoperationLoading ? 'disabled' : 'primary'}
              loading={topperAcceptCoperationLoading}
              onClick={() => this.handleTopperAcceptCoperation(attributes)}
            >確認合作
            </Button>
          </>
        ) : null;
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE9.action_button:
        return demand && demand.dealStep == chatmetaUtil.DEMAND_STEP.NEGOTIATING ? (
          <>
            <Button
              type={demanderAcceptCoperationLoading ? 'disabled' : ''}
              loading={demanderRejectCoperationLoading}
              onClick={() => this.handleDemanderRejectCoperation(attributes)}
            >尚未確認合作
            </Button> &nbsp;&nbsp;
            <Button
              type={demanderRejectCoperationLoading ? 'disabled' : 'primary'}
              loading={demanderAcceptCoperationLoading}
              onClick={() => this.handleDemanderAcceptCoperation(attributes)}
            >確認合作
            </Button>
          </>
        ) : null;
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE12.action_button:
        return demand && demand.dealStep == chatmetaUtil.DEMAND_STEP.COPERATION ? (<Button type="primary" onClick={this.showEvaluationModal}>立即評價</Button>) : null;
      case 'check_evaluate':
        return <Button>查看我的服務評價</Button>;
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE13.action_button:
        return <Button type="primary" onClick={this.props.onDemanderCheckOtherDemand(attributes)}>管理我的需求</Button>;
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE14.action_button:
        return <Button type="primary" onClick={this.props.onDemanderCheckOtherDemand(attributes)}>查看我的需求</Button>;
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE23.action_button:
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE23_1.action_button:
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE24.action_button:
      case chatmetaUtil.SYSTEM_MESSAGE.MESSAGE24_1.action_button:
        return <Button type="primary" onClick={this.onLeaveChatroom} loading={this.state.isLoadingLeaveChat}>退出</Button>;
      default:
        return null;
    }
  };


  // isAvatar = () => {
  //   const { chatRole, topperMeta } = this.props;
  //   return chatRole === chatmetaUtil.ROLE.DEMANDER && <a target="_blank" href={`/service/${topperMeta.topperId}`}><Avatar size={32} userImg={topperMeta.topperImg} /></a>;
  // };

  render() {
    // const classes = classNames('Message', {
    //   log: !this.props.author,
    //   me: this.props.me,
    // });
    const {
      me,
      body,
      attributes,
      gigs,
      chatmeta,
      timestamp,
      chatRole,
      showDate,
      hasReadMessage,
    } = this.props;
    const {
      eveluateDemandId,
      gigId,
      ranking1Rating,
      ranking2Rating,
      ranking3Rating,
      comment,
      loading,
      evaluationVisible,
      notifyType,
    } = this.state;
    const evaluateDemandChange = {
      eveluateDemandId: eveluateDemandId,
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
    };
    const isMobile = uaIsMobile();
    const isStyleMobile = isMobile ? styles.mobile : '';
    const timeStr = timestamp.toLocaleTimeString();

    return (
      <>
        { showDate
        && (
        <div className={`${styles.wrap}  ${isStyleMobile}`}>
          <div className={`${styles.dateWrap}`}>
            {showDate}
          </div>
        </div>
        )
        }
        <div className={`${attributes.sys_msg ? styles.sysMsg : ''} ${styles.wrap}  ${me ? styles.me : styles.other} ${isStyleMobile}`} ref={el => this.message = el}>
          { this.props.type == 'media'
            ? (
              <div className={`${styles.downloadFileWrap}`}>
                <div className={`${styles.downloadFile}`} onClick={() => this.props.downloadFile(this.props.media, this.props.sid)}>
                  <div className={`${styles.downloadWrap}`}>
                    <Description />
                    <div className={`${styles.fileDesc}`}>
                      <p className={`${styles.fileName}`}>
                        { this.props.media.filename }
                      </p>
                      <p className={`${styles.fileSize}`}>
                        檔案大小：{formatFileSize(this.props.media.size)}
                      </p>
                    </div>
                  </div>
                  <ArrowForwardIos style={{ fontSize: '12px', marginLeft: '10px' }} />
                </div>
                <div className={`${styles.messageNote}`}>
                  { me && hasReadMessage && <p>已讀</p> }
                  <p>{timeStr.slice(0, timeStr.length - 3)}</p>
                </div>
              </div>
            )
            : (
              <div className={`${styles.messageWrap}`}>
                <div className={styles.message}>
                  <CreateMarkup text={body} />
                </div>
                <div className={`${styles.messageNote}`}>
                  { me && hasReadMessage && <p>已讀</p> }
                  <p>{timeStr.slice(0, timeStr.length - 3)}</p>
                </div>
              </div>
            )
          }
          <div className={styles.btnWrap}>
            {this.ActionButton(attributes, chatmeta.deskDemand)}
          </div>
          <EvaluationModal
            chatRole={chatRole}
            topperMeta={this.props.topperMeta}
            evaluableDemands={this.props.modalCase}
            gigs={gigs}
            loading={loading}
            visible={evaluationVisible}
            onOk={this.handleEvaluationOk}
            onCancel={this.handleEvaluationCancel}
            // onChange={this.handleChange}
            onEvaluateDemandChange={evaluateDemandChange}
            defaultEvaluation={this.defaultEvaluation}
            notifyType={notifyType}
            onNotifyTypeChange={this.handleNotifyTypeChange}
          />
        </div>
      </>
    );
  }
}

export default Message;
