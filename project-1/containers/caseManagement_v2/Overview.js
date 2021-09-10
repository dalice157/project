import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Layout } from 'antd';
import { BrowserView, MobileView } from 'react-device-detect';
import SiderProfile from './SiderProfile.js';
import ContentInfo from './ContentInfo.js';
import styles from './Overview.scss';

class Overview extends Component {
  render() {
    return (
      <>
        <BrowserView>
          <div className={styles.bg}>
            <div className={styles.wrap}>
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Link to="/">首頁</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  接案管理
                </Breadcrumb.Item>
              </Breadcrumb>
              <Layout hasSider>
                <SiderProfile />
                <ContentInfo />
              </Layout>
            </div>
          </div>
        </BrowserView>
        <MobileView>
          <div className={styles.bg}>
            <div className={styles.wrap}>
              <Layout>
                <SiderProfile isMobile={true} />
                <ContentInfo isMobile={true} />
              </Layout>
            </div>
          </div>
        </MobileView>
      </>
    );
  }
}

export default (Overview);
