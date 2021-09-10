import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import ChatMenu from '../../components/chat_v3/ChatMenu';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';
import { chkActiveProcess } from '../../actions/common';
import {
  exitMessageListener, initialChat, changeRoleTab, initializeTwilio
} from '../../actions/chatmeta_v2';
import HiddenOrderForm from '../../components/pay/HiddenOrderForm';
import styles from './App.scss';

class Chat extends Component {
  componentDidMount = () => {
    const { history } = this.props;
    const { demanderId, demandId, topperId } = history.location.query;
    // 初始化聊天室用到的資源
    this.props.chkActiveProcess().then(() => {
      this.props.initialChat(demanderId, demandId, topperId);
    });
  }

  componentWillUnmount = () => {
    this.props.exitMessageListener();
  }

  render() {
    const isMobile = uaIsMobile();
    const {
      mobilePageType, imUnread, isChatLoading, currentTab, user, isInitializedChatRole, hasInitialTwilio
    } = this.props;
    const { topperUnReadMsgCount, demanderUnReadMsgCount } = imUnread;
    const isInitializing = isChatLoading || !user.id || !isInitializedChatRole || !hasInitialTwilio;
    return (
      <Spin tip="讀取中" size="large" spinning={isInitializing}>
        <div className={`${styles.bg} ${isMobile ? styles.mobile : ''}`}>
          <div className={`${styles.wrap} ${isMobile ? styles.mobile : ''}`}>
            <ChatMenu
              isMobile={isMobile}
              currentTab={currentTab}
              topperUnReadMsgCount={topperUnReadMsgCount}
              demanderUnReadMsgCount={demanderUnReadMsgCount}
              mobilePageType={mobilePageType}
              changeRoleTab={this.props.changeRoleTab}
            />
            <div className={styles.messageWrap}>
              <ChatList
                isMobile={isMobile}
                isInitializing={isInitializing}
                currentTab={currentTab}
                mobilePageType={mobilePageType}
              />
              <ChatRoom isMobile={isMobile} />
            </div>
          </div>
          { this.props.paid && <HiddenOrderForm formData={this.props.paid} /> }
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  paid: state.chatmeta.paid,
  isChatLoading: state.chatmeta.isChatLoading,
  currentTab: state.chatmeta.currentTab,
  mobilePageType: state.chatmeta.mobilePageType,
  imUnread: state.chatmeta.imUnread,
  isInitializedChatRole: state.chatmeta.isInitializedChatRole,
  hasInitialTwilio: state.chatmeta.hasInitialTwilio,
});


const mapDispatchToProps = {
  initialChat,
  changeRoleTab,
  chkActiveProcess,
  initializeTwilio,
  exitMessageListener,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));
