import React, { PureComponent } from 'react';
import {
  Input, Radio, Select, InputNumber, Checkbox, Icon, Spin
} from 'antd';
import { Field, ErrorMessage, Formik } from 'formik';
import { BrowserView, MobileView } from 'react-device-detect';
import TreeSelect from '../ui/treeSelect';
import {
  location, moneyData, targetData, defaultMoneyData, partnerCountData, sexTitle
} from '../../config/selectData';
import Button from '../ui/button';
import styles from './Case.scss';
import { MAX_LENGTH } from '../../config/constant.js';
import { isContainTutorCats } from '../../util/lablesUtils.js';
// import { DebugFormik } from '../util/DebugFormik';
import { validateCase } from '../common_v2/Validates';
import config from '../../config/config';
import { alertSubmitForm } from '../../util/messageUtil';
import ScrollToError from '../../containers/common_v2/ScrollToError';

const { TextArea } = Input;
const { Option } = Select;

class Case extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      area: props.initialData.assignPlace ? props.initialData.assignPlace.des : '',
      areaNo: props.initialData.assignPlace ? props.initialData.assignPlace.no : '',
      demandCats: props.initialData.demandCats.length > 0 ? props.initialData.demandCats : []
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.initialData.assignPlace !== prevProps.initialData.assignPlace) {
      this.setState({
        area: this.props.initialData.assignPlace ? this.props.initialData.assignPlace.des : '',
        areaNo: this.props.initialData.assignPlace ? this.props.initialData.assignPlace.no : '',
      });
    }

    if (this.props.initialData.demandCats !== prevProps.initialData.demandCats) {
      this.setState({
        demandCats: this.props.initialData.demandCats.length > 0 ? this.props.initialData.demandCats : [],
      });
    }
  }

  renderUnitOptions = (
    moneyData.map(item => (
      <Option key={item.id} value={item.value}>{item.title}</Option>
    ))
  );

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

  onDemandCatsChange = ({ cats = [] }) => {
    this.setState({
      demandCats: cats,
    });
  }

  onAreaClick = (validateField) => {
    const no = this.state.areaNo || this.props.initialData.assignPlace.no;

    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '服務地區',
        maxSelectedNumber: 1,
        selectedItems: [{ no: no }],
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        unselectableList: '6[0-9]{6}000',
        onSubmit: ({ selectedItems }) => {
          const item = selectedItems[0];
          let area = '';
          let areaNo = null;

          if (item) {
            area = item.des;
            areaNo = item.no;
          }

          validateField('assignPlace');
          this.setState({
            area: area,
            areaNo: areaNo
          });
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
      setFieldValue('userName', `${familyName}${firstName}`);
      setFieldValue('gender', sex);
      setFieldValue('cellphone', cellphoneRecord.cellphone);
      setFieldValue('telArea', telArea);
      setFieldValue('tel', tel);
      setFieldValue('email', emailInfo.email);
    } else {
      setFieldValue('userName', '');
      setFieldValue('gender', '');
      setFieldValue('cellphone', '');
      setFieldValue('telArea', '');
      setFieldValue('tel', '');
      setFieldValue('email', '');
    }
  }

  renderForm = (props) => {
    const {
      onPrev, isModifiedDemand, isLoadingDemandForm
    } = this.props;
    const {
      handleSubmit, handleReset, values, errors, setFieldValue, validateField
    } = props;
    const {
      demandCats, unit, minPrice, maxPrice, placeType, target, cellphone, tel, telArea,
    } = values;
    const minimumOfMinPrice = unit === moneyData[0].value ? defaultMoneyData.minCase : defaultMoneyData.minHourRate;
    const minimumOfMaxPrice = minPrice || minimumOfMinPrice;
    const step = defaultMoneyData.step;
    // 使用者是否選擇家教類
    const isTutorCatsSelected = demandCats ? isContainTutorCats(demandCats) : false;

    // 使用者是否手機號碼與區域號碼二擇一
    const isPhoneFilled = (cellphone !== '' && cellphone !== null) || (telArea !== '' && tel !== '' && telArea !== null && tel !== null);

    return (
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <ScrollToError {...props} />
          <Spin tip="讀取案件中" size="large" spinning={isLoadingDemandForm}>
            <div className={styles.demandFormWrap}>
              <div className={styles.field}>
                <label><span className={styles.validate}>*</span>需求類別</label>
                <Field
                  name="demandCats"
                  render={({ field }) => {
                    props.values.demandCats = this.state.demandCats;
                    return (
                      <TreeSelect
                        {...field}
                        type="demand"
                        cats={demandCats}
                        isModified={isModifiedDemand}
                        onCatsChange={this.onDemandCatsChange}
                        style={styles.catSelect}
                      />
                    );
                  }}
                />
                <ErrorMessage name="demandCats">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
              </div>

              <div className={styles.field}>
                <label><span className={styles.validate}>*</span>需求標題(最多20字)</label>
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
                  <label><span className={styles.validate}>*</span>需求預算<a href={`${config.contentSite.domain}/price/`} target="_blank" style={{ margin: 'auto 10px' }}>成交行情參考</a></label>
                  <Select
                    style={{ width: '110px' }}
                    onChange={value => setFieldValue('unit', value)}
                    value={unit}
                  >
                    { this.renderUnitOptions }
                  </Select>
                </div>
                <div className={styles.field}>
                  台幣 &nbsp;
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
                  <ErrorMessage name="unit">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                  <ErrorMessage name="minPrice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                  <ErrorMessage name="maxPrice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                </div>
              </div>

              <div className={styles.field}>
                <label><span className={styles.validate}>*</span>指定服務地點</label>
                <Field
                  name="placeType"
                  render={({ field }) => (
                    <Radio.Group {...field} options={location} />
                  )}
                />
              </div>
              {
                placeType === 'yes'
                && (
                <div className={styles.field}>
                  <Field
                    name="assignPlace"
                    render={({ field }) => {
                      props.values.assignPlace = {
                        des: this.state.area,
                        no: this.state.areaNo
                      };
                      return (
                        <div
                          {...field}
                          className={styles.county}
                          onClick={() => this.onAreaClick(validateField)}
                        >
                          { this.state.area || '請選擇指定地點' }
                          <Icon type="down" />
                        </div>
                      );
                    }}
                  />
                  <ErrorMessage name="assignPlace.no">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                </div>
                )
              }
              <div className={styles.field}>
                <label><span className={styles.validate}>*</span>需求人數</label>
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
                <ErrorMessage name="partnerCount">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
              </div>
              {
                isTutorCatsSelected
                  ? (
                    <div className={styles.field}>
                      <label><span className={styles.validate}>*</span>教學對象</label>
                      <Select
                        style={{ width: '150px' }}
                        defaultValue={target || '請選擇教學對象'}
                        onChange={value => setFieldValue('target', value)}
                        value={target || '請選擇教學對象'}
                      >
                        { this.renderTargetOptions }
                      </Select>
                      {
                  target === '' ? <span className={styles.error}>請選擇教學對象</span> : null
                }
                      <ErrorMessage name="target">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                    </div>
                  )
                  : null
              }

              <div className={styles.field}>
                <label><span className={styles.validate}>*</span>需求描述 (詳細填寫可提升高手主動應徵意願)</label>
                <Field
                  name="desc"
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      className={errors.desc ? `${styles.errorBord} ${styles.desc}` : styles.desc}
                      autoSize={{ minRows: 5, maxRows: 6 }}
                      maxLength={MAX_LENGTH.desc}
                    />
                  )}
                />
                <ErrorMessage name="desc">{ msg => <span className={styles.error}>{ msg }</span> }</ErrorMessage>
              </div>
            </div>
          </Spin>
          <Spin tip="讀取聯絡人資料中" size="large" spinning={isLoadingDemandForm}>
            <div className={`${styles.field} ${styles.specWrap} ${styles.flex}`}>
              <label>需求聯絡人資料</label>
              <Field
                name="spec"
                render={({ field }) => (
                  <>
                    <Checkbox
                      {...field}
                      value={true}
                      onChange={event => this.onUpdateUserForm(event, setFieldValue)}
                    />
                    帶入帳戶資料
                  </>
                )}
              />
            </div>
            <BrowserView>
              <div className={`${styles.userWrap}`}>
                <div className={`${styles.field}`}>
                  <label className={styles.userName}><span className={styles.validate}>*</span>姓名</label>
                  <Field
                    name="userName"
                    render={({ field }) => (
                      <Input
                        className={errors.userName ? styles.errorBord : ''}
                        {...field}
                        placeholder="請填寫姓名"
                      />
                    )}
                  />
                  <ErrorMessage name="userName">
                    { msg => <span className={styles.error}>{ msg }</span> }
                  </ErrorMessage>
                </div>
                <div className={`${styles.field}`}>
                  <Field
                    name="gender"
                    render={({ field }) => (
                      <Radio.Group {...field} options={sexTitle} />
                    )}
                  />
                  <ErrorMessage name="gender">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                </div>
              </div>
            </BrowserView>
            <MobileView>
              <div className={`${styles.userWrap}`}>
                <label className={styles.userName}><span className={styles.validate}>*</span>姓名</label>
                <Field
                  name="userName"
                  render={({ field }) => (
                    <Input
                      className={errors.userName ? styles.errorBord : ''}
                      {...field}
                      placeholder="請填寫姓名"
                      style={{ width: '40%', margin: 'auto 10px' }}
                    />
                  )}
                />
                <Field
                  name="gender"
                  render={({ field }) => (
                    <Radio.Group {...field} options={sexTitle} />
                  )}
                />
              </div>
              <div style={{ margin: 'auto 20px' }}>
                <ErrorMessage name="userName">
                  { msg => <span className={styles.error}>{ msg }</span> }
                </ErrorMessage>
                <ErrorMessage name="gender">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
              </div>
            </MobileView>
            <div className={styles.field}>
              <label><span className={styles.validate}>*</span>聯絡電話(至少擇一填寫)</label>
              <div className={styles.field}>
                <label className={styles.label}>行動電話</label>
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
                <label className={styles.label}>室內電話</label>
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
              {!isPhoneFilled && <span className={styles.error}>聯絡電話請擇一填寫</span>}
            </div>
            <div className={styles.field}>
              <label><span className={styles.validate}>*</span>電子郵件</label>
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
              <label>其他聯絡方式</label>
              <Field
                name="otherContactWay"
                render={({ field }) => (
                  <TextArea
                    {...field}
                    className={`${styles.otherContactWay} ${errors.otherContactWay ? styles.errorBord : ''}`}
                    maxLength={MAX_LENGTH.otherContactWay}
                  />
                )}
              />
            </div>
            <div className={styles.btnWrap}>
              <Button onClick={() => handleReset(onPrev())}>取消刊登</Button>
              <Button onClick={() => alertSubmitForm(errors)} type="primary" htmlType="submit">儲存進下一步</Button>
            </div>
            {/* <DebugFormik /> */}
          </Spin>
        </form>
      </div>
    );
  };

  render() {
    return (
      <Formik
        initialValues={this.props.initialData}
        onSubmit={this.props.onSubmitDemandStep1}
        validationSchema={validateCase}
        render={this.renderForm}
        enableReinitialize={true}
      />
    );
  }
}

export default Case;
