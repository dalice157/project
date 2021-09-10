import React, { PureComponent } from 'react';
import dayjs from 'dayjs';
import { Rate, Select } from 'antd';
import classnames from 'classnames';
import { dateFormat, EVALUATION_TYPE } from '../../config/constant';
import CreateMarkup from '../common_v2/CreateMarkup';
import Paginating from '../ui/paginating';
import styles from './List.scss';
import { generateStarRate } from '../../util/formatUtil';

const { Option } = Select;
class Lists extends PureComponent {
  render() {
    const {
      gigId, sideBarList, reviewGig, itemList, handleSelect, onPageChange, pageNum, type,
    } = this.props;
    const isGigId = gigId == 0 ? sideBarList && sideBarList[0].gigId : gigId;
    const paginatingIsHide = !(itemList && itemList.data.length > 0);
    return (
      <div className={styles.wrap}>
        {
          reviewGig && isGigId != 'Gig-Other' && (
            <div className={styles.gigWrap}>
              <div className={styles.all}>
                <span className={`${styles.lager} ${styles.point}`}>{reviewGig.reviewGigScore}</span>
              </div>
              <ul className={styles.ranging}>
                <li>
                  溝通及處理態度
                  {' '}
                  <span className={styles.point}>{reviewGig.ranking1}</span>
                </li>
                <li>
                  服務的品質滿意度
                  {' '}
                  <span className={styles.point}>{reviewGig.ranking2}</span>
                </li>
                <li>
                  是否會推薦給朋友
                  {' '}
                  <span className={styles.point}>{reviewGig.ranking3}</span>
                </li>
              </ul>
              <div className={styles.quantity}>
                評價數
                {' '}
                <span className={styles.percentage}>{reviewGig.reviewCount}</span>
              </div>
            </div>
          )
        }
        <h2 className={styles.title}>
          案主評論
          <Select value={type || EVALUATION_TYPE.all} style={{ width: 120 }} onChange={handleSelect}>
            <Option value={EVALUATION_TYPE.all}>全部評價</Option>
            <Option value={EVALUATION_TYPE.positive}>正面評價</Option>
            <Option value={EVALUATION_TYPE.negative}>負面評價</Option>
          </Select>
        </h2>
        <div className={styles.list}>
          {
            paginatingIsHide
              ? (
                <div className={styles.noMessage}>尚無案主評論</div>
              )
              : (
                itemList && itemList.data.map(item => (
                  <div key={item.commentDate} className={styles.wrap}>
                    <h3 className={styles.titleWrap}>
                      <div className={styles.titleMessage}>
                        案主
                        <span className={styles.highlight}>{item.demander}</span>
                        {' '}
                        評價
                        <span className={styles.highlight}>{item.gigTitle}</span>
                        合作案件
                        <span className={styles.highlight}>{item.demandTitle}</span>
                      </div>
                      <div className={styles.date}>{dayjs(item.commentDate).format(dateFormat)}</div>
                    </h3>
                    <ul className={styles.rateWrap}>
                      <li>
                        溝通及處理態度
                        <Rate allowHalf disabled value={item.ranking1 ? generateStarRate(Number(item.ranking1)) : 0} />
                      </li>
                      <li>
                        服務的品質滿意度
                        <Rate allowHalf disabled value={item.ranking2 ? generateStarRate(Number(item.ranking2)) : 0} />
                      </li>
                      <li>
                        是否會推薦給朋友
                        <Rate allowHalf disabled value={item.ranking3 ? generateStarRate(Number(item.ranking3)) : 0} />
                      </li>
                    </ul>
                    {
                        item.comment ? (
                          <div className={styles.desc}>
                            <CreateMarkup text={item.comment} />
                          </div>
                        )
                          : (
                            <div className={styles.desc}>
                              無評語
                            </div>
                          )
                      }
                  </div>
                ))
              )
          }
        </div>
        <Paginating
          className={classnames(styles.pagination, {
            [styles.dNone]: paginatingIsHide,
          })}
          current={pageNum}
          defaultCurrent={1}
          defaultPageSize={5}
          total={itemList && itemList.total}
          onChange={onPageChange}
        />
      </div>
    );
  }
}

export default Lists;
