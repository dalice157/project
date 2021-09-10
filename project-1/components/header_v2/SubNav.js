import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { GroupAdd, } from '@material-ui/icons';
import styles from './SubNav.scss';

class SubNav extends Component {
  render() {
    const { location } = this.props;
    return (
      <div className={styles.bg}>
        <div className={styles.wrap}>
          <ul className={styles.menu}>
            <li className={location.pathname === '/' ? styles.active : ''}>
              <Link to="/" data-gtm-nav="首頁">首頁</Link>
            </li>
            <li className={location.pathname === '/search-tutor' ? styles.active : ''}>
              <Link to="/search-tutor" data-gtm-nav="找家教老師">找家教老師</Link>
            </li>
            <li className={location.pathname === '/search' ? styles.active : ''}><Link to="/search" data-gtm-nav="找外包報價">找外包報價</Link></li>
            <li className={location.pathname === '/caseList' ? styles.active : ''}><Link to="/caseList" data-gtm-nav="找案件">找案件</Link></li>
          </ul>
          <ul className={styles.howCase}>
            <li className={`${styles.free} ${location.pathname === '/caseForm' ? styles.active : ''}`}><Link to="/caseForm" data-gtm-nav="免費發案">免費發案</Link></li>
            <li className={`${styles.case} ${location.pathname === '/join' ? styles.active : ''}`}><span className={styles.icon} /><Link to="/join" data-gtm-nav="加入接案">加入接案</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default SubNav;
