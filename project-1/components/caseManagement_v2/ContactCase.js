import React, { Component } from 'react';
import { Collapse } from 'antd';
import { uaIsMobile } from 'react-device-detect';
import Annotation from './Annotation.js';
import annotation6 from '../../img/case/annotation6.svg';
import ContactList from '../../containers/caseManagement_v2/ContactList.js';
import styles from './Case.scss';

const { Panel } = Collapse;
class ContactCase extends Component {
  render() {
    const isMobile = uaIsMobile();
    const noticeItems = (
      <>
        <li>查閱聯絡資料僅留最近半年紀錄，預設顯示當月紀錄，若要查看其他月份資料，可使用月份篩選。 </li>
        <li>有確認合作的案件，記得要主動回報合作並請案主確認，才會增加您的合作記錄喔。 </li>
        <li>若已合作的案件，請記得主動邀請案主給予您的評價，增加你接案的好成績喔。 </li>
      </>
    );

    if (isMobile) {
      return (
        <div className={styles.bg}>
          <div className={styles.wrap}>
            <div className={styles.content}>
              <Collapse bordered={false}>
                <Panel header="注意事項" key="1">
                  <ul className={styles.notes}>
                    { noticeItems }
                  </ul>
                </Panel>
              </Collapse>
              <ContactList isMobile={isMobile} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.bg}>
          <div className={styles.wrap}>
            <div className={styles.content}>
              <Annotation img={annotation6}>
                <ul className={styles.list}>
                  { noticeItems }
                </ul>
              </Annotation>
              <ContactList />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ContactCase;
