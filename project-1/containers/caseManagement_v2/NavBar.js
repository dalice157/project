import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import { Badge, Menu } from 'antd';
import { Send, Visibility } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { getWatchDealList } from '../../actions/gigManage';
import routePath from '../../config/routePath';
import styles from './NavBar.scss';


/**
 * @deprecated
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.path,
    };
  }

  componentDidMount() {
    const stepObj = {
      inviting: 1,
      communication: 2,
      cooperation: 3,
      closed: 4,
      invitedRecord: 5,
      contact: 6
    };
    const stepPath = stepObj[this.props.path];
    this.props.getWatchDealList(stepPath);
  }

  handleClick = (e) => {
    console.log('e.key:', e.key);
    this.setState({
      current: e.key,
    });
  }

  render() {
    const isMobileStyle = uaIsMobile() ? styles.mobile : '';
    const { newInvitingCnt, newCommunicatingCnt, newCooperatingCnt } = this.props.dealLists;
    return (
      <div className={`${styles.nav} ${isMobileStyle}`}>
        <div className={styles.wrap}>
          <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
            <Menu.Item key="inviting" className={styles.item}>
              <Link to={routePath.topperDashboardInviting}>
                <Badge dot={typeof newInvitingCnt === 'number' && newInvitingCnt > 0}>被邀請案件</Badge>
              </Link>
            </Menu.Item>
            <Menu.Item key="communication" className={styles.item}>
              <Link to={routePath.topperDashboardCommunication}>
                <Badge dot={typeof newCommunicatingCnt === 'number' && newCommunicatingCnt > 0}>溝通中案件</Badge>
              </Link>
            </Menu.Item>
            <Menu.Item key="cooperation" className={styles.item}>
              <Link to={routePath.topperDashboardCooperation}>
                <Badge dot={typeof newCooperatingCnt === 'number' && newCooperatingCnt > 0}>合作中案件</Badge>
              </Link>
            </Menu.Item>
            <Menu.Item key="closed" className={styles.item}>
              <Link to={routePath.topperDashboardClosed}>案主已關閉案件</Link>
            </Menu.Item>
            <Menu.Item key="invitedRecord" className={styles.item}>
              <Link className={styles.icon} to={routePath.topperDashboardApplied}><Send />已應徵案件</Link>
            </Menu.Item>
            <Menu.Item key="contact" className={styles.item}>
              <Link className={styles.icon} to={routePath.topperDashboardContact}><Visibility />查閱案件</Link>
            </Menu.Item>
          </Menu>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
