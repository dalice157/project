import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Menu } from 'antd';
import { uaIsMobile } from 'react-device-detect';
import styles from './ContentInfo.scss';
import Manage from '../../components/caseManagement_v2/Manage';
import routePath from '../../config/routePath';
import PaidRecord from './PaidRecord';

class ContentInfo extends Component {
  state = {
    showModal: false,
    selectedTagIndex: 0,
    demandIndex: 0,
    current: this.props.history.location.pathname,
  };

  changeDashboardPage = (element) => {
    this.setState({ current: element.key });
  }

  onRenderPage = (pathname) => {
    const { isMobile } = this.props;
    switch (pathname) {
      case routePath.topperDashboard: {
        return (
          <Manage
            isMobile={isMobile}
          />
        );
      }
      case routePath.topperDashboardPaidRecord: {
        return (
          <PaidRecord />
        );
      }
      default: {
        return <></>;
      }
    }
  }

  render() {
    const isMobileStyle = uaIsMobile() ? styles.mobile : '';
    const pathname = this.props.history.location.pathname;
    return (
      <div className={styles.layout}>
        <div className={`${styles.nav} ${isMobileStyle}`}>
          <div className={styles.wrap}>
            <Menu onClick={this.changeDashboardPage} selectedKeys={[this.state.current]} mode="horizontal">
              <Menu.Item key={routePath.topperDashboard} className={styles.item}>
                <Link to={routePath.topperDashboard}>接案管理</Link>
              </Menu.Item>
              <Menu.Item key={routePath.topperDashboardPaidRecord} className={styles.item}>
                <Link to={routePath.topperDashboardPaidRecord}>付款紀錄</Link>
              </Menu.Item>
            </Menu>
          </div>
        </div>
        {this.onRenderPage(pathname)}
      </div>
    );
  }
}


export default withRouter(ContentInfo);
