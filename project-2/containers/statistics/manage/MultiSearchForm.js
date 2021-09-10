import React, { Component } from 'react';
import { Space } from 'antd';
import {
  Form, Select, SubmitButton, Radio,
} from 'formik-antd';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../../components/ui/days';
import { searchMonthTypeOptions, searchDateTypeOptions, manageGroup } from '../../../config/selectData';
import './MultiSearchForm.scss';
import config from '../../../config/config.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const monthFormat = 'YYYY-MM';
const dateFormat = 'YYYY-MM-DD';
class MultiSearchForm extends Component {
  state = {
    endTargetOpen: false,
    triggerTarget: false,
    startTargetValue: dayjs().startOf('month'),
    endTargetValue: dayjs().endOf('month'),
    endComparedOpen: false,
    triggerCompared: false,
    startComparedValue: dayjs().startOf('month'),
    endComparedValue: dayjs().endOf('month'),
  }

  onChangeMonthTargetDate = (element, setFieldValue) => {
    switch (element) {
      case searchMonthTypeOptions[0].value: {
        setFieldValue('targetStartDate', dayjs().startOf('month').format(monthFormat));
        setFieldValue('targetEndDate', dayjs().endOf('month').format(monthFormat));
        break;
      }
      case searchMonthTypeOptions[1].value: {
        setFieldValue('targetStartDate', dayjs().subtract(1, 'month').startOf('month').format(monthFormat));
        setFieldValue('targetEndDate', dayjs().subtract(1, 'month').endOf('month').format(monthFormat));
        break;
      }
      case searchMonthTypeOptions[2].value: {
        setFieldValue('targetStartDate', dayjs().subtract(3, 'month').startOf('month').format(monthFormat));
        setFieldValue('targetEndDate', dayjs().subtract(1, 'month').endOf('month').format(monthFormat));
        break;
      }
      case searchMonthTypeOptions[3].value: {
        setFieldValue('targetStartDate', dayjs().subtract(6, 'month').startOf('month').format(monthFormat));
        setFieldValue('targetEndDate', dayjs().subtract(1, 'month').endOf('month').format(monthFormat));
        break;
      }
      case searchMonthTypeOptions[4].value: {
        setFieldValue('targetStartDate', dayjs().subtract(9, 'month').startOf('month').format(monthFormat));
        setFieldValue('targetEndDate', dayjs().subtract(1, 'month').endOf('month').format(monthFormat));
        break;
      }
      case searchMonthTypeOptions[5].value: {
        setFieldValue('targetStartDate', dayjs().subtract(12, 'month').startOf('month').format(monthFormat));
        setFieldValue('targetEndDate', dayjs().subtract(1, 'month').endOf('month').format(monthFormat));
        break;
      }
      case searchMonthTypeOptions[6].value: {
        setFieldValue('targetStartDate', null);
        setFieldValue('targetEndDate', null);
        break;
      }
      default: {
        return null;
      }
    }
  }

  onChangeDateTargetDate = (element, setFieldValue) => {
    switch (element) {
      case searchDateTypeOptions[0].value: {
        setFieldValue('comparedStartDate', dayjs().subtract(1, 'day').startOf('day').format(dateFormat));
        setFieldValue('comparedEndDate', dayjs().subtract(1, 'day').startOf('day').format(dateFormat));
        break;
      }
      case searchDateTypeOptions[1].value: {
        setFieldValue('comparedStartDate', dayjs().subtract(7, 'day').startOf('day').format(dateFormat));
        setFieldValue('comparedEndDate', dayjs().subtract(1, 'day').endOf('day').format(dateFormat));
        break;
      }
      case searchDateTypeOptions[2].value: {
        setFieldValue('comparedStartDate', dayjs().subtract(14, 'day').startOf('day').format(dateFormat));
        setFieldValue('comparedEndDate', dayjs().subtract(1, 'day').endOf('day').format(dateFormat));
        break;
      }
      case searchDateTypeOptions[3].value: {
        setFieldValue('comparedStartDate', dayjs().subtract(21, 'day').startOf('day').format(dateFormat));
        setFieldValue('comparedEndDate', dayjs().subtract(1, 'day').endOf('day').format(dateFormat));
        break;
      }
      case searchDateTypeOptions[4].value: {
        setFieldValue('comparedStartDate', dayjs().subtract(28, 'day').startOf('day').format(dateFormat));
        setFieldValue('comparedEndDate', dayjs().subtract(1, 'day').endOf('day').format(dateFormat));
        break;
      }
      case searchDateTypeOptions[5].value: {
        setFieldValue('comparedStartDate', null);
        setFieldValue('comparedEndDate', null);
        break;
      }
      default: {
        return null;
      }
    }
  }

  disabledTargetEndDate = (current) => {
    const { startTargetValue } = this.state;
    if (!current) {
      return false;
    }
    return current < dayjs(startTargetValue) || current >= dayjs() || current > dayjs(startTargetValue).add(2, 'year');
  }

  disabledComparedEndDate = (current) => {
    const { startComparedValue } = this.state;
    const start = dayjs(startComparedValue);
    const today = dayjs();
    if (config.VL10168Switch) {
      return current < dayjs(startComparedValue) || current >= dayjs() || current > dayjs(startComparedValue).add(31, 'day');
    }
    return dayjs(current).isSameOrBefore(start, 'days') || dayjs(current).isSameOrAfter(today, 'days');
  }

  onChangeSegment = (e, setFieldValue) => {
    const getChangeSourceType = {
      0: 0,
      1: 6,
      2: 6,
    };
    setFieldValue('sourceType', getChangeSourceType[e.target.value]);
    if (e.target.value === 2) {
      setFieldValue('dimensionType', 0);
    }
  }

  renderForm = (props) => {
    const { values, setFieldValue } = props;
    const {
      displaySegmentObj, sourceObj, targetObj, dimensionObj,
    } = manageGroup;
    const {
      reportType,
      // searchMonthType,
      searchDateType,
      targetStartDate,
      targetEndDate,
      comparedStartDate,
      comparedEndDate,
      segmentType,
    } = values;
    const isValid = reportType === 0 ? (targetStartDate && targetEndDate) : (comparedStartDate && comparedEndDate);
    // 避免行銷誤用，先 1.取消by月查詢 2.disabled尚未開發完的選項，包含selectData.manageGroup裡的部分選項，後續串接直接打開comment即可
    const sourceDisabledOptList = [2, 3, 4, 7]; // VL-10122
    const sourceDisabledDemandOpt = [0, 1];
    return (
      <Form id="manageMult">
        <div>
          <label className="label">報表類型：</label>
          <Radio.Group name="reportType">
            <Space direction="vertical">
              {/* <div className="selectList">
                <Radio value={ 0 }>By月</Radio>
                <Select
                  className="select mrStyle"
                  name="searchMonthType"
                  onChange={ (element) => {
                    this.onChangeMonthTargetDate(element, setFieldValue);
                  } }
                >
                  {searchMonthTypeOptions.map(options => <Select.Option key={ options.value } value={ options.value }>{options.label}</Select.Option>)}
                </Select>
                <DatePicker
                  className="mrStyle"
                  name="targetStartDate"
                  locale={ locale }
                  defaultValue={ dayjs(targetStartDate) }
                  disabled={ searchMonthType !== 6 }
                  disabledDate={ (current) => { return current > dayjs(); } }
                  allowClear={ false }
                  picker="month"
                  value={ targetStartDate !== null ? dayjs(targetStartDate) : '' }
                  onOpenChange={ (open) => {
                    if (targetStartDate) {
                      setFieldValue('targetStartDate', null);
                    }
                    if (targetEndDate) {
                      setFieldValue('targetEndDate', null);
                    }
                    const trigger = this.state.triggerTarget;
                    this.setState({ triggerTarget: !trigger });
                    if (!open) {
                      this.setState({ endTargetOpen: true });
                    }
                  } }
                  onChange={ (dateString) => {
                    this.setState({ startTargetValue: dateString });
                    setFieldValue('targetStartDate', dayjs(dateString).format(monthFormat));
                    if (dateString === null) {
                      setFieldValue('targetEndDate', null);
                    }
                  } }
                />
                {
                (searchMonthType !== 0 && searchMonthType !== 1) && (
                  <>
                    <div className="arc mrStyle"> ～ </div>
                    <DatePicker
                      className="mrStyle"
                      name="targetEndDate"
                      picker="month"
                      locale={ locale }
                      defaultValue={ dayjs(targetEndDate) }
                      disabled={ searchMonthType !== 6 }
                      disabledDate={ this.disabledTargetEndDate }
                      allowClear={ false }
                      value={ targetEndDate !== null ? dayjs(targetEndDate) : '' }
                      open={ this.state.endTargetOpen }
                      onOpenChange={ (open) => {
                        if (!open) {
                          this.setState({ endTargetOpen: open });
                        }
                      } }
                      onChange={ (dateString) => {
                        this.setState({ endTargetValue: dateString });
                        if (dateString === null) {
                          setFieldValue('targetStartDate', null);
                        }
                        setFieldValue('targetEndDate', dayjs(dateString).format(monthFormat));
                      } }
                    />
                  </>
                )
              }
              </div> */}
              <div className="selectList">
                <Radio value={1}>By日</Radio>
                <Select
                  className="select mrStyle"
                  name="searchDateType"
                  onChange={(element) => {
                    this.onChangeDateTargetDate(element, setFieldValue);
                  }}
                >
                  {searchDateTypeOptions.map(options => <Select.Option key={options.value} value={options.value}>{options.label}</Select.Option>)}
                </Select>
                <DatePicker
                  className="mrStyle"
                  name="comparedStartDate"
                  locale={locale}
                  defaultValue={dayjs(comparedStartDate)}
                  disabled={searchDateType !== 5}
                  disabledDate={(current) => {
                    if (config.VL10168Switch) {
                      return current >= dayjs();
                    }
                    return dayjs(current).isSameOrAfter(dayjs(), 'days');
                  }}
                  allowClear={false}
                  value={comparedStartDate !== null ? dayjs(comparedStartDate) : ''}
                  onOpenChange={(open) => {
                    if (comparedStartDate) {
                      setFieldValue('comparedStartDate', null);
                    }
                    if (comparedEndDate) {
                      setFieldValue('comparedEndDate', null);
                    }
                    const trigger = this.state.triggerCompared;
                    this.setState({ triggerCompared: !trigger });
                    if (!open) {
                      this.setState({ endComparedOpen: true });
                    }
                  }}
                  onChange={(dateString) => {
                    this.setState({ startComparedValue: dateString });
                    if (dateString === null) {
                      setFieldValue('comparedEndDate', null);
                    }
                    setFieldValue('comparedStartDate', dayjs(dateString).format(dateFormat));
                  }}
                />
                <div className="arc mrStyle"> ～ </div>
                <DatePicker
                  className="mrStyle"
                  name="comparedEndDate"
                  locale={locale}
                  defaultValue={dayjs(comparedEndDate)}
                  disabled={searchDateType !== 5}
                  disabledDate={this.disabledComparedEndDate}
                  allowClear={false}
                  value={comparedEndDate !== null ? dayjs(comparedEndDate) : ''}
                  open={this.state.endComparedOpen}
                  onOpenChange={(open) => {
                    if (!open) {
                      this.setState({ endComparedOpen: open });
                    }
                  }}
                  onChange={(dateString) => {
                    this.setState({ endComparedValue: dateString });
                    if (dateString === null) {
                      setFieldValue('comparedStartDate', null);
                    }
                    setFieldValue('comparedEndDate', dayjs(dateString).format(dateFormat));
                  }}
                />
              </div>
            </Space>
          </Radio.Group>
          <br />
        </div>
        <div className="mtStyle">
          <label className="label">顯示區隔：</label>
          <Radio.Group name="segmentType" onChange={e => this.onChangeSegment(e, setFieldValue)}>
            {
            displaySegmentObj.map((options, index) => <Radio key={index} value={options.value}>{options.label}</Radio>)
          }
          </Radio.Group>
        </div>
        <div className="mtStyle selectList">
          <label className="label">資料來源：</label>
          <Radio.Group name="sourceType">
            <div>
              {
              sourceObj.filter((item, index) => index <= 2).map((optional, index) => {
                // sourceDisabledOptList: 暫時disable，後續開發可直接拿掉
                const isDisabled = (segmentType === 1 || segmentType === 2) || sourceDisabledOptList.includes(index);
                return <Radio key={index} disabled={isDisabled} value={optional.value}>{optional.label}</Radio>;
              })
            }
            </div>
            <div className="mtStyle">
              {
              sourceObj.filter((item, index) => index > 2 && index <= 5).map((optional, index) => {
                // disable: 案件來源, 案主種類
                const isDisabled = (segmentType === 0 || segmentType === 2) || sourceDisabledDemandOpt.includes(index);
                return <Radio key={index} disabled={isDisabled} value={optional.value}>{optional.label}</Radio>;
              })
            }
            </div>
            <div className="mtStyle">
              {
                sourceObj.filter((item, index) => index < 7 && index > 5).map((optional, index) => {
                  // sourceDisabledOptList: 暫時disable，後續開發可直接拿掉
                  const isDisabled = sourceDisabledOptList.includes(index);
                  return <Radio key={index} disabled={isDisabled} value={optional.value}>{optional.label}</Radio>;
                })
            }
              <Radio key={sourceObj[7].value} disabled={segmentType === 1} value={sourceObj[7].value}>{sourceObj[7].label}</Radio>
            </div>
          </Radio.Group>
        </div>
        <div className="mtStyle">
          <label className="label">顯示指標：</label>
          <Radio.Group name="targetType">
            {
            targetObj.filter((item, index) => index < 3).map((optional, index) => <Radio key={index} value={optional.value}>{optional.label}</Radio>)
            }
            {
            targetObj.filter((item, index) => index > 2).map((optional, index) => <Radio key={index} disabled={segmentType === 0 || segmentType === 1} value={optional.value}>{optional.label}</Radio>)
            }
          </Radio.Group>
        </div>
        <div className="mtStyle selectList">
          <label className="label">其他維度：</label>
          <Radio.Group name="dimensionType">
            <div>
              {
            dimensionObj.filter((item, index) => index <= 3).map((optional, index) => <Radio key={index} value={optional.value}>{optional.label}</Radio>)
            }
            </div>
            <div className="mtStyle">
              {
            dimensionObj.filter((item, index) => index > 3).map((optional, index) => <Radio key={index} disabled={segmentType === 2} value={optional.value}>{optional.label}</Radio>)
            }
            </div>
          </Radio.Group>
        </div>
        <div className="btnWrap">
          <SubmitButton type="primary" disabled={!isValid}>查詢</SubmitButton>
        </div>
        {/* <DebugFormik /> */}
      </Form>
    );
  };

  render() {
    const init = {
      reportType: 1,
      searchMonthType: 0,
      searchDateType: 0,
      segmentType: 0,
      sourceType: 0,
      targetType: 0,
      dimensionType: 0,
      targetStartDate: dayjs().startOf('month').format(monthFormat),
      targetEndDate: dayjs().endOf('month').format(monthFormat),
      comparedStartDate: dayjs().subtract(1, 'day').startOf('day').format(dateFormat),
      comparedEndDate: dayjs().subtract(1, 'day').startOf('day').format(dateFormat),
      compareSearchType: 0,
    };
    return (
      <Formik
        initialValues={init}
        onSubmit={this.props.onSubmitSearch}
      >
        { this.renderForm }
      </Formik>
    );
  }
}

export default MultiSearchForm;
