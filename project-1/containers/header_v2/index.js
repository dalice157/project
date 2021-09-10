import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { BrowserView } from 'react-device-detect';
import { message } from 'antd';
import firebase from 'firebase/app';
import PopModal from '../../components/common_v2/PopModal';
import Button from '../../components/ui/button';
import {
  loadUserInfo, getPlusShare, setPlusPublishStatus, getImUnread, loadImportSourceList, getPaidRecordUsing
} from '../../actions/basic';
import { chkActiveProcess } from '../../actions/common';
import config from '../../config/config';
import '@firebase/messaging';
import { initFirebase } from '../../util/firebaseUtil';
import Header from '../../components/header_v2';
import SubNav from '../../components/header_v2/SubNav';

const NO_SHOW_SUBNAV = {
  chat: 'chat',
  editor: 'editor',
  serviceItems: 'serviceItems',
  caseForm: 'caseForm',
  joincaseForm: 'joincaseForm',
  editCaseForm: 'editCaseForm',
  planSelect: 'planSelect',
  editProfile: 'editProfile',
  enableCaseUser: 'enableCaseUser',
  evaluationedm: 'evaluationedm',
  evaluationList: 'evaluationList',
};


// let isUpdate = false;
class Default extends Component {
  isMember = false;

  state = {
    visible: true,
    showRedDot: false,
  }

  componentDidMount() {
    this.props.initUser().then((json) => {
      console.log('Header-json:', json.payload.meta);
      const isTopper = json.payload.meta && json.payload.meta.topper;
      this.props.getPaidRecordUsing();
      if (!isTopper) {
        this.props.loadImportSourceList();
      }
      if (!json.error && json.payload && json.payload.id) {
        console.log('會員');
        this.isMember = !json.payload.shouldCompleteInfo;
        this.props.getPlusShare();
        this.getUserRole();
      } else {
        this.isMember = false;
        console.log('非會員');
      }
    });
    if (firebase.apps.length == 0) {
      initFirebase();
    }
  }

  getUserRole = () => {
    this.props.getImUnread().then((imUnread) => {
      const imUnreadPayload = imUnread.payload || { data: { demanderUnReadMsgCount: 0, topperUnReadMsgCount: 0 } };
      if (imUnreadPayload && imUnreadPayload.data) {
        const { demanderUnReadMsgCount, topperUnReadMsgCount } = imUnreadPayload.data;
        const msgTotal = Number(demanderUnReadMsgCount) + Number(topperUnReadMsgCount);

        if (msgTotal > 0) {
          this.setState({
            showRedDot: true,
          });
        }
      }
    });

    this.initializeFCM();
  }

  initializeFCM = () => {
    // console.log(firebase.messaging.isSupported());

    if (firebase && firebase.messaging.isSupported() && firebase.messaging()) {
      // requesting permission to use push notifications
      firebase.messaging().requestPermission().then(() => {
        // getting FCM token
        firebase.messaging().getToken().then(() => {
          // console.log('fcmToken', fcmToken);
          // registering event listener on new message from firebase to pass it to the Chat SDK for parsing
          firebase.messaging().onMessage((payload) => {
            console.log('onMessage', payload);
            if (payload.data && payload.data.twi_body) {
              if (this.props.location.pathname !== '/chat') {
                message.info('[新訊息]: ' + payload.data.twi_body.substring(0, 20) + '...', 5);
              }
              this.setState({
                showRedDot: true,
              });
            }
          });
        }).catch((err) => {
          // can't get token
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
        // can't request permission or permission hasn't been granted to the web app by the user
      });
    } else {
      console.log('no Firebase library imported or Firebase library wasnt correctly initialized');
    }
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  }

  publishProfile = async () => {
    let response = await this.props.setPlusPublishStatus(1);

    if (response.payload.success) {
      this.setState({
        visible: false,
      });
    }
  }

  checkChatAvailable = async () => {
    if (this.isMember) { // 己含判斷補資料
      this.props.history.push('/chat');
    } else {
      await this.props.chkActiveProcess('/chat');
    }
    this.setState({ showRedDot: false });
  }

  render() {
    const {
      visible,
      showRedDot
    } = this.state;
    const {
      user,
      plusShare,
      activeClass,
      styles
    } = this.props;

    const showUI = visible && plusShare.data.isAskBoxOpen == 'true';

    const { pathname } = this.props.location;
    const currentPage = pathname.split('/')[1];
    const isNoShowSubnav = (currentPage !== NO_SHOW_SUBNAV[currentPage]);
    return (
      <>
        <Header
          activeClass={activeClass}
          user={user}
          showRedDot={showRedDot}
          checkChatAvailable={this.checkChatAvailable}
          chkActiveProcess={this.props.chkActiveProcess}
        />
        <BrowserView>
          {
            isNoShowSubnav && (
            <SubNav
              location={this.props.location}
              chkActiveProcess={this.props.chkActiveProcess}
            />
            )
          }
        </BrowserView>
        <PopModal
          btnType=""
          btnText="xxx"
          hideBtn="hide"
          title="開啟斜槓人生，第一步建立專業個人檔案"
          // onClick={this.onClick}
          onClose={this.onClose}
          visible={showUI}
        >
          <div className={styles.wrap}>
            你已發布高手服務，但因<a href={config.profileSite.domain} target="_blank">104個人檔案</a>內容尚未公開，案主無法完整瀏覽
            你的高手檔案，建議立即公開104個人檔案內容，提高案主邀請合作機會！
          </div>
          <div className={styles.btnWrap}>
            <Button type="primary" onClick={this.publishProfile}>公開104個人檔案</Button>
          </div>
        </PopModal>
      </>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
  plusShare: state.basic.plusShare,
  plusPublish: state.basic.plusPublish,
  // IM
  demanderMenu: state.chatmeta.demanderMenu, // [需求者]開放中的需求列表
  topperChatmeta: state.chatmeta.topperChatmeta, // [高手]合作中或收到溝通邀請的[需求者]聊天室
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  getPlusShare,
  setPlusPublishStatus,
  chkActiveProcess,
  // IM
  getImUnread,
  loadImportSourceList,
  getPaidRecordUsing
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Default)
);
