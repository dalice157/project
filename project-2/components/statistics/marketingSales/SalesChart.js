import React from 'react';
import { Button, Divider, Spin } from 'antd';
import { DualAxes } from '@ant-design/charts';
import dayjs from 'dayjs';
import './SalesChart.scss';

const typeObjVal = {
  new: {
    poolText: '預備會員數',
    singularText: '新單數',
    val: 'newPurchase',
  },
  continuePool: {
    poolText: '續約水池',
    singularText: '續單數',
    val: 'continuePurchase',
  },
  rePurchase: {
    poolText: '回流水池',
    singularText: '回單數',
    val: 'rePurchase',
  },
};

const addData = (daily) => {
  const targetLength = daily.target.length;
  const compareLength = daily.compare.length;
  const isXField = targetLength > compareLength;
  const compares = daily.compare;
  const targets = daily.target;
  if (isXField) {
    const gapLength = targetLength - compareLength;
    for (let index = 0; index < gapLength; index++) {
      compares.push({
        arpu: {
          newPurchase: 0,
          continuePurchase: 0,
          rePurchase: 0,
        },
        createDate: dayjs(compares[compareLength - 1].createDate).add(1, 'day').format('YYYY/MM/DD'),
        purchaseCount: {
          newPurchase: 0,
          continuePurchase: 0,
          rePurchase: 0,
        },
        purchaseMemberPool: {
          newPurchase: 0,
          continuePurchase: 0,
          rePurchase: 0,
        },
      });
    }
  } else {
    const gapLength = compareLength - targetLength;
    for (let index = 0; index < gapLength; index++) {
      targets.push({
        arpu: {
          newPurchase: 0,
          continuePurchase: 0,
          rePurchase: 0,
        },
        createDate: dayjs(targets[targetLength - 1].createDate).add(1, 'day').format('YYYY/MM/DD'),
        purchaseCount: {
          newPurchase: 0,
          continuePurchase: 0,
          rePurchase: 0,
        },
        purchaseMemberPool: {
          newPurchase: 0,
          continuePurchase: 0,
          rePurchase: 0,
        },
      });
    }
  }
  return {
    compare: compares,
    target: targets,
  };
};

const dualAxesData = (daily, type, isCompared) => {
  const poolData = [];
  const singularData = [];
  const arpuData = [];
  let poolAndArpuData = [];
  if (isCompared && daily.compare) {
    addData(daily).target.forEach((item) => {
      poolData.push({
        year: dayjs(item.createDate).format('YYYY/MM/DD'),
        poolSum: item.purchaseMemberPool[typeObjVal[type].val],
        name: typeObjVal[type].poolText,
      });
      singularData.push({
        year: dayjs(item.createDate).format('YYYY/MM/DD'),
        sum: item.purchaseCount[typeObjVal[type].val],
        type: typeObjVal[type].singularText,
      });
      arpuData.push({
        year: dayjs(item.createDate).format('YYYY/MM/DD'),
        poolSum: item.arpu[typeObjVal[type].val],
        name: 'ARPU',
      });
    });
    addData(daily).compare.forEach((item, index) => {
      poolData.push({
        year: dayjs(daily.target[index].createDate).format('YYYY/MM/DD'),
        poolSum: item.purchaseMemberPool[typeObjVal[type].val],
        name: `比較-${typeObjVal[type].poolText}`,
      });
      singularData.push({
        year: dayjs(daily.target[index].createDate).format('YYYY/MM/DD'),
        sum: item.purchaseCount[typeObjVal[type].val],
        type: `比較-${typeObjVal[type].singularText}`,
      });
      arpuData.push({
        year: dayjs(daily.target[index].createDate).format('YYYY/MM/DD'),
        poolSum: item.arpu[typeObjVal[type].val],
        name: '比較-ARPU',
      });
    });
  } else {
    daily.target.forEach((item) => {
      poolData.push({
        year: dayjs(item.createDate).format('YYYY/MM/DD'),
        poolSum: item.purchaseMemberPool[typeObjVal[type].val],
        name: typeObjVal[type].poolText,
      });
      singularData.push({
        year: dayjs(item.createDate).format('YYYY/MM/DD'),
        sum: item.purchaseCount[typeObjVal[type].val],
        type: typeObjVal[type].singularText,
      });
      arpuData.push({
        year: dayjs(item.createDate).format('YYYY/MM/DD'),
        poolSum: item.arpu[typeObjVal[type].val],
        name: 'ARPU',
      });
    });
  }


  poolAndArpuData = [...poolData, ...arpuData];
  return [poolAndArpuData, singularData];
};

const generateConfig = (dataList, type) => {
  const yAxisTitle = type === 'new' ? '預備會員/ARPU' : '水池/ARPU';
  const config = {
    data: dataList,
    xField: 'year',
    yField: ['poolSum', 'sum'],
    yAxis: {
      poolSum: {
        title: {
          text: yAxisTitle,
        },
      },
      sum: {
        title: {
          text: '單數',
        },
      },
    },
    geometryOptions: [
      {
        geometry: 'line',
        seriesField: 'name',
      },
      {
        geometry: 'line',
        seriesField: 'type',
      },
    ],
    point: {
      shape: 'circle',
    },
  };
  return config;
};

const ChartComponent = ({
  title, type, targetStartDate, targetEndDate,
  comparedStartDate, comparedEndDate, salesDaily,
  isCompared,
}) => (
  <>
    <h3 className="type-title">
      {title}
      <br />
      {targetStartDate}
      {' '}
      ~
      {' '}
      {targetEndDate}
      {
        isCompared && (
          <>
            &nbsp;&nbsp;
            相較於
            &nbsp;&nbsp;
            {' '}
            {comparedStartDate}
            {' '}
            ~
            {' '}
            {comparedEndDate}
          </>
        )
      }
    </h3>
    <DualAxes {...generateConfig(dualAxesData(salesDaily, type, isCompared), type, isCompared)} />
    <br />
  </>
);


const SalesChart = ({ chatInfo }) => {
  const {
    isCompared,
    isShowChartWrap,
    isLoading,
    onSubmitChat,
    salesDaily,
    targetStartDate,
    targetEndDate,
    comparedStartDate,
    comparedEndDate,
  } = chatInfo;
  const isAfterMay = dayjs(targetStartDate).isAfter(dayjs('2021/05/31')) && dayjs(comparedStartDate).isAfter(dayjs('2021/05/31'));
  const chartArr = [{
    title: '新購',
    type: 'new',
    targetStartDate,
    targetEndDate,
    comparedStartDate,
    comparedEndDate,
    salesDaily,
    isCompared,
  }, {
    title: '續約',
    type: 'continuePool',
    targetStartDate,
    targetEndDate,
    comparedStartDate,
    comparedEndDate,
    salesDaily,
    isCompared,
  }, {
    title: '回流',
    type: 'rePurchase',
    targetStartDate,
    targetEndDate,
    comparedStartDate,
    comparedEndDate,
    salesDaily,
    isCompared,
  }];
  return (
    <>
      {
        isAfterMay && (
        <>
          <Divider />
          <Button type="primary" onClick={onSubmitChat}>趨勢圖</Button>
          <Spin spinning={isLoading}>
            {
              (isShowChartWrap && salesDaily) && (
              <div className="sales-chart-wrap">
                {
                isCompared && (
                  <>
                    {
                    chartArr.map(info => (
                      <ChartComponent key={info.title} {...info} />
                    ))
                  }
                  </>
                )
              }
                {
                !isCompared && (
                  <>
                    {
                    chartArr.map(info => (
                      <ChartComponent key={info.title} {...info} />
                    ))
                  }
                  </>
                )}
              </div>
              )
            }
          </Spin>
        </>
        )}
    </>
  );
};

export default SalesChart;
