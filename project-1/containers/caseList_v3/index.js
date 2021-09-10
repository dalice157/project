import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { BrowserView, MobileView, uaIsMobile } from 'react-device-detect';

import { Breadcrumb, Layout } from 'antd';
import queryString from 'query-string';
import classnames from 'classnames';

import { catsSimpleData, filterValidCats } from '../../util/lablesUtils.js';
import { catSearch, filterValidCategory } from '../../util/categoryUtils.js';
import { reactLocalStorage } from '../../util/cookieUtil.js';
import { targetData } from '../../config/selectData.js';

// import NavBar from '../../components/ui/navBar';
import banner from '../../img/common_v2/banner-pc.png';
import bannerMp from '../../img/common_v2/banner-mobile.png';
import MobileNav from '../../components/search/MobileNav';
import MobileFilter from '../../components/search/MobileFilter';
import Result from '../../components/search/Result';
import TagCloud from '../../components/search/TagCloud';
import RecentQuery from '../../components/search/RecentQuery';
import Sider from '../../components/search/Sider';
import List from '../../components/caseList_v3/List';
import Paginating from '../../components/ui/paginating';
import Banner from '../../components/common_v2/Banner';


import { getAreaToCase, loadStaticArea } from '../../actions/common';
import { loadUserInfo } from '../../actions/basic';

import styles from './CaseList.scss';


class CaseList extends Component {
  state = {
    isSetting: false,
    value: null,
    searchValue: null,
    showSearch: false,
    drawerVisible: false,
    filterVisible: false,
    areaLabel: '請選擇案件地區',
    openKeys: ['1'],
    classWayLabel: null,
  }

  componentDidMount() {
    const { search, query } = this.props.history.location;
    const { openMore } = query;
    if (openMore) {
      this.showFilter();
    }
    if (!this.props.user.pid) {
      // 若目前的資料未登入，則進行二次檢查
      this.props.initUser().then(() => this.queryData(search));
    } else {
      // 已登入
      this.queryData(search);
    }
  }

  componentDidUpdate(prevProps) {
    const { search } = this.props.location;
    const preSearch = prevProps.location.search;
    if (search !== preSearch) {
      this.queryData(search);
    }
  }

  queryData = (searchString) => {
    const parsed = queryString.parse(searchString);

    if ('cats' in parsed) {
      const cats = parsed.cats.split(',');
      const validCats = filterValidCats(cats);
      parsed.cats = validCats.length > 0 ? validCats.toString() : undefined;
    }

    if ('areas' in parsed) {
      const cats = parsed.areas.split(',');
      const validCats = filterValidCategory(this.props.areaData, cats);
      parsed.areas = validCats.length > 0 ? validCats.toString() : undefined;
    }

    if ('priceMin' in parsed) {
      parsed.priceMin = Number.isInteger(Number.parseInt(parsed.priceMin)) ? Number.parseInt(parsed.priceMin) : undefined;
    }

    if ('priceMax' in parsed) {
      parsed.priceMax = Number.isInteger(Number.parseInt(parsed.priceMax)) ? Number.parseInt(parsed.priceMax) : undefined;
    }

    if ('clientCats' in parsed) {
      const validTarget = targetData.find(target => target.id == parsed.clientCats);
      parsed.clientCats = validTarget && validTarget.id;
    }

    if ('classWay' in parsed) {
      const classWays = parsed.classWay.split(',');
      this.setState({
        classWayLabel: classWays,
      });
      parsed.classWay = classWays ? classWays.toString() : undefined;
    }

    // 最近查詢前5筆 start
    reactLocalStorage.setRecentQuery('caseList', parsed, this.props.areaData);
    const stringified = queryString.stringify(parsed);

    this.props.query(`?${stringified}`);
  }

  onSettingClick = () => {
    this.setState({
      isSetting: !this.state.isSetting,
    });
  }

  onFiliterChange = (value) => {
    this.props.history.add('sort', value, null);
  }

  onTagClose = (key) => {
    if (key === 'q' || key === 'cats') {
      this.setState({
        searchValue: null,
        value: null,
        openKeys: [],
      });
    } else if (key === 'areas') {
      this.setState({
        areaLabel: '請選擇案件地區',
      });
    } else if (key === 'classWay') {
      this.setState({
        classWayLabel: null,
      });
    }
    this.props.history.remove(key);
  }

  onAreaClick = (areas) => {
    const intAreas = areas ? areas.split(',').map(item => ({ no: item })) : [];

    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '案件地區',
        maxSelectedNumber: 15,
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        selectedItems: intAreas,
        // unselectableList: '[0-9]{7}[0-9][0-9][1-9]',
        onSubmit: ({ selectedItems }) => {
          const items = selectedItems.map(item => item.no);
          const join = items.join();

          this.props.history.add('areas', join);
          const areaDescs = items.map((key) => {
            const ele = catSearch(this.props.areaData, key);
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

  onCatsChange = (e, cats, path) => {
    if (e) {
      const v = e.target ? e.target.value : e.key;
      if (path) {
        this.props.history.push(`${path}?cats=${v}`);
      } else {
        this.props.history.add('cats', v, null);
      }

      this.setState({
        drawerVisible: false,
        value: v,
        searchValue: e.key ? null : this.state.searchValue,
        openKeys: [`${v.substring(0, 1)}000000`],
        areaLabel: '請選擇案件地區',
      });
    } else if (cats) {
      this.props.history.add('cats', cats.join(), null);
    }
  }

  onCashGo = (cashStart, cashEnd) => {
    this.props.history.add({ priceMax: cashEnd, priceMin: cashStart });
  }

  handletTargetChange = (value) => {
    this.props.history.add('clientCats', value);
  }

  handletWayChange = (val) => {
    this.setState({
      classWayLabel: val,
    });
    this.props.history.add('classWay', val.join(), null);
  }

  handelSearch = (value) => {
    this.props.history.push(`/caseList?q=${value}`);
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

  onPagaChange = (pageNumber) => {
    this.props.history.add('pageNum', pageNumber);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
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
    const { search, pathname } = this.props.history.location;
    const params = new URLSearchParams(search);
    let getSearch = search;
    if (params.get('openMore')) {
      params.delete('openMore');
      getSearch = params.toString() ? `?${params.toString()}` : '';
    }
    this.props.history.push(`${pathname}${getSearch}`);
    this.setState({
      filterVisible: false,
    });
  }

  onOpenChange = (openKeys) => {
    this.setState({ openKeys });
  }

  render() {
    const {
      isSetting,
      areaLabel,
      classWayLabel,
      filterVisible,
    } = this.state;
    const {
      areaData, total, caseData, facets, caseListLoading, location,
    } = this.props;
    const params = this.props.location.query;
    const paramCats = this.props.location.query.cats;
    const stickerMode = params && params.stickerMode;
    let validCats = [];

    if (paramCats) {
      const cats = paramCats.split(',');
      validCats = filterValidCats(cats);
    }

    const catNo = validCats.length > 0 ? validCats[0] : null;
    const treeData = catsSimpleData(catNo);
    const isSearchingArea = params.areas && areaData.length > 0;
    let validAreas;
    let showAraeLabel = params.areas ? areaLabel : '請選擇服務地區';

    if (isSearchingArea) {
      const cats = params.areas.split(',');
      validAreas = filterValidCategory(areaData, cats);
      const areaDescs = validAreas.map((key) => {
        const ele = catSearch(this.props.areaData, key);
        return ele ? ele.des : '';
      });
      showAraeLabel = validAreas.length > 0 ? areaDescs.join('、') : showAraeLabel;
      validAreas = validAreas.length > 0 ? validAreas.toString() : undefined;
      params.areas = validAreas;
    }

    const catsSetting = {
      onCatsChange: this.onCatsChange,
      data: treeData,
      catsValue: validCats.length > 0 ? validCats : undefined,
      catNo,
      qValue: params.q,
    };

    params.priceMin = Number.isInteger(Number.parseInt(params.priceMin)) ? Number.parseInt(params.priceMin) : undefined;
    params.priceMax = Number.isInteger(Number.parseInt(params.priceMax)) ? Number.parseInt(params.priceMax) : undefined;

    const cashs = {
      cashStart: params.priceMin,
      cashEnd: params.priceMax,
      onCashGo: this.onCashGo,
    };

    const waySetting = {
      handletWayChange: this.handletWayChange,
      wayVal: classWayLabel,
    };
    const validTarget = targetData.find(target => target.id == params.clientCats);

    const dataAll = {
      targetData,
      targetValue: validTarget && validTarget.id,
    };

    // 不合規之搜尋條件，不顯示 Tag
    !cashs.cashStart && delete params.priceMin;
    !cashs.cashEnd && delete params.priceMax;
    isSearchingArea && !validAreas && delete params.areas;
    !validTarget && delete params.clientCats;

    const setting = {
      onSettingClick: this.onSettingClick,
      isSetting,
    };

    const siderProps = {
      type: 1,
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
      loading: caseListLoading,
      waySetting,
    };


    const pageNum = params.pageNum == 1 || params.pageNum == undefined ? 1 : Number(params.pageNum);
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    const paginatingIsHide = caseData.length > 0;
    return !stickerMode ? (
      <>
        {/* {!isMobile && <NavBar type={1} activeClass={true} choice={treeData.key} />} */}
        <BrowserView>

          <div className={styles.bg}>
            <div className={styles.wrap}>
              <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to="/">首頁</Link></Breadcrumb.Item>
                <Breadcrumb.Item>
                  {catNo ? <a onClick={() => this.onTagClose('cats')}>案件列表</a> : <h1 className={styles.topCategory}>案件列表</h1>}
                  {' '}
                </Breadcrumb.Item>
                { catNo && <Breadcrumb.Item><h1 className={styles.topCategory}>{treeData.title}</h1></Breadcrumb.Item> }
              </Breadcrumb>
              <Layout hasSider>
                <Sider
                  type={1}
                  catsSetting={catsSetting}
                  cashs={cashs}
                  dataAll={dataAll}
                  areaLabel={showAraeLabel}
                  onAreaClick={cb => this.onAreaClick(validAreas, cb)}
                  setting={setting}
                  handletTargetChange={this.handletTargetChange}
                  loading={caseListLoading}
                  waySetting={waySetting}
                />
                <Layout className={styles.layout}>
                  <div className={styles.banner}>
                    <Banner img={banner} link="https://blog.top.104.com.tw/new-free-trial/?utm_source=top&utm_medium=banner&utm_campaign=new-free-trial" title="讓我們一起防疫 免費接案30天" />
                  </div>
                  <TagCloud pageType={3} isCat facets={facets} onClick={v => this.onCatsChange({ key: v }, null, null)} />
                  <Result
                    type={1}
                    ferretOut={params}
                    total={total}
                    sort={params.sort || (params.q ? '1' : '0')}
                    areaData={areaData}
                    onFiliterChange={this.onFiliterChange}
                    onTagClose={this.onTagClose}
                  />
                  {
                    paginatingIsHide ? (
                      caseData.map(item => (
                        <List
                          key={item.demandId}
                          areaData={areaData}
                          {...item}
                        />
                      ))
                    ) : (<div className={styles.noMessage}>尚無案件</div>)
                  }
                  <Paginating
                    className={classnames(styles.pagination, {
                      [styles.dNone]: !paginatingIsHide,
                    })}
                    total={total}
                    ceiling={5000}
                    current={pageNum}
                    defaultCurrent={1}
                    defaultPageSize={10}
                    onChange={this.onPagaChange}
                  />
                  <RecentQuery type="caseList" linkTo={this.props.history.push} />
                </Layout>
              </Layout>
            </div>
          </div>
        </BrowserView>
        <MobileView>
          <MobileFilter siderProps={siderProps} />
          <MobileNav
            location={location}
            type={1}
            activeClass
            choice={treeData.key}
            catsValue={catsSetting.catsValue}
            handelSearch={this.handelSearch}
            handleOnChange={this.handleOnChange}
            searchValue={this.state.searchValue}
            showDrawer={this.showDrawer}
            hideDrawer={this.hideDrawer}
            drawerVisible={this.state.drawerVisible}
            showFilter={this.showFilter}
            onOpenChange={this.onOpenChange}
            openKeys={this.state.openKeys}
            onCatsChange={this.onCatsChange}
          />
          <div className={`${styles.wrap} ${styles.mobile}`}>
            <div className={`${styles.layout} ${styles.mobile}`}>
              <div className={styles.banner}>
                <Banner imgMp={bannerMp} link="https://blog.top.104.com.tw/new-free-trial/?utm_source=top&utm_medium=banner&utm_campaign=new-free-trial" title="陪你防疫 免費接案30天" />
              </div>
              <TagCloud pageType={3} isCat facets={facets} onClick={v => this.onCatsChange({ key: v }, null, null)} />
              <Result
                type={1}
                ferretOut={params}
                total={total}
                sort={params.sort || (params.q ? '1' : '0')}
                areaData={areaData}
                onFiliterChange={this.onFiliterChange}
                onTagClose={this.onTagClose}
              />
              <div className={styles.cardWarp}>
                {
                    paginatingIsHide
                      ? (
                        caseData.map(item => (
                          <List
                            key={item.demandId}
                            areaData={areaData}
                            {...item}
                          />
                        ))
                      )
                      : (<div className={styles.noMessage}>尚無案件</div>)
                  }
              </div>
              <Paginating
                className={classnames(styles.pagination, {
                  [styles.dNone]: !paginatingIsHide,
                })}
                total={total}
                ceiling={5000}
                current={pageNum}
                defaultCurrent={1}
                defaultPageSize={10}
                onChange={this.onPagaChange}
              />
              <RecentQuery type="caseList" linkTo={this.props.history.push} />
            </div>
          </div>
        </MobileView>
      </>
    ) : (
      <>
        <div className={styles.bg}>
          <div>
            {
                paginatingIsHide ? (
                  caseData.map(item => (
                    <List
                      key={item.demandId}
                      areaData={areaData}
                      {...item}
                    />
                  ))
                ) : (<div className={styles.noMessage}>尚無案件</div>)
            }
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  areaData: state.common.area,
  caseData: state.cases.paged.data,
  facets: state.cases.paged.facets,
  total: state.cases.paged.total,
  user: state.user,
  caseListLoading: state.cases.caseListLoading,
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  loadStaticArea,
  query: getAreaToCase,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CaseList));
