
import React from 'react';
import { Menu, Badge } from 'antd';
import * as chatmetaUtil from '../../util/chatmetaUtil';
import styles from './ChatMenu.scss';
import { CHAT_MOBILE_PAGE } from '../../config/constant';

const ChatMenu = ({
  mobilePageType, changeRoleTab, topperUnReadMsgCount, demanderUnReadMsgCount, isMobile, currentTab
}) => {
  // 手機版的渲染情境不同
  const isRenderMenu = ((isMobile && mobilePageType === CHAT_MOBILE_PAGE.chatlist) || !isMobile);
  return (
    isRenderMenu && (
    <div className={`${styles.sidebar} ${isMobile ? styles.mobile : ''}`}>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[chatmetaUtil.ROLE.TOPPER]}
        selectedKeys={[currentTab]}
        onClick={changeRoleTab}
      >
        <Menu.Item
          className={styles.item}
          key={chatmetaUtil.ROLE.DEMANDER}
        >
          <Badge count={demanderUnReadMsgCount} dot>我的高手</Badge>
        </Menu.Item>
        <Menu.Item
          className={styles.item}
          key={chatmetaUtil.ROLE.TOPPER}
        >
          <Badge count={topperUnReadMsgCount} dot>我的案主</Badge>
        </Menu.Item>
      </Menu>
    </div>
    )
  );
};

export default ChatMenu;
