import React from 'react';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import { manageGroup } from '../../../config/selectData';
import './MemberShipTypeChart.scss';
import { filterDaysToWeeks } from '../../../util/formatUtil';

const lineData = (category) => {
  const { shipTypeTitleObj } = manageGroup;
  const poolData = [];
  category.forEach((item) => {
    const { recordDate, memberRow } = item;
    const catArr = Object.keys(memberRow.role).slice(1, 11);
    catArr.forEach((quantity) => {
      poolData.push({
        key: shipTypeTitleObj[quantity],
        value: Object.values(memberRow.role)[quantity],
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
        offset: 12,
      },
    },
    color: ['#8E8E8E', '#0000C6', '#82D900', '#C4C400', '#FF0080', '#00AEAE', '#01B468', '#FF3333', '#FAA219', '#0066FF'],
    point: {
      shape: 'circle',
    },
  };
  return config;
};

const MemberShipTypeChart = ({ categoryPool, queryParams, dateFilterType }) => {
  const { targetType, sourceType } = queryParams;
  const isIncome = targetType === 0 || targetType === 2;
  const isPool = targetType === 1 || targetType === 2;
  return (
    <div className="member-ship-wrap">
      {
        isIncome && (
        <div className="type-block">
          <h3 className="type-title">會員身分-進水</h3>
          <Line {...generateConfig(filterDaysToWeeks(dateFilterType, sourceType, lineData(categoryPool.income)))} />
        </div>
        )
      }
      {
        isPool && (
          <div className="type-block">
            <h3 className="type-title">會員身分-水位</h3>
            <Line {...generateConfig(filterDaysToWeeks(dateFilterType, sourceType, lineData(categoryPool.pool)))} />
          </div>
        )
      }
    </div>
  );
};

export default MemberShipTypeChart;
