import React, { Component } from 'react';
import { Modal, } from 'antd';
import { priceType } from '../../config/selectData.js';
import { moneyFormat } from '../../util/commonUtil';
import styles from './ApplyButton.scss';
import Button from '../../components/ui/button_v2';

class ApplyButton extends Component {
  state = { visible: false };

  showModal = () => {
    const {
      unit, minPrice, maxPrice, startDate, startWork
    } = this.props.demandBody;
    const { title } = this.props;
    Modal.info({
      className: styles.info,
      icon: null,
      title: '應徵報價內容',
      okType: 'default',
      okText: '關閉',
      content: (
        <ul className={styles.list}>
          <li>應徵服務項目： {title}</li>
          <li>報價金額：{ priceType[unit] === '時薪' ? '時薪' : '論件' } NT$ { moneyFormat(minPrice) } ~ { moneyFormat(maxPrice) } 元</li>
          <li>預計可開始日期：{startDate}</li>
          <li>預計可工期：{startWork}</li>
        </ul>
      ),
    });
  };

  render() {
    return (
      <>
        <Button onClick={this.showModal} type="danger">應徵內容</Button>

      </>
    );
  }
}

export default ApplyButton;
