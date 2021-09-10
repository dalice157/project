import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  withRouter
} from 'react-router-dom';
import { uaIsMobile } from 'react-device-detect';
import { Tabs, Badge, Breadcrumb } from 'antd';
import { Send, Visibility } from '@material-ui/icons';
import { getWatchDealList } from '../../actions/gigManage';
import routePath from '../../config/routePath';
import { topperTabsName } from '../../config/selectData';
import InvitingList from '../../components/caseManagement_v2/InvitingCase';
import CommunicationList from '../../components/caseManagement_v2/CommunicationCase';
import CooperationList from '../../components/caseManagement_v2/CooperationCase';
import ClosedList from '../../components/caseManagement_v2/ClosedCase';
import AppliedList from '../../components/caseManagement_v2/InvitedRecordCase';
import ContactList from '../../components/caseManagement_v2/ContactCase';
import styles from './List.scss';

const { TabPane } = Tabs;

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultTabs: props.history.location.pathname.split('/')[2]
    };
  }

  componentDidMount() {
    const query = this.props.history.location.pathname.split('/')[2];
    const stepPath = topperTabsName[query].id;
    this.props.getWatchDealList(stepPath);
  }

  onChange = (key) => {
    console.log('key:', key);
    this.setState({
      defaultTabs: key
    });
    this.props.history.push(`/topper-dashboard/${key}`);
  }

  render() {
    const { newInvitingCnt, newCommunicatingCnt, newCooperatingCnt } = this.props.dealLists;
    const isMobile = uaIsMobile();
    const { defaultTabs } = this.state;
    return (
      <div className={styles.bg}>
        <div className={styles.breadcrumb}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首頁</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={routePath.topperDashboard}>接案管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {topperTabsName[defaultTabs].name}列表
            </Breadcrumb.Item>
          </Breadcrumb>
          {!isMobile && <h2 className={styles.title}>{topperTabsName[defaultTabs].name}列表</h2>}
        </div>
        <Router>
          <Switch>
            <Route
              path="/topper-dashboard/:tab"
              render={() => {
                return (
                  <Switch>
                    <Tabs className={styles.tabs} type="card" defaultActiveKey={defaultTabs} onChange={this.onChange}>
                      <TabPane
                        tab={<Badge dot={typeof newInvitingCnt === 'number' && newInvitingCnt > 0}>被邀請案件</Badge>}
                        key="inviting"
                      >
                        <InvitingList />
                      </TabPane>
                      <TabPane
                        tab={<Badge dot={typeof newCommunicatingCnt === 'number' && newCommunicatingCnt > 0}>溝通中案件</Badge>}
                        key="communication"
                      >
                        <CommunicationList />
                      </TabPane>
                      <TabPane
                        tab={<Badge dot={typeof newCooperatingCnt === 'number' && newCooperatingCnt > 0}>合作中案件</Badge>}
                        key="cooperation"
                      >
                        <CooperationList />
                      </TabPane>
                      <TabPane tab="案主已結案案件" key="closed">
                        <ClosedList />
                      </TabPane>
                      <TabPane
                        tab={<span className={styles.icon}><Send />已應徵案件</span>}
                        key="applied"
                      >
                        <AppliedList />
                      </TabPane>
                      <TabPane
                        tab={<span className={styles.icon}><Visibility />查閱案件</span>}
                        key="contact"
                      >
                        <ContactList />
                      </TabPane>
                    </Tabs>
                  </Switch>
                );
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dealLists: state.gigManage.dealLists,
});
const mapDispatchToProps = {
  getWatchDealList,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Lists));
