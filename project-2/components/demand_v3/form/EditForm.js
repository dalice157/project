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
      alert('下線日必需大於今日，或直接設定結案下刊。');
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
            <Button type="primary" onClick={this.changeExpireDate}>變更下線日</Button>
          </>
        );
      }
    };
    return (
      <>
        <div className="editDemandField">
          <p className="fieldName">結案來源</p>
          <div className="fieldContent">
            {isDemandClosed ? offPersonDesc[offPerson] : '-'}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">押金狀態</p>
          <div className="fieldContent">
            {isDemandUnPublishAndEditing ? '-' : this.getDepositResourceDesc(onlineStatusOption, depositResource, orderMISProcess, orderApplySource)}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">付款序號</p>
          <div className="fieldContent">
            {isDemandUnPublishAndEditing ? '-' : orderPayId === null ? '-' : orderPayId}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">檢舉違規</p>
          <div className="fieldContent">
            {isDemandUnPublishAndEditing ? '-' : violation ? <a href="/admin/violationSearch" target="_blank">檢舉違規成立</a> : '-'}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">建立日期</p>
          <div className="fieldContent">
            {dateFormat(createDate, true)}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">刊登日期</p>
          <div className="fieldContent">
            {isDemandUnPublishAndEditing ? '-' : dateFormat(onlineDate, true)}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">預計下線日</p>
          <div className="fieldContent">
            {hasExpireDate ? 'null' : isShowExpireButton()}
            {
              !isDemandUnPublishAndEditing && this.state.changeExpireDate && (
                <>
                  <DatePicker locale={locale} className="datePicker" value={dayjs(expireDate)} name="demandDAO.expireDate" onChange={(date, dateString) => this.onChangeDate(date, dateString, setFieldValue)} />
                  <Button type="primary" className="datePickerBtn" onClick={this.updateExpireDate}>存儲變更</Button>
                  {
                    this.state.isMoreThen180Days && <div className="notice">注意：刊登日期起算，最長刊期不可超過180天(6個月)</div>
                  }
                </>
              )
            }
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">結案日期</p>
          <div className="fieldContent">
            {isDemandClosed ? dateFormat(offDate, true) : '-'}
          </div>
        </div>
        <div className="editDemandField">
          <p className="fieldName">成交金額</p>
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
                : (<p> — </p>)
            }
          </div>
        </div>
      </>
    );
  }

  renderOffReasonUI = (offReason, usageStage, cooperatingStageWithTopper, haveCommunicatedCount) => {
    if (cooperatingStageWithTopper === 1) {
      // 已被評價的案件，只能選取<需求已完成結案>
      return offReasonOpts.hasEvaluated.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
    }
    if (usageStage === '1' && haveCommunicatedCount === 0) {
      // 刊登中，未溝通過
      return offReasonOpts.nonCommunicated.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
    } else if (usageStage === '2') {
      // 進階刊登已結案待退款，直接顯示結案理由
      return <Option key={offReason} value={offReason}>{findOffReasonLabel(offReason)}</Option>;
    } else if (usageStage === '3') {
      // 基本刊登已結案，直接顯示結案理由
      return <Option key={offReason} value={offReason}>{findOffReasonLabel(offReason)}</Option>;
    }
    return offReasonOpts[offReasonStatusList[usageStage]].map(item => <Option key={item.value} value={item.value}>{item.label}</Option>);
  }

  onUpdateUserForm = (event, setFieldValue) => {
    const isDemandEditPage = this.props.defaultDemandData.demandDAO.demandId !== '';
    if (event.target.checked) {
      // 載入會員資料
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

  educationalStageUI = (demandTutorInfo, needStudentGrade, partnerCount, setFieldValue, isDemandClosed, educationalStage) => (
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
            disabled={isDemandClosed}
          >
            { educationalStageOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>) }
          </Select>
          {
              needStudentGrade ? (
                <Select
                  name="demandDAO.demandTutorInfo.educationalGrade"
                  style={{ width: '200px' }}
                  defaultValue="請選擇年級"
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
          上課人數
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
          學生性別
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
          希望上課方式
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
          希望上課次數
        </p>
        <div className="fieldContent">
          <span>每</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyUnit"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyUnit : ''}
            disabled={isDemandClosed}
          >
            { this.renderTutorFrequencyOptions }
          </Select>
          <span>上課</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyTime"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyTime : ''}
            disabled={isDemandClosed}
          >
            { this.renderTutorFrequencyCountOptions }
          </Select>
          <span>次，每次上課</span>
          <Select
            name="demandDAO.demandTutorInfo.classFrequencyHour"
            style={{ width: 100 }}
            value={demandTutorInfo ? demandTutorInfo.classFrequencyHour : ''}
            disabled={isDemandClosed}
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
              disabled={isDemandClosed}
            />
          </div>
          <div className="fieldContentTime">
            <span>時間：</span>
            <Select
              name="demandDAO.demandTutorInfo.classEveryWeekHourBegin"
              style={{ width: 100 }}
              value={demandTutorInfo ? demandTutorInfo.classEveryWeekHourBegin : ''}
              disabled={isDemandClosed}
            >
              { this.renderTutorTimeListOptions }
            </Select>
            <span>～</span>
            <Select
              name="demandDAO.demandTutorInfo.classEveryWeekHourEnd"
              style={{ width: 100 }}
              value={demandTutorInfo ? (demandTutorInfo.classEveryWeekHourEnd < demandTutorInfo.classEveryWeekHourBegin ? '請選擇' : demandTutorInfo.classEveryWeekHourEnd) : ''}
              disabled={isDemandClosed}
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
        // 編輯中
        if (phoneVerify) {
          return onlineStatusOptsOfModifyDemand.editing.phoneVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
        }
        if (phoneVerify === null) {
          return onlineStatusOptsOfModifyDemand.editing.phoneNotFound.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
        }
        return onlineStatusOptsOfModifyDemand.editing.phoneNotVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
      } else if (usageStage === '1') {
        // 刊登中, 公開/不公開
        return onlineStatusOptsOfModifyDemand.publishing.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
      } else if (usageStage === '2') {
        // 退款中
        // 進階刊登等待押金退款，usageStage依然為2
        if (offReason >= 100 && offReason < 200) {
          return <Option key={onlineStatusOptsForDemand['4'].value} value={onlineStatusOptsForDemand['4'].value}>{onlineStatusOptsForDemand['4'].label}</Option>;
        }
        return <Option key={onlineStatusOptsForDemand['3'].value} value={onlineStatusOptsForDemand['3'].value}>{onlineStatusOptsForDemand['3'].label}</Option>;
      } else if (usageStage === '3') {
        // usageStage === '3' 不可編輯
      // 結束刊登 / 結束刊登(未上刊關閉)
        if (offReason >= 100 && offReason < 200) {
          return <Option key={onlineStatusOptsForDemand['4'].value} value={onlineStatusOptsForDemand['4'].value}>{onlineStatusOptsForDemand['4'].label}</Option>;
        }
        return <Option key={onlineStatusOptsForDemand[usageStage].value} value={onlineStatusOptsForDemand[usageStage].value}>{onlineStatusOptsForDemand[usageStage].label}</Option>;
      } else if (usageStage === '0.5') {
        // usageStage === '0.5' 待審核
        if (depositResource === 'orderTX') {
          // 押金刊登
          if (phoneVerify || emailVerify) {
            return onlineStatusOptsOfModifyDemand.verifying.pay.verified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
          }
          return onlineStatusOptsOfModifyDemand.verifying.pay.notVerified.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
        }
        // 免押金刊登
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
        // <後台>: 編輯中, 後台免押金代刊 [0: 編輯中]
        if (usageStage === '0') {
          // 編輯中無支付押金的狀況
          if (onlineStatusOption === 1 || onlineStatusOption === 2) {
            return (
              <div className="editDemandField">
                <p className="fieldName">免付押金</p>
                <div className="fieldContent">
                  <Checkbox name="freeCharge" checked disabled />
                  <span>( 客服後台代刊免付押金 )</span>
                </div>
              </div>
            );
          }
        } else if (usageStage === '0.5') {
          // 審核中有支付押金的狀況 [0.5: 待審中]
          if (depositResource === 'orderTX' || depositResource === 'free') {
            // <前台>: 有押金, 前台免押金 不顯示欄位 [orderTX: 前台支付押金] [free: 前台基本刊登，免押金]
            return null;
          }
          if (onlineStatusOption === 1 || onlineStatusOption === 2) {
            // <後台>: 免押金代刊
            return (
              <div className="editDemandField">
                <p className="fieldName">免付押金</p>
                <div className="fieldContent">
                  <Checkbox name="freeCharge" checked disabled />
                  <span>( 客服後台代刊免付押金 )</span>
                </div>
              </div>
            );
          }
        } else if (depositResource === 'staffAuthorize') {
          // 若為後台代刊，顯示狀態 [1: 需求進行中][2: 結案申請退款][3: 結案退刊]
          return (
            <div className="editDemandField">
              <p className="fieldName">免付押金</p>
              <div className="fieldContent">
                <Checkbox name="freeCharge" checked disabled />
                <span>( 客服後台代刊免付押金 )</span>
              </div>
            </div>
          );
        } else {
          return <></>;
        }
      } else {
        if ((!isDemandEditPage && usageStage === undefined)) {
          // 新增頁依刊登狀態顯示checkbox
          return (
            <div className="editDemandField">
              <p className="fieldName">免付押金</p>
              <div className="fieldContent">
                <Checkbox name="freeCharge" checked={onlineStatusOption === 1 || onlineStatusOption === 2} disabled />
                <span>( 客服後台代刊免付押金 )</span>
              </div>
            </div>
          );
        }
        return (
          <div className="editDemandField">
            <p className="fieldName">免付押金</p>
            <div className="fieldContent">
              <Checkbox name="freeCharge" checked={false} disabled />
              <span>( 客服後台代刊免付押金 )</span>
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
    // 室內電話驗證
    const telephoneVerified = errors.telArea === undefined && errors.tel === undefined && (telArea !== '' && tel !== '' && telArea !== null && tel !== null);
    // 手機驗證
    const cellphoneVerified = errors.cellphone === undefined && (cellphone !== '' && cellphone !== null);
    // 室內電話、手機驗證二擇一即可
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
    // 案件是否未刊登、編輯中
    const isDemandUnPublishAndEditing = (usageStage === '0') || location.query.reOpenDemandId;
    // 案件是否結案
    const isDemandClosed = (usageStage === '2' || usageStage === '3') && !location.query.reOpenDemandId;
    // 是否為案件編輯頁
    const isDemandEditPage = demandId !== '' && !location.query.reOpenDemandId;
    const isFormValid = !isDemandClosed && phoneVerified;
    // 類別為家教技能才顯示
    // isTutorSkill: 舊案件, character: 新案件類型
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
          {
            isDemandEditPage ? (
              <div className="editDemandField">
                <p className="fieldName">案件編號</p>
                <div className="fieldContent">
                  {demandId.split('-')[1]}
                </div>
              </div>
            ) : <></>
          }
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
                disabled={isDemandClosed}
              >
                {this.renderPublishField(usageStage, phoneVerify, emailVerify, offReason, depositResource, isDemandEditPage)}
              </Select>
            </div>
            { reviewType ? <div className="fieldContent"><Button onClick={this.onCheckPass} icon={reviewType === 1 ? <InfoCircleOutlined /> : <CheckCircleOutlined />} disabled={reviewType !== 1}>{reviewType === 1 ? '確認後審' : '後審-OK'}</Button></div> : <></>}
          </div>
          {
            isDemandEditPage && onlineStatusOption === 3 && (
              <div className="editDemandField">
                <p className="fieldName">結案理由</p>
                <div className="fieldContent">
                  <Select
                    name="demandDAO.offReason"
                    placeholder="請選擇結案理由"
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
            <p className="fieldName">舊站案件編號</p>
            <div className="fieldContent">
              <Input name="demandDAO.oldSiteCaseNo" disabled={isDemandClosed} style={{ width: 350 }} />
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
              案件類別
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
              案件標題
            </p>
            <div className="fieldContent">
              <Input name="demandDAO.demandBody.title" disabled={isDemandClosed} style={{ width: '350px' }} placeholder="標題最多20個字元" />
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
                disabled={isDemandClosed}
              >
                {unitOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
              </Select>
              <span>台幣</span>
              <Input name="demandDAO.demandBody.minPrice" disabled={isDemandClosed} style={{ width: 100 }} />
              <span>～</span>
              <Input name="demandDAO.demandBody.maxPrice" disabled={isDemandClosed} style={{ width: 100 }} />
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
                      value={`${this.state.areaDesc ? this.state.areaDesc : '請選擇指定地點'}`}
                      style={{ width: 180, cursor: 'pointer' }}
                      disabled={isDemandClosed}
                    />
                    {
                      isTutor ? (
                        <div className="fieldContentPlace">
                          <span>附近明顯路標說明</span>
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
              希望身份
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
              需求描述
            </p>
            <div className="fieldContent">
              <TextArea
                name="demandDAO.demandBody.desc"
                placeholder="請說明案件相關的: 1.執行需求 2.執行時間 3.注意事項"
                disabled={isDemandClosed}
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
                onChange={event => this.onUpdateUserForm(event, setFieldValue)}
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
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
                  disabled={isDemandClosed}
                >
                  { this.renderTutorTimeListOptions }
                </Select>
                <span>～</span>
                <Select
                  name="contactTimeEnd"
                  style={{ width: 100 }}
                  value={(contactTimeEnd < contactTimeBegin ? '請選擇' : contactTimeEnd)}
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
            聯絡人電話（室話和手機可擇一填寫）
          </h3>
          <div className="editDemandField">
            <p className="fieldName">室內電話</p>
            <div className="fieldContent">
              <Input
                name="telArea"
                placeholder="區域號碼"
                style={{ width: '100px' }}
                disabled={isDemandClosed}
              />
              <Input
                name="tel"
                placeholder="電話號碼，分機請輸入#"
                style={{ width: '200px', marginLeft: '10px' }}
                disabled={isDemandClosed}
              />
              <Checkbox
                name="hideTel"
                style={{ marginLeft: '10px' }}
                // checked={ hideTel }
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
              />
              <Checkbox
                name="hideCellphone"
                style={{ marginLeft: '10px' }}
                disabled={isDemandClosed}
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
                disabled={isDemandClosed}
              />
              <Checkbox
                name="hideOther"
                style={{ marginLeft: '10px' }}
                disabled={isDemandClosed}
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
              <div style={{ float: 'right' }}>
                {isDemandEditPage ? <Button type="primary" onClick={() => this.onInsertDemandMemo(basicId, demandId, memo, setFieldValue)}>僅新增備註</Button> : ''}
              </div>
            </div>
          </div>
          {
                isDemandEditPage ? (
                  <>
                    <div className="editDemandField">
                      <p className="fieldName">最新備註</p>
                      <div className="fieldContent">
                        {
                              lastMemo ? (
                                <>
                                  {dateFormat(lastMemo.createDate, true)}
&nbsp;【
                                  {lastMemo.staff ? mappingStaffName(lastMemo.staff) : lastMemo.clerk}
                                  】
                                  <br />
                                  {lastMemo.memo}
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                  <a href={`/admin/member/memo/demand/${basicId}?demandId=${demandId}`} target="_blank" rel="noopener noreferrer">查看案件備註</a>
                                </>
                              ) : (<p>無</p>)
                            }
                      </div>
                    </div>
                  </>
                ) : null
              }
        </Card>
        <div style={{ marginTop: '10px' }}>
          <SubmitButton type="primary" htmlType="submit" disabled={!isFormValid}>送出</SubmitButton>
          {((isDemandClosed || usageStage === '0.5' || usageStage === '1') && isDemandEditPage) && (
          <>
&nbsp;&nbsp;
            <Button type={isDemandClosed && 'primary'} onClick={() => this.handleReOpen(basicId, demandId.split('-')[1])}>新增類似需求</Button>
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
    // 修改/同需求刊登才載入聯絡人資料
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
      // 案件新增頁
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
