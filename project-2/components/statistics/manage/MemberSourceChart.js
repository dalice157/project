import React from 'react';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import { manageGroup } from '../../../config/selectData';
import './MemberSourceChart.scss';
import { filterDaysToWeeks } from '../../../util/formatUtil';

const lineData = (category) => {
  const { sourceTitleObj } = manageGroup;
  const poolData = [];
  category.forEach((item) => {
    const { recordDate, memberRow } = item;
    const catArr = Object.keys(memberRow.member_source);
    catArr.forEach((quantity) => {
      poolData.push({
        key: sourceTitleObj[quantity],
        value: Object.values(memberRow.member_source)[quantity],
        date: dayjs(recordDate).format('YYYY/MM/DD'),
      });
    });
  });
  console.log('poolData ', poolData);
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
    color: ['#888888', '#FF3333', '#FAA219', '#0066FF'],
    point: {
      shape: 'circle',
    },
  };
  return config;
};

const MemberSourceChart = ({ categoryPool, queryParams, dateFilterType }) => {
  const { targetType, sourceType } = queryParams;
  const isIncome = targetType === 0 || targetType === 2;
  const isPool = targetType === 1 || targetType === 2;
  return (
    <div className="member-source-wrap">
      {
        isIncome && (
        <div className="type-block">
          <h3 className="type-title">接案會員來源-進水</h3>
          <Line {...generateConfig(filterDaysToWeeks(dateFilterType, sourceType, lineData(categoryPool.income)))} />
        </div>
        )
      }
      {
        isPool && (
        <div className="type-block">
          <h3 className="type-title">接案會員來源-水位</h3>
          <Line {...generateConfig(filterDaysToWeeks(dateFilterType, sourceType, lineData(categoryPool.pool)))} />
        </div>
        )
      }
    </div>
  );
};

export default MemberSourceChart;
