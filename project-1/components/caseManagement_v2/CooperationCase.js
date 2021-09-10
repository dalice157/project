import React, { Component } from 'react';
import { Collapse } from 'antd';
import { uaIsMobile } from 'react-device-detect';
import Annotation from './Annotation.js';
import annotation1 from '../../img/case/annotation1.svg';
import CooperationList from '../../containers/caseManagement_v2/CooperationList.js';
import styles from './Case.scss';

const { Panel } = Collapse;
class CooperationCase extends Component {
  render() {
    const isMobile = uaIsMobile();
    if (isMobile) {
      return (
        <div className={styles.bg}>
          <div className={styles.wrap}>
            <div className={styles.content}>
              <Collapse bordered={false}>
                <Panel header="注意事項" key="1">
                  <ul className={styles.notes}>
                    <li>合作案件，若已完成但案主尚未評價，請主動於點選「邀請評價」，讓案主記得給你評價，累積您的好評分數。</li>
                    <li>點擊「邀請評價」後，24小時內暫時無法再次邀請案主來評價！</li>
                  </ul>
                </Panel>
              </Collapse>
              <CooperationList isMobile={isMobile} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.bg}>
          <div className={styles.wrap}>
            <div className={styles.content}>
              <Annotation img={annotation1}>
                <ul className={styles.list}>
                  <li>合作案件，若已完成但案主尚未評價，請主動於點選「邀請評價」，讓案主記得給你評價，累積您的好評分數。</li>
                  <li>點擊「邀請評價」後，24小時內暫時無法再次邀請案主來評價！</li>
                </ul>
              </Annotation>
              <CooperationList />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default CooperationCase;
