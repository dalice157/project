import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Edit } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import {
  Menu, Select, Badge, Button, Collapse, Modal
} from 'antd';
import { connect } from 'react-redux';
import Avatar from '../../components/ui/avatar';
import styles from './TopContactPerson.scss';
import defaultAvatar from '../../img/common_v2/avatar-default-square.svg';
import LeaveChatroomForm from '../../components/chat_v3/sidebar/LeaveChatroomForm';
import {
  leaveDemanderChatroom, confirmChat, selectDemandDropdown, saveDemanderSurvey, onChangeMobilePage, loadDemanderChatMeta, chooseTopper, handleTopperClick, reloadChatMeta
} from '../../actions/chatmeta_v2';
import { CHAT_MOBILE_PAGE } from '../../config/constant';

const Option = Select.Option;
const { Panel } = Collapse;
/**
 * 我的高手聯絡人
 */
class TopContactPerson extends Component {
  state = {
    isLeaveMode: false,
    isLoadingMoreChat: false,
  };

  componentDidMount = () => {
    const { isMobile } = this.props;
    if (!isMobile) {
      // PC才需要先載入聊天室
      this.props.chooseTopper();
    }
  }

  renderPublishingStatus = (topperStatus, publishing) => {
    if (topperStatus === 2) {
      return <span className={styles.closed}>　結束溝通</span>;
    } else if (!publishing) {
      return <span className={styles.closed}>　未刊登</span>;
    } else if (topperStatus === 0) {
      return <span className={styles.inviting}>　邀請中</span>;
    } else {
      return <></>;
    }
  };

  onSubmitLeaveChatroom = (values, action) => {
    Modal.confirm({
      title: '退出聊天室',
      content: '您確定要退出聊天室嗎？',
      okText: '確認',
      cancelText: '否',
      onOk: async () => {
        const roomIdList = Object.keys(values).filter(key => values[key]);
        const result = await this.props.leaveDemanderChatroom(roomIdList);
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
      await this.props.loadDemanderChatMeta(this.props.selectedDemandId, nextKey);
      this.setState({ isLoadingMoreChat: false });
    });
  }

  render() {
    const {
      selectedDemandId, selectTopperId, demanderMenu, demanderChatmeta
    } = this.props;
    const inviting = demanderChatmeta.list;
    const nextKey = demanderChatmeta.nextKey;
    const demandMenu = (
      <Select
        defaultValue={selectedDemandId}
        styleClassName={styles.topSelect}
        value={selectedDemandId}
        onChange={demandId => this.props.selectDemandDropdown(demandId, demanderMenu)}
      >
        <Option key="-1" value="-1">
          全部
        </Option>
        {
        demanderMenu.map(demand => (
          <Option key={demand.demandId} value={demand.demandId}>
            {demand.demandTitle}
          </Option>
        ))
      }
      </Select>
    );
    const isMobile = uaIsMobile();
    const isStylesMobile = isMobile ? styles.mobile : '';
    return (
      <div className={`${styles.sidebar} ${isStylesMobile}`}>
        {
          this.state.isLeaveMode
            ? (
              <LeaveChatroomForm
                type="topper"
                list={inviting}
                nextKey={nextKey}
                nextPage={() => this.nextPage(nextKey)}
                onSubmitLeaveChatroom={this.onSubmitLeaveChatroom}
                backToList={() => this.setState({ isLeaveMode: false })}
                isLoadingMoreChat={this.state.isLoadingMoreChat}
              />
            )
            : (
              <>
                { demandMenu }
                <div className={styles.total}>共 {inviting && inviting.length ? inviting.length : 0}{nextKey && '+'} 位聯絡人</div>
                <div className={styles.collapse}>
                  <Collapse
                    accordion
                    bordered={false}
                    expandIconPosition="right"
                    defaultActiveKey={['topper1']}
                  >
                    <Panel
                      className={styles.panel}
                      header={
                      (
                        <div className={styles.panelHeader}>
                          <span>聊天室</span>
                          <div className={styles.deleteIcon} onClick={() => this.setState({ isLeaveMode: true })}>
                            <Edit />
                          </div>
                        </div>
                      )
                    }
                      key="topper1"
                    >
                      <Menu
                        selectedKeys={selectTopperId}
                        mode="inline"
                      >
                        {
                  inviting.map((topper) => {
                    return (
                      <Menu.Item className={`${styles.menuItem} ${isStylesMobile}`} key={`${topper.topperId}`}>
                        <div
                          className={`${styles.meta} ${topper.totalMessage > 0 ? styles.active : ''}`}
                          onClick={async () => {
                            if (isMobile) {
                              this.props.onChangeMobilePage(CHAT_MOBILE_PAGE.chatroom);
                            }

                            await this.props.handleTopperClick(topper, this.props.user, this.props.deskDemand, this.props.currentTab, this.props.area);
                          }}
                        >
                          <div className={styles.avatar}>
                            <Badge count={topper.totalMessage} overflowCount={10} offset={[5, 10]}>
                              <Avatar size={50} userImg={topper.topperImg || defaultAvatar} />
                            </Badge>
                          </div>
                          <div className={styles.metaBox}>
                            <div className={styles.name}>
                              <p className={styles.userName}>{topper.topperName}</p>
                              {this.renderPublishingStatus(topper.status, topper.publishing)}
                            </div>
                            <div className={styles.item}>
                              {topper.demandTitleList.join(' / ')}
                            </div>
                          </div>
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
  demanderMenu: state.chatmeta.demanderMenu, // [需求者]開放中的需求列表
  deskDemand: state.chatmeta.deskDemand, // 聊天室進行中的需求
  demanderChatmeta: state.chatmeta.demanderChatmeta, // [高手]合作中或收到溝通邀請的[需求者]聊天室
  unInviteDemands: state.chatmeta.unInviteDemands, // 可快速發問之需求
  unConfirmDemands: state.chatmeta.unConfirmDemands, // 可回報合作之需求
  topperChatmeta: state.chatmeta.topperChatmeta, // [高手]合作中或收到溝通邀請的[需求者]聊天室
  reportRecord: state.report.reportRecord,
  saveDemand: state.chatmeta.saveDemand,
  role: state.chatmeta.role,
  currentTab: state.chatmeta.currentTab,
  selectedDemandId: state.chatmeta.selectedDemandId,
  selectTopperId: state.chatmeta.selectTopperId,
  selectedDemand: state.chatmeta.selectedDemand,
  roomId: state.chatmeta.roomId,
});


const mapDispatchToProps = {
  confirmChat,
  loadDemanderChatMeta,
  selectDemandDropdown,
  saveDemanderSurvey,
  chooseTopper,
  handleTopperClick,
  onChangeMobilePage,
  leaveDemanderChatroom,
  reloadChatMeta,
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopContactPerson));
