import React, { Component } from 'react';
import {
  Spin, Icon, Modal, Rate, message, Button,
} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import { Formik, Field, ErrorMessage } from 'formik';
import {
  Input, Radio, Checkbox,
} from 'formik-antd';
import { stepIterator } from '../../util/editStepUtil';
import { catSearch } from '../../util/categoryUtils';
import { invoiceTypeOpts, edmTypeOpts, profileSourceList } from '../../config/selectData';
import { error as sysError } from '../../util/messageUtil.js';

import config from '../../config/config';
import {
  loadUserInfo, loadDefaultProfile, loadCaseDeal, getPayInfoV2, sendPaymentOrder, chargeTopperFree, loadTestUser, checkInvoice, getAvailableOnDemands,
} from '../../actions/basic';
import {
  loadStaticArea, sendVerifySMS, sendVerifyCellphone,
} from '../../actions/common';
import { validateEditProfileToPaid, validateEditProfileToChange } from '../../util/yupUtil';
import { isCellphone } from '../../util/commonUtil';
import icon1 from '../../img/common_v2/icon-payment-3.svg';
import { productsDesc } from '../../config/constant';

import ScrollToError from '../common_v2/ScrollToError';
import Step from '../../components/ui/step';
import styles from './EditProfile.scss';
import TerminateModal from '../../components/terminateModal';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postNum: '',
      areaDesc: '',
      areaNo: '',
      countSentSMS: 0,
      certificateCellphone: null,
      loading: false,
      btnLoading: false,
      productNo: '',
    };
  }

  async componentDidMount() {
    this.props.loadTestUser();
    this.initializeProfile();
  }

  initializeProfile = () => {
    this.setState({
      loading: true,
    });
    this.props.initUser();
    this.props.loadStaticArea().then(() => {
      this.props.loadDefaultProfile().then(() => {
        const { postNum } = this.props.payInfoData;
        const area = this.props.areaData;
        const searchArea = postNum && postNum !== null && postNum.length > 0 ? catSearch(area, postNum) : '';
        this.setState({
          postNum: searchArea,
          areaDesc: searchArea.des,
          areaNo: searchArea.no,
          loading: false,
        });
      });
    });
    this.props.loadCaseDeal();
    this.props.getAvailableOnDemands();
    this.props.getPayInfoV2().then((response) => {
      if (response.error) {
        message.warning('????????????????????????????????????????????????????????????????????????????????????!');
        setTimeout(() => {
          this.props.history.push('/topper-dashboard/home');
        }, 2000);
      }
    });
  }

  onFormSubmit = (values, actions) => {
    const {
      cellphone, captcha, carrierCode, carrierType, address, invoiceNum, acName, companyName, invoiceType, postNum, productNo, subscriptions, outsourceEvaluation, tutorEvaluation, email,
    } = values;
    const { certificateCellphone } = this.state;
    const {
      verifySMS, defaultProfileData, user, payInfoData, location,
    } = this.props;
    const {
      cellphoneRecord, emailInfo, code, toEasypay,
    } = defaultProfileData;
    const { planType } = payInfoData;
    const {
      certificate,
      frequency,
      cellphone: cellphoneVal,
    } = cellphoneRecord;
    const { meta: { credit, deposit, tutorRemainingPoint } } = user;
    const isSmsSent = (verifySMS.success && verifySMS.success == true) || (frequency > 0);
    const isPhoneVerify = (certificateCellphone == cellphone) || (cellphoneVal == cellphone && certificate);
    if (emailInfo.isVerified == 'false' && certificate == false && !isSmsSent) {
      sysError('has-verified-contact');
      return;
    }

    if (isSmsSent && !isPhoneVerify && (captcha != '' && captcha != undefined)) {
      this.props.loadSendVerifyCellphone(cellphone, captcha).then((res) => {
        actions.setSubmitting(false);
        if (res.payload?.success) {
          this.setState({
            certificateCellphone: cellphone,
          });
        }
        Modal.info({
          content: (
            <div className={styles.content}>
              ?????????????????????????????????????????????
            </div>
          ),
        });
      });
      return;
    } else if (!isSmsSent && !isPhoneVerify && emailInfo.isVerified == 'false') {
      Modal.info({
        content: (
          <div className={styles.content}>
            ????????????????????????
          </div>
        ),
      });
    } else if (isSmsSent && !isPhoneVerify && emailInfo.isVerified == 'false' && (captcha == '' || captcha == undefined) && (cellphone !== '' || cellphone !== undefined || cellphone !== null)) {
      Modal.info({
        content: (
          <div className={styles.content}>
            ?????????????????????????????????
          </div>
        ),
      });
    }
    const allowPublish = (isPhoneVerify || emailInfo.isVerified == 'true');
    const addr = postNum.des + address;
    const isTitle = invoiceType == '3' ? companyName : acName;
    let sourceList = [];
    sourceList = outsourceEvaluation ? [...sourceList, profileSourceList.case] : sourceList;
    sourceList = tutorEvaluation ? [...sourceList, profileSourceList.tutor] : sourceList;
    let queryTypeVal = '';
    const memberType = {
      new: 'memberType=new',
      trial: 'memberType=trial',
      paid: 'memberType=paid',
    };
    if (location.query.type) {
      queryTypeVal = `&type=${location.query.type}&${memberType[location.query.memberType]}`;
    }

    let dto = {
      productNo,
      carrierCode,
      carrierType,
      sourceList,
      subscriptions,
      plan: planType,
      invoiceAddress: addr || '',
      invoiceNum: invoiceNum || '',
      invoiceTitle: isTitle || '',
      invoiceType: invoiceType || '',
      postNum: postNum.no,
    };

    const inputActiveTopperData = {
      sourceList,
      subscriptions,
      toEasypay,
      code: code || '',
      emailInfo: {
        email,
      },
      cellphoneRecord: {
        cellphone,
      },
    };

    console.log('dto:', dto);
    console.log('inputActiveTopperData:', inputActiveTopperData);
    console.log('queryTypeVal:', queryTypeVal);

    if (allowPublish && ((credit !== 1 || !deposit) || (credit == 1 || deposit)) && tutorRemainingPoint == 0 && !location.query.type && productNo !== 'freeTrial') { // ?????????
      if (invoiceType === '3') {
        this.props.checkInvoice(dto).then((res) => {
          const title = res.payload && res.payload.response && res.payload.response.error;
          if (title === 'vatNo check error!') {
            message.error('??????????????????');
          } else if (title) {
            Modal.confirm({
              title: '??????????????????',
              content: `???????????????????????????104?????????????????????????????????????????? ${title} ?????????????????? ????????????????????????????????????????????????????????????????????????`,
              okText: '??????',
              cancelText: '????????????',
              onOk: () => {
                dto = {
                  ...dto,
                  invoiceTitle: title,
                };
                this.props.sendPaymentOrder(dto).then(() => {
                  actions.setSubmitting(false);
                  if (this.props.location.query.checkOk == 'true') {
                    // ????????????
                    this.props.history.push('/payment?checkOk=true');
                  } else {
                    this.props.history.push('/payment');
                  }
                });
              },
              onCancel: () => {
              },
            });
          } else {
            this.props.sendPaymentOrder(dto).then(() => {
              actions.setSubmitting(false);
              if (this.props.location.query.checkOk == 'true') {
                this.props.history.push('/payment?checkOk=true');
              } else {
                this.props.history.push('/payment');
              }
            });
          }
        });
      } else {
        this.props.sendPaymentOrder(dto).then(() => {
          actions.setSubmitting(false);
          if (this.props.location.query.checkOk == 'true') {
            this.props.history.push('/payment?checkOk=true');
          } else {
            this.props.history.push('/payment');
          }
        });
      }
    } else if (location.query.type && productNo !== 'freeTrial') {
      if (!allowPublish && location.query.memberType === 'new') {
        Modal.info({
          content: (
            <div className={styles.content}>
              ????????????????????????????????????????????????
            </div>
          ),
        });
      }
      this.props.sendPaymentOrder(dto).then(() => {
        if (this.props.location.query.checkOk == 'true') {
          actions.setSubmitting(false);
          this.props.history.push('/success?caseVip=success&checkOk=true');
        } else {
          this.props.history.push(`/success?caseVip=success${queryTypeVal}`);
        }
      });
    } else if (allowPublish && productNo === 'freeTrial') {
      this.props.chargeTopperFree(inputActiveTopperData).then(() => {
        actions.setSubmitting(false);
        if (this.props.location.query.checkOk == 'true') {
          this.props.history.push('/success?newFree=success&checkOk=true');
        } else {
          this.props.history.push(`/success?newFree=success${queryTypeVal}`);
        }
      });
    } else {
      Modal.info({
        content: (
          <div className={styles.content}>
            ????????????????????????????????????????????????
          </div>
        ),
      });
    }
  }

  onAreaClick = () => {
    const no = this.state.areaNo || '???????????????';
    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '????????????',
        maxSelectedNumber: 1,
        selectedItems: [{ no }],
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        unselectableList: '6[0-9]{6}000',
        onSubmit: ({ selectedItems }) => {
          const item = selectedItems[0];
          if (!item) {
            this.setState({ areaDesc: '', areaNo: '' });
          } else {
            this.setState({ areaDesc: item.des, areaNo: item.no });
            // validateField('postNum');
          }
        },
      });
    }
  }

  handleCellphoneChange = setFieldValue => (e) => {
    const cellphone = e.target.value;
    setFieldValue('cellphone', cellphone);
  }

  onSendSMS = async (cellphone) => {
    const {
      countSentSMS,
      certificateCellphone,
    } = this.state;
    const {
      cellphone: prevCellphone,
      certificate,
      frequency,
    } = this.props.defaultProfileData.cellphoneRecord;
    const isCellphoneCertificate = (cellphone === prevCellphone && certificate) || (cellphone === certificateCellphone);
    const totalFrequency = countSentSMS + frequency;
    this.setState({
      btnLoading: true,
    });
    if (totalFrequency > 3) {
      this.setState({
        btnLoading: false,
      });
      Modal.info({
        content: (
          <div className={styles.content}>
            ?????????????????????????????????????????????????????????
            <br />
            ?????????????????????(02)29126104#8333????????????
            <a href="mailto:104top@104.com.tw">104top@104.com.tw</a>
          </div>
        ),
      });
    } else if (!isCellphoneCertificate && isCellphone(cellphone)) {
      const verifySMS = await this.props.loadSendVerifySMS(cellphone);
      if (verifySMS.payload?.success) {
        Modal.info({
          content: (
            <div className={styles.content}>
              ????????????????????????????????????????????????????????????????????????
            </div>
          ),
        });
        this.setState({
          countSentSMS: (this.state.countSentSMS + 1),
        });
      }
      this.setState({
        btnLoading: false,
      });
    }
  }

  onProductNoChange = (e) => {
    console.log('e:', e);
    this.setState({
      productNo: e.target.value,
    });
  }

  renderPayChooseV2 = (cardData, title) => {
    const { user, payInfoData } = this.props;
    const { tutorRemainingPoint } = user.meta;
    const { experiencePlan } = payInfoData;
    const renderPayInfo = cardData.filter(item => item.title.match(title)).sort((nextObj, prevObj) => nextObj.contentQuantity - prevObj.contentQuantity);
    return (
      <>
        {
          renderPayInfo.map((card) => {
            const {
              average, contentQuantity, price, productUnit, selectValue, productAmount,
            } = card;
            const { location } = this.props;
            const isQueryType = location.query.type;
            const getPrice = (location.query.type === 'tutor' || card.discount === 0.9) ? productAmount : price;
            const isDisabled = tutorRemainingPoint === 0 && experiencePlan && location.query.type === 'tutor';
            const isMobileStyle = uaIsMobile() ? styles.mobile : '';
            const isDiscountPriceStyle = card.discount === 0.9 ? styles.discountPrice : '';
            return (
              <li key={card.selectValue} className={styles.table}>
                <div className={styles.priceItem}>
                  <Radio name="productNo" disabled={isDisabled} className={styles.radioBlock} value={selectValue} />
                  {!isQueryType && (
                    <div className={styles.priceWrap}>
                      <span className={`${styles.price} ${isDiscountPriceStyle}`}>
                        $
                        {getPrice}
                      </span>
                      ???
                      {contentQuantity}
                      {productUnit}
                      <div className={styles.priceSmall}>
                        ??????????????? $
                        {average}
                      </div>
                    </div>
                  )
                  }
                  {
                    card.discount === 0.9 && (
                      <div className={`${styles.discount} ${isMobileStyle}`}>
                        <span className={styles.small}>9???</span>
                        $
                        {price}
                      </div>
                    )
                  }
                  {
                    isQueryType && location.query.type === 'outsource' && (
                      <div className={`${styles.priceWrap} ${styles.outsource}`}>
                        ????????????
                        {' '}
                        <span className={styles.price}>{getPrice}</span>
                        {' '}
                        {productUnit}
                      </div>
                    )
                  }
                  {
                    isQueryType && location.query.type === 'tutor' && (
                      <div className={`${styles.priceWrap} ${styles.tutor}`}>
                        <div className={styles.priceInfo}>
                          <span className={styles.price}>
                            $
                            {getPrice}
                          </span>
                          ???
                          {contentQuantity}
                          {productUnit}
                        </div>
                        <div className={styles.freeChange}>????????????</div>
                      </div>
                    )
                  }
                </div>
              </li>
            );
          })
        }
      </>
    );
  }

  modalContext = (
    <>
      <p>
        1. 2021???10???1???(???)????????????????????? ?????????NT$399/60???????????????NT$1980/60??? ??????????????????
        <br />
        2. ?????????????????????????????????
      </p>
      <br />
      <p>???????????????????????????????????????????????????????????????</p>
    </>
  )

  renderForm = (props) => {
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    const productMap = config.products.json;
    const { btnLoading } = this.state;
    const { query } = this.props.location;
    const {
      userStatus, user, testUser, payInfoData,
    } = this.props;
    const {
      data: caseDealData,
      showDealInfo,
    } = this.props.caseDeal;
    const { meta } = user;

    const {
      handleSubmit, values, errors, isSubmitting,
    } = props;
    const { experiencePlan } = this.props.payInfoData;
    const { emailInfo, cellphoneRecord } = this.props.defaultProfileData;
    const { cellphone: prevCellphone, certificate, frequency } = cellphoneRecord;
    const isCellphoneCertificate = values.cellphone === prevCellphone && certificate;
    const { allDemandCount, outsourceDemandCount, tutorDemandCount } = this.props.availableOnDemands;
    const {
      countSentSMS,
    } = this.state;
    console.log('errors:', errors);
    const totalFrequency = countSentSMS + frequency;
    const renderPhone = (
      <>
        <div className={`${styles.formItem} ${isMobileStyle}`}>
          <label className={styles.label}>
            <span className={styles.required}>*</span>
            {' '}
            ?????????????????????
          </label>
          <div className={styles.formControl}>
            <Input
              name="captcha"
              className={styles.addr}
              size="large"
              placeholder="??????????????????"
            />
          </div>
        </div>
        <ErrorMessage name="captcha">
          {msg => <div className={styles.error}>{msg}</div>}
        </ErrorMessage>
      </>
    );
    const phoneValidate = () => {
      if (!isCellphoneCertificate && totalFrequency > 0) {
        return renderPhone;
      }
    };
    const isExperience = meta.credit == 1 || meta.deposit;

    const isStepCurrent = () => {
      if (values.productNo === 'freeTrial') {
        return 2;
      }
      if (location.query.type) {
        if (location.query.memberType === 'new') { // ?????????
          return 2;
        }
        if (location.query.memberType === 'trial' || location.query.memberType === 'paid') {
          return 0; // ?????????????????????
        }
      }
      if (userStatus == 2 && (meta.topperInPaymentPeriod || (meta.credit == 1 || meta.deposit)) && meta.tutorRemainingPoint > 0) {
        return 0;
      }
      if (userStatus == 2 && (meta.topperInPaymentPeriod || (meta.credit == 1 || meta.deposit)) && meta.tutorRemainingPoint == 0) {
        return 0;
      }
      if (userStatus != 2 && (meta.credit != 1 || !meta.deposit) && ((meta.tutorRemainingPoint == 0) || (meta.tutorRemainingPoint > 0))) {
        return 2;
      }
      if (userStatus != 2 && ((meta.credit != 1 || !meta.deposit) && meta.tutorRemainingPoint == 0 && !meta.topperInPaymentPeriod)) {
        return 2;
      }
    };
    const { location } = this.props;
    const isQueryType = location.query.type;
    const cardData = [];
    if (payInfoData) {
      const { planType, planOption, discount } = payInfoData;
      const cardArr = Object.keys(planOption);
      cardArr.map((item) => {
        const card = productMap[planType][item];
        card.price = planOption[item];
        card.average = Math.round((card.price / card.contentQuantity) * 30);
        card.selectValue = item;
        card.discount = discount;
        return cardData.push(card);
      });
    }
    let queryTypeVal = '';
    if (location.query.type) {
      queryTypeVal = `?type=${location.query.type}&memberType=new`;
    } else if (location.query.publish) {
      queryTypeVal = '?publish=success';
    }
    const cardDataSort = cardData.sort((nextObj, prevObj) => nextObj.contentQuantity - prevObj.contentQuantity);
    const set = new Set();
    const renderCard = cardDataSort.filter(item => (!set.has(item.title) ? set.add(item.title) : false));
    // console.log('renderCard:', renderCard);
    return (
      <form onSubmit={handleSubmit}>
        <ScrollToError {...props} />
        <h2 className={styles.title}>
          ??????????????????
          <Link className={styles.btn} target="_blank" to="/publication-plan">
            <Button type="primary">
              ?????????????????????
            </Button>
          </Link>
        </h2>
        <div className={`${styles.block} ${styles.noBorder} ${isMobileStyle}`}>
          <Radio.Group name="productNo" onChange={this.onProductNoChange}>
            {/* {
              payInfoData && payInfoData.experiencePlan && (
                <div className={`${styles.chooseWrap} ${styles.freeTrial} ${isMobileStyle}`}>
                  <div className={styles.header}>
                    <img src={icon1} alt="????????????" />
                    <div className={styles.textBlock}>
                      <h3 className={styles.title}>????????????</h3>
                      <div className={styles.depiction}>
                        {productsDesc.freeTrial}
                      </div>
                    </div>
                  </div>
                  <div className={styles.acceptable}>
                    ???????????? &nbsp; ?????????
                    {' '}
                    <span className={styles.number}>{outsourceDemandCount}</span>
                    {' '}
                    ???????????????
                    {' '}
                    <span className={styles.number}>{tutorDemandCount}</span>
                    {' '}
                    ???
                  </div>
                  <ul>
                    <li className={styles.table}>
                      <div className={styles.priceItem}>
                        <Radio name="productNo" className={styles.radioBlock} value="freeTrial" />
                        <div className={styles.priceWrap}>
                          <span className={styles.price}>$0</span>
                          ???30???
                          <div className={styles.newMemberPs}>?????????????????????????????????????????????1??????</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              )
            } */}
            {
              renderCard.map(item => (
                <div className={`${styles.chooseWrap} ${isMobileStyle}`}>
                  <div className={styles.header}>
                    <img src={item.img} alt={item.title} />
                    <div className={styles.textBlock}>
                      <h3 className={styles.title}>{item.title}</h3>
                      <div className={styles.depiction}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {
                    (item.title).includes('?????????') ? (
                      <div className={styles.acceptable}>
                        ???????????? &nbsp;???
                        {' '}
                        <span className={styles.number}>{allDemandCount}</span>
                        {' '}
                        ???
                      </div>
                    ) : (
                      <div className={styles.acceptable}>
                        ???????????? &nbsp; ?????????
                        {' '}
                        <span className={styles.number}>{outsourceDemandCount}</span>
                        {' '}
                        ???????????????
                        {' '}
                        <span className={styles.number}>{tutorDemandCount}</span>
                        {' '}
                        ???
                      </div>
                    )
                  }
                  {/* <ul>
                    {
                      this.renderPayChooseV2(cardDataSort, item.title)
                    }
                  </ul> */}
                </div>
              ))
            }
          </Radio.Group>
          <ErrorMessage name="productNo">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
        </div>
        <h2 className={styles.title}>??????????????????</h2>
        <div className={styles.block}>
          <div className={`${styles.formItem} ${isMobileStyle}`}>
            <label className={styles.label}>
              <span className={styles.required}>*</span>
              {' '}
              ????????????
            </label>
            <div className={styles.formControl}>
              {
                emailInfo.isVerified == 'true' && (
                  <>
                    {emailInfo.email}
                    <span className={styles.checkIcon}><Icon type="check-circle" theme="filled" /></span>
                  </>
                )
              }
              {
                emailInfo.isVerified == 'false' && (
                  <Input
                    name="email"
                    className={styles.addr}
                    disabled
                    size="large"
                    placeholder="?????????????????????"
                  />
                )
              }
            </div>
          </div>
          <div className={`${styles.formItem} ${isMobileStyle}`}>
            <label className={styles.label}>
              <span className={styles.required}>*</span>
              {' '}
              ????????????
            </label>
            <div className={styles.formControl}>
              <Input className={styles.addr} name="cellphone" size="large" placeholder="?????????????????????" />
              <Input name="originCellphone" type="hidden" />
              {
                isCellphoneCertificate && <span className={styles.checkIcon}><Icon type="check-circle" theme="filled" /></span>
              }
              {!isCellphoneCertificate && <Button type="primary" loading={btnLoading} onClick={() => this.onSendSMS(values.cellphone)}>???????????????</Button>}
            </div>
          </div>
          <ErrorMessage name="cellphone">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
          {phoneValidate()}
        </div>
        {
          meta && (isExperience || !isExperience) && meta.tutorRemainingPoint == 0 && !isQueryType && (!experiencePlan || (experiencePlan && values.productNo !== 'freeTrial')) && (
            <>
              <h2 className={styles.title}>??????????????????</h2>
              <div className={styles.block}>
                <div className={`${styles.formItem} ${isMobileStyle}`}>
                  <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    {' '}
                    ????????????
                  </label>
                  <div className={styles.formControl}>
                    <Radio.Group name="invoiceType" options={invoiceTypeOpts} />
                  </div>
                </div>
                <ErrorMessage name="invoiceType">
                  {msg => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
                {
                  values.invoiceType === invoiceTypeOpts[0].value && (
                    <>
                      <div className={`${styles.formItem} ${styles.alignItem} ${isMobileStyle}`}>
                        <label className={styles.label}>
                          <span className={styles.required}>*</span>
                          {' '}
                          ??????????????????
                        </label>
                        <div className={`${styles.formControl} ${styles.mflag}`}>
                          <Radio.Group name="carrierType">
                            <Radio className={styles.radioBlock} value="9">104???????????????104???????????????????????????????????????</Radio>
                            <Radio className={styles.radioBlock} value="4">
                              ??????????????????
                              <Input disabled={values.carrierType === '4' ? '' : 'disabled'} name="carrierCode" className={styles.input} size="large" />
                              {' '}
                              ??????
                              {' '}
                              <a href="https://www.einvoice.nat.gov.tw/APMEMBERVAN/GeneralCarrier/generalCarrier" target="_blank">???????????????</a>
                            </Radio>
                            <ErrorMessage name="carrierCode">
                              {msg => <div className={styles.error}>{msg}</div>}
                            </ErrorMessage>
                            <Radio className={styles.radioBlock} value="5">????????????????????????</Radio>
                          </Radio.Group>
                        </div>
                      </div>
                      <div className={`${styles.formItem} ${isMobileStyle}`}>
                        <label className={styles.label}>
                          <span className={styles.required}>*</span>
                          {' '}
                          ????????????
                        </label>
                        <div className={styles.formControl}>
                          <Input className={styles.input} name="acName" size="large" />
                        </div>
                      </div>
                      <ErrorMessage name="acName">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                      <div className={`${styles.formItem} ${isMobileStyle} ${styles.addr}`}>
                        <label className={styles.label}>
                          <span className={styles.required}>*</span>
                          {' '}
                          ????????????
                        </label>
                        <div className={styles.formControl}>
                          <Field
                            name="postNum"
                            render={({ field }) => {
                              values.postNum = {
                                des: this.state.areaDesc,
                                no: this.state.areaNo,
                              };
                              return (
                                <div {...field} className={styles.county} onClick={() => this.onAreaClick()}>
                                  {this.state.areaDesc || '???????????????'}
                                  <Icon type="down" />
                                </div>
                              );
                            }}
                          />
                          <Input
                            name="address"
                            className={styles.addr}
                            size="large"
                          />
                        </div>
                      </div>
                      <ErrorMessage name="postNum.des">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                      <ErrorMessage name="address">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                    </>
                  )
                }
                {
                  values.invoiceType === invoiceTypeOpts[1].value && (
                    <>
                      <div className={`${styles.formItem} ${isMobileStyle}`}>
                        <label className={styles.label}>
                          <span className={styles.required}>*</span>
                          {' '}
                          ????????????
                        </label>
                        <div className={styles.formControl}>
                          <Input
                            name="invoiceNum"
                            className={styles.input}
                            size="large"
                            placeholder="?????????????????????"
                          />
                        </div>
                      </div>
                      <ErrorMessage name="invoiceNum">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                      <div className={`${styles.formItem} ${isMobileStyle}`}>
                        <label className={styles.label}>
                          <span className={styles.required}>*</span>
                          {' '}
                          ????????????
                        </label>
                        <div className={styles.formControl}>
                          <Input
                            name="companyName"
                            className={styles.input}
                            size="large"
                            placeholder="?????????????????????"
                          />
                        </div>
                      </div>
                      <ErrorMessage name="companyName">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                      <div className={`${styles.formItem} ${isMobileStyle} ${styles.addr}`}>
                        <label className={styles.label}>
                          <span className={styles.required}>*</span>
                          {' '}
                          ????????????
                        </label>
                        <div className={`${styles.formControl} ${styles.flex}`}>
                          <Field
                            name="postNum"
                            render={({ field }) => {
                              values.postNum = {
                                des: this.state.areaDesc,
                                no: this.state.areaNo,
                              };
                              return (
                                <div {...field} className={styles.county} onClick={() => this.onAreaClick()}>
                                  {this.state.areaDesc || '???????????????'}
                                  <Icon type="down" />
                                </div>
                              );
                            }}
                          />
                          <Input
                            name="address"
                            className={styles.addr}
                            placeholder="??????????????????"
                            size="large"
                          />
                        </div>
                      </div>
                      <ErrorMessage name="postNum.des">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                      <ErrorMessage name="address">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                      <div className={`${styles.formItem} ${styles.ps}`}>
                        104??????????????????????????????????????????????????????????????????(???)?????????Email??????????????????????????????????????????
                      </div>
                    </>
                  )
                }
              </div>
            </>
          )
        }
        {
          showDealInfo && (
            <div className={styles.evaluation}>
              {
                caseDealData.map((deal, index) => {
                  const fieldName = deal.source === 'tutor' ? 'tutorEvaluation' : 'outsourceEvaluation';
                  return (
                    <Checkbox key={index} name={`${fieldName}`}>
                      ????????????
                      {deal.sourceDesc}
                      ????????????????????????
                      {' '}
                      {deal.dealNum}
                      ????????????
                      {' '}
                      {deal.reviewItems}
                      ???????????????
                      {' '}
                      {deal.reviewScore}
                      {' '}
                      <Rate disabled allowHalf defaultValue={deal.reviewScore} />
                      ???
                    </Checkbox>
                  );
                })
              }
            </div>
          )
        }
        <Checkbox className={styles.check} name="spec">
          ??????????????????????????????
          {' '}
          <a href={`${config.contentSite.domain}/guarantee_deposit/`} target="_blank">??????????????????</a>
        </Checkbox>
        <ErrorMessage name="spec">{msg => <div className={`${styles.error} ${styles.spec}`}>{msg}</div>}</ErrorMessage>
        <div className={styles.check}>
          <Checkbox.Group name="subscriptions" options={edmTypeOpts} />
        </div>
        {
          meta && (
            <div className={`${styles.step} ${isMobileStyle}`}>
              <Step current={isStepCurrent()} stepData={stepIterator(user, testUser, values.productNo, query.checkOk || '', location)}>
                {
                  ((userStatus !== 2 && (meta.credit !== 1 || !meta.deposit) && meta.tutorRemainingPoint > 0) || (userStatus !== 2 && (meta.credit !== 1 || !meta.deposit) && meta.tutorRemainingPoint == 0)) && (
                    <>
                      <Link to={`/serviceItems${queryTypeVal}`}>
                        <Button>
                          ?????????
                        </Button>
                      </Link>
                      {' '}
                      &nbsp;&nbsp;
                    </>
                  )
                }
                {
                  !isQueryType && (
                    <Button type="danger" htmlType="submit" loading={isSubmitting} disabled>
                      ?????????
                    </Button>
                  )
                }
                {
                  isQueryType && (
                    <Button type="primary" htmlType="submit" loading={isSubmitting} disabled>
                      ??????????????????
                    </Button>
                  )
                }
              </Step>
            </div>
          )
        }
      </form>
    );
  }

  render() {
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    const isLoading = this.state.loading ? styles.loadBg : '';
    const { location } = this.props;
    const { postNum } = this.state;
    const { data: caseDealData } = this.props.caseDeal;
    const {
      acName, companyName, invoiceAddress, invoiceNum, experiencePlan,
    } = this.props.payInfoData;
    const { cellphoneRecord, emailInfo } = this.props.defaultProfileData;
    const addr = postNum.des + invoiceAddress;
    // ??????call api??????????????????????????????????????????????????????checkbox???initValue
    const oldSiteEvaluations = caseDealData.reduce((acc, deal) => ({ ...acc, [`${deal.source}Evaluation`]: true }), {});
    const isQueryType = location.query.type;
    const initVal = {
      productNo: '',
      invoiceType: '',
      email: emailInfo.email,
      cellphone: cellphoneRecord.cellphone,
      originCellphone: cellphoneRecord.cellphone,
      captcha: '',
      carrierType: '9',
      carrierCode: '',
      acName,
      companyName,
      postNum,
      address: invoiceAddress,
      invoiceAddress: addr,
      invoiceNum,
      spec: false,
      ...oldSiteEvaluations,
      subscriptions: ['1'],
    };
    let getValidate = validateEditProfileToPaid;
    if (isQueryType || this.state.productNo === 'freeTrial') {
      getValidate = validateEditProfileToChange;
    }
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <div className={`${styles.wrap} ${isLoading} ${isMobileStyle} `}>
          {
            isQueryType && location.query.type === 'tutor' && (
              <div className={styles.points}>
                <Icon type="info-circle" />
                ????????????????????????????????????????????????????????????????????????
                {' '}
                <span className={styles.frequency}>???</span>
                ?????? ????????????
                {' '}
                {experiencePlan && '???  ?????????????????????'}
              </div>
            )
          }
          {
            isQueryType && location.query.type === 'outsource' && (
              <div className={styles.points}>
                <Icon type="info-circle" />
                ????????????????????????????????????????????????  ????????????  ??????????????????
                {' '}
                {experiencePlan && '???  ?????????????????????'}
              </div>
            )
          }
          <Formik
            initialValues={initVal}
            onSubmit={this.onFormSubmit}
            validationSchema={getValidate}
            render={this.renderForm}
            enableReinitialize
          />
          <TerminateModal
            title="104??????????????????????????????"
            context={this.modalContext}
          />
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  userStatus: state.user.status,
  defaultProfileData: state.basic.profile,
  caseDeal: state.basic.caseDeal,
  areaData: state.common.area,
  verifySMS: state.common.verifySMS,
  verifyPhone: state.common.verifyPhone,
  payInfoData: state.basic.payInfoData,
  payOrderInfo: state.basic.payOrderInfo,
  testUser: state.basic.testUser,
  availableOnDemands: state.basic.availableOnDemands,
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  loadDefaultProfile,
  loadCaseDeal,
  loadStaticArea,
  loadSendVerifySMS: sendVerifySMS,
  getPayInfoV2,
  loadSendVerifyCellphone: sendVerifyCellphone,
  sendPaymentOrder,
  chargeTopperFree,
  loadTestUser,
  checkInvoice,
  getAvailableOnDemands,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
