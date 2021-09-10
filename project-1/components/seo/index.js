import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import config from '../../config/config';
import { PAGE, FILTER_PAGE } from '../../config/constant';
import { imgUrlByfileMap } from '../../util/fileMapUtil';
import {
  getCatTitleByNo, getCatTitleListByNo
} from '../../util/lablesUtils';
import { generateLinkedData } from '../../util/seoUtil';
import { catSearch } from '../../util/categoryUtils';
import { showAreaText, showText, filterXSS } from '../../util/commonUtil';
import { experienceData } from '../../config/selectData.js';
// import labels from '../../config/lables-zh_TW';

class LayoutSEO extends Component {
  render() {
    const { location, areaData } = this.props;

    // 評價頁
    const { reviewAvg } = this.props;

    // 案件專頁
    const {
      demandTitle, demandDesc, demandCats, demandPlace, demandMaxprice, demandMinprice, demandUnit, demandSex
    } = this.props;

    // 服務專頁
    const {
      serviceTopperName, serviceTitle, serviceDesc, serviceCatTag, serviceCats, serviceCoverPic, serviceFileMap
    } = this.props;

    // C-Profile
    const {
      profileTopperName, profileDesc, profileImg, profileGigs, blockInfo
    } = this.props;

    let title = '104 高手－找外包接案兼差、家教學習、生活需求的專業平台';
    let description = '104 高手（原104外包網、家教網）提供超過10,000種以上的專業技能報價，適合短期兼差打工、在家工作與接案SOHO族使用；我們協助企業專案外包的需求、並幫助家長找家教老師，免費刊登案件，立即幫您找到適合的人才。';
    let keywords = '外包, 接案, 兼差, 兼職, 外快, 短期打工, 家教, 老師, 補習, 發案, 發包, SOHO, 工作室';
    let link = `${config.topSite.domain}${this.props.location.pathname}${this.props.location.search}`;
    let imgLink = `https://static.104.com.tw/top/metaImage-1200x630.png?v=${dayjs().millisecond()}`;
    let author = '104高手';
    let copyright = '一零四資訊科技股份有限公司';
    let itemType = 'WebSite';
    let structuredJSON = null;
    const pageType = location.pathname;

    let structuredJSONPayload = {
      title: title,
      description: description,
      link: link,
      imgLink: imgLink,
      author: author,
    };

    if (pageType.includes(PAGE.caseInfo)) {
      // 案件內容頁: /caseInfo
      let minPrice = 0;
      let maxPrice = 0;
      let price = 0;
      if (demandMinprice != null || demandMaxprice != null) {
        minPrice = demandMinprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        maxPrice = demandMaxprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        price = demandMinprice === demandMaxprice ? '$'.concat(minPrice) : '$'.concat(minPrice).concat('~').concat(maxPrice);
      }
      const isTutorCats = demandCats && demandCats.length !== 0 && demandCats[0][0] === '1';
      const priceStatus = demandUnit === 1 ? '時薪' : '論件計酬';
      const priceUnit = '元';
      const priceContent = `${priceStatus} ${price}${priceUnit}`;
      const areaText = areaData && areaData.length !== 0 && demandPlace && demandPlace.length !== 0 ? showAreaText(areaData, demandPlace) : '不拘';
      if (demandTitle !== null && demandDesc !== null) {
        if (isTutorCats) {
          title = `${demandTitle}家教案件－${priceContent}－地點${areaText}｜104高手`;
          description = `找${demandTitle}老師－學生性別${demandSex === '0' ? '男' : '女'}－${demandDesc.length > 150 ? filterXSS(demandDesc).substring(0, 150).concat('…') : filterXSS(demandDesc)}`;
        } else {
          title = `${demandTitle}案件－${priceContent}－地點${areaText}｜104高手`;
          description = `找${demandTitle}接案人才－${demandDesc.length > 150 ? filterXSS(demandDesc).substring(0, 150).concat('…') : filterXSS(demandDesc)}`;
        }
      }

      const demandCatsContent = demandCats === null || demandCats.length === 0 ? '' : demandCats[0].includes('000000') ? getCatTitleByNo(demandCats[0]) : `${getCatTitleByNo(demandCats[0].substring(0, 1).concat('000000'))}, ${getCatTitleByNo(demandCats[0])}`;
      keywords = `${demandTitle}－${areaText}, 接案打工, ${demandCatsContent}`;
    } else if (pageType.includes(PAGE.service) && !pageType.includes(FILTER_PAGE.serviceItems)) {
      // 高手服務頁: /service
      const catTitleList = serviceCats && serviceCats.length !== 0 && getCatTitleListByNo(String(serviceCats[0]));
      const serviceCatTitle = catTitleList && catTitleList.map(catTitle => catTitle).join('－');
      const topCatTitle = getCatTitleByNo(String(serviceCats[0]).substring(0, 1).concat('000000'));
      let price = this.props.gigDetail.focusGig.body.price;
      price = price && price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      const serviceUnit = this.props.gigDetail.focusGig.body.unit;
      const priceStatus = serviceUnit === 1 ? '時薪' : '論件計酬';
      const priceUnit = '元';
      const priceContent = `${priceStatus}${price}${priceUnit}起`;
      const exp = this.props.gigDetail.focusGig.body.exp;
      const expContent = showText(experienceData, exp);

      title = `${serviceTitle}－${topCatTitle}－${serviceTopperName}的接案服務介紹｜104高手`;
      description = `${serviceCatTitle}－${priceContent}－${expContent}${(serviceDesc === undefined || serviceDesc === null) ? '' : '－'.concat(serviceDesc.length > 150 ? filterXSS(serviceDesc).substring(0, 150).concat('…') : filterXSS(serviceDesc))}`;
      keywords = serviceTopperName === undefined || serviceCats === [] ? keywords : serviceTopperName.concat(', ').concat(serviceCatTag.join(', ')).concat(serviceCats.map(catNo => getCatTitleByNo(catNo)).join(', ')).concat(serviceCats[0] === undefined ? '' : ', '.concat(getCatTitleByNo(String(serviceCats[0]).substring(0, 1).concat('000000'))));
      link = `${config.topSite.domain}${location.pathname}${location.search}`;
      imgLink = (serviceFileMap === null || serviceFileMap === undefined || serviceCoverPic === null) ? imgLink : `https:${imgUrlByfileMap(serviceCoverPic, serviceFileMap)}`;
      author = serviceTopperName;
      structuredJSONPayload = {
        title: title,
        description: description,
        link: link,
        imgLink: imgLink,
        author: author,
        gigDetail: this.props.gigDetail,
        blockInfo: this.props.blockInfo,
      };
      structuredJSON = generateLinkedData(PAGE.service, structuredJSONPayload);
    } else if (pageType.includes(PAGE.profile)) {
      // 高手個人頁: /profile
      const topperTitle = blockInfo && blockInfo.topperTitle && blockInfo.topperTitle.length !== 0 ? `${blockInfo.topperTitle}` : '';
      title = `${profileTopperName}${topperTitle.length > 0 ? '－' : ''}${topperTitle}的接案人才介紹｜104高手`;
      description = `${topperTitle}－${topperTitle.length > 0 ? '－' : ''}－`.concat(profileDesc === undefined || profileDesc === null ? '' : `, ${filterXSS(profileDesc.replace('<p>', '').replace('</p>', '')).replace(/<(.|\n)*?>/g, '').substring(0, 150)}`);
      keywords = profileTopperName === undefined ? keywords : profileTopperName.concat(', ').concat(profileGigs.map(gig => gig.title).join(', '));
      link = `${config.topSite.domain}${location.pathname}${location.search}`;
      imgLink = profileImg;
      author = profileTopperName;
    } else if (pageType.includes(PAGE.searchTutor)) {
      // 家教報價列表頁：/search-tutor
      const catsNoList = location.query.cats;
      const catsNo = catsNoList && catsNoList.split(',')[0];
      const catTitleList = getCatTitleListByNo(catsNo);
      const serviceCatTitle = catTitleList && catTitleList.map(catTitle => catTitle).join('－');
      const isCatsPage = catsNo;
      let catTitle = null;
      if (isCatsPage) {
        catTitle = `${serviceCatTitle}－`;
      }
      title = `${catTitle || '找'}家教老師服務技能列表｜104 高手`;
      description = '104高手提供超過10,000種家教學科、專業技能等服務，包含伴讀、英文、日文、國語文、數理、鋼琴、音樂、美術繪畫、各式才藝、職場術科技能等類型，歡迎案主家長免費刊登案件，快速找到合適的老師。';
    } else if (pageType.includes(PAGE.search)) {
      // 外包報價列表頁：/search
      const catsNoList = location.query.cats;
      const catsNo = catsNoList && catsNoList.split(',')[0];
      const isChooseMidCat = catsNo && catsNo[3] !== '0';
      const isCatsPage = catsNo;
      let catTitle = null;
      if (isCatsPage) {
        if (isChooseMidCat) {
          catTitle = `${catsNoList.split(',').map(no => getCatTitleByNo(no)).join('、')}－`;
        } else {
          catTitle = `${getCatTitleByNo(catsNo)}－`;
        }
      }
      title = `${catTitle || '找'}外包人才服務報價列表｜104 高手`;
      description = '104高手提供超過10,000種專業接案服務，包含平面、LOGO名片、美編、插圖、網頁設計、UI/UX前端工程、後端資料庫設計、小編、社群經營、行銷企劃、影音後製、生活相關等類型。歡迎案主免費刊登案件，快速找到合適的人才。';
    } else if (pageType.includes(PAGE.caseList)) {
      // 案件列表頁：/caseList
      const catsNoList = location.query.cats;
      const areasNoList = location.query.areas;
      const catsNo = catsNoList && catsNoList.split(',')[0];
      const isCatsPage = catsNo;
      const isTutorCats = catsNo && catsNo[0] === '1';
      const isChooseMidCat = catsNo && catsNo[3] !== '0';
      const isChooseSmallCat = catsNo && catsNo[6] !== '0';

      if (isCatsPage) {
        const areaTitle = areasNoList && areaData && areaData.length !== 0 ? `${areasNoList.split(',').map(no => catSearch(areaData, no).des).join('、')}－` : '';
        let catTitle = '';
        if (isChooseSmallCat) {
          // 家教才有小類
          catTitle = `${catsNoList.split(',').map(no => getCatTitleByNo(no)).join('、')}案件－`;
        } else if (isChooseMidCat) {
          const catsTitleList = catsNoList.split(',').map(no => getCatTitleByNo(no));
          catTitle = `${(catsTitleList.length > 2 ? catsTitleList.splice(0, 2) : catsTitleList).join('、')}案件－`;
        } else {
          catTitle = `${getCatTitleByNo(catsNo)}案件－`;
        }
        title = `找${areaTitle}${catTitle}${isTutorCats ? '家教接案、高薪打工' : '外包接案、兼差SOHO'}｜104高手`;
        if (isTutorCats) {
          description = `提供最新${areaTitle}${catTitle}接案工作機會，學生找打工、家教老師找案源，就上104 高手（原104家教網）！`;
        } else {
          description = `提供最新${areaTitle}${catTitle}接案工作機會，外包接案兼差、專職SOHO工作室找案源，就上104 高手（原104外包網）！`;
        }
      } else {
        // 未選擇類別預設內容
        title = '外包接案、家教學習案件列表｜104高手';
        description = '提供最新熱門案件，包含平面設計、編輯翻譯、程式開發、網頁設計、社群行銷、家教學習、居家生活等類型。歡迎個人接案兼差、SOHO族、工作室、在家工作、學生找家教打工，主動應徵報價。';
      }
      link = `${config.topSite.domain}${location.pathname}${location.search}`;
    } else if (pageType.includes(PAGE.join)) {
      title = '如何開始接案｜104 高手－找外包接案兼差、家教學習、生活需求的專業平台';
      link = `${config.topSite.domain}${this.props.location.pathname}`;
      description = '104 高手（原104外包網、家教網）提供外包接案兼差、專職SOHO工作室、學生找打工、家教老師最新案件。最低只要399元，即享有無限次數應徵聯絡，成交免收服務費。5星好評成交見證，加入接案立即賺！';
    } else if (reviewAvg !== null && pageType.includes(PAGE.evaluation)) {
      title = `${reviewAvg.topperName}的接案評價紀錄｜104 高手`;
      description = `${reviewAvg.topperName} 接案評價紀錄，目前評價數${reviewAvg.reviewCount}筆，合作數${reviewAvg.dealCount}筆，歡迎案主邀請合作。`;
      link = `${config.topSite.domain}${this.props.location.pathname}`;
    }

    return (
      <Fragment>
        <Helmet>
          {/* Update your html tag to include the itemscope and itemtype attributes. */}
          <html lang="zh" itemScope itemType={`http://schema.org/${itemType}`} />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="page" content={pageType} />
          <meta name="author" content={author} />
          <meta name="copyright" content={copyright} />
          <meta name="thumbnail" content={imgLink} />

          {/* itemProp is HTML5 itemscope for search engine analyze */}
          <meta itemProp="name" content={title} />
          <meta itemProp="url" content={link} />
          <meta itemProp="description" content={description} />
          <meta itemProp="about" content={description} />
          <meta itemProp="abstract" content={description} />
          <meta itemProp="image" content={imgLink} />
          <meta itemProp="keywords" content={keywords} />
          <meta itemProp="author" content={author} />
          <meta itemProp="copyrightHolder" content={copyright} />
          <meta itemProp="genre" name="genre" content="家教" />
          <meta itemProp="genre" name="genre" content="外包" />

          {/* Open Graph data */}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={link} />
          <meta property="og:ttl" content="345600" />
          <meta property="og:site_name" content={title} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={imgLink} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Link relationship */}
          <link rel="author" href={link} />
          <link rel="publisher" href={link} />

          {/* Twitter Card data */}
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:site" content="@104高手" />
          <meta name="twitter:creator" content={author} />
          <meta name="twitter:card" content={imgLink} />
          <meta name="twitter:image:src" content={imgLink} />

          {/* ld-json */}
          <script type="application/ld+json">{structuredJSON}</script>

          {/* Facebook data */}
          {/* <meta property="fb:admins" content="Facebook numberic ID" /> */}
          {/* <meta property="fb:app_id" content="Facebook numberic ID" /> */}

          {/* 文章用 meta */}
          {/* <meta itemProp="tag" property="article:tag" content="家教" /> */}
          {/* <meta itemProp="genre" name="genre" content='外包 家教' /> */}

        </Helmet>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,

  // 評價頁
  reviewAvg: state.common.reviewAvg,

  // 案件專頁: caseInfo
  demandTitle: state.common.contentData.title, // 案件專頁標題: string
  demandDesc: state.common.contentData.desc, // 案件專頁內容: string
  demandCats: state.common.contentData.demandCategory, // 服務專頁分類: []
  demandPlace: state.common.contentData.assignPlace, // 服務專頁地點: []
  demandMaxprice: state.common.contentData.maxPrice, // 預算上限: int
  demandMinprice: state.common.contentData.minPrice, // 預算下限: int
  demandUnit: state.common.contentData.unit, // 案件預算類型: 0: 論件 1: 時薪
  demandSex: state.common.contentData.sex,
  demandData: state.common.contentData,
  // 服務專頁
  serviceTopperName: state.introduct.profileInfo.topperName, // 服務專頁高手名稱: string
  serviceTitle: state.introduct.gigDetail.focusGig.title, // 服務專頁標題: string
  serviceDesc: state.introduct.gigDetail.focusGig.body.desc, // 服務專頁標題: string
  serviceCats: state.introduct.gigDetail.focusGig.cats, // 服務專頁分類: []
  serviceCatTag: state.introduct.gigDetail.focusGig.catTag, // 服務專頁標籤: []
  serviceGigs: state.common.gigs.data, // 服務專頁所有服務: []
  serviceGigsFileMaps: state.common.gigs.fileMap,
  serviceCoverPic: state.introduct.gigDetail.focusGig.body.coverPic,
  serviceFileMap: state.introduct.gigDetail.fileMap,
  gigDetail: state.introduct.gigDetail,
  profileInfo: state.introduct.profileInfo,

  // C-Profile
  profileTopperName: state.common.topperData == null ? '' : state.common.topperData.userName, // 高手名稱: string
  profileDesc: state.common.topperData == null ? '' : state.common.topperData.introduction, // 高手描述: string
  profileImg: state.common.topperData == null || state.common.topperData.avatarFileUrls.avatarWeb === null ? 'https://profile.104.com.tw/static/media/avatarDef.a664d284.png' : 'https://'.concat(state.common.topperData.avatarFileUrls.avatarWeb.substring(2)), // 圖片: string
  profileGigs: state.common.gigs.data, // 所有服務: []
  profileGigsFileMaps: state.common.gigs.fileMap,
  profileData: state.common.topperData,
  blockInfo: state.common.blockInfo,

  // search
  gigPaged: state.common.paged,

  // caseList
  casePaged: state.cases.paged,

  // 共用資料
  areaData: state.common.area,
});

export default withRouter(connect(mapStateToProps)(LayoutSEO));
