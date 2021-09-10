import React, { Component } from 'react';
// import { isMobile } from 'react-device-detect';

import { Card } from 'antd';
// import { catSearch } from '../../util/categoryUtils';
import styles from './Card.scss';

import { priceType } from '../../config/selectData.js';
import { moneyFormat } from '../../util/commonUtil';

class CardWarp extends Component {
  render() {
    const {
      title, priceStart, priceEnd, unit
    } = this.props;
    return (
      <a
        className={styles.card}
      >
        <Card bordered={false}>
          <div className={styles.tutor} />
          <span className={styles.title}>{ title }</span>
          <div className={styles.cash}>{ priceType[unit] === '時薪' ? '時薪' : '論件' } <span className={styles.money}>NT$ { moneyFormat(priceStart) } ~ { moneyFormat(priceEnd) }</span><span className={styles.textSmall}> 元</span>
          </div>
        </Card>
      </a>
    );
  }
}

export default CardWarp;
