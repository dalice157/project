import React, { PureComponent } from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb, Menu } from 'antd';
import { connect } from 'react-redux';
import styles from './Overview.scss';
import routePath from '../../config/routePath';
import { loadDemandTitle } from '../../actions/demand';
import Candidate from './Candidate';
import Invitees from './Invitees';

class Overview extends PureComponent {
  state = {
    current: routePath.candidate,
  }

  componentDidMount() {
    const demandId = this.props.location.query.demandId;
    this.props.loadDemandTitle(demandId);
  }

  onRenderPage = () => {
    const { pathname } = this.props.history.location;
    const { demandTitle } = this.props;
    this.setState({
      current: pathname
    });
    const renderPage = {
      [routePath.candidate]: <Candidate demandTitle={demandTitle} />,
      [routePath.invitees]: <Invitees demandTitle={demandTitle} />
    };
    return renderPage[pathname];
  }

  changeDashboardPage = (e) => {
    this.setState({
      current: e.key
    });
  }

  changeDashboardPage = (e) => {
    this.setState({
      current: e.key
    });
  }

  showBreadcrumb = () => {
    const { current } = this.state;
    const breadcrumbText = {
      [routePath.candidate]: '應徵',
      [routePath.invitees]: '邀請'
    };
    return breadcrumbText[current];
  }

  render() {
    const { current } = this.state;
    const { demandTitle } = this.props;
    const demandId = this.props.location.query.demandId;
    const isMobile = uaIsMobile() ? styles.mobile : '';

    return (
      <div className={styles.bg}>
        <div className={styles.wrap}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to={routePath.root}>首頁</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={routePath.demand}>發案管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {demandTitle && `${demandTitle} - `}{this.showBreadcrumb()}高手列表
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.demandTitle}>
            <span>我的需求案件：</span><h2>{demandTitle || '-'}</h2>
          </div>
          <div className={styles.attention}>
            請注意：若本案件已結案關閉，尚未同意溝通的，則無法再開啟聊天室。已溝通中的則仍可進入查看歷史聊天內容。
          </div>
          <div className={`${styles.nav} ${isMobile}`}>
            <Menu
              onClick={this.changeDashboardPage}
              selectedKeys={[current]}
              mode="horizontal"
            >
              <Menu.Item key={routePath.candidate} className={styles.item}>
                <Link to={`${routePath.candidate}?demandId=${demandId}`}>應徵高手</Link>
              </Menu.Item>
              <Menu.Item key={routePath.invitees} className={styles.item}>
                <Link to={`${routePath.invitees}?demandId=${demandId}`}>邀請高手</Link>
              </Menu.Item>
            </Menu>
          </div>
          {this.onRenderPage()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  demandTitle: state.demand.demandTitle.demandTitle,
});
const mapDispatchToProps = {
  loadDemandTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Overview));
