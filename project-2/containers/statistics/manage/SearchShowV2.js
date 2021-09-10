import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import './SearchShow.scss';
import { manageGroup } from '../../../config/selectData';
import { showCat } from '../../../util/lablesUtils';
import { roleTypes } from '../../../components/member/options';

const {
  displaySegmentObj, targetObj,
} = manageGroup;
// 顯示區隔
const segmentDesc = displaySegmentObj.reduce((acc, obj) => ({ ...acc, [obj.value]: obj.label }), {});
// 顯示指標
const targetDesc = targetObj.reduce((acc, obj) => ({ ...acc, [obj.value]: obj.label }), {});
class SearchShow extends Component {
  // 根據查詢送出的參數，分類顯示 進水 or 水位 or both
  classifyCategoryData = (categoryPool) => {
    const { income, pool, interact } = categoryPool;
    const classifiedTable = [];
    if (pool && income) {
      return classifiedTable.concat(income, pool);
    }

    if (pool) {
      return classifiedTable.concat(pool);
    }
    if (income) {
      return classifiedTable.concat(income);
    }
    if (interact) {
      return classifiedTable.concat(interact);
    }
    return classifiedTable;
  }

  /**
   * model 的預設值
   * @param {*} sourceType
   * @returns
   */
  buildModelSetting = (sourceType) => {
    const paidModeModel = {
      title: '接案會員報表',
      apiTag: 'pay_mode',
      defaultValue: {
        preparatory: 0,
        experience: 0,
        paid: 0,
      },
      codeMap: [
        {
          value: '預備',
          code: 0,
          column: 'preparatory',
        },
        {
          value: '體驗',
          code: 1,
          column: 'experience',
        },
        {
          value: '付費',
          code: 2,
          column: 'paid',
        },
      ],
      dailySum: {
        turnOn: false,
        value: '單日合計',
      },
    };
    const memberSourceModel = {
      title: '會員來源報表',
      apiTag: 'member_source',
      defaultValue: {
        new: 0,
        tutor: 0,
        outsource: 0,
        both: 0,
      },
      codeMap: [
        {
          value: '全新',
          code: 0,
          column: 'new',
        },
        {
          value: '家教',
          code: 1,
          column: 'tutor',
        },
        {
          value: '外包',
          code: 2,
          column: 'outsource',
        },
        {
          value: '二者皆有',
          code: 3,
          column: 'both',
        },
      ],
      dailySum: {
        turnOn: true,
        value: '單日合計',
      },
    };
    const budgetModel = {
      title: '案件預算',
      apiTag: 'budget',
      defaultValue: {
        less5000: 0,
        more5000: 0,
        timeWork: 0,
      },
      codeMap: [
        {
          value: '五千以下',
          code: 0,
          column: 'less5000',
        },
        {
          value: '五千以上',
          code: 1,
          column: 'more5000',
        },
        {
          value: '時薪',
          code: 2,
          column: 'timeWork',
        },
      ],
      dailySum: {
        turnOn: true,
        value: '單日合計',
      },
    };

    const role = {
      title: '會員身分',
      apiTag: 'role',
      defaultValue: {
        student: 0,
        cramTeacher: 0,
        tutor: 0,
        publicTeacher: 0,
        officeWorker: 0,
        soHo: 0,
        publicOfficeWorker: 0,
        manager: 0,
        houseKeeper: 0,
        other: 0,
      },
      codeMap: [],
      dailySum: {
        turnOn: true,
        value: '單日合計',
      },
    };
    const roleMap = roleTypes.slice(1, 11);
    role.codeMap = Object.keys(role.defaultValue).map((key, i) => ({
      column: key,
      code: roleMap[i].value,
      value: roleMap[i].label,
    }));
    const sourceTypeMap = {
      0: paidModeModel,
      1: memberSourceModel,
      2: 'publish_source',
      // 3: 案件來源
      // 4: 案主種類
      5: budgetModel,
      // 6: 八大類目
      7: role,
    };
    return sourceTypeMap[sourceType];
  }

  /**
   * 整理API資料 與 計算總合
   * @param {*} startDate
   * @param {*} endDate
   * @param {*} data api data
   * @param {*} modelSetting [設定的 model ]
   * @param {*} targetType [0: 進水][1: 水位][2: both]
   * @returns
   */
  pendingTableMemberData = (startDate, endDate, data, modelSetting, targetType) => {
    const incomeSum = modelSetting.defaultValue;
    const output = {
      incomeData: [],
      poolData: [],
      incomeSum,
    };

    if (Object.keys(data).length === 0) {
      return output;
    }
    const dateLen = dayjs(endDate).diff(startDate, 'day') || 0;
    // API有回傳的才會更新陣列內的值
    const { codeMap } = modelSetting;
    const { apiTag } = modelSetting;
    for (let i = 0; i <= dateLen; i++) { // loop row
      const recordDate = dayjs(startDate).add(i, 'day');
      const incomeItem = {
        recordDate,
        cell: {},
      };
      const poolItem = {
        recordDate,
        cell: {},
      };
      if (modelSetting.dailySum.turnOn) {
        incomeItem.cell.dailySum = 0;
        poolItem.cell.dailySum = 0;
      }
      for (const codeItem of codeMap) { // loop column
        if (targetType === 0 || targetType === 2) {
          incomeItem.cell[codeItem.column] = data.income[i].memberRow[apiTag][codeItem.code];
          if ('dailySum' in incomeItem.cell) {
            incomeItem.cell.dailySum += incomeItem.cell[codeItem.column]; // daily sum of all column
          }
          output.incomeSum[codeItem.column] += incomeItem.cell[codeItem.column]; // single column sum
        }
        if (targetType === 1 || targetType === 2) {
          poolItem.cell[codeItem.column] = data.pool[i].memberRow[apiTag][codeItem.code];
          if ('dailySum' in incomeItem.cell) {
            poolItem.cell.dailySum += poolItem.cell[codeItem.column]; // daily sum of all column
          }
        }
      }
      if (incomeItem.cell) {
        output.incomeData.push(incomeItem);
      }
      if (poolItem.cell) {
        output.poolData.push(poolItem);
      }
    }
    return output;
  }

  // 計算接發類別報表total
  calculateCategoryReportTotal = (categoryReportTable, categoryPrimaryCode) => {
    let initCount = {};
    categoryPrimaryCode.forEach((cat) => {
      initCount = {
        ...initCount,
        [`totalGigCount-${cat}`]: 0,
        [`totalDemandCount-${cat}`]: 0,
      };
    });
    return categoryReportTable.reduce((acc, rowTable) => {
      const row = rowTable.categoryRow;
      Object.keys(row).forEach((cat) => {
        acc[`totalGigCount-${cat}`] += row[cat].gigCount;
        acc[`totalDemandCount-${cat}`] += row[cat].demandCount;
      });
      return acc;
    }, initCount);
  }

  getDateTypeTableHead = (reportType) => {
    let headTH;
    let headTD;
    if (reportType === 0) {
      headTH = (<><th colSpan="2">&nbsp;</th></>);
      headTD = (<><td colSpan="2">月份</td></>);
    } else {
      headTH = (
        <>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
        </>
      );
      headTD = (
        <>
          <td>日期</td>
          <td>星期</td>
        </>
      );
    }
    return { th: headTH, td: headTD };
  }

  /**
   *
   * @param {*} data
   * @param {*} targetType targetType [0:進水] [1:水位] [2:進水+水位] [3:互動]
   * @returns
   */
  getPrimaryCatCodeList = (data, targetType) => {
    let rtn = [];
    if (Object.keys(data).length === 0) {
      return rtn;
    }
    switch (targetType) {
      case 0:
      case 2:
        rtn = Object.keys(data.income[0].categoryRow);
        break;
      case 1:
        rtn = Object.keys(data.pool[0].categoryRow);
        break;
      default:
        return [];
    }

    return rtn;
  }


  /**
   * 接發類別報表
   * @param {*} categoryPool
   * @param {*} queryParams
   * @returns
   */
  showCategoryTable = (categoryPool, queryParams) => {
    const typeDescMap = {
      income: 0,
      pool: 1,
    };
    const {
      reportType, targetType, segmentType,
    } = queryParams;
    const tableTimeHead = this.getDateTypeTableHead(reportType);
    const categoryPrimaryCode = this.getPrimaryCatCodeList(categoryPool, targetType);
    return (
      <>
        <h2 className="info">
          <span className="title">報表名稱：依</span>
          服務類別
          {segmentDesc[segmentType]}
          {targetDesc[targetType]}
          {reportType === 0 ? '月' : '日'}
          報表
        </h2>
        {
          Object.keys(categoryPool).map((key) => {
            const categoryReportTable = categoryPool[key];
            const categoryReportTotal = this.calculateCategoryReportTotal(categoryReportTable, categoryPrimaryCode);
            return (
              <>
                {targetType === 2 ? <><h2 className="info"><span className="title">{targetDesc[typeDescMap[key]]}</span></h2></> : <></>}
                <div className="tableWrap typeTable">
                  <table>
                    <thead>
                      <tr>
                        {tableTimeHead.th}
                        {
                          categoryPrimaryCode.map((catCode, index) => (<Fragment key={index}><th colSpan="2">{showCat(catCode)}</th></Fragment>))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {tableTimeHead.td}
                        {
                          categoryPrimaryCode.map(index => (
                            <Fragment key={index}>
                              <td>案件</td>
                              <td>接案</td>
                            </Fragment>
                          ))
                        }
                      </tr>
                      {
                      categoryReportTable.map((item, index) => {
                        const { recordDate, categoryRow } = item;
                        const data = categoryPrimaryCode.map((catCode, i) => (
                          <Fragment key={i}>
                            <td>{categoryRow[catCode].demandCount}</td>
                            <td>{categoryRow[catCode].gigCount}</td>
                          </Fragment>
                        ));
                        return (
                          <tr key={index}>
                            {reportType === 0
                              ? (
                                <>
                                  <td colSpan="2">{dayjs(recordDate).format('YYYY-MM')}</td>
                                </>
                              )
                              : (
                                <>
                                  <td>{dayjs(recordDate).format('YYYY-MM-DD')}</td>
                                  <td>{dayjs(recordDate).format('dd')}</td>
                                </>
                              )
                            }
                            {data}
                          </tr>
                        );
                      })
                    }
                      <tr>
                        {
                        reportType === 0
                          ? (
                            <>
                              <td colSpan="2">合計</td>
                            </>
                          )
                          : (
                            <>
                              <td>合計</td>
                              <td>&nbsp;</td>
                            </>
                          )
                      }
                        {
                        categoryPrimaryCode.map((catCode, i) => (
                          <Fragment key={i}>
                            <td>{categoryReportTotal[`totalDemandCount-${catCode}`]}</td>
                            <td>{categoryReportTotal[`totalGigCount-${catCode}`]}</td>
                          </Fragment>
                        ))
                      }
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            );
          })
        }
      </>
    );
  }

  /**
   * 接案會員種類, 會員來源, 案件預算, 身分類別 ... 資料單位 by 人的報表 to HTML
   * @param {*} sourceModel settingModel
   * @param {*} tableData
   * @param {*} queryParams
   * @returns html.table
   */
  showMemberTable = (sourceModel, inputData, total, queryParams, titleDecorate) => {
    const cellData = inputData;
    const statisticsTitle = `${sourceModel.title}-${titleDecorate}`;
    const isSumTurnOn = sourceModel.dailySum.turnOn;
    const headColumn = [...sourceModel.codeMap]; // 欄位大標
    const columnName = sourceModel.codeMap.map(item => item.column); // 欄位數值
    if (isSumTurnOn) {
      headColumn.push(sourceModel.dailySum);
      columnName.push('dailySum');
    }
    return (
      <>
        <h2 className="info">
          <span className="title">報表名稱：</span>
          {statisticsTitle}
        </h2>
        <div className={`tableWrap ${isSumTurnOn && 'memberTable-sum'}`}>
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th>星期</th>
                {
                  headColumn.map((item, index) => (
                    <Fragment key={index}>
                      <th>{item.value}</th>
                    </Fragment>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {
                cellData.map((item, index) => {
                  const {
                    recordDate, cell,
                  } = item;
                  const dataCell = columnName.map((name, i) => <Fragment key={i}><td>{cell[name]}</td></Fragment>);
                  return (
                    <tr key={index}>
                      <td>{dayjs(recordDate).format('YYYY-MM-DD')}</td>
                      <td>{dayjs(recordDate).format('dd')}</td>
                      { dataCell }
                    </tr>
                  );
                })
              }
              {
                total ? (
                  <tr>
                    <td>合計</td>
                    <td>&nbsp;</td>
                    {
                    Object.keys(total).map((key, index) => (
                      <Fragment key={index}>
                        <td>{total[key]}</td>
                      </Fragment>
                    ))
                    }
                    { isSumTurnOn && <td>&nbsp;</td> }
                  </tr>
                ) : <></>
              }
            </tbody>
          </table>
        </div>
      </>
    );
  }

  /**
   * 供需報表顯示
   * @param {*} interactData
   * @param {*} queryParams
   * @param {*} key
   * @returns
   */
  showInteractTable = (interactData, key) => {
    const budgetClass = {
      interactTimeWork: '時薪案件',
      interactBudgetBelow5000: '5000以下案件',
      interactBudgetOver5000: '5000以上案件',
    };
    const columnSum = {
      onlineDemand: 0,
      notApplyOrContact: 0,
      isApplyOrContact: 0,
      apply: 0,
      applyTopper: 0,
      contact: 0,
      contactTopper: 0,
      inviteDemand: 0,
      invite: 0,
      inviteTopper: 0,
      communicateDemand: 0,
      communicateTopper: 0,
      cooperateDemand: 0,
      cooperateTrialTopper: 0,
      cooperatePaidTopper: 0,
      reviewDemand: 0,
      reviewDemander: 0,
      offlineDemand: 0,
    };
    const cellGroup = interactData.map((row, i) => {
      const { recordDate, interact } = row;
      columnSum.onlineDemand += interact.onlineDemand;
      columnSum.notApplyOrContact += interact.notApplyOrContact;
      columnSum.isApplyOrContact += interact.isApplyOrContact;
      columnSum.apply += interact.apply;
      columnSum.applyTopper += interact.applyTopper;
      columnSum.contact += interact.contact;
      columnSum.contactTopper += interact.contactTopper;
      columnSum.inviteDemand += interact.inviteDemand;
      columnSum.invite += interact.invite;
      columnSum.inviteTopper += interact.inviteTopper;
      columnSum.communicateDemand += interact.communicateDemand;
      columnSum.communicateTopper += interact.communicateTopper;
      columnSum.cooperateDemand += interact.cooperateDemand;
      columnSum.cooperateTrialTopper += interact.cooperateTrialTopper;
      columnSum.cooperatePaidTopper += interact.cooperatePaidTopper;
      columnSum.reviewDemand += interact.reviewDemand;
      columnSum.reviewDemander += interact.reviewDemander;
      columnSum.offlineDemand += interact.offlineDemand;
      return (
        <tr key={i}>
          <td>{dayjs(recordDate).format('YYYY/MM/DD')}</td>
          <td>{dayjs(recordDate).format('dd')}</td>
          <td>{interact.onlineDemand}</td>
          <td>{interact.notApplyOrContact}</td>
          <td>{interact.isApplyOrContact}</td>
          <td>{interact.apply}</td>
          <td>{interact.applyTopper}</td>
          <td>{interact.contact}</td>
          <td>{interact.contactTopper}</td>
          <td>{interact.inviteDemand}</td>
          <td>{interact.invite}</td>
          <td>{interact.inviteTopper}</td>
          <td>{interact.communicateDemand}</td>
          <td>{interact.communicateTopper}</td>
          <td>{interact.cooperateDemand}</td>
          <td>{interact.cooperateTrialTopper}</td>
          <td>{interact.cooperatePaidTopper}</td>
          <td>{interact.reviewDemand}</td>
          <td>{interact.reviewDemander}</td>
          <td>{interact.offlineDemand}</td>
        </tr>
      );
    });

    return (
      <>
        <h2 className="info">
          <span className="title">報表名稱:</span>
          供需互動報表
        </h2>
        <div className="tableWrap typeTable">
          <table>
            <thead>
              <tr>
                <th colSpan="3">{budgetClass[key]}</th>
                <th colSpan="2">主應查閱案件數</th>
                <th colSpan="2">主應</th>
                <th colSpan="2">查閱</th>
                <th colSpan="3">主邀</th>
                <th colSpan="2">溝通中</th>
                <th colSpan="3">確認合作(成交)</th>
                <th colSpan="2">完成評價</th>
                <th rowSpan="3">結案下刊</th>
              </tr>
              <tr>
                <th rowSpan="2">日期</th>
                <th rowSpan="2">星期</th>
                <th rowSpan="2">上刊案件數</th>
                <th rowSpan="2">無</th>
                <th rowSpan="2">有</th>
                <th rowSpan="2">次數</th>
                <th rowSpan="2">人數</th>
                <th rowSpan="2">次數</th>
                <th rowSpan="2">人數</th>
                <th rowSpan="2">案件數</th>
                <th rowSpan="2">次數</th>
                <th rowSpan="2">人數</th>
                <th rowSpan="2">案件數</th>
                <th rowSpan="2">人數</th>
                <th rowSpan="2">案件數</th>
                <th colSpan="2">人數</th>
                <th rowSpan="2">案件數</th>
                <th rowSpan="2">人數</th>
              </tr>
              <tr>
                <th>體驗方案</th>
                <th>付費方案</th>
              </tr>
            </thead>
            <tbody>
              {cellGroup}
              <tr>
                <td colSpan="2">合計</td>
                <td>{columnSum.onlineDemand}</td>
                <td>{columnSum.notApplyOrContact}</td>
                <td>{columnSum.isApplyOrContact}</td>
                <td>{columnSum.apply}</td>
                <td>{columnSum.applyTopper}</td>
                <td>{columnSum.contact}</td>
                <td>{columnSum.contactTopper}</td>
                <td>{columnSum.inviteDemand}</td>
                <td>{columnSum.invite}</td>
                <td>{columnSum.inviteTopper}</td>
                <td>{columnSum.communicateDemand}</td>
                <td>{columnSum.communicateTopper}</td>
                <td>{columnSum.cooperateDemand}</td>
                <td>{columnSum.cooperateTrialTopper}</td>
                <td>{columnSum.cooperatePaidTopper}</td>
                <td>{columnSum.reviewDemand}</td>
                <td>{columnSum.reviewDemander}</td>
                <td>{columnSum.offlineDemand}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  render() {
    const {
      categoryPool, queryParams,
    } = this.props;
    const {
      startDate, endDate, sourceType, targetType, // 進水 || 水位
    } = queryParams;
    const isServiceCategories = sourceType === 6;
    if (!startDate && !endDate) {
      return <></>;
    }
    // data
    let sourceModel;
    let incomeData;
    let poolData;
    let total;
    if (!isServiceCategories && targetType !== 3) {
      sourceModel = this.buildModelSetting(sourceType);
      const tableData = this.pendingTableMemberData(startDate, endDate, categoryPool, sourceModel, targetType);
      incomeData = tableData.incomeData;
      total = tableData.incomeSum;
      poolData = tableData.poolData;
    }

    return (
      <div id="manageShow">

        <h2 className="info">
          <span className="title">查詢區間：</span>
          {startDate}
          {' '}
          ~
          {' '}
          {endDate}
        </h2>
        {!isServiceCategories || targetType === 3
          ? (
            <>
              {(targetType === 0 || targetType === 2) ? this.showMemberTable(sourceModel, incomeData, total, queryParams, '進水') : <></> }
              {(targetType === 1 || targetType === 2) ? this.showMemberTable(sourceModel, poolData, null, queryParams, '水位') : <></>}
              {(targetType === 3) ? Object.keys(categoryPool).map((key, i) => (<Fragment key={i}>{this.showInteractTable(categoryPool[key], key)}</Fragment>)) : <></>}
            </>
          )
          : (
            <>
              {this.showCategoryTable(categoryPool, queryParams)}
            </>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(SearchShow);
