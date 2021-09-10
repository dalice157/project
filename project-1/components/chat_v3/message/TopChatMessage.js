import React from 'react';
import { uaIsMobile } from 'react-device-detect';

import styles from './TopChatMessage.scss';
import MessageHeader from './MessageHeader';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import * as chatmetaUtil from '../../../util/chatmetaUtil';
import * as demanderUtil from '../../../util/demanderUtil';

/**
 * 我的高手-聊天
 * @param {*} param0
 */
const TopChatMessage = ({
  topperMeta,
  topMessage,
  chatMessage,
  chatStatus,
  currentTab,
  userDenyNegotiating,
  roomId,
  isLoadingInitialMessages,
  reloadChatMeta,
  loadDeskDemand,
  confirmChat,
  disableForm,
  lastReadMessagesIndex,
  updateScrollMessage,
  user,
  area,
  isUploadingFile,
  messagesListRef,
  updateMessagesListRef,
  updateScrollSize,
  scrollMessageDown,
  isUserScrollToBottom,
  handleScrollDownStatus,
}) => {
  const {
    selectedDemand, channel, unInviteDemands, gigs, onChangeMobilePage
  } = topMessage;
  const {
    chatmeta, messages, onSendMessage, isLoadingNewMessage, isUploading, chatmetaEvent, addDemand
  } = chatMessage;
  const evaluableDemands = demanderUtil.getEvaluableDemands(chatmeta.deskDemand.deskItem);
  const modalCase = chatmeta.deskDemand && chatmeta.deskDemand.deskItem && chatmeta.deskDemand.deskItem.filter(demand => !['0'].includes(demand.dealStep));
  const isMobile = uaIsMobile();
  const isStylesMobile = isMobile ? styles.mobile : '';
  return (
    <div className={`${styles.messages} ${isStylesMobile}`}>
      <MessageHeader
        type="demander"
        deskDemand={chatmeta.deskDemand}
        chatRole={chatmetaUtil.ROLE.DEMANDER}
        topperMeta={topperMeta}
        modalCase={modalCase}
        gigs={gigs}
        onChangeMobilePage={onChangeMobilePage}
        currentTab={currentTab}
        roomId={roomId}
        userDenyNegotiating={userDenyNegotiating}
        reloadChatMeta={reloadChatMeta}
        loadDeskDemand={loadDeskDemand}
        confirmChat={confirmChat}
        disableForm={disableForm}
        chatmetaEvent={chatmetaEvent}
      />
      <MessageList
        selectedDemand={selectedDemand}
        modalCase={evaluableDemands}
        channel={channel}
        messages={messages}
        updateScrollMessage={updateScrollMessage}
        chatmeta={chatmeta}
        chatmetaEvent={chatmetaEvent}
        isLoadingNewMessage={isLoadingNewMessage}
        chatStatus={chatStatus}
        chatRole={chatmetaUtil.ROLE.DEMANDER}
        topperMeta={topperMeta}
        gigs={gigs}
        userDenyNegotiating={userDenyNegotiating}
        roomId={roomId}
        isLoadingInitialMessages={isLoadingInitialMessages}
        reloadChatMeta={reloadChatMeta}
        lastReadMessagesIndex={lastReadMessagesIndex}
        user={user}
        currentTab={currentTab}
        deskDemand={chatmeta.deskDemand}
        area={area}
        isUploadingFile={isUploadingFile}
        messagesListRef={messagesListRef}
        updateMessagesListRef={updateMessagesListRef}
        updateScrollSize={updateScrollSize}
        handleScrollDownStatus={handleScrollDownStatus}
      />
      <MessageForm
        type="demander"
        topperMeta={topperMeta}
        isUploading={isUploading}
        unInviteDemands={unInviteDemands}
        onSendMessage={onSendMessage}
        chatRole={chatmetaUtil.ROLE.DEMANDER}
        chatmetaEvent={chatmetaEvent}
        addDemand={addDemand}
        disableForm={disableForm}
        scrollMessageDown={scrollMessageDown}
        isUserScrollToBottom={isUserScrollToBottom}
      />
    </div>
  );
};

export default TopChatMessage;
