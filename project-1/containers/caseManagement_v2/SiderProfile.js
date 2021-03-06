import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import {
  Layout, Rate, Spin, Button,
} from 'antd';
import { Star } from '@material-ui/icons';
import Avatar from '../../components/ui/avatar';
import config from '../../config/config';
import styles from './SiderProfile.scss';
import { loadBlockInfo } from '../../actions/gigManage';
import defaultAvator from '../../img/common_v2/avatar-default-square.svg';
import bronze from '../../img/common_v2/badge-bronze.png';
import gold from '../../img/common_v2/badge-gold.png';
import silver from '../../img/common_v2/badge-silver.png';
import goldIcon from '../../img/common_v2/gold-icon.png';
import { generateStarRate } from '../../util/formatUtil';
import { paidTable } from '../../config/constant';


const { Sider } = Layout;

class SiderProfile extends Component {
  state = {
    isScrolltop: false,
  }

  componentDidMount() {
    addEventListener('scroll', this.handleScroll);
    this.props.loadBlockInfo();
  }

  componentWillUnmount() {
    removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (document.documentElement.scrollTop > 56) {
      this.setState({
        isScrolltop: true,
      });
    } else {
      this.setState({
        isScrolltop: false,
      });
    }
  }


  render() {
    const {
      isMobile, blockInfo, imUnread, isLoadingBlockInfo, history,
    } = this.props;
    const {
      topperName, reviewAvgScore, visitCount, dealCount, coverPic, publishing,
      reviewCount, basicId, pid, orderState, endDate, medal, activeInSevenDays,
    } = blockInfo;
    const { isScrolltop } = this.state;
    const daysDiff = dayjs(endDate).startOf('day').diff(dayjs(), 'day') + 1;
    const isMoreThan15Days = daysDiff > 15;
    const IncludesOrderStates = ['2', '3', '4'];
    const productMap = config.products.json;
    const getOrderState = IncludesOrderStates.includes(orderState) && blockInfo.productNo
      ? productMap.top[blockInfo.productNo].categoryName
      : paidTable[Number(orderState)];
    const { topperUnReadMsgCount, demanderUnReadMsgCount } = imUnread;
    const unreadCount = Number(topperUnReadMsgCount) + Number(demanderUnReadMsgCount);
    const hasReviewCount = reviewCount !== '0';
    const starScore = hasReviewCount ? generateStarRate(Number(reviewAvgScore)) : 0.0;
    const compareReviewAvgScore = parseFloat(reviewAvgScore) >= parseFloat(4.5);
    const topperNameUI = topperName.length > 10 ? topperName.substring(0, 33) : topperName;
    const blogUrl = 'https://blog.top.104.com.tw/top-rated-freelancer';
    const badges = new Map([
      ['1', [{
        img: silver,
        alt: '??????',
        link: blogUrl,
      }]],
      ['2', [{
        img: gold,
        alt: '??????',
        link: blogUrl,
      }]],
    ]);
    const badge = badges.get(medal);
    if (isMobile) {
      return (
        <div className={styles.layout}>
          {
            unreadCount ? (
              <div className={styles.alert} onClick={() => history.push('/chat')}>
                <div className={styles.alertContent}>
                  <span>???????????????????????????</span>
                  <span className={styles.numOfUnread}>{unreadCount}</span>
                  <span>?????????</span>
                </div>
              </div>
            ) : null
          }
          <Spin spinning={isLoadingBlockInfo} size="large">
            <div className={styles.profile}>
              <div className={styles.userBrand}>
                <div className={styles.avatar}>
                  <Avatar userImg={coverPic || defaultAvator} alt={topperName} size={70} />
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.titleWrap}>
                    {publishing ? <Link className={styles.username} to={`/profile/${basicId}`}>{topperNameUI}</Link> : topperNameUI}
                    {
                      publishing === 'true' && (
                        <Button type="normal" className={styles.edit}><Link to="/editor?publish=success">??????</Link></Button>
                      )
                    }
                  </div>
                  <div className={styles.userBadge}>
                    {
                      (medal !== '0' || activeInSevenDays === 'true') && (
                        <div className={styles.badgeInfo}>
                          {
                            medal !== '0' && (
                              <a href={badge[0].link} target="_blank" rel="noreferrer">
                                <img src={badge[0].img} alt={badge[0].alt} />
                              </a>
                            )
                          }

                          {
                            activeInSevenDays === 'true' && (
                              <a href={blogUrl} target="_blank" rel="noreferrer">
                                <img src={bronze} alt="??????" />
                              </a>
                            )
                          }
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
            {
              (medal === '1' && compareReviewAvgScore && Number(dealCount) === 9 && Number(reviewCount) >= 5) && (
                <div className={styles.medalTips}>
                  <div className={styles.img}>
                    <img src={goldIcon} alt="????????????" />
                  </div>
                  <div className={styles.tips}>
                    <span className={styles.keyPoint}>???1????????????</span>
                    ?????????????????????
                  </div>
                </div>
              )
            }
            {
              (medal === '1' && compareReviewAvgScore && Number(dealCount) >= 10 && Number(reviewCount) === 4) && (
                <div className={styles.medalTips}>
                  <div className={styles.img}>
                    <img src={goldIcon} alt="????????????" />
                  </div>
                  <div className={styles.tips}>
                    <span className={styles.keyPoint}>???1????????????</span>
                    ?????????????????????
                  </div>
                </div>
              )
            }
            <div className={styles.userRate}>
              {
                hasReviewCount ? (
                  <div className={styles.rateWrap} onClick={() => history.push(`/evaluation/${basicId}`)}>
                    <span className={styles.evaluationNo}>{hasReviewCount ? reviewAvgScore : '-'}</span>
                    <Star style={{ color: '#00cdab', width: '20px', height: '20px' }} />
                    <span className={styles.rateNo}>{hasReviewCount ? `(${reviewCount})` : ''}</span>
                  </div>
                ) : (
                  <div className={styles.rateWrap}>
                    <span className={styles.evaluationNo}>{hasReviewCount ? reviewAvgScore : '-'}</span>
                    <Star style={{ color: '#00cdab', width: '20px', height: '20px' }} />
                    <span className={styles.rateNo}>{hasReviewCount ? `(${reviewCount})` : ''}</span>
                  </div>
                )
              }
              <div className={styles.reviewWrap}>
                ??????
                {' '}
                {visitCount}
                {' '}
                | ??????
                {' '}
                {dealCount}
              </div>
            </div>
            <div className={styles.userStatus}>
              <ul className={styles.statusList}>
                <li data-label="?????????" className={styles.item}>{pid || '-'}</li>
                <li data-label="?????????" className={styles.item}>{publishing === 'true' ? '???????????????' : '???????????????'}</li>
                <li data-label="?????????" className={styles.item}>{getOrderState}</li>
              </ul>
              <div className={styles.userBtn}>
                {
                  (orderState === '3' && isMoreThan15Days) && (
                    <div className={styles.button}>
                      <Button type="normal"><Link to="/upgrade">??????????????????</Link></Button>
                    </div>
                  )
                }
              </div>
            </div>
          </Spin>
        </div>
      );
    }
    return (
      <Spin spinning={isLoadingBlockInfo}>
        <Sider
          className={`${styles.sidebar} ${isScrolltop ? styles.top : ''}`}
          onScroll={this.handleScroll}
        >
          <Avatar userImg={coverPic || defaultAvator} alt={topperName} size={120} />
          {
            (medal !== '0' || activeInSevenDays === 'true') && (
              <div className={styles.badgeInfo}>
                {
                  medal !== '0' && (
                    <a href={badge[0].link} target="_blank" rel="noreferrer">
                      <img src={badge[0].img} alt={badge[0].alt} />
                    </a>
                  )
                }
                {
                  activeInSevenDays === 'true' && (
                    <a href={blogUrl} target="_blank" rel="noreferrer">
                      <img src={bronze} alt="??????" />
                    </a>
                  )
                }
              </div>
            )
          }
          {
            (medal === '1' && compareReviewAvgScore && Number(dealCount) === 9 && Number(reviewCount) >= 5) && (
              <div className={styles.medalTips}>
                <div className={styles.img}>
                  <img src={goldIcon} alt="????????????" />
                </div>
                <div className={styles.tips}>
                  <span className={styles.keyPoint}>???1????????????</span>
                  <br />
                  ?????????????????????
                </div>
              </div>
            )
          }

          {
            (medal === '1' && compareReviewAvgScore && Number(dealCount) >= 10 && Number(reviewCount) === 4) && (
              <div className={styles.medalTips}>
                <div className={styles.img}>
                  <img src={goldIcon} alt="????????????" />
                </div>
                <div className={styles.tips}>
                  <span className={styles.keyPoint}>???1????????????</span>
                  <br />
                  ?????????????????????
                </div>
              </div>
            )
          }

          <div className={styles.title}>
            {
              publishing
                ? <Link className={styles.username} to={`/profile/${basicId}`}>{topperName}</Link>
                : topperName
            }
          </div>
          {
            <Button type="normal" className={styles.edit}><Link to={`/editor${publishing === 'true' ? '?publish=success' : ''}`}>????????????</Link></Button>
          }
          {
            hasReviewCount
              ? (
                <div style={{ cursor: 'pointer' }} onClick={() => history.push(`/evaluation/${basicId}`)}>
                  <div className={styles.evaluationNo}>{hasReviewCount ? reviewAvgScore : '-'}</div>
                  <div className={styles.rateWrap}>
                    <Rate allowHalf disabled value={starScore} />
                    <span className={styles.rateNo}>{hasReviewCount ? `(${reviewCount || '-'})` : ''}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.evaluationNo}>{hasReviewCount ? reviewAvgScore : '-'}</div>
                  <div className={styles.rateWrap}>
                    <Rate allowHalf disabled value={starScore} />
                    <span className={styles.rateNo}>{hasReviewCount ? `(${reviewCount || '-'})` : ''}</span>
                  </div>
                </>
              )
          }
          <div className={styles.reviewWrap}>
            ?????????
            {' '}
            {visitCount}
            {' '}
            | ?????????
            {' '}
            {dealCount}
          </div>
          <ul className={styles.list}>
            <li>
              ???????????????
              {pid || '-'}
            </li>
            <li>
              ?????????
              {publishing === 'true' ? '???????????????' : '???????????????'}
            </li>
            {/* <a href={`${config.topSite.domain}/join`} target="_blank"><Help /></a> */}
            <li>
              ?????????
              {getOrderState}
            </li>
          </ul>
          {
            config.featureSwitch.VL10160 && (orderState === '3' && isMoreThan15Days) && (
              <div className={styles.button}>
                <Button type="normal"><Link to="/upgrade">??????????????????</Link></Button>
              </div>
            )
          }
        </Sider>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  blockInfo: state.gigManage.blockInfo,
  isLoadingBlockInfo: state.gigManage.blockInfo.isLoading,
  imUnread: state.chatmeta.imUnread,
  isLoadingPaidPlanInfo: state.basic.paidPlanInfo.isLoading,
});
const mapDispatchToProps = {
  loadBlockInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SiderProfile));
