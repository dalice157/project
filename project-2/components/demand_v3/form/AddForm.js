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
      // ??????????????????
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
      // ????????????????????????
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
    // ????????????????????????(?????????)???????????????
    if (onlineStatusOption === 0) {
      return desc;
      // ????????????????????????????????????????????????
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
          alert('?????????????????????');
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
      <h2>??????????????????</h2>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          ????????????
        </p>
        <div className="fieldContent">
          <Select
            name="demandDAO.educationalStage"
            onChange={(value) => {
              setFieldValue('demandDAO.educationalStage', value);
              setFieldValue('demandDAO.demandTutorInfo.educationalGrade', null);
            }}
            defaultValue={this.getEducationalStageDesc(partnerCount)}
            placeholder="?????????????????????"
            style={{ width: 200 }}
          >
            { educationalStageOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>) }
          </Select>
          {
              needStudentGrade ? (
                <Select
                  name="demandDAO.demandTutorInfo.educationalGrade"
                  style={{ width: '200px' }}
                  defaultValue="???????????????"
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
          ????????????
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
          ????????????
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
          ??????????????????
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
          ??????????????????
        </p>
        <div className="fieldContent">
          <span>???</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyUnit"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyUnit : ''}
          >
            { this.renderTutorFrequencyOptions }
          </Select>
          <span>??????</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyTime"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyTime : ''}
          >
            { this.renderTutorFrequencyCountOptions }
          </Select>
          <span>??????????????????</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyHour"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyHour : ''}
          >
            { this.renderTutorFrequencyHourOptions }
          </Select>
          <span>??????</span>
        </div>
      </div>
      <ErrorMessage name="demandDAO.demandTutorInfo.classFrequencyUnit">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.classFrequencyTime">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.classFrequencyHour">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          ??????????????????
        </p>
        <div className="fieldContent">
          <div className="fieldContentTime">
            <span>?????????</span>
            <Checkbox.Group
              name="demandDAO.demandTutorInfo.classEveryWeekDay"
              value={demandTutorInfo ? demandTutorInfo.classEveryWeekDay : []}
              options={tutorFrequencyWeek}
            />
          </div>
          <div className="fieldContentTime">
            <span>?????????</span>
            <Select
              name="demandDAO.demandTutorInfo.classEveryWeekHourBegin"
              style={{ width: 100 }}
              value={demandTutorInfo ? demandTutorInfo.classEveryWeekHourBegin : ''}
            >
              { this.renderTutorTimeListOptions }
            </Select>
            <span>???</span>
            <Select
              name="demandDAO.demandTutorInfo.classEveryWeekHourEnd"
              style={{ width: 100 }}
              value={demandTutorInfo ? (demandTutorInfo.classEveryWeekHourEnd < demandTutorInfo.classEveryWeekHourBegin ? '?????????' : demandTutorInfo.classEveryWeekHourEnd) : ''}
            >
              { this.renderTutorTimeListOptions }
            </Select>
          </div>
          <span>??????????????????????????????????????????????????????</span>
        </div>
      </div>
      <ErrorMessage name="demandDAO.demandTutorInfo.classEveryWeekDay">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.classEveryWeekHourBegin">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <ErrorMessage name="demandDAO.demandTutorInfo.classEveryWeekHourEnd">{ msg => <span style={errorStyle}>{ msg }</span> }</ErrorMessage>
      <div className="editDemandField">
        <p className="fieldName">
          {requiredField}
          ????????????
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
        title: '????????????',
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
    // ??????????????????
    const telephoneVerified = errors.telArea === undefined && errors.tel === undefined && (telArea !== '' && tel !== '' && telArea !== null && tel !== null);
    // ????????????
    const cellphoneVerified = errors.cellphone === undefined && (cellphone !== '' && cellphone !== null);
    // ??????????????????????????????????????????
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
    // ??????????????????????????????
    // isTutorSkill: ?????????, character: ???????????????
    const needStudentGrade = educationalStage && educationalStageOpts[2].value <= educationalStage && educationalStage <= educationalStageOpts[4].value;
    const isTutor = (demandType === demandTypeList[0].value);
    return (
      <Form>
        <Card>
          {/* ???????????? */}
          <div className="editDemandField">
            <p className="fieldName">????????????</p>
            <div className="fieldContent">
              {basicId || ''}
            </div>
          </div>
          <div className="editDemandField">
            <p className="fieldName">????????????</p>
            <div className="fieldContent">
              {acFullName ? <a href={`/admin/member/${basicId}?tabs=basic`} target="_blank" rel="noopener noreferrer">{acFullName}</a> : ''}
            </div>
          </div>
          <div className="editDemandField">
            <p className="fieldName">e-mail????????????</p>
            <div className="fieldContent">
              {emailVerify ? '?????????' : <p style={{ color: 'red' }}>?????????</p>}
            </div>
          </div>
          <div className="editDemandField">
            <p className="fieldName">??????????????????</p>
            <div className="fieldContent">
              {phoneVerify ? '?????????' : <p style={{ color: 'red' }}>?????????</p>}
            </div>
          </div>
          <Divider />
          {/* ???????????? */}
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              ????????????
            </p>
            <div className="fieldContent">
              <Select
                name="demandDAO.onlineStatusOption"
                placeholder="???????????????????????????"
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
                    {reviewType === 1 ? '????????????' : '??????-OK'}
                  </Button>
                </div>
              ) : <></>}
          </div>
          <ErrorMessage name="demandDAO.offReason">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <Divider />
          <div className="editDemandField">
            <p className="fieldName">??????????????????</p>
            <div className="fieldContent">
              <Input name="demandDAO.oldSiteCaseNo" style={{ width: 350 }} />
            </div>
          </div>
          <ErrorMessage name="demandDAO.oldSiteCaseNo">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              ????????????
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
              ????????????
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
              ????????????
            </p>
            <div className="fieldContent">
              <Input name="demandDAO.demandBody.title" style={{ width: '350px' }} placeholder="????????????20?????????" />
            </div>
          </div>
          <ErrorMessage name="demandDAO.demandBody.title">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              ????????????
            </p>
            <div className="fieldContent">
              <Select
                name="demandDAO.demandBody.unit"
                defaultValue={this.getPayUnitDesc(unit)}
                placeholder="???????????????????????????"
                style={{ width: '100px' }}
              >
                {unitOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
              </Select>
              <span>??????</span>
              <Input name="demandDAO.demandBody.minPrice" style={{ width: 100 }} />
              <span>???</span>
              <Input name="demandDAO.demandBody.maxPrice" style={{ width: 100 }} />
              <span>???</span>
            </div>
          </div>
          <ErrorMessage name="demandDAO.demandBody.minPrice">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="demandDAO.demandBody.maxPrice">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              ????????????
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
                      value={`${areaDesc || '?????????????????????'}`}
                      style={{ width: 180, cursor: 'pointer' }}
                    />
                    {
                      isTutor ? (
                        <div className="fieldContentPlace">
                          <span>????????????????????????</span>
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
            values.demandDAO.character === 1 && values.demandDAO.designatedPlace && values.demandDAO.demandTutorInfo.classPlace && values.demandDAO.demandTutorInfo.classPlace.length === 0 && (<span style={errorStyle}>???????????????????????????</span>)
          }
          <ErrorMessage name="areaData.areaNo">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              ????????????
            </p>
            <div className="fieldContent">
              <Select
                name="demandDAO.demandBody.partnerCount"
                defaultValue={this.getPartnerCountDesc(partnerCount)}
                placeholder="?????????????????????"
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
              ????????????
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
              ????????????
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
              ????????????
            </p>
            <div className="fieldContent">
              <TextArea
                name="demandDAO.demandBody.desc"
                placeholder="????????????????????????: 1.???????????? 2.???????????? 3.????????????"
                style={{ width: 580, height: 200 }}
              />
            </div>
          </div>
          <ErrorMessage name="demandDAO.demandBody.desc">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <Divider />
          <div className="editDemandField">
            <p className="fieldName">????????????????????????</p>
            <div className="fieldContent">
              {/* ???????????????????????? */}
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
              ???????????????
            </p>
            <div className="fieldContent">
              <Input
                name="name"
                placeholder="??????"
                style={{ width: '310px' }}
              />
            </div>
          </div>
          <ErrorMessage name="name">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              ???????????????
            </p>
            <div className="fieldContent">
              <Radio.Group
                name="sex"
              >
                <Radio value="1">???</Radio>
                <Radio value="0">???</Radio>
              </Radio.Group>
            </div>

          </div>
          <ErrorMessage name="sex">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              ?????????email
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
              ???????????????
            </p>
            <div className="fieldContent">
              <div className="fieldContentTime">
                <span>???????????????</span>
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
                <span>???</span>
                <Select
                  name="contactTimeEnd"
                  style={{ width: 100 }}
                  value={(contactTimeEnd < contactTimeBegin ? '?????????' : contactTimeEnd)}
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
            ???????????????????????????????????????????????????
          </h3>
          <div className="editDemandField">
            <p className="fieldName">????????????</p>
            <div className="fieldContent">
              <Input
                name="telArea"
                placeholder="????????????"
                style={{ width: '100px' }}
              />
              <Input
                name="tel"
                placeholder="??????????????????????????????#"
                style={{ width: '200px', marginLeft: '10px' }}
              />
              <Checkbox
                name="hideTel"
                style={{ marginLeft: '10px' }}
                // checked={ hideTel }
              >
                ?????????
              </Checkbox>
            </div>
          </div>
          <ErrorMessage name="telArea">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="tel">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">????????????</p>
            <div className="fieldContent">
              <Input
                name="cellphone"
                placeholder="????????????"
                style={{ width: '310px' }}
              />
              <Checkbox
                name="hideCellphone"
                style={{ marginLeft: '10px' }}
              >
                ?????????
              </Checkbox>
            </div>
          </div>
          <ErrorMessage name="cellphone">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">??????????????????</p>
            <div className="fieldContent">
              <TextArea
                name="other"
                placeholder="?????????LINE ID, Skype ..."
                style={{ width: '650px', height: '100px' }}
              />
              <Checkbox
                name="hideOther"
                style={{ marginLeft: '10px' }}
              >
                ?????????
              </Checkbox>
            </div>
          </div>
          <ErrorMessage name="other">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <div className="editDemandField">
            <p className="fieldName">????????????</p>
            <div className="fieldContent">
              <TextArea name="memo" style={{ width: '650px', height: 100 }} />
            </div>
          </div>
        </Card>
        <div style={{ marginTop: '10px' }}>
          <SubmitButton type="primary" htmlType="submit" disabled={!isFormValid}>??????</SubmitButton>
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
