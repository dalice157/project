import React, { PureComponent } from 'react';
import {
  Input, Radio, Select, InputNumber, Checkbox, Icon, Spin, Modal, Divider
} from 'antd';
import { Field, ErrorMessage, Formik } from 'formik';
import TreeSelect from '../../ui/treeSelect';
import {
  tutorTimeList, location, moneyData, targetData, defaultMoneyData, partnerCountData, sexTitle, demandExperienceData, caseRoleTypes, timeList
} from '../../../config/selectData';
import { getContentByCat, caseTreeData } from '../../../config/demandPublish';
import Button from '../../ui/button';
import styles from './OtherCaseForm.scss';
import { MAX_LENGTH } from '../../../config/constant.js';
import { validateCaseDemandV3 } from '../../../util/yupUtil';
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

  onAreaClick = (validateField, setFieldValue, currentValue) => {
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
          setFieldValue('assignPlace', { des, no });
          validateField('assignPlace');
        },
      });
    }
  }

  // 更新聯絡人表單
  onUpdateUserForm = (event, setFieldValue) => {
    const {
      familyName, firstName, sex, cellphoneRecord, telArea, tel, emailInfo
    } = this.props.defaultDemanderForm;

    if (event.target.checked) {
      setFieldValue('name', `${familyName}${firstName}`);
      setFieldValue('sex', sex);
      setFieldValue('cellphone', cellphoneRecord.cellphone);
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

  renderForm = (props) => {
    const {
      onPrev, isModifiedDemand, isLoadingDemandForm, isSubmitting
    } = this.props;
    const {
      handleSubmit, handleReset, values, errors, setFieldValue, validateField
    } = props;
    const {
      demandCategory, unit, minPrice, maxPrice, placeType, desc, cellphone, tel, telArea, jobOccupation, contactTimeBegin, contactTimeEnd
    } = values;
    const minimumOfMinPrice = unit === moneyData[0].value ? defaultMoneyData.minCase : defaultMoneyData.minHourRate;
    const minimumOfMaxPrice = minPrice || minimumOfMinPrice;
    const step = defaultMoneyData.step;
    // 使用者是否手機號碼與區域號碼二擇一
    const isPhoneFilled = (cellphone !== '' && cellphone !== null) || (telArea !== '' && tel !== '' && telArea !== null && tel !== null);
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <ScrollToError {...props} />
        <Spin tip="讀取案件中" size="large" spinning={isLoadingDemandForm}>
          <h2 className={styles.formType}>需求資訊</h2>
          <div className={styles.demandFormWrap}>
            <div className={styles.field}>
              <label>需求類別</label>
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
            <div className={styles.field}>
              <label>指定服務地點</label>
              <Field
                name="placeType"
                render={({ field }) => (
                  <Radio.Group
                    {...field}
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
                        className={styles.county}
                        onClick={() => this.onAreaClick(validateField, setFieldValue, values.assignPlace.no)}
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
              <label className={styles.inlineField}>希望接案身份</label>
              <Field
                name="jobOccupation"
                render={({ field }) => (
                  <Checkbox.Group
                    {...field}
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
        </Spin>
        <Divider />
        <Spin tip="讀取聯絡人資料中" size="large" spinning={isLoadingDemandForm}>
          <div className={`${styles.field} ${styles.specWrap} ${styles.flex}`}>
            <h2 className={styles.formType}>需求聯絡人資料</h2>
            <Field
              name="spec"
              render={({ field }) => (
                <Checkbox
                  {...field}
                  style={{ marginLeft: '10px' }}
                  onChange={event => this.onUpdateUserForm(event, setFieldValue)}
                >帶入會員資料
                </Checkbox>
              )}
            />
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
                            style={{ width: '100px', margin: 'auto 10px' }}
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
                              style={{ width: '100px', margin: 'auto 10px' }}
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
            <label>聯絡電話(至少擇一填寫)</label>
            <div className={styles.field}>
              <span className={styles.fieldPublishTitle}>行動電話</span>
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
            <div className={styles.field}>
              <span className={styles.fieldPublishTitle}>室內電話</span>
              <div className={`${styles.telWrap} ${styles.flex}`}>
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
              <ErrorMessage name="telArea">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
              <ErrorMessage name="tel">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
            { !isPhoneFilled && <span className={styles.error}>聯絡電話請擇一填寫</span>}
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
          <div className={styles.btnWrap}>
            <Button onClick={() => handleReset(onPrev())}>取消刊登</Button>
            <Button onClick={() => alertSubmitForm(errors)} type="primary" htmlType="submit" loading={isSubmitting}>儲存進下一步</Button>
          </div>
          {/* <DebugFormik /> */}
        </Spin>
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
        validationSchema={validateCaseDemandV3}
        render={this.renderForm}
        enableReinitialize={isInitializeForm}
      />
    );
  }
}

export default OtherCaseForm;
