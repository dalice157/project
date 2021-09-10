import React, { Component } from 'react';
import {
  Drawer, Rate
} from 'antd';
import { connect } from 'react-redux';
import Button from '../ui/button';
import styles from './Survey.scss';

import {
  // IM相關API
  inviteChat, acceptChat, rejectChat,
  askConfirmChat, confirmChat, unConfirmChat,
  askReview, reviewTopper,
  loadDemanderMenu, loadDemanderChatMeta, loadTopperChatMeta,
  loadDeskDemand, loadUnInviteDemands, loadUnConfirmDemands, loadGigs,
  // 回饋相關API
  saveDemanderSurvey,
  // Twilio相關API
  updateMessageCount, setMessageUnReadCount,
} from '../../actions/chatmeta_v2';
import {
  loadReportRecord,
  loadOtherReportRecord,
  loadReportDemandList,
  loadReportHim,
} from '../../actions/report';
import {
  loadStaticArea
} from '../../actions/common';

class Survey extends Component {
    state = {
      // 溝通滿意度
    //   surveyDrawerVisible: false,
      loading: false,
      communication: 0,
      description: 0,
      satisfaction: 0,
      roomId: '',
    };

    onSatisfactionSend = async (currentTab, selectedDemandId, selectTopperId, selectedDemanderId) => {
      const isDeamnder = currentTab == chatmetaUtil.ROLE.DEMANDER;
      const isTopper = currentTab == chatmetaUtil.ROLE.TOPPER;
      this.setState({ loading: true });
      let ranking = {
        roomId: this.state.roomId,
        ranking1: this.state.communication,
        ranking2: this.state.description,
        ranking3: this.state.satisfaction,
      };
      await this.props.saveDemanderSurvey(ranking);
      if (isDeamnder) {
        await this.props.loadDemanderChatMeta(selectedDemandId);
        await this.props.chooseTopper(selectTopperId);
      } else if (isTopper) {
        await this.props.loadTopperChatMeta();
        await this.props.chooseDemander(selectedDemanderId);
      }
      this.props.handleSurveyVisible(false);
    }

    /**
   * 溝通滿意度 - 對方的溝通態度
   */
  communicationChange = (value) => {
    console.log('communication:', value);
    this.setState({ communication: value });
  }

  /**
   * 溝通滿意度 - 對方說明清楚程度
   */
  descriptionChange = (value) => {
    console.log('description:', value);
    this.setState({ description: value });
  }

  /**
   * 溝通滿意度 - 整體溝通滿意度
   */
  satisfactionChange = (value) => {
    console.log('satisfaction:', value);
    this.setState({ satisfaction: value });
  }

  render() {
    const {
      handleSurveyVisible, surveyDrawerVisible, communication, description, satisfaction, currentTab, selectedDemandId, selectTopperId, selectedDemanderId
    } = this.props;
    const { loading } = this.state;
    return (
      <Drawer
        className={styles.wrap}
        title="您對本次的溝通滿意度如何?"
        placement="bottom"
        maskClosable={false}
        mask={false}
        onClose={handleSurveyVisible}
        visible={surveyDrawerVisible}
      >
        <div className={styles.rate}>
          <div className={styles.item}>
            <span>對方的溝通態度</span>
            <Rate allowHalf onChange={this.communicationChange} value={communication} />
          </div>
          <div className={styles.item}>
            <span>對方說明清楚程度</span>
            <Rate allowHalf onChange={this.descriptionChange} value={description} />
          </div>
          <div className={styles.item}>
            <span>整體溝通滿意度</span>
            <Rate allowHalf onChange={this.satisfactionChange} value={satisfaction} />
          </div>
        </div>
        <div className={styles.buttonWrap}>
          <Button
            loading={loading}
            onClick={() => this.onSatisfactionSend(currentTab, selectedDemandId, selectTopperId, selectedDemanderId)}
            type="danger"
          >送出
          </Button>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  area: state.common.area,
  chatmeta: state.chatmeta,
  imUnread: state.chatmeta.imUnread,
  demanderMenu: state.chatmeta.demanderMenu, // [需求者]開放中的需求列表
  deskDemand: state.chatmeta.deskDemand, // 聊天室進行中的需求
  demanderChatmeta: state.chatmeta.demanderChatmeta, // [高手]合作中或收到溝通邀請的[需求者]聊天室
  unInviteDemands: state.chatmeta.unInviteDemands, // 可快速發問之需求
  unConfirmDemands: state.chatmeta.unConfirmDemands, // 可回報合作之需求
  topperChatmeta: state.chatmeta.topperChatmeta, // [高手]合作中或收到溝通邀請的[需求者]聊天室
  topperGigs: state.chatmeta.gigs, // 成交評價時，可選取的服務項目
  // 檢舉相關 API
  reportRecord: state.report.reportRecord,
  otherReportRecord: state.report.otherReportRecord,
  reportDemandList: state.report.reportDemandList,
  reportHim: state.report.reportHim,
  // 需求相關 API
  saveDemand: state.chatmeta.saveDemand,
  defaultDemanderForm: state.chatmeta.defaultDemanderForm,
  activate: state.chatmeta.activate,
  paid: state.chatmeta.paid,
  // Verify
  verifySMS: state.common.verifySMS,
  verifyPhone: state.common.verifyPhone,
});


const mapDispatchToProps = {
  loadStaticArea,
  // IM相關API
  inviteChat,
  acceptChat,
  rejectChat,
  askConfirmChat,
  confirmChat,
  unConfirmChat,
  askReview,
  reviewTopper,
  loadDemanderMenu,
  loadDemanderChatMeta,
  loadTopperChatMeta,
  loadDeskDemand,
  loadUnInviteDemands,
  loadUnConfirmDemands,
  loadGigs,
  // 檢舉相關 API
  loadReportRecord,
  loadOtherReportRecord,
  loadReportDemandList,
  loadReportHim,
  // 回饋相關API
  saveDemanderSurvey,
  // Twilio相關API
  updateMessageCount,
  setMessageUnReadCount,
};


export default connect(mapStateToProps, mapDispatchToProps)(Survey);
