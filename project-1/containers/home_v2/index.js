import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { uaIsMobile } from 'react-device-detect';
import defaultImg20 from '../../components/ui/cropUploader/default_20.jpg';
import Slideshow from '../../components/home_v2/Slideshow';
import Footer from '../../components/footer_v3';
import Articles from './Article';
import Announcement from './Announcement.js';
import FindTopperAndDemander from '../../components/home_v2/FindTopperAndDemander.js';
import Banner from '../../components/home_v2/Banner.js';
import Search from './SearchTab';
import config from '../../config/config';
import { loadDemandWindowList } from '../../actions/demandWindow';
import { chkActiveProcess } from '../../actions/common';
import { error } from '../../util/messageUtil.js';

import styles from './Home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pic: defaultImg20,
      oriFile: null,
      fileId: null,
    };
  }

  preReceverCropImg = ({
    fileId,
    fileUrlMap,
    coordinate
  }) => {
    console.log(`onFinishProcessing fileId: ${fileId} , fileUrlMap: ${fileUrlMap} , coordinate is ${coordinate}`);
    console.log('fileUrlMap', fileUrlMap);
    this.setState({
      pic: fileUrlMap.w600,
      oriFile: fileUrlMap.origin,
      fileId: fileId,
      searchData: ''
    });
  }

  receverCropImg = ({
    fileId,
    fileUrlMap,
    coordinate
  }) => {
    console.log(`onFinishProcessing fileId: ${fileId} , fileUrlMap: ${fileUrlMap} , coordinate is ${coordinate}`);
    console.log('fileUrlMap', fileUrlMap);
    this.setState({
      pic: fileUrlMap.url[0],
      oriFile: fileUrlMap.origin[0],
      fileId: fileId
    });
  }

  handelSearch = (value, searchType) => {
    if (searchType === 'demand') {
      this.props.history.push(value ? '/caseList?q=' + value : '/caseList');
    } else {
      // default is search-Topper
      this.props.history.push(value ? '/search?q=' + value : '/search');
    }
  }

  openDemandPage = (basicId, demandId) => (open(`${config.topSite.domain}/caseInfo?basicId=${basicId}&demandId=${demandId}`));


  componentDidMount() {
    this.props.initDemandWindowList();
    const payAfter = this.props.location.query.pay;
    const msg = this.props.location.query.msg;
    if (payAfter && payAfter === 'error') {
      error('tx-record-exception');
    } else if (msg) {
      error(msg);
    }
  }

  render() {
    const isMobile = uaIsMobile();
    return (
      <>
        {
        !isMobile && (
          <div className={styles.wrap}>
            <h1 className={styles.title}>104 高手－找外包接案兼差、解決家教生活需求的專業平台</h1>
            <Slideshow />
            {/* 首頁公告 */}
            <Announcement />
            {/* 高手三步驟 */}
            <FindTopperAndDemander memberCheck={this.props.chkActiveProcess} />
            {/* 高手專欄 */}
            <Articles />
          </div>
        )
      }
        {
        isMobile && (
        <div className={styles.mobile}>
          {/* 首頁公告 */}
          <Announcement />
          <ul className={styles.nav}>
            <li data-gtm-index="MO-加入接案" className={styles.join}><span className={styles.icon} /><Link to="/join">加入接案</Link></li>
            <li data-gtm-index="MO-免費發案" className={styles.free}><span className={styles.icon} /><Link to="/caseForm">免費發案</Link></li>
          </ul>
          <Search />
          <Banner />
        </div>
        )
      }
        <Footer memberCheck={this.props.chkActiveProcess} />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    demandWindowPublished: state.demandWindow.isPublished,
    demandList: state.demandWindow.demandList
  };
};

const mapDispatchToProps = {
  initDemandWindowList: loadDemandWindowList,
  chkActiveProcess
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
