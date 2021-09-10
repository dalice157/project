import React, { Component } from 'react';
import { Tabs } from 'antd';
import find1 from '../../img/index_v2/find-1.png';
import find2 from '../../img/index_v2/find-2.png';
import find3 from '../../img/index_v2/find-3.png';
import find4 from '../../img/index_v2/find-4.png';
import Choice from '../../containers/home_v2/Choice.js';
import FindTeacher from '../../containers/home_v2/FindTeacher.js';
import FindCase from '../../containers/home_v2/FindCase.js';
import PopularService from '../../containers/common_v2/PopularService.js';
import TutorCase from '../../containers/home_v2/TutorCase.js';
import styles from './FindTopperAndDemander.scss';

const { TabPane } = Tabs;

class FindTopperAndDemander extends Component {
  state = {
    activeKey: '0',
  }

  componentDidMount() {
    // pre-render才產生亂數
    const activeKey = String(Math.floor(Math.random() * 10) % 4);
    this.updateActiveKey(activeKey);
  }

  updateActiveKey = tabKey => this.setState({ activeKey: tabKey });

  renderTab = (findType, lager, img, altText) => {
    const wordType = findType === 'find' ? '我想找' : '我想接';
    return (
      <div className={styles.tabWrap} data-gtm-index={`tab-${lager}`}>
        <span className={styles.small}>{wordType}</span>
        <span className={styles.lager}>{lager}</span>
        <span className={styles.imgBord}>
          <img src={img} alt={altText} />
        </span>
      </div>
    );
  }

  render() {
    const { memberCheck } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={styles.wrap}>
        <Tabs activeKey={activeKey} tabBarGutter={8} onTabClick={this.updateActiveKey}>
          <TabPane
            tab={(this.renderTab('find', '家教老師', find1, '我想找家教老師'))}
            key="0"
          >
            <FindTeacher memberCheck={memberCheck} />
            {/* 精選專業師資 */}
            <Choice title="精選專業師資" type="teacher" dataGtmIndex="精選師資" />
            {/* 5星好評成交見證 */}
            <PopularService type="teacher" />
          </TabPane>
          <TabPane
            tab={(
                this.renderTab('case', '家教案件', find2, '我想接家教案件')
              )}
            key="1"
          >
            <TutorCase type="teacher" />
            {/* 5星好評成交見證 */}
            <PopularService type="teacher" />
          </TabPane>
          <TabPane
            tab={(
                this.renderTab('find', '接案人才', find3, '我想找接案人才')
              )}
            key="2"
          >
            <FindCase memberCheck={memberCheck} />
            {/* 精選接案高手 */}
            <Choice title="精選接案高手" type="case" dataGtmIndex="精選接案高手" />
            {/* 5星好評成交見證 */}
            <PopularService type="case" />
          </TabPane>
          <TabPane
            tab={(this.renderTab('case', '外包案件', find4, '我想接外包案件'))}
            key="3"
          >
            <TutorCase type="case" />
            {/* 5星好評成交見證 */}
            <PopularService type="case" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default FindTopperAndDemander;
