import React, { PureComponent } from 'react';
import { Divider } from 'antd';
import { dateFormat, replaceAreaNo } from '../../../util/formatUtil.js';
import { mappingStaffName, isGigId } from '../../../util/commonUtil.js';
import { replaceCatNo } from '../../../util/categoryUtils.js';
import { tabs } from '../../../config/selectData.js';
import './memo.scss';

let preItem = null;

class tabAll extends PureComponent {
  render() {
    const { data, area } = this.props;
    const sliceId = (demandId, number) => demandId.slice(number);
    const hasData = data && data.facets && data.facets.memoDao;
    return (
      <>
        <table className="table">
          <thead>
            <tr className="title">
              <th colSpan="2">{tabs[1].tab}</th>
            </tr>
          </thead>
          <tbody>
            {
            hasData && (hasData.basicMemo === null || hasData.basicMemo.length === 0) && (
              <tr>
                <td colSpan="2" width="25%">
                  無會員備註資料
                </td>
              </tr>
            )
          }
            {
          hasData && hasData.basicMemo.map((item, index) => (
            <tr key={`basic${index}`}>
              <td width="25%">
                <div className="date">{ dateFormat(item.createDate, true) }</div>
                <div className="name">
                  【
                  {item.staff ? mappingStaffName(item.staff) : item.clerk}
                  】
                </div>
              </td>
              <td>{replaceAreaNo(item.memo, area)}</td>
            </tr>
          ))
        }
          </tbody>
        </table>
        <Divider dashed />
        <table className="table">
          <thead>
            <tr className="title">
              <th colSpan="2">{tabs[2].tab}</th>
            </tr>
          </thead>
          <tbody>
            {
            hasData && (hasData.gigMemo === null || hasData.gigMemo.length === 0) && (
              <tr>
                <td colSpan="2" width="25%">
                  無接案備註資料
                </td>
              </tr>
            )
          }
            {
          hasData && hasData.gigMemo.map((item, index) => (
            <tr key={`gig${index}`}>
              <td width="25%">
                <div className="date">{ dateFormat(item.createDate, true) }</div>
                <div className="name">
                  【
                  {item.staff ? mappingStaffName(item.staff) : item.clerk}
                  】
                </div>
              </td>
              <td>
                { isGigId(item.memoSource) && '【服務編號】'.concat(item.memoSource) }
                { isGigId(item.memoSource) && <br /> }
                { replaceCatNo(item.memo) }
              </td>
            </tr>
          ))
        }
          </tbody>
        </table>
        <Divider dashed />
        <table className="table">
          <thead>
            <tr className="title">
              <th colSpan="2">
                { tabs[3].tab }
              </th>
            </tr>
          </thead>
          <tbody>
            {
            hasData && (hasData.demandMemo === null || hasData.demandMemo.length === 0) && (
              <tr>
                <td colSpan="2" width="25%">
                  無案件備註資料
                </td>
              </tr>
            )
          }
            {
            hasData && hasData.demandMemo.map((item, index) => {
              const showDemandTR = preItem == null || preItem.memoSource !== item.memoSource;
              preItem = item;
              return (
                <React.Fragment key={index}>
                  {
                  showDemandTR && (
                  <tr className="no">
                    <td width="25%">案件編號</td>
                    <td>
                      { item.memoSource.slice(7)}
                    </td>
                  </tr>
                  )
                }
                  {
                    <tr>
                      <td>
                        <div className="date">
                          { dateFormat(item.createDate, true) }
                        </div>
                        <div className="name">
                          【
                          {item.staff ? mappingStaffName(item.staff) : item.clerk}
                          】
                        </div>
                      </td>
                      <td>
                        { item.memo }
                      </td>
                    </tr>
                }
                </React.Fragment>
              );
            }) }
          </tbody>
        </table>
        <Divider dashed />
        <table className="table">
          <thead>
            <tr className="title">
              <th colSpan="2">
                { tabs[4].tab }
              </th>
            </tr>
          </thead>
          <tbody>
            {
            hasData && (hasData.violationRecordMemo === null || hasData.violationRecordMemo.length === 0) && (
              <tr>
                <td colSpan="2" width="25%">
                  無檢舉備註資料
                </td>
              </tr>
            )
          }
            {
            hasData && hasData.violationRecordMemo.map((item, index) => (
              <>
                <tr key={`violation${index}`} className="no">
                  <td width="25%">檢舉編號</td>
                  <td>
                    { sliceId(item.recordId, 10) }
                  </td>
                </tr>
                {
                    item.memo.map((obj, ind) => (
                      <tr key={`memo${ind}`}>
                        <td>
                          <div className="date">
                            { dateFormat(obj.createDate, true) }
                          </div>
                          <div className="name">
                            【
                            {obj.staff ? mappingStaffName(obj.staff) : obj.clerk}
                            】
                          </div>
                        </td>
                        <td>
                          { obj.memo }
                        </td>
                      </tr>
                    ))
                  }
              </>
            )) }
          </tbody>
        </table>
        <Divider dashed />
        <table className="table">
          <thead>
            <tr className="title">
              <th colSpan="2">{tabs[6].tab}</th>
            </tr>
          </thead>
          <tbody>
            {
            hasData && (hasData.reviewMemo === null || hasData.reviewMemo.length === 0) && (
              <tr>
                <td colSpan="2" width="25%">
                  無服務評價資料
                </td>
              </tr>
            )
          }
            {
              hasData && hasData.reviewMemo.map((item, index) => (
                <tr key={`gig${index}`}>
                  <td width="25%">
                    <div className="date">{ dateFormat(item.createDate, true) }</div>
                    <div className="name">
                      【
                      {item.staff ? mappingStaffName(item.staff) : item.clerk}
                      】
                    </div>
                  </td>
                  <td>
                    { isGigId(item.memoSource) && '【服務編號】'.concat(item.memoSource) }
                    { isGigId(item.memoSource) && <br /> }
                    { replaceCatNo(item.memo) }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </>
    );
  }
}

export default tabAll;
