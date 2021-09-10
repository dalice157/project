import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
  Button, Modal,
} from 'antd';
import { Formik, Field } from 'formik';
import dayjs from 'dayjs';
import { optionsToTable } from '../../util/formatUtil';
import { sexes, tutorTimeList } from '../../config/selectData';
import config from '../../config/config';
import { chkActiveProcess } from '../../actions/common';
import {
  addApplier, doGetContacts, makeUpChatMeta, getGigData, loadBargainingPower,
} from '../../actions/cases';
import { agreeToCommunicate } from '../../actions/gigManage';
import CheckModel from './CheckModel';
import { validateApply } from '../../components/common_v2/Validates';

import styles from './ApplyButton.scss';

// Input feedback
const InputFeedback = ({ error }) => (error ? (
  <div className={styles.error}>
    { error }
  </div>
) : null);
// Radio input
const RadioButton = ({
  field: {
    name, onChange, onBlur,
  }, id, label, className, ...props
}) => (
  <div className={styles.radioStyle}>
    <input
      name={name}
      id={id}
      type="radio"
      value={id}
      onChange={onChange}
      onBlur={onBlur}
      className={styles.radio}
      {...props}
    />
    <label htmlFor={id}>
      { label }
    </label>
  </div>
);
// Radio group
const RadioButtonGroup = ({
  error, touched, label, children,
}) => (
  <div className={styles.input}>
    <fieldset>
      <legend>
        { label }
      </legend>
      { children }
      { touched && <InputFeedback error={error} /> }
    </fieldset>
  </div>
);

class ApplyButton extends Component {
  state = {
    visible: false,
    openImModel: false,
  }

  onClickApplyButton = () => {
    this.props.chkActiveProcess().then(() => this.onApplyDemand());
  }

  onApplyDemand = () => {
    const { demandId } = this.props;
    this.props.loadBargainingPower(demandId).then(() => {
      const { bargainingPower } = this.props;
      const { applyMode } = bargainingPower;
      if (applyMode === 0) {
        this.props.getGigData(demandId).then(() => this.setState({ visible: true }));
      } else {
        this.setState({ visible: true });
      }
    });
  }

  onClose = (doReload) => {
    this.setState({
      visible: false,
      openImModel: false,
    });
    if (doReload) {
      this.props.onClose();
    }
  }

  sendOnApply = (values) => {
    const gigId = values.radioGroup;
    const { basicId, demandId } = this.props;
    this.props.addApplier(basicId, demandId, gigId).then(() => {
      this.setState({
        visible: false,
        openImModel: true,
      });
    });
  }


  handleProfile = () => {
    const { demandId } = this.props;

    this.props.doGetContacts(demandId, false).then(() => {
      const { profileData, onClose } = this.props;
      const {
        name, cellphone, email, other, sex, tel, telArea, contactTimeBegin, contactTimeEnd,
      } = profileData;
      const sexText = sex === sexes[0].value ? '先生' : '小姐';
      const isOther = other || '無';
      const hasContactTime = contactTimeBegin !== null && contactTimeEnd !== null;
      const telNumber = telArea && tel ? `${telArea}-${tel}` : tel;
      const telNote = typeof telNumber === 'string' && telNumber.includes('*') && '案主暫不開放電話聯繫';
      const cellphoneNote = typeof cellphone === 'string' && cellphone.includes('*') && '案主暫不開放電話聯繫';
      this.onClose();
      Modal.info({
        icon: null,
        title: '聯絡人資料',
        okText: '關閉',
        okType: 'default',
        onOk: onClose,
        content: (
          <div className={styles.info}>
            <ul className={styles.list}>
              <li>
                姓名：
                {name}
                {sexText}
              </li>
              <li>
                Email：
                <a href={`mailto:${email}?subject=主旨`}>{email}</a>
              </li>
              { hasContactTime ? (
                <li>
                  可聯絡時間：
                  {optionsToTable(tutorTimeList)[contactTimeBegin]}
                  ～
                  {optionsToTable(tutorTimeList)[contactTimeEnd]}
                </li>
              ) : null }
              <li>
                室內電話：
                <span>{telNumber || '無'}</span>
                <span className={styles.note}>{telNote}</span>
              </li>
              <li>
                行動電話：
                <span>{cellphone || '無'}</span>
                <span className={styles.note}>{cellphoneNote}</span>
              </li>
              <li>
                其他聯絡方式：
                {isOther}
              </li>
            </ul>
          </div>
        ),
      });
    });
  }

  handleOk = () => {
    const { basicId, demandId, history } = this.props;
    this.props.doGetContacts(demandId, true).then(() => {
      this.onClose();
      history.push(`/chat?demanderId=${basicId}`);
    });
  }

  handleChatMeta = () => {
    const { demandId, basicId, history } = this.props;
    this.onClose();
    this.props.makeUpChatMeta(demandId).then(() => {
      history.push(`/chat?demanderId=${basicId}`);
    });
  }

  handleAgreeToCommunicate = () => {
    const { demandId, basicId, history } = this.props;
    this.onClose();
    this.props.agreeToCommunicate(demandId, basicId).then(() => {
      history.push(`/chat?demanderId=${basicId}`);
    });
  }


  renderForm = props => (
    <form onSubmit={props.handleSubmit}>
      <RadioButtonGroup
        id="radioGroup"
        label=""
        value={props.values.radioGroup}
        error={props.errors.radioGroup}
        touched={props.touched.radioGroup}
      >
        {
            this.props.gigData && this.props.gigData.map(item => (
              <Field
                key={item.gigId}
                component={RadioButton}
                name="radioGroup"
                id={item.gigId}
                label={item.title}
              />
            ))
          }
      </RadioButtonGroup>
      <div className={styles.btnWrap}>
        <Button data-gtm-case="apply-submit" type="primary" htmlType="submit">發送應徵信</Button>
      </div>
    </form>

  )

  render() {
    const { visible, openImModel } = this.state;
    const { getAppliedText, bargainingPower } = this.props;
    const {
      used, capacity, usedCnt, applyMode, orderType, rejector, limitContractCase,
    } = bargainingPower;
    const available = !used && orderType === 1 ? capacity - usedCnt : 0;
    const includesApplys = [0, 1, 3, 5];
    const includesPaids = [3, 4];
    const showTitle = {
      apply: '我要應徵',
      freeTrial: '會員升級',
      paid: '會員升級',
    };

    const modelTitleName = () => {
      if (includesApplys.includes(applyMode)) {
        return showTitle.apply;
      } else if (applyMode === 2) {
        return null;
      } else if (orderType === 1 && applyMode === -1) {
        return showTitle.freeTrial;
      } else if (includesPaids.includes(orderType) && applyMode === -1) {
        return showTitle.paid;
      }
      return false;
    };
    return (
      <>
        <>
          <Button
            onClick={this.onClickApplyButton}
            type="primary"
            data-gtm-case="apply"
          >
            {getAppliedText}
          </Button>
          <Modal
            title={modelTitleName()}
            onCancel={this.onClose}
            maskClosable={false}
            visible={visible}
            centered
            footer={null}
            data-gtm-case="apply"
          >
            {
              applyMode === -2 && ( // 案主本人
              <>
                <div className={`${styles.wrap} ${styles.center}`}>
                  此為您發佈的案件，無法應徵。
                </div>
              </>
              )
            }
            {
              orderType === 1 && applyMode === -1 && ( // 體驗刊登的會員，且5000元以上的案件
              <>
                <div className={styles.wrap}>
                  此為『無限型方案專屬案件』
                  <br />
                  升級成為
                  <span className={styles.cashMember}>無限型方案會員</span>
                  ，主動聯絡立即
                  <span className={styles.cashMember}>提升６０％成交機會</span>
                  ！
                </div>
                <div className={styles.btnWrap}>
                  <Button data-gtm-case="查看權益比較-體驗" href="/publication-plan">看權益比較</Button>
                  <Button type="primary" data-gtm-case="立即升級-體驗" href="/editProfile">立即升級</Button>
                </div>
              </>
              )
            }
            {
              includesPaids.includes(orderType) && applyMode === -1 && ( // 超值方案刊登會員，且5000元以上的案件
                <>
                  <div className={styles.wrap}>
                    此為『無限型方案專屬案件』
                    <br />
                    升級成為
                    <span className={styles.cashMember}>無限型方案會員</span>
                    ，主動聯絡立即
                    <span className={styles.cashMember}>提升６０％成交機會</span>
                    ！
                  </div>
                  <div className={styles.btnWrap}>
                    <Button data-gtm-case="查看權益比較-超值" href="/publication-plan">看權益比較</Button>
                    <Button type="primary" data-gtm-case="立即升級-超值" href="/upgrade">立即升級</Button>
                  </div>
                </>
              )
            }
            {
              applyMode === 0 && ( // 可應徵
                <div className={styles.wrap}>
                  <h2 className={styles.choose}>選擇應徵本需求之服務項目：</h2>
                  系統將會發送應徵通知信給案主，提供給案主參考的服務項目介紹。
                  <Formik
                    onSubmit={(values, actions) => {
                      setTimeout(() => {
                        this.sendOnApply(values);
                        actions.setSubmitting(false);
                      }, 500);
                    }}
                    initialValues={{ radioGroup: '' }}
                    validationSchema={validateApply}
                    render={this.renderForm}
                  />
                </div>
              )
            }
            {
              applyMode === 1 && ( // 服務未發佈
              <>
                <div className={styles.wrap}>
                  完成發佈高手接案檔案，才可應徵案件。
                  <br />
                  立即成為高手，編輯發佈你的高手檔案吧！
                </div>
                <div className={styles.btnWrap}>
                  <Button type="primary" href="/join">成為高手</Button>
                </div>
              </>
              )
            }
            {
              applyMode === 2 && ( // 當日已應徵過
                <>
                  <div className={`${styles.wrap} ${styles.center}`}>
                    今日已應徵過，無法再次應徵。
                  </div>
                  {
                    !limitContractCase && (
                      <>
                        <div className={`${styles.wrap}`}>
                          或 您可以點擊【開啟聊天室】或【查閱聯絡資料】，直接與案件聯絡人溝通。
                          {
                            orderType === 1 && (
                              <>
                                本周尚餘
                                <span className={`${styles.frequency} ${styles.remain}`}>{available}</span>
                                次主動聯絡機會
                              </>
                            )
                          }
                          {
                            orderType === 1 && !available && (
                              <Link to="/publication-plan"><Button>想要更多機會</Button></Link>
                            )
                          }
                        </div>
                        <div className={styles.btnWrap}>
                          <Button onClick={this.handleOk} disabled={orderType === 1 && !available}>開啟聊天室</Button>
                          <Button type="primary" onClick={this.handleProfile} disabled={orderType === 1 && !available}>查閱聯絡資料</Button>
                        </div>
                      </>
                    )
                  }
                </>
              )
            }
            {
              applyMode === 3 && ( // 案主已邀請
                <>
                  <div className={styles.wrap}>
                    此案件已發邀請通知給您，請立即前往聊天室與案主溝通。
                  </div>
                  <div className={styles.btnWrap}>
                    <Button onClick={this.handleAgreeToCommunicate}>開啟聊天室</Button>
                  </div>
                </>
              )
            }
            {
              (applyMode === 4 && rejector === 1) && ( // 案主拒絕
                <div className={`${styles.wrap} ${styles.center}`}>
                  案主已捥拒合作，無法再應徵此案件!
                </div>
              )
            }
            {
              (applyMode === 4 && rejector === 2) && ( // 高手拒絕
                <div className={`${styles.wrap} ${styles.center}`}>
                  您已捥拒合作，無法再應徵此案件!
                </div>
              )
            }
            {
              applyMode === 5 && ( // 已進入溝通
                <>
                  <div className={styles.wrap}>
                    此案件已進入溝通，請立即前往聊天室，查看進行中列表。
                  </div>
                  <div className={styles.btnWrap}>
                    <Button onClick={this.handleChatMeta}>前往聊天室</Button>
                    <Button type="primary" onClick={this.handleProfile}>查看聯絡資料</Button>
                  </div>
                </>
              )
            }
          </Modal>
        </>
        <CheckModel
          openImModel={openImModel}
          bargainingPower={bargainingPower}
          handleProfile={this.handleProfile}
          handleOk={this.handleOk}
          handleChatMeta={this.handleChatMeta}
          onClose={this.onClose}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  gigData: state.cases.gig,
  profileData: state.cases.contactsData.demandContact,
  bargainingPower: state.cases.bargainingPower,
  loading: state.cases.isContactsLoading,
  paidPlanInfo: state.basic.paidPlanInfo,
});

const mapDispatchToProps = {
  loadBargainingPower,
  addApplier,
  getGigData,
  chkActiveProcess,
  doGetContacts,
  makeUpChatMeta,
  agreeToCommunicate,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ApplyButton));
