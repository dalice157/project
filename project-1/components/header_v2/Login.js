import React from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Badge } from 'antd';
import chat from '../../img/header_v2/icon-sms.svg';
import profile from '../../img/header_v2/icon-profile.svg';
// import config from '../../config/config.js';
import Dropdown from '../ui/dropdown';
import SubMenu from './subMenu';
import SubMenuMobile from './SubMenu_M';
import styles from './Header.scss';

// status 會員狀態  -1:黑名單, 0:未啟用, 1:已啟用但未付保證金, 2:已付保證金 or 信用良好
const SingOut = ({ singOutObj }) => {
  const {
    user, checkChatAvailable, showRedDot, chkActiveProcess, isMobileUser, showDrawer, onClose, visible
  } = singOutObj;

  const isMobile = uaIsMobile();
  const isMobileStyle = isMobile ? styles.mobile : '';
  return (
    <div className={`${styles.signIn} ${isMobileStyle}`}>
      <div className={styles.icon}>
        {
          showRedDot ? (
            <Badge dot>
              <a onClick={checkChatAvailable}><img src={chat} alt="chat" /></a>
            </Badge>
          )
            : (
              <a onClick={checkChatAvailable}><img src={chat} alt="chat" /></a>
            )
        }
      </div>
      {
        isMobile ? (
          <>
            <a className={styles.profile} onClick={showDrawer}>
              <img src={profile} alt="profile" />
            </a>
            <SubMenuMobile
              user={user}
              isMobileUser={isMobileUser}
              onClose={onClose}
              visible={visible}
            />
          </>
        ) : (
          <Dropdown className={styles.caseList} overlay={SubMenu(user, isMobileUser, chkActiveProcess)} placement="bottomCenter">
            <a className="ant-dropdown-link" href="#">
              <img src={profile} alt="profile" />
            </a>
          </Dropdown>
        )
      }

    </div>
  );
};

const SingIn = () => {
  return (
    <div className={styles.signOut}>
      <a href="/api/login" data-gtm-header="登入註冊">登入 / 註冊</a>
    </div>
  );
};
const Login = ({
  user, showJoinButton, checkChatAvailable, showRedDot, hideMessageIcon, isMobileUser, homePath, chkActiveProcess, showDrawer, onClose, visible
}) => {
  const singOutObj = {
    isMobileUser: isMobileUser,
    hideMessageIcon: hideMessageIcon,
    showJoinButton: showJoinButton,
    user: user,
    showRedDot: showRedDot,
    homePath: homePath,
    checkChatAvailable: checkChatAvailable,
    chkActiveProcess: chkActiveProcess,
    showDrawer: showDrawer,
    onClose: onClose,
    visible: visible
  };
  return user.pid
    ? <SingOut singOutObj={singOutObj} />
    : <SingIn />;
};

export default Login;
