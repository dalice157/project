import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { BrowserView, MobileView, uaIsMobile } from 'react-device-detect';
import titleImg from '../../img/common_v2/icon-title.svg';
import PopularCard from '../../components/common_v2/PopularCard.js';
import { catSearch } from '../../util/categoryUtils';
import { getSuccessTutorDemand, getSuccessOutsourceDemand, loadStaticArea } from '../../actions/common';
import styles from './PopularService.scss';

class PopularService extends PureComponent {
  async componentDidMount() {
    await this.props.loadStaticArea();
    await Promise.all([
      this.props.getSuccessTutorDemand(),
      this.props.getSuccessOutsourceDemand(),
    ]);
  }

  chooseType = () => {
    const { type, successTutorList, successOutsourceList } = this.props;
    let joinList = [];
    const tutorList = [];
    const caseList = [];
    if (type === 'join' && successTutorList && successOutsourceList) {
      successTutorList.slice(0, 3).forEach((item) => {
        tutorList.push({
          ...item,
          dataGtmjoin: '家教成功案例',
        });
      });
      successOutsourceList.slice(0, 3).forEach((item) => {
        caseList.push({
          ...item,
          dataGtmjoin: '外包成功案例',
        });
      });
      const joinListData = [...tutorList, ...caseList].sort(() => Math.round(Math.random()) - 0.5);
      joinList = joinListData;
    }
    const chooseSlides = {
      teacher: 3,
      case: 3,
      join: 4,
    };
    const chooseData = {
      teacher: successTutorList,
      case: successOutsourceList,
      join: joinList,
    };
    return {
      slidesType: chooseSlides[type],
      dataType: chooseData[type],
    };
  }

  render() {
    const { type, areaData } = this.props;
    const chooseType = this.chooseType();
    const isMobile = uaIsMobile() ? styles.mobile : '';
    const settings = {
      dots: false,
      infinite: true,
      slidesToShow: chooseType.slidesType,
      slidesToScroll: 1,
    };
    const sliderStyleForJoin = type === 'join' ? styles.join : '';
    return (
      <div className={styles.wrap}>
        <h3 className={`${styles.title} ${isMobile}`}>
          <img src={titleImg} alt="標題" />
          {' '}
          他們都在104高手成功接案
          {' '}
          <img src={titleImg} alt="標題" />
        </h3>
        <BrowserView>
          <div className={`${styles.slider} ${sliderStyleForJoin}`}>
            <Slider {...settings}>
              {
                chooseType.dataType && chooseType.dataType.map((item) => {
                  const getAreaFeatureSwitch = catSearch(areaData, item.area[0]).des;
                  const data = {
                    id: item.topperId,
                    demandTitle: item.demandTitle,
                    img: item.topperPicUrl,
                    topperId: item.topperId,
                    reviewScore: item.reviewScore,
                    profileName: item.profileName,
                    area: getAreaFeatureSwitch,
                    exp: item.exp,
                    reviewComment: item.reviewComment,
                    gigId: item.gigId || '',
                    dataGtmjoin: item.dataGtmjoin || '',
                  };
                  return (
                    <PopularCard
                      key={`${item.gigId}-${item.topperId}`}
                      data={data}
                      type={type}
                    />
                  );
                }) }
            </Slider>
          </div>
        </BrowserView>
        <MobileView>
          <div className={`${styles.slider} ${styles.mobile}`}>
            <Slider dots={false} slidesToShow={1} slidesToScroll={1}>
              {
                chooseType.dataType && chooseType.dataType.map((item) => {
                  const getAreaFeatureSwitch = catSearch(areaData, item.area[0]).des;
                  const data = {
                    id: item.topperId,
                    demandTitle: item.demandTitle,
                    img: item.topperPicUrl,
                    topperId: item.topperId,
                    reviewScore: item.reviewScore,
                    profileName: item.profileName,
                    area: getAreaFeatureSwitch,
                    exp: item.exp,
                    reviewComment: item.reviewComment,
                    gigId: item.gigId || '',
                  };
                  return (
                    <PopularCard
                      key={`${item.gigId}-${item.topperId}`}
                      data={data}
                      type={type}
                    />
                  );
                }) }
            </Slider>
          </div>
        </MobileView>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  successTutorList: state.common.successTutorList,
  successOutsourceList: state.common.successOutsourceList,
  areaData: state.common.area,
});
const mapDispatchToProps = {
  loadStaticArea,
  getSuccessTutorDemand,
  getSuccessOutsourceDemand,
};


export default connect(mapStateToProps, mapDispatchToProps)(PopularService);
