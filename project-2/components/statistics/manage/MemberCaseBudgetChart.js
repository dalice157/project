import React from 'react';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import { manageGroup } from '../../../config/selectData';
import './MemberCaseBudgetChart.scss';
import { filterDaysToWeeks } from '../../../util/formatUtil';

const lineData = (category) => {
  const { caseBudgetTitleObj } = manageGroup;
  const poolData = [];
  category.forEach((item) => {
    const { recordDate, memberRow } = item;
    const catArr = Object.keys(memberRow.budget);
    catArr.forEach((quantity) => {
      poolData.push({
        key: caseBudgetTitleObj[quantity],
        value: Object.values(memberRow.budget)[quantity],
        date: dayjs(recordDate).format('YYYY/MM/DD'),
      });
    });
  });
  return poolData;
};

const generateConfig = (data) => {
  console.log('data:', data);
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'key',
    xAxis: {
      nice: true,
      label: {
        rotate: Math.PI / 8,
        offset: 10,
      },
    },
    color: ['#FF3333', '#FAA219', '#0066FF'],
    point: {
      shape: 'circle',
    },
  };
  return config;
};

const MemberCaseBudgetChart = ({ categoryPool, queryParams, dateFilterType }) => {
  const { targetType, sourceType } = queryParams;
  const isIncome = targetType === 0 || targetType === 2;
  const isPool = targetType === 1 || targetType === 2;
  return (
    <div className="member-budget-wrap">
      {
        isIncome && (
          <div className="type-block">
            <h3 className="type-title">依預算-案件進水</h3>
            <Line {...generateConfig(filterDaysToWeeks(dateFilterType, sourceType, lineData(categoryPool.income)))} />
          </div>
        )
      }
      {
        isPool && (
          <div className="type-block">
            <h3 className="type-title">依預算-案件水位</h3>
            <Line {...generateConfig(filterDaysToWeeks(dateFilterType, sourceType, lineData(categoryPool.pool)))} />
          </div>
        )
      }
    </div>
  );
};

export default MemberCaseBudgetChart;
