import React, { Component } from 'react';
import {
  Radio, Input, Select, DatePicker, Checkbox, Icon
} from 'antd';
import { CheckCircleOutline } from '@material-ui/icons';
import { Field, ErrorMessage } from 'formik';
import moment from 'moment';
import { acDateFormat } from '../../config/constant';
import Button from '../ui/button';
import {
  sexTitle, personTypeOpts, identityTypeOpts, roleTypes, companySizeData, jobTitleType
} from '../../config/selectData';
import config from '../../config/config';
import styles from './CaseUserRenderForm.scss';

const { Option } = Select;

class CaseUserRenderForm extends Component {
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

  onIndustClick = (validateField, setFieldValue, currentValue) => {
    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Indust',
        theme: 'customer-theme',
        title: '產業類型',
        maxSelectedNumber: 1,
        selectedItems: [{ no: currentValue }],
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        whitelist: '10[0-9]{2}00[0-9]{1}000',
        unselectableList: '10[0-9]{2}000000',
        onSubmit: ({ selectedItems }) => {
          const item = selectedItems[0];
          const des = item ? item.des : '';
          const no = item ? item.no : null;
          setFieldValue('industry', { des, no });
          validateField('industry');
        },
      });
    }
  }


  renderPerson = () => {
    const { errors, values, setFieldValue } = this.props.data;
    const { birthday, initialData } = this.props;
    console.log('errors:', errors);
    const DatePickerField = ({ name, value }) => {
      // value = value == null ? null : value;
      const birthdayVal = value == null ? null : moment(value, acDateFormat);
      return (
        <DatePicker
          value={birthdayVal}
          allowClear={false}
          onChange={(dateString) => {
            setFieldValue(name, dateString);
          }}
        />
      );
    };
    return (
      <>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>生日</label>
          {
            birthday && birthday !== '1900-01-01' ? (
              <div className={styles.field}>{birthday}</div>
            )
              : (
                <DatePickerField
                  name="birthday"
                  value={values.birthday}
                  onChange={setFieldValue}
                />
              )
          }
          <ErrorMessage name="birthday">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>身份資料</label>
          {
            initialData.identity
              ? (
                <>
                  <Field
                    name="identityType"
                    render={({ field }) => (
                      <Radio.Group disabled {...field} options={identityTypeOpts} />
                    )}
                  />
                  <div className={styles.field}>
                    {values.identity}
                  </div>
                </>
              )
              : (
                <>
                  <Field
                    name="identityType"
                    render={({ field }) => (
                      <Radio.Group {...field} options={identityTypeOpts} />
                    )}
                  />
                  <Field
                    name="identity"
                    render={({ field }) => (
                      <Input id="identity" className={`${styles.identityInp} ${errors.identity ? styles.errorBord : ''}`} {...field} placeholder="請輸入身分證或護照號碼" />
                    )}
                  />
                </>
              )
          }
          <ErrorMessage name="identity">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={`${styles.role} ${styles.field}`}>
          <label><span className={styles.validate}>*</span>身份類型</label>
          <Field
            name="roleType"
            render={({ field }) => (
              <Select
                {...field}
                name="roleType"
                onChange={value => setFieldValue('roleType', value)}
                value={values.roleType}
              >
                {
                  roleTypes.map((option) => {
                    return <Option key={option.value} value={option.value}>{option.label}</Option>;
                  })
                }
              </Select>
            )}
          />
          <ErrorMessage name="roleType">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
      </>
    );
  }

  renderCompany = () => {
    const {
      errors, values, validateField, setFieldValue
    } = this.props.data;
    console.log('errors:', errors);
    console.log('industry:', values.industry);
    return (
      <>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>公司名稱</label>
          <Field
            name="companyName"
            render={({ field }) => (
              <Input id="companyName" className={errors.companyName ? styles.errorBord : ''} {...field} placeholder="請輸入公司名稱" />
            )}
          />
          <ErrorMessage name="companyName">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>統一編號</label>
          <Field
            name="invoice"
            render={({ field }) => (
              <Input id="invoice" className={errors.invoice ? styles.errorBord : ''} {...field} placeholder="請輸入統一編號" />
            )}
          />
          <ErrorMessage name="invoice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>公司規模</label>
          <Field
            name="employeeCount"
            render={({ field }) => (
              <Select
                {...field}
                name="employeeCount"
                onChange={value => setFieldValue('employeeCount', value)}
                value={values.employeeCount}
              >
                {
                  companySizeData.map((option) => {
                    return <Option key={option.value} value={option.value}>{option.lable}</Option>;
                  })
                }
              </Select>
            )}
          />
          <ErrorMessage name="employeeCount">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>產業類型</label>
          <Field
            name="industry"
            render={({ field }) => (
              <div
                {...field}
                className={styles.category}
                onClick={() => this.onIndustClick(validateField, setFieldValue, values.industry.no)}
              >
                {values.industry.des || '請選擇產業類型'}
                <Icon type="down" />
              </div>
            )}
          />
          <ErrorMessage name="industry.no">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>你的職稱</label>
          <Field
            name="jobTitle"
            render={({ field }) => (
              <Select
                {...field}
                onChange={value => setFieldValue('jobTitle', value)}
                value={values.jobTitle}
              >
                {
                  jobTitleType.map((option) => {
                    return <Option key={option.value} value={option.value}>{option.lable}</Option>;
                  })
                }
              </Select>
            )}
          />
          <ErrorMessage name="jobTitle">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
      </>
    );
  }

  render() {
    const {
      handleSubmit, values, errors, validateField, setFieldValue
    } = this.props.data;
    const { emailInfo, onBackPage } = this.props;
    const {
      familyName, firstName, isSubscribeEdm304, isSubscribeEdm305
    } = this.props.data.values;
    return (
      <form onSubmit={handleSubmit}>
        <div className={styles.userWrap}>
          <div className={`${styles.field} ${styles.flex}`}>
            <label><span className={styles.validate}>*</span>帳戶人姓名</label>
            <div className={styles.valueData}>{`${familyName}${firstName}`}</div>
          </div>
          <div className={`${styles.field} ${styles.flex}`}>
            <label><span className={styles.validate}>*</span>稱謂</label>
            <Field
              name="sex"
              render={({ field }) => (
                <Radio.Group {...field} options={sexTitle} />
              )}
            />
          </div>
        </div>
        <ErrorMessage name="sex">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        <div className={`${styles.field} ${styles.flex}`}>
          <label><span className={styles.validate}>*</span>啟用104高手服務身份</label>
          <Field
            name="chosenRole"
            render={({ field }) => (
              <Radio.Group {...field} options={personTypeOpts} />
            )}
          />
        </div>
        <div className={styles.ps}>(以下資料不公開，僅客服驗證使用)</div>
        {
          values.chosenRole === personTypeOpts[0].value
          && this.renderPerson()
        }
        {
          values.chosenRole === personTypeOpts[1].value
          && this.renderCompany()
        }
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>通訊/發票寄送地址</label>
          <div className={`${styles.addrWrap} ${styles.flex}`}>
            <Field
              name="postNum"
              render={({ field }) => (
                <div
                  {...field}
                  className={`${styles.category} ${styles.county}`}
                  onClick={() => this.onAreaClick(validateField, setFieldValue, values.postNum.no)}
                >
                  {values.postNum.des || '請選擇地區'}
                  <Icon type="down" />
                </div>
              )}
            />
            <Field
              name="address"
              render={({ field }) => (
                <Input id="address" className={`${styles.addr} ${errors.address ? styles.errorBord : ''}`} {...field} placeholder="路名巷弄號樓" />
              )}
            />
          </div>
          <ErrorMessage name="postNum.no">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="address">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>電子信箱
            {
              emailInfo.isVerified == 'true' && (
                <span className={`${styles.checkIcon} ${styles.verification}`}><CheckCircleOutline />已驗證</span>
              )
            }
            {
              emailInfo.isVerified == 'false' && (
                <span className={styles.checkIcon}><CheckCircleOutline /> 未驗證</span>
              )
            }
          </label>
          <div className={styles.flex}>
            {
              emailInfo.isVerified == 'true' && (
                emailInfo.email
              )
            }
            {
              emailInfo.isVerified == 'false' && (
                <Field
                  name="email"
                  render={({ field }) => (
                    <Input
                      id="email"
                      disabled
                      className={`${styles.emailInp} ${errors.email ? styles.errorBord : ''}`}
                      {...field}
                      placeholder="請輸入電子信箱"
                    />
                  )}
                />
              )
            }
          </div>
        </div>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>聯絡電話</label>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>行動電話</label>
          <Field
            name="cellphone"
            render={({ field }) => (
              <Input
                id="cellphone"
                className={`${styles.cellphoneInp} ${errors.cellphone ? styles.errorBord : ''}`}
                {...field}
                placeholder="請輸入行動電話"
              />
            )}
          />
          <Field
            name="originCellphone"
            render={({ field }) => (
              <Input
                id="originCellphone"
                type="hidden"
                {...field}
                placeholder="請輸入行動電話"
              />
            )}
          />
          <ErrorMessage name="cellphone">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>室內電話</label>
          <div className={`${styles.telWrap} ${styles.flex}`}>
            <Field
              name="telArea"
              render={({ field }) => (
                <Input
                  id="telArea"
                  className={`${styles.emailInp} ${errors.telArea ? styles.errorBord : ''}`}
                  {...field}
                  placeholder="區碼"
                />
              )}
            />
            <Field
              name="tel"
              render={({ field }) => (
                <Input id="tel" className={`${styles.emailInp} ${errors.tel ? styles.errorBord : ''}`} {...field} placeholder="電話號碼，分機請輸入#" />
              )}
            />
          </div>
          <ErrorMessage name="telArea">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
          <ErrorMessage name="tel">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={`${styles.field} ${styles.checkboxWrap}`}>
          <Field
            name="spec"
            render={({ field }) => {
              return (
                <>
                  <Checkbox {...field} /> 同意啟用並已詳細閱讀且接受<a href={`${config.contentSite.domain}/guarantee_deposit/`} target="_blank">104高手會員服務條款</a>
                </>
              );
            }}
          />
          <ErrorMessage name="spec">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <>
          <div className={`${styles.field} ${styles.checkboxWrap}`}>
            <Field
              name="isSubscribeEdm304"
              render={({ field }) => {
                return (
                  <>
                    <Checkbox {...field} checked={isSubscribeEdm304} />&nbsp;&nbsp;訂閱104高手接案資訊報
                  </>
                );
              }}
            />
          </div>
          <div className={`${styles.field} ${styles.checkboxWrap}`}>
            <Field
              name="isSubscribeEdm305"
              render={({ field }) => {
                return (
                  <>
                    <Checkbox {...field} checked={isSubscribeEdm305} />&nbsp;&nbsp;訂閱104高手發案找人才資訊報
                  </>
                );
              }}
            />
          </div>
        </>
        <div className={styles.btnWrap}>
          <Button onClick={onBackPage}>取消回上一頁</Button>
          <Button type="primary" htmlType="submit" disabled>立即啟用</Button>
        </div>
      </form>
    );
  }
}

export default CaseUserRenderForm;
