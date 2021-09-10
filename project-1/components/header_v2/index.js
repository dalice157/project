import React, { Component, Fragment } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import {
  Link, withRouter
} from 'react-router-dom';
import { Layout } from 'antd';
import Login from './Login';
import Search from '../../containers/header_v2/Search';
import HamMenu from './HamMenu';
import styles from './Header.scss';

const { Header } = Layout;

const TOPPER_BTN_SIGNED = {
  caseInfo: 'caseInfo',
  profile: 'profile',
  service: 'service',
  evaluation: 'evaluation',
  search: 'search',
};

// const NO_MESSAGE = ['/chat'];

class Headers extends Component {
  state = {
    visibleHam: false,
    visibleSub: false
  }

  showHamDrawer = () => {
    this.setState({
      visibleHam: true,
    });
  };

  onHamClose = () => {
    this.setState({
      visibleHam: false,
    });
  };

  showSubDrawer = () => {
    this.setState({
      visibleSub: true,
    });
  };

  onSubClose = () => {
    this.setState({
      visibleSub: false,
    });
  };

  render() {
    const {
      user, checkChatAvailable
    } = this.props;
    const { pathname } = this.props.location;
    const currentPage = this.props.location.pathname.split('/')[1];

    return (
      <Fragment>
        {/* PC 瀏覽 */}
        <BrowserView>
          <Header className={styles.header}>
            <div className={styles.wrap}>
              <div className={styles.logo}>
                <Link to="/">
                  <img src="/img/logo.svg" alt="104高手" />
                </Link>
              </div>
              <div className={styles.right}>
                <Search
                  location={this.props.location}
                  history={this.props.history}
                />
                <Login
                  showRedDot={this.props.showRedDot}
                  showJoinButton={currentPage == TOPPER_BTN_SIGNED[currentPage]}
                  user={user}
                  checkChatAvailable={checkChatAvailable}
                  homePath={pathname == '/'}
                  chkActiveProcess={this.props.chkActiveProcess}
                />
              </div>
            </div>
          </Header>
        </BrowserView>
        {/* 手機瀏覽 */}
        <MobileView>
          <Header className={`${styles.header} ${styles.mobile}`}>
            <HamMenu
              location={this.props.location}
              history={this.props.history}
              showDrawer={this.showHamDrawer}
              onClose={this.onHamClose}
              visible={this.state.visibleHam}
              chkActiveProcess={this.props.chkActiveProcess}
            />
            <div className={styles.logo}>
              <Link to="/">
                <img src="/img/logo.svg" alt="104高手" />
              </Link>
            </div>
            <div className={styles.right}>
              <div className={styles.search} onClick={this.showHamDrawer}>
                <img src="/img/icon-search.svg" alt="搜尋" />
              </div>
              <Login
                showRedDot={this.props.showRedDot}
                showJoinButton={pathname == '/'}
                user={user}
                isMobileUser={true}
                checkChatAvailable={checkChatAvailable}
                chkActiveProcess={this.props.chkActiveProcess}
                showDrawer={this.showSubDrawer}
                onClose={this.onSubClose}
                visible={this.state.visibleSub}
              />
            </div>
          </Header>
        </MobileView>
      </Fragment>
    );
  }
}

export default withRouter(Headers);
