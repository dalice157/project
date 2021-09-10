import React, { Component } from 'react';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
  Card, Divider, Button,
} from 'antd';
import {
  Form, Select, Checkbox, Input, Radio, SubmitButton,
} from 'formik-antd';
import 'dayjs/locale/zh-tw';
import { Formik, ErrorMessage } from 'formik';
import TreeSelect from '../../ui/treeSelect';
import { demandExperienceData } from '../../../config/selectData';
import {
  tutorTreeData, caseTreeData, caseRoleTypes, tutorGrade, tutorFrequency, tutorFrequencyCount, tutorFrequencyHour, tutorFrequencyWeek, tutorTimeList, partnerCountData, tutorSexes, tutorRoleTypes, unitOpts, partnerCountOpts, designatedPlaceOpts, depositResourceOpts, offReasonOpts, educationalStageOpts, onlineStatusOptsOfAddDemand, demandTypeList, teachTypes, teachDurationTypes, teachPlaceTypes, presetTime,
} from '../../../config/demandOptions';
import { validateTutorDemandv3, validateCaseDemandv3 } from '../../common/Validates';
import './AddForm.scss';
import { statusTypes as depositStatusTypes, applyType } from '../../order/deposit/options';
// import { DebugFormik } from '../../tools/DebugFormik';

const { TextArea } = Input;
const { Option } = Select;
const requiredField = <font style={{ color: 'red' }}>*</font>;
const errorStyle = {
  color: 'red',
  marginBottom: '10px',
  marginLeft: '125px',
  display: 'block',
};
const depositStatusDesc = depositStatusTypes.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});

class DemandCaseForm extends Component {
  constructor(props) {
    super(props);
    let reviewType = 0;
    const { applyForm } = props.defaultDemandData;
    if (applyForm) {
      reviewType = applyForm.yyyyMM.startsWith('DemandCheck-') ? 1 : 0;
    }
    this.state = {
      lastMemo: props.defaultDemandData.lastMemo,
      reviewType,
      isMoreThen180Days: false,
    };
  }

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
      case educationalStageOpts[2].value: {
        return tutorGrade.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
      }
      case educationalStageOpts[3].value:
      case educationalStageOpts[4].value: {
        return tutorGrade.slice(0, 3).map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
      }
      default: {
        break;
      }
    }
  }

  onUpdateUserForm = (event, demanderDefaultInfo, setFieldValue) => {
    if (event.target.checked) {
      // 載入會員資料
      const {
        name, sex, telArea, tel, cellphone, email, other,
      } = demanderDefaultInfo;
      setFieldValue('name', name);
      setFieldValue('sex', sex);
      setFieldValue('cellphone', cellphone);
      setFieldValue('telArea', telArea);
      setFieldValue('tel', tel);
      setFieldValue('email', email);
      setFieldValue('other', other);
    } else {
      // 全新案件更新資料
      setFieldValue('name', '');
      setFieldValue('sex', '');
      setFieldValue('cellphone', '');
      setFieldValue('telArea', '');
      setFieldValue('tel', '');
      setFieldValue('email', '');
      setFieldValue('other', '');
      setFieldValue('hideCellphone', false);
      setFieldValue('hideTel', false);
      setFieldValue('hideOther', false);
    }
  }

  renderTutorGradeOptions = (target) => {
    switch (target) {
      case educationalStageOpts[2].value: {
        return tutorGrade.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
      }
      case educationalStageOpts[3].value:
      case educationalStageOpts[4].value: {
        return tutorGrade.slice(0, 3).map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
      }
      default: {
        break;
      }
    }
  }

  renderRoleTypeOptions = (jobOccupation, demandType) => {
    switch (demandType) {
      case demandTypeList[0].value: {
        const isSelectAll = jobOccupation.find(value => value === 0) === tutorRoleTypes[0].value;
        const options = tutorRoleTypes.map((item) => {
          if (item.value === 0) {
            return (<Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>);
          }
          return (<Checkbox key={item.value} value={item.value} disabled={isSelectAll}>{item.label}</Checkbox>);
        });
        return options;
      }
      case demandTypeList[1].value:
      default: {
        const isSelectAll = jobOccupation.find(value => value === 0) === caseRoleTypes[0].value;
        const options = caseRoleTypes.map((item) => {
          if (item.value === 0) {
            return (<Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>);
          }
          return (<Checkbox key={item.value} value={item.value} disabled={isSelectAll}>{item.label}</Checkbox>);
        });
        return options;
      }
    }
  };

  getPayUnitDesc = (unit) => {
    let desc = '';
    unitOpts.map((item) => {
      if (`${unit}` === item.value) {
        desc = item.label;
      }
      return desc;
    });
  }

  getPartnerCountDesc = (partnerCount) => {
    let desc = '';
    partnerCountOpts.map((item) => {
      if (`${partnerCount}` === item.value) {
        desc = item.label;
      }
      return desc;
    });
  }

  getEducationalStageDesc = (educationalStage) => {
    let desc = '';
    educationalStageOpts.map((item) => {
      if (`${educationalStage}` === item.value) {
        desc = item.label;
      }
      return desc;
    });
  }

  renderPartnerOptions = (
    partnerCountData.map(item => (
      <Option key={item.id} value={item.value}>{item.title}</Option>
    ))
  );

  renderTargetOptions = (
    educationalStageOpts.map(item => (
      <Option key={item.id} value={item.id}>{item.title}</Option>
    ))
  );

  renderExpOptions = (
    demandExperienceData.map(item => (
      <Option key={item.id} value={item.id}>{item.title}</Option>
    ))
  );

  getDepositResourceDesc = (onlineStatusOption, depositResource, orderMISProcess, orderApplySource) => {
    let desc = '-';
    // 刊登狀態為編輯中(未刊登)，直接回傳
    if (onlineStatusOption === 0) {
      return desc;
      // 抵押品是押金，需另外顯示押金狀態
    } else if (depositResource === 'orderTX') {
      desc = `${depositStatusDesc[orderMISProcess]} ${orderApplySource !== null ? applyType[orderApplySource] : ''}`;
    } else {
      depositResourceOpts.map((item) => {
        if (depositResource === item.value) {
          desc = item.label;
        }
        return desc;
      });
    }

    return desc;
  }

  onInsertDemandMemo = async (basicId, demandId, memo, setFieldValue) => {
    try {
      if (memo) {
        const memoForm = {
          basicId,
          memo,
        };
        const insertDemandMemo = await this.props.loadInsertDemandMemo(demandId, memoForm);
        if (insertDemandMemo.payload && insertDemandMemo.type === 'INSERT_DEMAND_MEMO_SUCCESS') {
          alert('新增備註成功。');
          this.setState({ lastMemo: insertDemandMemo.payload });
          setFieldValue('memo', null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleReOpen = (basicId, demandId) => {
    window.open(`/admin/demand/add/${basicId}?reOpenDemandId=${demandId}`, '_blank');
  }

  educationalStageUI = (demandTutorInfo, needStudentGrade, partnerCount, setFieldValue, educationalStage) => (
    <>
      <h2>學生上課資訊</h2>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          教學對象
        </p>
        <div className="fieldContent">
          <Select
            name="demandDAO.educationalStage"
            onChange={(value) => {
              setFieldValue('demandDAO.educationalStage', value);
              setFieldValue('demandDAO.demandTutorInfo.educationalGrade', null);
            }}
            defaultValue={this.getEducationalStageDesc(partnerCount)}
            placeholder="請選擇教學對象"
            style={{ width: 200 }}
          >
            { educationalStageOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>) }
          </Select>
          {
              needStudentGrade ? (
                <Select
                  name="demandDAO.demandTutorInfo.educationalGrade"
                  style={{ width: '200px' }}
                  defaultValue="請選擇年級"
                >
                  { this.renderTutorGradeOptions(educationalStage) }
                </Select>
              ) : <></>
            }
        </div>
      </div>
      <ErrorMessage name="demandDAO.educationalStage">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.educationalGrade">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          上課人數
        </p>
        <div className="fieldContent">
          <Select
            name="demandDAO.demandTutorInfo.studentTotal"
            style={{ width: 200 }}
            value={demandTutorInfo ? demandTutorInfo.studentTotal ? demandTutorInfo.studentTotal : '' : ''}
          >
            { this.renderPartnerOptions }
          </Select>
        </div>
      </div>
      <ErrorMessage name="demandDAO.demandTutorInfo.studentTotal">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          學生性別
        </p>
        <div className="fieldContent">
          <Radio.Group
            name="demandDAO.demandTutorInfo.studentSex"
            style={{ width: 300 }}
            value={demandTutorInfo ? demandTutorInfo.studentSex : []}
            options={tutorSexes}
          />
        </div>
      </div>
      <ErrorMessage name="demandDAO.demandTutorInfo.studentSex">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          希望上課方式
        </p>
        <div className="fieldContent">
          <Checkbox.Group
            name="demandDAO.demandTutorInfo.classWay"
            options={teachTypes}
          />
        </div>
      </div>
      <ErrorMessage name="demandDAO.demandTutorInfo.classWay">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          希望上課次數
        </p>
        <div className="fieldContent">
          <span>每</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyUnit"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyUnit : ''}
          >
            { this.renderTutorFrequencyOptions }
          </Select>
          <span>上課</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyTime"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyTime : ''}
          >
            { this.renderTutorFrequencyCountOptions }
          </Select>
          <span>次，每次上課</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyHour"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyHour : ''}
          >
            { this.renderTutorFrequencyHourOptions }
          </Select>
          <span>小時</span>
        </div>
      </div>
      <ErrorMessage name="demandDAO.demandTutorInfo.classFrequencyUnit">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.classFrequencyTime">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.classFrequencyHour">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          預計上課時間
        </p>
        <div className="fieldContent">
          <div className="fieldContentTime">
            <span>週間：</span>
            <Checkbox.Group
              name="demandDAO.demandTutorInfo.classEveryWeekDay"
              value={demandTutorInfo ? demandTutorInfo.classEveryWeekDay : []}
              options={tutorFrequencyWeek}
            />
          </div>
          <div className="fieldContentTime">
            <span>時間：</span>
            <Select
              name="demandDAO.demandTutorInfo.classEveryWeekHourBegin"
              style={{ width: 100 }}
              value={demandTutorInfo ? demandTutorInfo.classEveryWeekHourBegin : ''}
            >
              { this.renderTutorTimeListOptions }
            </Select>
            <span>～</span>
            <Select
              name="demandDAO.demandTutorInfo.classEveryWeekHourEnd"
              style={{ width: 100 }}
              value={demandTutorInfo ? (demandTutorInfo.classEveryWeekHourEnd < demandTutorInfo.classEveryWeekHourBegin ? '請選擇' : demandTutorInfo.classEveryWeekHourEnd) : ''}
            >
              { this.renderTutorTimeListOptions }
            </Select>
          </div>
          <span>（若有需補充的可以在需求描述中說明）</span>
        </div>
      </div>
      <ErrorMessage name="demandDAO.demandTutorInfo.classEveryWeekDay">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.classEveryWeekHourBegin">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.classEveryWeekHourEnd">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          上課期限
        </p>
        <div className="fieldContent">
          <Radio.Group
            name="demandDAO.demandTutorInfo.classDuration"
            style={{ width: 300 }}
            options={teachDurationTypes}
          />
        </div>
      </div>
      <ErrorMessage name="demandDAO.demandTutorInfo.classDuration">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
    </>
  );

  getOffReasonDesc = (offReason) => {
    let desc = '';
    offReasonOpts.map((item) => {
      if (`${offReason}` === item.value) {
        desc = item.label;
      }
      return desc;
    });
  }

  onAreaClick = (areas, setFieldValue, validateField) => {
    if (window.categoryPicker) {
      window.categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '服務地區',
        maxSelectedNumber: 1,
        selectedItems: areas,
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        unselectableList: '6[0-9]{6}000',
        onSubmit: ({ selectedItems }) => {
          const item = selectedItems[0];
          const areaDesc = item ? item.des : '';
          const areaNo = item ? item.no : '';
          setFieldValue('areaData', { areaDesc, areaNo });
          validateField('areaData');
        },
        onClose: () => {
          this.setState({ editing: false });
        },
      });
    }
  };

  renderPublishField = (phoneVerify) => {
    if (phoneVerify) {
      return onlineStatusOptsOfAddDemand.phoneVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
    }
    return onlineStatusOptsOfAddDemand.phoneNotVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
  }

    onCheckPass = () => {
      const { basicId, demandId } = this.props.defaultDemandData.demandDAO;
      this.setState({ reviewType: 2 });
      this.props.onPassCheck(basicId, demandId);
    }

  bringInPresets = (e, setFieldValue) => {
    console.log('radio checked', e.target.value);
    const { startTimeVal, endTimeVal } = e.target.value;
    setFieldValue('contactTimeBegin', startTimeVal);
    setFieldValue('contactTimeEnd', endTimeVal);
    this.setState({
      value: e.target.value,
    });
  };

  renderForm = ({
    values, errors, setFieldValue, validateField,
  }) => {
    const { demandType, demanderInfo, demanderDefaultInfo } = this.props;
    const {
      reviewType,
    } = this.state;
    const {
      telArea, tel, cellphone, areaData,
    } = values;
    const { areaDesc, areaNo } = areaData;
    // 室內電話驗證
    const telephoneVerified = errors.telArea === undefined && errors.tel === undefined && (telArea !== '' && tel !== '' && telArea !== null && tel !== null);
    // 手機驗證
    const cellphoneVerified = errors.cellphone === undefined && (cellphone !== '' && cellphone !== null);
    // 室內電話、手機驗證二擇一即可
    const phoneVerified = telephoneVerified || cellphoneVerified;
    const isFormValid = phoneVerified;
    const areas = [{ no: `${areaNo}` }];
    const {
      basicId, acFullName, emailVerify, phoneVerify,
    } = demanderInfo;
    const {
      demandDAO: demand, contactTimeEnd, contactTimeBegin,
    } = values;
    const {
      demandCategory, educationalStage, character, demandId, demandBody, designatedPlace, demandTutorInfo, demandOutsourceInfo,
    } = demand;
    const {
      unit, partnerCount,
    } = demandBody;
    // 類別為家教技能才顯示
    // isTutorSkill: 舊案件, character: 新案件類型
    const needStudentGrade = educationalStage && educationalStageOpts[2].value <= educationalStage && educationalStage <= educationalStageOpts[4].value;
    const isTutor = (demandType === demandTypeList[0].value);
    return (
      <Form>
        <Card>
          {/* 會員狀態 */}
          <div className="editDemandField">
            <p className="fieldName">會員編號</p>
            <div className="fieldContent">
              {basicId || ''}
            </div>
          </div>
          <div className="editDemandField">
            <p className="fieldName">會員姓名</p>
            <div className="fieldContent">
              {acFullName ? <a href={`/admin/member/${basicId}?tabs=basic`} target="_blank" rel="noopener noreferrer">{acFullName}</a> : ''}
            </div>
          </div>
          <div className="editDemandField">
            <p className="fieldName">e-mail驗證狀態</p>
            <div className="fieldContent">
              {emailVerify ? '已驗證' : <p style={{ color: 'red' }}>未驗證</p>}
            </div>
          </div>
          <div className="editDemandField">
            <p className="fieldName">電話驗證狀態</p>
            <div className="fieldContent">
              {phoneVerify ? '已驗證' : <p style={{ color: 'red' }}>未驗證</p>}
            </div>
          </div>
          <Divider />
          {/* 案件表單 */}
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              刊登狀態
            </p>
            <div className="fieldContent">
              <Select
                name="demandDAO.onlineStatusOption"
                placeholder="請選擇案件刊登狀態"
                style={{ width: 240 }}
              >
                {this.renderPublishField(phoneVerify)}
              </Select>
            </div>
            {
            reviewType
              ? (
                <div className="fieldContent">
                  <Button
                    onClick={this.onCheckPass}
                    icon={reviewType === 1 ? <InfoCircleOutlined /> : <CheckCircleOutlined />}
                    disabled={reviewType !== 1}
                  >
                    {reviewType === 1 ? '確認後審' : '後審-OK'}
                  </Button>
                </div>
              ) : <></>}
          </div>
          <ErrorMessage name="demandDAO.offReason">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <Divider />
          <div className="editDemandField">
            <p className="fieldName">舊站案件編號</p>
            <div className="fieldContent">
              <Input name="demandDAO.oldSiteCaseNo" style={{ width: 350 }} />
            </div>
          </div>
          <ErrorMessage name="demandDAO.oldSiteCaseNo">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              案件類型
            </p>
            <div className="fieldContent">
              <Radio.Group
                name="demandDAO.character"
                onChange={(element) => {
                  setFieldValue('demandDAO.demandCategory', []);
                  this.props.onChangeDemandType(element.target.value);
                }}
                options={demandTypeList}
              />
            </div>
          </div>
          <ErrorMessage name="demandDAO.character">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              案件類別
            </p>
            <div className="fieldContent">
              <TreeSelect
                id={demandId}
                treeData={character === demandTypeList[0].value ? tutorTreeData : (character === demandTypeList[1].value ? caseTreeData : null)}
                cats={demandCategory}
                onCatsChange={({ cats = [] }) => setFieldValue('demandDAO.demandCategory', cats)}
              />
            </div>

          </div>
          <ErrorMessage name="demandDAO.demandCategory">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              案件標題
            </p>
            <div className="fieldContent">
              <Input name="demandDAO.demandBody.title" style={{ width: '350px' }} placeholder="標題最多20個字元" />
            </div>
          </div>
          <ErrorMessage name="demandDAO.demandBody.title">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              案件預算
            </p>
            <div className="fieldContent">
              <Select
                name="demandDAO.demandBody.unit"
                defaultValue={this.getPayUnitDesc(unit)}
                placeholder="請選擇薪酬計算方式"
                style={{ width: '100px' }}
              >
                {unitOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
              </Select>
              <span>台幣</span>
              <Input name="demandDAO.demandBody.minPrice" style={{ width: 100 }} />
              <span>～</span>
              <Input name="demandDAO.demandBody.maxPrice" style={{ width: 100 }} />
              <span>元</span>
            </div>
          </div>
          <ErrorMessage name="demandDAO.demandBody.minPrice">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="demandDAO.demandBody.maxPrice">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              指定地點
            </p>
            <div className="fieldContent">
              <Radio.Group
                name="demandDAO.designatedPlace"
                className="fieldContentPlace"
                options={designatedPlaceOpts}
                onChange={(element) => {
                  const currentDesignatedPlace = element.target.value;
                  setFieldValue('demandDAO.designatedPlace', currentDesignatedPlace);
                  if (!currentDesignatedPlace) {
                    setFieldValue('demandDAO.demandTutorInfo.classPlace', []);
                    setFieldValue('demandDAO.demandTutorInfo.classPlaceDesc', '');
                    setFieldValue('areaData', { areaDesc: '', areaNo: '' });
                  }
                  if (values.demandDAO.demandTutorInfo.classPlace === null) {
                    values.demandDAO.demandTutorInfo.classPlace = [];
                  }
                }}
              />
              {
                designatedPlace && (
                  <>
                    {
                    isTutor ? (
                      <Checkbox.Group
                        name="demandDAO.demandTutorInfo.classPlace"
                        className="fieldContentPlace"
                        options={teachPlaceTypes}
                      />
                    ) : <></>
                    }
                    <Input
                      name="areaData"
                      className="fieldContentPlace"
                      onClick={() => this.onAreaClick(areas, setFieldValue, validateField)}
                      value={`${areaDesc || '請選擇指定地點'}`}
                      style={{ width: 180, cursor: 'pointer' }}
                    />
                    {
                      isTutor ? (
                        <div className="fieldContentPlace">
                          <span>附近明顯路標說明</span>
                          <Input name="demandDAO.demandTutorInfo.classPlaceDesc" style={{ width: '350px' }} />
                        </div>
                      ) : <></>
                    }
                  </>
                )
              }
            </div>
          </div>
          {
            values.demandDAO.character === 1 && values.demandDAO.designatedPlace && values.demandDAO.demandTutorInfo.classPlace && values.demandDAO.demandTutorInfo.classPlace.length === 0 && (<span style={errorStyle}>請選擇教學地點類型</span>)
          }
          <ErrorMessage name="areaData.areaNo">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              需求人數
            </p>
            <div className="fieldContent">
              <Select
                name="demandDAO.demandBody.partnerCount"
                defaultValue={this.getPartnerCountDesc(partnerCount)}
                placeholder="請選擇需求人數"
                style={{ width: '150px' }}
              >
                {partnerCountOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
              </Select>
            </div>
          </div>
          <ErrorMessage name="demandDAO.demandBody.partnerCount">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              經驗需求
            </p>
            {
              isTutor
                ? (
                  <>
                    <div className="fieldContent">
                      <Select
                        name="demandDAO.demandTutorInfo.experience"
                        style={{ width: '150px' }}
                        value={demandTutorInfo ? demandTutorInfo.experience : null}
                      >
                        { this.renderExpOptions }
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fieldContent">
                      <Select
                        name="demandDAO.demandOutsourceInfo.experience"
                        style={{ width: '150px' }}
                        value={demandOutsourceInfo ? demandOutsourceInfo.experience : null}
                      >
                        { this.renderExpOptions }
                      </Select>
                    </div>
                  </>
                )
            }
          </div>
          <ErrorMessage name="demandDAO.demandTutorInfo.experience">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="demandDAO.demandOutsourceInfo.experience">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              希望身份
            </p>
            {
              isTutor
                ? (
                  <div className="fieldContent">
                    <Checkbox.Group
                      name="demandDAO.demandTutorInfo.jobOccupation"
                      value={demandTutorInfo ? demandTutorInfo.jobOccupation : []}
                    >
                      { this.renderRoleTypeOptions(demandTutorInfo ? (demandTutorInfo.jobOccupation ? demandTutorInfo.jobOccupation : []) : [], character)}
                    </Checkbox.Group>
                  </div>
                ) : (
                  <div className="fieldContent">
                    <Checkbox.Group
                      name="demandDAO.demandOutsourceInfo.jobOccupation"
                    >
                      { this.renderRoleTypeOptions(demandOutsourceInfo ? (demandOutsourceInfo.jobOccupation ? demandOutsourceInfo.jobOccupation : []) : [], character)}
                    </Checkbox.Group>
                  </div>
                )
            }
          </div>
          <ErrorMessage name="demandDAO.demandTutorInfo.jobOccupation">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="demandDAO.demandOutsourceInfo.jobOccupation">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          {isTutor ? this.educationalStageUI(demandTutorInfo, needStudentGrade, partnerCount, setFieldValue, educationalStage, demandType) : <></>}
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              需求描述
            </p>
            <div className="fieldContent">
              <TextArea
                name="demandDAO.demandBody.desc"
                placeholder="請說明案件相關的: 1.執行需求 2.執行時間 3.注意事項"
                style={{ width: 580, height: 200 }}
              />
            </div>
          </div>
          <ErrorMessage name="demandDAO.demandBody.desc">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <Divider />
          <div className="editDemandField">
            <p className="fieldName">帶入發案會員資料</p>
            <div className="fieldContent">
              {/* 帶入發案會員資料 */}
              <Checkbox
                name="updateDemander"
                style={{ marginLeft: '10px' }}
                onChange={event => this.onUpdateUserForm(event, demanderDefaultInfo, setFieldValue)}
              />
            </div>
          </div>

          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              聯絡人姓名
            </p>
            <div className="fieldContent">
              <Input
                name="name"
                placeholder="姓名"
                style={{ width: '310px' }}
              />
            </div>
          </div>
          <ErrorMessage name="name">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              聯絡人性別
            </p>
            <div className="fieldContent">
              <Radio.Group
                name="sex"
              >
                <Radio value="1">男</Radio>
                <Radio value="0">女</Radio>
              </Radio.Group>
            </div>

          </div>
          <ErrorMessage name="sex">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              聯絡人email
            </p>
            <div className="fieldContent">
              <Input
                name="email"
                placeholder="e-mail"
                className="alignInput"
                style={{ width: '310px' }}
              />
            </div>
          </div>
          <ErrorMessage name="email">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              可聯絡時間
            </p>
            <div className="fieldContent">
              <div className="fieldContentTime">
                <span>帶入預設：</span>
                <Radio.Group
                  onChange={e => this.bringInPresets(e, setFieldValue)}
                  value={this.state.value}
                >
                  {
                  presetTime.map(item => (
                    <Radio key={item.id} value={item.info}>
                      {item.text}
                      {' '}
                      {item.startTime}
                      {' '}
                      ~
                      {' '}
                      {item.endTime}
                    </Radio>
                  ))
                }
                </Radio.Group>
              </div>
              <div className="fieldContentTime">
                <Select
                  name="contactTimeBegin"
                  value={contactTimeBegin}
                  style={{ width: 100 }}
                >
                  { this.renderTutorTimeListOptions }
                </Select>
                <span>～</span>
                <Select
                  name="contactTimeEnd"
                  style={{ width: 100 }}
                  value={(contactTimeEnd < contactTimeBegin ? '請選擇' : contactTimeEnd)}
                >
                  { this.renderTutorTimeListOptions }
                </Select>
              </div>
            </div>
          </div>
          <ErrorMessage name="contactTimeBegin">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
          <ErrorMessage name="contactTimeEnd">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
          <h3>
            {requiredField}
            聯絡人電話（室話和手機可擇一填寫）
          </h3>
          <div className="editDemandField">
            <p className="fieldName">室內電話</p>
            <div className="fieldContent">
              <Input
                name="telArea"
                placeholder="區域號碼"
                style={{ width: '100px' }}
              />
              <Input
                name="tel"
                placeholder="電話號碼，分機請輸入#"
                style={{ width: '200px', marginLeft: '10px' }}
              />
              <Checkbox
                name="hideTel"
                style={{ marginLeft: '10px' }}
                // checked={ hideTel }
              >
                不公開
              </Checkbox>
            </div>
          </div>
          <ErrorMessage name="telArea">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="tel">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">行動電話</p>
            <div className="fieldContent">
              <Input
                name="cellphone"
                placeholder="行動電話"
                style={{ width: '310px' }}
              />
              <Checkbox
                name="hideCellphone"
                style={{ marginLeft: '10px' }}
              >
                不公開
              </Checkbox>
            </div>
          </div>
          <ErrorMessage name="cellphone">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">其他聯絡方式</p>
            <div className="fieldContent">
              <TextArea
                name="other"
                placeholder="例如：LINE ID, Skype ..."
                style={{ width: '650px', height: '100px' }}
              />
              <Checkbox
                name="hideOther"
                style={{ marginLeft: '10px' }}
              >
                不公開
              </Checkbox>
            </div>
          </div>
          <ErrorMessage name="other">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">客服備註</p>
            <div className="fieldContent">
              <TextArea name="memo" style={{ width: '650px', height: 100 }} />
            </div>
          </div>
        </Card>
        <div style={{ marginTop: '10px' }}>
          <SubmitButton type="primary" htmlType="submit" disabled={!isFormValid}>送出</SubmitButton>
        </div>
        {/* <DebugFormik /> */}
      </Form>
    );
  }

  render() {
    const {
      submitDemand, demandType, initialData,
    } = this.props;
    const validationSchema = demandType === demandTypeList[0].value ? validateTutorDemandv3 : validateCaseDemandv3;

    return (
      <Formik
        initialValues={initialData}
        onSubmit={submitDemand}
        validationSchema={validationSchema}
      >
        { this.renderForm }
      </Formik>
    );
  }
}

export default DemandCaseForm;
