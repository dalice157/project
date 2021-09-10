import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { BrowserView, MobileView, uaIsMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import {
  Breadcrumb, Layout,
} from 'antd';
import queryString from 'query-string';

import { catsSimpleData, filterValidCats } from '../../util/lablesUtils.js';
import { catSearch, filterValidCategory } from '../../util/categoryUtils.js';
import { getCookie, reactLocalStorage } from '../../util/cookieUtil.js';

import {
  experienceData, methodData, targetData, timeSlotData, priorityData,
} from '../../config/selectData.js';

import {
  queryGigs, loadStaticArea, chkActiveProcess,
} from '../../actions/common.js';

import {
  addGigFromGigSearch, removeGigFromGigSearch,
} from '../../actions/search.js';
import banner from '../../img/common_v2/banner-pc.png';
import bannerMp from '../../img/common_v2/banner-mobile.png';
import bannerTutor from '../../img/common_v2/banner-tutor-pc.png';
import bannerTutorMobile from '../../img/common_v2/banner-tutor-mobile.png';

import Paginating from '../../components/ui/paginating';

import Card from '../../components/cardList';
import Sider from '../../components/search/Sider';
import Result from '../../components/search/Result';
import RecentQuery from '../../components/search/RecentQuery';
import MobileNav from '../../components/search/MobileNav';
import MobileFilter from '../../components/search/MobileFilter';
import Banner from '../../components/common_v2/Banner';
// TODO: 先註解，日後有可能會開啟 import Recommendation from '../../components/search/Recommendation';
import TagCloud from '../../components/search/TagCloud';
import styles from './Search.scss';
import { TUTOR_RECOMMENDATION } from '../../config/constant.js';

class ServiceList extends Component {
  state = {
    isSetting: false,
    searchValue: null,
    drawerVisible: false,
    filterVisible: false,
    areaLabel: '請選擇服務地區',
    openKeys: ['1'],
  }

  async componentDidMount() {
    const { history } = this.props;
    const { search, query } = history.location;
    const { openMore } = query;
    if (openMore) {
      this.showFilter();
    }
    await this.props.loadStaticArea();
    // 載入推薦搜尋
    if (!this.onLoadRecommendation(null)) {
      this.queryGigs(search);
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { search } = location;
    const prevSearch = prevProps.location.search;
    const kw = location.query.q;
    const prevKW = prevProps.location.query.q;
    const prePathname = (kw === prevKW && prevProps.location.pathname) || '';

    if (!this.onLoadRecommendation(prePathname) && search !== prevSearch) {
      this.queryGigs(search);
    }
  }

  queryGigs = (searchString) => {
    const { location, areaData, query } = this.props;
    const parsed = queryString.parse(searchString);
    const inTutorPage = location.pathname === '/search-tutor';

    if ('sort' in parsed) {
      parsed.sort = Number.isInteger(Number.parseFloat(parsed.sort)) ? Number.parseFloat(parsed.sort) : undefined;
    }

    if ('cats' in parsed) {
      const cats = parsed.cats.split(',');
      const validCats = filterValidCats(cats);
      parsed.cats = validCats.length > 0 ? validCats.toString() : undefined;
    } else if (inTutorPage) {
      parsed.cats = '1000000'; // 找家教老師, 進入口用不同path
      this.setState({ openKeys: ['1000000'] });
    } else {
      parsed.cats = '-1000000'; // 找外包, 要排掉家教
    }

    if ('priceMin' in parsed) {
      parsed.priceMin = Number.isInteger(Number.parseFloat(parsed.priceMin))
        ? Number.parseFloat(parsed.priceMin) : undefined;
    }

    if ('priceMax' in parsed) {
      parsed.priceMax = Number.isInteger(Number.parseFloat(parsed.priceMax))
        ? Number.parseFloat(parsed.priceMax) : undefined;
    }

    if ('expCat' in parsed) {
      const validExpCat = experienceData.find(exp => exp.id == Number.parseFloat(parsed.expCat));
      parsed.expCat = validExpCat && validExpCat.id;
    }

    if ('areas' in parsed) {
      const cats = parsed.areas.split(',');
      const validCats = filterValidCategory(areaData, cats);
      parsed.areas = validCats.length > 0 ? validCats.toString() : undefined;
    }

    if ('onsiteOpts' in parsed) {
      const validOnsiteOpts = methodData.find(method => method.id == parsed.onsiteOpts);
      parsed.onsiteOpts = validOnsiteOpts && validOnsiteOpts.id;
    }

    if ('clientCats' in parsed) {
      const validTarget = targetData.find(target => target.id == parsed.clientCats);
      parsed.clientCats = validTarget && validTarget.id;
    }

    if ('proirityOpts' in parsed) {
      const validPriority = parsed.proirityOpts.split(',').filter(priority => priorityData.find(item => item.id == priority));
      parsed.proirityOpts = validPriority.length > 0 ? validPriority.toString() : undefined;
    }

    if ('isOnlyMedal' in parsed) {
      parsed.isOnlyMedal = parsed.isOnlyMedal ? parsed.isOnlyMedal : undefined;
    }

    // 最近查詢前5筆 start
    reactLocalStorage.setRecentQuery(inTutorPage ? 'search-tutor' : 'search', parsed, areaData);

    const stringified = queryString.stringify(parsed);
    query(`?${stringified}`);
  }

  onAreaClick = (areas) => {
    const { history, areaData } = this.props;
    const intAreas = areas ? areas.split(',').map(item => ({ no: item })) : [];

    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '服務地區',
        maxSelectedNumber: 15,
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        selectedItems: intAreas,
        // unselectableList: '[0-9]{7}[0-9][0-9][1-9]',
        onSubmit: ({ selectedItems }) => {
          const items = selectedItems.map(item => item.no);
          const join = items.join();

          history.add('areas', join);
          const areaDescs = items.map((key) => {
            const ele = catSearch(areaData, key);
            return ele ? ele.des : '';
          });
          const areaDesc = areaDescs.length ? areaDescs.join('、') : '';
          const txt = areaDesc.length > 12 ? (`${areaDesc.substring(0, 10)}...`) : areaDesc;
          this.setState({
            areaLabel: txt,
          });
        },
        onClose: () => {

        },
      });
    }
  }

  onCatsChange = (e, cats, clean) => {
    const { history } = this.props;
    const { searchValue } = this.state;
    if (e) {
      const v = e.target ? e.target.value : e.key;
      if (clean) {
        history.push(`${clean}?cats=${v}`);
      } else {
        history.add('cats', v, null);
      }

      this.setState({
        drawerVisible: false,
        value: v,
        searchValue: e.key ? null : searchValue,
        openKeys: [`${v.substring(0, 1)}000000`],
        areaLabel: '請選擇服務地區',
      });
    } else if (cats) {
      history.add('cats', cats.join(), null);
    }
  }

  onTagChange = (tag) => {
    const { history } = this.props;
    history.add('q', tag);
  }

  onCashGo = (cashStart, cashEnd) => {
    const { history } = this.props;
    history.add({ priceMax: cashEnd, priceMin: cashStart });
  }

  handleExperienceChange = (value) => {
    const { history } = this.props;
    history.add('expCat', value);
  }

  handletMethodChange = (value) => {
    const { history } = this.props;
    history.add('onsiteOpts', value);
  }

  handletTargetChange = (value) => {
    const { history } = this.props;
    history.add('clientCats', value);
  }

  handleTimeslotChange = (value) => {
    const { history } = this.props;
    history.add('proirityOpts', value);
  }

  onFiliterChange = (value) => {
    const { history } = this.props;
    history.add('sort', value, null);
  }

  onSettingClick = () => {
    this.setState(prevState => ({ isSetting: !prevState.isSetting }));
  }

  onTagClose = (key) => {
    const { history } = this.props;
    if (key === 'q' || key === 'cats') {
      this.setState({
        searchValue: null,
        value: null,
        openKeys: [],
      });
    } else if (key === 'areas') {
      this.setState({
        areaLabel: '請選擇服務地區',
      });
    } else if (key === 'isOnlyMedal') {
      this.setState({
        medalChecked: false,
      });
    }

    history.remove(key);
  }

  onPagaChange = (pageNumber) => {
    const { history } = this.props;
    history.add('pageNum', pageNumber);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }

  handelSearch = (value) => {
    const { history } = this.props;
    history.push(`/search?q=${value}`);
    this.setState({
      value: null,
      openKeys: [],
    });
  }


  handleOnChange = (e) => {
    this.setState({
      searchValue: e ? e.target.value : null,
    });
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  hideDrawer = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  showFilter = () => {
    this.setState({
      filterVisible: true,
    });
  }

  hideFilter = () => {
    const { history } = this.props;
    const { search, pathname } = history.location;
    const params = new URLSearchParams(search);
    let getSearch = search;
    if (params.get('openMore')) {
      params.delete('openMore');
      getSearch = params.toString() ? `?${params.toString()}` : '';
    }
    history.push(`${pathname}${getSearch}`);
    this.setState({
      filterVisible: false,
    });
  }

  onOpenChange = (openKeys) => {
    this.setState({ openKeys });
  }

  onLoadRecommendation = (prevPathname) => {
    const { location } = this.props;
    const { tutorNoList, cookieStamp } = TUTOR_RECOMMENDATION;
    const inTutorPage = location.pathname === '/search-tutor';
    const prevInTutorPage = prevPathname && prevPathname === '/search-tutor';
    const cookieStampNo = parseFloat(getCookie(cookieStamp)) || null;
    const { onsiteOpts } = location.query;

    // console.log('prevInTutorPage', prevInTutorPage);
    // 若曾經點選家教推薦搜尋並且記錄cookie，則自動導向到指定推薦頁面
    if (inTutorPage && cookieStampNo && !onsiteOpts && !prevInTutorPage) {
      switch (cookieStampNo) {
        // 家教
        case tutorNoList.tutor: {
          this.handletMethodChange(tutorNoList.tutor);
          break;
        }
        // 工作室
        case tutorNoList.cramSchool: {
          this.handletMethodChange(tutorNoList.cramSchool);
          break;
        }
        // 線上服務
        case tutorNoList.onlineCourse: {
          this.handletMethodChange(tutorNoList.onlineCourse);
          break;
        }
        // 不拘
        case tutorNoList.all: {
          return false;
        }
        default: {
          break;
        }
      }
      return true;
    }
    return false;
  }


  onMedalChange = (checked) => {
    const { history } = this.props;
    history.add('isOnlyMedal', checked, null);
  }


  render() {
    const {
      isSetting,
      areaLabel,
      filterVisible,
      medalChecked,
    } = this.state;
    const {
      gigData, total, fileMap, areaData,
      gigListLoading, facets, location, history,
      removeFavoriteGig, addFavoriteGig,
    } = this.props;

    const pagePath = location.pathname;
    const params = location.query;
    const paramCats = params && params.cats;
    const stickerMode = params && params.stickerMode;
    let validCats = [];

    if (paramCats) {
      const cats = paramCats.split(',');
      validCats = filterValidCats(cats);
    } else if (location.pathname === '/search-tutor') {
      validCats = ['1000000']; // 找家教老師, 進入口用不同path
    }

    const catNo = validCats.length > 0 ? validCats[0] : null;
    const treeData = catsSimpleData(catNo);
    const catsSetting = {
      onCatsChange: this.onCatsChange,
      data: treeData,
      catsValue: validCats.length > 0 ? validCats : undefined,
      catNo,
      qValue: params.q,
    };
    params.priceMin = Number.isInteger(Number.parseFloat(params.priceMin))
      ? Number.parseFloat(params.priceMin) : undefined;
    params.priceMax = Number.isInteger(Number.parseFloat(params.priceMax))
      ? Number.parseFloat(params.priceMax) : undefined;

    const cashs = {
      cashStart: params.priceMin,
      cashEnd: params.priceMax,
      onCashGo: this.onCashGo,
    };

    const isSearchingArea = params.areas && areaData.length > 0;
    let showAraeLabel = params.areas ? areaLabel : '請選擇服務地區';
    let validAreas;

    if (isSearchingArea) {
      const cats = params.areas.split(',');
      validAreas = filterValidCategory(areaData, cats);
      const areaDescs = validAreas.map((key) => {
        const ele = catSearch(areaData, key);
        return ele ? ele.des : '';
      });
      showAraeLabel = validAreas.length > 0 ? areaDescs.join('、') : showAraeLabel;
      validAreas = validAreas.length > 0 ? validAreas.toString() : undefined;
      params.areas = validAreas;
    }

    params.expCat = Number.parseFloat(params.expCat);
    const validExpCat = experienceData.find(exp => exp.id == params.expCat);
    const validOnsiteOpts = methodData.find(method => method.id == params.onsiteOpts);
    const validTarget = targetData.find(target => target.id == params.clientCats);
    const validPriority = params.proirityOpts && params.proirityOpts.split(',').filter(priority => priorityData.find(item => item.id == priority));

    const dataAll = {
      experienceData,
      expCatValue: validExpCat && validExpCat.id,
      methodData,
      methodValue: validOnsiteOpts && validOnsiteOpts.id,
      targetData,
      targetValue: validTarget && validTarget.id,
      timeSlotData,
      timeSlotValue: validPriority && validPriority.length > 0 ? validPriority.toString() : undefined,
    };

    // 不合規之搜尋條件，不顯示 Tag
    !cashs.cashStart && delete params.priceMin;
    !cashs.cashEnd && delete params.priceMax;
    isSearchingArea && !validAreas && delete params.areas;
    !validExpCat && delete params.expCat;
    !validOnsiteOpts && delete params.onsiteOpts;
    !validTarget && delete params.clientCats;
    !validPriority && delete params.proirityOpts;

    const setting = {
      onSettingClick: this.onSettingClick,
      isSetting,
    };

    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    const { /* TODO: 先註解，日後有可能會開啟 cookieStamp, */ tutorNo } = TUTOR_RECOMMENDATION;
    /* TODO: 先註解，日後有可能會開啟
    const cookieStampNo = parseInt(getCookie(cookieStamp)) || null;
    const showRecommendationModal = inTutorPage && !cookieStampNo && !params.onsiteOpts;
    */
    const inTutorPage = treeData.key === tutorNo;
    const breadcrumb = inTutorPage ? '家教服務列表' : '服務列表';
    const resultProps = {
      pagePath,
      ferretOut: params,
      total,
      sort: params.sort || '0',
      areaData,
      onFiliterChange: this.onFiliterChange,
      onTagClose: this.onTagClose,
      onMedalChange: this.onMedalChange,
      medalChecked,
    };
    const siderProps = {
      catsSetting,
      cashs,
      dataAll,
      areaLabel: showAraeLabel,
      onAreaClick: cb => this.onAreaClick(validAreas, cb),
      setting,
      handleTimeslotChange: this.handleTimeslotChange,
      handleExperienceChange: this.handleExperienceChange,
      handletMethodChange: this.handletMethodChange,
      handletTargetChange: this.handletTargetChange,
      showFilter: this.showFilter,
      hideFilter: this.hideFilter,
      filterVisible,
      loading: gigListLoading,
    };
    const cardProps = {
      isMobile,
      data: gigData,
      fileMap,
      areaData,
      choice: treeData.key,
      loading: gigListLoading,
      removeFavoriteGig,
      addFavoriteGig,
      catNo,
      chkActiveProcess: this.props.chkActiveProcess,
    };
    const mobileNavProps = {
      location,
    };

    return !stickerMode ? (
      <Fragment>
        <BrowserView>
          <div className={styles.wrap}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item><Link to="/">首頁</Link></Breadcrumb.Item>
              <Breadcrumb.Item>
                {catNo ? <a onClick={() => this.onTagClose('cats')}>{breadcrumb}</a> : <h1 className={styles.topCategory}>{breadcrumb}</h1>}
                {' '}
              </Breadcrumb.Item>
              {
                catNo && !inTutorPage && (
                <Breadcrumb.Item>
                  <h1 className={styles.topCategory}>{treeData.title}</h1>
                </Breadcrumb.Item>
                )
              }
            </Breadcrumb>
            <Layout hasSider>
              <Sider
                {...siderProps}
              />
              <Layout className={styles.layout}>
                <div className={styles.banner}>
                  {
                    inTutorPage ? (
                      <Banner img={bannerTutor} link="https://blog.top.104.com.tw/online-tutor/?utm_source=top&utm_medium=banner&utm_campaign=online-tutor" title="線上學習X解題家教" />
                    ) : (
                      <Banner img={banner} link="https://blog.top.104.com.tw/new-free-trial/?utm_source=top&utm_medium=banner&utm_campaign=new-free-trial" title="讓我們一起防疫 免費接案30天" />
                    )
                  }
                </div>
                {/* TODO: 先註解，日後有可能會開啟 <Recommendation showModal={showRecommendationModal} handletMethodChange={this.handletMethodChange} /> */}
                <TagCloud
                  pageType={inTutorPage ? 1 : 2}
                  facets={facets}
                  onClick={v => this.onCatsChange({ key: v }, null, null)}
                  onTagChange={this.onTagChange}
                  ferretOut={params}
                />
                <Result
                  {...resultProps}
                />
                {
                  gigData.length > 0 ? (
                    <>
                      <div className={`${styles.cardWarp} ${isMobileStyle}`}>
                        <Card
                          {...cardProps}
                        />
                      </div>
                      <Paginating
                        className={styles.pagination}
                        current={params.pageNum ? parseFloat(params.pageNum) : 1}
                        defaultPageSize={12}
                        total={total}
                        ceiling={6000}
                        onChange={this.onPagaChange}
                      />
                      <RecentQuery type={inTutorPage ? 'search-tutor' : 'search'} linkTo={history.push} />
                    </>
                  ) : (
                    <div className={`${styles.noDataWrap} ${isMobileStyle}`}>
                      找不到您需要的服務嗎？
                      {' '}
                      <br />
                      擴大搜尋條件 或
                      {' '}
                      <a target="_blank" href="/api/login?pageRef=/caseForm">免費發案，人才主動應徵</a>
                    </div>
                  )
                }
              </Layout>
            </Layout>
          </div>
        </BrowserView>
        <MobileView>
          <MobileFilter siderProps={siderProps} />
          <MobileNav
            {...mobileNavProps}
          />
          <div className={styles.mobileWrap}>
            <div className={styles.banner}>
              {
              inTutorPage ? (
                <Banner imgMp={bannerTutorMobile} link="https://blog.top.104.com.tw/online-tutor/?utm_source=top&utm_medium=banner&utm_campaign=online-tutor" title="線上學習X解題家教" />
              ) : (
                <Banner imgMp={bannerMp} link="https://blog.top.104.com.tw/new-free-trial/?utm_source=top&utm_medium=banner&utm_campaign=new-free-trial" title="陪你防疫 免費接案30天" />
              )
            }
            </div>
            {/* 家教偏好搜尋 - 手機 以及新增開關 */}
            {/* TODO: 先註解，日後有可能會開啟 <Recommendation showModal={showRecommendationModal} handletMethodChange={this.handletMethodChange} /> */}
            <TagCloud pageType={inTutorPage ? 1 : 2} facets={facets} onClick={v => this.onCatsChange({ key: v }, null, null)} onTagChange={this.onTagChange} ferretOut={params} />
            <Result
              {...resultProps}
            />
            {
              gigData.length > 0 ? (
                <>
                  <div className={`${styles.cardWarp} ${isMobileStyle}`}>
                    <Card
                      {...cardProps}
                    />
                  </div>
                  <Paginating
                    className={styles.pagination}
                    current={params.pageNum ? parseFloat(params.pageNum) : 1}
                    defaultPageSize={12}
                    total={total}
                    ceiling={6000}
                    onChange={this.onPagaChange}
                  />
                  <RecentQuery type={inTutorPage ? 'search-tutor' : 'search'} linkTo={this.props.history.push} />
                </>
              ) : (
                <div className={`${styles.noDataWrap} ${isMobileStyle}`}>
                  找不到您需要的服務嗎？
                  {' '}
                  <br />
                  {' '}
                  <br />
                  擴大搜尋條件
                  {' '}
                  <br />
                  {' '}
                  或
                  {' '}
                  <br />
                  <a target="_blank" href="/api/login?pageRef=/caseForm">免費發案，人才主動應徵</a>
                </div>
              )
            }

          </div>
        </MobileView>
      </Fragment>
    ) : (
      <Fragment>
        <div className={styles.stickerMode}>
          {
          gigData.length > 0 ? (
            <>
              <div className={styles.cardWarp}>
                <Card
                  {...cardProps}
                />
              </div>
            </>
          ) : (
            <div className={`${styles.noDataWrap} ${isMobileStyle}`}>
              找不到您需要的服務嗎？
              {' '}
              <br />
              擴大搜尋條件 或
              {' '}
              <a target="_blank" href="/api/login?pageRef=/caseForm">免費發案，人才主動應徵</a>
            </div>
          )
          }
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  gigData: state.common.paged.data,
  total: state.common.paged.total,
  facets: state.common.paged.facets,
  fileMap: state.common.paged.fileMap,
  areaData: state.common.area,
  gigListLoading: state.common.gigListLoading,
});

const mapDispatchToProps = {
  query: queryGigs,
  loadStaticArea,
  addFavoriteGig: addGigFromGigSearch,
  removeFavoriteGig: removeGigFromGigSearch,
  chkActiveProcess,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ServiceList),
);
