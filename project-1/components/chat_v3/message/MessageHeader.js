import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { Menu, Icon, Modal } from 'antd';

import {
  ArrowBack, MoreVert
} from '@material-ui/icons';
import defaultAvatar from '../../../img/common_v2/avatar-default-square.svg';
import config from '../../../config/config';
import Avatar from '../../ui/avatar';
import Dropdown from '../../ui/dropdown';
import CaseMenu from './CaseMenu';
import styles from './Message.scss';
import * as chatmetaUtil from '../../../util/chatmetaUtil';
import * as topperUtil from '../../../util/topperUtil';
import Button from '../../ui/button_v2';
import { CHAT_MOBILE_PAGE } from '../../../config/constant';

class MessageHeader extends Component {
  state = {
    visibleLeaveAllChat: false,
    loadingLeaveAllChatButton: '',
    isOpenDemandList: false,
  }

  renderTitle = (chatRole, topperMeta, demanderMeta) => {
    if (chatRole === chatmetaUtil.ROLE.DEMANDER) {
      return topperMeta && <a className={styles.userName} target="_blank" href={`/service/${topperMeta.topperId}`}>{topperMeta.topperName}</a>;
    } else {
      return demanderMeta && <p className={styles.userName}>{demanderMeta.demanderName || ''}</p>;
    }
  }

  renderAvatar = (chatRole, topperMeta) => {
    const disabledLinkStyle = !(topperMeta && topperMeta.topperId) ? styles.disableAvatar : '';
    if (topperMeta && chatRole === chatmetaUtil.ROLE.DEMANDER) {
      return (
        <a className={`${disabledLinkStyle}`} target="_blank" href={`/service/${topperMeta.topperId}`}>
          <Avatar size={32} userImg={topperMeta.topperImg || defaultAvatar} />
        </a>
      );
    }
  };

  onLeaveChatroom = (roomId, deskDemand, chatRole) => {
    const { chatMetaStatus, deskItem } = deskDemand;
    const isAllDealCommunicating = chatMetaStatus === 1 && (deskItem && deskItem.every(demand => demand.dealStep === '1'));
    const isCooperating = deskItem.find(demand => ['2', '3'].includes(demand.dealStep));
    const isTopperNotReply = chatMetaStatus === 0 && chatRole === chatmetaUtil.ROLE.DEMANDER;
    let deny = false;

    if (chatMetaStatus === 0 && chatRole === chatmetaUtil.ROLE.TOPPER) {
      deny = true;
    }

    if (isCooperating) {
      Modal.error({
        title: '有合作中案件，不可退出聊天室！',
        okText: '確認',
        maskClosable: true,
      });
    } else if (isTopperNotReply) {
      Modal.error({
        title: '高手尚未回覆邀請，不可退出聊天室！ ',
        okText: '確認',
        maskClosable: true,
      });
    } else if (isAllDealCommunicating) {
      this.setState({ visibleLeaveAllChat: true });
    } else {
      Modal.confirm({
        title: '退出聊天室',
        content: '您確定要退出聊天室嗎？',
        okText: '確認',
        cancelText: '否',
        onOk: async () => {
          const result = await this.props.userDenyNegotiating(roomId, deny);
          if (result.payload.success) {
            this.props.reloadChatMeta();
          }
        },
        maskClosable: true,
      });
    }
  }

  DropdownMenu = (disabledLeaveChatroom, currentTab, roomId, deskDemand, chatRole) => {
    const manageText = currentTab === chatmetaUtil.ROLE.DEMANDER ? '發案管理中心' : '接案管理中心';
    const manageLink = currentTab === chatmetaUtil.ROLE.DEMANDER ? '/demand' : '/topper-dashboard/home';
    return (
      <Menu>
        <Menu.Item key="0">
          <Link to={manageLink}>{manageText}</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <a href={`${config.contentSite.domain}/faq/`} target="_blank">常見問題</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href={`${config.contentSite.domain}/contract-download/`} target="_blank">合約範本</a>
        </Menu.Item>
        <Menu.Item key="3" disabled={disabledLeaveChatroom} onClick={() => this.onLeaveChatroom(roomId, deskDemand, chatRole)}>
          <p>退出聊天室</p>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const {
      visibleLeaveAllChat,
      loadingLeaveAllChatButton,
      isOpenDemandList,
    } = this.state;
    const {
      type,
      deskDemand,
      chatRole,
      modalCase,
      topperMeta,
      gigs,
      chatmetaEvent,
      onChangeMobilePage,
      currentTab,
      roomId,
      demanderMeta,
      setDropdownUnVisible,
      loadDeskDemand,
      confirmChat,
      disableForm,
    } = this.props;

    const isMobile = uaIsMobile();
    const isDropdownMobile = isMobile ? 'bottomRight' : 'bottomCenter';
    const isStyleMobile = isMobile ? styles.mobile : '';
    const drawerDemanders = topperUtil.getDrawerCase(modalCase);
    const drawerDemandersCount = drawerDemanders.length;
    // 案主視角
    const isDemander = type === 'demander';
    // 對方是高手且刊登中
    const isTopperPublishing = topperMeta && topperMeta.publishing;
    const shouldOpenDropdown = isDemander ? isTopperPublishing && (drawerDemandersCount >= 1) : drawerDemandersCount >= 1;
    const disableDropdownStyle = !shouldOpenDropdown || disableForm || drawerDemandersCount < 1 ? styles.disableDropdown : '';
    const disabledLeaveChatroom = !roomId;
    return (
      <>
        <div className={`${styles.header} ${isStyleMobile}`}>
          <div className={styles.mainHeader}>
            <div className={styles.userWrap}>
              {
              isMobile
              && (
              <div className={styles.arrow} onClick={() => onChangeMobilePage(CHAT_MOBILE_PAGE.chatlist)}>
                <ArrowBack />
              </div>
              )
            }
              {this.renderAvatar(chatRole, topperMeta)}
              {this.renderTitle(chatRole, topperMeta, demanderMeta)}
            </div>
            <div className={styles.dropdownArea}>
              <div className={`${styles.demandlistTrigger} ${disableDropdownStyle}`} onClick={() => shouldOpenDropdown && this.setState({ isOpenDemandList: !isOpenDemandList })}>
                所有案件（{drawerDemandersCount || '－'}） <Icon type="down" />
              </div>
              <Dropdown className={styles.bar} overlay={() => this.DropdownMenu(disabledLeaveChatroom, currentTab, roomId, deskDemand, chatRole)} placement={isDropdownMobile}>
                <a className="ant-dropdown-link" href="#">
                  <MoreVert />
                </a>
              </Dropdown>
            </div>
          </div>
          {
            isOpenDemandList && !disableForm && (
            <div className={styles.caseList}>
              <CaseMenu
                chatRole={chatRole}
                topperMeta={topperMeta}
                modalCase={modalCase}
                gigs={gigs}
                chatmetaEvent={chatmetaEvent}
                setDropdownUnVisible={setDropdownUnVisible}
                loadDeskDemand={loadDeskDemand}
                roomId={roomId}
                confirmChat={confirmChat}
              />
            </div>
            )
            }
        </div>
        <Modal
          visible={visibleLeaveAllChat}
          title="退出聊天室"
          footer={[
            <Button
              loading={loadingLeaveAllChatButton === 'rejectAndExit'}
              onClick={async () => {
                this.setState({ loadingLeaveAllChatButton: 'rejectAndExit' });
                const result = await this.props.userDenyNegotiating(roomId, true);
                if (result.payload.success) {
                  this.props.reloadChatMeta();
                }
                this.setState({
                  visibleLeaveAllChat: false,
                  loadingLeaveAllChatButton: '',
                });
              }}
            >婉拒並退出
            </Button>,
            <Button
              loading={loadingLeaveAllChatButton === 'exit'}
              onClick={async () => {
                this.setState({ loadingLeaveAllChatButton: 'exit' });
                const result = await this.props.userDenyNegotiating(roomId, false);
                if (result.payload.success) {
                  this.props.reloadChatMeta();
                }
                this.setState({
                  visibleLeaveAllChat: false,
                  loadingLeaveAllChatButton: '',

                });
              }}
            >僅退出聊天室
            </Button>
          ]}
          onCancel={() => this.setState({ visibleLeaveAllChat: false })}
        >
          您可選擇婉拒所有目前與對方溝通中的案件，婉拒後將退出對話，相關案件後續無法再回報合作。
        </Modal>
      </>
    );
  }
}

export default MessageHeader;
