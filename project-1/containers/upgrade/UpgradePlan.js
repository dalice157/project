import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import {
  Checkbox, Icon, Button, Modal, Tooltip, message, Spin,
} from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import { Input, Radio } from 'formik-antd';
import dayjs from 'dayjs';
import Step from '../../components/ui/step';
import { stepIterator } from '../../util/editStepUtil';
import { validateUpgradePlan } from '../../util/yupUtil';
import { moneyFormat } from '../../util/commonUtil';
import { dayFormat } from '../../util/formatUtil';
import { catSearch } from '../../util/categoryUtils';
import { invoiceTypeOpts } from '../../config/selectData';
import { dateFormat } from '../../config/constant';
import config from '../../config/config';
import {
  loadTestUser, checkInvoice, getPreUpgradePlanInfo, sendUpgradeOrder,
} from '../../actions/basic';
import {
  loadStaticArea,
} from '../../actions/common';
import styles from './UpgradePlan.scss';


class UpgradePlan extends Component {
  state = {
    checked: false,
    postNum: '',
    loading: false,
  }


  componentDidMount() {
    this.initPreUpgradePlanInfo();
  }

  initPreUpgradePlanInfo = async () => {
    const { history } = this.props;
    this.setState({
      loading: true,
    });
    this.props.loadTestUser();
    this.props.loadStaticArea();
    try {
      const response = await this.props.getPreUpgradePlanInfo();
      const { areaData } = this.props;
      if (response.error) {
        message.warning('你目前無法升級，將為你導入接案管理!');
        setTimeout(() => {
          history.push('/topper-dashboard/home');
        }, 2000);
      }
      const { postNum } = response.payload;
      const area = areaData;
      const searchArea = postNum && postNum !== null && postNum.length > 0 ? catSearch(area, postNum) : '';
      this.setState({
        postNum: searchArea,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  onFormSubmit = async (values, actions) => {
    const { history, preUpgradePlanInfo } = this.props;
    const {
      productNo: upgradeProductNo,
    } = preUpgradePlanInfo.upgradePlan;
    const {
      carrierCode, carrierType, address, invoiceNum, acName, companyName, invoiceType, postNum,
    } = values;
    const addr = postNum.des + address;
    const invoiceTitle = invoiceType === '3' ? companyName : acName;

    let dto = {
      carrierCode,
      carrierType,
      invoiceAddress: addr || '',
      invoiceNum: invoiceNum || '',
      invoiceTitle: invoiceTitle || '',
      invoiceType: invoiceType || '',
      postNum: postNum.no,
      productNo: upgradeProductNo,
    };
    if (invoiceType === '3') {
      this.props.checkInvoice(dto).then((res) => {
        const title = res.payload && res.payload.response && res.payload.response.error;
        if (title === 'vatNo check error!') {
          message.error('統編輸入錯誤');
        } else if (title) {
          Modal.confirm({
            title: '發票資料確認',
            content: (
              <>
                公司統編
                {' '}
                <b>{invoiceNum}</b>
                ，此統編於104系統內，對應之發票抬頭資料為
                {' '}
                <b>
                  {companyName}
                  公司
                </b>
                {' '}
                是否正確。 若發票抬頭不同，請確認輸入的公司統編是否有錯誤。
                <br />
                <span className={styles.invoicePs}>**若因原公司資料有變更，請洽客服更新公司資料。 </span>
              </>
            ),
            okText: '正確請套用',
            cancelText: '錯誤重新更正',
            onOk: () => {
              dto = {
                ...dto,
                invoiceTitle: title,
              };
              this.props.sendUpgradeOrder(dto).then(() => {
                actions.setSubmitting(false);
                history.push('/upgrade-pay');
              });
            },
            onCancel: () => {},
          });
        } else {
          this.props.sendUpgradeOrder(dto).then(() => {
            actions.setSubmitting(false);
            history.push('/upgrade-pay');
          });
        }
      });
    } else {
      this.props.sendUpgradeOrder(dto).then(() => {
        actions.setSubmitting(false);
        history.push('/upgrade-pay');
      });
    }
  }

  onAreaClick = (validateField, setFieldValue, currentValue) => {
    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '居住地區',
        maxSelectedNumber: 1,
        selectedItems: [{ no: currentValue }],
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        unselectableList: '6[0-9]{6}000',
        onSubmit: ({ selectedItems }) => {
          const item = selectedItems[0];
          const des = item ? item.des : '';
          const no = item ? item.no : null;
          setFieldValue('postNum', { des, no });
          validateField('postNum');
        },
      });
    }
  }

  onUpgradeChange = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  }

  renderForm = (props) => {
    const {
      handleSubmit, values, errors, validateField, setFieldValue, isSubmitting,
    } = props;
    console.log('errors:', errors);
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>填寫發票資料</h2>
        <div className={styles.block}>
          <div className={styles.formItem}>
            <label className={styles.label}>
              <span className={styles.required}>*</span>
              {' '}
              發票類型
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
                <div className={`${styles.formItem} ${styles.alignItem}`}>
                  <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    {' '}
                    發票管理方式
                  </label>
                  <div className={`${styles.formControl} ${styles.mflag}`}>
                    <Radio.Group name="carrierType">
                      <Radio className={styles.radioBlock} value="9">104會員載具（104協助對獎，中獎將主動通知）</Radio>
                      <Radio className={styles.radioBlock} value="4">
                        手機條碼載具
                        <Input disabled={values.carrierType === '4' ? '' : 'disabled'} name="carrierCode" className={styles.input} size="large" />
                        {' '}
                        詳見
                        {' '}
                        <a href="https://www.einvoice.nat.gov.tw/APMEMBERVAN/GeneralCarrier/generalCarrier" target="_blank" rel="noreferrer">財政部說明</a>
                      </Radio>
                      <ErrorMessage name="carrierCode">
                        {msg => <div className={styles.error}>{msg}</div>}
                      </ErrorMessage>
                      <Radio className={styles.radioBlock} value="5">捐贈給創世基金會</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className={styles.formItem}>
                  <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    {' '}
                    發票抬頭
                  </label>
                  <div className={styles.formControl}>
                    <Input className={styles.input} name="acName" size="large" />
                  </div>
                </div>
                <ErrorMessage name="acName">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                <div className={`${styles.formItem} ${styles.addr}`}>
                  <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    {' '}
                    聯絡地址
                  </label>
                  <div className={styles.formControl}>
                    <Field name="postNum">
                      { ({ field }) => (
                        <div
                          {...field}
                          className={styles.county}
                          onClick={() => this.onAreaClick(validateField, setFieldValue, values.postNum.no)}
                        >
                          { values.postNum.des || '請選擇地區' }
                          <Icon type="down" />
                        </div>
                      ) }
                    </Field>
                    <Input
                      name="address"
                      className={styles.addr}
                      size="large"
                    />
                  </div>
                </div>
                <ErrorMessage name="postNum.no">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                <ErrorMessage name="address">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
              </>
            )
          }
          {
            values.invoiceType === invoiceTypeOpts[1].value && (
              <>
                <div className={styles.formItem}>
                  <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    {' '}
                    公司統編
                  </label>
                  <div className={styles.formControl}>
                    <Input
                      name="invoiceNum"
                      className={styles.input}
                      size="large"
                      placeholder="請輸入統一編號"
                    />
                  </div>
                </div>
                <ErrorMessage name="invoiceNum">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                <div className={styles.formItem}>
                  <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    {' '}
                    發票抬頭
                  </label>
                  <div className={styles.formControl}>
                    <Input
                      name="companyName"
                      className={styles.input}
                      size="large"
                      placeholder="請輸入發票抬頭"
                    />
                  </div>
                </div>
                <ErrorMessage name="companyName">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                <div className={`${styles.formItem} ${styles.addr}`}>
                  <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    {' '}
                    公司地址
                  </label>
                  <div className={`${styles.formControl} ${styles.flex}`}>
                    <Field name="postNum">
                      { ({ field }) => (
                        <div
                          {...field}
                          className={styles.county}
                          onClick={() => this.onAreaClick(validateField, setFieldValue, values.postNum.no)}
                        >
                          { values.postNum.des || '請選擇地區' }
                          <Icon type="down" />
                        </div>
                      ) }
                    </Field>
                    <Input
                      name="address"
                      className={styles.addr}
                      placeholder="路名巷弄號樓"
                      size="large"
                    />
                  </div>
                </div>
                <ErrorMessage name="postNum.no">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                <ErrorMessage name="address">{msg => <div className={styles.error}>{msg}</div>}</ErrorMessage>
                <div className={`${styles.formItem} ${styles.ps}`}>
                  104高手導入電子發票機制，委由金財通商務科技服務(股)公司以Email方式寄送，不另寄送紙本發票。
                </div>
              </>
            )
          }
        </div>
        <div className={styles.btnWrap}>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            確認前往付款
          </Button>
        </div>
      </form>
    );
  }

  render() {
    const { location, testUser, preUpgradePlanInfo } = this.props;
    const { checked, postNum, loading } = this.state;
    const {
      acName, companyName, invoiceAddress, invoiceNum, currentPlan, upgradePlan,
    } = preUpgradePlanInfo;
    const {
      productNo: currentProductNo,
      price: currentPrice,
      consumeDays,
      startDate: currentStartDate,
      estimateEndDate: currentEndDate,
    } = currentPlan;
    const {
      productNo: upgradeProductNo,
      price: upgradePrice,
      remainingDays,
      startDate: upgradeStartDate,
      estimateEndDate: upgradeEndDate,
    } = upgradePlan;
    const currentPeriodOfUse = `${dayFormat(currentStartDate)} ~ ${dayFormat(currentEndDate)}`;
    const currentExpiredPeriod = `${dayFormat(currentStartDate)} ~ ${dayjs().subtract(1, 'day').format(dateFormat)}`;
    const upgradePeriodOfUse = `${dayFormat(upgradeStartDate)} ~ ${dayFormat(upgradeEndDate)}`;
    const productMap = config.products.json;
    const isMobile = uaIsMobile();
    const getTooltipTrigger = isMobile ? 'click' : 'hover';
    const addr = postNum.des + invoiceAddress;
    const initVal = {
      invoiceType: invoiceTypeOpts[0].value,
      captcha: '',
      carrierType: '9',
      carrierCode: '',
      acName,
      companyName,
      postNum,
      address: invoiceAddress,
      invoiceAddress: addr,
      invoiceNum,
    };
    return (
      <Spin size="large" spinning={loading} tip="Loading...">
        <div className={styles.wrap}>
          <h2 className={styles.title}>方案升級</h2>
          <div className={styles.card}>
            <div className={styles.hearder} data-label="目前方案：">{productMap.top[currentProductNo].productName}</div>
            <ul className={styles.details}>
              <li data-label="使用期限：" className={styles.item}>{currentPeriodOfUse}</li>
              <li data-label="方案金額：" className={styles.item}>
                NT$
                {' '}
                {moneyFormat(String(currentPrice))}
              </li>
              <li data-label="已使用期間：" className={styles.item}>
                {currentExpiredPeriod}
              &nbsp; &nbsp;共
                {' '}
                <span className={styles.day}>{consumeDays}</span>
                {' '}
                天
              </li>
            </ul>
          </div>
          <div className={`${styles.card} ${styles.upgrade}`}>
            <div className={styles.hearder} data-label="可升級方案：">{productMap.top[upgradeProductNo].productName}</div>
            <ul className={styles.details}>
              <li data-label="可使用期間：" className={styles.item}>
                {upgradePeriodOfUse}
                {' '}
                共
                {' '}
                <span className={styles.day}>{remainingDays}</span>
                {' '}
                天
              </li>
              <li data-label="應付升級差額：" className={`${styles.item} ${styles.difference}`}>
                <Tooltip placement="right" trigger={getTooltipTrigger} title="應補升級差額 = 依方案之平均日單價差額 X 剩於可使用天數">
                  <Icon type="question-circle" />
                </Tooltip>
                NT$
                {' '}
                <span className={styles.price}>{moneyFormat(String(upgradePrice))}</span>
              </li>
            </ul>
          </div>
          <Checkbox className={styles.checkBlock} onChange={this.onUpgradeChange}>
            已確認要升級無限方案，並同意以上升級付款金額。
          </Checkbox>
          {
          !checked && <div className={`${styles.error} ${styles.upgradeError}`}>請勾選同意升級</div>
        }
          {
          checked && (
            <Formik
              initialValues={initVal}
              onSubmit={this.onFormSubmit}
              validationSchema={validateUpgradePlan}
              render={this.renderForm}
              enableReinitialize
            />
          )
        }
          <div className={styles.step}>
            <Step current={0} stepData={stepIterator('', testUser, '', '', location)} />
          </div>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  areaData: state.common.area,
  testUser: state.basic.testUser,
  preUpgradePlanInfo: state.basic.preUpgradePlanInfo,
});

const mapDispatchToProps = {
  loadStaticArea,
  loadTestUser,
  checkInvoice,
  getPreUpgradePlanInfo,
  sendUpgradeOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradePlan);
