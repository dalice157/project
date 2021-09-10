import React, { Component, Fragment } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { Link } from 'react-router-dom';
import {
  Spin, Tag, Icon, Modal, Button, Switch, Tooltip,
} from 'antd';
import { LocalOffer, Room, Person } from '@material-ui/icons';
import dayjs from 'dayjs';
import { dateFormat, TUTOR_RECOMMENDATION } from '../../config/constant';
import ApplyClosedDemandModal from '../../containers/demand_v3/modal/ApplyClosedDemandModal';
import Avatar from '../ui/avatar';
import { catSearch } from '../../util/categoryUtils.js';
import { showCat, catsSimpleData } from '../../util/lablesUtils.js';
import { demandOrderTXStatus, priceType, targetData } from '../../config/selectData';
import { moneyFormat } from '../../util/commonUtil';
import styles from './Card.scss';

const { confirm } = Modal;

/**
 * listing 需求
 */
class Card extends Component {
  state = {
    isViolationSet: {},
  }

  showCatTags = (arr) => {
    let _rootKey = null;
    let _midKey = null;
    let _Key = null;
    let result = null;
    if (arr.length > 0) {
      for (const key of arr) {
        let rootKey = null;
        let midKey = null;
        if (key % 1000 === 0) {
          rootKey = Math.floor(key / 1000000) * 1000000;
        } else {
          rootKey = Math.floor(key / 1000000) * 1000000;
          midKey = Math.floor(key / 1000) * 1000;
        }

        if (_rootKey) {
          result = (
            <>
              {`${showCat(_rootKey)},`}
              {_midKey && `${showCat(_midKey)},`}
              {`${showCat(_Key)},`}
              {_rootKey !== rootKey && `${showCat(rootKey)},`}
              {midKey && _midKey !== midKey && `${showCat(midKey)},`}
              {showCat(key)}
            </>
          );
        }

        if (!_rootKey) { _rootKey = rootKey; }
        if (!_midKey) { _midKey = midKey; }
        if (!_Key) { _Key = key; }
      }
    } else {
      result = '無';
    }
    if (!result) {
      result = (
        <>
          {_rootKey && `${showCat(_rootKey)},`}
          {_midKey && `${showCat(_midKey)},`}
          {showCat(_Key)}
        </>
      );
    }
    return result;
  }

  renderMarginStatus = (data) => {
    const {
      orderTXStatus, violationRecord, depositeStatus, offDate, offReason,
    } = data;

    switch (orderTXStatus) {
      // [0: 編輯中]
      case demandOrderTXStatus.UNPUBLISH: {
        return <Tag>編輯中</Tag>;
      }
      // [0.5: 編輯中]
      case demandOrderTXStatus.UNVERIFY: {
        return <Tag style={{ color: '#1f8207', background: '#d4f1d0', borderColor: '#d4f1d0' }}>審核中</Tag>;
      }
      // [1: 刊登中]
      case demandOrderTXStatus.PUBLISH: {
        // onlineStatus: [null: 未上刊][1: 刊登中公開] [2: 刊登中不公開]
        // 目前不管有無公開刊登，皆為顯示如下
        if (depositeStatus === demandOrderTXStatus.depositeStatus.FREE) {
          // 免押金刊登中
          return <Tag color="green">免押金刊登中</Tag>;
        }
        // 已付款押金刊登中
        return <Tag color="green">已付款押金刊登中</Tag>;
      }
      // [2: 退款]
      case demandOrderTXStatus.REFUND: {
        if (!violationRecord) { // violationRecord 有無檢舉
          // 免押金退款
          if (depositeStatus === null) {
            // 免押金結案
            return (
              <Tag color="orange">
                {dayjs(offDate).format(dateFormat)}
                已結案
              </Tag>
            );
          }
          // 退款結案
          return (
            <Tag color="orange">
              {dayjs(offDate).format(dateFormat)}
              已結案
            </Tag>
          );
        } else if (violationRecord) {
          // 檢舉不退款
          return (
            <Tag color="red">
              {dayjs(offDate).format(dateFormat)}
              檢舉違規確認下刊
            </Tag>
          );
        }
      }
      // [3: 結案]
      case demandOrderTXStatus.FINISH: {
        // [100-199: 未上刊關閉]
        if (offReason >= 100 && offReason <= 199) {
          return <Tag style={{ color: 'rgba(0,0,0,.85)', background: '#bfbfbf', borderColor: '#4a4a4a' }}>取消未刊登</Tag>;
        }
        return (
          <Tag color="orange">
            {dayjs(offDate).format(dateFormat)}
            已結案
          </Tag>
        );
      }
      default: return '無資料';
    }
  };

  renderButtonStatus = (orderTXStatus, demandItem, searchArea) => {
    const { demandCategory } = demandItem;
    const { tutorNo } = TUTOR_RECOMMENDATION;
    const catValNo = demandCategory ? demandCategory[0] : null;
    const treeData = catsSimpleData(catValNo);
    const inTutorPage = treeData.key === tutorNo;
    const concatDemandType = inTutorPage ? '%26demandType=1' : '%26demandType=2';
    const pendingForm = {
      btnText: '內容修改',
      btnType: 'danger',
      orderTXStatus,
      demandItem: JSON.parse(JSON.stringify(demandItem)),
      searchArea,
    };

    const continueForm = {
      btnText: '繼續完成',
      btnType: 'primary',
      orderTXStatus,
      demandItem: JSON.parse(JSON.stringify(demandItem)),
      searchArea,
    };

    const viewForm = {
      btnText: '內容修改',
      btnType: 'danger',
      orderTXStatus,
      demandItem: JSON.parse(JSON.stringify(demandItem)),
      searchArea,
    };

    const closedDemand = JSON.parse(JSON.stringify(demandItem));
    closedDemand.demandId = '';

    const republishForm = {
      btnText: '新增類似需求',
      btnType: 'danger',
      orderTXStatus,
      demandItem: closedDemand,
      searchArea,
    };

    const actions = {
      [demandOrderTXStatus.UNPUBLISH]: <Button type="primary" onClick={() => { this.props.chkActiveProcess(`/caseForm?demandId=${demandItem.demandId}${concatDemandType}`); }}>{continueForm.btnText}</Button>,
      [demandOrderTXStatus.UNVERIFY]: <Button onClick={() => { this.props.chkActiveProcess(`/editCaseForm?demandId=${demandItem.demandId}${concatDemandType}`); }}>{pendingForm.btnText}</Button>,
      [demandOrderTXStatus.PUBLISH]: <Button onClick={() => { this.props.chkActiveProcess(`/editCaseForm?demandId=${demandItem.demandId}${concatDemandType}`); }}>{viewForm.btnText}</Button>,
      [demandOrderTXStatus.REFUND]: <Button onClick={() => { this.props.chkActiveProcess(`/caseForm?demandId=${demandItem.demandId}${concatDemandType}%26isNewDemand=yes`); }}>{republishForm.btnText}</Button>,
      [demandOrderTXStatus.FINISH]: <Button onClick={() => { this.props.chkActiveProcess(`/caseForm?demandId=${demandItem.demandId}${concatDemandType}%26isNewDemand=yes`); }}>{republishForm.btnText}</Button>,
    };

    return actions[orderTXStatus];
  };

  renderRefundStatus = (data) => {
    const {
      orderTXStatus, violationRecord, depositeStatus, refundDate, payDate,
    } = data;

    switch (orderTXStatus) {
      // [2: 退款]
      case demandOrderTXStatus.REFUND: {
        return <span className={styles.refunded}>退款處理中</span>;
      }
      // [3: 結案]
      case demandOrderTXStatus.FINISH: {
        if (!violationRecord && depositeStatus == demandOrderTXStatus.depositeStatus.FREE) {
          return <span className={styles.refunded}>無押金免退款</span>;
        } else if (violationRecord && depositeStatus == demandOrderTXStatus.depositeStatus.PAY) {
          return (
            <span className={styles.violationRecord}>
              {dayjs(payDate).format(dateFormat)}
              押金轉服務費
            </span>
          );
        } else if (violationRecord && depositeStatus == demandOrderTXStatus.depositeStatus.FREE) {
          return <span className={styles.violationRecord}>無押金</span>;
        }
        return (
          <span className={styles.refunded}>
            {dayjs(refundDate).format(dateFormat)}
            已退款
          </span>
        );
      }
      default: return '';
    }
  }

  handlViolation = (num) => {
    this.setState(state => ({
      isViolationSet: {
        ...state.isViolationSet,
        [num]: !state.isViolationSet[num],
      },
    }));
  }

  changeIcon = (item, num) => {
    if (item.orderTXStatus == 2 || item.orderTXStatus == 3) {
      if (this.state.isViolationSet[num]) {
        return (
          <a className={styles.icon} onClick={() => this.handlViolation(num)}>
            <Icon type="up-circle" theme="filled" />
          </a>
        );
      }
      return (
        <a className={styles.icon} onClick={() => this.handlViolation(num)}>
          <Icon type="down-circle" theme="filled" />
        </a>
      );
    }
  }

  onDelInfo = (demandId) => {
    const { demandCloseSubmit } = this.props;
    confirm({
      title: '您確定要刪除此需求嗎?',
      content: '編輯中的資料，刪除後資料即消失，無法復原。',
      okText: '確認',
      cancelText: '取消',
      onOk() {
        demandCloseSubmit(demandId, 101, [])
          .then((result) => {
            if (result.payload?.success) {
              location.reload();
            }
          });
      },
    });
  }

  render() {
    const {
      lists, area, user, loading, isDemander, changePhoneDisplay,
    } = this.props;
    const { isViolationSet } = this.state;
    const isNoDemandList = lists && lists.data.length == 0 || user.pid && !lists;
    if (isDemander && loading) {
      return (
        <div className={styles.loading}>
          <Spin size="large" tip="載入案件中" />
        </div>
      );
    } else if (isNoDemandList && isDemander) {
      return <div className={styles.loading}>尚未新增過需求案件</div>;
    } else if (!loading && isNoDemandList && isDemander) {
      return <div className={styles.loading}>無資料！！</div>;
    }
    return (
      lists && Array.isArray(lists.data) && lists.data.map((item, num) => {
        const {
          demandBody, depositeStatus, orderTXStatus, phoneDisplaying, canChangPhoneDisplay, offReason,
        } = item;
        const isViolation = item.violationRecord ? styles.violation : '';
        const {
          title, desc, assignPlace, minPrice, maxPrice, unit,
        } = demandBody;
        const searchArea = area.length
          && assignPlace !== null && assignPlace.length > 0
          ? catSearch(area, assignPlace[0])
          : '';
        const demandNo = item.demandId.slice(7);
        const minNum = minPrice ? minPrice.toString() : '0';
        const maxNum = maxPrice ? maxPrice.toString() : '0';
        const hasOpendDemand = item.orderTXStatus === demandOrderTXStatus.PUBLISH || item.orderTXStatus === demandOrderTXStatus.REFUND || (item.orderTXStatus === demandOrderTXStatus.FINISH && !(item.offReason >= 150 && item.offReason <= 199));
        const isShowViolation = isViolationSet[num] ? styles.show : styles.hide;
        const getEndDate = {
          1: dayjs(item.expireDate).format(dateFormat),
          2: dayjs(item.offDate).format(dateFormat),
          3: dayjs(item.offDate).format(dateFormat),
        };
        const nowFormat = dayjs().startOf('day');
        const expireDateFormat = dayjs(item.expireDate).startOf('day');
        const getWithin7Days = expireDateFormat.diff(nowFormat, 'day');
        const isWithin7Days = getWithin7Days <= 7 && getWithin7Days > 0;
        const closedDemand = JSON.parse(JSON.stringify(item));
        closedDemand.demandId = '';
        const republishForm = {
          btnText: '新增類似需求',
          btnType: 'danger',
          orderTXStatus: item.orderTXStatus,
          demandItem: closedDemand,
          searchArea,
        };
        const { tutorNo } = TUTOR_RECOMMENDATION;
        const catValNo = item.demandCategory ? item.demandCategory[0] : null;
        const treeData = catsSimpleData(catValNo);
        const inTutorPage = treeData.key === tutorNo;
        const concatDemandType = inTutorPage ? '%26demandType=1' : '%26demandType=2';
        const isClosedNotPublished = offReason >= 100 && offReason <= 199;
        const isShowPhoneDisplayTip = (orderTXStatus === demandOrderTXStatus.FINISH && !isClosedNotPublished) || orderTXStatus === demandOrderTXStatus.PUBLISH || orderTXStatus === demandOrderTXStatus.REFUND;
        let phoneDisplayTip = '';
        if (!canChangPhoneDisplay) {
          if (orderTXStatus === demandOrderTXStatus.FINISH || orderTXStatus === demandOrderTXStatus.REFUND) {
            phoneDisplayTip = '案件已關閉，不可設定';
          } else if (depositeStatus === demandOrderTXStatus.depositeStatus.FREE) {
            phoneDisplayTip = '溝通人數超過10人以上時，可設定暫停開放';
          }
        }
        return (
          <Fragment key={item.demandId}>
            <BrowserView>
              <div className={`${styles.wrap} ${isViolation}`}>
                <div className={styles.dataWrap}>
                  <div className={styles.date}>
                    刊登起訖日：
                    {item.onlineDate ? `${dayjs(item.onlineDate).format(dateFormat)} ~ ${getEndDate[item.orderTXStatus]}` : '尚未刊登'}
                  </div>
                  <div className={styles.date}>
                    案件編號：
                    {demandNo}
                  </div>
                  {
                    isShowPhoneDisplayTip && (
                      <div className={styles.date}>
                        開放電話聯繫：
                        <Tooltip title={phoneDisplayTip}>
                          <Switch
                            checked={phoneDisplaying}
                            disabled={!canChangPhoneDisplay}
                            checkedChildren="開啟"
                            unCheckedChildren="暫停"
                            onChange={() => changePhoneDisplay(item.demandId, !phoneDisplaying)}
                          />
                        </Tooltip>
                      </div>
                    )
                  }
                  {
                    (item.orderTXStatus == 2 || item.orderTXStatus == 3)
                    && (
                      <div className={styles.date}>
                        退款狀態：
                        {this.renderRefundStatus(item)}
                      </div>
                    )
                  }
                  {
                    (item.orderTXStatus == 3 && item.violationRecord && depositeStatus == demandOrderTXStatus.depositeStatus.PAY) && item.orderNo
                    && (
                      <div className={`${styles.date} ${styles.invoice}`}>
                        發票號碼：
                        {item.orderNo}
                      </div>
                    )
                  }
                </div>
                <h3 className={styles.titleWrap}>
                  {
                    ((item.orderTXStatus == 1 || item.orderTXStatus == 2) && item.offDate == null && item.onlineDate) ? (
                      <a href={`/caseInfo?basicId=${item.basicId}&demandId=${item.demandId}`} className={styles.title}>
                        {title}
                      </a>
                    )
                      : (
                        <span className={styles.title}>{title}</span>
                      )
                  }
                  {this.renderMarginStatus(item)}
                  {
                    (item.orderTXStatus === demandOrderTXStatus.PUBLISH && item.onlineStatus === 2) && <Tag color="cyan">案件不公開</Tag>
                  }
                  {
                    (item.orderTXStatus === demandOrderTXStatus.PUBLISH && isWithin7Days) && (
                      <Tag color="red">7日內到期</Tag>
                    )
                  }
                </h3>
                <div className={styles.content}>
                  預算：
                  {priceType[unit] === '時薪' ? '時薪' : '論件計酬'}
                  {' '}
                  NT$
                  {' '}
                  {moneyFormat(minNum)}
                  {' '}
                  ~
                  {' '}
                  {moneyFormat(maxNum)}
                </div>
                <div className={styles.area}>
                  <Room />
                  <span className={styles.text}>{assignPlace !== null ? searchArea.des : '不指定'}</span>
                </div>
                {
                  item.educationalStage && (
                  <div className={styles.person}>
                    <Person />
                    <span className={styles.text}>{ targetData[item.educationalStage - 1].title }</span>
                  </div>
                  )
                }
                <div className={styles.content}>
                  內容：
                  <span className={styles.desc}>{desc}</span>
                </div>
                <div className={styles.tagWrap}>
                  <LocalOffer />
                  <span className={styles.tagText}>
                    {
                      item.demandCategory || item.demandCategory.length > 0
                        ? (this.showCatTags(item.demandCategory)) : '無'
                    }
                  </span>
                </div>
                {
                  item.confirmedTopper !== null && item.reviewedTopper !== null
                  && (
                    <div className={styles.footer}>
                      <div className={styles.blockWrap}>
                        <div className={styles.block}>
                          確認合作：
                          {
                            item.confirmedTopper.map(avatar => (
                              avatar.topperId ? (
                                <a key={avatar.topperId} title={avatar.topperName} href={`./profile/${avatar.topperId}`}>
                                  <Avatar alt={avatar.topperName} size={26} userImg={avatar.topperImg} />
                                </a>
                              ) : (
                                <span title="未公開"><Avatar size={26} userImg={avatar.topperImg} /></span>
                              )))
                          }
                        </div>
                        <div className={styles.block}>
                          完成評價：
                          {
                            item.reviewedTopper.map(avatar => (
                              avatar.topperId ? (
                                <a key={avatar.topperId} title={avatar.topperName} href={`./profile/${avatar.topperId}`}>
                                  <Avatar alt={avatar.topperName} size={26} userImg={avatar.topperImg} />
                                </a>
                              ) : (
                                <span title="未公開"><Avatar title="未公開" size={26} userImg={avatar.topperImg} /></span>
                              )))
                          }
                        </div>
                      </div>
                      <div className={styles.btnWrap}>
                        {
                          (item.orderTXStatus === demandOrderTXStatus.UNVERIFY || item.orderTXStatus === demandOrderTXStatus.PUBLISH) && (
                            <Button onClick={() => { this.props.chkActiveProcess(`/caseForm?demandId=${item.demandId}${concatDemandType}%26isNewDemand=yes`); }}>{republishForm.btnText}</Button>
                          )
                        }
                        {
                          item.orderTXStatus === demandOrderTXStatus.UNPUBLISH && (
                            <Button onClick={() => this.onDelInfo(item.demandId)}>刪除</Button>
                          )
                        }
                        {this.renderButtonStatus(item.orderTXStatus, item, searchArea)}
                        {
                          item.orderTXStatus === demandOrderTXStatus.PUBLISH && (
                            <ApplyClosedDemandModal
                              data={item}
                              onUpdateDemandList={this.props.onUpdateDemandList}
                            />
                          )
                        }
                        {
                          hasOpendDemand && (
                            <Button type="primary"><Link to={`/demand/candidate?demandId=${item.demandId}`}>人才管理</Link></Button>
                          )
                        }
                      </div>
                    </div>
                  )
                }
              </div>
            </BrowserView>
            <MobileView>
              <div className={`${styles.wrap} ${isViolation} ${styles.mobile}`}>
                <h3 className={styles.titleWrap}>
                  {
                    ((item.orderTXStatus == 1 || item.orderTXStatus == 2) && item.offDate == null && item.onlineDate) ? (
                      <a href={`/caseInfo?basicId=${item.basicId}&demandId=${item.demandId}`} className={styles.title}>
                        {title}
                      </a>
                    ) : title
                  }
                </h3>
                <div className={styles.dataWrap}>
                  <div className={styles.date}>
                    No：
                    { demandNo }
                  </div>
                  <div className={styles.date}>
                    刊登起訖日：
                    {item.onlineDate ? `${dayjs(item.onlineDate).format(dateFormat)} ~ ${getEndDate[item.orderTXStatus]}` : '尚未刊登'}
                  </div>
                  {
                    isShowPhoneDisplayTip && (
                      <div className={styles.date}>
                        開放電話聯繫：
                        <Tooltip title={phoneDisplayTip}>
                          <Switch
                            checked={phoneDisplaying}
                            disabled={!canChangPhoneDisplay}
                            checkedChildren="開啟"
                            unCheckedChildren="暫停"
                            onChange={() => changePhoneDisplay(item.demandId, !phoneDisplaying)}
                          />
                        </Tooltip>
                      </div>
                    )
                  }
                  {
                    (item.orderTXStatus == 0 || item.orderTXStatus == 1)
                    && <Icon className={styles.noViolation} type="down-circle" theme="filled" />
                  }
                  {this.changeIcon(item, num)}
                </div>
                <div className={`${styles.violationWrap} ${isShowViolation}`}>
                  {(item.orderTXStatus == 2 || item.orderTXStatus == 3)
                    && (
                      <div className={styles.date}>
                        退款狀態：
                        { this.renderRefundStatus(item)}
                      </div>
                    )}
                  {
                    (item.orderTXStatus == 3 && item.violationRecord && depositeStatus == demandOrderTXStatus.depositeStatus.PAY) && item.orderNo
                    && (
                      <div className={`${styles.date} ${styles.invoice}`}>
                        發票號碼：
                        {item.orderNo}
                      </div>
                    )
                  }
                </div>
                <div className={styles.tags}>
                  {this.renderMarginStatus(item)}
                  {(item.orderTXStatus === demandOrderTXStatus.PUBLISH && item.onlineStatus === 2) && <Tag color="cyan">案件不公開</Tag>}
                  {
                    (item.orderTXStatus === demandOrderTXStatus.PUBLISH && isWithin7Days) && (
                      <Tag color="red">7日內到期</Tag>
                    )
                  }
                </div>
                <div className={styles.content}>
                  預算：
                  {priceType[unit] === '時薪' ? '時薪' : '論件計酬'}
                  {' '}
                  NT$
                  {moneyFormat(minNum)}
                  {' '}
                  ~
                  {moneyFormat(maxNum)}
                </div>
                <div className={styles.area}>
                  <Room />
                  <span className={styles.text}>{assignPlace !== null ? searchArea.des : '不指定'}</span>
                </div>
                {
                  item.educationalStage && (
                  <div className={styles.person}>
                    <Person />
                    <span className={styles.text}>{ targetData[item.educationalStage - 1].title }</span>
                  </div>
                  )
                }
                <div className={styles.tagWrap}>
                  <LocalOffer />
                  <span className={styles.tagText}>
                    {item.demandCategory || item.demandCategory.length > 0
                      ? (this.showCatTags(item.demandCategory)) : '無'}
                  </span>
                </div>
                {item.confirmedTopper !== null && item.reviewedTopper !== null
                  && (
                    <div className={styles.footer}>
                      <div className={styles.blockWrap}>
                        <div className={styles.block}>
                          <div className={styles.label}>確認合作：</div>
                          <div className={styles.people}>
                            {item.confirmedTopper.map(avatar => (
                              avatar.topperId ? (
                                <a key={avatar.topperId} title={avatar.topperName} href={`./profile/${avatar.topperId}`}>
                                  <Avatar alt={avatar.topperName} size={26} userImg={avatar.topperImg} />
                                </a>
                              ) : (
                                <span title="未公開"><Avatar size={26} userImg={avatar.topperImg} /></span>
                              )
                            ))}
                          </div>
                        </div>
                        <div className={styles.block}>
                          <div className={styles.label}>完成評價：</div>
                          <div className={styles.people}>
                            {item.reviewedTopper.map(avatar => (
                              avatar.topperId ? (
                                <a key={avatar.topperId} title={avatar.topperName} href={`./profile/${avatar.topperId}`}>
                                  <Avatar alt={avatar.topperName} size={26} userImg={avatar.topperImg} />
                                </a>
                              ) : (
                                <span title="未公開"><Avatar size={26} userImg={avatar.topperImg} /></span>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className={styles.btnWrap}>
                        {
                          (item.orderTXStatus === demandOrderTXStatus.UNVERIFY || item.orderTXStatus === demandOrderTXStatus.PUBLISH) && (
                            <Button onClick={() => { this.props.chkActiveProcess(`/caseForm?demandId=${item.demandId}${concatDemandType}%26isNewDemand=yes`); }}>{republishForm.btnText}</Button>
                          )
                        }
                        {
                          item.orderTXStatus === demandOrderTXStatus.UNPUBLISH && (
                            <Button onClick={() => this.onDelInfo(item.demandId)}>刪除</Button>
                          )
                        }
                        {this.renderButtonStatus(item.orderTXStatus, item, searchArea)}
                        {item.orderTXStatus === demandOrderTXStatus.PUBLISH && (
                          <ApplyClosedDemandModal
                            data={item}
                            onUpdateDemandList={this.props.onUpdateDemandList}
                          />
                        )}
                        {
                          hasOpendDemand
                            ? (
                              <Button type="primary"><Link to={`/demand/candidate?demandId=${item.demandId}`}>人才管理</Link></Button>
                            )
                            : <></>
                        }
                      </div>
                    </div>
                  )}
              </div>
            </MobileView>
          </Fragment>
        );
      })
    );
  }
}

export default Card;
