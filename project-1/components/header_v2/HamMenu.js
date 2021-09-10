import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from 'antd';
import Search from '../../containers/header_v2/Search';
import styles from './HamMenu.scss';

class HamMenu extends Component {
  render() {
    const {
      showDrawer, onClose, visible
    } = this.props;
    return (
      <>
        <div className={styles.hamburger} onClick={showDrawer}><div className={styles.line} /></div>
        <Drawer
          className={styles.wrap}
          title={null}
          mask={true}
          placement="left"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <div className={`${styles.hamburger} ${styles.change}`} onClick={onClose}>
            <div className={styles.line} />
          </div>
          <Link className={styles.logo} to="/">
            <img src="/img/logo.svg" alt="104高手" />
          </Link>
          <div className={styles.search}>
            <Search
              type="mobile"
              location={this.props.location}
              history={this.props.history}
            />
          </div>
          <ul className={styles.list}>
            <li className={styles.home}><Link to="/" onClick={onClose} data-gtm-nav="首頁">首頁</Link></li>
            <li className={styles.teacher}><Link to="/search-tutor" onClick={onClose} data-gtm-nav="找家教老師">找家教老師</Link></li>
            <li className={styles.offer}><Link to="/search" onClick={onClose} data-gtm-nav="找外包報價">找外包報價</Link></li>
            <li className={styles.case}><Link to="/caseList" onClick={onClose} data-gtm-nav="找案件">找案件</Link></li>
            <li className={styles.free}><Link to="/caseForm" onClick={onClose} data-gtm-nav="免費發案">免費發案</Link></li>
            <li className={styles.join}><span className={styles.icon} /><Link to="/join" onClick={onClose} data-gtm-nav="加入接案">加入接案</Link></li>
          </ul>
        </Drawer>
      </>
    );
  }
}

export default HamMenu;
