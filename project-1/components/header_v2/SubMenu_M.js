import React from 'react';
import { Drawer } from 'antd';
// import { uaIsMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import config from '../../config/config';
import routePath from '../../config/routePath';
import styles from './SubMenu_M.scss';


const menu = ({
  user, onClose, visible
}) => {
  const { id, userName } = user;
  // const isMobile = uaIsMobile();
  // const isMobileSetting = isMobile ? '/setting' : '/settingEdm';
  const isMobileSetting = '/edmContent';

  const manageDemand = (user.meta && user.meta.demander)
    ? (
      <li className={styles.icon3}><Link onClick={onClose} to="/demand">發案管理</Link></li>
    ) : '';
  const manageTopper = (user.meta && user.meta.topper)
    ? (
      <li className={styles.icon4}><Link onClick={onClose} to={routePath.topperDashboard}>接案管理</Link></li>
    ) : '';
  return (
    <Drawer
      className={styles.wrap}
      title={null}
      mask={true}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      <div className={`${styles.hamburger} ${styles.change}`} onClick={onClose}>
        <div className={styles.line} />
      </div>
      <div className={styles.infoWrap}>
        <div className={styles.profileWrap}>
          <span className={styles.hi}>Hi,</span> <span className={styles.userName}>{userName}</span>
        </div>
      </div>
      <ul className={styles.list}>
        {manageDemand}
        {manageTopper}
        {
            id !== null && (
            <li className={styles.icon5}>
              <Link onClick={onClose} to="/collection">我的收藏</Link>
            </li>
            )
          }
        {
            id !== null && ( // 沒有basicId設定就隱藏
            <li className={styles.icon6}>
              <Link onClick={onClose} to={isMobileSetting}>設定</Link>
            </li>
            )
          }
        <li className={styles.icon7}>
          <a href={`${config.contentSite.domain}/faq/`} target="_blank">常見問題</a>
        </li>
        <li className={styles.icon8}>
          <a target="_blank" rel="noopener noreferrer" href={`${config.accountsSite.domain}`}>104會員中心</a>
        </li>
        <li className={styles.icon9}>
          <a href="/api/samlLogout">登出</a>
        </li>
      </ul>
    </Drawer>
  );
};

export default menu;
