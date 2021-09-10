import React from 'react';
import './PlansTable.scss';
import dayjs from 'dayjs';
import { convertRate } from '../../../util/formatUtil';

const PlansTable = ({ dates, plansTable, isCompared }) => {
  const {
    targetStartDate, targetEndDate, comparedStartDate, comparedEndDate,
  } = dates;

  const {
    target, compare, ratio,
  } = plansTable;
  if ((!targetStartDate && !targetEndDate) || !target) {
    return <></>;
  }
  if (isCompared) {
    const targetDateDuration = `${dayjs(targetStartDate).format('YYYY/MM/DD')}～${dayjs(targetEndDate).format('YYYY/MM/DD')}`;
    const comparedDateDuration = `${dayjs(comparedStartDate).format('YYYY/MM/DD')}～${dayjs(comparedEndDate).format('YYYY/MM/DD')}`;
    const { productMenu } = target;
    const productNo = Object.keys(productMenu);
    const productNoList = {
      valuableNo: productNo.find(element => productMenu[element].productName === '超值雙月刊60天'),
      infiniteNo: productNo.find(element => productMenu[element].productName === '無限型雙月刊60天'),
      value365No: productNo.find(element => productMenu[element].productName === '超值年刊365天'),
      infinite365No: productNo.find(element => productMenu[element].productName === '無限年刊365天'),
      upgradeMonthNo: productNo.find(element => productMenu[element].productName === '升級無限雙月刊'),
      upgradeYearNo: productNo.find(element => productMenu[element].productName === '升級無限年刊'),
    };
    return (
      <>
        <h2>{`${targetDateDuration} 相較 ${comparedDateDuration} 經管付費方案統計表`}</h2>
        <table className="plans-table">
          <tbody>
            <tr className="plans-header-row">
              <th rowSpan="2" colSpan="2" />
              <th rowSpan="2">計次型</th>
              <th colSpan="4">超值型</th>
              <th colSpan="6">無限型</th>
            </tr>
            <tr className="plans-header-row">
              <td>60天</td>
              <td>90+30天</td>
              <td>180+60天</td>
              <td>365天</td>
              <td>60天</td>
              <td>90+30天</td>
              <td>180+60天</td>
              <td>365天</td>
              <td>升級雙月</td>
              <td>升級年刊</td>
            </tr>
            <tr className="plans-header-col">
              <td rowSpan="12">新購</td>
              <td className="plans-sub-header">購買單數</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.newPurchaseCount && target.newPurchaseCount[productNoList.valuableNo]) !== null ? target.newPurchaseCount[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.newPurchaseCount && target.newPurchaseCount[productNoList.value365No]) !== null ? target.newPurchaseCount[productNoList.value365No] : '-'}</td>
              <td>{(target.newPurchaseCount && target.newPurchaseCount[productNoList.infiniteNo]) !== null ? target.newPurchaseCount[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.newPurchaseCount && target.newPurchaseCount[productNoList.infinite365No]) !== null ? target.newPurchaseCount[productNoList.infinite365No] : '-'}</td>
              <td>{(target.newPurchaseCount && target.newPurchaseCount[productNoList.upgradeMonthNo]) !== null ? target.newPurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(target.newPurchaseCount && target.newPurchaseCount[productNoList.upgradeYearNo]) !== null ? target.newPurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.newPurchaseCount && compare.newPurchaseCount[productNoList.valuableNo]) !== null ? compare.newPurchaseCount[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.newPurchaseCount && compare.newPurchaseCount[productNoList.value365No]) !== null ? compare.newPurchaseCount[productNoList.value365No] : '-'}</td>
              <td>{(compare.newPurchaseCount && compare.newPurchaseCount[productNoList.infiniteNo]) !== null ? compare.newPurchaseCount[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.newPurchaseCount && compare.newPurchaseCount[productNoList.infinite365No]) !== null ? compare.newPurchaseCount[productNoList.infinite365No] : '-'}</td>
              <td>{(compare.newPurchaseCount && compare.newPurchaseCount[productNoList.upgradeMonthNo]) !== null ? compare.newPurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(compare.newPurchaseCount && compare.newPurchaseCount[productNoList.upgradeYearNo]) !== null ? compare.newPurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.newPurchaseCount && ratio.newPurchaseCount[productNoList.valuableNo]) !== null ? convertRate(ratio.newPurchaseCount[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.newPurchaseCount && ratio.newPurchaseCount[productNoList.value365No]) !== null ? convertRate(ratio.newPurchaseCount[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.newPurchaseCount && ratio.newPurchaseCount[productNoList.infiniteNo]) !== null ? convertRate(ratio.newPurchaseCount[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.newPurchaseCount && ratio.newPurchaseCount[productNoList.infinite365No]) !== null ? convertRate(ratio.newPurchaseCount[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">購買方案比例</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.newPurchaseRate && target.newPurchaseRate[productNoList.valuableNo]) !== null ? convertRate(target.newPurchaseRate[productNoList.valuableNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.newPurchaseRate && target.newPurchaseRate[productNoList.value365No]) !== null ? convertRate(target.newPurchaseRate[productNoList.value365No]) : '-'}</td>
              <td>{(target.newPurchaseRate && target.newPurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(target.newPurchaseRate[productNoList.infiniteNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.newPurchaseRate && target.newPurchaseRate[productNoList.infinite365No]) !== null ? convertRate(target.newPurchaseRate[productNoList.infinite365No]) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.newPurchaseRate && compare.newPurchaseRate[productNoList.valuableNo]) !== null ? convertRate(compare.newPurchaseRate[productNoList.valuableNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.newPurchaseRate && compare.newPurchaseRate[productNoList.value365No]) !== null ? convertRate(compare.newPurchaseRate[productNoList.value365No]) : '-'}</td>
              <td>{(compare.newPurchaseRate && compare.newPurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(compare.newPurchaseRate[productNoList.infiniteNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.newPurchaseRate && compare.newPurchaseRate[productNoList.infinite365No]) !== null ? convertRate(compare.newPurchaseRate[productNoList.infinite365No]) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.newPurchaseRate && ratio.newPurchaseRate[productNoList.valuableNo]) !== null ? convertRate(ratio.newPurchaseRate[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.newPurchaseRate && ratio.newPurchaseRate[productNoList.value365No]) !== null ? convertRate(ratio.newPurchaseRate[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.newPurchaseRate && ratio.newPurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(ratio.newPurchaseRate[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.newPurchaseRate && ratio.newPurchaseRate[productNoList.infinite365No]) !== null ? convertRate(ratio.newPurchaseRate[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">業績</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.newPurchasePerformance && target.newPurchasePerformance[productNoList.valuableNo]) !== null ? target.newPurchasePerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.newPurchasePerformance && target.newPurchasePerformance[productNoList.value365No]) !== null ? target.newPurchasePerformance[productNoList.value365No] : '-'}</td>
              <td>{(target.newPurchasePerformance && target.newPurchasePerformance[productNoList.infiniteNo]) !== null ? target.newPurchasePerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.newPurchasePerformance && target.newPurchasePerformance[productNoList.infinite365No]) !== null ? target.newPurchasePerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(target.newPurchasePerformance && target.newPurchasePerformance[productNoList.upgradeMonthNo]) !== null ? target.newPurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(target.newPurchasePerformance && target.newPurchasePerformance[productNoList.upgradeYearNo]) !== null ? target.newPurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.newPurchasePerformance && compare.newPurchasePerformance[productNoList.valuableNo]) !== null ? compare.newPurchasePerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.newPurchasePerformance && compare.newPurchasePerformance[productNoList.value365No]) !== null ? compare.newPurchasePerformance[productNoList.value365No] : '-'}</td>
              <td>{(compare.newPurchasePerformance && compare.newPurchasePerformance[productNoList.infiniteNo]) !== null ? compare.newPurchasePerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.newPurchasePerformance && compare.newPurchasePerformance[productNoList.infinite365No]) !== null ? compare.newPurchasePerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(compare.newPurchasePerformance && target.newPurchasePerformance[productNoList.upgradeMonthNo]) !== null ? compare.newPurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(compare.newPurchasePerformance && target.newPurchasePerformance[productNoList.upgradeYearNo]) !== null ? compare.newPurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.newPurchasePerformance && ratio.newPurchasePerformance[productNoList.valuableNo]) !== null ? convertRate(ratio.newPurchasePerformance[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.newPurchasePerformance && ratio.newPurchasePerformance[productNoList.value365No]) !== null ? convertRate(ratio.newPurchasePerformance[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.newPurchasePerformance && ratio.newPurchasePerformance[productNoList.infiniteNo]) !== null ? convertRate(ratio.newPurchasePerformance[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.newPurchasePerformance && ratio.newPurchasePerformance[productNoList.infinite365No]) !== null ? convertRate(ratio.newPurchasePerformance[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr className="plans-header-col">
              <td rowSpan="12">續約</td>
              <td className="plans-sub-header">購買單數</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.continuePurchaseCount && target.continuePurchaseCount[productNoList.valuableNo]) !== null ? target.continuePurchaseCount[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.continuePurchaseCount && target.continuePurchaseCount[productNoList.value365No]) !== null ? target.continuePurchaseCount[productNoList.value365No] : '-'}</td>
              <td>{(target.continuePurchaseCount && target.continuePurchaseCount[productNoList.infiniteNo]) !== null ? target.continuePurchaseCount[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.continuePurchaseCount && target.continuePurchaseCount[productNoList.infinite365No]) !== null ? target.continuePurchaseCount[productNoList.infinite365No] : '-'}</td>
              <td>{(target.continuePurchaseCount && target.continuePurchaseCount[productNoList.upgradeMonthNo]) !== null ? target.continuePurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(target.continuePurchaseCount && target.continuePurchaseCount[productNoList.upgradeYearNo]) !== null ? target.continuePurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.continuePurchaseCount && compare.continuePurchaseCount[productNoList.valuableNo]) !== null ? compare.continuePurchaseCount[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.continuePurchaseCount && compare.continuePurchaseCount[productNoList.value365No]) !== null ? compare.continuePurchaseCount[productNoList.value365No] : '-'}</td>
              <td>{(compare.continuePurchaseCount && compare.continuePurchaseCount[productNoList.infiniteNo]) !== null ? compare.continuePurchaseCount[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.continuePurchaseCount && compare.continuePurchaseCount[productNoList.infinite365No]) !== null ? compare.continuePurchaseCount[productNoList.infinite365No] : '-'}</td>
              <td>{(compare.continuePurchaseCount && compare.continuePurchaseCount[productNoList.upgradeMonthNo]) !== null ? compare.continuePurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(compare.continuePurchaseCount && compare.continuePurchaseCount[productNoList.upgradeYearNo]) !== null ? compare.continuePurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.continuePurchaseCount && ratio.continuePurchaseCount[productNoList.valuableNo]) !== null ? convertRate(ratio.continuePurchaseCount[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.continuePurchaseCount && ratio.continuePurchaseCount[productNoList.value365No]) !== null ? convertRate(ratio.continuePurchaseCount[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.continuePurchaseCount && ratio.continuePurchaseCount[productNoList.infiniteNo]) !== null ? convertRate(ratio.continuePurchaseCount[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.continuePurchaseCount && ratio.continuePurchaseCount[productNoList.infinite365No]) !== null ? convertRate(ratio.continuePurchaseCount[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">購買方案比例</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.continuePurchaseRate && target.continuePurchaseRate[productNoList.valuableNo]) !== null ? convertRate(target.continuePurchaseRate[productNoList.valuableNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.continuePurchaseRate && target.continuePurchaseRate[productNoList.value365No]) !== null ? convertRate(target.continuePurchaseRate[productNoList.value365No]) : '-'}</td>
              <td>{(target.continuePurchaseRate && target.continuePurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(target.continuePurchaseRate[productNoList.infiniteNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.continuePurchaseRate && target.continuePurchaseRate[productNoList.infinite365No]) !== null ? convertRate(target.continuePurchaseRate[productNoList.infinite365No]) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.continuePurchaseRate && compare.continuePurchaseRate[productNoList.valuableNo]) !== null ? convertRate(compare.continuePurchaseRate[productNoList.valuableNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.continuePurchaseRate && compare.continuePurchaseRate[productNoList.value365No]) !== null ? convertRate(compare.continuePurchaseRate[productNoList.value365No]) : '-'}</td>
              <td>{(compare.continuePurchaseRate && compare.continuePurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(compare.continuePurchaseRate[productNoList.infiniteNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.continuePurchaseRate && compare.continuePurchaseRate[productNoList.infinite365No]) !== null ? convertRate(compare.continuePurchaseRate[productNoList.infinite365No]) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.continuePurchaseRate && ratio.continuePurchaseRate[productNoList.valuableNo]) !== null ? convertRate(ratio.continuePurchaseRate[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.continuePurchaseRate && ratio.continuePurchaseRate[productNoList.value365No]) !== null ? convertRate(ratio.continuePurchaseRate[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.continuePurchaseRate && ratio.continuePurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(ratio.continuePurchaseRate[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.continuePurchaseRate && ratio.continuePurchaseRate[productNoList.infinite365No]) !== null ? convertRate(ratio.continuePurchaseRate[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">業績</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.continuePurchasePerformance && target.continuePurchasePerformance[productNoList.valuableNo]) !== null ? target.continuePurchasePerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.continuePurchasePerformance && target.continuePurchasePerformance[productNoList.value365No]) !== null ? target.continuePurchasePerformance[productNoList.value365No] : '-'}</td>
              <td>{(target.continuePurchasePerformance && target.continuePurchasePerformance[productNoList.infiniteNo]) !== null ? target.continuePurchasePerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.continuePurchasePerformance && target.continuePurchasePerformance[productNoList.infinite365No]) !== null ? target.continuePurchasePerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(target.continuePurchasePerformance && target.continuePurchasePerformance[productNoList.upgradeMonthNo]) !== null ? target.continuePurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(target.continuePurchasePerformance && target.continuePurchasePerformance[productNoList.upgradeYearNo]) !== null ? target.continuePurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.continuePurchasePerformance && compare.continuePurchasePerformance[productNoList.valuableNo]) !== null ? compare.continuePurchasePerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.continuePurchasePerformance && compare.continuePurchasePerformance[productNoList.value365No]) !== null ? compare.continuePurchasePerformance[productNoList.value365No] : '-'}</td>
              <td>{(compare.continuePurchasePerformance && compare.continuePurchasePerformance[productNoList.infiniteNo]) !== null ? compare.continuePurchasePerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.continuePurchasePerformance && compare.continuePurchasePerformance[productNoList.infinite365No]) !== null ? compare.continuePurchasePerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(compare.continuePurchasePerformance && compare.continuePurchasePerformance[productNoList.upgradeMonthNo]) !== null ? compare.continuePurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(compare.continuePurchasePerformance && compare.continuePurchasePerformance[productNoList.upgradeYearNo]) !== null ? compare.continuePurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.continuePurchasePerformance && ratio.continuePurchasePerformance[productNoList.valuableNo]) !== null ? convertRate(ratio.continuePurchasePerformance[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.continuePurchasePerformance && ratio.continuePurchasePerformance[productNoList.value365No]) !== null ? convertRate(ratio.continuePurchasePerformance[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.continuePurchasePerformance && ratio.continuePurchasePerformance[productNoList.infiniteNo]) !== null ? convertRate(ratio.continuePurchasePerformance[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.continuePurchasePerformance && ratio.continuePurchasePerformance[productNoList.infinite365No]) !== null ? convertRate(ratio.continuePurchasePerformance[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr className="plans-header-col">
              <td rowSpan="12">回流</td>
              <td className="plans-sub-header">購買單數</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.rePurchaseCount && target.rePurchaseCount[productNoList.valuableNo]) !== null ? target.rePurchaseCount[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.rePurchaseCount && target.rePurchaseCount[productNoList.value365No]) !== null ? target.rePurchaseCount[productNoList.value365No] : '-'}</td>
              <td>{(target.rePurchaseCount && target.rePurchaseCount[productNoList.infiniteNo]) !== null ? target.rePurchaseCount[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.rePurchaseCount && target.rePurchaseCount[productNoList.infinite365No]) !== null ? target.rePurchaseCount[productNoList.infinite365No] : '-'}</td>
              <td>{(target.rePurchaseCount && target.rePurchaseCount[productNoList.upgradeMonthNo]) !== null ? target.rePurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(target.rePurchaseCount && target.rePurchaseCount[productNoList.upgradeYearNo]) !== null ? target.rePurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.rePurchaseCount && compare.rePurchaseCount[productNoList.valuableNo]) !== null ? compare.rePurchaseCount[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.rePurchaseCount && compare.rePurchaseCount[productNoList.value365No]) !== null ? compare.rePurchaseCount[productNoList.value365No] : '-'}</td>
              <td>{(compare.rePurchaseCount && compare.rePurchaseCount[productNoList.infiniteNo]) !== null ? compare.rePurchaseCount[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.rePurchaseCount && compare.rePurchaseCount[productNoList.infinite365No]) !== null ? compare.rePurchaseCount[productNoList.infinite365No] : '-'}</td>
              <td>{(compare.rePurchaseCount && compare.rePurchaseCount[productNoList.upgradeMonthNo]) !== null ? compare.rePurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(compare.rePurchaseCount && compare.rePurchaseCount[productNoList.upgradeYearNo]) !== null ? compare.rePurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.rePurchaseCount && ratio.rePurchaseCount[productNoList.valuableNo]) !== null ? convertRate(ratio.rePurchaseCount[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.rePurchaseCount && ratio.rePurchaseCount[productNoList.value365No]) !== null ? convertRate(ratio.rePurchaseCount[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.rePurchaseCount && ratio.rePurchaseCount[productNoList.infiniteNo]) !== null ? convertRate(ratio.rePurchaseCount[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.rePurchaseCount && ratio.rePurchaseCount[productNoList.infinite365No]) !== null ? convertRate(ratio.rePurchaseCount[productNoList.infinite365No], true) : '-'}</td>
              <td>{(ratio.rePurchaseCount && ratio.rePurchaseCount[productNoList.upgradeMonthNo]) !== null ? convertRate(ratio.rePurchaseCount[productNoList.upgradeMonthNo], true) : '-'}</td>
              <td>{(ratio.rePurchaseCount && ratio.rePurchaseCount[productNoList.upgradeYearNo]) !== null ? convertRate(ratio.rePurchaseCount[productNoList.upgradeYearNo], true) : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">購買方案比例</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.rePurchaseRate && target.rePurchaseRate[productNoList.valuableNo]) !== null ? convertRate(target.rePurchaseRate[productNoList.valuableNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.rePurchaseRate && target.rePurchaseRate[productNoList.value365No]) !== null ? convertRate(target.rePurchaseRate[productNoList.value365No]) : '-'}</td>
              <td>{(target.rePurchaseRate && target.rePurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(target.rePurchaseRate[productNoList.infiniteNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.rePurchaseRate && target.rePurchaseRate[productNoList.infinite365No]) !== null ? convertRate(target.rePurchaseRate[productNoList.infinite365No]) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.rePurchaseRate && compare.rePurchaseRate[productNoList.valuableNo]) !== null ? convertRate(compare.rePurchaseRate[productNoList.valuableNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.rePurchaseRate && compare.rePurchaseRate[productNoList.value365No]) !== null ? convertRate(compare.rePurchaseRate[productNoList.value365No]) : '-'}</td>
              <td>{(compare.rePurchaseRate && compare.rePurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(compare.rePurchaseRate[productNoList.infiniteNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.rePurchaseRate && compare.rePurchaseRate[productNoList.infinite365No]) !== null ? convertRate(compare.rePurchaseRate[productNoList.infinite365No]) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.rePurchaseRate && ratio.rePurchaseRate[productNoList.valuableNo]) !== null ? convertRate(ratio.rePurchaseRate[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.rePurchaseRate && ratio.rePurchaseRate[productNoList.value365No]) !== null ? convertRate(ratio.rePurchaseRate[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.rePurchaseRate && ratio.rePurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(ratio.rePurchaseRate[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.rePurchaseRate && ratio.rePurchaseRate[productNoList.infinite365No]) !== null ? convertRate(ratio.rePurchaseRate[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">業績</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.rePurchasePerformance && target.rePurchasePerformance[productNoList.valuableNo]) !== null ? target.rePurchasePerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.rePurchasePerformance && target.rePurchasePerformance[productNoList.value365No]) !== null ? target.rePurchasePerformance[productNoList.value365No] : '-'}</td>
              <td>{(target.rePurchasePerformance && target.rePurchasePerformance[productNoList.infiniteNo]) !== null ? target.rePurchasePerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.rePurchasePerformance && target.rePurchasePerformance[productNoList.infinite365No]) !== null ? target.rePurchasePerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(target.rePurchasePerformance && target.rePurchasePerformance[productNoList.upgradeMonthNo]) !== null ? target.rePurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(target.rePurchasePerformance && target.rePurchasePerformance[productNoList.upgradeYearNo]) !== null ? target.rePurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.rePurchasePerformance && compare.rePurchasePerformance[productNoList.valuableNo]) !== null ? compare.rePurchasePerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.rePurchasePerformance && compare.rePurchasePerformance[productNoList.value365No]) !== null ? compare.rePurchasePerformance[productNoList.value365No] : '-'}</td>
              <td>{(compare.rePurchasePerformance && compare.rePurchasePerformance[productNoList.infiniteNo]) !== null ? compare.rePurchasePerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.rePurchasePerformance && compare.rePurchasePerformance[productNoList.infinite365No]) !== null ? compare.rePurchasePerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(compare.rePurchasePerformance && compare.rePurchasePerformance[productNoList.upgradeMonthNo]) !== null ? compare.rePurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(compare.rePurchasePerformance && compare.rePurchasePerformance[productNoList.upgradeYearNo]) !== null ? compare.rePurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.rePurchasePerformance && ratio.rePurchasePerformance[productNoList.valuableNo]) !== null ? convertRate(ratio.rePurchasePerformance[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.rePurchasePerformance && ratio.rePurchasePerformance[productNoList.value365No]) !== null ? convertRate(ratio.rePurchasePerformance[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.rePurchasePerformance && ratio.rePurchasePerformance[productNoList.infiniteNo]) !== null ? convertRate(ratio.rePurchasePerformance[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.rePurchasePerformance && ratio.rePurchasePerformance[productNoList.infinite365No]) !== null ? convertRate(ratio.rePurchasePerformance[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr className="plans-header-col">
              <td rowSpan="12">再購（續＋回）</td>
              <td className="plans-sub-header">購買單數</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.againPurchaseCount && target.againPurchaseCount[productNoList.valuableNo]) !== null ? target.againPurchaseCount[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.againPurchaseCount && target.againPurchaseCount[productNoList.value365No]) !== null ? target.againPurchaseCount[productNoList.value365No] : '-'}</td>
              <td>{(target.againPurchaseCount && target.againPurchaseCount[productNoList.infiniteNo]) !== null ? target.againPurchaseCount[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.againPurchaseCount && target.againPurchaseCount[productNoList.infinite365No]) !== null ? target.againPurchaseCount[productNoList.infinite365No] : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.againPurchaseCount && compare.againPurchaseCount[productNoList.valuableNo]) !== null ? compare.againPurchaseCount[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.againPurchaseCount && compare.againPurchaseCount[productNoList.value365No]) !== null ? compare.againPurchaseCount[productNoList.value365No] : '-'}</td>
              <td>{(compare.againPurchaseCount && compare.againPurchaseCount[productNoList.infiniteNo]) !== null ? compare.againPurchaseCount[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.againPurchaseCount && compare.againPurchaseCount[productNoList.infinite365No]) !== null ? compare.againPurchaseCount[productNoList.infinite365No] : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.againPurchaseCount && ratio.againPurchaseCount[productNoList.valuableNo]) !== null ? convertRate(ratio.againPurchaseCount[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.againPurchaseCount && ratio.againPurchaseCount[productNoList.value365No]) !== null ? convertRate(ratio.againPurchaseCount[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.againPurchaseCount && ratio.againPurchaseCount[productNoList.infiniteNo]) !== null ? convertRate(ratio.againPurchaseCount[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.againPurchaseCount && ratio.againPurchaseCount[productNoList.infinite365No]) !== null ? convertRate(ratio.againPurchaseCount[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">購買方案比例</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.againPurchaseRate && target.againPurchaseRate[productNoList.valuableNo]) !== null ? convertRate(target.againPurchaseRate[productNoList.valuableNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.againPurchaseRate && target.againPurchaseRate[productNoList.value365No]) !== null ? convertRate(target.againPurchaseRate[productNoList.value365No]) : '-'}</td>
              <td>{(target.againPurchaseRate && target.againPurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(target.againPurchaseRate[productNoList.infiniteNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.againPurchaseRate && target.againPurchaseRate[productNoList.infinite365No]) !== null ? convertRate(target.againPurchaseRate[productNoList.infinite365No]) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.againPurchaseRate && compare.againPurchaseRate[productNoList.valuableNo]) !== null ? convertRate(compare.againPurchaseRate[productNoList.valuableNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.againPurchaseRate && compare.againPurchaseRate[productNoList.value365No]) !== null ? convertRate(compare.againPurchaseRate[productNoList.value365No]) : '-'}</td>
              <td>{(compare.againPurchaseRate && compare.againPurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(compare.againPurchaseRate[productNoList.infiniteNo]) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.againPurchaseRate && compare.againPurchaseRate[productNoList.infinite365No]) !== null ? convertRate(compare.againPurchaseRate[productNoList.infinite365No]) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.againPurchaseRate && ratio.againPurchaseRate[productNoList.valuableNo]) !== null ? convertRate(ratio.againPurchaseRate[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.againPurchaseRate && ratio.againPurchaseRate[productNoList.value365No]) !== null ? convertRate(ratio.againPurchaseRate[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.againPurchaseRate && ratio.againPurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(ratio.againPurchaseRate[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.againPurchaseRate && ratio.againPurchaseRate[productNoList.infinite365No]) !== null ? convertRate(ratio.againPurchaseRate[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="plans-sub-header">業績</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.againPurchasePerformance && target.againPurchasePerformance[productNoList.valuableNo]) !== null ? target.againPurchasePerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.againPurchasePerformance && target.againPurchasePerformance[productNoList.value365No]) !== null ? target.againPurchasePerformance[productNoList.value365No] : '-'}</td>
              <td>{(target.againPurchasePerformance && target.againPurchasePerformance[productNoList.infiniteNo]) !== null ? target.againPurchasePerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.againPurchasePerformance && target.againPurchasePerformance[productNoList.infinite365No]) !== null ? target.againPurchasePerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(target.againPurchasePerformance && target.againPurchasePerformance[productNoList.upgradeMonthNo]) !== null ? target.againPurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(target.againPurchasePerformance && target.againPurchasePerformance[productNoList.upgradeYearNo]) !== null ? target.againPurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.againPurchasePerformance && compare.againPurchasePerformance[productNoList.valuableNo]) !== null ? compare.againPurchasePerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.againPurchasePerformance && compare.againPurchasePerformance[productNoList.value365No]) !== null ? compare.againPurchasePerformance[productNoList.value365No] : '-'}</td>
              <td>{(compare.againPurchasePerformance && compare.againPurchasePerformance[productNoList.infiniteNo]) !== null ? compare.againPurchasePerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.againPurchasePerformance && compare.againPurchasePerformance[productNoList.infinite365No]) !== null ? compare.againPurchasePerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(compare.againPurchasePerformance && compare.againPurchasePerformance[productNoList.upgradeMonthNo]) !== null ? compare.againPurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(compare.againPurchasePerformance && compare.againPurchasePerformance[productNoList.upgradeYearNo]) !== null ? compare.againPurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.againPurchasePerformance && ratio.againPurchasePerformance[productNoList.valuableNo]) !== null ? convertRate(ratio.againPurchasePerformance[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.againPurchasePerformance && ratio.againPurchasePerformance[productNoList.value365No]) !== null ? convertRate(ratio.againPurchasePerformance[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.againPurchasePerformance && ratio.againPurchasePerformance[productNoList.infiniteNo]) !== null ? convertRate(ratio.againPurchasePerformance[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.againPurchasePerformance && ratio.againPurchasePerformance[productNoList.infinite365No]) !== null ? convertRate(ratio.againPurchasePerformance[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr className="plans-header-col">
              <td rowSpan="4">新續回</td>
              <td className="plans-sub-header">合併業績</td>
              <td colSpan="9" />
            </tr>
            <tr>
              <td className="plans-sub-header">{targetDateDuration}</td>
              <td>-</td>
              <td>{(target.purchaseSumPerformance && target.purchaseSumPerformance[productNoList.valuableNo]) !== null ? target.purchaseSumPerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.purchaseSumPerformance && target.purchaseSumPerformance[productNoList.value365No]) !== null ? target.purchaseSumPerformance[productNoList.value365No] : '-'}</td>
              <td>{(target.purchaseSumPerformance && target.purchaseSumPerformance[productNoList.infiniteNo]) !== null ? target.purchaseSumPerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(target.purchaseSumPerformance && target.purchaseSumPerformance[productNoList.infinite365No]) !== null ? target.purchaseSumPerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(target.purchaseSumPerformance && target.purchaseSumPerformance[productNoList.upgradeMonthNo]) !== null ? target.purchaseSumPerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(target.purchaseSumPerformance && target.purchaseSumPerformance[productNoList.upgradeYearNo]) !== null ? target.purchaseSumPerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">{comparedDateDuration}</td>
              <td>-</td>
              <td>{(compare.purchaseSumPerformance && compare.purchaseSumPerformance[productNoList.valuableNo]) !== null ? compare.purchaseSumPerformance[productNoList.valuableNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.purchaseSumPerformance && compare.purchaseSumPerformance[productNoList.value365No]) !== null ? compare.purchaseSumPerformance[productNoList.value365No] : '-'}</td>
              <td>{(compare.purchaseSumPerformance && compare.purchaseSumPerformance[productNoList.infiniteNo]) !== null ? compare.purchaseSumPerformance[productNoList.infiniteNo] : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(compare.purchaseSumPerformance && compare.purchaseSumPerformance[productNoList.infinite365No]) !== null ? compare.purchaseSumPerformance[productNoList.infinite365No] : '-'}</td>
              <td>{(compare.purchaseSumPerformance && compare.purchaseSumPerformance[productNoList.upgradeMonthNo]) !== null ? compare.purchaseSumPerformance[productNoList.upgradeMonthNo] : '-'}</td>
              <td>{(compare.purchaseSumPerformance && compare.purchaseSumPerformance[productNoList.upgradeYearNo]) !== null ? compare.purchaseSumPerformance[productNoList.upgradeYearNo] : '-'}</td>
            </tr>
            <tr>
              <td className="plans-sub-header">%變更</td>
              <td>-</td>
              <td>{(ratio.purchaseSumPerformance && ratio.purchaseSumPerformance[productNoList.valuableNo]) !== null ? convertRate(ratio.purchaseSumPerformance[productNoList.valuableNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.purchaseSumPerformance && ratio.purchaseSumPerformance[productNoList.value365No]) !== null ? convertRate(ratio.purchaseSumPerformance[productNoList.value365No], true) : '-'}</td>
              <td>{(ratio.purchaseSumPerformance && ratio.purchaseSumPerformance[productNoList.infiniteNo]) !== null ? convertRate(ratio.purchaseSumPerformance[productNoList.infiniteNo], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
              <td>{(ratio.purchaseSumPerformance && ratio.purchaseSumPerformance[productNoList.infinite365No]) !== null ? convertRate(ratio.purchaseSumPerformance[productNoList.infinite365No], true) : '-'}</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
  const {
    newPurchaseCount, newPurchaseRate, newPurchasePerformance, continuePurchaseCount, continuePurchaseRate, continuePurchasePerformance, rePurchaseCount, rePurchaseRate, rePurchasePerformance, againPurchaseCount, againPurchaseRate, againPurchasePerformance, purchaseSumPerformance, productMenu,
  } = target;
  const targetDateDuration = `${dayjs(targetStartDate).format('YYYY/MM/DD')}～${dayjs(targetEndDate).format('YYYY/MM/DD')}`;
  const productNo = Object.keys(productMenu);
  const productNoList = {
    valuableNo: productNo.find(element => productMenu[element].productName === '超值雙月刊60天'),
    infiniteNo: productNo.find(element => productMenu[element].productName === '無限型雙月刊60天'),
    value365No: productNo.find(element => productMenu[element].productName === '超值年刊365天'),
    infinite365No: productNo.find(element => productMenu[element].productName === '無限年刊365天'),
    upgradeMonthNo: productNo.find(element => productMenu[element].productName === '升級無限雙月刊'),
    upgradeYearNo: productNo.find(element => productMenu[element].productName === '升級無限年刊'),
  };
  return (
    <>
      <h2>{`${targetDateDuration} 經管付費方案統計表`}</h2>
      <table className="plans-table">
        <tbody>
          <tr className="plans-header-row">
            <th rowSpan="2" colSpan="2" />
            <th rowSpan="2">計次型</th>
            <th colSpan="4">超值型</th>
            <th colSpan="6">無限型</th>
          </tr>
          <tr className="plans-header-row">
            <td>60天</td>
            <td>90+30天</td>
            <td>180+60天</td>
            <td>365天</td>
            <td>60天</td>
            <td>90+30天</td>
            <td>180+60天</td>
            <td>365天</td>
            <td>升級雙月</td>
            <td>升級年刊</td>
          </tr>
          <tr className="plans-header-col">
            <td rowSpan="3">新購</td>
            <td className="plans-sub-header">購買單數</td>
            <td>-</td>
            <td>{(newPurchaseCount && newPurchaseCount[productNoList.valuableNo]) !== null ? newPurchaseCount[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(newPurchaseCount && newPurchaseCount[productNoList.value365No]) !== null ? newPurchaseCount[productNoList.value365No] : '-'}</td>
            <td>{(newPurchaseCount && newPurchaseCount[productNoList.infiniteNo]) !== null ? newPurchaseCount[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(newPurchaseCount && newPurchaseCount[productNoList.infinite365No]) !== null ? newPurchaseCount[productNoList.infinite365No] : '-'}</td>
            <td>{(newPurchaseCount && newPurchaseCount[productNoList.upgradeMonthNo]) !== null ? newPurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(newPurchaseCount && newPurchaseCount[productNoList.upgradeYearNo]) !== null ? newPurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
          <tr>
            <td className="plans-sub-header">購買方案比例</td>
            <td>-</td>
            <td>{(newPurchaseRate && newPurchaseRate[productNoList.valuableNo]) !== null ? convertRate(newPurchaseRate[productNoList.valuableNo]) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(newPurchaseRate && newPurchaseRate[productNoList.value365No]) !== null ? convertRate(newPurchaseRate[productNoList.value365No]) : '-'}</td>
            <td>{(newPurchaseRate && newPurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(newPurchaseRate[productNoList.infiniteNo]) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(newPurchaseRate && newPurchaseRate[productNoList.infinite365No]) !== null ? convertRate(newPurchaseRate[productNoList.infinite365No]) : '-'}</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="plans-sub-header">業績</td>
            <td>-</td>
            <td>{(newPurchasePerformance && newPurchasePerformance[productNoList.valuableNo]) !== null ? newPurchasePerformance[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(newPurchasePerformance && newPurchasePerformance[productNoList.value365No]) !== null ? newPurchasePerformance[productNoList.value365No] : '-'}</td>
            <td>{(newPurchasePerformance && newPurchasePerformance[productNoList.infiniteNo]) !== null ? newPurchasePerformance[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(newPurchasePerformance && newPurchasePerformance[productNoList.infinite365No]) !== null ? newPurchasePerformance[productNoList.infinite365No] : '-'}</td>
            <td>{(newPurchaseCount && newPurchasePerformance[productNoList.upgradeMonthNo]) !== null ? newPurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(newPurchaseCount && newPurchasePerformance[productNoList.upgradeYearNo]) !== null ? newPurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
          <tr className="plans-header-col">
            <td rowSpan="3">續約</td>
            <td className="plans-sub-header">購買單數</td>
            <td>-</td>
            <td>{(continuePurchaseCount && continuePurchaseCount[productNoList.valuableNo]) !== null ? continuePurchaseCount[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(continuePurchaseCount && continuePurchaseCount[productNoList.value365No]) !== null ? continuePurchaseCount[productNoList.value365No] : '-'}</td>
            <td>{(continuePurchaseCount && continuePurchaseCount[productNoList.infiniteNo]) !== null ? continuePurchaseCount[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(continuePurchaseCount && continuePurchaseCount[productNoList.infinite365No]) !== null ? continuePurchaseCount[productNoList.infinite365No] : '-'}</td>
            <td>{(continuePurchaseCount && continuePurchaseCount[productNoList.upgradeMonthNo]) !== null ? continuePurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(continuePurchaseCount && continuePurchaseCount[productNoList.upgradeYearNo]) !== null ? continuePurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
          <tr>
            <td className="plans-sub-header">購買方案比例</td>
            <td>-</td>
            <td>{(continuePurchaseRate && continuePurchaseRate[productNoList.valuableNo]) !== null ? convertRate(continuePurchaseRate[productNoList.valuableNo]) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(continuePurchaseRate && continuePurchaseRate[productNoList.value365No]) !== null ? convertRate(continuePurchaseRate[productNoList.value365No]) : '-'}</td>
            <td>{(continuePurchaseRate && continuePurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(continuePurchaseRate[productNoList.infiniteNo]) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(continuePurchaseRate && continuePurchaseRate[productNoList.infinite365No]) !== null ? convertRate(continuePurchaseRate[productNoList.infinite365No]) : '-'}</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="plans-sub-header">業績</td>
            <td>-</td>
            <td>{(continuePurchasePerformance && continuePurchasePerformance[productNoList.valuableNo]) !== null ? continuePurchasePerformance[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(continuePurchasePerformance && continuePurchasePerformance[productNoList.value365No]) !== null ? continuePurchasePerformance[productNoList.value365No] : '-'}</td>
            <td>{(continuePurchasePerformance && continuePurchasePerformance[productNoList.infiniteNo]) !== null ? continuePurchasePerformance[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(continuePurchasePerformance && continuePurchasePerformance[productNoList.infinite365No]) !== null ? continuePurchasePerformance[productNoList.infinite365No] : '-'}</td>
            <td>{(continuePurchasePerformance && continuePurchasePerformance[productNoList.upgradeMonthNo]) !== null ? continuePurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(continuePurchasePerformance && continuePurchasePerformance[productNoList.upgradeYearNo]) !== null ? continuePurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
          <tr className="plans-header-col">
            <td rowSpan="3">回流</td>
            <td className="plans-sub-header">購買單數</td>
            <td>-</td>
            <td>{(rePurchaseCount && rePurchaseCount[productNoList.valuableNo]) !== null ? rePurchaseCount[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(rePurchaseCount && rePurchaseCount[productNoList.value365No]) !== null ? rePurchaseCount[productNoList.value365No] : '-'}</td>
            <td>{(rePurchaseCount && rePurchaseCount[productNoList.infiniteNo]) !== null ? rePurchaseCount[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(rePurchaseCount && rePurchaseCount[productNoList.infinite365No]) !== null ? rePurchaseCount[productNoList.infinite365No] : '-'}</td>
            <td>{(rePurchaseCount && rePurchaseCount[productNoList.upgradeMonthNo]) !== null ? rePurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(rePurchaseCount && rePurchaseCount[productNoList.upgradeYearNo]) !== null ? rePurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
          <tr>
            <td className="plans-sub-header">購買方案比例</td>
            <td>-</td>
            <td>{(rePurchaseRate && rePurchaseRate[productNoList.valuableNo]) !== null ? convertRate(rePurchaseRate[productNoList.valuableNo]) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(rePurchaseRate && rePurchaseRate[productNoList.value365No]) !== null ? convertRate(rePurchaseRate[productNoList.value365No]) : '-'}</td>
            <td>{(rePurchaseRate && rePurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(rePurchaseRate[productNoList.infiniteNo]) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(rePurchaseRate && rePurchaseRate[productNoList.infinite365No]) !== null ? convertRate(rePurchaseRate[productNoList.infinite365No]) : '-'}</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="plans-sub-header">業績</td>
            <td>-</td>
            <td>{(rePurchasePerformance && rePurchasePerformance[productNoList.valuableNo]) !== null ? rePurchasePerformance[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(rePurchasePerformance && rePurchasePerformance[productNoList.value365No]) !== null ? rePurchasePerformance[productNoList.value365No] : '-'}</td>
            <td>{(rePurchasePerformance && rePurchasePerformance[productNoList.infiniteNo]) !== null ? rePurchasePerformance[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(rePurchasePerformance && rePurchasePerformance[productNoList.infinite365No]) !== null ? rePurchasePerformance[productNoList.infinite365No] : '-'}</td>
            <td>{(rePurchasePerformance && rePurchasePerformance[productNoList.upgradeMonthNo]) !== null ? rePurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(rePurchasePerformance && rePurchasePerformance[productNoList.upgradeYearNo]) !== null ? rePurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
          <tr className="plans-header-col">
            <td rowSpan="3">再購（續＋回）</td>
            <td className="plans-sub-header">購買單數</td>
            <td>-</td>
            <td>{(againPurchaseCount && againPurchaseCount[productNoList.valuableNo]) !== null ? againPurchaseCount[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(againPurchaseCount && againPurchaseCount[productNoList.value365No]) !== null ? againPurchaseCount[productNoList.value365No] : '-'}</td>
            <td>{(againPurchaseCount && againPurchaseCount[productNoList.infiniteNo]) !== null ? againPurchaseCount[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(againPurchaseCount && againPurchaseCount[productNoList.infinite365No]) !== null ? againPurchaseCount[productNoList.infinite365No] : '-'}</td>
            <td>{(againPurchaseCount && againPurchaseCount[productNoList.upgradeMonthNo]) !== null ? againPurchaseCount[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(againPurchaseCount && againPurchaseCount[productNoList.upgradeYearNo]) !== null ? againPurchaseCount[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
          <tr>
            <td className="plans-sub-header">購買方案比例</td>
            <td>-</td>
            <td>{(againPurchaseRate && againPurchaseRate[productNoList.valuableNo]) !== null ? convertRate(againPurchaseRate[productNoList.valuableNo]) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(againPurchaseRate && againPurchaseRate[productNoList.value365No]) !== null ? convertRate(againPurchaseRate[productNoList.value365No]) : '-'}</td>
            <td>{(againPurchaseRate && againPurchaseRate[productNoList.infiniteNo]) !== null ? convertRate(againPurchaseRate[productNoList.infiniteNo]) : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(againPurchaseRate && againPurchaseRate[productNoList.infinite365No]) !== null ? convertRate(againPurchaseRate[productNoList.infinite365No]) : '-'}</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="plans-sub-header">業績</td>
            <td>-</td>
            <td>{(againPurchasePerformance && againPurchasePerformance[productNoList.valuableNo]) !== null ? againPurchasePerformance[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(againPurchasePerformance && againPurchasePerformance[productNoList.value365No]) !== null ? againPurchasePerformance[productNoList.value365No] : '-'}</td>
            <td>{(againPurchasePerformance && againPurchasePerformance[productNoList.infiniteNo]) !== null ? againPurchasePerformance[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(againPurchasePerformance && againPurchasePerformance[productNoList.infinite365No]) !== null ? againPurchasePerformance[productNoList.infinite365No] : '-'}</td>
            <td>{(againPurchasePerformance && againPurchasePerformance[productNoList.upgradeMonthNo]) !== null ? againPurchasePerformance[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(againPurchasePerformance && againPurchasePerformance[productNoList.upgradeYearNo]) !== null ? againPurchasePerformance[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
          <tr className="plans-header-col">
            <td>新續回</td>
            <td className="plans-sub-header">合併業績</td>
            <td>-</td>
            <td>{(purchaseSumPerformance && purchaseSumPerformance[productNoList.valuableNo]) !== null ? purchaseSumPerformance[productNoList.valuableNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(purchaseSumPerformance && purchaseSumPerformance[productNoList.value365No]) !== null ? purchaseSumPerformance[productNoList.value365No] : '-'}</td>
            <td>{(purchaseSumPerformance && purchaseSumPerformance[productNoList.infiniteNo]) !== null ? purchaseSumPerformance[productNoList.infiniteNo] : '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>{(purchaseSumPerformance && purchaseSumPerformance[productNoList.infinite365No]) !== null ? purchaseSumPerformance[productNoList.infinite365No] : '-'}</td>
            <td>{(purchaseSumPerformance && purchaseSumPerformance[productNoList.upgradeMonthNo]) !== null ? purchaseSumPerformance[productNoList.upgradeMonthNo] : '-'}</td>
            <td>{(purchaseSumPerformance && purchaseSumPerformance[productNoList.upgradeYearNo]) !== null ? purchaseSumPerformance[productNoList.upgradeYearNo] : '-'}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default PlansTable;
