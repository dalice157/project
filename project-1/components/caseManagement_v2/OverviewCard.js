import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Room, Person } from '@material-ui/icons';
import dayjs from 'dayjs';
import { dateFormat } from '../../config/constant';
import { priceType, targetData } from '../../config/selectData.js';
import { moneyFormat } from '../../util/commonUtil';
import styles from './OverviewCard.scss';
import { catSearch } from '../../util/categoryUtils';

class OverviewCard extends Component {
  render() {
    const { area } = this.props;
    const {
      title, unit, minPrice, maxPrice, assignPlace, educationalStage, applyCount, onlineDate, basicId, demandId
    } = this.props.item;
    const searchArea = assignPlace && assignPlace !== null && assignPlace.length > 0
      ? catSearch(area, assignPlace[0]).des
      : '不拘';
    return (
      <div className={styles.card} onClick={() => open(`/caseInfo?basicId=${basicId}&demandId=${demandId}`, '_blank')}>
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.price}>
          { priceType[unit] === '時薪' ? '時薪' : '論件' } NT$ { moneyFormat(String(minPrice)) } ~ { moneyFormat(String(maxPrice)) } 元
        </div>
        <div className={styles.info}>
          <div className={styles.area}>
            <Room />
            <span className={styles.text}>
              {searchArea}
            </span>
          </div>
          {
            educationalStage && (
            <div className={styles.person}>
              <Person />
              <span className={styles.text}>{ targetData[educationalStage - 1].title }</span>
            </div>
            )
          }
        </div>
        <div className={styles.dateInfo}>
          <div className={styles.applyCount}>應徵人數 {applyCount || 0}</div>
          <div className={styles.dateChange}>刊登日期 {dayjs(onlineDate).format(dateFormat)}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(OverviewCard);
