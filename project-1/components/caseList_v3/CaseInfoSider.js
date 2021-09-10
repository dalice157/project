import React, { Component } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';

import ApplyButton from '../../containers/caseList_v3/ApplyButton';

import styles from './CaseInfoSider.scss';

class CaseInfoSider extends Component {
  render() {
    const {
      sex, getAppliedText, reload
    } = this.props;
    const {
      // eslint-disable-next-line no-unused-vars
      demandId, demanderFamilyName, viewCount, applyCount, applyMode, haveCommunicatedCount, basicId
    } = this.props.data;
    return (
      <>
        <BrowserView>
          <div className={styles.sider}>
            <div className={styles.userName}>
              <span className={styles.title}>案主</span>
              <div className={styles.nameWarp}><span className={styles.name}>{ demanderFamilyName }</span><span>{sex}</span></div>
            </div>
            <ul className={styles.list}>
              {/* <li>
                <span className={styles.title}>瀏覽數</span>
                <span className={styles.number}>{ viewCount }</span>
              </li> */}
              <li>
                <span className={styles.title}>應徵數</span>
                <span className={styles.number}>{ applyCount }</span>
              </li>
              <li>
                <span className={styles.title}>溝通中</span>
                <span className={styles.number}>{ haveCommunicatedCount }</span>
              </li>
            </ul>
            <ApplyButton
              getAppliedText={getAppliedText}
              basicId={basicId}
              demandId={demandId}
              onClose={reload}
            />
          </div>
        </BrowserView>
        <MobileView>
          <ul className={`${styles.list} ${styles.mobile}`}>
            {/* <li>
              <span className={styles.title}>瀏覽數</span>
              <span className={styles.number}>{ viewCount }</span>
            </li> */}
            <li>
              <span className={styles.title}>應徵數</span>
              <span className={styles.number}>{ applyCount }</span>
            </li>
            <li>
              <span className={styles.title}>溝通中</span>
              <span className={styles.number}>{ haveCommunicatedCount }</span>
            </li>
          </ul>
        </MobileView>
      </>
    );
  }
}

export default CaseInfoSider;
