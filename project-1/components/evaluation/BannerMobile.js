import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/avatar';
import styles from './BannerMobile.scss';

class Banner extends Component {
  render() {
    const {
      dealCount, ranking1, ranking2, ranking3, reviewAvgScore, reviewCount, topperImg, topperName, basicId
    } = this.props;
    return (
      <div className={styles.banner}>
        <div className={styles.wrap}>
          <div className={styles.avatar}>
            <Link to={`/profile/${basicId}`}><Avatar size={52} userImg={topperImg || null} /></Link>
          </div>
          <h2 className={styles.title}><Link to={`/profile/${basicId}`}><span className={styles.ellipsis}>{ topperName }</span></Link></h2>
          <div className={`${styles.block} ${styles.type}`}>
            <div className={styles.all}>
              <span className={styles.title}>整體評價</span> <span className={`${styles.lager} ${styles.point}`}>{reviewAvgScore}</span>
            </div>
            <ul className={styles.ranging}>
              <li>溝通及處理態度 <span className={styles.point}>{ranking1}</span></li>
              <li>服務的品質滿意度 <span className={styles.point}>{ ranking2 }</span></li>
              <li>是否會推薦給朋友 <span className={styles.point}>{ ranking3 }</span></li>
            </ul>
          </div>
          <div className={`${styles.block} ${styles.col}`}>
            <div className={styles.quantity}>
              評價數 <span className={`${styles.percentage}`}>{ reviewCount }</span>
            </div>
            <div className={styles.line} />
            <div className={styles.quantity}>
              合作數 <span className={`${styles.percentage}`}>{ dealCount }</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
