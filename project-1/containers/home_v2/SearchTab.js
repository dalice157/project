import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
  Tabs, Drawer, Button, Select,
} from 'antd';
import { loadStaticArea, getGigDemandCount, loadGigDemandPopularCats } from '../../actions/common.js';
import {
  targetData, experienceData, hotSearchObj, hotIcons,
} from '../../config/selectData.js';
import { tagText } from '../../util/commonUtil';
import RecentQuery from '../../components/search/RecentQuery';
import { catsSimpleData, filterValidCats } from '../../util/lablesUtils.js';
import { reactLocalStorage } from '../../util/cookieUtil.js';
import { catSearch } from '../../util/categoryUtils.js';
import babysitter from '../../img/index_v2/mobile/icon-tutor-read-babysitter.svg';
import Category from '../../components/search/Category';
import styles from './SearchTab.scss';

const { TabPane } = Tabs;
const { Option } = Select;

class SearchTab extends Component {
  state = {
    sortVisible: false,
    type: 'search-tutor',
    cats: null,
    areas: null,
    priceMax: null,
    clientCats: null,
    expCat: null,
  }

  componentDidMount() {
    this.props.getGigDemandCount();
    this.props.loadGigDemandPopularCats();
  }

  onShowSort = () => {
    this.setState({
      sortVisible: true,
    });
  }

  onCloseSort = () => {
    this.setState({
      sortVisible: false,
    });
  }

  onCatsChange = (e, cats) => {
    const { searchValue } = this.state;
    if (e) {
      const v = e.target ? e.target.value : e.key;
      this.setState({
        cats: v,
        searchValue: e.key ? null : searchValue,
      });
    } else if (cats) {
      this.setState({
        cats: cats.join(),
      });
    }
  }

  onAreaClick = () => {
    const { type, areas } = this.state;
    const getTitleObj = {
      'search-tutor': '教學',
      caseList: '案件',
    };
    const intAreas = areas ? areas.split(',').map(item => ({ no: item })) : [];
    this.props.loadStaticArea().then(() => {
      if (categoryPicker) {
        categoryPicker.open({
          dataSource: 'Area',
          theme: 'customer-theme',
          title: `${getTitleObj[type]}地區`,
          maxSelectedNumber: 15,
          recommendation: false,
          searchLevel: 1,
          searchDetail: false,
          selectedItems: intAreas,
          // unselectableList: '[0-9]{7}[0-9][0-9][1-9]',
          onSubmit: ({ selectedItems }) => {
            const { areaData } = this.props;
            const items = selectedItems.map(item => item.no);
            const join = items.join();
            const areaDescs = items.map((key) => {
              const ele = catSearch(areaData, key);
              return ele ? ele.des : '';
            });
            const areaDesc = areaDescs.length ? areaDescs.join('、') : '';
            const txt = areaDesc.length > 12 ? (`${areaDesc.substring(0, 10)}...`) : areaDesc;
            this.setState({
              areas: join,
              areaLabel: txt,
            });
          },
          onClose: () => {

          },
        });
      }
    });
  }

  onCashGo = (e) => {
    console.log('cashMax:', e.target.value);
    this.setState({
      priceMax: e.target.value,
    });
  }

  handleTargetChange = (value) => {
    this.setState({
      clientCats: value,
    });
  }

  handleExperienceChange = (value) => {
    this.setState({
      expCat: value,
    });
  }

  back = () => {
    this.setState({
      cats: null,
    });
  }


  renderSearchTutor = () => {
    const { cats: paramCats } = this.state;

    let validCats = [];
    if (paramCats) {
      const cats = paramCats.split(',');
      validCats = filterValidCats(cats);
    } else {
      validCats = ['1000000'];
    }

    const catNo = validCats.length > 0 ? validCats[0] : null;
    const treeData = catsSimpleData(catNo);
    const catsValue = validCats.length > 0 ? validCats : undefined;
    return (
      <>
        <h2 className={styles.drawerTitle}>教學科目選單</h2>
        <Category onChange={this.onCatsChange} value={catsValue} data={treeData} type={catNo ? 2 : 1} />
        <div className={styles.btnWrap}>
          <Button type="primary" size="large" onClick={this.onCloseSort}>確認</Button>
        </div>
      </>
    );
  }

  renderSearch = () => {
    const { gigListLoading } = this.props;
    const { cats: paramCats } = this.state;
    let validCats = [];

    if (paramCats) {
      const cats = paramCats.split(',');
      validCats = filterValidCats(cats);
    }

    const catNo = (validCats.length > 0) ? validCats[0] : null;
    const treeData = catsSimpleData(catNo);
    const catsValue = (validCats.length > 0) ? validCats : undefined;
    return (
      <>
        <h2 className={styles.drawerTitle}>外包服務選單</h2>
        {catNo
          && <a className={styles.back} onClick={() => this.back()}>&lt; 回上一層</a>
          }
        <Category onChange={this.onCatsChange} value={catsValue} data={treeData} type={catNo ? 2 : 1} disabled={gigListLoading} />
        <div className={styles.btnWrap}>
          <Button type="primary" size="large" onClick={this.onCloseSort}>確認</Button>
        </div>
      </>
    );
  }

  renderCase = () => {
    const { gigListLoading } = this.props;
    const { cats: paramCats } = this.state;
    let validCats = [];

    if (paramCats) {
      const cats = paramCats.split(',');
      validCats = filterValidCats(cats);
    }

    const catNo = validCats.length > 0 ? validCats[0] : null;
    const treeData = catsSimpleData(catNo);
    const catsValue = validCats.length > 0 ? validCats : undefined;
    return (
      <>
        <h2 className={styles.drawerTitle}>案件分類選單</h2>
        {catNo
          && <a className={styles.back} onClick={() => this.back()}>&lt; 回上一層</a>
          }
        <Category onChange={this.onCatsChange} value={catsValue} dataType={1} data={treeData} type={catNo ? 2 : 1} disabled={gigListLoading} />
        <div className={styles.btnWrap}>
          <Button type="primary" size="large" onClick={this.onCloseSort}>確認</Button>
        </div>
      </>
    );
  }

  onChangeTab = (key) => {
    this.setState({
      type: key,
      cats: null,
      areas: null,
      priceMax: null,
      clientCats: null,
      expCat: null,
    });
  }

  render() {
    const { searchTutor, search, caseList } = hotSearchObj;
    const {
      cats, areas, clientCats, expCat, priceMax,
    } = this.state;
    const { areaData, gigDemandCount, gigDemandPopularCats } = this.props;
    const { outsourceGigPopularCats, tutorGigPopularCats, demandPopularCats } = gigDemandPopularCats;
    const changeCats = cats && cats.includes('1000000') ? null : cats;
    const validExpCat = experienceData.find(exp => exp.id == expCat);
    const expCatValue = validExpCat && validExpCat.id;
    const validTarget = targetData.find(target => target.id == clientCats);
    const targetValue = validTarget && validTarget.id;
    const getSearchTutorQueryString = () => {
      const params = new URLSearchParams();
      changeCats && params.set('cats', cats);
      areas && params.set('areas', areas);
      clientCats && params.set('clientCats', clientCats);
      return params.toString() ? `${params.toString()}` : '';
    };
    const searchTurtorMore = getSearchTutorQueryString() && `&${getSearchTutorQueryString()}`;

    const getSearchQueryString = () => {
      const params = new URLSearchParams();
      cats && params.set('cats', cats);
      expCat && params.set('expCat', expCat);
      priceMax && params.set('priceMax', priceMax);
      return params.toString() ? `${params.toString()}` : '';
    };
    const searchMore = getSearchQueryString() && `&${getSearchQueryString()}`;

    const getSearchCaseQueryString = () => {
      const params = new URLSearchParams();
      cats && params.set('cats', cats);
      areas && params.set('areas', areas);
      clientCats && params.set('clientCats', clientCats);
      return params.toString() ? `${params.toString()}` : '';
    };
    const searchCaseMore = getSearchCaseQueryString() && `&${getSearchCaseQueryString()}`;

    const { list } = reactLocalStorage.getObject(`_recent_${this.state.type}`, { list: [] });
    const listLength = list.length;
    const tutorGigCats = tutorGigPopularCats.map((cat) => {
      const catId = cat.slice(0, 4);
      const treeData = tagText('cats', cat)[0];
      const catImg = hotIcons[catId];
      return ({
        title: treeData,
        link: cat,
        img: catImg,
      });
    });
    const outsourceGigCats = outsourceGigPopularCats.map((cat) => {
      const catId = cat.slice(0, 3);
      const treeData = tagText('cats', cat)[0];
      const catImg = hotIcons[catId];
      return ({
        title: treeData,
        link: cat,
        img: catImg,
      });
    });
    const demandGigCats = demandPopularCats.map((cat) => {
      const includesGigId = /^100/;
      const catId = includesGigId.test(cat) ? cat.slice(0, 4) : cat.slice(0, 3);
      const treeData = tagText('cats', cat)[0];
      const catImg = hotIcons[catId];
      return ({
        title: treeData,
        link: cat,
        img: catImg,
      });
    });
    return (
      <>
        <div className={styles.wrap}>
          <Tabs tabBarGutter={0} type="card" onChange={this.onChangeTab}>
            <TabPane
              tab={(
                <div data-gtm-index="MO-找家教頁籤" className={styles.pane}>
                  <span className={styles.title}>找家教老師</span>
                  <span className={styles.no}>
                    (
                    {gigDemandCount ? gigDemandCount.tutorGigCount : '0'}
                    )
                  </span>
                </div>
                )}
              key="search-tutor"
            >
              <div className={styles.searchArea}>
                <div onClick={this.onShowSort} className={styles.input}>
                  {
                    changeCats ? <span className={styles.tagText}>{tagText('cats', cats)}</span> : '教學科目'
                  }
                </div>
                <div onClick={this.onAreaClick} className={styles.input}>
                  {
                    areas ? <span className={styles.tagText}>{tagText('areas', areas, areaData)}</span> : '教學地區'
                  }
                </div>
                <Select value={targetValue && parseInt(targetValue)} className={styles.select} onChange={this.handleTargetChange} placeholder="教學對象">
                  { targetData.map(item => (
                    <Option key={item.id} value={item.id}>
                      { item.title }
                    </Option>
                  )) }
                </Select>
                <div className={styles.hotSearch}>
                  <span className={styles.hotTitle}>熱搜</span>
                  {
                    searchTutor.map(item => <Link className={styles.link} to={item.link}>{item.title}</Link>)
                  }
                </div>
                <div className={styles.btnWrap}>
                  <Button data-gtm-index="MO-家教更多條件" size="large"><Link className={styles.link} to={`/search-tutor?openMore=true${searchTurtorMore}`}>更多條件</Link></Button>
                  <Button data-gtm-index="MO-搜尋家教" type="danger" size="large"><Link to={`/search-tutor?${getSearchTutorQueryString()}`}>搜尋</Link></Button>
                </div>
              </div>
              <div className={`${styles.recent} ${listLength > 0 ? '' : styles.hotCategory}`}>
                {
                  listLength > 0 ? (
                    <RecentQuery type="search-tutor" isHome linkTo={this.props.history.push} />
                  ) : (
                    <>
                      <h2 className={styles.title}>熱門家教科目</h2>
                      <ul className={styles.category}>
                        {
                          tutorGigCats.map(cat => (
                            <Link className={styles.item} data-gtm-search="MO-熱門家教科目" to={`/search-tutor?cats=${cat.link}`}>
                              <li>
                                <img className={styles.img} src={cat.img} alt={cat.title} />
                                <span className={styles.title}>{cat.title}</span>
                              </li>
                            </Link>

                          ))
                        }
                      </ul>
                    </>
                  )
                }
              </div>
            </TabPane>
            <TabPane
              tab={(
                <div data-gtm-index="MO-找報價頁籤" className={styles.pane}>
                  <span className={styles.title}>找外包報價</span>
                  <span className={styles.no}>
                    (
                    {gigDemandCount ? gigDemandCount.outsourceGigCount : '0'}
                    )
                  </span>
                </div>
              )}
              key="search"
            >
              <div className={styles.searchArea}>
                <div onClick={this.onShowSort} className={styles.input}>
                  {
                    cats ? <span className={styles.tagText}>{tagText('cats', cats)}</span> : '外包服務分類'
                  }
                </div>
                <Select value={expCatValue && parseInt(expCatValue)} className={styles.select} onChange={this.handleExperienceChange} placeholder="外包服務經驗">
                  { experienceData.map(item => (
                    <Option key={item.id} value={item.id}>
                      { item.title }
                    </Option>
                  )) }
                </Select>
                <input onChange={this.onCashGo} type="text" inputMode="tel" className={styles.cash} placeholder="外包服務金额" />
                <div className={styles.hotSearch}>
                  <span className={styles.hotTitle}>熱搜</span>
                  {
                    search.map(item => <Link className={styles.link} to={item.link}>{item.title}</Link>)
                  }
                </div>
                <div className={styles.btnWrap}>
                  <Button data-gtm-index="MO-報價更多條件" size="large">
                    <Link to={`/search?openMore=true${searchMore}`}>更多條件</Link>
                  </Button>
                  <Button data-gtm-index="MO-搜尋報價" type="danger" size="large">
                    <Link to={`/search?${getSearchQueryString()}`}>搜尋</Link>
                  </Button>
                </div>
              </div>
              <div className={`${styles.recent} ${listLength > 0 ? '' : styles.hotCategory}`}>
                {
                  listLength > 0 ? (
                    <RecentQuery type="search" isHome linkTo={this.props.history.push} />
                  ) : (
                    <>
                      <h2 className={styles.title}>熱門外包報價</h2>
                      <ul className={styles.category}>
                        {
                          outsourceGigCats.map(cat => (
                            <Link className={styles.item} data-gtm-search="MO-熱門外包報價" to={`/search?cats=${cat.link}`}>
                              <li>
                                <img className={styles.img} src={cat.img} alt={cat.title} />
                                <span className={styles.title}>{cat.title}</span>
                              </li>
                            </Link>
                          ))
                        }
                      </ul>
                    </>
                  )
                }
              </div>
            </TabPane>
            <TabPane
              tab={(
                <div data-gtm-index="MO-找案件頁籤" className={styles.pane}>
                  <span className={styles.title}>找案件</span>
                  <span className={styles.no}>
                    (
                    {gigDemandCount ? gigDemandCount.demandCount : '0'}
                    )
                  </span>
                </div>
              )}
              key="caseList"
            >
              <div className={styles.searchArea}>
                <div onClick={this.onShowSort} className={styles.input}>
                  {
                    cats ? <span className={styles.tagText}>{tagText('cats', cats)}</span> : '案件分類'
                  }
                </div>
                <div onClick={this.onAreaClick} className={styles.input}>
                  {
                    areas ? <span className={styles.tagText}>{tagText('areas', areas, areaData)}</span> : '案件地區'
                  }
                </div>
                <Select value={targetValue && parseInt(targetValue)} className={styles.select} onChange={this.handleTargetChange} placeholder="教學對象">
                  { targetData.map(item => (
                    <Option key={item.id} value={item.id}>
                      { item.title }
                    </Option>
                  )) }
                </Select>
                <div className={styles.hotSearch}>
                  <span className={styles.hotTitle}>熱搜</span>
                  {
                    caseList.map(item => <Link className={styles.link} to={item.link}>{item.title}</Link>)
                  }
                </div>
                <div className={styles.btnWrap}>
                  <Button data-gtm-index="MO-案件更多條件" size="large">
                    <Link to={`/caseList?openMore=true${searchCaseMore}`}>更多條件</Link>
                  </Button>
                  <Button data-gtm-index="MO-搜尋案件" type="danger" size="large">
                    <Link to={`/caseList?${getSearchCaseQueryString()}`}>搜尋</Link>
                  </Button>
                </div>
              </div>
              <div className={`${styles.recent} ${listLength > 0 ? '' : styles.hotCategory}`}>
                {
                  listLength > 0 ? (
                    <RecentQuery type="caseList" isHome linkTo={this.props.history.push} />
                  ) : (
                    <>
                      <h2 className={styles.title}>熱門案件</h2>
                      <ul className={styles.category}>
                        {
                          demandGigCats.map(cat => (
                            <Link className={styles.item} data-gtm-search="MO-熱門案件" to={`/caseList?cats=${cat.link}`}>
                              <li>
                                <img className={styles.img} src={cat.img} alt={cat.title} />
                                <span className={styles.title}>{cat.title}</span>
                              </li>
                            </Link>
                          ))
                        }
                      </ul>
                    </>
                  )
                }
              </div>
            </TabPane>
          </Tabs>
        </div>
        <Drawer
          className={styles.drawerSort}
          title={null}
          mask
          placement="right"
          onClose={this.onCloseSort}
          visible={this.state.sortVisible}
        >
          <div className={styles.drawerWrap}>
            {
              this.state.type == 'search-tutor' && this.renderSearchTutor()
            }
            {
              this.state.type == 'search' && this.renderSearch()
            }
            {
              this.state.type == 'caseList' && this.renderCase()
            }
          </div>
        </Drawer>
      </>
    );
  }
}

const mapStateToProps = state => ({
  areaData: state.common.area,
  gigDemandCount: state.common.gigDemandCount,
  gigDemandPopularCats: state.common.gigDemandPopularCats,
});

const mapDispatchToProps = {
  loadStaticArea,
  getGigDemandCount,
  loadGigDemandPopularCats,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchTab));
