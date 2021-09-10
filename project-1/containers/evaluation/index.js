import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import { Layout } from 'antd';
import {
  loadReviewAvg, loadReviewGig, loadGigList, loadReviewItemList
} from '../../actions/common';
import Banner from '../../components/evaluation/Banner';
import BannerMobile from '../../components/evaluation/BannerMobile';
import SideBar from '../../components/evaluation/SideBar';
import SideBarMobile from '../../components/evaluation/SideBarMobile';
import Lists from '../../components/evaluation/List';
import styles from './Evaluation.scss';
import { isNumber } from '../../util/commonUtil';
import { EVALUATION_TYPE } from '../../config/constant';

const { Content, Sider } = Layout;
const defaultPage = '1';

class Evaluation extends Component {
  componentDidMount() {
    const basicId = this.props.match.params.basicId;
    const gigId = this.props.location.query.gigId || 0;
    const page = Number(this.props.history.location.query.page || defaultPage);
    const type = this.props.history.location.query.type || EVALUATION_TYPE.all;
    if (isNumber(basicId)) {
      this.props.loadReviewAvg(basicId);
      this.props.loadGigList(basicId, gigId, page, type);
    }
  }

  // 參考效能最佳化：https://zh-hant.reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action
  shouldComponentUpdate(nextProps) {
    if (this.props.location.query !== nextProps.location.query) {
      const basicId = nextProps.match.params.basicId;
      const gigId = nextProps.location.query.gigId || 0;
      const page = Number(nextProps.history.location.query.page || defaultPage);
      const type = nextProps.history.location.query.type || EVALUATION_TYPE.all;
      this.props.loadReviewAvg(basicId);
      this.props.loadGigList(basicId, gigId, page, type);
    }
    // 決定會不會觸發render()
    return true;
  }

  handleClickGig = (gigId) => {
    this.onPageChange(defaultPage);
    this.onTypeChange(EVALUATION_TYPE.all);
    this.onGigChange(gigId);
  }

  handleSelect = (selectedType = EVALUATION_TYPE.all) => {
    this.onTypeChange(selectedType);
    this.onPageChange(defaultPage);
  }

  onTypeChange = (type) => {
    this.props.history.add('type', type);
  }

  onGigChange = (gigId) => {
    this.props.history.add('gigId', gigId);
  }

  onPageChange = (page = defaultPage) => {
    this.props.history.add('page', page);
  }

  render() {
    const {
      sideBarList, reviewAvg, reviewGig, itemList
    } = this.props;
    const basicId = this.props.match.params.basicId;
    const type = this.props.history.location.query.type;
    const gigId = this.props.history.location.query.gigId;
    const page = Number(this.props.history.location.query.page || defaultPage);
    return (
      <Fragment>
        <BrowserView>
          <div className={styles.wrap}>
            {
              reviewAvg
              && (
                <>
                  <h1 className={styles.title}>{reviewAvg.topperName}的接案評價紀錄－104 高手</h1>
                  <Banner
                    basicId={basicId}
                    dealCount={reviewAvg.dealCount}
                    ranking1={reviewAvg.ranking1}
                    ranking2={reviewAvg.ranking2}
                    ranking3={reviewAvg.ranking3}
                    reviewAvgScore={reviewAvg.reviewAvgScore}
                    reviewCount={reviewAvg.reviewCount}
                    topperImg={reviewAvg.topperImg}
                    topperName={reviewAvg.topperName}
                  />
                </>
              )
            }
            <Layout hasSider className={styles.layout}>
              <Sider
                breakpoint="lg"
                collapsedWidth="0"
              >
                <SideBar
                  sideBarList={sideBarList}
                  handleClick={this.handleClickGig}
                  selectedGig={gigId}
                />
              </Sider>
              <Layout className={styles.content}>
                <Content>
                  <Lists
                    reviewGig={reviewGig}
                    gigId={gigId}
                    sideBarList={sideBarList}
                    onPageChange={this.onPageChange}
                    pageNum={page}
                    itemList={itemList}
                    handleSelect={this.handleSelect}
                    type={type}
                  />
                </Content>
              </Layout>
            </Layout>
          </div>
        </BrowserView>
        <MobileView>
          <div className={`${styles.wrap} ${styles.mobile}`}>
            {
              reviewAvg
              && (
                <>
                  <h1 className={styles.title}>{reviewAvg.topperName}的接案評價紀錄－104 高手</h1>
                  <BannerMobile
                    basicId={basicId}
                    dealCount={reviewAvg.dealCount}
                    ranking1={reviewAvg.ranking1}
                    ranking2={reviewAvg.ranking2}
                    ranking3={reviewAvg.ranking3}
                    reviewAvgScore={reviewAvg.reviewAvgScore}
                    reviewCount={reviewAvg.reviewCount}
                    topperImg={reviewAvg.topperImg}
                    topperName={reviewAvg.topperName}
                  />
                </>
              )
            }
            <SideBarMobile
              sideBarList={sideBarList}
              basicId={basicId}
            />
          </div>
        </MobileView>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  reviewAvg: state.common.reviewAvg,
  sideBarList: state.common.sideBarList,
  reviewGig: state.common.reviewGig,
  itemList: state.common.itemList
});

const mapDispatchToProps = {
  loadReviewAvg,
  loadGigList,
  loadReviewGig,
  loadReviewItemList
};

export default connect(mapStateToProps, mapDispatchToProps)(Evaluation);
