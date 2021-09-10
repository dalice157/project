import React, { PureComponent } from 'react';
import dayjs from 'dayjs';
import { convertRate, convertFloat } from '../../../util/formatUtil';
import './SalesTable.scss';

class SalesTable extends PureComponent {
  onRenderResultTable = (salesTable, dates, isCompared) => {
    const {
      targetMonth, compareMonth, ratio
    } = salesTable;
    const {
      targetDate, comparedDate
    } = dates;
    if (!targetDate || !targetMonth) {
      return <></>;
    }
    if (isCompared) {
      const targetDateDuration = `${dayjs(targetDate).startOf('month').format('YYYY/MM/DD')}～${dayjs(targetDate).endOf('month').format('YYYY/MM/DD')}`;
      const comparedDateDuration = `${dayjs(comparedDate).startOf('month').format('YYYY/MM/DD')}～${dayjs(comparedDate).endOf('month').format('YYYY/MM/DD')}`;
      return (
        <>
          <h2>{`${targetDateDuration} 相較 ${comparedDateDuration} 行銷業績報表(含稅)`}</h2>
          <h3>(自2021/5/18開始記錄)</h3>
          <table className="sales-table">
            <tbody>
              <tr>
                <th />
                <th>新購</th>
                <th>續約</th>
                <th>
                  <span>回流</span>
                </th>
                <th>再購（續＋回）</th>
                <th>新續回合計</th>
              </tr>
              <tr className="sales-table-row-highlight">
                <td colSpan="6">預備會員/續回水池</td>
              </tr>
              <tr>
                <td>{targetDateDuration}</td>
                <td>{(targetMonth.purchaseMemberPool && targetMonth.purchaseMemberPool.newPurchase) !== null ? targetMonth.purchaseMemberPool.newPurchase : '-'}</td>
                <td>{(targetMonth.purchaseMemberPool && targetMonth.purchaseMemberPool.continuePurchase) !== null ? targetMonth.purchaseMemberPool.continuePurchase : '-'}</td>
                <td>
                  <span>{(targetMonth.purchaseMemberPool && targetMonth.purchaseMemberPool.rePurchase) !== null ? targetMonth.purchaseMemberPool.rePurchase : '-'}</span>
                </td>
                <td>{(targetMonth.purchaseMemberPool && targetMonth.purchaseMemberPool.againPurchase) !== null ? targetMonth.purchaseMemberPool.againPurchase : '-'}</td>
                <td>{(targetMonth.purchaseMemberPool && targetMonth.purchaseMemberPool.purchaseSum) !== null ? targetMonth.purchaseMemberPool.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>{comparedDateDuration}</td>
                <td>{(compareMonth.purchaseMemberPool && compareMonth.purchaseMemberPool.newPurchase) !== null ? compareMonth.purchaseMemberPool.newPurchase : '-'}</td>
                <td>{(compareMonth.purchaseMemberPool && compareMonth.purchaseMemberPool.continuePurchase) !== null ? compareMonth.purchaseMemberPool.continuePurchase : '-'}</td>
                <td>
                  <span>{(compareMonth.purchaseMemberPool && compareMonth.purchaseMemberPool.rePurchase) !== null ? compareMonth.purchaseMemberPool.rePurchase : '-'}</span>
                </td>
                <td>{(compareMonth.purchaseMemberPool && compareMonth.purchaseMemberPool.againPurchase) !== null ? compareMonth.purchaseMemberPool.againPurchase : '-'}</td>
                <td>{(compareMonth.purchaseMemberPool && compareMonth.purchaseMemberPool.purchaseSum) !== null ? compareMonth.purchaseMemberPool.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>%變更</td>
                <td>{(ratio.purchaseMemberPool && ratio.purchaseMemberPool.newPurchase) !== null ? convertRate(ratio.purchaseMemberPool.newPurchase, true, 2) : '-'}</td>
                <td>{(ratio.purchaseMemberPool && ratio.purchaseMemberPool.continuePurchase) !== null ? convertRate(ratio.purchaseMemberPool.continuePurchase, true, 2) : '-'}</td>
                <td>{(ratio.purchaseMemberPool && ratio.purchaseMemberPool.rePurchase) !== null ? convertRate(ratio.purchaseMemberPool.rePurchase, true, 2) : '-'}</td>
                <td>{(ratio.purchaseMemberPool && ratio.purchaseMemberPool.againPurchase) !== null ? convertRate(ratio.purchaseMemberPool.againPurchase, true, 2) : '-'}</td>
                <td>{(ratio.purchaseMemberPool && ratio.purchaseMemberPool.purchaseSum) !== null ? convertRate(ratio.purchaseMemberPool.purchaseSum, true, 2) : '-'}</td>
              </tr>
              <tr className="sales-table-row-highlight">
                <td colSpan="6">購買單數</td>
              </tr>
              <tr>
                <td>{targetDateDuration}</td>
                <td>{(targetMonth.purchaseCount && targetMonth.purchaseCount.newPurchase) !== null ? targetMonth.purchaseCount.newPurchase : '-'}</td>
                <td>{(targetMonth.purchaseCount && targetMonth.purchaseCount.continuePurchase) !== null ? targetMonth.purchaseCount.continuePurchase : '-'}</td>
                <td>{(targetMonth.purchaseCount && targetMonth.purchaseCount.rePurchase) !== null ? targetMonth.purchaseCount.rePurchase : '-'}</td>
                <td>{(targetMonth.purchaseCount && targetMonth.purchaseCount.againPurchase) !== null ? targetMonth.purchaseCount.againPurchase : '-'}</td>
                <td>{(targetMonth.purchaseCount && targetMonth.purchaseCount.purchaseSum) !== null ? targetMonth.purchaseCount.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>{comparedDateDuration}</td>
                <td>{(compareMonth.purchaseCount && compareMonth.purchaseCount.newPurchase) !== null ? compareMonth.purchaseCount.newPurchase : '-'}</td>
                <td>{(compareMonth.purchaseCount && compareMonth.purchaseCount.continuePurchase) !== null ? compareMonth.purchaseCount.continuePurchase : '-'}</td>
                <td>{(compareMonth.purchaseCount && compareMonth.purchaseCount.rePurchase) !== null ? compareMonth.purchaseCount.rePurchase : '-'}</td>
                <td>{(compareMonth.purchaseCount && compareMonth.purchaseCount.againPurchase) !== null ? compareMonth.purchaseCount.againPurchase : '-'}</td>
                <td>{(compareMonth.purchaseCount && compareMonth.purchaseCount.purchaseSum) !== null ? compareMonth.purchaseCount.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>%變更</td>
                <td>{(ratio.purchaseCount && ratio.purchaseCount.newPurchase) !== null ? convertRate(ratio.purchaseCount.newPurchase, true, 2) : '-'}</td>
                <td>{(ratio.purchaseCount && ratio.purchaseCount.continuePurchase) !== null ? convertRate(ratio.purchaseCount.continuePurchase, true, 2) : '-'}</td>
                <td>{(ratio.purchaseCount && ratio.purchaseCount.rePurchase) !== null ? convertRate(ratio.purchaseCount.rePurchase, true, 2) : '-'}</td>
                <td>{(ratio.purchaseCount && ratio.purchaseCount.againPurchase) !== null ? convertRate(ratio.purchaseCount.againPurchase, true, 2) : '-'}</td>
                <td>{(ratio.purchaseCount && ratio.purchaseCount.purchaseSum) !== null ? convertRate(ratio.purchaseCount.purchaseSum, true, 2) : '-'}</td>
              </tr>
              <tr className="sales-table-row-highlight">
                <td colSpan="6">轉換率</td>
              </tr>
              <tr>
                <td>{targetDateDuration}</td>
                <td>{(targetMonth.conversionRate && targetMonth.conversionRate.newPurchase) !== null ? convertRate(targetMonth.conversionRate.newPurchase, false, 3) : '-'}</td>
                <td>{(targetMonth.conversionRate && targetMonth.conversionRate.continuePurchase) !== null ? convertRate(targetMonth.conversionRate.continuePurchase, false, 3) : '-'}</td>
                <td>{(targetMonth.conversionRate && targetMonth.conversionRate.rePurchase) !== null ? convertRate(targetMonth.conversionRate.rePurchase, false, 3) : '-'}</td>
                <td>{(targetMonth.conversionRate && targetMonth.conversionRate.againPurchase) !== null ? convertRate(targetMonth.conversionRate.againPurchase, false, 3) : '-'}</td>
                <td>{(targetMonth.conversionRate && targetMonth.conversionRate.purchaseSum) !== null ? convertRate(targetMonth.conversionRate.purchaseSum, false, 3) : '-'}</td>
              </tr>
              <tr>
                <td>{comparedDateDuration}</td>
                <td>{(compareMonth.conversionRate && compareMonth.conversionRate.newPurchase) !== null ? convertRate(compareMonth.conversionRate.newPurchase, false, 3) : '-'}</td>
                <td>{(compareMonth.conversionRate && compareMonth.conversionRate.continuePurchase) !== null ? convertRate(compareMonth.conversionRate.continuePurchase, false, 3) : '-'}</td>
                <td>{(compareMonth.conversionRate && compareMonth.conversionRate.rePurchase) !== null ? convertRate(compareMonth.conversionRate.rePurchase, false, 3) : '-'}</td>
                <td>{(compareMonth.conversionRate && compareMonth.conversionRate.againPurchase) !== null ? convertRate(compareMonth.conversionRate.againPurchase, false, 3) : '-'}</td>
                <td>{(compareMonth.conversionRate && compareMonth.conversionRate.purchaseSum) !== null ? convertRate(compareMonth.conversionRate.purchaseSum, false, 3) : '-'}</td>
              </tr>
              <tr>
                <td>%變更</td>
                <td>{(ratio.conversionRate && ratio.conversionRate.newPurchase) !== null ? convertRate(ratio.conversionRate.newPurchase, true, 2) : '-'}</td>
                <td>{(ratio.conversionRate && ratio.conversionRate.continuePurchase) !== null ? convertRate(ratio.conversionRate.continuePurchase, true, 2) : '-'}</td>
                <td>{(ratio.conversionRate && ratio.conversionRate.rePurchase) !== null ? convertRate(ratio.conversionRate.rePurchase, true, 2) : '-'}</td>
                <td>{(ratio.conversionRate && ratio.conversionRate.againPurchase) !== null ? convertRate(ratio.conversionRate.againPurchase, true, 2) : '-'}</td>
                <td>{(ratio.conversionRate && ratio.conversionRate.purchaseSum) !== null ? convertRate(ratio.conversionRate.purchaseSum, true, 2) : '-'}</td>
              </tr>
              <tr className="sales-table-row-highlight">
                <td colSpan="6">業績</td>
              </tr>
              <tr>
                <td>{targetDateDuration}</td>
                <td>{(targetMonth.performance && targetMonth.performance.newPurchase) !== null ? targetMonth.performance.newPurchase : '-'}</td>
                <td>{(targetMonth.performance && targetMonth.performance.continuePurchase) !== null ? targetMonth.performance.continuePurchase : '-'}</td>
                <td>{(targetMonth.performance && targetMonth.performance.rePurchase) !== null ? targetMonth.performance.rePurchase : '-'}</td>
                <td>{(targetMonth.performance && targetMonth.performance.againPurchase) !== null ? targetMonth.performance.againPurchase : '-'}</td>
                <td>{(targetMonth.performance && targetMonth.performance.purchaseSum) !== null ? targetMonth.performance.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>{comparedDateDuration}</td>
                <td>{(compareMonth.performance && compareMonth.performance.newPurchase) !== null ? compareMonth.performance.newPurchase : '-'}</td>
                <td>{(compareMonth.performance && compareMonth.performance.continuePurchase) !== null ? compareMonth.performance.continuePurchase : '-'}</td>
                <td>{(compareMonth.performance && compareMonth.performance.rePurchase) !== null ? compareMonth.performance.rePurchase : '-'}</td>
                <td>{(compareMonth.performance && compareMonth.performance.againPurchase) !== null ? compareMonth.performance.againPurchase : '-'}</td>
                <td>{(compareMonth.performance && compareMonth.performance.purchaseSum) !== null ? compareMonth.performance.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>%變更</td>
                <td>{(ratio.performance && ratio.performance.newPurchase) !== null ? convertRate(ratio.performance.newPurchase, true, 2) : '-'}</td>
                <td>{(ratio.performance && ratio.performance.continuePurchase) !== null ? convertRate(ratio.performance.continuePurchase, true, 2) : '-'}</td>
                <td>{(ratio.performance && ratio.performance.rePurchase) !== null ? convertRate(ratio.performance.rePurchase, true, 2) : '-'}</td>
                <td>{(ratio.performance && ratio.performance.againPurchase) !== null ? convertRate(ratio.performance.againPurchase, true, 2) : '-'}</td>
                <td>{(ratio.performance && ratio.performance.purchaseSum) !== null ? convertRate(ratio.performance.purchaseSum, true, 2) : '-'}</td>
              </tr>
              <tr className="sales-table-row-highlight">
                <td colSpan="6">ARPU</td>
              </tr>
              <tr>
                <td>{targetDateDuration}</td>
                <td>{(targetMonth.arpu && targetMonth.arpu.newPurchase) !== null ? convertFloat(targetMonth.arpu.newPurchase) : '-'}</td>
                <td>{(targetMonth.arpu && targetMonth.arpu.continuePurchase) !== null ? convertFloat(targetMonth.arpu.continuePurchase) : '-'}</td>
                <td>{(targetMonth.arpu && targetMonth.arpu.rePurchase) !== null ? convertFloat(targetMonth.arpu.rePurchase) : '-'}</td>
                <td>{(targetMonth.arpu && targetMonth.arpu.againPurchase) !== null ? convertFloat(targetMonth.arpu.againPurchase) : '-'}</td>
                <td>{(targetMonth.arpu && targetMonth.arpu.purchaseSum) !== null ? convertFloat(targetMonth.arpu.purchaseSum) : '-'}</td>
              </tr>
              <tr>
                <td>{comparedDateDuration}</td>
                <td>{(compareMonth.arpu && compareMonth.arpu.newPurchase) !== null ? convertFloat(compareMonth.arpu.newPurchase) : '-'}</td>
                <td>{(compareMonth.arpu && compareMonth.arpu.continuePurchase) !== null ? convertFloat(compareMonth.arpu.continuePurchase) : '-'}</td>
                <td>{(compareMonth.arpu && compareMonth.arpu.rePurchase) !== null ? convertFloat(compareMonth.arpu.rePurchase) : '-'}</td>
                <td>{(compareMonth.arpu && compareMonth.arpu.againPurchase) !== null ? convertFloat(compareMonth.arpu.againPurchase) : '-'}</td>
                <td>{(compareMonth.arpu && compareMonth.arpu.purchaseSum) !== null ? convertFloat(compareMonth.arpu.purchaseSum) : '-'}</td>
              </tr>
              <tr>
                <td>%變更</td>
                <td>{(ratio.arpu && ratio.arpu.newPurchase) !== null ? convertRate(ratio.arpu.newPurchase, true, 2) : '-'}</td>
                <td>{(ratio.arpu && ratio.arpu.continuePurchase) !== null ? convertRate(ratio.arpu.continuePurchase, true, 2) : '-'}</td>
                <td>{(ratio.arpu && ratio.arpu.rePurchase) !== null ? convertRate(ratio.arpu.rePurchase, true, 2) : '-'}</td>
                <td>{(ratio.arpu && ratio.arpu.againPurchase) !== null ? convertRate(ratio.arpu.againPurchase, true, 2) : '-'}</td>
                <td>{(ratio.arpu && ratio.arpu.purchaseSum) !== null ? convertRate(ratio.arpu.purchaseSum, true, 2) : '-'}</td>
              </tr>
              <tr className="sales-table-row-highlight">
                <td colSpan="6">其他業績</td>
              </tr>
              <tr>
                <td>{targetDateDuration}</td>
                <td colSpan="5">{targetMonth.otherPerformance !== null ? targetMonth.otherPerformance : '-'}</td>
              </tr>
              <tr>
                <td>{comparedDateDuration}</td>
                <td colSpan="5">{compareMonth.otherPerformance !== null ? targetMonth.otherPerformance : '-'}</td>
              </tr>
              <tr>
                <td>%變更</td>
                <td colSpan="5">{ratio.otherPerformance !== null ? convertRate(ratio.otherPerformance, true, 2) : '-'}</td>
              </tr>
              <tr className="sales-table-row-highlight">
                <td colSpan="6">退刊單數</td>
              </tr>
              <tr>
                <td>{targetDateDuration}</td>
                <td colSpan="5">{targetMonth.retractCount !== null ? targetMonth.retractCount : '-'}</td>
              </tr>
              <tr>
                <td>{comparedDateDuration}</td>
                <td colSpan="5">{compareMonth.retractCount !== null ? compareMonth.retractCount : '-'}</td>
              </tr>
              <tr className="sales-table-row-highlight">
                <td colSpan="6">退刊業績</td>
              </tr>
              <tr>
                <td>{targetDateDuration}</td>
                <td colSpan="5">{targetMonth.retractPerformance !== null ? targetMonth.retractPerformance : '-'}</td>
              </tr>
              <tr>
                <td>{comparedDateDuration}</td>
                <td colSpan="5">{compareMonth.retractPerformance !== null ? compareMonth.retractPerformance : '-'}</td>
              </tr>
            </tbody>
          </table>
        </>
      );
    } else {
      const {
        purchaseMemberPool, purchaseCount, conversionRate, performance, arpu, otherPerformance, retractCount, retractPerformance
      } = salesTable.targetMonth;
      const targetDateDuration = `${dayjs(targetDate).startOf('month').format('YYYY/MM/DD')}～${dayjs(targetDate).endOf('month').format('YYYY/MM/DD')}`;
      return (
        <>
          <h2>{`${targetDateDuration} 行銷業績報表(含稅)`}</h2>
          <h3>(自2021/5/18開始記錄)</h3>
          <table className="sales-table">
            <tbody>
              <tr>
                <th />
                <th>新購</th>
                <th>續約</th>
                <th>
                  <span>回流</span>
                </th>
                <th>再購（續＋回）</th>
                <th>新續回合計</th>
              </tr>
              <tr>
                <td>預備會員/續回水池</td>
                <td>{purchaseMemberPool.newPurchase !== null ? purchaseMemberPool.newPurchase : '-'}</td>
                <td>{purchaseMemberPool.continuePurchase !== null ? purchaseMemberPool.continuePurchase : '-'}</td>
                <td>
                  <span>{purchaseMemberPool.rePurchase !== null ? purchaseMemberPool.rePurchase : '-'}</span>
                </td>
                <td>{purchaseMemberPool.againPurchase !== null ? purchaseMemberPool.againPurchase : '-'}</td>
                <td>{purchaseMemberPool.purchaseSum !== null ? purchaseMemberPool.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>購買單數</td>
                <td>{purchaseCount.newPurchase !== null ? purchaseCount.newPurchase : '-'}</td>
                <td>{purchaseCount.continuePurchase !== null ? purchaseCount.continuePurchase : '-'}</td>
                <td>{purchaseCount.rePurchase !== null ? purchaseCount.rePurchase : '-'}</td>
                <td>{purchaseCount.againPurchase !== null ? purchaseCount.againPurchase : '-'}</td>
                <td>{purchaseCount.purchaseSum !== null ? purchaseCount.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>轉換率</td>
                <td>{conversionRate.newPurchase !== null ? convertRate(conversionRate.newPurchase, false, 3) : '-'}</td>
                <td>{conversionRate.continuePurchase !== null ? convertRate(conversionRate.continuePurchase, false, 3) : '-'}</td>
                <td>{conversionRate.rePurchase !== null ? convertRate(conversionRate.rePurchase, false, 3) : '-'}</td>
                <td>{conversionRate.againPurchase !== null ? convertRate(conversionRate.againPurchase, false, 3) : '-'}</td>
                <td>{conversionRate.purchaseSum !== null ? convertRate(conversionRate.purchaseSum, false, 3) : '-'}</td>
              </tr>
              <tr>
                <td>業績</td>
                <td>{performance.newPurchase !== null ? performance.newPurchase : '-'}</td>
                <td>{performance.continuePurchase !== null ? performance.continuePurchase : '-'}</td>
                <td>{performance.rePurchase !== null ? performance.rePurchase : '-'}</td>
                <td>{performance.againPurchase !== null ? performance.againPurchase : '-'}</td>
                <td>{performance.purchaseSum !== null ? performance.purchaseSum : '-'}</td>
              </tr>
              <tr>
                <td>ARPU</td>
                <td>{arpu.newPurchase !== null ? convertFloat(arpu.newPurchase) : '-'}</td>
                <td>{arpu.continuePurchase !== null ? convertFloat(arpu.continuePurchase) : '-'}</td>
                <td>{arpu.rePurchase !== null ? convertFloat(arpu.rePurchase) : '-'}</td>
                <td>{arpu.againPurchase !== null ? convertFloat(arpu.againPurchase) : '-'}</td>
                <td>{arpu.purchaseSum !== null ? convertFloat(arpu.purchaseSum) : '-'}</td>
              </tr>
              <tr>
                <td>其他業績</td>
                <td colSpan="5">{otherPerformance !== null ? otherPerformance : '-'}</td>
              </tr>
              <tr>
                <td>退刊單數</td>
                <td colSpan="5">{retractCount !== null ? retractCount : '-'}</td>
              </tr>
              <tr>
                <td>退刊業績</td>
                <td colSpan="5">{retractPerformance !== null ? retractPerformance : '-'}</td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }
  }

  render() {
    const {
      isCompared, dates, salesTable
    } = this.props;
    return (
      <>
        {this.onRenderResultTable(salesTable, dates, isCompared)}
      </>
    );
  }
}

export default SalesTable;
