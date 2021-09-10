import React, { PureComponent } from 'react';
import {
  Input, Radio, Select, InputNumber, Checkbox, Icon, Modal, DatePicker, Divider
} from 'antd';
import { Field, ErrorMessage, Formik } from 'formik';
import { CheckCircleOutline } from '@material-ui/icons';
import moment from 'moment';
import TreeSelect from '../../ui/treeSelect';
import {
  identityTypeOptsV2, roleTypes, companySizeData, jobTitleType, personTypeOpts, tutorTimeList, location, moneyData, targetData, defaultMoneyData, partnerCountData, sexTitle, demandExperienceData, caseRoleTypes, timeList
} from '../../../config/selectData';
import { getContentByCat, caseTreeData } from '../../../config/demandPublish';
import Button from '../../ui/button';
import styles from './JoinOtherCaseForm.scss';
import { MAX_LENGTH, acDateFormat } from '../../../config/constant.js';
import { validateJoinCaseDemand } from '../../../util/yupUtil';
import config from '../../../config/config';
import { alertSubmitForm } from '../../../util/messageUtil';
import ScrollToError from '../../../containers/common_v2/ScrollToError';
// import { DebugFormik } from '../../util/DebugFormik';

const { TextArea } = Input;
const { Option } = Select;
const { info } = Modal;

class OtherCaseForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      info: null
    };
  }

  onHandelInfo = () => {
    const arr = this.state.info.split('\n');

    info({
      icon: false,
      okText: '關閉',
      content: (
        <div className={styles.infoWrap}>
          {
            arr.map((item, index) => {
              return (
                <p key={index}>
                  {item}
                </p>
              );
            })
        }
        </div>
      ),
      onOk() {},
    });
  }

  renderPartnerOptions = (
    partnerCountData.map(item => (
      <Option key={item.id} value={item.value}>{item.title}</Option>
    ))
  );

  renderTargetOptions = (
    targetData.map(item => (
      <Option key={item.id} value={item.id}>{item.title}</Option>
    ))
  );

  renderExpOptions = (
    demandExperienceData.map(item => (
      <Option key={item.id} value={item.id}>{item.title}</Option>
    ))
  );

  renderTutorTimeListOptions = (
    tutorTimeList.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ))
  );

  renderRoleTypeOptions = (jobOccupation) => {
    const isSelectAll = jobOccupation.find(value => value === 0) === caseRoleTypes[0].value;
    const options = caseRoleTypes.map((item) => {
      if (item.value === 0) {
        return (<Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>);
      } else {
        return (<Checkbox key={item.value} value={item.value} disabled={isSelectAll}>{item.label}</Checkbox>);
      }
    });
    return options;
  };

  onAreaClick = (validateField, setFieldValue, currentValue, fieldName) => {
    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '服務地區',
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
          setFieldValue(fieldName, { des, no });
          validateField(fieldName);
        },
      });
    }
  }

  onIndustClick = (validateField, setFieldValue, currentValue, fieldName) => {
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
          const no = item ? item.no : '';
          setFieldValue(fieldName, { des, no });
          validateField(fieldName);
        },
      });
    }
  }

    // 更新聯絡人表單
    onUpdateUserForm = (isLoadingUserForm, setFieldValue, enableUserData) => {
      const {
        firstName, familyName, sex, cellphone, telArea, tel, emailInfo
      } = enableUserData;

      if (isLoadingUserForm) {
        setFieldValue('name', `${familyName}${firstName}`);
        setFieldValue('sex', sex);
        setFieldValue('cellphone', cellphone);
        setFieldValue('telArea', telArea);
        setFieldValue('tel', tel);
        setFieldValue('email', emailInfo.email);
      } else {
        setFieldValue('name', '');
        setFieldValue('sex', '');
        setFieldValue('cellphone', '');
        setFieldValue('telArea', '');
        setFieldValue('tel', '');
        setFieldValue('email', '');
      }
    }

    renderRoleTypeField = (values, setFieldValue, validateField) => {
      const { chosenRole } = values.enableUserData;
      const isPersonal = chosenRole === personTypeOpts[0].value;
      const isIndustry = chosenRole === personTypeOpts[1].value;
      if (isPersonal) {
        return (
          <>
            <div className={styles.field}>
              <label>生日</label>
              <DatePicker
                name="enableUserData.birthday"
                placeholder="1900-01-01"
                value={moment(values.enableUserData.birthday, acDateFormat)}
                allowClear={false}
                onChange={dateString => setFieldValue('enableUserData.birthday', dateString.format(acDateFormat))}
                disabled={values.enableUserData.disabledBirthday}
              />
              <ErrorMessage name="enableUserData.birthday">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>身份資料</label>
              <Field
                name="enableUserData.identityType"
                render={({ field }) => (
                  <Radio.Group
                    {...field}
                    id="enableUserData.identityType"
                    options={identityTypeOptsV2}
                    disabled={values.enableUserData.disabledIdentityType}
                  />
                )}
              />
              <Field
                name="enableUserData.identity"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="enableUserData.identity"
                    placeholder="請輸入身分證或護照號碼"
                    disabled={values.enableUserData.disabledIdentity}
                  />
                )}
              />
              <ErrorMessage name="enableUserData.identity">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>身份類別</label>
              <Field
                name="enableUserData.roleType"
                render={({ field }) => (
                  <Select
                    {...field}
                    id="enableUserData.roleType"
                    placeholder="請選擇身份類別"
                    onChange={value => setFieldValue('enableUserData.roleType', value)}
                  >
                    {roleTypes.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>)}
                  </Select>
                )}
              />
              <ErrorMessage name="enableUserData.roleType">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
          </>
        );
      } else if (isIndustry) {
        return (
          <>
            <div className={styles.field}>
              <label>公司名稱</label>
              <Field
                name="enableUserData.companyName"
                render={({ field }) => (
                  <Input id="enableUserData.companyName" {...field} placeholder="請輸入公司名稱" />
                )}
              />
              <ErrorMessage name="enableUserData.companyName">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>統一編號</label>
              <Field
                name="enableUserData.invoice"
                render={({ field }) => (
                  <Input id="enableUserData.invoice" {...field} placeholder="請輸入統一編號" />
                )}
              />
              <ErrorMessage name="enableUserData.invoice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>公司規模</label>
              <Field
                name="enableUserData.employeeCount"
                render={({ field }) => (
                  <Select
                    {...field}
                    name="enableUserData.employeeCount"
                    onChange={value => setFieldValue('enableUserData.employeeCount', value)}
                    value={values.enableUserData.employeeCount}
                  >
                    {
                  companySizeData.map((option) => {
                    return <Option key={option.value} value={option.value}>{option.lable}</Option>;
                  })
                }
                  </Select>
                )}
              />
              <ErrorMessage name="enableUserData.employeeCount">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>產業類型</label>
              <Field
                name="enableUserData.industry"
                render={({ field }) => (
                  <div
                    {...field}
                    className={styles.industry}
                    onClick={() => this.onIndustClick(validateField, setFieldValue, values.enableUserData.industry.no, 'enableUserData.industry')}
                  >
                    { values.enableUserData.industry?.des || '請選擇產業類型'}
                    <Icon type="down" />
                  </div>
                )}
              />
              <ErrorMessage name="enableUserData.industry.des">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>你的職稱</label>
              <Field
                name="enableUserData.jobTitle"
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={value => setFieldValue('enableUserData.jobTitle', value)}
                    value={values.enableUserData.jobTitle}
                  >
                    { jobTitleType.map(option => <Option key={option.value} value={option.value}>{option.lable}</Option>)}
                  </Select>
                )}
              />
              <ErrorMessage name="enableUserData.jobTitle">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
          </>
        );
      } else {
        return <></>;
      }
    }

  renderForm = (props) => {
    const {
      handleSubmit, handleReset, values, errors, setFieldValue, validateField, setFieldTouched
    } = props;
    const {
      onPrev, isModifiedDemand, isLoadingDemandForm, isSubmitting
    } = this.props;
    const {
      enableUserData, demandCategory, unit, minPrice, maxPrice, placeType, desc, cellphone, tel, telArea, jobOccupation, contactTimeBegin, contactTimeEnd
    } = values;
    const minimumOfMinPrice = unit === moneyData[0].value ? defaultMoneyData.minCase : defaultMoneyData.minHourRate;
    const minimumOfMaxPrice = minPrice || minimumOfMinPrice;
    const step = defaultMoneyData.step;
    // 使用者是否手機號碼與區域號碼二擇一
    const isPhoneFilled = (cellphone !== '' && cellphone !== null) || (telArea !== '' && tel !== '' && telArea !== null && tel !== null);
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <ScrollToError {...props} />
        <h2 className={styles.formType}>需求資訊</h2>
        <div className={styles.demandFormWrap}>
          <div className={styles.field}>
            <label className={styles.fieldName}>需求類別</label>
            {!isLoadingDemandForm && (
            <Field
              name="demandCategory"
              render={({ field }) => {
                return (
                  <TreeSelect
                    {...field}
                    type="demand"
                    cats={demandCategory}
                    isModified={isModifiedDemand}
                    onCatsChange={payload => setFieldValue('demandCategory', payload.cats)}
                    style={styles.catSelect}
                    treeData={caseTreeData}
                    isDescNotEmpty={desc}
                    onDescChange={(changeCat) => {
                      const descTemplate = getContentByCat(changeCat);
                      if (descTemplate) {
                        this.setState({
                          info: descTemplate
                        });
                      }
                    }}
                  />
                );
              }}
            />
            )
  }
            <ErrorMessage name="demandCategory">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>

          <div className={styles.field}>
            <label>需求標題(最多20字)</label>
            <Field
              name="title"
              render={({ field }) => {
                return (
                  <Input
                    className={errors.title ? `${styles.title} ${styles.errorBord}` : styles.title}
                    {...field}
                    placeholder="請填需求標題"
                    maxLength={MAX_LENGTH.title}
                  />
                );
              }}
            />
            <ErrorMessage name="title">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={styles.field}>
            <div className={styles.field}>
              <label>需求預算範圍<a href={`${config.contentSite.domain}/price/`} target="_blank" style={{ margin: 'auto 10px' }}>成交行情參考</a></label>
            </div>
            <div className={styles.field}>
              <Field
                name="unit"
                render={({ field }) => (
                  <Radio.Group
                    {...field}
                    id="unit"
                    options={moneyData}
                  />
                )}
              />
            </div>
            <div className={styles.field}>
                  &nbsp; 台幣 &nbsp;
              <Field
                name="minPrice"
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    className={`${errors.minPrice ? styles.errorBord : ''}`}
                    min={minimumOfMinPrice}
                    step={step}
                    defaultValue={minPrice}
                    onChange={value => setFieldValue('minPrice', value)}
                  />
                )}
              />
                  &nbsp; ~ &nbsp;
              <Field
                name="maxPrice"
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    className={`${errors.maxPrice ? styles.errorBord : ''}`}
                    min={minimumOfMaxPrice}
                    step={step}
                    defaultValue={maxPrice}
                    onChange={value => setFieldValue('maxPrice', value)}
                  />
                )}
              />
                  &nbsp; 元
            </div>
            <ErrorMessage name="unit">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            <ErrorMessage name="minPrice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            <ErrorMessage name="maxPrice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={styles.field}>
            <label>指定服務地點</label>
            <Field
              name="placeType"
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  className={`${errors.placeType ? styles.errorBord : ''}`}
                  options={location}
                  onChange={(event) => {
                    const currentPlaceType = event.target.value;
                    setFieldValue('placeType', event.target.value);
                    if (currentPlaceType === 'no') {
                      setFieldValue('classPlace', []);
                      setFieldValue('classPlaceDesc', '');
                    }
                  }}
                />
              )}
            />
          </div>
          {
                placeType === 'yes' && !isLoadingDemandForm
                && (
                <div className={styles.field}>
                  <Field
                    name="assignPlace"
                    render={({ field }) => (
                      <div
                        {...field}
                        className={`${errors.assignPlace ? styles.errorBord : ''} ${styles.county}`}
                        onClick={() => this.onAreaClick(validateField, setFieldValue, values.assignPlace.no, 'assignPlace')}
                      >
                        { values.assignPlace.des || '請選擇指定地點' }
                        <Icon type="down" />
                      </div>
                    )}
                  />
                  <ErrorMessage name="assignPlace.no">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                </div>
                )
              }
          <div className={styles.field}>
            <label>徵求人數</label>
            <Field
              name="partnerCount"
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${errors.partnerCount ? styles.errorBord : ''}`}
                  style={{ width: '150px' }}
                  onChange={value => setFieldValue('partnerCount', value)}
                  value={values.partnerCount}
                >
                  { this.renderPartnerOptions }
                </Select>
              )}
            />
          </div>
          <div className={styles.field}>
            <label>接案經驗</label>
            <Field
              name="experience"
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${errors.experience ? styles.errorBord : ''}`}
                  style={{ width: '150px' }}
                  onChange={value => setFieldValue('experience', value)}
                  value={values.experience}
                >
                  { this.renderExpOptions }
                </Select>
              )}
            />
            <ErrorMessage name="experience">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={styles.field}>
            <label>希望接案身份</label>
            <Field
              name="jobOccupation"
              render={({ field }) => (
                <Checkbox.Group
                  {...field}
                  className={`${errors.jobOccupation ? styles.errorBord : ''}`}
                  style={{ width: '100%' }}
                  onChange={value => setFieldValue('jobOccupation', value)}
                  value={values.jobOccupation}
                >
                  { this.renderRoleTypeOptions(jobOccupation)}
                </Checkbox.Group>
              )}
            />
            <ErrorMessage name="jobOccupation">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={styles.field}>
            <label>需求描述 (詳細填寫可提升高手主動應徵意願){this.state.info && <a onClick={this.onHandelInfo} style={{ margin: 'auto 10px' }}>描述參考範例</a>}</label>
            <Field
              name="desc"
              render={({ field }) => (
                <TextArea
                  {...field}
                  className={errors.desc ? `${styles.errorBord} ${styles.desc}` : styles.desc}
                  autoSize={{ minRows: 5 }}
                  maxLength={MAX_LENGTH.desc}
                />
              )}
            />
            <ErrorMessage name="desc">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
          </div>
        </div>
        <Divider />
        <div className={`${styles.memberForm}`}>
          <h2 className={styles.formType}>會員資料</h2>
          <p className={styles.remind}>請完成會員資料填寫，即可使用104高手發案服務。會員資料不公開，僅供客服驗證聯繫使用。</p>
          <div className={`${styles.field}`}>
            <label>姓名：{values.enableUserData.familyName}{values.enableUserData.firstName}</label>
            <Field
              name="enableUserData.sex"
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  className={`${errors.enableUserData?.sex ? styles.errorBord : ''}`}
                  options={sexTitle}
                  disabled={values.enableUserData.disabledSex}
                />
              )}
            />
          </div>
          <div className={`${styles.field}`}>
            <label>啟用104高手服務身份</label>
            <Field
              name="enableUserData.chosenRole"
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  className={`${errors.enableUserData?.chosenRole ? styles.errorBord : ''}`}
                  options={personTypeOpts}
                  onChange={(event) => {
                    const chosenRole = event.target.value;
                    const isPersonal = chosenRole === personTypeOpts[0].value;
                    setFieldValue('enableUserData.chosenRole', chosenRole);
                    // https://formik.org/docs/api/formik#setfieldtouched-field-string-istouched-boolean-shouldvalidate-boolean--void
                    if (isPersonal) {
                      // 切換身份為個人時，不顯示公司欄位驗證錯誤訊息
                      setFieldTouched('enableUserData.companyName', false);
                      setFieldTouched('enableUserData.invoice', false);
                      setFieldTouched('enableUserData.employeeCount', false);
                      setFieldTouched('enableUserData.industry', false);
                      setFieldTouched('enableUserData.jobTitle', false);
                    } else {
                      // 切換身份為公司時，不顯示個人欄位驗證錯誤訊息
                      setFieldTouched('enableUserData.roleType', false);
                      setFieldTouched('enableUserData.birthday', false);
                      setFieldTouched('enableUserData.identityType', false);
                      setFieldTouched('enableUserData.identity', false);
                    }
                  }}
                />
              )}
            />
          </div>
          { this.renderRoleTypeField(values, setFieldValue, validateField) }
          <div className={styles.field}>
            <label>通訊/發票寄送地址</label>
            <div className={`${styles.field} ${styles.addressField}`}>
              <Field
                name="postAddress"
                render={({ field }) => {
                  return (
                    <div
                      {...field}
                      className={`${errors.postAddress ? styles.errorBord : ''} ${styles.county}`}
                      onClick={() => this.onAreaClick(validateField, setFieldValue, values.postAddress.no, 'postAddress')}
                    >
                      {values.postAddress.des || '請選擇地區'}
                      <Icon type="down" />
                    </div>
                  );
                }}
              />
              <Field
                name="enableUserData.address"
                render={({ field }) => (
                  <Input
                    {...field}
                    className={`${errors.enableUserData?.address ? styles.errorBord : ''} ${styles.address}`}
                    id="enableUserData.address"
                    placeholder="路名巷弄號樓"
                  />
                )}
              />
            </div>
            <ErrorMessage name="postAddress.des">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            <ErrorMessage name="enableUserData.address">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={styles.field}>
            <label>電子信箱
              { enableUserData.emailInfo.isVerified == 'true' && <span className={`${styles.checkIcon} ${styles.verification}`}><CheckCircleOutline />已驗證</span>}
              { enableUserData.emailInfo.isVerified == 'false' && <span className={styles.checkIcon}><CheckCircleOutline /> 未驗證</span> }
            </label>
            <div>
              { enableUserData.emailInfo.isVerified == 'true' && enableUserData?.emailInfo?.email}
              { enableUserData.emailInfo.isVerified == 'false' && (
                <Field
                  name="enableUserData.emailInfo.email"
                  render={({ field }) => (
                    <Input
                      id="enableUserData.emailInfo.email"
                      disabled
                      {...field}
                      className={`${errors.enableUserData?.emailInfo?.email ? styles.errorBord : ''}`}
                      placeholder="請輸入電子信箱"
                    />
                  )}
                />
              )
            }
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.subTitle}>聯絡電話</label>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldName}>行動電話</label>
            <Field
              name="enableUserData.cellphone"
              render={({ field }) => (
                <Input
                  {...field}
                  className={`${errors.enableUserData?.cellphone ? styles.errorBord : ''}`}
                  id="enableUserData.cellphone"
                  placeholder="請輸入行動電話"
                />
              )}
            />
            <ErrorMessage name="enableUserData.cellphone">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldName}>室內電話</label>
            <div className={styles.phoneField}>
              <Field
                name="enableUserData.telArea"
                render={({ field }) => (
                  <Input
                    {...field}
                    className={`${errors.enableUserData?.telArea ? styles.errorBord : ''} ${styles.telArea}`}
                    id="enableUserData.telArea"
                    placeholder="區碼"
                  />
                )}
              />
              <Field
                name="enableUserData.tel"
                render={({ field }) => (
                  <Input
                    {...field}
                    className={`${errors.enableUserData?.tel ? styles.errorBord : ''} ${styles.tel}`}
                    id="enableUserData.tel"
                    placeholder="電話號碼，分機請輸入#"
                  />
                )}
              />
            </div>
            <ErrorMessage name="enableUserData.telArea">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
            <ErrorMessage name="enableUserData.tel">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
          </div>
        </div>
        <Divider />
        <div className={`${styles.field} ${styles.specWrap} ${styles.flex}`}>
          <h2 className={styles.formType}>需求聯絡人資料</h2>
          <Checkbox
            style={{ marginLeft: '10px' }}
            onChange={event => this.onUpdateUserForm(event.target.checked, setFieldValue, enableUserData)}
          >帶入會員資料
          </Checkbox>
        </div>
        <div className={`${styles.field} ${styles.flex}`}>
          <label className={styles.userName}>姓名</label>
          <Field
            name="name"
            render={({ field }) => (
              <Input
                className={`${styles.name} ${errors.name ? styles.errorBord : ''}`}
                {...field}
                placeholder="請填寫姓名"
              />
            )}
          />
          <Field
            name="sex"
            render={({ field }) => (
              <Radio.Group
                className={`${styles.sex} ${errors.sex ? styles.errorBord : ''}`}
                {...field}
                options={sexTitle}
              />
            )}
          />
        </div>
        <div className={styles.field}>
          <ErrorMessage name="name">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
        </div>
        <div className={styles.field}>
          <ErrorMessage name="sex">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={styles.field}>
          <label>可聯絡時間</label>
          <Field
            name="contactTime"
            render={({ field }) => {
              return (
                <Radio.Group
                  {...field}
                  className={styles.contactTimes}
                  defaultValue="0"
                  onChange={(event) => {
                    const contactTime = event.target.value;
                    const currentValue = contactTime && contactTime.split('-');
                    if (currentValue && currentValue.length === 2) {
                      setFieldValue('contactTime', contactTime);
                      setFieldValue('contactTimeBegin', Number(currentValue[0]));
                      setFieldValue('contactTimeEnd', Number(currentValue[1]));
                    } else {
                      setFieldValue('contactTime', contactTime);
                      setFieldValue('contactTimeBegin', null);
                      setFieldValue('contactTimeEnd', null);
                    }
                  }}
                >
                  { timeList.map(time => <Radio className={styles.contactTimeRadio} key={time.value} value={time.value}>{time.label}</Radio>) }
                  <Radio key="0" value="0">
                    自訂：
                    <Field
                      name="contactTimeBegin"
                      render={({ beginField }) => (
                        <Select
                          {...beginField}
                          style={{ width: '90px', margin: 'auto 10px' }}
                          onChange={value => setFieldValue('contactTimeBegin', value)}
                          value={values.contactTime === '0' && contactTimeBegin}
                        >
                          { this.renderTutorTimeListOptions }
                        </Select>
                      )}
                    />
                    <span>～</span>
                    <Field
                      name="contactTimeEnd"
                      render={({ endField }) => {
                        return (
                          <Select
                            {...endField}
                            style={{ width: '90px', margin: 'auto 10px' }}
                            onChange={value => setFieldValue('contactTimeEnd', value)}
                            value={values.contactTime === '0' && (contactTimeEnd < contactTimeBegin ? '請選擇' : contactTimeEnd)}
                          >
                            { this.renderTutorTimeListOptions }
                          </Select>
                        );
                      }}
                    />
                  </Radio>
                </Radio.Group>
              );
            }}
          />
          { contactTimeBegin && contactTimeEnd && contactTimeEnd <= contactTimeBegin && <p className={styles.error}>所選的結束時間需早於起始時間，請再確認</p> }
          <ErrorMessage name="contactTimeBegin">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="contactTimeEnd">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={styles.field}>
          <label className={styles.subTitle}>聯絡電話(至少擇一填寫)</label>
          <span className={styles.fieldName}>行動電話</span>
          <div className={styles.field}>
            <Field
              name="cellphone"
              render={({ field }) => (
                <Input
                  id="cellphone"
                  className={`${styles.cellphone} ${errors.cellphone ? styles.errorBord : ''}`}
                  {...field}
                  placeholder="請輸入行動電話"
                />
              )}
            />
            <ErrorMessage name="cellphone">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={`${styles.telWrap}`}>
            <span className={styles.fieldPublishTitle}>室內電話</span>
            <div className={`${styles.field}`}>
              <div className={`${styles.flex}`}>
                <Field
                  name="telArea"
                  render={({ field }) => (
                    <Input
                      id="telArea"
                      className={`${styles.telArea} ${errors.telArea ? styles.errorBord : ''}`}
                      {...field}
                      placeholder="電話區碼"
                    />
                  )}
                />
                <Field
                  name="tel"
                  render={({ field }) => (
                    <Input
                      id="tel"
                      className={`${styles.tel} ${errors.tel ? styles.errorBord : ''}`}
                      {...field}
                      placeholder="請輸入電話"
                    />
                  )}
                />
              </div>
            </div>
            <ErrorMessage name="telArea">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
            <ErrorMessage name="tel">
              {msg => <span className={styles.error}>{msg}</span>}
            </ErrorMessage>
            { !isPhoneFilled && <span className={styles.error}>聯絡電話請擇一填寫</span>}
          </div>
        </div>
        <div className={styles.field}>
          <label>電子郵件</label>
          <Field
            name="email"
            render={({ field }) => (
              <Input
                id="email"
                className={`${styles.email} ${errors.email ? styles.errorBord : ''}`}
                {...field}
                placeholder="電子郵件"
              />
            )}
          />
          <ErrorMessage name="email">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldPublishTitle}>其他聯絡方式或備註說明(非必填)</span>
          <Field
            name="otherContactWay"
            render={({ field }) => (
              <TextArea
                {...field}
                className={`${styles.otherContactWay} ${errors.otherContactWay ? styles.errorBord : ''}`}
                maxLength={MAX_LENGTH.otherContactWay}
                autoSize={{ minRows: 5 }}
              />
            )}
          />
        </div>
        <div className={`${styles.field}`}>
          <Field
            name="spec"
            render={({ field }) => (
              <Checkbox
                {...field}
                className={`${errors.spec ? styles.errorBord : ''}`}
              >
                  &nbsp;&nbsp;同意啟用並已詳細閱讀且接受<a href={`${config.contentSite.domain}/guarantee_deposit/`} target="_blank">104高手會員服務條款</a>
              </Checkbox>
            )}
          />
          <ErrorMessage name="spec">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={`${styles.field}`}>
          <Checkbox
            onClick={(event) => {
              const checked = event.target.checked;
              let subscribeEpaperId = [...values.enableUserData.subscribeEpaperId];
              let unSubscribeEpaperId = [...values.enableUserData.unSubscribeEpaperId];
              if (checked) {
                subscribeEpaperId.push(305);
                unSubscribeEpaperId = unSubscribeEpaperId.filter(value => value !== 305);
              } else {
                subscribeEpaperId = subscribeEpaperId.filter(value => value !== 305);
                unSubscribeEpaperId.push(305);
              }
              setFieldValue('enableUserData.subscribeEpaperId', subscribeEpaperId);
              setFieldValue('enableUserData.unSubscribeEpaperId', unSubscribeEpaperId);
            }}
            checked={values.enableUserData.subscribeEpaperId.includes(305)}
          >&nbsp;&nbsp;訂閱104高手發案找人才資訊報
          </Checkbox>
        </div>
        <div className={styles.btnWrap}>
          <Button onClick={() => handleReset(onPrev())}>取消刊登</Button>
          <Button onClick={() => alertSubmitForm(errors)} type="primary" htmlType="submit" loading={isSubmitting}>儲存進下一步</Button>
        </div>
        {/* <DebugFormik /> */}
      </form>
    );
  };

  render() {
    const {
      initialData, onSubmit, formRef, isInitializeForm
    } = this.props;
    return (
      <Formik
        ref={formRef}
        initialValues={initialData}
        onSubmit={onSubmit}
        validationSchema={validateJoinCaseDemand}
        render={this.renderForm}
        enableReinitialize={isInitializeForm}
      />
    );
  }
}

export default OtherCaseForm;
