import React, { Component } from 'react';
import { Collapse } from 'antd';
import { uaIsMobile } from 'react-device-detect';
import Annotation from './Annotation.js';
import annotation1 from '../../img/case/annotation1.svg';
import InvitingList from '../../containers/caseManagement_v2/InvitingList.js';
import styles from './Case.scss';

const { Panel } = Collapse;
class InvitingCase extends Component {
  render() {
    const isMobile = uaIsMobile();
    if (isMobile) {
      return (
        <div className={styles.wrap}>
          <div className={styles.content}>
            <Collapse bordered={false}>
              <Panel header="注意事項" key="1">
                <ul className={styles.notes}>
                  <li>此處僅表列顯示案主主動邀請您的案件。</li>
                  <li>已進入聊天室與案主溝通中待確認合作案件、合作中待評價或合作已結案關閉的案件，請由上方切換查閱。</li>
                </ul>
              </Panel>
            </Collapse>
            <InvitingList isMobile={isMobile} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrap}>
          <div className={styles.content}>
            <Annotation img={annotation1}>
              <ul className={styles.list}>
                <li>此處僅表列顯示案主主動邀請您的案件。</li>
                <li>已進入聊天室與案主溝通中待確認合作案件、合作中待評價或合作已結案關閉的案件，請由上方切換查閱。</li>
              </ul>
            </Annotation>
            <InvitingList />
          </div>
        </div>
      );
    }
  }
}

export default InvitingCase;
