import React, { Fragment, Component } from 'react';
import { Table } from 'antd';
import { dateFormat, optionsToTable } from '../../util/formatUtil';
import { depositResourceOpts, onlineStatusOptsForDemand, findOffReasonLabel } from '../../config/demandOptions';
import { findNodeDesc } from '../../util/lablesUtils';
import { statusTypes as depositStatusTypes, applyType } from '../order/deposit/options';
import { clerkSlotData, unitData } from '../../config/selectData.js';
import PagerInfo from '../ui/pagerInfo.js';


const clerkDisplay = (record) => {
  if (record.assignSlot !== null) {
    return record.assignSlot > -1 ? clerkSlotData[record.assignSlot].name : '未分派';
  }
  const clerkName = record.clerk === null ? '-' : `${record.clerk.substring(5, record.clerk.length)}(代)`;
  return clerkName;
};

const showMemoMore = (lastMemo, record) => (lastMemo === null ? (
  '-'
) : (
  <>
    <a href={`/admin/member/memo/demand/${record.basicId}?demandId=${record.demandId}`} target="_blank" rel="noopener noreferrer">{lastMemo.memo}</a>
    {dateFormat(lastMemo.createDate)}
    (
    {lastMemo.clerk}
    )
  </>
));

const depositStatusDesc = depositStatusTypes.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});

const unitTable = optionsToTable(unitData);

class demandList extends Component {
    getDemandCategoryDesc = (demandCategory) => {
      const desc = [];
      // eslint-disable-next-line
        demandCategory.map((cats) => {
        desc.push(findNodeDesc(cats));
      });
      return desc.join(',');
    }

    getDepositResourceDesc = (depositResource, record) => {
      let desc = '';
      if (depositResource === 'orderTX') {
        desc = `${depositStatusDesc[record.orderMISProcess]} ${record.orderApplySource !== null ? applyType[record.orderApplySource] : ''}`;
      } else {
        depositResourceOpts.map((item) => {
          if (item.value === depositResource) {
            desc = item.label;
          }
          return desc;
        });
      }
      return desc;
    }

    columns = [
      {
        title: '會員',
        dataIndex: 'familyName',
        render: (familyName, record) => (
          <Fragment>
            <a href={`/admin/member/${record.basicId}?tabs=basic`} target="_blank" rel="noopener noreferrer">{`${familyName}${record.firstName}`}</a>
            <div>
              {record.email}
              <br />
              {record.emailVerifyStatus === true ? '已驗證' : '未驗證'}
            </div>
          </Fragment>
        ),
      },
      {
        title: '案件(舊站編號)',
        dataIndex: 'demandId',
        render: (demandId, record) => (
          <Fragment>
            <div>
              {demandId}
              <br />
              {record.oldSiteCaseNo === null ? '' : `(${record.oldSiteCaseNo})`}
            </div>
            <a href={`/admin/demand/edit/${record.basicId}?demandId=${record.demandId.split('-')[1]}`} target="_blank" rel="noopener noreferrer">{record.demandTitle}</a>
            <hr />
            <div>{record.demandCategory ? this.getDemandCategoryDesc(record.demandCategory) : ''}</div>
          </Fragment>
        ),
      },
      {
        title: <div>
          建立日期
          <br />
          刊登-結案
          <br />
          預計下線日
               </div>,
        dataIndex: 'createDate',
        render: (createDate, record) => (
          <Fragment>
            <div>
              建:
              {dateFormat(createDate)}
            </div>
            <div>
              刊:
              {`${dateFormat(record.onlineDate)} ${record.offDate ? `~ 結:${dateFormat(record.offDate)}` : ''}`}
            </div>
            <div>
              下:
              {`${record.expireDate === null ? '-' : record.expireDate.split('-')[1]}`}
            </div>
          </Fragment>
        ),
      },
      {
        title: '刊登狀態',
        dataIndex: 'onlineStatusOption',
        render: (onlineStatusOption, demandElement) => {
          const { offReason } = demandElement;
          const isNotPublished = offReason >= 100 && offReason <= 199;
          if (isNotPublished) {
            // 結案未上刊關閉
            return <div>{onlineStatusOptsForDemand['4'].label}</div>;
          }
          return <div>{onlineStatusOptsForDemand[onlineStatusOption].label}</div>;
        },
      },
      {
        title: '押金狀態',
        dataIndex: 'depositResource',
        render: (depositResource, record) => <div>{this.getDepositResourceDesc(depositResource, record)}</div>,
      },
      {
        title: '應徵高手',
        dataIndex: 'applyCount',
      },
      {
        title: '溝通高手',
        dataIndex: 'negotiatedCount',
      },
      {
        title: '確認合作',
        dataIndex: 'confirmedCount',
      },
      {
        title: '完成評價',
        dataIndex: 'reviewedCount',
      },
      {
        title: '成交金額',
        dataIndex: 'dealPriceList',
        render: (dealPriceList) => {
          if (Array.isArray(dealPriceList) && dealPriceList.length > 0) {
            return (
              <div>
                {dealPriceList.map(dealPrice => (
                  <p>
                    {unitTable[dealPrice.unit]}
                    {' '}
                    {dealPrice.price}
                  </p>
                ))}
              </div>
            );
          }
          return <div> — </div>;
        },
      },
      // {
      //   title: '檢舉狀態',
      //   dataIndex: 'violation',
      //   render: violation => <div>{violation === true ? '檢舉違規成立' : '-'}</div>,
      // },
      {
        title: <div>
          負責專員
          <br />
          客服備註
        </div>,
        dataIndex: 'lastMemo',
        render: (lastMemo, record) => (
          <Fragment>
            <div>{clerkDisplay(record)}</div>
            <hr />
            <div>{showMemoMore(lastMemo, record)}</div>
            <span style={{ color: 'red' }}>{record.offReason ? `(${findOffReasonLabel(record.offReason)})` : ''}</span>
          </Fragment>
        ),
      },
    ];


    render() {
      const {
        data, nextKey, nextPage,
      } = this.props;
      return (
        <Fragment>
          <PagerInfo data={data} nextKey={nextKey} nextPage={nextPage} />
          <Table rowKey="demandId" columns={this.columns} dataSource={data} scroll={{ x: 1000 }} />
          <PagerInfo data={data} nextKey={nextKey} nextPage={nextPage} />
        </Fragment>
      );
    }
}
export default demandList;
