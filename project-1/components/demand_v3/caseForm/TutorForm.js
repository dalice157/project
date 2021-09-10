import React, { PureComponent } from 'react';
import {
  Input, Radio, Select, InputNumber, Checkbox, Icon, Spin, Divider
} from 'antd';
import { Field, ErrorMessage, Formik } from 'formik';
import TreeSelect from '../../ui/treeSelect';
import {
  location, moneyData, targetData, defaultMoneyData, partnerCountData, sexTitle, demandExperienceData, tutorRoleTypes, tutorSexes, tutorFrequency, tutorFrequencyCount, tutorFrequencyHour, tutorFrequencyWeek, tutorTimeList, tutorGrade, teachTypes, teachDurationTypes, teachPlaceTypes, timeList
} from '../../../config/selectData';
import { tutorTreeData } from '../../../config/demandPublish';
import Button from '../../ui/button';
import styles from './TutorForm.scss';
import { MAX_LENGTH } from '../../../config/constant.js';
import config from '../../../config/config';
import { alertSubmitForm } from '../../../util/messageUtil';
import ScrollToError from '../../../containers/common_v2/ScrollToError';
import { validateTutorDemandV3 } from '../../../util/yupUtil';
// import { DebugFormik } from '../../util/DebugFormik';

const { TextArea } = Input;
const { Option } = Select;

class TutorForm extends PureComponent {
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

  renderRoleTypeOptions = (jobOccupation) => {
    const isSelectAll = jobOccupation.find(value => value === 0) === tutorRoleTypes[0].value;
    const options = tutorRoleTypes.map((item) => {
      if (item.value === 0) {
        return (<Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>);
      } else {
        return (<Checkbox key={item.value} value={item.value} disabled={isSelectAll}>{item.label}</Checkbox>);
      }
    });
    return options;
  };

  renderTutorFrequencyOptions = (
    tutorFrequency.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ))
  );

  renderTutorFrequencyCountOptions = (
    tutorFrequencyCount.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ))
  );

  renderTutorFrequencyHourOptions = (
    tutorFrequencyHour.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ))
  );

  renderTutorTimeListOptions = (
    tutorTimeList.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ))
  );

  renderTutorGradeOptions = (target) => {
    switch (target) {
      case targetData[1].id: {
        return tutorGrade.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
      }
      case targetData[2].id:
      case targetData[3].id: {
        return tutorGrade.slice(0, 3).map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
      }
      default: {
        break;
      }
    }
  }

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
    onUpdateUserForm = (isLoadingUserForm, setFieldValue) => {
      const {
        familyName, firstName, sex, cellphoneRecord, telArea, tel, emailInfo
      } = this.props.defaultDemanderForm;

      if (isLoadingUserForm) {
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
      handleSubmit, handleReset, values, errors, setFieldValue, validateField
    } = props;
    const {
      onPrev, isModifiedDemand, isSubmitting, isLoadingDemandForm
    } = this.props;
    const {
      demandCategory, unit, minPrice, maxPrice, placeType, educationalStage, desc, cellphone, tel, telArea, classEveryWeekHourBegin, classEveryWeekHourEnd, educationalGrade, classFrequencyHour, jobOccupation, contactTimeBegin, contactTimeEnd
    } = values;
    const minimumOfMinPrice = unit === moneyData[0].value ? defaultMoneyData.minCase : defaultMoneyData.minHourRate;
    const minimumOfMaxPrice = minPrice || minimumOfMinPrice;
    const step = defaultMoneyData.step;
    // 使用者是否手機號碼與區域號碼二擇一
    const isPhoneFilled = (cellphone !== '' && cellphone !== null) || (telArea !== '' && tel !== '' && telArea !== null && tel !== null);
    // 時間區間驗證
    const endTimeWithWeekHour = (classEveryWeekHourBegin + 100 * Math.floor(classFrequencyHour) + ((classFrequencyHour - Math.floor(classFrequencyHour)) === 0.5 ? 30 : 0));
    const needEducationalGrade = educationalStage && targetData[1].id <= educationalStage && educationalStage <= targetData[3].id;
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <ScrollToError {...props} />
        <Spin tip="讀取案件中" size="large" spinning={isLoadingDemandForm}>
          <h2 className={styles.formType}>需求資訊</h2>
          <div className={styles.demandFormWrap}>
            <div className={styles.field}>
              <label>需求類別</label>
              {
                !isLoadingDemandForm && (
                <Field
                  name="demandCategory"
                  render={({ field }) => {
                    return (
                      <TreeSelect
                        {...field}
                        type="tutorDemand"
                        cats={demandCategory}
                        isModified={isModifiedDemand}
                        onCatsChange={payload => setFieldValue('demandCategory', payload.cats)}
                        style={styles.catSelect}
                        treeData={tutorTreeData}
                        isDescNotEmpty={desc}
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
                <label>需求預算範圍<a className={styles.priceLink} href={`${config.contentSite.domain}/price/`} target="_blank">成交行情參考</a></label>
                <p className={styles.remind}>提醒您：請於課程結束時支付學費，切勿預付學費，避免退費爭議。</p>
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
            </div>
            <div className={styles.field}>
              <label>指定上課地點</label>
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
                placeType === 'yes'
                && (
                  <>
                    <div className={styles.field}>
                      <Field
                        name="classPlace"
                        render={({ field }) => (
                          <Checkbox.Group
                            {...field}
                            onChange={value => setFieldValue('classPlace', value)}
                            value={values.classPlace}
                            options={teachPlaceTypes}
                          />
                        )}
                      />
                      <ErrorMessage name="classPlace">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                    </div>
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
                    <div className={styles.field}>
                      <label>附近明顯路標說明（非必填）</label>
                      <Field
                        name="classPlaceDesc"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="如：公館捷運站附近, 台灣大學附近; 南京東路與中山北路交叉口"
                          />
                        )}
                      />
                    </div>
                  </>
                )
              }
            <div className={styles.field}>
              <label>徵求老師人數</label>
              <Field
                name="partnerCount"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={styles.select}
                    onChange={value => setFieldValue('partnerCount', value)}
                    value={values.partnerCount}
                  >
                    { this.renderPartnerOptions }
                  </Select>
                )}
              />
            </div>
            <div className={styles.field}>
              <label>老師教學經驗</label>
              <Field
                name="experience"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={styles.select}
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
              <label className={styles.inlineField}>希望老師身份</label>
              <Field
                name="jobOccupation"
                render={({ field }) => (
                  <Checkbox.Group
                    {...field}
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
              <label>需求描述 (詳細填寫可提升高手主動應徵意願)</label>
              <div className={styles.field}>
                <label className={styles.remind}>
                  提醒您：根據
                  <a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=N0030014" target="_blank">性別工作平等法</a>
                  及
                  <a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=N0090001" target="_blank">就業服務法</a>
                  限制，於刊登家教案件時不得限制老師性別、國籍及年齡，讓優秀的家教老師群皆有機會為您服務。
                </label>
              </div>
              <Field
                name="desc"
                render={({ field }) => (
                  <TextArea
                    {...field}
                    className={errors.desc ? `${styles.errorBord} ${styles.desc}` : styles.desc}
                    autoSize={{ minRows: 5 }}
                    maxLength={MAX_LENGTH.desc}
                    placeholder="教學內容說明：1. 學生的學習狀況： 2. 想要加強哪些部分："
                  />
                )}
              />

              <ErrorMessage name="desc">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
            </div>
          </div>
        </Spin>
        <Divider />
        <Spin tip="讀取學生上課資訊中" size="large" spinning={isLoadingDemandForm}>
          <h2 className={styles.formType}>學生上課資訊</h2>
          <div className={`${styles.demandFormWrap}`}>
            <div className={styles.field}>
              <label>教學對象</label>
              <Field
                name="educationalStage"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${errors.educationalStage ? styles.errorBord : ''} ${styles.select}`}
                    defaultValue={educationalStage || '請選擇教學對象'}
                    onChange={(value) => {
                      setFieldValue('educationalStage', value);
                      setFieldValue('educationalGrade', null);
                    }}
                    value={educationalStage || '請選擇教學對象'}
                  >
                    { this.renderTargetOptions }
                  </Select>
                )}
              />
              <ErrorMessage name="educationalStage">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
            </div>
            { needEducationalGrade && (
            <div className={styles.field}>
              <label>教學年級</label>
              <Field
                name="educationalGrade"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${errors.educationalGrade ? styles.errorBord : ''} ${styles.select}`}
                    defaultValue="請選擇年級"
                    onChange={value => setFieldValue('educationalGrade', value)}
                    value={(educationalGrade || educationalGrade === 0) ? educationalGrade : '請選擇年級'}
                  >
                    { this.renderTutorGradeOptions(educationalStage) }
                  </Select>
                )}
              />
              <ErrorMessage name="educationalGrade">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
            </div>
            ) }
            <div className={styles.field}>
              <label>上課人數</label>
              <Field
                name="studentTotal"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={styles.select}
                    onChange={value => setFieldValue('studentTotal', value)}
                    value={values.studentTotal}
                  >
                    { this.renderPartnerOptions }
                  </Select>
                )}
              />
              <ErrorMessage name="studentTotal">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
            </div>
            <div className={`${styles.field}`}>
              <label>學生性別</label>
              <Field
                name="studentSex"
                render={({ field }) => (
                  <Radio.Group {...field} options={tutorSexes} />
                )}
              />
              <ErrorMessage name="studentSex">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={`${styles.field}`}>
              <label>希望上課方式</label>
              <Field
                name="classWay"
                render={({ field }) => (
                  <Checkbox.Group
                    {...field}
                    style={{ margin: 'auto 10px' }}
                    onChange={value => setFieldValue('classWay', value)}
                    value={values.classWay}
                    options={teachTypes}
                  />
                )}
              />
              <ErrorMessage name="classWay">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={`${styles.field}`}>
              <label>希望上課次數</label>
            </div>
            <div className={`${styles.field}`}>
              <span>每</span>
              <Field
                name="classFrequencyUnit"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${errors.classFrequencyUnit ? styles.errorBord : ''}`}
                    style={{ width: '80px', margin: 'auto 10px' }}
                    onChange={value => setFieldValue('classFrequencyUnit', value)}
                    value={values.classFrequencyUnit}
                  >
                    { this.renderTutorFrequencyOptions }
                  </Select>
                )}
              />
              <span>上課</span>
              <Field
                name="classFrequencyTime"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${errors.classFrequencyTime ? styles.errorBord : ''}`}
                    style={{ width: '80px', margin: 'auto 10px' }}
                    onChange={value => setFieldValue('classFrequencyTime', value)}
                    value={values.classFrequencyTime}
                  >
                    { this.renderTutorFrequencyCountOptions }
                  </Select>
                )}
              />
              <span>次</span>
            </div>
            <div className={`${styles.field}`}>
              <span>每次上課</span>
              <Field
                name="classFrequencyHour"
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: '80px', margin: 'auto 10px' }}
                    onChange={value => setFieldValue('classFrequencyHour', value)}
                    value={values.classFrequencyHour}
                  >
                    { this.renderTutorFrequencyHourOptions }
                  </Select>
                )}
              />
              <span>小時</span>
              <ErrorMessage name="classFrequencyUnit">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
              <ErrorMessage name="classFrequencyTime">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
              <ErrorMessage name="classFrequencyHour">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
            </div>
            <div className={`${styles.field}`}>
              <label>預計上課時間（若有需補充的可以在需求描述中說明）</label>
              <div className={styles.field}>
                <span>週間：</span>
                <Field
                  name="classEveryWeekDay"
                  render={({ field }) => (
                    <Checkbox.Group
                      {...field}
                      style={{ margin: 'auto 10px' }}
                      onChange={value => setFieldValue('classEveryWeekDay', value)}
                      value={values.classEveryWeekDay}
                      options={tutorFrequencyWeek}
                    />
                  )}
                />
                <ErrorMessage name="classEveryWeekDay">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
              </div>
              <div className={styles.field}>
                <span>時間：</span>
                <Field
                  name="classEveryWeekHourBegin"
                  render={({ field }) => (
                    <Select
                      {...field}
                      style={{ width: '80px', margin: 'auto 10px' }}
                      onChange={value => setFieldValue('classEveryWeekHourBegin', value)}
                      value={classEveryWeekHourBegin}
                    >
                      { this.renderTutorTimeListOptions }
                    </Select>
                  )}
                />
                <span>～</span>
                <Field
                  name="classEveryWeekHourEnd"
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        style={{ width: '80px', margin: 'auto 10px' }}
                        onChange={value => setFieldValue('classEveryWeekHourEnd', value)}
                        value={classEveryWeekHourEnd < classEveryWeekHourBegin ? '請選擇' : classEveryWeekHourEnd}
                      >
                        { this.renderTutorTimeListOptions }
                      </Select>
                    );
                  }}
                />
                { classEveryWeekHourBegin && classEveryWeekHourEnd && classEveryWeekHourEnd <= classEveryWeekHourBegin && <p className={styles.error}>結束時間需晚於開始時間</p> }
                { classEveryWeekHourEnd && (classEveryWeekHourEnd < endTimeWithWeekHour) && <p className={styles.error}>時間區間與希望時數不符</p> }
              </div>
              <ErrorMessage name="classEveryWeekHourBegin">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
              <ErrorMessage name="classEveryWeekHourEnd">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={`${styles.field}`}>
              <label>上課期限</label>
              <div className={styles.field}>
                <Field
                  name="classDuration"
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      options={teachDurationTypes}
                    />
                  )}
                />
                <ErrorMessage name="classDuration">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
              </div>
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
                  onChange={event => this.onUpdateUserForm(event.target.checked, setFieldValue)}
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
        validationSchema={validateTutorDemandV3}
        render={this.renderForm}
        enableReinitialize={isInitializeForm}
      />
    );
  }
}

export default TutorForm;
