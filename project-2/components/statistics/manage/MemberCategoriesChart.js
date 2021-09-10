import React from 'react';
import { DualAxes } from '@ant-design/charts';
import dayjs from 'dayjs';
import { showCat } from '../../../util/lablesUtils';
import './MemberCategoriesChart.scss';

const lineDualData = (categoryPool, catNo) => {
  const poolDemandData = [];
  const poolGigData = [];

  categoryPool.forEach((item) => {
    poolDemandData.push({
      案件: item.categoryRow[catNo].demandCount,
      value: item.categoryRow[catNo].demandCount,
      date: dayjs(item.recordDate).format('YYYY/MM/DD'),
      type: '案件',
      key: '案件',
    });

    poolGigData.push({
      接案: item.categoryRow[catNo].gigCount,
      value: item.categoryRow[catNo].gigCount,
      date: dayjs(item.recordDate).format('YYYY/MM/DD'),
      type: '接案',
      key: '接案',
    });
  });

  return [poolDemandData, poolGigData];
};

const generateConfig = (dataList) => {
  const config = {
    data: dataList,
    xField: 'date',
    xAxis: {
      title: {
        text: '日期',
        style: { fontSize: 16 },
      },
      type: 'time',
    },
    yField: ['案件', '接案'],
    yAxis: {
      案件: {
        min: 0,
        title: {
          text: '案件',
          style: { fontSize: 16 },
        },
      },
      接案: {
        min: 0,
        title: {
          text: '接案',
          style: { fontSize: 16 },
        },
      },
    },
    geometryOptions: [
      {
        geometry: 'line',
        color: '#007FFF',
        seriesField: 'type',
      }, {
        geometry: 'line',
        color: '#FF4D00',
        seriesField: 'type',
      },
    ],
    point: {
      shape: 'circle',
    },
  };
  return config;
};

const daysToWeeks = (days) => {
  const weekDays = [];
  for (let i = 0; i < days.length; i += 7) {
    const firstOfWeek = Object.assign({}, days[i]);
    for (let j = 1; j < 7; j++) {
      const isNotExist = !(typeof (days[i + j]) === 'object');
      if (isNotExist) {
        break;
      }
      Object.assign(firstOfWeek, {
        value: firstOfWeek.value + days[i + j].value,
        [firstOfWeek.key]: firstOfWeek.value + days[i + j].value,
      });
    }
    weekDays.push(firstOfWeek);
  }
  return weekDays;
};

const filterDualDaysToWeeks = (dateFilterType, classifiedList) => {
  if (dateFilterType === 1) {
    return classifiedList;
  }
  const weekDays = classifiedList.map(classifiedData => daysToWeeks(classifiedData));
  return weekDays;
};


const MemberCategoriesChart = ({ categoryPool, queryParams, dateFilterType }) => {
  const { targetType } = queryParams;
  const isIncome = targetType === 0;
  const isPool = targetType === 1;
  const isShowChart = isIncome || isPool;
  const categories = isIncome ? (Array.isArray(categoryPool.income) && categoryPool.income[0].categoryRow) : (Array.isArray(categoryPool.pool) && categoryPool.pool[0].categoryRow);
  const categoryList = Object.keys(categories).map(key => ({ key, name: showCat(key) }));
  return (
    <>
      { isShowChart && categoryList.map(category => (
        <div className="member-categories-wrap" key={category.key}>
          <div className="type-block">
            <h3 className="type-title">{category.name}</h3>
            { isIncome && <DualAxes {...generateConfig(filterDualDaysToWeeks(dateFilterType, lineDualData(categoryPool.income, category.key)))} /> }
            { isPool && <DualAxes {...generateConfig(filterDualDaysToWeeks(dateFilterType, lineDualData(categoryPool.pool, category.key)))} /> }
          </div>
        </div>
      )) }
    </>
  );
};

export default MemberCategoriesChart;
