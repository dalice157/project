import React, { PureComponent } from 'react';
import {
  Input, Radio, Select, InputNumber, Checkbox, Icon, DatePicker, Divider
} from 'antd';
import { Field, ErrorMessage, Formik } from 'formik';
import moment from 'moment';
import { CheckCircleOutline } from '@material-ui/icons';
import TreeSelect from '../../ui/treeSelect';
import {
  roleTypes, jobTitleType, identityTypeOptsV2, companySizeData, location, moneyData, targetData, defaultMoneyData, partnerCountData, sexTitle, demandExperienceData, tutorRoleTypes, tutorSexes, tutorFrequency, tutorFrequencyCount, tutorFrequencyHour, tutorFrequencyWeek, tutorTimeList, tutorGrade, teachTypes, teachDurationTypes, teachPlaceTypes, timeList, personTypeOpts
} from '../../../config/selectData';
import { tutorTreeData } from '../../../config/demandPublish';
import Button from '../../ui/button';
import styles from './JoinTutorForm.scss';
import { MAX_LENGTH, acDateFormat } from '../../../config/constant.js';
import config from '../../../config/config';
import { alertSubmitForm } from '../../../util/messageUtil';
import ScrollToError from '../../../containers/common_v2/ScrollToError';
import { validateJoinTutorDemand } from '../../../util/yupUtil';
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

  onAreaClick = (validateField, setFieldValue, currentValue, fieldName) => {
    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '????????????',
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
        title: '????????????',
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

    // ?????????????????????
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
              <label>??????</label>
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
              <label>????????????</label>
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
                    placeholder="?????????????????????????????????"
                    disabled={values.enableUserData.disabledIdentity}
                  />
                )}
              />
              <ErrorMessage name="enableUserData.identity">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>????????????</label>
              <Field
                name="enableUserData.roleType"
                render={({ field }) => (
                  <Select
                    {...field}
                    id="enableUserData.roleType"
                    placeholder="?????????????????????"
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
              <label>????????????</label>
              <Field
                name="enableUserData.companyName"
                render={({ field }) => (
                  <Input id="enableUserData.companyName" {...field} placeholder="?????????????????????" />
                )}
              />
              <ErrorMessage name="enableUserData.companyName">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>????????????</label>
              <Field
                name="enableUserData.invoice"
                render={({ field }) => (
                  <Input id="enableUserData.invoice" {...field} placeholder="?????????????????????" />
                )}
              />
              <ErrorMessage name="enableUserData.invoice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>????????????</label>
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
              <label>????????????</label>
              <Field
                name="enableUserData.industry"
                render={({ field }) => (
                  <div
                    {...field}
                    className={styles.industry}
                    onClick={() => this.onIndustClick(validateField, setFieldValue, values.enableUserData.industry.no, 'enableUserData.industry')}
                  >
                    { values.enableUserData.industry?.des || '?????????????????????'}
                    <Icon type="down" />
                  </div>
                )}
              />
              <ErrorMessage name="enableUserData.industry.des">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>????????????</label>
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
      onPrev, isModifiedDemand, isSubmitting, isLoadingDemandForm
    } = this.props;
    const {
      enableUserData, demandCategory, unit, minPrice, maxPrice, placeType, educationalStage, desc, cellphone, tel, telArea, classEveryWeekHourBegin, classEveryWeekHourEnd, educationalGrade, classFrequencyHour, jobOccupation, contactTimeBegin, contactTimeEnd
    } = values;
    const minimumOfMinPrice = unit === moneyData[0].value ? defaultMoneyData.minCase : defaultMoneyData.minHourRate;
    const minimumOfMaxPrice = minPrice || minimumOfMinPrice;
    const step = defaultMoneyData.step;
    // ???????????????????????????????????????????????????
    const isPhoneFilled = (cellphone !== '' && cellphone !== null) || (telArea !== '' && tel !== '' && telArea !== null && tel !== null);
    // ??????????????????
    const endTimeWithWeekHour = (classEveryWeekHourBegin + 100 * Math.floor(classFrequencyHour) + ((classFrequencyHour - Math.floor(classFrequencyHour)) === 0.5 ? 30 : 0));
    const needEducationalGrade = educationalStage && targetData[1].id <= educationalStage && educationalStage <= targetData[3].id;
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <ScrollToError {...props} />
        <h2 className={styles.formType}>????????????</h2>
        <div className={styles.demandFormWrap}>
          <div className={styles.field}>
            <label className={styles.fieldName}>????????????</label>
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
            <label>????????????(??????20???)</label>
            <Field
              name="title"
              render={({ field }) => {
                return (
                  <Input
                    className={errors.title ? `${styles.title} ${styles.errorBord}` : styles.title}
                    {...field}
                    placeholder="??????????????????"
                    maxLength={MAX_LENGTH.title}
                  />
                );
              }}
            />
            <ErrorMessage name="title">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={styles.field}>
            <div className={styles.field}>
              <label>??????????????????<a className={styles.priceLink} href={`${config.contentSite.domain}/price/`} target="_blank">??????????????????</a></label>
              <p className={styles.remind}>??????????????????????????????????????????????????????????????????????????????????????????</p>
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
                  &nbsp; ?????? &nbsp;
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
                  &nbsp; ???
            </div>
            <ErrorMessage name="unit">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            <ErrorMessage name="minPrice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            <ErrorMessage name="maxPrice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={styles.field}>
            <Field
              name="placeType"
              render={({ field }) => (
                <>
                  <p className={styles.fieldName}>??????????????????</p>
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
                </>
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
                            className={`${errors.classPlace ? styles.errorBord : ''}`}
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
                            className={`${errors.assignPlace ? styles.errorBord : ''} ${styles.county}`}
                            onClick={() => this.onAreaClick(validateField, setFieldValue, values.assignPlace.no, 'assignPlace')}
                          >
                            { values.assignPlace.des || '?????????????????????' }
                            <Icon type="down" />
                          </div>
                        )}
                      />
                      <ErrorMessage name="assignPlace.no">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                    </div>
                    <div className={styles.field}>
                      <label>???????????????????????????????????????</label>
                      <Field
                        name="classPlaceDesc"
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={`${errors.classPlaceDesc ? styles.errorBord : ''}`}
                            placeholder="???????????????????????????, ??????????????????; ????????????????????????????????????"
                          />
                        )}
                      />
                    </div>
                  </>
                )
              }
          <div className={styles.field}>
            <label>??????????????????</label>
            <Field
              name="partnerCount"
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${errors.partnerCount ? styles.errorBord : ''} ${styles.select}`}
                  onChange={value => setFieldValue('partnerCount', value)}
                  value={values.partnerCount}
                >
                  { this.renderPartnerOptions }
                </Select>
              )}
            />
          </div>
          <div className={styles.field}>
            <label>??????????????????</label>
            <Field
              name="experience"
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${errors.experience ? styles.errorBord : ''} ${styles.select}`}
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
            <label className={styles.fieldName}>??????????????????</label>
            <Field
              name="jobOccupation"
              render={({ field }) => (
                <Checkbox.Group
                  {...field}
                  className={`${errors.jobOccupation ? styles.errorBord : ''}`}
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
            <label>???????????? (?????????????????????????????????????????????)</label>
            <div className={styles.field}>
              <label className={styles.remind}>
                ??????????????????
                <a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=N0030014" target="_blank">?????????????????????</a>
                ???
                <a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=N0090001" target="_blank">???????????????</a>
                ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
                  placeholder="?????????????????????1. ???????????????????????? 2. ???????????????????????????"
                />
              )}
            />
            <ErrorMessage name="desc">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
          </div>
        </div>
        <Divider />
        <h2 className={styles.formType}>??????????????????</h2>
        <div className={`${styles.demandFormWrap}`}>
          <div className={styles.field}>
            <label>????????????</label>
            <Field
              name="educationalStage"
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${errors.educationalStage ? styles.errorBord : ''} ${styles.select}`}
                  defaultValue={educationalStage || '?????????????????????'}
                  onChange={(value) => {
                    setFieldValue('educationalStage', value);
                    setFieldValue('educationalGrade', null);
                  }}
                  value={educationalStage || '?????????????????????'}
                >
                  { this.renderTargetOptions }
                </Select>
              )}
            />
            <ErrorMessage name="educationalStage">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
          </div>
          { needEducationalGrade && (
            <div className={styles.field}>
              <label>????????????</label>
              <Field
                name="educationalGrade"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${errors.educationalGrade ? styles.errorBord : ''} ${styles.select}`}
                    defaultValue="???????????????"
                    onChange={value => setFieldValue('educationalGrade', value)}
                    value={(educationalGrade || educationalGrade === 0) ? educationalGrade : '???????????????'}
                  >
                    { this.renderTutorGradeOptions(educationalStage) }
                  </Select>
                )}
              />
              <ErrorMessage name="educationalGrade">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
            </div>
          ) }
          <div className={styles.field}>
            <label>????????????</label>
            <Field
              name="studentTotal"
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${errors.studentTotal ? styles.errorBord : ''} ${styles.select}`}
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
            <label>????????????</label>
            <Field
              name="studentSex"
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  className={`${errors.studentSex ? styles.errorBord : ''}`}
                  options={tutorSexes}
                />
              )}
            />
            <ErrorMessage name="studentSex">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={`${styles.field}`}>
            <label>??????????????????</label>
            <Field
              name="classWay"
              render={({ field }) => (
                <Checkbox.Group
                  {...field}
                  className={`${errors.classWay ? styles.errorBord : ''}`}
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
            <label>??????????????????</label>
          </div>
          <div className={`${styles.field}`}>
            <span>???</span>
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
            <span>??????</span>
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
            <span>???</span>
          </div>

          <div className={`${styles.field}`}>
            <span>????????????</span>
            <Field
              name="classFrequencyHour"
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${errors.classFrequencyHour ? styles.errorBord : ''}`}
                  style={{ width: '80px', margin: 'auto 10px' }}
                  onChange={value => setFieldValue('classFrequencyHour', value)}
                  value={values.classFrequencyHour}
                >
                  { this.renderTutorFrequencyHourOptions }
                </Select>
              )}
            />
            <span>??????</span>
            <ErrorMessage name="classFrequencyUnit">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
            <ErrorMessage name="classFrequencyTime">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
            <ErrorMessage name="classFrequencyHour">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
          </div>
          <div className={`${styles.field}`}>
            <label>????????????????????????????????????????????????????????????????????????</label>
            <div className={styles.field}>
              <span>?????????</span>
              <Field
                name="classEveryWeekDay"
                render={({ field }) => (
                  <Checkbox.Group
                    {...field}
                    style={{ margin: 'auto 10px' }}
                    className={`${errors.classEveryWeekDay ? styles.errorBord : ''}`}
                    onChange={value => setFieldValue('classEveryWeekDay', value)}
                    value={values.classEveryWeekDay}
                    options={tutorFrequencyWeek}
                  />
                )}
              />
              <ErrorMessage name="classEveryWeekDay">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={styles.field}>
              <span>?????????</span>
              <Field
                name="classEveryWeekHourBegin"
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${errors.classEveryWeekHourBegin ? styles.errorBord : ''}`}
                    style={{ width: '80px', margin: 'auto 10px' }}
                    onChange={value => setFieldValue('classEveryWeekHourBegin', value)}
                    value={classEveryWeekHourBegin}
                  >
                    { this.renderTutorTimeListOptions }
                  </Select>
                )}
              />
              <span>???</span>
              <Field
                name="classEveryWeekHourEnd"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      className={`${errors.classEveryWeekHourEnd ? styles.errorBord : ''}`}
                      style={{ width: '80px', margin: 'auto 10px' }}
                      onChange={value => setFieldValue('classEveryWeekHourEnd', value)}
                      value={classEveryWeekHourEnd < classEveryWeekHourBegin ? '?????????' : classEveryWeekHourEnd}
                    >
                      { this.renderTutorTimeListOptions }
                    </Select>
                  );
                }}
              />
              { classEveryWeekHourBegin && classEveryWeekHourEnd && classEveryWeekHourEnd <= classEveryWeekHourBegin && <p className={styles.error}>?????????????????????????????????</p> }
              { classEveryWeekHourEnd && (classEveryWeekHourEnd < endTimeWithWeekHour) && <p className={styles.error}>?????????????????????????????????</p> }
            </div>
            <ErrorMessage name="classEveryWeekHourBegin">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            <ErrorMessage name="classEveryWeekHourEnd">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={`${styles.field}`}>
            <label>????????????</label>
            <div className={styles.field}>
              <Field
                name="classDuration"
                render={({ field }) => (
                  <Radio.Group
                    {...field}
                    className={`${errors.classDuration ? styles.errorBord : ''}`}
                    options={teachDurationTypes}
                  />
                )}
              />
              <ErrorMessage name="classDuration">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
          </div>
        </div>
        <Divider />
        <div className={`${styles.memberForm}`}>
          <h2 className={styles.formType}>????????????</h2>
          <p className={styles.remind}>??????????????????????????????????????????104??????????????????????????????????????????????????????????????????????????????</p>
          <div className={styles.demandFormWrap}>
            <div className={`${styles.field}`}>
              <label>?????????{values.enableUserData.familyName}{values.enableUserData.firstName}</label>
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
              <label>??????104??????????????????</label>
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
                      // ??????????????????????????????????????????????????????????????????
                        setFieldTouched('enableUserData.companyName', false);
                        setFieldTouched('enableUserData.invoice', false);
                        setFieldTouched('enableUserData.employeeCount', false);
                        setFieldTouched('enableUserData.industry', false);
                        setFieldTouched('enableUserData.jobTitle', false);
                      } else {
                      // ??????????????????????????????????????????????????????????????????
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
              <label>??????/??????????????????</label>
              <div className={styles.addressField}>
                <Field
                  name="postAddress"
                  render={({ field }) => {
                    return (
                      <div
                        {...field}
                        className={`${errors.postAddress ? styles.errorBord : ''} ${styles.county}`}
                        onClick={() => this.onAreaClick(validateField, setFieldValue, values.postAddress.no, 'postAddress')}
                      >
                        {values.postAddress.des || '???????????????'}
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
                      placeholder="??????????????????"
                    />
                  )}
                />
              </div>
              <ErrorMessage name="postAddress.des">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
              <ErrorMessage name="enableUserData.address">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
            </div>
            <div className={styles.field}>
              <label>????????????
                { enableUserData.emailInfo.isVerified == 'true' && <span className={`${styles.checkIcon} ${styles.verification}`}><CheckCircleOutline />?????????</span>}
                { enableUserData.emailInfo.isVerified == 'false' && <span className={styles.checkIcon}><CheckCircleOutline /> ?????????</span> }
              </label>
              <div>
                { enableUserData.emailInfo.isVerified == 'true' && enableUserData?.emailInfo?.email}
                { enableUserData.emailInfo.isVerified == 'false' && (
                <Field
                  name="enableUserData.emailInfo.email"
                  render={({ field }) => (
                    <Input
                      id="enableUserData.emailInfo.email"
                      className={`${errors.enableUserData?.emailInfo?.email ? styles.errorBord : ''}`}
                      disabled
                      {...field}
                      placeholder="?????????????????????"
                    />
                  )}
                />
                )
            }
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.subTitle}>????????????</label>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldName}>????????????</label>
              <Field
                name="enableUserData.cellphone"
                render={({ field }) => (
                  <Input
                    {...field}
                    className={`${errors.enableUserData?.cellphone ? styles.errorBord : ''}`}
                    id="enableUserData.cellphone"
                    placeholder="?????????????????????"
                  />
                )}
              />
              <ErrorMessage name="enableUserData.cellphone">
                {msg => <span className={styles.error}>{msg}</span>}
              </ErrorMessage>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldName}>????????????</label>
              <div className={styles.phoneField}>
                <Field
                  name="enableUserData.telArea"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className={`${errors.enableUserData?.telArea ? styles.errorBord : ''} ${styles.telArea}`}
                      id="enableUserData.telArea"
                      placeholder="??????"
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
                      placeholder="??????????????????????????????#"
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
        </div>
        <Divider />
        <div className={`${styles.field} ${styles.specWrap} ${styles.flex}`}>
          <h2 className={styles.formType}>?????????????????????</h2>
          <Checkbox
            style={{ marginLeft: '10px' }}
            onChange={event => this.onUpdateUserForm(event.target.checked, setFieldValue, enableUserData)}
          >??????????????????
          </Checkbox>
        </div>
        <div className={`${styles.field} ${styles.flex}`}>
          <label className={styles.userName}>??????</label>
          <Field
            name="name"
            render={({ field }) => (
              <Input
                className={`${styles.name} ${errors.name ? styles.errorBord : ''}`}
                {...field}
                placeholder="???????????????"
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
          <label>???????????????</label>
          <Field
            name="contactTime"
            render={({ field }) => {
              return (
                <Radio.Group
                  {...field}
                  defaultValue="0"
                  className={`${(errors.contactTimeBegin || errors.contactTimeEnd) ? styles.errorBord : ''} ${styles.contactTimes}`}
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
                    ?????????
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
                    <span>???</span>
                    <Field
                      name="contactTimeEnd"
                      render={({ endField }) => {
                        return (
                          <Select
                            {...endField}
                            style={{ width: '90px', margin: 'auto 10px' }}
                            onChange={value => setFieldValue('contactTimeEnd', value)}
                            value={values.contactTime === '0' && (contactTimeEnd < contactTimeBegin ? '?????????' : contactTimeEnd)}
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
          <label className={styles.subTitle}>????????????(??????????????????)</label>
          <span className={styles.fieldName}>????????????</span>
          <div className={styles.field}>
            <Field
              name="cellphone"
              render={({ field }) => (
                <Input
                  id="cellphone"
                  className={`${styles.cellphone} ${errors.cellphone ? styles.errorBord : ''}`}
                  {...field}
                  placeholder="?????????????????????"
                />
              )}
            />
            <ErrorMessage name="cellphone">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          <div className={`${styles.telWrap}`}>
            <span className={styles.fieldPublishTitle}>????????????</span>
            <div className={`${styles.field}`}>
              <div className={`${styles.flex}`}>
                <Field
                  name="telArea"
                  render={({ field }) => (
                    <Input
                      id="telArea"
                      className={`${styles.telArea} ${errors.telArea ? styles.errorBord : ''}`}
                      {...field}
                      placeholder="????????????"
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
                      placeholder="???????????????"
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
            { !isPhoneFilled && <span className={styles.error}>???????????????????????????</span>}
          </div>
        </div>
        <div className={styles.field}>
          <label>????????????</label>
          <Field
            name="email"
            render={({ field }) => (
              <Input
                id="email"
                className={`${styles.email} ${errors.email ? styles.errorBord : ''}`}
                {...field}
                placeholder="????????????"
              />
            )}
          />
          <ErrorMessage name="email">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldPublishTitle}>?????????????????????????????????(?????????)</span>
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
                  &nbsp;&nbsp;???????????????????????????????????????<a href={`${config.contentSite.domain}/guarantee_deposit/`} target="_blank">104????????????????????????</a>
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
          >&nbsp;&nbsp;??????104??????????????????????????????
          </Checkbox>
        </div>
        <div className={styles.btnWrap}>
          <Button onClick={() => handleReset(onPrev())}>????????????</Button>
          <Button onClick={() => alertSubmitForm(errors)} type="primary" htmlType="submit" loading={isSubmitting}>??????????????????</Button>
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
        validationSchema={validateJoinTutorDemand}
        render={this.renderForm}
        enableReinitialize={isInitializeForm}
      />
    );
  }
}

export default TutorForm;
