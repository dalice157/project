import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
// import { uaIsMobile } from 'react-device-detect';
import config from '../../config/config';
import routePath from '../../config/routePath';
import styles from './Header.scss';


const menu = (user) => {
  const { id, userName } = user;
  // const isMobile = uaIsMobile();
  // const isMobileSetting = isMobile ? '/setting' : '/settingEdm';
  const isMobileSetting = '/edmContent';

  const manageDemand = (user.meta && user.meta.demander)
    ? (
      <Menu.Item key="Setting1">
        <Link to="/demand">發案管理</Link>
      </Menu.Item>
    ) : '';

  const manageTopper = (user.meta && user.meta.topper)
    ? (
      <Menu.Item key="Setting2">
        <Link to={routePath.topperDashboard}>接案管理</Link>
      </Menu.Item>
    ) : '';
  return (
    <div className={styles.signWrap}>
      <Menu>
        <Menu.Item key="UserName" disabled>
          <span className={styles.hi}>Hi,</span> <span className={styles.userName}>{userName}</span>
        </Menu.Item>
        <Menu.Divider />
        {(manageDemand != '' || manageTopper != '') && <Menu.Divider />}
        {manageDemand}
        {manageTopper}
        {(manageDemand != '' || manageTopper != '') && <Menu.Divider />}
        {
          id !== null && (
          <Menu.Item key="sing1">
            <Link to="/collection">我的收藏</Link>
          </Menu.Item>
          )
        }
        {
          id !== null && ( // 沒有basicId設定就隱藏
            <Menu.Item key="setting">
              <Link to={isMobileSetting}>設定</Link>
            </Menu.Item>
          )
        }
        <Menu.Item key="sing2">
          <a href={`${config.contentSite.domain}/faq/`} target="_blank">常見問題</a>
        </Menu.Item>
        <Menu.Item key="sing3">
          <a target="_blank" rel="noopener noreferrer" href={`${config.accountsSite.domain}`}>104會員中心</a>
        </Menu.Item>
        <Menu.Item key="sing4">
          <a href="/api/samlLogout">登出</a>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default menu;
