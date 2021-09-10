import React from 'react';
import { Layout } from 'antd';
import { BrowserView, MobileView } from 'react-device-detect';
import config from '../../config/config';
import styles from './Footer.scss';

const { Footer } = Layout;
const getYear = () => new Date().getFullYear();
const Footers = () => (
  <Footer className={styles.wrap}>
    <div className={styles.footer}>
      <BrowserView>
        <div className={styles.content}>
          <dl className={styles.list}>
            <dt className={styles.title}>關於</dt>
            <dd className={styles.link}>
              <a href={`${config.contentSite.domain}/`} target="_blank" rel="noreferrer">104高手部落格</a>
              <a href="https://www.facebook.com/104top/" target="_blank" rel="noreferrer">104高手粉絲團</a>
              <a href={`${config.contentSite.domain}/membership_terms/`} target="_blank" rel="noreferrer">服務條款與隱私策略</a>
            </dd>
          </dl>
          <dl className={styles.list}>
            <dt className={styles.title}>案主相關</dt>
            <dd className={styles.link}>
              <a href="/caseForm" data-gtm-footer="案主-免費發案">免費發案</a>
              <a href={`${config.contentSite.domain}/faq/`} target="_blank" rel="noreferrer" data-gtm-footer="案主-常見問題">發案常見問題</a>
              <a href={`${config.contentSite.domain}/2019/09/07/client/`} target="_blank" rel="noreferrer" data-gtm-footer="案主-刊登教學">案件刊登教學</a>
            </dd>
          </dl>
          <dl className={styles.list}>
            <dt className={styles.title}>人才相關</dt>
            <dd className={styles.link}>
              <a href="/join" target="_blank" data-gtm-footer="人才-加入接案">加入接案</a>
              <a href={`${config.contentSite.domain}/faq/`} target="_blank" rel="noreferrer" data-gtm-footer="人才-常見問題">接案常見問題</a>
              <a href={`${config.contentSite.domain}/2020/01/11/fresh_edit/`} target="_blank" rel="noreferrer" data-gtm-footer="人才-新手教學">接案新手教學</a>
            </dd>
          </dl>
          <dl className={styles.list}>
            <dt className={styles.title}>聯絡我們</dt>
            <dd className={styles.link}>
              <a href="mailto:104top@104.com.tw">服務信箱 104top@104.com.tw</a>
              <p>服務時間 週一至週五 09:00-18:00</p>
            </dd>
          </dl>
        </div>
      </BrowserView>
      <MobileView>
        <div className={`${styles.content} ${styles.mobile}`}>
          <a href={`${config.contentSite.domain}/faq/`} target="_blank" rel="noreferrer">常見問題</a>
          {' '}
          ｜
          <a href="mailto:104top@104.com.tw">聯絡我們</a>
        </div>
      </MobileView>
    </div>
    <div className={styles.copyright}>
      <p>
        104高手提供找外包、找家教，以及兼差接案等刊登服務，為接案方找案件與發案方找高手的專業媒合平台
        <br />
        一零四資訊科技股份有限公司　版權所有©
        {getYear()}
      </p>
    </div>
  </Footer>
);

export default Footers;
