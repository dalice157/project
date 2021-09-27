import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { BrowserView, MobileView, uaIsMobile } from 'react-device-detect';
import { chkActiveProcess } from '../../actions/common';
// import cancel from '../../img/common_v2/icon-cancel.svg';
import Slideshow from '../../components/marketing_v3/Slideshow';
// import BeTopperButton from '../common_v2/BeTopperButton';
import Footer from '../../components/footer_v3';
import Faq from './Faq';
import FreeTrial from '../../components/marketing_v3/FreeTrial';
import PopularService from '../common_v2/PopularService.js';
import styles from './Marketing.scss';
import TerminateModal from '../../components/terminateModal';

class Marketing extends Component {
  state = {
    show: false,
    visible: false,
  }

  componentDidMount() {
    if (!uaIsMobile()) {
      addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    removeEventListener('scroll', this.handleScroll);
  }

  close = () => {
    this.setState({
      visible: true,
    });
  }


  handleScroll = () => {
    const scrollTops = document.documentElement.scrollTop;
    if (scrollTops > 414) {
      this.setState({
        show: true,
      });
    } else {
      this.setState({
        show: false,
      });
    }
  }

  modalContext = (
    <>
      <p>
        1. 2021年10月1日(五)起，將停止販售 超值型NT$399/60天、無限型NT$1980/60天 等接案方案。
        <br />
        2. 免費體驗同步停止申請。
      </p>
      <br />
      <p>感謝您的使用與支持，造成您的不便敬請見諒。</p>
    </>
  )

  render() {
    // const isClose = this.state.visible ? styles.hide : '';
    return (
      <>
        <BrowserView onScroll={this.handleScroll}>
          <h1 className={styles.title}>加入接案 高手</h1>
          <Slideshow />
          <FreeTrial isShow={this.state.show} />
          { /* 5星好評成交見證 */}
          <div className={styles.popularBanner}>
            <PopularService type="join" />
          </div>
          <Faq />
          <Footer memberCheck={this.props.chkActiveProcess} />
          <TerminateModal
            title="104高手方案販售變更通知"
            context={this.modalContext}
          />
          {/* <div className={`${styles.btnBg} ${isClose}`}>
            <div className={styles.wrap}>
              <div className={styles.infoWrap}>
                <div className={styles.line} />
                <div className={styles.info}>
                  <h3 className={styles.title}>只要$399 立即開始接案</h3>
                </div>
              </div>
              <BeTopperButton text="我想加入" gtmFrom="join" />
              <a className={styles.close} onClick={this.close} href="javascript:;">
                <img src={cancel} alt="關閉" />
              </a>
            </div>
          </div> */}
        </BrowserView>
        <MobileView>
          <div className={`${styles.wrap} ${styles.mobile}`}>
            <Slideshow />
            <FreeTrial />
            { /* 5星好評成交見證 */}
            <div className={styles.popularBanner}>
              <PopularService type="join" />
            </div>
            <Faq />
          </div>
          <Footer memberCheck={this.props.chkActiveProcess} />
          {/* <div className={`${styles.btnMPBg} ${isClose}`}>
            <a className={styles.close} onClick={this.close} href="javascript:;">
              <img src={cancel} alt="關閉" />
            </a>
            <div className={styles.wrap}>
              <h3 className={styles.title}>只要$399 立即開始接案</h3>
              <BeTopperButton text="我想加入" gtmFrom="join" />
            </div>
          </div> */}
        </MobileView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = {
  chkActiveProcess,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Marketing));
