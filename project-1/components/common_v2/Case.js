import React, { Component } from 'react';
import {
  Input, Radio, Icon, Select, InputNumber,
} from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import TreeSelect from '../ui/treeSelect';
import { modalData } from '../ui/step/stepData';
import {
  location, demandOrderTXStatus, moneyData, targetData, defaultMoneyData, partnerCountData,
} from '../../config/selectData';
import { isContainTutorCats } from '../../util/lablesUtils.js';
import Step from '../ui/step';
import Button from '../ui/button';
import styles from './Form.scss';
import { MAX_LENGTH } from '../../config/constant.js';

const { TextArea } = Input;
const { Option } = Select;

class Case extends Component {
  constructor(props) {
    super(props);

    this.state = {
      area: props.casePage.demandBody.assignPlace ? props.casePage.demandBody.assignPlace.des : '',
      areaNo: props.casePage.demandBody.assignPlace ? props.casePage.demandBody.assignPlace.no : '',
      demandCats: props.casePage.demandCats.length > 0 ? props.casePage.demandCats : [],
    };
  }


  onAreaClick = (validateField) => {
    const no = this.state.areaNo || this.props.casePage.demandBody.assignPlace.no;

    // console.log(`no: ${no}
    // this.state.areaNo: ${this.state.areaNo}
    // this.props.casePage.demandBody.assignPlace.no: ${this.props.casePage.demandBody.assignPlace.no}
    // this.state.areaNo || this.props.casePage.demandBody.assignPlace.no: ${this.state.areaNo || this.props.casePage.demandBody.assignPlace.no}`);

    if (categoryPicker) {
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '服務地區',
        maxSelectedNumber: 1,
        recommendation: false,
        selectedItems: [{ no: no }],
        searchLevel: 1,
        searchDetail: false,
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

  renderForm = (props) => {
    const { demandCats } = this.state;

    const {
      handleSubmit, handleReset, values, setFieldValue, validateField,
    } = props;
    // console.log(props.errors); // debug error
    const step = defaultMoneyData.step;
    const minimumOfMinPrice = values.unit === moneyData[0].value ? defaultMoneyData.minCase : defaultMoneyData.minHourRate;
    const minimumOfMaxPrice = values.minPrice || minimumOfMinPrice;
    const isTargetRequired = isContainTutorCats(demandCats);

    return (
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>案件類別</label>
          <Field
            name="demandCats"
            render={({ field }) => {
              props.values.demandCats = this.state.demandCats;

              return (
                <TreeSelect
                  {...field}
                  type="demand"
                  cats={demandCats}
                  onCatsChange={this.onDemandCatsChange}
                />
              );
            }}
          />
          <ErrorMessage name="demandCats">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>

        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>案件標題</label>
          <Field
            name="title"
            render={({ field }) => (
              <Input
                className={props.errors.title ? styles.errorBord : ''}
                {...field}
                placeholder="請填案件標題"
                maxLength={MAX_LENGTH.title}
              />
            )}
          />
          <ErrorMessage name="title">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>

        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>案件預算</label>
          <Field
            name="unit"
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: '110px' }}
                defaultValue={values.unit}
                onChange={value => setFieldValue('unit', value)}
                value={values.unit}
              >
                { this.renderUnitOptions }
              </Select>
            )}
          />
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
                defaultValue={values.minPrice}
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
                defaultValue={values.maxPrice}
                onChange={value => setFieldValue('maxPrice', value)}
              />
            )}
          />
          &nbsp; 元
          <ErrorMessage name="unit">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="minPrice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="maxPrice">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
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
          props.values.placeType === 'yes'
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
                  <div {...field} className={styles.county} onClick={() => this.onAreaClick(validateField)}>
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
                style={{ width: '110px' }}
                defaultValue={values.partnerCount}
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
          isTargetRequired
          && (
          <div className={styles.field}>
            <label><span className={styles.validate}>*</span>教學對象</label>
            <Field
              name="target"
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: '150px' }}
                  defaultValue={values.target || '請選擇教學對象'}
                  onChange={value => setFieldValue('target', value)}
                  value={values.target || '請選擇教學對象'}
                >
                  { this.renderTargetOptions }
                </Select>
              )}
            />
            <ErrorMessage name="target">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
          </div>
          )
          }

        <div className={styles.field}>
          <label><span className={styles.validate}>*</span>需求描述 (詳細填寫可提升高手合作意願)</label>
          <Field
            name="desc"
            render={({ field }) => (
              <TextArea
                {...field}
                className={props.errors.desc ? styles.errorBord : ''}
                placeholder="工作內容：&#13;&#10;執行時間："
                autosize={{ minRows: 2, maxRows: 6 }}
                maxLength={MAX_LENGTH.desc}
              />
            )}
          />
          <ErrorMessage name="desc">
            { msg => <span className={styles.error}>{ msg }</span> }
          </ErrorMessage>
        </div>

        <div className={styles.btnWrap}>
          <Button onClick={() => handleReset(this.props.onClose())} dataGtmCase="step1-cxl">取消</Button>
          <Button type="primary" htmlType="submit" dataGtmCase="step1-next">下一步</Button>
        </div>
      </form>
    );
  }

  render() {
    const { casePage, } = this.props;
    const {
      demandBody,
      demandCats,
      target,
      orderTXStatus,
      validateCaseV1,
    } = casePage;
    const {
      title, unit, minPrice, maxPrice, placeType, assignPlace, partnerCount, desc,
    } = demandBody;

    return (
      <div className={styles.form}>
        {
          orderTXStatus !== demandOrderTXStatus.PAY
          && <Step current={0} stepData={modalData} stepModel />
        }
        <Formik
          initialValues={{
            title, unit, minPrice, maxPrice, placeType, assignPlace, partnerCount, desc, demandCats, target
          }}
          onSubmit={casePage.handleAddDemand}
          validationSchema={validateCaseV1}
          render={this.renderForm}
        />
      </div>
    );
  }
}

export default Case;
