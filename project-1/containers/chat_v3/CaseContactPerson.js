import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Edit } from '@material-ui/icons';
import {
  Menu, Badge, Button, Collapse, Modal
} from 'antd';
import { connect } from 'react-redux';
import styles from './CaseContactPerson.scss';
import LeaveChatroomForm from '../../components/chat_v3/sidebar/LeaveChatroomForm';
import {
  leaveTopperChatroom, confirmChat, loadTopperChatMeta, chooseDemander, handleDemanderClick, onChangeMobilePage, reloadChatMeta
} from '../../actions/chatmeta_v2';
import { CHAT_MOBILE_PAGE } from '../../config/constant';

const { Panel } = Collapse;
/**
 * 我的案主聯絡人
 */
class CaseContactPerson extends Component {
  state = {
    isLeaveMode: false,
    isLoadingMoreChat: false,
  };

  componentDidMount = () => {
    const { isMobile } = this.props;
    if (!isMobile) {
      // PC才需要先載入聊天室
      this.props.chooseDemander();
    }
  }

  onSubmitLeaveChatroom = (values, action) => {
    Modal.confirm({
      title: '退出聊天室',
      content: '您確定要退出聊天室嗎？',
      okText: '確認',
      cancelText: '否',
      onOk: async () => {
        const roomIdList = Object.keys(values).filter(key => values[key]);
        const result = await this.props.leaveTopperChatroom(roomIdList);
        if (result.payload.success) {
          this.props.reloadChatMeta();
          this.setState({ isLeaveMode: false });
        }
      },
      maskClosable: true,
    });
    action.setSubmitting(false);
  }

  nextPage = (nextKey) => {
    this.setState({ isLoadingMoreChat: true }, async () => {
      await this.props.loadTopperChatMeta(nextKey);
      this.setState({ isLoadingMoreChat: false });
    });
  }

  render() {
    const {
      user, currentTab, deskDemand, area, topperChatmeta, selectedDemanderId
    } = this.props;
    const { list, nextKey } = topperChatmeta;

    const processLength = list.length;
    const isMobile = uaIsMobile();
    const isStylesMobile = isMobile ? styles.mobile : '';
    return (
      <div className={`${styles.sidebar} ${isStylesMobile}`}>
        {
          this.state.isLeaveMode
            ? (
              <LeaveChatroomForm
                type="demander"
                list={list}
                selectedId={selectedDemanderId}
                nextKey={nextKey}
                nextPage={() => this.nextPage(nextKey)}
                onSubmitLeaveChatroom={this.onSubmitLeaveChatroom}
                backToList={() => this.setState({ isLeaveMode: false })}
                isLoadingMoreChat={this.state.isLoadingMoreChat}
              />
            )
            : (
              <>
                <div className={styles.total}>共 {processLength}{nextKey && '+'} 位案主</div>
                <div className={styles.collapse}>
                  <Collapse
                    accordion
                    bordered={false}
                    expandIconPosition="right"
                    defaultActiveKey={['demander1']}
                  >
                    <Panel
                      className={styles.panel}
                      header={(
                        <div className={styles.panelHeader}>
                          <span>聊天室</span>
                          <div className={styles.deleteIcon} onClick={() => this.setState({ isLeaveMode: true })}>
                            <Edit />
                          </div>
                        </div>
                  )}
                      key="demander1"
                    >
                      <Menu selectedKeys={selectedDemanderId} mode="inline">
                        {
                        list.map((demander) => {
                          return (
                            <Menu.Item key={`${demander.demanderId}`}>
                              <div
                                className={`${styles.meta} ${demander.totalMessage > 0 ? styles.active : ''}`}
                                onClick={() => {
                                  if (isMobile) {
                                    this.props.onChangeMobilePage(CHAT_MOBILE_PAGE.chatroom);
                                  }
                                  this.props.handleDemanderClick(demander, user, deskDemand, currentTab, area);
                                }}
                              >
                                <div className={styles.nameField}>
                                  <Badge count={demander.totalMessage} overflowCount={10} offset={[0, 5]}>
                                    <span className={styles.name}>{demander.demanderName}</span>
                                  </Badge>
                                  {demander.status === 2 && <span className={styles.closed}>　結束溝通</span>}
                                  {demander.status === 0 && <span className={styles.inviting}>　邀請中</span>}
                                </div>
                                <span className={styles.item}>
                                  { demander.demandTitleList.join(' / ') }
                                </span>
                              </div>
                            </Menu.Item>
                          );
                        })
                      }
                        {nextKey && <div className={styles.moreChat} align="center"><Button type="link" loading={this.state.isLoadingMoreChat} onClick={() => this.nextPage(nextKey)}>更多聊天室</Button></div>}
                      </Menu>
                    </Panel>
                  </Collapse>
                </div>
              </>
            )
        }
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
  area: state.common.area,
  chatmeta: state.chatmeta,
  deskDemand: state.chatmeta.deskDemand, // 聊天室進行中的需求
  topperChatmeta: state.chatmeta.topperChatmeta, // [高手]合作中或收到溝通邀請的[需求者]聊天室
  currentTab: state.chatmeta.currentTab,
  selectedDemanderId: state.chatmeta.selectedDemanderId,
  roomId: state.chatmeta.roomId,
  messages: state.chatmeta.messages,
});


const mapDispatchToProps = {
  confirmChat,
  loadTopperChatMeta,
  chooseDemander,
  handleDemanderClick,
  onChangeMobilePage,
  leaveTopperChatroom,
  reloadChatMeta,
};


export default connect(mapStateToProps, mapDispatchToProps)(CaseContactPerson);
