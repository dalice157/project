import React from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Checkbox } from 'antd';

import styles from './Sider.scss';

const CheckboxGroup = Checkbox.Group;

class TimeSlot extends React.Component {
  weekdayOnChange = (checkedList) => {
    const { timeSlotValue } = this.props;
    const holidayCK = timeSlotValue ? [4, 5, 6].filter(value => timeSlotValue.split(',').indexOf(value.toString()) !== -1) : [];
    const combineCheckList = [...checkedList, ...holidayCK];

    this.props.onChange(combineCheckList.join());
    // this.props.history.add('proirityOpts', combineCheckList.join());
  }

  weekdayOnCheckAllChange = (e) => {
    const { timeSlotData, timeSlotValue } = this.props;
    const checkedList = e.target.checked ? timeSlotData[0].times.map(item => item.value) : [];
    const holidayCK = timeSlotValue ? [4, 5, 6].filter(value => timeSlotValue.split(',').indexOf(value.toString()) !== -1) : [];

    const combineCheckList = [...checkedList, ...holidayCK];
    this.props.onChange(combineCheckList.join());
    // this.props.history.add('proirityOpts', combineCheckList.join());
  }

  holidayOnChange = (checkedList) => {
    const { timeSlotValue } = this.props;
    const weekdayCK = timeSlotValue ? [1, 2, 3].filter(value => timeSlotValue.split(',').indexOf(value.toString()) !== -1) : [];

    const combineCheckList = [...weekdayCK, ...checkedList];
    this.props.onChange(combineCheckList.join());
    // this.props.history.add('proirityOpts', combineCheckList.join());
  }

  holidayOnCheckAllChange = (e) => {
    const { timeSlotData, timeSlotValue } = this.props;
    const weekdayCK = timeSlotValue ? [1, 2, 3].filter(value => timeSlotValue.split(',').indexOf(value.toString()) !== -1) : [];
    const checkedList = e.target.checked ? timeSlotData[1].times.map(item => item.value) : [];

    const combineCheckList = [...weekdayCK, ...checkedList];
    this.props.onChange(combineCheckList.join());
    // this.props.history.add('proirityOpts', combineCheckList.join());
  }

  render() {
    // const { weekday, holiday } = this.state;
    const { timeSlotData, timeSlotValue } = this.props;

    const weekdayCK = timeSlotValue ? [1, 2, 3].filter(value => timeSlotValue.split(',').indexOf(value.toString()) !== -1) : [];
    const holidayCK = timeSlotValue ? [4, 5, 6].filter(value => timeSlotValue.split(',').indexOf(value.toString()) !== -1) : [];
    const isMobile = uaIsMobile();
    return (
      <div className={styles.block}>
        {
          !isMobile
          && <h3 className={styles.setTitle}>服務時段</h3>
        }
        <div className={styles.time}>
          <Checkbox
            indeterminate={!!weekdayCK.length && (weekdayCK.length < 3)}
            onChange={this.weekdayOnCheckAllChange}
            checked={weekdayCK.length === 3}
          >
            {timeSlotData[0].day}
          </Checkbox>
          <br />
          <CheckboxGroup
            options={timeSlotData[0].times}
            value={weekdayCK}
            onChange={this.weekdayOnChange}
          />
        </div>
        <div className={styles.time}>
          <Checkbox
            indeterminate={!!holidayCK.length && (holidayCK.length < 3)}
            onChange={this.holidayOnCheckAllChange}
            checked={holidayCK.length === 3}
          >
            {timeSlotData[1].day}
          </Checkbox>
          <br />
          <CheckboxGroup
            options={timeSlotData[1].times}
            value={holidayCK}
            onChange={this.holidayOnChange}
          />
        </div>
      </div>
    );
  }
}

export default TimeSlot;
