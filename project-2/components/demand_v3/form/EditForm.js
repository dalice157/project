import React, { Component } from 'react';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
  Card, Divider, Button,
} from 'antd';
import {
  Form, Select, Checkbox, Input, Radio, SubmitButton,
} from 'formik-antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { Formik, ErrorMessage } from 'formik';
import { DatePicker } from '../../ui/days';
import TreeSelect from '../../ui/treeSelect';
import { dateFormat, optionsToTable } from '../../../util/formatUtil';
import { mappingStaffName } from '../../../util/commonUtil';
import { demandExperienceData, unitData } from '../../../config/selectData';
import {
  tutorTreeData, caseTreeData, caseRoleTypes, tutorGrade, tutorFrequency, tutorFrequencyCount, tutorFrequencyHour, tutorFrequencyWeek, tutorTimeList, partnerCountData, tutorSexes, tutorRoleTypes, unitOpts, partnerCountOpts, designatedPlaceOpts, depositResourceOpts, offReasonOpts, educationalStageOpts, offPersonOpts, offReasonStatusList, onlineStatusOptsOfAddDemand, onlineStatusOptsOfModifyDemand, onlineStatusOptsForDemand, findOffReasonLabel, demandTypeList, teachTypes,
  teachDurationTypes,
  teachPlaceTypes,
  presetTime,
} from '../../../config/demandOptions';
import { validateTutorDemandv3, validateCaseDemandv3 } from '../../common/Validates';
import './EditForm.scss';
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

const offPersonDesc = offPersonOpts.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});

const unitTable = optionsToTable(unitData);

class DemandCaseForm extends Component {
  constructor(props) {
    super(props);
    let reviewType = 0;
    const { applyForm } = props.defaultDemandData;
    if (applyForm) {
      reviewType = applyForm.yyyyMM.startsWith('DemandCheck-') ? 1 : 0;
    }
    const isReOpenDemandPage = props.reOpenDemandId;
    const isDemandEditPage = props.defaultDemandData.demandDAO && props.defaultDemandData.demandDAO.demandId !== '' && !isReOpenDemandPage;
    const hasExpireDate = (isDemandEditPage || isReOpenDemandPage) && props.defaultDemandData.demandDAO.expireDate !== null;
    const expireDate = hasExpireDate ? props.defaultDemandData.demandDAO.expireDate.split('-')[1] : '-';
    const year = expireDate.slice(0, 4);
    const month = expireDate.slice(4, 6);
    const date = expireDate.slice(6, 8);
    this.state = {
      prevOnlineStatus: props.defaultDemandData.demandDAO.onlineStatusOption,
      demandCategory: props.defaultDemandData.demandDAO.demandCategory,
      areaNo: props.areaData.areaNo,
      areaDesc: props.areaData ? props.areaData.areaDesc : '',
      lastMemo: props.defaultDemandData.lastMemo,
      reviewType,
      changeExpireDate: false,
      demandExpireDate: hasExpireDate ? `${year}-${month}-${date}` : '-',
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

  changeExpireDate = () => {
    this.setState({
      changeExpireDate: true,
    });
  }

  updateExpireDate = () => {
    const { basicId } = this.props;
    const { demandId } = this.props.defaultDemandData.demandDAO;
    this.props.updateDemandExpire(basicId, demandId, this.state.demandExpireDate);
    this.setState({
      changeExpireDate: false,
    });
  }

  onChangeDate = (date, dateString, setFieldValue) => {
    const { onlineDate } = this.props.defaultDemandData.demandDAO;
    let dateFormats = dateString;
    const currentDate = dayjs().format('YYYY-MM-DD');
    const nextDate = dayjs().add(1, 'days').format('YYYY-MM-DD');
    const moreThen180Days = dayjs(onlineDate).add(180, 'days');
    const isMoreThen180Days = dateFormats > dayjs(moreThen180Days).format('YYYY-MM-DD');
    if (currentDate >= dateFormats) {
      alert('????????????????????????????????????????????????????????????');
      dateFormats = nextDate;
    }
    setFieldValue('demandDAO.expireDate', dateFormats);

    this.setState({
      demandExpireDate: dateFormats,
      isMoreThen180Days,
    });
  }

  renderDemandStatusUI = (isDemandUnPublishAndEditing, isDemandClosed, offPerson, orderPayId, violation, onlineStatusOption, depositResource, orderMISProcess, orderApplySource, expireDate, createDate, onlineDate, offDate, setFieldValue, usageStage, dealPrice) => {
    const hasExpireDate = isDemandUnPublishAndEditing ? '-' : expireDate === null;
    const isShowExpireButton = () => {
      if (isDemandClosed || usageStage === '0.5') {
        return expireDate;
      } else if (!this.state.changeExpireDate) {
        return (
          <>
            {expireDate}
            {' '}
            <Button type="primary" onClick={this.changeExpireDate}>???????????????</Button>
          </>
        );
      }
    };
    return (
      <>
        <div className="editDemandField">
          <p className="fieldName">????????????</p>
          <div className="fieldContent">
            {isDemandClosed ? offPersonDesc[offPerson] : '-'}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">????????????</p>
          <div className="fieldContent">
            {isDemandUnPublishAndEditing ? '-' : this.getDepositResourceDesc(onlineStatusOption, depositResource, orderMISProcess, orderApplySource)}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">????????????</p>
          <div className="fieldContent">
            {isDemandUnPublishAndEditing ? '-' : orderPayId === null ? '-' : orderPayId}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">????????????</p>
          <div className="fieldContent">
            {isDemandUnPublishAndEditing ? '-' : violation ? <a href="/admin/violationSearch" target="_blank">??????????????????</a> : '-'}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">????????????</p>
          <div className="fieldContent">
            {dateFormat(createDate, true)}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">????????????</p>
          <div className="fieldContent">
            {isDemandUnPublishAndEditing ? '-' : dateFormat(onlineDate, true)}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">???????????????</p>
          <div className="fieldContent">
            {hasExpireDate ? 'null' : isShowExpireButton()}
            {
              !isDemandUnPublishAndEditing && this.state.changeExpireDate && (
                <>
                  <DatePicker locale={locale} className="datePicker" value={dayjs(expireDate)} name="demandDAO.expireDate" onChange={(date, dateString) => this.onChangeDate(date, dateString, setFieldValue)} />
                  <Button type="primary" className="datePickerBtn" onClick={this.updateExpireDate}>????????????</Button>
                  {
                    this.state.isMoreThen180Days && <div className="notice">??????????????????????????????????????????????????????180???(6??????)</div>
                  }
                </>
              )
            }
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">????????????</p>
          <div className="fieldContent">
            {isDemandClosed ? dateFormat(offDate, true) : '-'}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">????????????</p>
          <div className="fieldContent">
            {
              (Array.isArray(dealPrice) && dealPrice.length > 0)
                ? (dealPrice.map(deal => (
                  <a href={`/admin/member/gig/acceptConfirm/${deal.topperId}`} style={{ margin: '0 5px' }} target="_blank" rel="noopener noreferrer">
                    {' '}
                    {unitTable[deal.unit]}
                    {' '}
                    {deal.price}
                  </a>
                )))
                : (<p> ??? </p>)
            }
          </div>
        </div>
      </>
    );
  }

  renderOffReasonUI = (offReason, usageStage, cooperatingStageWithTopper, haveCommunicatedCount) => {
    if (cooperatingStageWithTopper === 1) {
      // ????????????????????????????????????<?????????????????????>
      return offReasonOpts.hasEvaluated.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
    }
    if (usageStage === '1' && haveCommunicatedCount === 0) {
      // ????????????????????????
      return offReasonOpts.nonCommunicated.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
    } else if (usageStage === '2') {
      // ?????????????????????????????????????????????????????????
      return <Option key={offReason} value={offReason}>{findOffReasonLabel(offReason)}</Option>;
    } else if (usageStage === '3') {
      // ????????????????????????????????????????????????
      return <Option key={offReason} value={offReason}>{findOffReasonLabel(offReason)}</Option>;
    }
    return offReasonOpts[offReasonStatusList[usageStage]].map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
  }

  onUpdateUserForm = (event, setFieldValue) => {
    const isDemandEditPage = this.props.defaultDemandData.demandDAO.demandId !== '';
    if (event.target.checked) {
      // ??????????????????
      const {
        name, sex, telArea, tel, cellphone, email, other,
      } = this.props.demanderDefaultInfo;
      setFieldValue('name', name);
      setFieldValue('sex', sex);
      setFieldValue('cellphone', cellphone);
      setFieldValue('telArea', telArea);
      setFieldValue('tel', tel);
      setFieldValue('email', email);
      setFieldValue('other', other);
    } else if (isDemandEditPage) {
      const {
        name, email, cellphone, sex, telArea, tel, other, displayCellphone, displayTel, displayOther,
      } = this.props.defaultDemandData.demandContactDTO;
      setFieldValue('name', name);
      setFieldValue('sex', sex);
      setFieldValue('cellphone', cellphone);
      setFieldValue('telArea', telArea);
      setFieldValue('tel', tel);
      setFieldValue('email', email);
      setFieldValue('other', other);
      setFieldValue('hideCellphone', !displayCellphone);
      setFieldValue('hideTel', !displayTel);
      setFieldValue('hideOther', !displayOther);
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

  onCatsChange = ({ cats = [] }) => {
    this.setState({
      ...this.state,
      demandCategory: cats,
    });
  }

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

  educationalStageUI = (demandTutorInfo, needStudentGrade, partnerCount, setFieldValue, isDemandClosed, educationalStage) => (
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
            disabled={isDemandClosed}
          >
            { educationalStageOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>) }
          </Select>
          {
              needStudentGrade ? (
                <Select
                  name="demandDAO.demandTutorInfo.educationalGrade"
                  style={{ width: '200px' }}
                  defaultValue="???????????????"
                  disabled={isDemandClosed}
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
            disabled={isDemandClosed}
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
            disabled={isDemandClosed}
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
            disabled={isDemandClosed}
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
            disabled={isDemandClosed}
          >
            { this.renderTutorFrequencyOptions }
          </Select>
          <span>??????</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyTime"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyTime : ''}
            disabled={isDemandClosed}
          >
            { this.renderTutorFrequencyCountOptions }
          </Select>
          <span>??????????????????</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyHour"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyHour : ''}
            disabled={isDemandClosed}
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
              disabled={isDemandClosed}
            />
          </div>
          <div className="fieldContentTime">
            <span>?????????</span>
            <Select
              name="demandDAO.demandTutorInfo.classEveryWeekHourBegin"
              style={{ width: 100 }}
              value={demandTutorInfo ? demandTutorInfo.classEveryWeekHourBegin : ''}
              disabled={isDemandClosed}
            >
              { this.renderTutorTimeListOptions }
            </Select>
            <span>???</span>
            <Select
              name="demandDAO.demandTutorInfo.classEveryWeekHourEnd"
              style={{ width: 100 }}
              value={demandTutorInfo ? (demandTutorInfo.classEveryWeekHourEnd < demandTutorInfo.classEveryWeekHourBegin ? '?????????' : demandTutorInfo.classEveryWeekHourEnd) : ''}
              disabled={isDemandClosed}
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
            disabled={isDemandClosed}
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
          this.setState({ areaDesc, areaNo }, () => {
            setFieldValue('areaData', { areaDesc, areaNo });
            validateField('areaData');
          });
        },
        onClose: () => {
          this.setState({ editing: false });
        },
      });
    }
  };

  renderPublishField = (usageStage, phoneVerify, emailVerify, offReason, depositResource, isDemandEditPage) => {
    if (isDemandEditPage) {
      if (usageStage === '0') {
        // ?????????
        if (phoneVerify) {
          return onlineStatusOptsOfModifyDemand.editing.phoneVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
        }
        if (phoneVerify === null) {
          return onlineStatusOptsOfModifyDemand.editing.phoneNotFound.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
        }
        return onlineStatusOptsOfModifyDemand.editing.phoneNotVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
      } else if (usageStage === '1') {
        // ?????????, ??????/?????????
        return onlineStatusOptsOfModifyDemand.publishing.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
      } else if (usageStage === '2') {
        // ?????????
        // ?????????????????????????????????usageStage?????????2
        if (offReason >= 100 && offReason < 200) {
          return <Option key={onlineStatusOptsForDemand['4'].value} value={onlineStatusOptsForDemand['4'].value}>{onlineStatusOptsForDemand['4'].label}</Option>;
        }
        return <Option key={onlineStatusOptsForDemand['3'].value} value={onlineStatusOptsForDemand['3'].value}>{onlineStatusOptsForDemand['3'].label}</Option>;
      } else if (usageStage === '3') {
        // usageStage === '3' ????????????
      // ???????????? / ????????????(???????????????)
        if (offReason >= 100 && offReason < 200) {
          return <Option key={onlineStatusOptsForDemand['4'].value} value={onlineStatusOptsForDemand['4'].value}>{onlineStatusOptsForDemand['4'].label}</Option>;
        }
        return <Option key={onlineStatusOptsForDemand[usageStage].value} value={onlineStatusOptsForDemand[usageStage].value}>{onlineStatusOptsForDemand[usageStage].label}</Option>;
      } else if (usageStage === '0.5') {
        // usageStage === '0.5' ?????????
        if (depositResource === 'orderTX') {
          // ????????????
          if (phoneVerify || emailVerify) {
            return onlineStatusOptsOfModifyDemand.verifying.pay.verified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
          }
          return onlineStatusOptsOfModifyDemand.verifying.pay.notVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
        }
        // ???????????????
        if (phoneVerify) {
          return onlineStatusOptsOfModifyDemand.verifying.unpay.verified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
        }
        return onlineStatusOptsOfModifyDemand.verifying.unpay.notVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
      }
      return null;
    }
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

    renderDepositUI = (usageStage, onlineStatusOption, depositResource, isDemandEditPage) => {
      if (isDemandEditPage) {
        // <??????>: ?????????, ????????????????????? [0: ?????????]
        if (usageStage === '0') {
          // ?????????????????????????????????
          if (onlineStatusOption === 1 || onlineStatusOption === 2) {
            return (
              <div className="editDemandField">
                <p className="fieldName">????????????</p>
                <div className="fieldContent">
                  <Checkbox name="freeCharge" checked disabled />
                  <span>( ?????????????????????????????? )</span>
                </div>
              </div>
            );
          }
        } else if (usageStage === '0.5') {
          // ????????????????????????????????? [0.5: ?????????]
          if (depositResource === 'orderTX' || depositResource === 'free') {
            // <??????>: ?????????, ??????????????? ??????????????? [orderTX: ??????????????????] [free: ??????????????????????????????]
            return null;
          }
          if (onlineStatusOption === 1 || onlineStatusOption === 2) {
            // <??????>: ???????????????
            return (
              <div className="editDemandField">
                <p className="fieldName">????????????</p>
                <div className="fieldContent">
                  <Checkbox name="freeCharge" checked disabled />
                  <span>( ?????????????????????????????? )</span>
                </div>
              </div>
            );
          }
        } else if (depositResource === 'staffAuthorize') {
          // ????????????????????????????????? [1: ???????????????][2: ??????????????????][3: ????????????]
          return (
            <div className="editDemandField">
              <p className="fieldName">????????????</p>
              <div className="fieldContent">
                <Checkbox name="freeCharge" checked disabled />
                <span>( ?????????????????????????????? )</span>
              </div>
            </div>
          );
        } else {
          return <></>;
        }
      } else {
        if ((!isDemandEditPage && usageStage === undefined)) {
          // ??????????????????????????????checkbox
          return (
            <div className="editDemandField">
              <p className="fieldName">????????????</p>
              <div className="fieldContent">
                <Checkbox name="freeCharge" checked={onlineStatusOption === 1 || onlineStatusOption === 2} disabled />
                <span>( ?????????????????????????????? )</span>
              </div>
            </div>
          );
        }
        return (
          <div className="editDemandField">
            <p className="fieldName">????????????</p>
            <div className="fieldContent">
              <Checkbox name="freeCharge" checked={false} disabled />
              <span>( ?????????????????????????????? )</span>
            </div>
          </div>
        );
      }
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
    const { demandType, location } = this.props;
    const {
      lastMemo, areaNo, areaDesc, demandCategory, reviewType,
    } = this.state;
    const {
      telArea, tel, cellphone,
    } = values;
    // ??????????????????
    const telephoneVerified = errors.telArea === undefined && errors.tel === undefined && (telArea !== '' && tel !== '' && telArea !== null && tel !== null);
    // ????????????
    const cellphoneVerified = errors.cellphone === undefined && (cellphone !== '' && cellphone !== null);
    // ??????????????????????????????????????????
    const phoneVerified = telephoneVerified || cellphoneVerified;
    const { demanderInfo } = this.props;
    const areas = [{ no: `${this.state.areaNo}` }];
    const {
      basicId, acFullName, emailVerify, phoneVerify,
    } = demanderInfo;
    const {
      demandDAO: demand, orderPayId, cooperatingStageWithTopper, orderMISProcess, orderApplySource, memo, contactTimeEnd, contactTimeBegin,
    } = values;
    const {
      educationalStage, character, demandId, demandBody, designatedPlace, usageStage, onlineStatusOption, depositResource, violation, createDate, onlineDate, offDate, offReason, offPerson, demandTutorInfo, demandOutsourceInfo, dealPrice, haveCommunicatedCount,
    } = demand;
    const {
      unit, partnerCount,
    } = demandBody;
    // ?????????????????????????????????
    const isDemandUnPublishAndEditing = (usageStage === '0') || location.query.reOpenDemandId;
    // ??????????????????
    const isDemandClosed = (usageStage === '2' || usageStage === '3') && !location.query.reOpenDemandId;
    // ????????????????????????
    const isDemandEditPage = demandId !== '' && !location.query.reOpenDemandId;
    const isFormValid = !isDemandClosed && phoneVerified;
    // ??????????????????????????????
    // isTutorSkill: ?????????, character: ???????????????
    const needStudentGrade = educationalStage && educationalStageOpts[2].value <= educationalStage && educationalStage <= educationalStageOpts[4].value;
    const isTutor = (demandType === demandTypeList[0].value);
    values.demandDAO.demandCategory = demandCategory;
    values.areaData = {
      areaNo,
      areaDesc,
    };

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
          {
            isDemandEditPage ? (
              <div className="editDemandField">
                <p className="fieldName">????????????</p>
                <div className="fieldContent">
                  {demandId.split('-')[1]}
                </div>
              </div>
            ) : <></>
          }
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
                disabled={isDemandClosed}
              >
                {this.renderPublishField(usageStage, phoneVerify, emailVerify, offReason, depositResource, isDemandEditPage)}
              </Select>
            </div>
            { reviewType ? <div className="fieldContent"><Button onClick={this.onCheckPass} icon={reviewType === 1 ? <InfoCircleOutlined /> : <CheckCircleOutlined />} disabled={reviewType !== 1}>{reviewType === 1 ? '????????????' : '??????-OK'}</Button></div> : <></>}
          </div>
          {
            isDemandEditPage && onlineStatusOption === 3 && (
              <div className="editDemandField">
                <p className="fieldName">????????????</p>
                <div className="fieldContent">
                  <Select
                    name="demandDAO.offReason"
                    placeholder="?????????????????????"
                    style={{ width: 250 }}
                    disabled={isDemandClosed}
                  >
                    {this.renderOffReasonUI(offReason, usageStage, cooperatingStageWithTopper, haveCommunicatedCount)}
                  </Select>
                </div>
              </div>
            )
          }
          <ErrorMessage name="demandDAO.offReason">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          {isDemandEditPage ? this.renderDepositUI(usageStage, onlineStatusOption, depositResource, isDemandEditPage) : <></>}
          {isDemandEditPage ? this.renderDemandStatusUI(isDemandUnPublishAndEditing, isDemandClosed, offPerson, orderPayId, violation, onlineStatusOption, depositResource, orderMISProcess, orderApplySource, this.state.demandExpireDate, createDate, onlineDate, offDate, setFieldValue, usageStage, dealPrice) : <></>}
          <Divider />
          <div className="editDemandField">
            <p className="fieldName">??????????????????</p>
            <div className="fieldContent">
              <Input name="demandDAO.oldSiteCaseNo" disabled={isDemandClosed} style={{ width: 350 }} />
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
                  this.setState({ demandCategory: [] });
                  this.props.onChangeDemandType(element.target.value);
                }}
                disabled={isDemandClosed}
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
                cats={this.state.demandCategory}
                onCatsChange={this.onCatsChange}
                shouldCloseInput={isDemandClosed}
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
              <Input name="demandDAO.demandBody.title" disabled={isDemandClosed} style={{ width: '350px' }} placeholder="????????????20?????????" />
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
                disabled={isDemandClosed}
              >
                {unitOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
              </Select>
              <span>??????</span>
              <Input name="demandDAO.demandBody.minPrice" disabled={isDemandClosed} style={{ width: 100 }} />
              <span>???</span>
              <Input name="demandDAO.demandBody.maxPrice" disabled={isDemandClosed} style={{ width: 100 }} />
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
                disabled={isDemandClosed}
                onChange={(element) => {
                  const currentDesignatedPlace = element.target.value;
                  setFieldValue('demandDAO.designatedPlace', currentDesignatedPlace);
                  if (!currentDesignatedPlace) {
                    setFieldValue('demandDAO.demandTutorInfo.classPlace', []);
                    setFieldValue('demandDAO.demandTutorInfo.classPlaceDesc', '');
                    this.setState({ areaDesc: '', areaNo: '' });
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
                        disabled={isDemandClosed}
                      />
                    ) : <></>
                    }
                    <Input
                      name="areaData"
                      className="fieldContentPlace"
                      onClick={() => this.onAreaClick(areas, setFieldValue, validateField)}
                      value={`${this.state.areaDesc ? this.state.areaDesc : '?????????????????????'}`}
                      style={{ width: 180, cursor: 'pointer' }}
                      disabled={isDemandClosed}
                    />
                    {
                      isTutor ? (
                        <div className="fieldContentPlace">
                          <span>????????????????????????</span>
                          <Input name="demandDAO.demandTutorInfo.classPlaceDesc" disabled={isDemandClosed} style={{ width: '350px' }} />
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
                disabled={isDemandClosed}
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
                        disabled={isDemandClosed}
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
                        disabled={isDemandClosed}
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
                      disabled={isDemandClosed}
                    >
                      { this.renderRoleTypeOptions(demandTutorInfo ? (demandTutorInfo.jobOccupation ? demandTutorInfo.jobOccupation : []) : [], character)}
                    </Checkbox.Group>
                  </div>
                ) : (
                  <div className="fieldContent">
                    <Checkbox.Group
                      name="demandDAO.demandOutsourceInfo.jobOccupation"
                      disabled={isDemandClosed}
                    >
                      { this.renderRoleTypeOptions(demandOutsourceInfo ? (demandOutsourceInfo.jobOccupation ? demandOutsourceInfo.jobOccupation : []) : [], character)}
                    </Checkbox.Group>
                  </div>
                )
            }
          </div>
          <ErrorMessage name="demandDAO.demandTutorInfo.jobOccupation">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="demandDAO.demandOutsourceInfo.jobOccupation">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          {isTutor ? this.educationalStageUI(demandTutorInfo, needStudentGrade, partnerCount, setFieldValue, isDemandClosed, educationalStage, demandType) : <></>}
          <div className="editDemandField">
            <p className="fieldName">
              {requiredField}
              ????????????
            </p>
            <div className="fieldContent">
              <TextArea
                name="demandDAO.demandBody.desc"
                placeholder="????????????????????????: 1.???????????? 2.???????????? 3.????????????"
                disabled={isDemandClosed}
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
                onChange={event => this.onUpdateUserForm(event, setFieldValue)}
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
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
                  disabled={isDemandClosed}
                >
                  { this.renderTutorTimeListOptions }
                </Select>
                <span>???</span>
                <Select
                  name="contactTimeEnd"
                  style={{ width: 100 }}
                  value={(contactTimeEnd < contactTimeBegin ? '?????????' : contactTimeEnd)}
                  disabled={isDemandClosed}
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
                disabled={isDemandClosed}
              />
              <Input
                name="tel"
                placeholder="??????????????????????????????#"
                style={{ width: '200px', marginLeft: '10px' }}
                disabled={isDemandClosed}
              />
              <Checkbox
                name="hideTel"
                style={{ marginLeft: '10px' }}
                // checked={ hideTel }
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
              />
              <Checkbox
                name="hideCellphone"
                style={{ marginLeft: '10px' }}
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
              />
              <Checkbox
                name="hideOther"
                style={{ marginLeft: '10px' }}
                disabled={isDemandClosed}
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
              <div style={{ float: 'right' }}>
                {isDemandEditPage ? <Button type="primary" onClick={() => this.onInsertDemandMemo(basicId, demandId, memo, setFieldValue)}>???????????????</Button> : ''}
              </div>
            </div>
          </div>
          {
                isDemandEditPage ? (
                  <>
                    <div className="editDemandField">
                      <p className="fieldName">????????????</p>
                      <div className="fieldContent">
                        {
                              lastMemo ? (
                                <>
                                  {dateFormat(lastMemo.createDate, true)}
&nbsp;???
                                  {lastMemo.staff ? mappingStaffName(lastMemo.staff) : lastMemo.clerk}
                                  ???
                                  <br />
                                  {lastMemo.memo}
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                  <a href={`/admin/member/memo/demand/${basicId}?demandId=${demandId}`} target="_blank" rel="noopener noreferrer">??????????????????</a>
                                </>
                              ) : (<p>???</p>)
                            }
                      </div>
                    </div>
                  </>
                ) : null
              }
        </Card>
        <div style={{ marginTop: '10px' }}>
          <SubmitButton type="primary" htmlType="submit" disabled={!isFormValid}>??????</SubmitButton>
          {((isDemandClosed || usageStage === '0.5' || usageStage === '1') && isDemandEditPage) && (
          <>
&nbsp;&nbsp;
            <Button type={isDemandClosed && 'primary'} onClick={() => this.handleReOpen(basicId, demandId.split('-')[1])}>??????????????????</Button>
          </>
          )}
        </div>
        {/* <DebugFormik /> */}
      </Form>
    );
  }

  initalData = (isDemandEditPage, isReOpenDemandPage, areaData, defaultDemandData, location) => {
    const { demandContactDTO, demandDAO } = defaultDemandData;
    const designatedPlace = !!(demandDAO.demandBody.assignPlace && demandDAO.demandBody.assignPlace.length > 0);
    // ??????/???????????????????????????????????????
    if (isDemandEditPage || isReOpenDemandPage) {
      if (demandContactDTO !== undefined && demandContactDTO !== null) {
        const {
          name, email, cellphone, sex, telArea, tel, other, displayCellphone, displayTel, displayOther, contactTimeBegin, contactTimeEnd,
        } = demandContactDTO;
        return {
          ...defaultDemandData,
          areaData: {
            areaDesc: areaData ? areaData.areaDesc : '',
            areaNo: areaData ? areaData.areaNo : '',
          },
          demandDAO: {
            ...demandDAO,
            designatedPlace,
            offReason: demandDAO.offReason !== null && demandDAO.offReason !== -1 ? demandDAO.offReason : -1,
            educationalStage: demandDAO.educationalStage ? demandDAO.educationalStage : 0,
            demandCategory: this.state.demandCategory,
            onlineStatusOption: location.query.reOpenDemandId ? onlineStatusOptsOfAddDemand.phoneVerified[0].value : demandDAO.onlineStatusOption,
            demandTutorInfo: {
              ...defaultDemandData.demandDAO.demandTutorInfo,
            },
            expireDate: this.state.demandExpireDate === '-' ? '-' : dayjs(this.state.demandExpireDate),
          },
          lastMemo: defaultDemandData.lastMemo,
          name,
          sex,
          cellphone,
          telArea,
          tel,
          email,
          other,
          contactTimeBegin,
          contactTimeEnd,
          hideCellphone: !displayCellphone,
          hideTel: !displayTel,
          hideOther: !displayOther,

        };
      }
    } else {
      // ???????????????
      return {
        ...defaultDemandData,
        areaData: {
          areaDesc: areaData ? areaData.areaDesc : '',
          areaNo: areaData ? areaData.areaNo : '',
        },
        demandDAO: {
          ...demandDAO,
          designatedPlace,
          offReason: demandDAO.offReason !== null && demandDAO.offReason !== -1 ? demandDAO.offReason : -1,
          educationalStage: demandDAO.educationalStage ? demandDAO.educationalStage : 0,
          demandCategory: this.state.demandCategory,
          onlineStatusOption: demandDAO.usageStage === '3' && location.query.reOpenDemandId ? onlineStatusOptsOfAddDemand.phoneVerified[0].value : demandDAO.onlineStatusOption,
          demandTutorInfo: {
            ...defaultDemandData.demandDAO.demandTutorInfo,
          },
        },
        lastMemo: defaultDemandData.lastMemo,
        name: '',
        sex: '',
        cellphone: '',
        telArea: '',
        tel: '',
        email: '',
        contactTimeBegin: '',
        contactTimeEnd: '',
      };
    }
  }

  render() {
    const {
      submitDemand, demandType, defaultDemandData, location, areaData, reOpenDemandId,
    } = this.props;
    const isReOpenDemandPage = reOpenDemandId;
    const isDemandEditPage = defaultDemandData.demandDAO && defaultDemandData.demandDAO.demandId !== '' && !isReOpenDemandPage;
    const initData = this.initalData(isDemandEditPage, isReOpenDemandPage, areaData, defaultDemandData, location);
    return (
      <Formik
        initialValues={initData}
        onSubmit={submitDemand}
        validationSchema={demandType === demandTypeList[0].value ? validateTutorDemandv3 : validateCaseDemandv3}
      >
        { this.renderForm }
      </Formik>
    );
  }
}

export default DemandCaseForm;
