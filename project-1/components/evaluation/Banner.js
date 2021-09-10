import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import Avatar from '../ui/avatar';
import styles from './Banner.scss';


class Banner extends Component {
  render() {
    const {
      dealCount, ranking1, ranking2, ranking3, reviewAvgScore, reviewCount, topperImg, topperName, basicId
    } = this.props;
    return (
      <div className={styles.banner}>
        <div className={styles.wrap}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首頁</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/profile/${basicId}`}>{topperName}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {topperName} 服務評價
            </Breadcrumb.Item>
          </Breadcrumb>
          <h2 className={styles.title}><Avatar size={37} userImg={topperImg || null} />{ topperName }</h2>
          <div className={styles.block}>
            <div className={styles.all}>
              整體評價 <span className={`${styles.lager} ${styles.point}`}>{reviewAvgScore}</span>
            </div>
            <ul className={styles.ranging}>
              <li>溝通及處理態度 <span className={styles.point}>{ranking1}</span></li>
              <li>服務的品質滿意度 <span className={styles.point}>{ ranking2 }</span></li>
              <li>是否會推薦給朋友 <span className={styles.point}>{ ranking3 }</span></li>
            </ul>
            <div className={styles.quantity}>
              評價數 <span className={`${styles.lager} ${styles.percentage}`}>{ reviewCount }</span>
            </div>
            <div className={styles.quantity}>
              合作數 <span className={`${styles.lager} ${styles.percentage}`}>{ dealCount }</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Banner);
