import React, { PureComponent, Fragment } from 'react';
import {
  Radio, Input, Checkbox, Spin,
} from 'antd';
import { HelpOutline, CheckCircleOutline } from '@material-ui/icons';
import { Formik, Form } from 'formik';
import { SubmitButton } from 'formik-antd';
import Button from '../ui/button';
import styles from './PlanSelect.scss';
import HiddenOrderForm from '../pay/HiddenOrderForm';
import { planTypeList } from '../../config/selectData';
import config from '../../config/config';
import { validatePlan } from '../common_v2/Validates';
// import { DebugFormik } from '../util/DebugFormik';

class PlanSelect extends PureComponent {
  state = {
    isSettingAccountClick: false,
    isTelephoneVerifying: false,
  };

  renderForm = (props) => {
    const {
      onPrev, isLoadingcellphoneVerity, isLoadingDemandStep2, isCellphoneVerifiedSubmit, originalDemandInfo, onVerifyCellphone, paid,
    } = this.props;
    const {
      handleSubmit, handleReset, values, errors, setFieldValue,
    } = props;
    const {
      isEmailVerified, isTelephoneVerified, isCellphoneVerified, cellphoneVerifiedCode, email, telArea, tel, cellphone, spec, planType, userRequestTelephoneVerify,
    } = values;
    // 手機欄位是否完整
    const isCellphoneFieldComplete = (isCellphoneVerifiedSubmit ? cellphoneVerifiedCode !== '' : isCellphoneVerified) && !errors.cellphone;
    // 市話欄位是否填寫
    const isTelephoneFieldComplete = telArea !== null && telArea !== '' && tel !== null && tel !== '' && !errors.telArea && !errors.tel;
    // 根據使用者選擇的方案，是否判斷email
    const isUserVerified = ((planType === planTypeList[0].value) ? (isTelephoneVerified || isCellphoneFieldComplete || userRequestTelephoneVerify) : ((isEmailVerified || (!isEmailVerified && this.state.isSettingAccountClick)) || isTelephoneFieldComplete || isCellphoneFieldComplete));

    // 表單是否完整
    const isFormValid = spec && isUserVerified;
    return (
      <div className={styles.form}>
        <Form onSubmit={handleSubmit}>
          <Radio.Group
            onChange={element => setFieldValue('planType', element.target.value)}
            value={planType}
          >
            <table className={styles.radioWrap}>
              <tbody>
                <tr>
                  <td>方案內容 / 方案</td>
                  <td><Radio value={planTypeList[0].value}>基本刊登</Radio></td>
                  {/* <td><Radio value={planTypeList[1].value}>進階刊登</Radio></td> */}
                </tr>
                <tr>
                  <td>費用</td>
                  <td>免費</td>
                  {/* <td>
                    <div className={styles.feeText}>
                      <p>押金NT$ 1000</p>
                      <p>(結案後可退還)</p>
                    </div>
                    <div className={styles.feeIcon}>
                      <a href={`${config.contentSite.domain}/guarantee_deposit/`} target="_blank"><HelpOutline style={{ color: '#ff6363' }} /></a>
                    </div>
                  </td> */}
                </tr>
                <tr>
                  <td>需求審核</td>
                  <td>專員審核</td>
                  {/* <td>專員審核</td> */}
                </tr>
                <tr>
                  <td>聯絡人電話</td>
                  <td>供接案者聯絡</td>
                  {/* <td>不公開</td> */}
                </tr>
                <tr>
                  <td>聯絡人e-mail</td>
                  <td>供接案者聯絡</td>
                  {/* <td>供接案者聯絡</td> */}
                </tr>
                <tr>
                  <td>站內即時通</td>
                  <td>可使用</td>
                  {/* <td>可使用</td> */}
                </tr>
              </tbody>
            </table>
          </Radio.Group>
          <div className={`${styles.field} ${styles.planField}`}>
            <label>
              <span className={styles.validate}>*</span>
              請選擇以下任一項資料做驗證
            </label>
          </div>
          <p className={styles.text}>
            <strong>以下任一項資料已驗證，即可送審。 </strong>
            <br />
            {
              planType === planTypeList[0].value ? (
                <Fragment>
                  若皆未驗證，可選行動電話取得驗證碼快速驗證。
                  <br />
                  若欲選室內電話驗證，填寫室內電話後，按下【申請人工驗證】後，再點選【確認方案送審】完成驗證送審後，可主動電洽02-29126104分機8333，與客服人員聯繫協助驗證及審核。
                  <br />
                  {/* **若為海外無台灣行動電話或室內電話，請選進階刊登，以e-mail驗證。
                  <br /> */}
                </Fragment>
              )
                : (
                  <Fragment>
                    若皆尚未驗證，可以行動電話取得驗證碼快速驗證。
                    <br />
                    若非台灣地區用戶無台灣室話或行動電話，可使用e-mail 至會員中心驗證。
                    <br />
                    申請驗證完成後，點選 【前往付款送審】 付款完成送審。
                    <br />
                    可主動電洽02-29126104分機8333，與客服人員聯繫協助驗證及審核。
                    <br />
                  </Fragment>
                )
            }
          </p>
          {
            planType === planTypeList[1].value ? (
              <div className={styles.field}>
                <label className={styles.label}>
                  電子信箱
                  {
                isEmailVerified
                  ? (
                    <span className={`${styles.checkIcon} ${styles.verification}`}>
                      <CheckCircleOutline />
                      已驗證
                    </span>
                  )
                  : (
                    <span className={styles.checkIcon}>
                      <CheckCircleOutline />
                      未驗證
                    </span>
                  )
              }
                </label>
                <div className={`${styles.telWrap} ${styles.flex}`}>
                  <Spin spinning={isLoadingDemandStep2}>
                    <span className={`${styles.emailField} ${errors.email ? styles.errorBord : ''}`}>
                      {email || '無資料'}
                    </span>
                    {
                  isEmailVerified ? null
                    : (this.state.isSettingAccountClick
                      ? <span className={`${styles.hightLightNotice}`}>待會員中心驗證後，直接送出</span> : (
                        <Button
                          onClick={() => {
                            open(`${config.accountsSite.domain}/#/setting`);
                            this.setState({ isSettingAccountClick: true });
                          }}
                        >
                          至會員中心修改/驗證
                        </Button>
                      ))
                }
                  </Spin>
                </div>
              </div>
            ) : null
          }
          <div className={styles.field}>
            <label className={styles.label}>
              室內電話
              {
                isTelephoneVerified && originalDemandInfo.telArea === telArea && originalDemandInfo.tel === tel
                  ? (
                    <span className={`${styles.checkIcon} ${styles.verification}`}>
                      <CheckCircleOutline />
                      已驗證
                    </span>
                  )
                  : (
                    <span className={styles.checkIcon}>
                      <CheckCircleOutline />
                      未驗證
                    </span>
                  )
              }
            </label>
            <div className={`${styles.telWrap} ${styles.flex}`}>
              <Spin spinning={isLoadingDemandStep2}>
                <Input
                  id="telArea"
                  name="telArea"
                  className={` ${styles.telAreaField} ${errors.email ? styles.errorBord : ''}`}
                  placeholder="區域"
                  value={telArea}
                  disabled={userRequestTelephoneVerify}
                  onChange={element => setFieldValue('telArea', element.target.value)}
                />
                <Input
                  id="tel"
                  name="tel"
                  className={`${styles.telField} ${errors.email ? styles.errorBord : ''}`}
                  placeholder="請輸入電話"
                  value={tel}
                  disabled={userRequestTelephoneVerify}
                  onChange={element => setFieldValue('tel', element.target.value)}
                />
                {
                  isTelephoneVerified && originalDemandInfo.telArea === telArea && originalDemandInfo.tel === tel
                    ? null
                    : userRequestTelephoneVerify
                      ? null
                      : (
                        <Button
                          type={!isTelephoneFieldComplete ? 'disabled' : ''}
                          onClick={() => {
                            setFieldValue('userRequestTelephoneVerify', true);
                            this.setState({ isTelephoneVerifying: true });
                          }}
                        >
                          申請人工驗證
                        </Button>
                      )
                }
              </Spin>
            </div>
            <span className={styles.error}>{errors.telArea}</span>
            <span className={styles.error}>{errors.tel}</span>
          </div>
          <div className={styles.field}>
            {
              userRequestTelephoneVerify
                ? <span className={`${styles.hightLightNotice}`}>已註記您的送審資料，請繼續完成需求刊登流程</span>
                : null
            }
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              行動電話
              {
                isCellphoneVerified && originalDemandInfo.cellphone === cellphone
                  ? (
                    <span className={`${styles.checkIcon} ${styles.verification}`}>
                      <CheckCircleOutline />
                      已驗證
                    </span>
                  )
                  : (
                    <span className={styles.checkIcon}>
                      <CheckCircleOutline />
                      未驗證
                    </span>
                  )
              }
            </label>
            <Spin spinning={isLoadingDemandStep2}>
              <Input
                id="cellphone"
                className={`${styles.cellphoneField} ${errors.email ? styles.errorBord : ''}`}
                placeholder="請輸入台灣行動電話"
                value={cellphone}
                onChange={element => setFieldValue('cellphone', element.target.value)}
                disabled={isCellphoneVerifiedSubmit}
              />
              {
              isCellphoneVerified && originalDemandInfo.cellphone === cellphone ? null : (
                <Button
                  type={errors.cellphone || cellphone === '' || cellphone === null ? 'disabled' : 'normal'}
                  loading={isLoadingcellphoneVerity}
                  onClick={() => onVerifyCellphone(cellphone)}
                >
                  線上立即驗證
                </Button>
              )
            }
            </Spin>
          </div>
          {
              isCellphoneVerifiedSubmit
                ? (
                  <div className={styles.field}>
                    <label className={styles.label}>請輸入簡訊內之6位數驗證碼（30分鐘內有效）</label>
                    <div className={`${styles.telWrap} ${styles.flex}`}>
                      <Input
                        id="cellphoneVerifiedCode"
                        className={`${styles.telField}`}
                        placeholder="請輸入驗證碼"
                        value={cellphoneVerifiedCode}
                        onChange={element => setFieldValue('cellphoneVerifiedCode', element.target.value)}
                      />
                    </div>
                  </div>
                )
                : null
              }
          <div className={`${styles.spec}`}>
            <Checkbox
              id="spec"
              value={spec}
              onChange={element => setFieldValue('spec', element.target.checked)}
            >
              我已閱讀並同意遵守
              {' '}
              <a target="_blank" href={`${config.contentSite.domain}/guarantee_deposit/`}>104高手刊登規範</a>
            </Checkbox>
          </div>
          <div className={styles.btnWrap}>
            <Button onClick={() => handleReset(onPrev())} dataGtmCase="step1-cxl">取消回上一步</Button>
            <SubmitButton type="primary" disabled={!isFormValid}>{planType === planTypeList[0].value ? '確認方案送審' : '前往付款送審'}</SubmitButton>
          </div>
          {/* <DebugFormik /> */}
        </Form>
        {/* 進階刊登進金流 */}
        { paid && <HiddenOrderForm formData={paid} />}
      </div>
    );
  }

  render() {
    const { isTelephoneVerifying } = this.state;
    return (
      <Formik
        enableReinitialize
        initialValues={this.props.initialData}
        validationSchema={isTelephoneVerifying ? null : validatePlan}
        onSubmit={this.props.onSubmit}
        render={this.renderForm}
      />
    );
  }
}


export default PlanSelect;
