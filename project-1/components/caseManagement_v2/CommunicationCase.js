import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Collapse } from 'antd';
import { uaIsMobile } from 'react-device-detect';
import Annotation from './Annotation.js';
import annotation1 from '../../img/case/annotation1.svg';
import CommunicationList from '../../containers/caseManagement_v2/CommunicationList.js';
import styles from './Case.scss';

const { Panel } = Collapse;
class CommunicationCase extends Component {
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
                    <li>溝通中案件，若雙方溝通後決定合作，務必主動「回報合作」後請案主確認合作 或 案主已先回報合作，請點選「確認合作」，合作需雙方確認才會成立，並記入至你的合作數。</li>
                  </ul>
                </Panel>
              </Collapse>
              <CommunicationList isMobile={isMobile} />
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
                  <li>溝通中案件，若雙方溝通後決定合作，務必主動「回報合作」後請案主確認合作 或 案主已先回報合作，請點選「確認合作」，合作需雙方確認才會成立，並記入至你的合作數。
                  </li>
                </ul>
              </Annotation>
              <CommunicationList />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(CommunicationCase);
