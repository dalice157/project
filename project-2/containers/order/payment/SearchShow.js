import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table, Input, Button, Modal,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../../components/ui/days';
import { dateFormat } from '../../../util/formatUtil';
import {
  payOrderTypeObj, statisticsType, marketingStatisticsType, paymentStatusObj, paymentTypeObj, invoiceType, invoiceHandleType,
} from '../../../config/selectData';
import PagerInfo from '../../../components/ui/pagerInfo.js';
import { getSinglePaymentList, sendRefund, getMultiPaymentList } from '../../../actions/order';
import './payment.scss';

const { confirm } = Modal;

class SearchShow extends Component {
  columns = [
    {
      title: '訂單日期 / 付款日期',
      dataIndex: 'createDate',
      render: (val, record) => (
        <>
          <div>{val ? dateFormat(val, true) : '-'}</div>
          <div>{record.payDate ? dateFormat(record.payDate, true) : '-'}</div>
        </>
      ),
    },
    {
      title: '會員編號 / PID / 姓名',
      dataIndex: 'basicId',
      render: (val, record) => (
        <>
          <div>
            {val ? (
              <a target="_blank" href={`/admin/member/${val}?tabs=basic`} rel="noopener noreferrer">{val}</a>
            ) : '-'}
          </div>
          <div>{record.pid ? record.pid : '-'}</div>
          <div>{record.acName ? record.acName : '-'}</div>
        </>
      ),
    },
    {
      title: 'MDM (ERP_NO)',
      dataIndex: 'mdmKey',
      render: (val, record) => (
        <>
          <div>{val}</div>
          <div>{`(${record.erpCustNo})`}</div>
        </>
      ),
    },
    {
      title: '訂單編號 / 訂單狀態',
      dataIndex: 'orderId',
      render: (val, record) => (
        <>
          <div>{val}</div>
          <div>{payOrderTypeObj[record.orderStatus]}</div>
        </>
      ),
    },
    {
      title: '銷帳編號(ATM/ibon)',
      dataIndex: 'ibonVirtualAccount',
      render: (val, record) => (
        <>
          {
          (val || record.atmVirtualAccount) ? (
            <>
              {val && <div>{val}</div>}
              {record.atmVirtualAccount && <div>{record.atmVirtualAccount}</div>}
            </>
          ) : '-'
        }
        </>
      ),
    },
    {
      title: '委刊單號(30單) / 新續回 / 原方案委刊單',
      dataIndex: 'statisticsType',
      render: (val, record) => (
        <>
          {
            record.soNo && typeof record.soNo === 'string' && record.soNo.startsWith('30') ? (
              <>
                <div>{record.soNo}</div>
                {
                  !record.marketingStatisticsType
                    ? (
                      <div>
                        {statisticsType[val]}
                        (經管)
                      </div>
                    )
                    : (
                      <div>
                        {statisticsType[val]}
                        (經管) /
                        {' '}
                        {marketingStatisticsType[record.marketingStatisticsType]}
                        (行銷)
                      </div>
                    )
                }
                <div>{record.upgradeFromSoNo}</div>
              </>
            ) : '-'
        }
        </>
      ),
    },
    {
      title: '內服單號(31單)',
      dataIndex: 'soNo',
      render: val => (
        <>
          {
          val && typeof val === 'string' && val.startsWith('31') ? (
            <>
              <div>{val}</div>
            </>
          ) : '-'
        }
        </>
      ),
    },
    {
      title: '付款狀態 / 付款方式',
      dataIndex: 'paymentStatus',
      render: (val, record) => (
        <>
          <div>{paymentStatusObj[val]}</div>
          <div>{paymentTypeObj[record.paymentType]}</div>
        </>
      ),
    },
    {
      title: '發票號碼 / 類型',
      dataIndex: 'orderReceipt',
      render: data => (
        <>
          {
          data ? (
            <>
              <div>{data.invoiceNo}</div>
              <div>{data.invoiceType === '2' ? `${invoiceType[Number(data.invoiceType)]} - ${invoiceHandleType[Number(data.invoiceHandleType)]}` : `${invoiceType[Number(data.invoiceType)]}-公司發票`}</div>
            </>
          ) : '-'
        }
        </>
      ),
    },
    {
      title: '購買方案 / 實付金額',
      dataIndex: 'productName',
      render: (val, record) => (
        <>
          <div>{val}</div>
          <div>{record.price}</div>
        </>
      ),
    },
    {
      title: '款項處理',
      dataIndex: 'orderStatus',
      render: (val, record) => {
        const {
          refundDate, modifyDate, refundPrice, clerk, orderId, price,
        } = record;
        const isRefundOrder = orderId === this.state.currentOrderId;
        const initDate = () => {
          if (isRefundOrder && this.state.date !== null) {
            return dayjs(this.state.date);
          } else if ((isRefundOrder || !isRefundOrder) && this.state.date === null) {
            return null;
          }
        };

        const isDisabled = !(isRefundOrder && this.state.date && this.state.isRefundPriceNum && this.state.price && this.state.price >= 0 && this.state.price <= price);
        return (
          <>
            {
              val === 3 && (
              <>
                <div>
                  退款日期
                  {' '}
                  <DatePicker locale={locale} value={initDate()} format="YYYY-MM-DD" onChange={(date, dateString) => this.onDateChange(date, dateString, orderId)} />
                </div>
                <div>
                  退款金額
                  {' '}
                  <Input value={isRefundOrder ? this.state.price : ''} placeholder="請填退款金額" onChange={e => this.onPriceChange(e, orderId)} />
                </div>
                {isRefundOrder && this.state.price > price && (<span style={{ color: 'red' }}>退款金額不可大於付款金額</span>)}
                {
                  isRefundOrder && this.state.isRefundPriceNum === false && <span style={{ color: 'red' }}>請填寫數字</span>
                }
                <div className="btnWrap"><Button disabled={isDisabled} onClick={() => this.onCheck(orderId)} type="primary">送出</Button></div>
              </>
              )
            }
            {
              val === 4 && refundDate && clerk && (
                <>
                  <div>
                    退款日期：
                    {' '}
                    {dateFormat(refundDate, false)}
                  </div>
                  <div>
                    退款金額：
                    {' '}
                    {refundPrice}
                  </div>
                  <div>
                    處理時間：
                    {' '}
                    {dateFormat(modifyDate, true)}
                  </div>
                  <div>
                    處理人：
                    {' '}
                    {clerk}
                  </div>
                </>
              )
            }
          </>
        );
      },
    },
  ]

  constructor(props) {
    super(props);
    this.state = {
      date: null,
      price: '',
      isRefundPriceNum: false,
    };
  }

  onDateChange = (date, dateString, currentOrderId) => {
    console.log('dateString:', dateString);
    this.setState({
      date: dateString,
      currentOrderId,
    });
  }

  onPriceChange = (e, currentOrderId) => {
    const isNumber = e.target.value.replace(/[^\d]/g, '');
    this.setState({
      price: e.target.value,
      currentOrderId,
      isRefundPriceNum: Boolean(isNumber),
    });
  }


  onCheck =(orderId) => {
    const { date, price } = this.state;
    const { searchList, type } = this.props;
    confirm({
      content: (
        <>
          <div>
            退款日期：
            {' '}
            {date}
          </div>
          <div>
            退款金額：
            {' '}
            {price}
          </div>
          <br />
          <div>資訊是否正確？</div>
        </>
      ),
      icon: null,
      okText: '是',
      cancelText: '否',
      onOk: () => {
        this.props.sendRefund(orderId, date, price).then(() => {
          this.setState({
            price: '',
            date: null,
          });

          if (type === 'single') {
            this.props.getSinglePaymentList(searchList.keyType, searchList.keyVal);
          } else {
            this.props.getMultiPaymentList(searchList);
          }
        });
      },
      onCancel: () => {
        this.setState({
          price: '',
          date: null,
        });
      },
    });
  }

  nextPage = () => {
    const { searchList, type, nextKey } = this.props;
    if (type === 'multi') {
      this.props.getMultiPaymentList(searchList, nextKey);
    } else {
      this.props.getSinglePaymentList(searchList.keyType, searchList.keyBasicId, nextKey);
    }
  }


  render() {
    const { nextKey, paymentList } = this.props;
    return (
      <div className="searchShow">
        <PagerInfo data={paymentList} nextKey={nextKey} nextPage={this.nextPage} />
        <Table
          rowKey="orderId"
          columns={this.columns}
          dataSource={paymentList}
          scroll={{ x: 1000 }}
        />
        <PagerInfo data={paymentList} nextKey={nextKey} nextPage={this.nextPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  paymentList: state.order.paymentList,
  nextKey: state.order.cursor,
  refundDatas: state.order.refundDatas,
});

const mapDispatchToProps = {
  getSinglePaymentList,
  getMultiPaymentList,
  sendRefund,
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchShow);
