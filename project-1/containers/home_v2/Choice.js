import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import { Rate, Spin, Avatar } from 'antd';
import { ChevronRight } from '@material-ui/icons';
import titleImg from '../../img/common_v2/icon-title.svg';
import defaultImg from '../../img/common_v2/avatar-default-square.svg';
import { experienceData } from '../../config/selectData.js';
import { showText, rateAllowHalf } from '../../util/commonUtil';
import { showCat } from '../../util/lablesUtils';
import { getPickupOutsource, getPickupTutor } from '../../actions/common';
import config from '../../config/config';
import styles from './Choice.scss';

class Choice extends Component {
  state = {
    loading: false,
  }

  componentDidMount() {
    this.initialPickupList();
  }

  initialPickupList = () => {
    const { type } = this.props;
    const isTutor = type === 'teacher';
    this.setState({
      loading: true,
    });
    if (isTutor) {
      this.props.getPickupTutor().then(() => {
        this.setState({
          loading: false,
        });
      });
    } else {
      this.props.getPickupOutsource().then(() => {
        this.setState({
          loading: false,
        });
      });
    }
  }

  render() {
    const {
      title, dataGtmIndex, type, pickupTutorList, pickupOutsourceList,
    } = this.props;
    const { loading } = this.state;
    const isTutor = type === 'teacher';
    const isMobile = uaIsMobile() ? styles.mobile : '';
    const chooseData = isTutor ? pickupTutorList : pickupOutsourceList;
    const featureSwitchData = chooseData;

    return (
      <div className={`${styles.wrap} ${isMobile}`}>
        <h2 className={styles.title}>
          <img src={titleImg} alt="標題" />
          {' '}
          { title }
          {' '}
          <img src={titleImg} alt="標題" />
        </h2>
        <Spin spinning={loading}>
          {
            featureSwitchData && featureSwitchData.map((item) => {
              const featureSwitchLink = `${config.topSite.domain}/service/${item.basicId}?gigId=${item.gigId}`;
              const getProifileImg = item.avatarFileUrl === null ? defaultImg : item.avatarFileUrl;
              const isFeatureSwitchCats = item.cats.map(no => showCat(no)).join('、');
              const getReviewScoreVal = rateAllowHalf(item.reviewScore);
              return (
                <a key={item.basicId} className={styles.card} data-gtm-index={dataGtmIndex} target="_blank" href={`${featureSwitchLink}`} rel="noreferrer">
                  <div className={styles.img}>
                    <Avatar size={106} shape="square" src={getProifileImg} alt={item.profileName} icon="user" />
                  </div>
                  <div className={styles.infoWrap}>
                    <div className={styles.title}>
                      {item.profileName}
                      <div className={styles.reviewWrap}>
                        <div className={styles.rate}>
                          <Rate allowHalf disabled value={getReviewScoreVal || 0} />
                          <span className={styles.text}>{item.reviewScore}</span>
                        </div>
                        {' '}
                        ｜ 合作數
                        {' '}
                        {item.dealCount}
                      </div>
                    </div>
                    <div className={styles.info}>
                      {item.schoolName && (`學歷：${item.schoolName} ｜ `)}
                      {showText(experienceData, item.exp)}
                      {item.exp !== '-1' && '經驗'}
                      {' '}
                      ｜ 擅長
                      {isFeatureSwitchCats}
                    </div>
                    <div className={styles.descWrap}>
                      <span className={styles.desc}>{ item.reviewComment }</span>
                      <div className={styles.link}>
                        查看完整服務
                        {' '}
                        <ChevronRight />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          }
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pickupTutorList: state.common.pickupTutorList,
  pickupOutsourceList: state.common.pickupOutsourceList,
});

const mapDispatchToProps = {
  getPickupOutsource,
  getPickupTutor,
};

export default connect(mapStateToProps, mapDispatchToProps)(Choice);
