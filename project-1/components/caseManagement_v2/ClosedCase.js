import React, { Component } from 'react';
import { Collapse } from 'antd';
import { uaIsMobile } from 'react-device-detect';
import Annotation from './Annotation.js';
import annotation1 from '../../img/case/annotation1.svg';
import ClosedList from '../../containers/caseManagement_v2/ClosedList.js';
import styles from './Case.scss';

const { Panel } = Collapse;
class ClosedCase extends Component {
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
                    <li>以下為全部案主已結案關閉案件，包含有主應主邀或查閱，不論是否進溝通/合作/回絕未合作/之所有案件列表。</li>
                    <li>若為溝通中結案或回絕未合作之案件可選擇刪除該案件。</li>
                    <li>若為主邀主應進入溝通中或為查閱主動聯絡的案件，若案件已結案實際已合作，亦可在此補做回報請案主確認合作 及 向案主邀請評價！</li>
                  </ul>
                </Panel>
              </Collapse>
              <ClosedList isMobile={isMobile} />
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
                  <li>以下為全部案主已結案關閉案件，包含有主應主邀或查閱，不論是否進溝通/合作/回絕未合作/之所有案件列表。</li>
                  <li>若為溝通中結案或回絕未合作之案件可選擇刪除該案件。</li>
                  <li>若為主邀主應進入溝通中或為查閱主動聯絡的案件，若案件已結案實際已合作，亦可在此補做回報請案主確認合作 及 向案主邀請評價！</li>
                </ul>
              </Annotation>
              <ClosedList />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ClosedCase;
