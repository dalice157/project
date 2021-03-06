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
      const sexText = sex === sexes[0].value ? '??????' : '??????';
      const isOther = other || '???';
      const hasContactTime = contactTimeBegin !== null && contactTimeEnd !== null;
      const telNumber = telArea && tel ? `${telArea}-${tel}` : tel;
      const telNote = typeof telNumber === 'string' && telNumber.includes('*') && '??????????????????????????????';
      const cellphoneNote = typeof cellphone === 'string' && cellphone.includes('*') && '??????????????????????????????';
      this.onClose();
      Modal.info({
        icon: null,
        title: '???????????????',
        okText: '??????',
        okType: 'default',
        onOk: onClose,
        content: (
          <div className={styles.info}>
            <ul className={styles.list}>
              <li>
                ?????????
                {name}
                {sexText}
              </li>
              <li>
                Email???
                <a href={`mailto:${email}?subject=??????`}>{email}</a>
              </li>
              { hasContactTime ? (
                <li>
                  ??????????????????
                  {optionsToTable(tutorTimeList)[contactTimeBegin]}
                  ???
                  {optionsToTable(tutorTimeList)[contactTimeEnd]}
                </li>
              ) : null }
              <li>
                ???????????????
                <span>{telNumber || '???'}</span>
                <span className={styles.note}>{telNote}</span>
              </li>
              <li>
                ???????????????
                <span>{cellphone || '???'}</span>
                <span className={styles.note}>{cellphoneNote}</span>
              </li>
              <li>
                ?????????????????????
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
        <Button data-gtm-case="apply-submit" type="primary" htmlType="submit">???????????????</Button>
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
      apply: '????????????',
      freeTrial: '????????????',
      paid: '????????????',
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
              applyMode === -2 && ( // ????????????
              <>
                <div className={`${styles.wrap} ${styles.center}`}>
                  ??????????????????????????????????????????
                </div>
              </>
              )
            }
            {
              orderType === 1 && applyMode === -1 && ( // ???????????????????????????5000??????????????????
              <>
                <div className={styles.wrap}>
                  ???????????????????????????????????????
                  <br />
                  ????????????
                  <span className={styles.cashMember}>?????????????????????</span>
                  ?????????????????????
                  <span className={styles.cashMember}>???????????????????????????</span>
                  ???
                </div>
                <div className={styles.btnWrap}>
                  <Button data-gtm-case="??????????????????-??????" href="/publication-plan">???????????????</Button>
                  <Button type="primary" data-gtm-case="????????????-??????" href="/editProfile">????????????</Button>
                </div>
              </>
              )
            }
            {
              includesPaids.includes(orderType) && applyMode === -1 && ( // ??????????????????????????????5000??????????????????
                <>
                  <div className={styles.wrap}>
                    ???????????????????????????????????????
                    <br />
                    ????????????
                    <span className={styles.cashMember}>?????????????????????</span>
                    ?????????????????????
                    <span className={styles.cashMember}>???????????????????????????</span>
                    ???
                  </div>
                  <div className={styles.btnWrap}>
                    <Button data-gtm-case="??????????????????-??????" href="/publication-plan">???????????????</Button>
                    <Button type="primary" data-gtm-case="????????????-??????" href="/upgrade">????????????</Button>
                  </div>
                </>
              )
            }
            {
              applyMode === 0 && ( // ?????????
                <div className={styles.wrap}>
                  <h2 className={styles.choose}>???????????????????????????????????????</h2>
                  ??????????????????????????????????????????????????????????????????????????????????????????
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
              applyMode === 1 && ( // ???????????????
              <>
                <div className={styles.wrap}>
                  ??????????????????????????????????????????????????????
                  <br />
                  ?????????????????????????????????????????????????????????
                </div>
                <div className={styles.btnWrap}>
                  <Button type="primary" href="/join">????????????</Button>
                </div>
              </>
              )
            }
            {
              applyMode === 2 && ( // ??????????????????
                <>
                  <div className={`${styles.wrap} ${styles.center}`}>
                    ??????????????????????????????????????????
                  </div>
                  {
                    !limitContractCase && (
                      <>
                        <div className={`${styles.wrap}`}>
                          ??? ???????????????????????????????????????????????????????????????????????????????????????????????????
                          {
                            orderType === 1 && (
                              <>
                                ????????????
                                <span className={`${styles.frequency} ${styles.remain}`}>{available}</span>
                                ?????????????????????
                              </>
                            )
                          }
                          {
                            orderType === 1 && !available && (
                              <Link to="/publication-plan"><Button>??????????????????</Button></Link>
                            )
                          }
                        </div>
                        <div className={styles.btnWrap}>
                          <Button onClick={this.handleOk} disabled={orderType === 1 && !available}>???????????????</Button>
                          <Button type="primary" onClick={this.handleProfile} disabled={orderType === 1 && !available}>??????????????????</Button>
                        </div>
                      </>
                    )
                  }
                </>
              )
            }
            {
              applyMode === 3 && ( // ???????????????
                <>
                  <div className={styles.wrap}>
                    ??????????????????????????????????????????????????????????????????????????????
                  </div>
                  <div className={styles.btnWrap}>
                    <Button onClick={this.handleAgreeToCommunicate}>???????????????</Button>
                  </div>
                </>
              )
            }
            {
              (applyMode === 4 && rejector === 1) && ( // ????????????
                <div className={`${styles.wrap} ${styles.center}`}>
                  ????????????????????????????????????????????????!
                </div>
              )
            }
            {
              (applyMode === 4 && rejector === 2) && ( // ????????????
                <div className={`${styles.wrap} ${styles.center}`}>
                  ?????????????????????????????????????????????!
                </div>
              )
            }
            {
              applyMode === 5 && ( // ???????????????
                <>
                  <div className={styles.wrap}>
                    ??????????????????????????????????????????????????????????????????????????????
                  </div>
                  <div className={styles.btnWrap}>
                    <Button onClick={this.handleChatMeta}>???????????????</Button>
                    <Button type="primary" onClick={this.handleProfile}>??????????????????</Button>
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
