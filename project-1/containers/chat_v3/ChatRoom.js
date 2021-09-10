import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TopChatMessage from '../../components/chat_v3/message/TopChatMessage';
import CaseChatMessage from '../../components/chat_v3/message/CaseChatMessage';
import config from '../../config/config';
import {
  inviteChat, acceptChat, rejectChat, confirmChat, unConfirmChat, askReview, reviewTopper, loadTopperChatMeta, loadDeskDemand, loadUnInviteDemands, onSendMessage, onChangeMobilePage, reloadChatMeta, updateScrollMessage, handleTopperClick, activeChannel, uploadFile, downloadFile, askSingleConfirmChat, userDenyNegotiating
} from '../../actions/chatmeta_v2';
import * as chatmetaUtil from '../../util/chatmetaUtil';
import Button from '../../components/ui/button_v2';
import { CHAT_MOBILE_PAGE } from '../../config/constant';
/*
  TODO
  1. roomId, message搬來這
  */
class ChatRoom extends Component {
  state = {
    isUserScrollToBottom: false,
  }

  messagesListRef = null;

  updateMessagesListRef = (ref) => {
    this.messagesListRef = ref;
  }

  updateScrollSize = (scrollSize) => {
    this.messagesListRef.scrollTop = scrollSize;
  }

  handleScrollDownStatus = (event) => {
    const { isMobile } = this.props;
    const isMobileBrowser = isMobile && document.scrollingElement;
    const target = isMobileBrowser ? document.scrollingElement : event.target;
    const isUserScrollToBottom = target.scrollTop === (target.scrollHeight - target.offsetHeight);
    const isScrollStatusChanged = this.state.isUserScrollToBottom !== isUserScrollToBottom;
    if (isScrollStatusChanged) {
      this.setState({ isUserScrollToBottom: isUserScrollToBottom });
    }
  }

  scrollMessageDown = () => {
    const { isMobile } = this.props;
    const isMobileBrowser = isMobile && document.scrollingElement;
    if (isMobileBrowser) {
      document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
      this.messagesListRef.scrollTop = this.messagesListRef.scrollHeight;
    } else {
      this.messagesListRef.scrollTop = this.messagesListRef.scrollHeight;
    }
  }

  /**
   * 發送新訊息
   */
  // handleNewMessage = (newMessage) => {
  //   // console.log(`發送新訊息: ${newMessage} ${newMessage.length}`);
  //   if (this.props.activeChannel && newMessage.length > 0) {
  //     this.props.activeChannel.sendMessage(newMessage);
  //   }
  // };

  /**
   * 2 無法接案(action button: 1)
   */
  onRejectNegotating = async (attributes, demandId) => {
    console.log('無法接案', attributes);
    await this.props.rejectChat(demandId, this.props.roomId);
  }

  /**
   * 3 繼續溝通(action button: 1)
   */
  onAcceptNegotating = async (attributes, demandId) => {
    console.log('繼續溝通', attributes, demandId);
    await this.props.acceptChat(demandId, this.props.roomId);
  }

  /**
   * 3 查看其他高手
   */
  onCheckOtherTopper = attributes => (e) => {
    console.log('查看其他高手', attributes, e);
  }

  /**
   * 4, 5(action button: 快速發問其他需求)
   * @param {nember} topperBasidId
   * @param {string[]} demandList
   * 如果有下列 進行中案件，邀請的案件要直接到溝通中
   * 1. 溝通中（系統訊息4）
   * 2. 確認合作、已評價（系統訊息5）
   */
  onRequestQuickQAModal = async (topperBasidId, demandList) => {
    console.log('快速發問其他案件', topperBasidId, demandList);
    await this.props.inviteChat(topperBasidId, demandList);
    await this.props.loadDeskDemand(this.props.roomId);
    await this.props.loadUnInviteDemands(this.props.topperMeta.topperId);
  }

  /**
   * 6 (action button: 案主回報合作)
   * @param {nember} topperBasidId
   * @param {string} demandId
   */
  onDemanderReportCoperation = async (topperBasidId, demandId) => {
    console.log('案主回報合作', topperBasidId, demandId);
    await this.props.askSingleConfirmChat(this.props.roomId, demandId);
  }

  /**
   * 8 高手尚未確認合作(action button: 5, 6)
   */
  onTopperRejectCoperation = async (attributes) => {
    console.log('高手尚未確認合作', attributes);
    await this.props.unConfirmChat(this.props.roomId, [attributes.demandId]);
  }

  /**
   * 高手確認合作(action button: 5, 6)
   * - 發送系統訊息 7
   */
  onTopperAcceptCoperation = async (attributes) => {
    console.log('高手確認合作', attributes);
    await this.props.confirmChat(this.props.roomId, [attributes.demandId]);
    await this.props.loadTopperChatMeta();
  }

  /**
   * 9 高手回報合作
   */
  onTopperReportCoperation = async (demandId) => {
    console.log('高手回報合作', demandId);
    await this.props.askSingleConfirmChat(this.props.roomId, demandId);
  }

  /**
   * 10 案主確認合作(action button: 9)
   */
  onDemanderAcceptCoperation = async (attributes) => {
    console.log('案主確認合作', attributes);
    await this.props.confirmChat(this.props.roomId, [attributes.demandId]);
  }

  /**
   * 11 案主尚未確認合作(action button: 9)
   */
  onDemanderRejectCoperation = async (attributes) => {
    console.log('案主尚未確認合作', attributes);
    await this.props.unConfirmChat(this.props.roomId, [attributes.demandId]);
  }

  /**
   * 12 高手邀請合作評價
   */
  onTopperRequestEvaluation = (evaluateDemands, comment) => {
    const { roomId } = this.props;
    let review = {};

    evaluateDemands.forEach((demand) => {
      review = {
        askDescribe: comment,
        demandId: demand.demandId,
        gigId: demand.gigId
      };

      this.props.askReview(roomId, review);
    });
  }

  /**
   * 13 案主立即評價
   */
  onDemanderEvaluation = async (reviewBody) => {
    const { roomId, topperMeta } = this.props;
    console.log('案主送出立即評價', roomId, reviewBody);
    const reviewResponse = await this.props.reviewTopper(roomId, reviewBody);
    if (reviewResponse.payload && reviewResponse.payload.success) {
      this.props.handleTopperClick(topperMeta, this.props.user, this.props.deskDemand, this.props.currentTab, this.props.area);
    }
  }

  /**
   * 13, 14
   */
  onDemanderCheckOtherDemand = attributes => (e) => {
    console.log('查看我的需求', attributes, e);
    window.open(`${config.topSite.domain}/demand`);
  }

  render() {
    const {
      user, area, chatmeta, currentTab, onReportOther, chatStatus, selectedDemand, setDemandRef, topperMeta, demanderMeta, topperGigs, unInviteDemands, unConfirmDemands,
      messages, isLoadingNewMessage, isUploading, deskDemand, isLoadingInitialMessages, roomId, isMobile, mobilePageType, lastReadMessagesIndex, isUploadingFile
    } = this.props;


    // 與高手溝通
    const topMessage = {
      channel: activeChannel,
      selectedDemand: selectedDemand,
      setDemandRef: setDemandRef,
      topperMeta: topperMeta,
      gigs: topperGigs,
      unInviteDemands: unInviteDemands, // 快速發問其他需求
      unConfirmDemands: unConfirmDemands, // 可回報合作需求
      onChangeMobilePage: this.props.onChangeMobilePage,
    };
      // 高手: 與案主溝通
    const caseMessage = {
      channel: activeChannel,
      demanderMeta: demanderMeta,
      gigs: topperGigs,
      unConfirmDemands: unConfirmDemands, // 可回報合作需求
      onChangeMobilePage: this.props.onChangeMobilePage,
    };
    const chatMessage = {
      chatmeta: chatmeta,
      messages: messages,
      onSendMessage: this.props.onSendMessage,
      isLoadingNewMessage: isLoadingNewMessage,
      isUploading: isUploading,
      chatmetaEvent: {
        // TODO 分配到
        onRejectNegotating: this.onRejectNegotating,
        onAcceptNegotating: this.onAcceptNegotating,
        onCheckOtherTopper: this.onCheckOtherTopper,
        onRequestQuickQAModal: this.onRequestQuickQAModal,
        onDemanderReportCoperation: this.onDemanderReportCoperation,
        onTopperRejectCoperation: this.onTopperRejectCoperation,
        onTopperReportCoperation: this.onTopperReportCoperation,
        onTopperRequestEvaluation: this.onTopperRequestEvaluation,
        onTopperAcceptCoperation: this.onTopperAcceptCoperation,
        onDemanderAcceptCoperation: this.onDemanderAcceptCoperation,
        onDemanderRejectCoperation: this.onDemanderRejectCoperation,
        onDemanderCheckOtherDemand: this.onDemanderCheckOtherDemand,
        onDemanderEvaluation: this.onDemanderEvaluation,
        uploadFile: this.props.uploadFile,
        downloadFile: (media, sid) => this.props.downloadFile(media, sid, messages),
      },
      addDemand: <Button type="primary"><Link to="/caseForm">新增需求</Link></Button>,
    };
    const isTopperTab = currentTab === chatmetaUtil.ROLE.DEMANDER;
    // 對方是高手且刊登中
    const isTopperPublishing = topperMeta && topperMeta.publishing;
    const disableForm = (
      !chatStatus
      || chatStatus == ''
      || chatStatus == chatmetaUtil.ROOM_STATUS.INVITING
      || chatStatus == chatmetaUtil.ROOM_STATUS.CLOSE
      || isTopperTab && !isTopperPublishing
      || isLoadingInitialMessages
    );
    const isRenderChatroom = mobilePageType === CHAT_MOBILE_PAGE.chatroom && (currentTab === chatmetaUtil.ROLE.DEMANDER ? this.props.demanderChatmeta : this.props.topperChatmeta);
    if (isMobile && !isRenderChatroom) {
      return <></>;
    } else if (currentTab === chatmetaUtil.ROLE.DEMANDER) {
      return (
        <TopChatMessage
          area={area}
          user={user}
          roomId={roomId}
          currentTab={currentTab}
          deskDemand={deskDemand}
          topperMeta={topperMeta}
          topMessage={topMessage}
          chatMessage={chatMessage}
          chatStatus={chatStatus}
          onReportOther={onReportOther}
          disableForm={disableForm}
          lastReadMessagesIndex={lastReadMessagesIndex}
          userDenyNegotiating={this.props.userDenyNegotiating}
          isLoadingInitialMessages={isLoadingInitialMessages}
          reloadChatMeta={this.props.reloadChatMeta}
          loadDeskDemand={this.props.loadDeskDemand}
          confirmChat={this.props.confirmChat}
          updateScrollMessage={this.props.updateScrollMessage}
          isUploadingFile={isUploadingFile}
          messagesListRef={this.messagesListRef}
          updateMessagesListRef={this.updateMessagesListRef}
          updateScrollSize={this.updateScrollSize}
          scrollMessageDown={this.scrollMessageDown}
          isUserScrollToBottom={this.state.isUserScrollToBottom}
          handleScrollDownStatus={this.handleScrollDownStatus}
        />
      );
    } else {
      return (
        <CaseChatMessage
          area={area}
          user={user}
          roomId={roomId}
          currentTab={currentTab}
          deskDemand={deskDemand}
          caseMessage={caseMessage}
          chatMessage={chatMessage}
          chatStatus={chatStatus}
          disableForm={disableForm}
          onReportOther={onReportOther}
          isLoadingInitialMessages={isLoadingInitialMessages}
          lastReadMessagesIndex={lastReadMessagesIndex}
          userDenyNegotiating={this.props.userDenyNegotiating}
          reloadChatMeta={this.props.reloadChatMeta}
          loadDeskDemand={this.props.loadDeskDemand}
          confirmChat={this.props.confirmChat}
          updateScrollMessage={this.props.updateScrollMessage}
          isUploadingFile={isUploadingFile}
          messagesListRef={this.messagesListRef}
          updateMessagesListRef={this.updateMessagesListRef}
          updateScrollSize={this.updateScrollSize}
          scrollMessageDown={this.scrollMessageDown}
          isUserScrollToBottom={this.state.isUserScrollToBottom}
          handleScrollDownStatus={this.handleScrollDownStatus}
        />
      );
    }
  }
}
const mapStateToProps = state => ({
  user: state.user,
  area: state.common.area,
  chatmeta: state.chatmeta,
  deskDemand: state.chatmeta.deskDemand, // 聊天室進行中的需求
  demanderChatmeta: state.chatmeta.demanderChatmeta, // [高手]合作中或收到溝通邀請的[需求者]聊天室
  unInviteDemands: state.chatmeta.unInviteDemands, // 可快速發問之需求
  unConfirmDemands: state.chatmeta.unConfirmDemands, // 可回報合作之需求
  topperChatmeta: state.chatmeta.topperChatmeta, // [高手]合作中或收到溝通邀請的[需求者]聊天室
  topperGigs: state.chatmeta.gigs, // 成交評價時，可選取的服務項目
  currentTab: state.chatmeta.currentTab,
  selectedDemand: state.chatmeta.selectedDemand,
  isLoadingNewMessage: state.chatmeta.isLoadingNewMessage,
  topperMeta: state.chatmeta.topperMeta,
  demanderMeta: state.chatmeta.demanderMeta,
  roomId: state.chatmeta.roomId,
  messages: state.chatmeta.messages,
  chatStatus: state.chatmeta.chatStatus,
  mobilePageType: state.chatmeta.mobilePageType,
  isLoadingInitialMessages: state.chatmeta.isLoadingInitialMessages,
  lastReadMessagesIndex: state.chatmeta.lastReadMessagesIndex,
  isUploadingFile: state.chatmeta.isUploadingFile,
});

const mapDispatchToProps = {
  inviteChat,
  acceptChat,
  rejectChat,
  confirmChat,
  unConfirmChat,
  askReview,
  reviewTopper,
  loadTopperChatMeta,
  loadDeskDemand,
  loadUnInviteDemands,
  reloadChatMeta,
  updateScrollMessage,
  handleTopperClick,
  onSendMessage,
  onChangeMobilePage,
  uploadFile,
  downloadFile,
  askSingleConfirmChat,
  userDenyNegotiating,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
