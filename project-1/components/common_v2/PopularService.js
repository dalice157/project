import React, { PureComponent } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { withRouter, Link } from 'react-router-dom';
import { Carousel } from 'antd';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import arrow from '../../img/index/arrow.png';
import { services } from '../../config/serviceData.js';
import styles from './PopularService.scss';

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'transparent' }}
      onClick={onClick}
    >
      <KeyboardArrowRight />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'transparent' }}
      onClick={onClick}
    >
      <KeyboardArrowLeft />
    </div>
  );
}

class PopularService extends PureComponent {
  render() {
    const { type } = this.props;
    const isJoinPage = type === 'join' ? styles.join : '';
    return (
      <div className={`${styles.steps} ${isJoinPage}`}>
        <BrowserView>
          <h2 className={`${styles.alignCenter} ${styles.mgBM}`}>精選高手</h2>
          <ul className={styles.stepList}>
            { services.map(item => (
              <li key={item.link}>
                <Link to={item.link} target="_blank">
                  <img src={item.img} alt={item.userName} />
                  <h3>{ item.userName }</h3>
                  <p>
                    { item.details }
                  </p>
                </Link>
              </li>
            )) }
          </ul>
          {
            type === 'home' && (
            <a className={`${styles.more}`} href="./search" target="_blank" data-gtm-marketing="看更多高手">
              <p className={styles.moreTitle}>看更多高手</p>
              <img className={styles.arrow} src={arrow} alt="arrow" />
            </a>
            )
          }

        </BrowserView>
        <MobileView>
          <h2 className={`${styles.alignCenter} ${styles.mgBM}`}>精選高手</h2>
          <Carousel className={styles.stepList} dots={false} arrows nextArrow={<NextArrow className={styles.arrow} />} prevArrow={<PrevArrow className={styles.arrow} />}>
            { services.map(item => (
              <Link key={item.link} to={item.link} target="_blank">
                <img src={item.img} alt={item.userName} />
                <h3>{ item.userName }</h3>
                <p>
                  { item.details }
                </p>
              </Link>
            )) }
          </Carousel>
        </MobileView>
      </div>
    );
  }
}

export default withRouter(PopularService);
