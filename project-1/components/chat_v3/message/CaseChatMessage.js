import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import styles from './CaseChatMessage.scss';
import MessageHeader from './MessageHeader';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import * as chatmetaUtil from '../../../util/chatmetaUtil';
import {
  userDenyNegotiating, reloadChatMeta, loadDeskDemand,
} from '../../../actions/chatmeta_v2';

/**
 * 我的案主-聊天
 */
class CaseChatMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: true,
    };
  }

  render() {
    const {
      deskDemand,
      caseMessage,
      chatMessage,
      currentTab,
      roomId,
      isLoadingInitialMessages,
      confirmChat,
      disableForm,
      lastReadMessagesIndex,
      updateScrollMessage,
      area,
      user,
      isUploadingFile,
      messagesListRef,
      updateMessagesListRef,
      updateScrollSize,
      scrollMessageDown,
      isUserScrollToBottom,
      handleScrollDownStatus,
    } = this.props;
    const {
      demanderMeta,
      gigs,
      onChangeMobilePage
    } = caseMessage;
    const {
      chatmeta,
      messages,
      onSendMessage,
      isLoadingNewMessage,
      isUploading,
      chatmetaEvent,
    } = chatMessage;
    const modalCase = deskDemand && deskDemand.deskItem && deskDemand.deskItem.filter(demand => !['0'].includes(demand.dealStep));
    const isMobile = uaIsMobile();
    const isStylesMobile = isMobile ? styles.mobile : '';

    return (
      <div className={`${styles.messages} ${isStylesMobile}`}>
        <MessageHeader
          type="topper"
          deskDemand={deskDemand}
          chatRole={chatmetaUtil.ROLE.TOPPER}
          demanderMeta={demanderMeta}
          modalCase={modalCase}
          gigs={gigs}
          chatmetaEvent={chatmetaEvent}
          onChangeMobilePage={onChangeMobilePage}
          currentTab={currentTab}
          userDenyNegotiating={this.props.userDenyNegotiating}
          roomId={roomId}
          reloadChatMeta={this.props.reloadChatMeta}
          loadDeskDemand={this.props.loadDeskDemand}
          confirmChat={confirmChat}
          disableForm={disableForm}
        />
        <MessageList
          demanderMeta={demanderMeta}
          messages={messages}
          updateScrollMessage={updateScrollMessage}
          isLoadingNewMessage={isLoadingNewMessage}
          chatmeta={chatmeta}
          chatmetaEvent={chatmetaEvent}
          setDropdownUnVisible={this.setDropdownUnVisible}
          isLoadingInitialMessages={isLoadingInitialMessages}
          userDenyNegotiating={this.props.userDenyNegotiating}
          roomId={roomId}
          reloadChatMeta={this.props.reloadChatMeta}
          lastReadMessagesIndex={lastReadMessagesIndex}
          user={user}
          currentTab={currentTab}
          deskDemand={deskDemand}
          area={area}
          isUploadingFile={isUploadingFile}
          messagesListRef={messagesListRef}
          updateMessagesListRef={updateMessagesListRef}
          updateScrollSize={updateScrollSize}
          handleScrollDownStatus={handleScrollDownStatus}
        />
        <MessageForm
          type="topper"
          isUploading={isUploading}
          unInviteDemands={[]}
          chatRole={chatmetaUtil.ROLE.TOPPER}
          onSendMessage={onSendMessage}
          chatmetaEvent={chatmetaEvent}
          disableForm={disableForm}
          scrollMessageDown={scrollMessageDown}
          isUserScrollToBottom={isUserScrollToBottom}
        />
      </div>
    );
  }
}


const mapStateToProps = state => ({
  user: state.user,
  area: state.area,
  paid: state.chatmeta.paid,
  deskDemand: state.chatmeta.deskDemand,
  isChatLoading: state.chatmeta.isChatLoading,
  currentTab: state.chatmeta.currentTab,
  mobilePageType: state.chatmeta.mobilePageType,
  imUnread: state.chatmeta.imUnread,
  isInitializedChatRole: state.chatmeta.isInitializedChatRole,
  hasInitialTwilio: state.chatmeta.hasInitialTwilio,
  roomId: state.chatmeta.roomId,
  isLoadingInitialMessages: state.chatmeta.isLoadingInitialMessages,
  isUploadingFile: state.chatmeta.isUploadingFile,
});


const mapDispatchToProps = {
  userDenyNegotiating,
  reloadChatMeta,
  loadDeskDemand,
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseChatMessage);
