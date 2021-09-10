import React, { Fragment } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { Layout } from 'antd';
import styles from './CollectionSider.scss';

const { Sider } = Layout;
const Siders = ({ total }) => {
  return (
    <Fragment>
      <BrowserView>
        <Sider className={styles.sider}>
          <ul className={styles.collection}>
            <li className={styles.option}>
              <div className={styles.optionSide} />
              <p className={styles.optionTitle}>全部服務 {total > 0 ? `(${total})` : ''}</p>
            </li>
          </ul>
        </Sider>
      </BrowserView>
      <MobileView />
    </Fragment>
  );
};

export default Siders;
