import React from 'react';
import { Divider } from 'antd';
import { Pie } from '@ant-design/charts';
import './PlansChart.scss';
import dayjs from 'dayjs';

// 可參考： https://charts.ant.design/demos/pie/?type=api
const generateChartData = (data, productMenu) => {
  try {
    const productNoList = Object.keys(productMenu).filter(productNo => productMenu[productNo].productName !== '升級無限雙月刊' && productMenu[productNo].productName !== '升級無限年刊');
    const total = productNoList.reduce((sum, productNo) => sum + data[productNo], 0) || 0;
    const chartdata = productNoList.map(productNo => ({
      方案: productMenu[productNo].productName,
      數量: data[productNo],
      百分比: total !== 0 ? Math.round((data[productNo] / total) * 100) : 0,
    }));
    return chartdata;
  } catch (exception) {
    console.log('productNo error: ', exception);
    throw exception;
  }
};

const generateConfig = (data, title) => {
  const config = {
    appendPadding: 10,
    data,
    colorField: '方案',
    angleField: '百分比',
    radius: 1,
    innerRadius: 0.6,
    label: {
      方案: 'inner',
      offset: '-50%',
      style: { textAlign: 'center' },
      autoRotate: false,
      content: '{value}%',
    },
    tooltip: {
      fields: ['方案', '數量', '百分比'],
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        formatter: () => `${title}\n${data.reduce((sum, element) => sum + element.數量, 0)}`,
      },
    },
  };
  return config;
};

const PlansChart = ({ dates, plansTable, isCompared }) => {
  const {
    targetStartDate, targetEndDate, comparedStartDate, comparedEndDate,
  } = dates;
  const { target, compare } = plansTable;
  const targetDateDuration = `${dayjs(targetStartDate).format('YYYY/MM/DD')}～${dayjs(targetEndDate).format('YYYY/MM/DD')}`;
  const comparedDateDuration = `${dayjs(comparedStartDate).format('YYYY/MM/DD')}～${dayjs(comparedEndDate).format('YYYY/MM/DD')}`;
  if (targetStartDate && target && compare && isCompared) {
    return (
      <div className="chart-pies-compared">
        <div className="chart-pie-pair">
          <div className="chart-pie">
            <h2>{targetDateDuration}</h2>
            <div><Pie {...generateConfig(generateChartData(target.newPurchaseCount, target.productMenu), '新購單數')} /></div>
          </div>
          <div className="chart-pie">
            <h2>{comparedDateDuration}</h2>
            <div><Pie {...generateConfig(generateChartData(compare.newPurchaseCount, compare.productMenu), '新購單數')} /></div>
          </div>
        </div>
        <div className="chart-pie-pair">
          <div className="chart-pie">
            <h2>{targetDateDuration}</h2>
            <div><Pie {...generateConfig(generateChartData(target.continuePurchaseCount, target.productMenu), '續約單數')} /></div>
          </div>
          <div className="chart-pie">
            <h2>{comparedDateDuration}</h2>
            <div><Pie {...generateConfig(generateChartData(compare.continuePurchaseCount, compare.productMenu), '續約單數')} /></div>
          </div>
        </div>
        <Divider />
        <div className="chart-pie-pair">
          <div className="chart-pie">
            <h2>{targetDateDuration}</h2>
            <div><Pie {...generateConfig(generateChartData(target.rePurchaseCount, target.productMenu), '回流單數')} /></div>
          </div>
          <div className="chart-pie">
            <h2>{comparedDateDuration}</h2>
            <div><Pie {...generateConfig(generateChartData(compare.rePurchaseCount, compare.productMenu), '回流單數')} /></div>
          </div>
        </div>
        <div className="chart-pie-pair">
          <div className="chart-pie">
            <h2>{targetDateDuration}</h2>
            <div><Pie {...generateConfig(generateChartData(target.againPurchaseCount, target.productMenu), '再購單數')} /></div>
          </div>
          <div className="chart-pie">
            <h2>{comparedDateDuration}</h2>
            <div><Pie {...generateConfig(generateChartData(compare.againPurchaseCount, compare.productMenu), '再購單數')} /></div>
          </div>
        </div>
      </div>
    );
  } else if (targetStartDate && target) {
    return (
      <div className="chart-pies">
        <div className="chart-pie"><Pie {...generateConfig(generateChartData(target.newPurchaseCount, target.productMenu), '新購單數')} /></div>
        <div className="chart-pie"><Pie {...generateConfig(generateChartData(target.continuePurchaseCount, target.productMenu), '續約單數')} /></div>
        <div className="chart-pie"><Pie {...generateConfig(generateChartData(target.rePurchaseCount, target.productMenu), '回流單數')} /></div>
        <div className="chart-pie"><Pie {...generateConfig(generateChartData(target.againPurchaseCount, target.productMenu), '再購單數')} /></div>
      </div>
    );
  }
  return <></>;
};

export default PlansChart;
