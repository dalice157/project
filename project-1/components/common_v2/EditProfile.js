import React, { Component } from 'react';
import { Input, Radio, Checkbox } from 'antd';
import { CheckCircleOutline } from '@material-ui/icons';
import { Formik, Field, ErrorMessage } from 'formik';
import { modalData } from '../ui/step/stepData';
import Step from '../ui/step';
import Button from '../ui/button';
import {
  sexes, personTypeOpts, identityTypeOpts, demandOrderTXStatus,
} from '../../config/selectData';
import config from '../../config/config';
import styles from './Form.scss';

class EditProfile extends Component {
  handleCellphoneChange = setFieldValue => (e) => {
    const {
      onCellphoneChange,
    } = this.props.profilePage;
    const cellphone = e.target.value;
    setFieldValue('cellphone', cellphone);
    onCellphoneChange(cellphone);
  }

  renderForm = (props) => {
    // console.log('填寫聯絡資料');
    // console.log(props);
    // console.log(this.props);
    const {
      setFieldValue
    } = props;
    const {
      // roleType,
      sex,
      // identityType,
      identity,
      // invoice,
      email,
      // telArea,
      // tel,
      cellphone,
      // spec,
    } = props.values;
    const {
      profilePage,
    } = this.props;
    const {
      defaultDemanderForm,
      // onCellphoneChange,
      onSendSMS,
      verifySMS,
      // verifyPhone,
    } = profilePage;
    const {
      familyName,
      firstName,
      // identityType: defaultIdentityType,
      identity: defaultIdentity,
      // invoice,
      emailInfo,
      // telArea,
      // tel,
      cellphoneRecord,
    } = defaultDemanderForm;
    const {
      // email,
      isVerified: isEmailVerified,
      // isMain,
    } = emailInfo;
    const {
      // basicId,
      cellphone: prevCellphone,
      certificate,
      // frequency,
    } = cellphoneRecord;
    // console.log(defaultDemanderForm);
    const isCellphoneCertificate = cellphone === prevCellphone && certificate;
    // console.log(`isCellphoneCertificate: ${isCellphoneCertificate}`);

    const {
      onCasePrev,
      orderTXStatus
    } = profilePage;
    const isBtnText = orderTXStatus === demandOrderTXStatus.PAY ? '存儲' : '下一步';

    // console.log(props.values); // debug values
    // console.log(props.errors); // debug errors
    // console.log(`defaultIdentityType: ${defaultIdentityType}, defaultIdentity:${defaultIdentity}`);

    let sexUI = null;
    if ([sexes[0].value, sexes[1].value].includes(sex)) {
      sexUI = sex === sexes[0].value ? '男' : '女';
    } else {
      sexUI = (
        <div>
          <Field
            name="sex"
            render={({ field }) => (
              <Radio.Group {...field} options={sexes} />
            )}
          />
          <ErrorMessage name="sex">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
      );
    }

    let identityUI = (
      <div className={styles.field}>
        <Field
          name="identityType"
          render={({ field }) => (
            <Radio.Group {...field} options={identityTypeOpts} />
          )}
        />
        <Field
          name="identity"
          render={({ field }) => (
            <Input id="identity" className={props.errors.identity ? styles.errorBord : ''} {...field} placeholder="請輸入身分證或護照號碼" />
          )}
        />
        <ErrorMessage name="identity">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
      </div>
    );

    if (defaultIdentity != '') {
      identityUI = (
        <div className={styles.field}>
          <Field
            name="identityType"
            render={({ field }) => (
              <Radio.Group {...field} options={identityTypeOpts} disabled={true} />
            )}
          />
          { identity }
        </div>
      );
    }

    if (props.values.roleType === personTypeOpts[1].value) {
      identityUI = '';
    }

    // const isSMSSent = frequency > 0 && !certificate;

    // console.log(`isSMSSent: ${isSMSSent}, frequency: ${frequency}, ${certificate}`);
    // console.log(`isSMSSent || verifySMS.success || certificate: ${(isSMSSent || verifySMS.success || !certificate) || (props.errors && props.errors.captcha)}`);
    // console.log(`isSMSSent: ${isSMSSent}`);
    // console.log(`verifySMS.success: ${verifySMS.success}`);
    // console.log(`certificate: ${certificate}`);
    const renderPhone = (
      <div className={styles.field}>
        <label><span className={styles.validate}>*</span>行動電話驗證碼</label>
        <div className={styles.verify}>
          <div className={styles.mobile}>
            <Field
              name="captcha"
              render={({ field }) => (
                <Input className={props.errors.captcha ? styles.errorBord : ''} {...field} placeholder="請輸入驗證碼" />
              )}
            />
            <ErrorMessage name="captcha">
              { msg => <span className={styles.error}>{ msg }</span> }
            </ErrorMessage>
          </div>
          {/* <Button>送出驗證碼</Button> */}
        </div>
      </div>
    );
    const phoneValidate = () => {
      if (!certificate) {
        return renderPhone;
      } else if (certificate && !verifySMS.success && !this.props.isCellphoneCertificate) {
        return renderPhone;
      } else if (certificate && verifySMS.success && this.props.isCellphoneCertificate) {
        return '';
      } else if (!certificate && verifySMS.success) {
        return renderPhone;
      } else if (this.props.isCellphoneCertificate) {
        return '';
      } else if (!this.props.isCellphoneCertificate) {
        return renderPhone;
      }
    };
    return (
      <form onSubmit={props.handleSubmit}>
        <div className={styles.block}>
          <p className={styles.note}>為保障接案資料真實，請完成資料填寫及驗證。資料不公開，僅客服聯繫使用。</p>
          <div className={styles.field}>
            <label><span className={styles.validate}>*</span>真實姓名</label>
            <div className={styles.valueData}>
              {`${familyName} ${firstName}`}
            </div>
          </div>
          <div className={styles.field}>
            <label><span className={styles.validate}>*</span>性別</label>
            { sexUI }
          </div>
          <div className={styles.field}>
            <label><span className={styles.validate}>*</span>身分</label>
            <Field
              name="roleType"
              render={({ field }) => (
                <Radio.Group {...field} options={personTypeOpts} />
              )}
            />
            <ErrorMessage name="roleType">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          { identityUI }
          { props.values.roleType === personTypeOpts[1].value
            && (
            <div className={styles.field}>
              <label><span className={styles.validate}>*</span>公司統一編號</label>
              <Field
                name="invoice"
                render={({ field }) => (
                  <Input id="invoice" className={props.errors.invoice ? styles.errorBord : ''} {...field} placeholder="請輸入統一編號" />
                )}
              />
              <ErrorMessage name="invoice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            )
          }
          <div className={styles.field}>
            <label className={styles.emailBlock}>
              <span className={styles.validate}>*</span>電子信箱
              {isEmailVerified ? <CheckCircleOutline /> : ''}
            </label>

            {
              isEmailVerified ? email : (
                <div className={styles.verify}>
                  <div className={styles.email}>
                    <Field
                      name="email"
                      render={({ field }) => (
                        <Input className={props.errors.email ? styles.errorBord : ''} {...field} placeholder="請輸入電子信箱" />
                      )}
                    />
                    <ErrorMessage name="email">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                  </div>
                  <Button>發送驗證信</Button>
                </div>
              )
            }
          </div>
          <div className={styles.field}>
            <label>室內電話</label>
            <div className={styles.areaCode}>
              <Field
                name="telArea"
                render={({ field }) => (
                  <Input className={props.errors.telArea ? styles.errorBord : ''} {...field} placeholder="請輸入區碼" />
                )}
              />
              <ErrorMessage name="telArea">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={styles.tel}>
              <Field
                name="tel"
                render={({ field }) => (
                  <Input className={props.errors.tel ? styles.errorBord : ''} {...field} placeholder="請輸入電話號碼" />
                )}
              />
              <ErrorMessage name="tel">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.cellphoneBlock}>
              <span className={styles.validate}>*</span>行動電話
              { isCellphoneCertificate && <CheckCircleOutline /> }
            </label>
            <div className={styles.verify}>
              <div className={styles.mobile}>
                <Field
                  name="cellphone"
                  render={({ field }) => (
                    <Input className={props.errors.mobile ? styles.errorBord : ''} {...field} placeholder="請輸入行動電話" onChange={this.handleCellphoneChange(setFieldValue)} />
                  )}
                />
                <ErrorMessage name="cellphone">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
              </div>
              { !isCellphoneCertificate && <Button onClick={() => onSendSMS(cellphone)}>發送驗證碼</Button> }
            </div>
          </div>
          { phoneValidate() }
          <div className={`${styles.field} ${styles.spec}`}>
            <Field
              name="spec"
              render={({ field }) => (
                <Checkbox {...field}>
                  已詳細閱讀並接受 <a target="_blank" href={`${config.contentSite.domain}/membership_terms/`}>104高手會員服務條款</a>
                </Checkbox>
              )}
            />
            <ErrorMessage name="spec">
              { msg => <span className={styles.error}>{ msg }</span> }
            </ErrorMessage>
          </div>
        </div>

        <div className={styles.btnWrap}>
          <Button onClick={onCasePrev} dataGtmCase="step2-prev">上一步</Button>
          <Button type="primary" htmlType="submit" dataGtmCase="step2-next">{isBtnText}</Button>
        </div>
      </form>
    );
  }

  render() {
    const {
      profilePage,
    } = this.props;
    // console.log(profilePage);

    const {
      orderTXStatus,
      handleActivateProfile,
      validateEdit,
      defaultDemanderForm,
    } = profilePage;
    // console.log(defaultDemanderForm);

    const {
      familyName,
      firstName,
      sex,
      identityType,
      identity,
      invoice,
      emailInfo,
      telArea,
      tel,
      cellphoneRecord,
    } = defaultDemanderForm;
    const {
      email,
    } = emailInfo;
    const {
      cellphone,

    } = cellphoneRecord;
    const initVal = {
      familyName,
      firstName,
      sex: [sexes[0].value, sexes[1].value].includes(String(sex)) ? String(sex) : '',
      roleType: 'personal',
      identityType: [identityTypeOpts[0].value, identityTypeOpts[1].value].includes(String(identityType)) ? String(identityType) : '0',
      identity: identity || '',
      invoice: invoice || '',
      email: email || '',
      telArea: telArea || '',
      tel: tel || '',
      cellphone: cellphone || '',
      captcha: '',
      spec: false,
    };
    return (
      <div className={styles.form}>
        {
          orderTXStatus !== demandOrderTXStatus.PAY
          && <Step current={1} stepData={modalData} stepModel />
        }
        <Formik
          initialValues={initVal}
          onSubmit={handleActivateProfile}
          validationSchema={validateEdit}
          render={this.renderForm}
        />
      </div>
    );
  }
}

export default EditProfile;
