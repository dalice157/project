import React, { Component } from 'react';
import { Checkbox } from 'antd';
import { RowLayout } from './Row';
import { timeSlotData } from './popoverData.js';
import styles from './ServiceItems.scss';
import Button from '../ui/button';

const CheckboxGroup = Checkbox.Group;
/**
 * 服務時段
 */
class TimeSlot extends Component {
  state = {
    weekday: {
      checkedList: [],
      indeterminate: false,
      checkAll: false,
    },
    holiday: {
      checkedList: [],
      indeterminate: false,
      checkAll: false,
    },
  }

  componentDidMount() {
    const { priority } = this.props;
    const weekdayCheckList = timeSlotData[0].times
      .filter((time, index) => priority
        .includes(timeSlotData[0].values[index]));
    const holidayCheckList = timeSlotData[1].times
      .filter((time, index) => priority
        .includes(timeSlotData[1].values[index]));

    this.setState({
      weekday: {
        checkedList: weekdayCheckList,
        indeterminate: !!weekdayCheckList.length && (weekdayCheckList.length < timeSlotData[0].times.length),
        checkAll: weekdayCheckList.length === timeSlotData[0].times.length,
      },
      holiday: {
        checkedList: holidayCheckList,
        indeterminate: !!holidayCheckList.length && (holidayCheckList.length < timeSlotData[1].times.length),
        checkAll: holidayCheckList.length === timeSlotData[1].times.length,
      }
    });
  }

  onWeekdayChange = (checkedList) => {
    const { id, onTimeSlotChange } = this.props;
    onTimeSlotChange({ id: id, weekdayDescs: checkedList, holidayDescs: this.state.holiday.checkedList });
    this.setState({
      weekday: {
        checkedList: checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < timeSlotData[0].times.length),
        checkAll: checkedList.length === timeSlotData[0].times.length,
      }
    });
  }

  onWeekdayCheckAllChange = (e) => {
    const { id, onTimeSlotChange } = this.props;
    const checkedList = e.target.checked ? timeSlotData[0].times : [];
    onTimeSlotChange({ id: id, weekdayDescs: checkedList, holidayDescs: this.state.holiday.checkedList });
    this.setState({
      weekday: {
        checkedList: checkedList,
        indeterminate: false,
        checkAll: e.target.checked,
      }
    });
  }

  onHolidayChange = (checkedList) => {
    const { id, onTimeSlotChange } = this.props;
    onTimeSlotChange({ id: id, weekdayDescs: this.state.weekday.checkedList, holidayDescs: checkedList });
    this.setState({
      holiday: {
        checkedList: checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < timeSlotData[1].times.length),
        checkAll: checkedList.length === timeSlotData[1].times.length,
      }
    });
  }

  onHolidayCheckAllChange = (e) => {
    const { id, onTimeSlotChange } = this.props;
    const checkedList = e.target.checked ? timeSlotData[1].times : [];
    onTimeSlotChange({ id: id, weekdayDescs: this.state.weekday.checkedList, holidayDescs: checkedList });
    this.setState({
      holiday: {
        checkedList: checkedList,
        indeterminate: false,
        checkAll: e.target.checked,
      }
    });
  }

  handleHide = () => {
    const {
      id, onTimeSlotChange, handleTimeOpen, handleTimeClose
    } = this.props;

    onTimeSlotChange({ id: id, weekdayDescs: this.state.weekday.checkedList, holidayDescs: this.state.holiday.checkedList });
    this.state.weekday.checkedList.length || this.state.holiday.checkedList.length
      ? handleTimeClose()
      : handleTimeOpen();
  }

  renderWeekday = () => (
    <div className={styles.area}>
      <Checkbox
        indeterminate={this.state.weekday.indeterminate}
        onChange={this.onWeekdayCheckAllChange}
        checked={this.state.weekday.checkAll}
      >
        {timeSlotData[0].allTimes}
      </Checkbox>
      <br />
      <CheckboxGroup
        options={timeSlotData[0].times}
        value={this.state.weekday.checkedList}
        onChange={this.onWeekdayChange}
      />
    </div>
  )

  renderHoliday = () => (
    <div className={styles.area}>
      <Checkbox
        indeterminate={this.state.holiday.indeterminate}
        onChange={this.onHolidayCheckAllChange}
        checked={this.state.holiday.checkAll}
      >
        {timeSlotData[1].allTimes}
      </Checkbox>
      <br />
      <CheckboxGroup
        options={timeSlotData[1].times}
        value={this.state.holiday.checkedList}
        onChange={this.onHolidayChange}
      />
    </div>
  )

  renderContent = () => {
    const isValidate = this.state.weekday.checkedList.length || this.state.holiday.checkedList.length ? '' : styles.open;

    return (
      <div className={styles.popover}>
        {this.renderWeekday()}
        {this.renderHoliday()}
        <div className={`${styles.btnWrap} ${styles.hasValidate}`}>
          <span className={`${styles.validate} ${isValidate}`}>請選擇服務時段</span>
          <Button onClick={this.handleHide} type="primary">
            確認
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const {
      title, priority, isTimeOpen, handleTimeOpen
    } = this.props;
    const weekdayCheckList = timeSlotData[0].times
      .filter((time, index) => priority
        .includes(timeSlotData[0].values[index]));
    const holidayCheckList = timeSlotData[1].times
      .filter((time, index) => priority
        .includes(timeSlotData[1].values[index]));
    const weekTimeDescs = weekdayCheckList.length === 3 ? ['平日全時段'] : weekdayCheckList;
    const holidayTimeDescs = holidayCheckList.length === 3 ? ['假日全時段'] : holidayCheckList;
    const TimeDescs = weekdayCheckList.length === 3 && holidayCheckList.length === 3 ? '不拘' : weekTimeDescs.concat(holidayTimeDescs).join('、');

    return (
      <RowLayout
        title={title}
        content={this.renderContent()}
        isOpen={isTimeOpen}
      >
        <span onClick={handleTimeOpen} className={styles.data}>
          {TimeDescs || <span className={styles.warning}>未設定</span>}
        </span>
      </RowLayout>
    );
  }
}
export default TimeSlot;
