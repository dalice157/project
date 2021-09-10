import React from 'react';
import TopContactPerson from './TopContactPerson';
import CaseContactPerson from './CaseContactPerson';
import * as chatmetaUtil from '../../util/chatmetaUtil';
import { CHAT_MOBILE_PAGE } from '../../config/constant';

const ChatList = ({
  mobilePageType, isMobile, currentTab, isInitializing
}) => {
  if (isMobile && mobilePageType === CHAT_MOBILE_PAGE.chatroom) {
    return <></>;
  } else if (!isMobile && isInitializing) {
    return <div style={{ minWidth: '345px' }} />;
  } else if (currentTab === chatmetaUtil.ROLE.DEMANDER) {
    // 案主: 與高手溝通
    return (
      <TopContactPerson isMobile={isMobile} />
    );
  } else if (currentTab === chatmetaUtil.ROLE.TOPPER) {
    // 高手: 與案主溝通
    return (
      <CaseContactPerson isMobile={isMobile} />
    );
  } else {
    return <div style={{ width: '518px', height: '80vh', backgroundColor: 'white' }} />;
  }
};


export default ChatList;
