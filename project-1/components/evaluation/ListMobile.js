import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import {
  Rate, Select, Icon,
} from 'antd';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { dateFormat, EVALUATION_TYPE } from '../../config/constant';
import CreateMarkup from '../common_v2/CreateMarkup';
import Paginating from '../ui/paginating';
import styles from './ListMobile.scss';
import { generateStarRate } from '../../util/formatUtil';

const { Option } = Select;
class ListMobile extends PureComponent {
  render() {
    const {
      itemList, handleSelect, onPageChange, page, type, gigId, basicId, reviewGig, title,
    } = this.props;
    const paginatingIsHide = !(itemList && itemList.data.length > 0);
    return (
      <div className={styles.wrap}>
        <div className={styles.block}>
          <Link to={`/evaluation/${basicId}`}>
            <div className={styles.backPage}>
              <Icon type="left" />
              {' '}
              回評價列表
            </div>
          </Link>
          <h3 className={styles.topperTitle}><span className={styles.ellipsis}>{title}</span></h3>
          {
            reviewGig && gigId != 'Gig-Other' && (
              <div className={styles.gigWrap}>
                <div className={styles.all}>
                  平均評價
                  <span className={`${styles.lager} ${styles.point}`}>
                    {reviewGig.reviewGigScore}
                  </span>
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
        </div>

        <Select className={styles.select} value={type || EVALUATION_TYPE.all} onChange={handleSelect}>
          <Option value={EVALUATION_TYPE.all}>全部評價</Option>
          <Option value={EVALUATION_TYPE.positive}>正面評價</Option>
          <Option value={EVALUATION_TYPE.negative}>負面評價</Option>
        </Select>
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
                      <div className={styles.info}>
                        <div className={styles.titleMessage}>
                          案主
                          <span className={`${styles.highlight} ${styles.demander}`}>{item.demander}</span>
                        </div>
                        <div className={styles.titleMessage}>
                          評價服務
                          <span className={`${styles.highlight} ${styles.gigTitle}`}>
                            {' '}
                            {item.gigTitle}
                          </span>
                        </div>
                        <div className={styles.titleMessage}>
                          合作案件
                          <span className={`${styles.highlight} ${styles.demandTitle}`}>{item.demandTitle}</span>
                        </div>
                      </div>
                      <div className={styles.date}>{dayjs(item.commentDate).format(dateFormat)}</div>
                    </h3>
                    <ul className={styles.rateWrap}>
                      <li>
                        <span className={styles.rankText}>溝通及處理態度</span>
                        <Rate allowHalf disabled value={item.ranking1 ? generateStarRate(Number(item.ranking1)) : 0} />
                      </li>
                      <li>
                        <span className={styles.rankText}>服務的品質滿意度</span>
                        <Rate allowHalf disabled value={item.ranking2 ? generateStarRate(Number(item.ranking2)) : 0} />
                      </li>
                      <li>
                        <span className={styles.rankText}>是否會推薦給朋友</span>
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
          current={page}
          defaultCurrent={1}
          defaultPageSize={5}
          total={itemList && itemList.total}
          onChange={onPageChange}
        />
      </div>
    );
  }
}

export default ListMobile;
