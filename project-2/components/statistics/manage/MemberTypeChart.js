import React from 'react';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import { manageGroup } from '../../../config/selectData';
import './MemberTypeChart.scss';
import { filterDaysToWeeks } from '../../../util/formatUtil';

const lineData = (category) => {
  const { memberTypeTitleObj } = manageGroup;
  const poolData = [];
  category.forEach((item) => {
    const { recordDate, memberRow } = item;
    const catArr = Object.keys(memberRow.pay_mode).slice(0, 3);
    catArr.forEach((quantity) => {
      poolData.push({
        key: memberTypeTitleObj[quantity],
        value: Object.values(memberRow.pay_mode)[quantity],
        date: dayjs(recordDate).format('MM/DD'),
      });
    });
  });
  return poolData;
};

// 圖表資料
const generateConfig = (data) => {
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'key',
    xAxis: {
      nice: true,
      label: {
        rotate: Math.PI / 7,
        offset: 9,
      },
    },
    color: ['#1979C9', '#FAA219', '#999999'],
    point: {
      shape: 'circle',
    },
  };
  return config;
};

const MemberTypeChart = ({ categoryPool, queryParams, dateFilterType }) => {
  const { targetType, sourceType } = queryParams;
  const isIncome = targetType === 0 || targetType === 2;
  const isPool = targetType === 1 || targetType === 2;
  return (
    <div className="member-type-wrap">
      {
        isIncome && (
        <div className="type-block">
          <h3 className="type-title">進水</h3>
          <Line {...generateConfig(filterDaysToWeeks(dateFilterType, sourceType, lineData(categoryPool.income)))} />
        </div>
        )
      }
      {
        isPool && (
        <div className="type-block">
          <h3 className="type-title">水位</h3>
          <Line {...generateConfig(filterDaysToWeeks(dateFilterType, sourceType, lineData(categoryPool.pool)))} />
        </div>
        )
      }
    </div>
  );
};

export default MemberTypeChart;
