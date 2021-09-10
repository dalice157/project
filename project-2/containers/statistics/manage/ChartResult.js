import React, { Component } from 'react';
import { Radio } from 'antd';
import MemberTypeChart from '../../../components/statistics/manage/MemberTypeChart';
import MemberSourceChart from '../../../components/statistics/manage/MemberSourceChart';
import MemberCaseBudgetChart from '../../../components/statistics/manage/MemberCaseBudgetChart';
import MemberCategoriesChart from '../../../components/statistics/manage/MemberCategoriesChart';
import MemberShipTypeChart from '../../../components/statistics/manage/MemberShipTypeChart';
import { manageGroup } from '../../../config/selectData';


class ManageResult extends Component {
  state = {
    dateFilterType: 1,
  }

  onDateFilterTypeChange = (event) => {
    this.setState({ dateFilterType: event.target.value });
  }

  render() {
    const { dateFilterType } = this.state;
    const { categoryPool, queryParams } = this.props;
    const { segmentType, sourceType } = queryParams;
    return (
      <>
        <div style={{ margin: '15px' }}>
          <span>折線圖顯示區間：</span>
          <Radio.Group onChange={this.onDateFilterTypeChange} value={dateFilterType}>
            <Radio value={1}>以日顯示</Radio>
            <Radio value={2}>以週顯示</Radio>
          </Radio.Group>
        </div>
        {
          (segmentType === 0 && sourceType === 0) && (
            <MemberTypeChart
              categoryPool={categoryPool}
              queryParams={queryParams}
              dateFilterType={dateFilterType}
            />
          )
        }
        {
          (segmentType === 0 && sourceType === 1) && (
            <MemberSourceChart
              categoryPool={categoryPool}
              queryParams={queryParams}
              dateFilterType={dateFilterType}
            />
          )
        }
        {
          (manageGroup.displaySegmentObj.some(segment => segment.value === segmentType) && sourceType === manageGroup.sourceObj[6].value) && (
            <MemberCategoriesChart
              categoryPool={categoryPool}
              queryParams={queryParams}
              dateFilterType={dateFilterType}
            />
          )
        }
        {
          ([0, 1, 2].some(type => type === segmentType) && sourceType === 7) && (
            <MemberShipTypeChart
              categoryPool={categoryPool}
              queryParams={queryParams}
              dateFilterType={dateFilterType}
            />
          )
        }
        {
          (segmentType === 1 && sourceType === 5) && (
            <MemberCaseBudgetChart
              categoryPool={categoryPool}
              queryParams={queryParams}
              dateFilterType={dateFilterType}
            />
          )
        }
      </>
    );
  }
}

export default ManageResult;
