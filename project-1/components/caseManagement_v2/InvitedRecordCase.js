import React, { Component } from 'react';
import { Collapse } from 'antd';
import { uaIsMobile } from 'react-device-detect';
import Annotation from './Annotation.js';
import annotation5 from '../../img/case/annotation5.svg';
import InvitedRecordList from '../../containers/caseManagement_v2/InvitedRecordList.js';
import styles from './Case.scss';

const { Panel } = Collapse;
class InvitedRecordCase extends Component {
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
                    <li>應徵記錄僅留近半年之紀錄。並依最新月份表列。若要查看之前提案記錄，可用應徵月份來篩選。</li>
                    <li>已進入聊天室與案主溝通中待確認合作案件、合作中待評價或合作已結案關閉的案件，請由上方切換查閱。 </li>
                    <li>有確認合作的案件，記得進行要回報合作並請案主確認，這些將會是你下次接案可以拿出來的好成績喔。</li>
                  </ul>
                </Panel>
              </Collapse>
              <InvitedRecordList isMobile={isMobile} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.bg}>
          <div className={styles.wrap}>
            <div className={styles.content}>
              <Annotation img={annotation5}>
                <ul className={styles.list}>
                  <li>應徵記錄僅留近半年之紀錄。並依最新月份表列。若要查看之前提案記錄，可用應徵月份來篩選。</li>
                  <li>已進入聊天室與案主溝通中待確認合作案件、合作中待評價或合作已結案關閉的案件，請由上方切換查閱。 </li>
                  <li>有確認合作的案件，記得進行要回報合作並請案主確認，這些將會是你下次接案可以拿出來的好成績喔。</li>
                </ul>
              </Annotation>
              <InvitedRecordList />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default InvitedRecordCase;
