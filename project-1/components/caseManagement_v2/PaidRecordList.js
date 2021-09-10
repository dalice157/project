import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Layout, Table, Collapse, Card, Divider,
} from 'antd';
import dayjs from 'dayjs';
import styles from './PaidRecordList.scss';
import {
  dateFormat, paymentTypes, paidTable, paidTypes, invoiceHandleTypes, invoiceTypes,
} from '../../config/constant';
import config from '../../config/config';

const { Content } = Layout;
const { Panel } = Collapse;

const columns = [
  {
    title: '訂單編號',
    dataIndex: 'orderId',
  },
  {
    title: '購買日',
    dataIndex: 'payDate',
    render: payDate => dayjs(payDate).format(dateFormat),
  },
  {
    title: '付費方式',
    dataIndex: 'paymentType',
    render: paymentType => paymentTypes[paymentType],
  },
  {
    title: '方案',
    dataIndex: 'productNo',
    render: (productNo, payload) => {
      const { planType } = payload;
      const productMap = config.products.json;
      const getProductNo = planType ? productMap[planType][productNo] : '無';
      return planType ? `${getProductNo.productName}會員` : '無';
    },
  },
  {
    title: '金額',
    dataIndex: 'price',
  },
  {
    title: '發票號碼/發票聯式',
    dataIndex: 'orderReceipt',
    render: (orderReceipt, payload) => {
      const { orderType } = payload;
      if (orderReceipt) {
        const { invoiceNo, invoiceType, invoiceHandleType } = orderReceipt;
        return `${invoiceNo}\n
                ${invoiceType === '2' ? `${invoiceTypes[Number(invoiceType)]} - ${invoiceHandleTypes[Number(invoiceHandleType)]}` : `${invoiceTypes[Number(invoiceType)]} - 公司發票`}`;
      } else if (orderType === paidTypes.freeTrial) {
        return '押金代收無發票';
      }
      return '尚無發票';
    },
  },
  {
    title: '刊期',
    dataIndex: 'startDate',
    render: (startDate, payload) => {
      const { endDate } = payload;
      if (startDate && endDate) {
        return `${dayjs(startDate).format(dateFormat)}～${dayjs(endDate).format(dateFormat)}`;
      } else if (startDate) {
        return `${dayjs(startDate).format(dateFormat)} 起`;
      }
      return <></>;
    },
  },
  {
    title: '備註',
    dataIndex: 'discount',
    render: (discount, payload) => {
      const { refundDate, endDate, orderType } = payload;
      if (orderType === paidTypes.freeTrial) {
        return (`
      ${refundDate ? `${dayjs(endDate).format(dateFormat)} 取消刊登\n` : ''}
      ${refundDate ? `${dayjs(refundDate).format(dateFormat)} 退還押金\n` : ''}
      `);
      }
      return (`${discount === 0.9 ? '續約 9 折\n' : ''}`);
    },
  },
];

class PaidRecord extends Component {
  handleOrderReceipt = (orderReceipt, orderType) => {
    if (orderReceipt) {
      const { invoiceNo, invoiceType, invoiceHandleType } = orderReceipt;
      return `${invoiceNo}\n
                ${invoiceType === '2' ? `${invoiceTypes[Number(invoiceType)]} - ${invoiceHandleTypes[Number(invoiceHandleType)]}` : `${invoiceTypes[Number(invoiceType)]} - 公司發票`}`;
    } else if (orderType === paidTypes.freeTrial) {
      return '押金代收無發票';
    }
    return '尚無發票';
  }

  handleNote = (refundDate, endDate, orderType, discount) => {
    if (orderType === paidTypes.freeTrial) {
      return (`
      ${refundDate ? `${dayjs(endDate).format(dateFormat)} 取消刊登\n` : ''}
      ${refundDate ? `${dayjs(refundDate).format(dateFormat)} 退還押金\n` : ''}
      `);
    }
    return (`${discount === 0.9 ? '續約 9 折\n' : ''}`);
  }

  render() {
    const { paidData, isMobile, isLoading } = this.props;
    const numOfData = paidData.length;
    return (
      <Content>
        <div className={styles.content}>
          {
            isMobile ? (
              <Collapse bordered={false}>
                <Panel header="注意事項" key="1">
                  <ul className={styles.notes}>
                    <li className={styles.note}>
                      以下資料為付款記錄，若為體驗押金，不會產生發票資料。若為非體驗之超值、無限…等方案，才有發票資料。發票資料將會於付費完成後隔日才會顯示。
                    </li>
                    <li className={styles.note}>104會員載具與手機載具，將分別由104及財政部每逢單月自動對獎，若有中獎則E-mail通知中獎人。  </li>
                    <li className={styles.note}>
                      若需查詢發票資料請至以下管道查詢：
                      <ul className={styles.subNotes}>
                        <li className={styles.subNote}>
                          104會員載具：
                          <a href="https://www.bpscm.com.tw/EI/ECInvoiceForBuyer/InvoiceSearch.aspx" target="_blank">金財通商務服務平台</a>
                        </li>
                        <li className={styles.subNote}>
                          手機載具：
                          <a href="https://www.einvoice.nat.gov.tw/" target="_blank">財政部電子發票整合服務平台</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </Panel>
              </Collapse>
            ) : (
              <ul className={styles.notes}>
                <li className={styles.note}>
                  以下資料為付款記錄，若為體驗押金，不會產生發票資料。若為非體驗之超值、無限…等方案，才有發票資料。發票資料將會於付費完成後隔日才會顯示。
                </li>
                <li className={styles.note}>104會員載具與手機載具，將分別由104及財政部每逢單月自動對獎，若有中獎則E-mail通知中獎人。  </li>
                <li className={styles.note}>
                  若需查詢發票資料請至以下管道查詢：
                  <ul className={styles.subNotes}>
                    <li className={styles.subNote}>
                      104會員載具：
                      <a href="https://www.bpscm.com.tw/EI/ECInvoiceForBuyer/InvoiceSearch.aspx" target="_blank" rel="noreferrer">金財通商務服務平台</a>
                    </li>
                    <li className={styles.subNote}>
                      手機載具：
                      <a href="https://www.einvoice.nat.gov.tw/" target="_blank" rel="noreferrer">財政部電子發票整合服務平台</a>
                    </li>
                  </ul>
                </li>
              </ul>
            )
          }
          <p className={styles.num}>
            以下為您的付款記錄，共
            {' '}
            <span>{numOfData || '-'}</span>
            {' '}
            筆：
          </p>
          {
            isMobile
              ? paidData.map((data) => {
                const {
                  orderId, payDate, orderType, startDate, endDate, paymentType,
                  refundDate, orderReceipt, discount, price, planType, productNo,
                } = data;
                const productMap = config.products.json;
                const getProductNo = planType ? productMap[planType][productNo] : '無';
                return (
                  <Card className={styles.card} key={orderId}>
                    <div className={styles.line}>
                      <span className={styles.title}>訂單編號：</span>
                      <span>{orderId}</span>
                    </div>
                    <div className={styles.line}>
                      <span className={styles.title}>購買日：</span>
                      <span>{dayjs(payDate).format(dateFormat)}</span>
                    </div>
                    <div className={styles.line}>
                      <span className={styles.title}>刊登方案：</span>
                      <span>
                        {planType ? getProductNo.productName : '無'}
                        會員
                      </span>
                    </div>
                    <div className={styles.line}>
                      <span className={styles.title}>刊期：</span>
                      <span>
                        {dayjs(startDate).format(dateFormat)}
                        ～
                        {dayjs(endDate).format(dateFormat)}
                      </span>
                    </div>
                    <div className={styles.line}>
                      <span className={styles.title}>金額：</span>
                      <span>{price}</span>
                    </div>
                    <div className={styles.line}>
                      <span className={styles.title}>付款方式：</span>
                      <span>{paymentTypes[paymentType]}</span>
                    </div>
                    <div className={styles.line}>
                      <span className={styles.title}>發票號碼/聯式：</span>
                      <span>{this.handleOrderReceipt(orderReceipt, orderType)}</span>
                    </div>
                    <Divider />
                    <div className={styles.line}>
                      <span className={styles.title}>備註：</span>
                      <span>{this.handleNote(refundDate, endDate, orderType, discount)}</span>
                    </div>
                  </Card>
                );
              })
              : <Table rowKey={record => `${record.orderId}`} columns={columns} dataSource={paidData} scroll={{ x: '100%' }} loading={isLoading} />
          }
        </div>
      </Content>
    );
  }
}

export default withRouter(PaidRecord);
