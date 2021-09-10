import React, { Component } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { BrowserView, MobileView, uaIsMobile } from 'react-device-detect';

import {
  Breadcrumb, Layout, Modal, Spin, message,
} from 'antd';
import {
  loadIntroductInvitableDemands, addGigFromIntroduct, removeGigFromIntroduct, addGigOtherFromIntroduct, removeGigOtherFromIntroduct,
} from '../../actions/introduct';
import {
  loadStaticArea, loadReviewCheck, chkActiveProcess, loadGigDetail, loadSelfAchievement,
} from '../../actions/common';

// import { initialServiceData } from '../../actions/ssr';

import { inviteChat } from '../../actions/chatmeta_v2';

import HiddenOrderForm from '../../components/pay/HiddenOrderForm';
import Card from '../../components/service/Card';
import SiderInside from '../../components/service/Sider';
import Introduction from '../../components/service/Introduction';
import ChooseModel from '../../components/profile/ChooseModel';
import styles from './Service.scss';
import { isNumber } from '../../util/commonUtil';

const { Sider } = Layout;
const { info } = Modal;

class Service extends Component {
  state = {
    isScrolltop: false,
    loading: false,
    checkPublish: false,
  }

  async componentDidMount() {
    const topperBasicId = this.props.match.params.basicId;
    if (isNumber(topperBasicId)) {
      this.props.loadStaticArea();
      const topperGigId = this.props.location.query.gigId;
      // const { user: { pid } } = this.props;

      // 確認Topper的發布狀態 resp.payload = [true: 已發布] [false: 未發布]
      const resp = await this.props.loadReviewCheck(topperBasicId);
      // payload = false:未發布
      if (resp.payload) {
        this.setState({
          checkPublish: true,
        });
        this.props.loadGigDetail(topperBasicId, topperGigId)
          .then((response) => {
            if (response.error) {
              Modal.info({
                title: '此服務不存在',
                okText: '關閉',
                onOk: () => window.close(),
              });
            }
          });
        this.props.loadSelfAchievement(topperBasicId);
      } else {
        message.warning('此用戶未公開服務，即將導頁至服務列表。');
        setTimeout(() => this.props.history.push('/search'), 3000);
      }

      addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    removeEventListener('scroll', this.handleScroll);
  }

  handelLoading = () => {
    // console.log('loading');
    this.setState({
      loading: true,
    });
  }

  /**
   * 聯絡高手
   */
  handleChooseLink = async (selectedDemands, basicId) => {
    let redirect = true;
    const vals = [];
    const isOrderTXStatus = selectedDemands.filter((item) => {
      if (!item.alreadyIM || item.alreadyIM != 3) {
        vals.push(item.demandId); // 排除溝通中的值, 不作邀請 (會直接進IM)
      }
      return item.orderTXStatus != '0.5';
    });

    // 1: '己邀請',  (己邀請不能選, 前面己disable)
    // 2: '該員己主應',
    // 3: '溝通中'
    try {
      if (isOrderTXStatus.length != 0) { // 執行一般邀請流程
        this.setState({
          loading: true,
          childerVisible: true,
        });
        await this.props.inviteChat(basicId, vals);
      } else { // 全部都選擇審核中,執行審核邀請
        this.setState({
          childerVisible: false,
        });
        redirect = false;
        await this.props.inviteChat(basicId, vals);
        this.info();
      }
      // await this.props.inviteChat(basic.basicId, selectedDemands);
    } catch (error) {
      redirect = false;
      console.error(error);
    }

    this.setState({
      redirect,
      redirectDemandId: selectedDemands.length > 0 ? selectedDemands[0].demandId : null,
    });
  }

  handelSearch = (value, isCat) => {
    if (isCat) {
      if (value >= 2000000) {
        open(`/search?cats=${value}`);
      } else {
        open(`/search-tutor?cats=${value}`);
      }
      // this.props.history.push('/search?cats=' + value);
    } else {
      open(`/search?q=${value}`);
      // this.props.history.push('/search?q=' + value);
    }
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

  addFavorite = async (gigId) => {
    await this.props.addFavorite(gigId);
  }

  removeFavorite = async (favoriteId) => {
    await this.props.removeFavorite(favoriteId);
  }

  addOtherFavorite = async (gigId) => {
    await this.props.addOtherFavorite(gigId);
  }

  removeOtherFavorite = async (favoriteId) => {
    await this.props.removeOtherFavorite(favoriteId);
  }

  info = () => {
    info({
      title: '已記錄您本次的邀請!!',
      content: (
        <p>案件尚在審核中，邀請後不會立即通知高手，待審核上線刊登時，才會發送邀請訊息通知給高手。</p>
      ),
      okText: '關閉',
      onOk() {
        location.reload();
      },
    });
  }

  render() {
    const {
      areaData, profileInfo, user, gigDetail, invitableDemands,
    } = this.props;
    const {
      loadProfileInvitableDemands,
      gigData,
    } = this.props;
    const topperBasicId = this.props.match.params.basicId;

    const isMobile = uaIsMobile();
    const isChooseText = isMobile ? '聯繫我' : '聯繫';
    const chooseForm = {
      btnText: isChooseText,
      btnType: 'primary',
      isAvatar: false,
      handleChooseLink: this.handleChooseLink,
      onChooseChange: this.onChooseChange,
      selectedDemands: this.state.selectedDemands,
    };
    const demandAction = {
      partBId: topperBasicId,
      loadInvitableDemands: () => loadProfileInvitableDemands(topperBasicId),
    };
    const addDemandForm = {
      btnText: '新增需求',
      btnType: '',
    };
    const userBasicId = this.props.user.id;

    if (this.state.redirect) { // 聯絡高手有選擇案件會跳轉
      return <Redirect push to={`/chat?demandId=${this.state.redirectDemandId}&topperId=${demandAction.partBId}`} />;
    }
    const isPersonalProfile = topperBasicId === String(user.id);
    const { gigId } = this.props.location.query;
    const { otherGigIndex } = gigDetail;
    const otherGigIndexLenght = otherGigIndex.length;
    const isMobiles = isMobile ? styles.mobile : '';
    const catNo = this.props.location.query.cats;
    // 檔案未公開 or 觀看自己的品牌頁，不顯示聯繫按鈕
    const contactButton = !this.state.checkPublish || isPersonalProfile ? '' : (
      <ChooseModel
        addDemandForm={addDemandForm}
        demandAction={demandAction}
        chooseForm={chooseForm}
        invitableDemands={invitableDemands}
        user={user}
        handelLoading={this.handelLoading}
        userBasicId={userBasicId}
        topperBasicId={topperBasicId}
        chkActiveProcess={this.props.chkActiveProcess}
      />
    );

    return (
      <>
        <Spin size="large" spinning={this.state.loading} tip="Loading...">
          <div className={styles.bg}>
            <div className={`${styles.wrap} ${isMobiles}`}>
              <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to="/">首頁</Link></Breadcrumb.Item>
                <Breadcrumb.Item>
                  {(catNo && catNo != 'undefined') ? <Link to={`/search?cats=${catNo}`}>服務列表</Link> : <Link to="/search">服務列表</Link>}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {
                  isMobile ? (
                    '服務介紹'
                  )
                    : (
                      `${profileInfo.topperName}服務介紹 - ${gigDetail.focusGig.title}`
                    )
                }
                </Breadcrumb.Item>
              </Breadcrumb>
              <BrowserView>
                <Layout hasSider>
                  <Sider className={styles.sider}>
                    <SiderInside
                      gigId={gigId}
                      basicId={topperBasicId}
                      onScroll={this.handleScroll}
                      isScrolltop={this.state.isScrolltop}
                      profileInfo={profileInfo}
                      contactButton={contactButton}
                    />
                  </Sider>
                  <Layout className={styles.layout}>
                    <div onScroll={this.handleScroll} className={`${styles.title} ${this.state.isScrolltop ? styles.top : ''}`}>服務介紹</div>
                    <Introduction
                      gigDetail={gigDetail}
                      areaData={areaData}
                      handelSearch={this.handelSearch}
                      basicId={topperBasicId}
                      addFavorite={this.addFavorite}
                      removeFavorite={this.removeFavorite}
                      gigData={gigData}
                      profileInfo={profileInfo}
                      chkActiveProcess={this.props.chkActiveProcess}
                    />
                    {
                    otherGigIndexLenght > 0 && (
                      <>
                        <div className={styles.title}>其他服務</div>
                        <div className={`${styles.cardWarp}`}>
                          {
                            otherGigIndex.map((item, index) => (
                              <Card
                                key={item.gigId}
                                {...item}
                                areaData={areaData}
                                basicId={topperBasicId}
                                addFavorite={this.addOtherFavorite}
                                removeFavorite={this.removeOtherFavorite}
                                user={user}
                                index={index}
                                catNo={catNo}
                                chkActiveProcess={this.props.chkActiveProcess}
                              />
                            ))
                          }
                        </div>
                      </>
                    )
                  }
                  </Layout>
                </Layout>
              </BrowserView>
              <MobileView>
                <div className={styles.layout}>
                  <Introduction
                    gigDetail={gigDetail}
                    areaData={areaData}
                    handelSearch={this.handelSearch}
                    basicId={topperBasicId}
                    gigId={gigId}
                    addFavorite={this.addFavorite}
                    removeFavorite={this.removeFavorite}
                    gigData={gigData}
                    profileInfo={profileInfo}
                    chkActiveProcess={this.props.chkActiveProcess}
                  />
                  <SiderInside
                    gigId={gigId}
                    basicId={topperBasicId}
                    profileInfo={profileInfo}
                    contactButton={contactButton}
                  />
                  {
                  otherGigIndexLenght > 0 && (
                    <>
                      <div className={styles.title}>其他服務</div>
                      <div className={`${styles.cardWarp}`}>
                        {
                          otherGigIndex.map((item, index) => (
                            <Card
                              key={item.gigId}
                              {...item}
                              areaData={areaData}
                              basicId={topperBasicId}
                              addFavorite={this.addOtherFavorite}
                              removeFavorite={this.removeOtherFavorite}
                              index={index}
                              chkActiveProcess={this.props.chkActiveProcess}
                              profileInfo={profileInfo}
                            />
                          ))
                        }
                      </div>
                    </>
                  )
                }
                </div>
              </MobileView>
            </div>
            {
            this.props.paid
            && <HiddenOrderForm formData={this.props.paid} />
          }
          </div>
          {
          (isMobile && !isPersonalProfile) && (
            <div className={styles.contactWrap}>
              <ChooseModel
                addDemandForm={addDemandForm}
                demandAction={demandAction}
                chooseForm={chooseForm}
                invitableDemands={invitableDemands}
                user={user}
                handelLoading={this.handelLoading}
                userBasicId={userBasicId}
                topperBasicId={topperBasicId}
                chkActiveProcess={this.props.chkActiveProcess}
              />
            </div>
          )
        }
        </Spin>
      </>
    );
  }
}

const mapStateToProps = state => ({
  areaData: state.common.area,
  user: state.user,
  invitableDemands: state.introduct.invitableDemands,
  saveDemand: state.introduct.saveDemand,
  defaultDemanderForm: state.introduct.defaultDemanderForm,
  activate: state.introduct.activate,
  paid: state.introduct.paid,
  profileInfo: state.introduct.profileInfo,
  gigDetail: state.introduct.gigDetail,
  gigData: state.introduct.gigData,
});

const mapDispatchToProps = {
  loadStaticArea,
  // IM相關API
  inviteChat,
  loadProfileInvitableDemands: loadIntroductInvitableDemands,
  // Verify 相關 API
  loadReviewCheck,
  chkActiveProcess,
  // 左右欄 相關 API
  loadGigDetail,
  loadSelfAchievement,
  // 收藏 相關 API
  addFavorite: addGigFromIntroduct,
  removeFavorite: removeGigFromIntroduct,
  addOtherFavorite: addGigOtherFromIntroduct,
  removeOtherFavorite: removeGigOtherFromIntroduct,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Service),
);
