import React from 'react';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import './salesChart.scss';

const generateConfig = (data, color) => {
  const config = {
    data: data,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => {
            return ''.concat(s, ',');
          });
        },
      },
    },
    color: color,
  };
  return config;
};

const SalesChart = ({ targetChart, dates, isCompared }) => {
  const {
    prepMember, returnPool, continuousPool, rePayPool,
  } = targetChart;
  const {
    targetDate, comparedDate
  } = dates;
  const targetDateDuration = `${dayjs(targetDate).startOf('month').format('YYYY/MM/DD')}～${dayjs(targetDate).endOf('month').format('YYYY/MM/DD')}`;
  const comparedDateDuration = `${dayjs(comparedDate).startOf('month').format('YYYY/MM/DD')}～${dayjs(comparedDate).endOf('month').format('YYYY/MM/DD')}`;
  if (isCompared) {
    const color = ['#1979C9', '#D62A0D'];
    return (
      <>
        <h2 className="chart-header">預備會員</h2>
        <div className="chart-date-tip">
          <span>{targetDateDuration}</span>
          <span>{comparedDateDuration}</span>
        </div>
        <Line { ...this.generateConfig(prepMember, color) } />
        <h2 className="chart-header">回流水池</h2>
        <div className="chart-date-tip">
          <span>{targetDateDuration}</span>
          <span>{comparedDateDuration}</span>
        </div>
        <Line { ...this.generateConfig(returnPool, color) } />
        <h2 className="chart-header">續約水池</h2>
        <div className="chart-date-tip">
          <span>{targetDateDuration}</span>
          <span>{comparedDateDuration}</span>
        </div>
        <Line { ...this.generateConfig(continuousPool, color) } />
        <h2 className="chart-header">再購水池</h2>
        <div className="chart-date-tip">
          <span>{targetDateDuration}</span>
          <span>{comparedDateDuration}</span>
        </div>
        <Line { ...this.generateConfig(rePayPool, color) } />
      </>
    );
  } else {
    const color = ['#1979C9', '#D62A0D', '#FAA219', '#0AA219'];
    return (
      <>
        <h2 className="chart-header">預備會員</h2>
        <Line { ...this.generateConfig(prepMember, color) } />
        <h2 className="chart-header">回流水池</h2>
        <Line { ...this.generateConfig(returnPool, color) } />
        <h2 className="chart-header">續約水池</h2>
        <Line { ...this.generateConfig(continuousPool, color) } />
        <h2 className="chart-header">再購水池</h2>
        <Line { ...this.generateConfig(rePayPool, color) } />
      </>
    );
  }
};

export default SalesChart;
