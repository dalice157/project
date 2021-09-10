import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { BrowserView, MobileView, uaIsMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import {
  Breadcrumb, Layout,
} from 'antd';
import { loadUserInfo } from '../../actions/basic';
import { catsSimpleData } from '../../util/lablesUtils.js';
import { addGigFromCollection, removeGigFromCollection, loadGigsCollection } from '../../actions/collection.js';
import { chkActiveProcess } from '../../actions/common.js';
import Paginating from '../../components/ui/paginating';
import Card from '../../components/myCollection';
import Sider from '../../components/myCollection/CollectionSider';
import styles from './myCollection.scss';

class MyCollection extends PureComponent {
  componentDidMount() {
    const pageNum = this.props?.history?.location?.query?.pageNum || 1;
    this.props.chkActiveProcess()
      .then(res => res.payload?.success && this.props.loadFavoriteGig(pageNum));
  }

  componentDidUpdate(prevProps) {
    const { location, history } = this.props;
    const pageNum = history?.location?.query?.pageNum || 1;
    const { search } = location;
    const prevSearch = prevProps.location.search;
    if (search !== prevSearch) {
      this.props.loadFavoriteGig(pageNum);
    }
  }

  onPagaChange = (pageNumber) => {
    this.props.history.add('pageNum', pageNumber);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }

  render() {
    const {
      gigData, total, fileMap, areaData, gigListLoading, totalGigs, location,
    } = this.props;
    const params = location.query;
    const paramCats = location.query.cats;
    const catNo = paramCats ? paramCats.split(',')[0] : null;
    const treeData = catsSimpleData(catNo);
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';

    return (
      <>
        <BrowserView>
          <div className={styles.wrap}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item><Link to="/">首頁</Link></Breadcrumb.Item>
              <Breadcrumb.Item>我的收藏</Breadcrumb.Item>
              { catNo && <Breadcrumb.Item>{treeData.title}</Breadcrumb.Item> }
            </Breadcrumb>
            <Layout hasSider>
              <Sider total={totalGigs} />
              <Layout className={styles.layout}>
                {
                  gigData.length > 0 ? (
                    <>
                      <div className={`${styles.cardWarp} ${isMobileStyle}`}>
                        <Card data={gigData} fileMap={fileMap} areaData={areaData} choice={treeData.key} loading={gigListLoading} removeFavoriteGig={this.props.removeFavoriteGig} addFavoriteGig={this.props.addFavoriteGig} chkActiveProcess={this.props.chkActiveProcess} />
                      </div>
                      <Paginating
                        className={styles.pagination}
                        current={params.pageNum ? parseInt(params.pageNum) : 1}
                        defaultPageSize={12}
                        total={total}
                        onChange={this.onPagaChange}
                      />
                    </>
                  ) : <div className={styles.noData}>尚無收藏任何服務!!</div>
                }

              </Layout>
            </Layout>
          </div>
        </BrowserView>
        <MobileView>
          <div className={styles.mobileWrap}>
            <div className={styles.banner}>
              <Breadcrumb className={styles.bannerCrumb} separator=">">
                <Breadcrumb.Item><Link to="/">首頁</Link></Breadcrumb.Item>
                <Breadcrumb.Item>我的收藏</Breadcrumb.Item>
                { catNo && <Breadcrumb.Item>{treeData.title}</Breadcrumb.Item> }
              </Breadcrumb>
            </div>
            {
              gigData.length > 0 ? (
                <>
                  <Card data={gigData} fileMap={fileMap} areaData={areaData} choice={treeData.key} loading={gigListLoading} removeFavoriteGig={this.props.removeFavoriteGig} addFavoriteGig={this.props.addFavoriteGig} chkActiveProcess={this.props.chkActiveProcess} />
                  <Paginating
                    className={styles.pagination}
                    current={params.pageNum ? parseInt(params.pageNum) : 1}
                    defaultPageSize={12}
                    total={total}
                    onChange={this.onPagaChange}
                  />
                </>
              ) : <div className={styles.noData}>尚無收藏任何服務!!</div>
            }

          </div>
        </MobileView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  gigData: state.collection.paged.data,
  total: state.collection.paged.total,
  facets: state.collection.paged.facets,
  fileMap: state.collection.paged.fileMap,
  gigListLoading: state.collection.gigListLoading,
  totalGigs: state.collection.totalGigs,
});

const mapDispatchToProps = {
  loadFavoriteGig: loadGigsCollection,
  addFavoriteGig: addGigFromCollection,
  removeFavoriteGig: removeGigFromCollection,
  initUser: loadUserInfo,
  chkActiveProcess,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MyCollection),
);
