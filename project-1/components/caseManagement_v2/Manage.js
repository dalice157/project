import React, { Component } from 'react';
import { withRouter, } from 'react-router-dom';
import {
  Layout, Tabs, Modal, Badge
} from 'antd';
import {
  Sms, Send, Visibility, ExpandMore
} from '@material-ui/icons';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import routePath from '../../config/routePath';
import addTop from '../../img/case/addTop.png';
import addTopMobile from '../../img/case/addTop-mobile.png';
import {
  dashboardNotify, paidTypes, paymentTypes, bankAccount, dateFormat
} from '../../config/constant.js';
import Card from './OverviewCard.js';
import TrailMember from './TrailMember.js';
import PremiumMember from './PremiumMember.js';
import styles from './Manage.scss';
import { getCatTitleByNo } from '../../util/lablesUtils.js';
import NonMember from './NonMember';
import { loadGigDashboard } from '../../actions/gigManage.js';
import { loadStaticArea } from '../../actions/common';

const { Content } = Layout;
const { TabPane } = Tabs;

class Manage extends Component {
  state = {
    showModal: false,
    selectedTagIndex: 0,
    demandIndex: 0,
    current: 'manage',
  };

  componentDidMount() {
    this.props.loadStaticArea();
    this.props.loadGigDashboard();
  }

  showUnpaidInfo = (atmVirtualAccount, ibonVirtualAccount, paymentDueDate, price) => {
    Modal.info({
      title: '您已選擇以下付款方式',
      content: (
        <div>
          { atmVirtualAccount || ibonVirtualAccount ? <p>付款方式：{atmVirtualAccount ? paymentTypes[5] : paymentTypes[3]}</p> : null}
          { atmVirtualAccount ? <p>銀行代碼：{bankAccount}</p> : null}
          { atmVirtualAccount || ibonVirtualAccount ? <p>銷帳編號：{atmVirtualAccount || ibonVirtualAccount}</p> : null}
          { price ? <p>應付金額：{price}</p> : null}
          { paymentDueDate ? <p>付款期限：{dayjs(paymentDueDate).format(dateFormat)} 前完成付款</p> : null}
          <br />
          {
            ibonVirtualAccount
              ? (
                <>
                  <b>ibon操作流程說明：</b>
                  <p>ibon 儲值/繳費  &gt;  銀行/保險  &gt;  其他費用  &gt;  台灣銀行  &gt;   專戶代收  &gt;  104集團  &gt;  104集團依銷帳編號  &gt;  輸入銷帳編號 &gt; 確認繳費內容 &gt; 列印繳費單 &gt; 收銀台繳費</p>
                </>
              ) : <></>
          }
        </div>
      ),
      okText: '關閉',
    });
  }

  changeDashboardPage = (element) => {
    this.setState({ current: element.key });
  }

  onRenderMemberProduct = (paidList, isMobile) => {
    const { gigDashboard, history } = this.props;
    const {
      publishDate, depositResource, experienceMemberEstimateEndDate
    } = gigDashboard;
    // isTrial: 體驗會員, isPaid: 已付費
    const isTrialMember = (paidList && paidList.length >= 1) ? paidList.find(order => order.orderType === paidTypes.freeTrial) : false;
    const isPaidMember = (paidList && paidList.length >= 1) ? paidList.find(order => (order.orderType === paidTypes.valuable || order.orderType === paidTypes.infinite)) : false;
    if (isTrialMember) {
      return (
        <TrailMember
          isMobile={isMobile}
          depositResource={depositResource}
          experienceMemberEstimateEndDate={experienceMemberEstimateEndDate}
          publishDate={publishDate}
          paidList={paidList}
          gigDashboard={gigDashboard}
          showUnpaidInfo={this.showUnpaidInfo}
          history={history}
        />
      );
    } else if (isPaidMember) {
      return (
        <PremiumMember
          isMobile={isMobile}
          paidList={paidList}
          gigDashboard={gigDashboard}
          showUnpaidInfo={this.showUnpaidInfo}
        />
      );
    } else {
      return (
        <NonMember
          isMobile={isMobile}
          gigDashboard={gigDashboard}
        />
      );
    }
  }

  render() {
    const { demandIndex, showModal } = this.state;
    const {
      gigDashboard, imUnread, area, isMobile
    } = this.props;
    const {
      topperDashboard, isLoading, demandCatList, demandIndexMap, paidList
    } = gigDashboard;
    const {
      invitingCount, communicatingCount, cooperatingCount, closedCount, quotationCount, getContactCount
    } = topperDashboard;
    const { topperUnReadMsgCount, demanderUnReadMsgCount } = imUnread;
    const unreadCount = Number(topperUnReadMsgCount) + Number(demanderUnReadMsgCount);

    if (isLoading) {
      return <></>;
    } else if (isMobile) {
      return (
        <div className={styles.layout}>
          <div className={styles.manage}>
            <ul className={styles.statusList}>
              <li className={styles.statusElement} onClick={() => this.props.history.push(routePath.topperDashboardInviting)}>
                <p className={styles.statusTitle}>被邀請</p>
                <p className={styles.numOfStatus}>{invitingCount || '-'}</p>
              </li>
              <li className={styles.statusElement} onClick={() => this.props.history.push(routePath.topperDashboardCommunication)}>
                <p className={styles.statusTitle}>溝通中</p>
                <p className={styles.numOfStatus}>{communicatingCount || '-'}</p>
              </li>
              <li className={styles.statusElement} onClick={() => this.props.history.push(routePath.topperDashboardCooperation)}>
                <p className={styles.statusTitle}>合作中</p>
                <p className={styles.numOfStatus}>{cooperatingCount || '-'}</p>
              </li>
              <li className={styles.statusElement} onClick={() => this.props.history.push(routePath.topperDashboardClosed)}>
                <p className={styles.statusTitle}>關閉案件</p>
                <p className={styles.numOfStatus}>{closedCount || '-'}</p>
              </li>
            </ul>
            <ul className={styles.actionList}>
              <li className={styles.actionElement} onClick={() => this.props.history.push(routePath.topperDashboardApplied)}>
                <Send />
                <span className={styles.actionTitle}>應徵案件</span>
                <span className={styles.actionNo}>{quotationCount || '-'}</span>
              </li>
              <li className={styles.actionElement} onClick={() => this.props.history.push(routePath.topperDashboardContact)}>
                <Visibility />
                <span className={styles.actionTitle}>查閱案件</span>
                <span className={styles.actionNo}>{getContactCount || '-'}</span>
              </li>
            </ul>
            {this.onRenderMemberProduct(paidList, isMobile)}
          </div>
          {
            (demandCatList && demandCatList.length !== 0)
              ? (
                <div className={styles.interest}>
                  <div className={styles.interestTitle} onClick={() => this.setState({ showModal: true })}>
                    <h2 className={styles.interestText}>您可能有興趣的案件</h2>
                    <ExpandMore />
                  </div>
                  <div className={styles.cardWrap}>
                    {demandIndexMap[demandCatList[demandIndex]].map(demand => <Card key={demand.title} item={demand} area={area} />)}
                  </div>
                </div>
              ) : null
          }
          <div className={styles.announcement}>
            <h2 className={styles.announcementTitle}>重要通知</h2>
            <ul className={styles.importWrap}>
              {dashboardNotify.map(item => (
                <li key={item.id}>
                  <a href={item.link}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            <img className={styles.topPic} src={addTopMobile} alt="歡迎加入 高手行列" />
          </div>
          <Modal
            visible={showModal}
            title="選擇案件類別"
            okText="確定"
            cancelText="關閉"
            onOk={() => {
              const currentIndex = this.state.selectedTagIndex;
              this.setState({ showModal: false, demandIndex: currentIndex });
            }}
            onCancel={() => {
              const resetIndex = this.state.demandIndex;
              this.setState({ showModal: false, selectedTagIndex: resetIndex });
            }}
          >
            {
              demandCatList.map((no, index) => {
                const selected = this.state.selectedTagIndex === index;
                const disabled = demandIndexMap[no].length === 0;
                return (
                  <div
                    key={index}
                    className={`${styles.tag} ${disabled && styles.tagDisabled} ${selected && styles.tagSelected}`}
                    onClick={() => {
                      if (!disabled) {
                        this.setState({ ...this.state, selectedTagIndex: index });
                      }
                    }}
                  >
                    {getCatTitleByNo(no)} {demandIndexMap[no].length}
                  </div>
                );
              })
            }
          </Modal>
        </div>
      );
    } else {
      return (
        <Content collapsible="false">
          <div className={styles.content}>
            {
              unreadCount ? (
                <div
                  className={styles.chatMsg}
                  onClick={() => {
                    if (unreadCount > 0) {
                      this.props.history.push('/chat');
                    }
                  }}
                >
                  <Badge dot><Sms /></Badge>您有聊天室新訊息：<span className={styles.msg}>{unreadCount}</span>則未讀
                </div>
              ) : null
            }
            <ul className={styles.caseNoWrap}>
              <li onClick={() => this.props.history.push(routePath.topperDashboardInviting)}>
                <span className={styles.title}>被邀請</span>
                <span className={styles.no}>{invitingCount || '-'}</span>
              </li>
              <li className={styles.line} />
              <li onClick={() => this.props.history.push(routePath.topperDashboardCommunication)}>
                <span className={styles.title}>溝通中</span>
                <span className={styles.no}>{communicatingCount || '-'}</span>
              </li>
              <li className={styles.line} />
              <li onClick={() => this.props.history.push(routePath.topperDashboardCooperation)}>
                <span className={styles.title}>合作中</span>
                <span className={styles.no}>{cooperatingCount || '-'}</span>
              </li>
              <li className={styles.line} />
              <li onClick={() => this.props.history.push(routePath.topperDashboardClosed)}>
                <span className={styles.title}>已關閉案件</span>
                <span className={styles.no}>{closedCount || '-'}</span>
              </li>
              <li className={styles.bg} onClick={() => this.props.history.push(routePath.topperDashboardApplied)}>
                <span className={styles.title}><Send />應徵案件</span>
                <span className={styles.no}>{quotationCount || '-'}</span>
              </li>
              <li className={styles.bg} onClick={() => this.props.history.push(routePath.topperDashboardContact)}>
                <span className={styles.title}><Visibility />查閱案件</span>
                <span className={styles.no}>{getContactCount || '-'}</span>
              </li>
            </ul>
            {this.onRenderMemberProduct(paidList)}
            {
              (demandIndexMap && demandIndexMap.length !== 0)
                ? (
                  <>
                    <h3 className={styles.title}>您可能有興趣的案件</h3>
                    <Tabs className={styles.tabs} defaultActiveKey="1">
                      {
                        demandCatList.map((no) => {
                          return (
                            <TabPane tab={<>{getCatTitleByNo(no)} <span className={styles.no}>{demandIndexMap[no].length}</span></>} key={no} disabled={demandIndexMap[no].length === 0}>
                              <div className={styles.cardWrap}>
                                {demandIndexMap[no].map(demand => <Card key={demand.title} item={demand} area={area} />)}
                              </div>
                            </TabPane>
                          );
                        })
                      }
                    </Tabs>
                  </>
                )
                : null
            }
            <img className={styles.topPic} src={addTop} alt="歡迎加入 高手行列" />
            <h3 className={styles.title}>重要通知</h3>
            <ul className={styles.importWrap}>
              {
                dashboardNotify.map(item => (
                  <li key={item.id}>
                    <a target="_blank" href={item.link}>
                      {item.title}
                    </a>
                  </li>
                ))
              }
            </ul>
          </div>
        </Content>
      );
    }
  }
}

const mapStateToProps = state => ({
  gigDashboard: state.gigManage.gigDashboard,
  imUnread: state.chatmeta.imUnread,
  area: state.common.area,
});
const mapDispatchToProps = {
  loadGigDashboard,
  loadStaticArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Manage));
