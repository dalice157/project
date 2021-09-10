import React, { Fragment, Component } from 'react';
import { Card } from 'antd';
import { causeType, staffHandleStatus } from './options';
import { dateFormat } from '../../util/formatUtil.js';
import { mappingStaffName } from '../../util/commonUtil.js';


const causeMap = causeType.reduce((causeList, item) => {
  causeList[item.value] = item.label;
  return causeList;
}, {});

const staffHandleStatusMap = staffHandleStatus.reduce((statusList, item) => {
  statusList[item.value] = item.label;
  return statusList;
}, {});


class ViolationContent extends Component {
    // 轉換檢舉項目
    showCause = (causeType) => {
      return causeMap[causeType];
    }

    // Memo的客服處理狀態
    showStaffHandleStatus = (staffHandleStatus) => {
      return staffHandleStatusMap[staffHandleStatus];
    }

    // Memo列表
    showMemoList = (memoList) => {
      return (
        <Fragment>
          <Card title="處理歷史紀錄">
            {memoList && memoList.map((item) => {
              return (
                <div key={ item.createDate }>{`客服處理狀態：${this.showStaffHandleStatus(item.staffHandleStatus)}`}&emsp;&emsp;&emsp;{`處理人：【${item.staff ? mappingStaffName(item.staff) : item.clerk}】`}&emsp;&emsp;&emsp;{dateFormat(item.createDate, true)}<br />
                  {`備註：${item.memo}`}
                  <hr style={ { border: '1px dashed #DDDDDD' } } />
                </div>
              );
            })}

          </Card>
        </Fragment>
      );
    }

    render() {
      const { violation } = this.props;
      return (
        <Fragment>
          {violation && (
          <Fragment>
            <Card>
              <h3>{`檢舉編號：${violation.recordId}`} &emsp;<br />檢舉日期：{dateFormat(violation.createDate, true)}</h3><hr />
              <p><b>檢舉項目：</b>{this.showCause(violation.causeType)}</p>
              <div>檢舉人：<a href={ `/admin/member/${violation.reporter}` } target="_blank" rel="noopener noreferrer">{violation.reporterName}</a>&nbsp;&nbsp;&nbsp;
                <b>會員編號：</b><a href={ `/admin/member/${violation.reporter}` } target="_blank" rel="noopener noreferrer">{violation.reporter}</a>&nbsp;&nbsp;&nbsp;<br />
                <b>檢舉人聯絡電話：</b>{violation.reporterCellphone}<br />
                <b>檢舉人聯絡e-mail：</b>{violation.reporterEmail}
                <hr style={ { border: '1px dashed #DDDDDD' } } />
                <b>被檢舉人：</b><a href={ `/admin/member/${violation.targetId}` } target="_blank" rel="noopener noreferrer">{violation.targetName}</a>&nbsp;&nbsp;&nbsp;
                <b>會員編號：</b><a href={ `/admin/member/${violation.targetId}` } target="_blank" rel="noopener noreferrer">{violation.targetId}</a>&nbsp;&nbsp;&nbsp;
                (會員身分：{violation.targetType === 1 ? '高手' : '案主'})
              </div>
              <div><b>被檢舉人聯絡電話：</b>{violation.targetCellphone}<br />
                <b>被檢舉人聯絡e-mail：</b>{violation.targetEmail}<br />
                <b>被檢舉案件：</b><a href="/demand" target="_blank">{violation.targetDemandTitle}</a>&nbsp;&nbsp;&nbsp;&nbsp;
                <b>案件編號：</b><a href="/demand" target="_blank">{violation.targetDemandId}</a>
              </div><hr />
              <div><b>檢舉事證說明：</b><br />{violation.causeBody.causeDesc}</div><br />
              <div><b>檢舉事證附件：</b><br />{violation.causeBody.attachment[0]}</div>
            </Card>
            {this.showMemoList(violation.memoList)}
          </Fragment>
          )
                }
        </Fragment>
      );
    }
}

export default ViolationContent;
