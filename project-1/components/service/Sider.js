import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';

import Avatar from '../ui/avatar';
import Button from '../ui/button';
import bronze from '../../img/common_v2/badge-bronze.png';
import gold from '../../img/common_v2/badge-gold.png';
import silver from '../../img/common_v2/badge-silver.png';

import styles from './Sider.scss';

class Siders extends PureComponent {
  render() {
    const {
      onScroll, isScrolltop, gigId, basicId, profileInfo, contactButton,
    } = this.props;
    const {
      coverPic, dealCount, reviewCount, topperName, topperTitle, reviewAvgScore,
      medal, activeInSevenDays,
    } = profileInfo;
    const isGigId = gigId ? `?gigId=${gigId}` : '';
    const blogUrl = 'https://blog.top.104.com.tw/top-rated-freelancer';
    const badges = new Map([
      ['1', [{
        img: silver,
        alt: '銀牌',
        link: blogUrl,
      }]],
      ['2', [{
        img: gold,
        alt: '金牌',
        link: blogUrl,
      }]],
    ]);
    const badge = badges.get(medal);
    return (
      <>
        <BrowserView>
          <div onScroll={onScroll} className={`${styles.sider} ${isScrolltop ? styles.top : ''}`}>
            <Avatar size={120} userImg={coverPic} alt={topperName} />
            {
              (medal !== '0' || activeInSevenDays === 'true') && (
                <div className={styles.badgeInfo}>
                  {
                    medal !== '0' && (
                      <a href={badge[0].link} target="_blank" rel="noreferrer">
                        <img src={badge[0].img} alt={badge[0].alt} />
                      </a>
                    )
                  }

                  {
                    activeInSevenDays === 'true' && (
                    <a href={blogUrl} target="_blank" rel="noreferrer">
                      <img src={bronze} alt="活躍" />
                    </a>
                    )
                  }
                </div>
              )
            }
            <h2 className={styles.userName}>{ topperName }</h2>
            {
              topperTitle && (
                <div className={styles.jobTitle}>
                  { topperTitle }
                </div>
              )
            }
            <div className={styles.btnWrap}>
              <Button>
                <Link to={`/profile/${basicId}${isGigId}`}>關於我</Link>
              </Button>
              {contactButton}
            </div>
            <hr className={styles.hr} />
            <ul className={styles.list}>
              <li className={styles.allWrap}>
                {
              reviewAvgScore > 0 ? (
                <>
                  <div className={styles.all}>
                    <span className={styles.title}>整體評價</span>
                    <span className={styles.number} itemProp="ratingValue">
                      {reviewAvgScore}
                    </span>
                  </div>
                  <div className={styles.btnAllWrap}>
                    <Button>
                      <Link to={`/evaluation/${basicId}`} target="_blank">完整評價</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className={styles.nothing}>積極尋求合作中</div>
              )
            }
              </li>
              <li>
                <span className={styles.title}>評價數</span>
                {
              reviewCount > 0 ? (
                <Link className={styles.number} to={`/evaluation/${basicId}`} data-gtm-profile="evaluation" target="_blank">
                  { reviewCount }
                </Link>
              ) : (
                <span className={styles.number}>0</span>
              )
            }
              </li>
              <li>
                <span className={styles.title}>合作數</span>
                <span className={styles.number}>{ dealCount }</span>
              </li>
            </ul>
          </div>
        </BrowserView>
        <MobileView>
          <div className={`${styles.sider} ${styles.mobile}`}>
            <div className={styles.layout}>
              <Avatar size={80} userImg={coverPic} alt={topperName} />
              <div className={styles.siderWrap}>
                <h2 className={styles.userName}>{ topperName }</h2>
                <div className={styles.userBadge}>
                  {
                    (medal !== '0' || activeInSevenDays === 'true') && (
                      <div className={styles.badgeInfo}>
                        {
                          medal !== '0' && (
                            <a href={badge[0].link} target="_blank" rel="noreferrer">
                              <img src={badge[0].img} alt={badge[0].alt} />
                            </a>
                          )
                        }

                        {
                          activeInSevenDays === 'true' && (
                          <a href={blogUrl} target="_blank" rel="noreferrer">
                            <img src={bronze} alt="活躍" />
                          </a>
                          )
                        }
                      </div>
                    )
                  }
                  {
                    topperTitle && (
                      <div className={styles.jobTitle}>
                        { topperTitle }
                      </div>
                    )
                  }
                </div>
                <ul className={styles.list}>
                  <li className={styles.allWrap}>
                    <span className={styles.title}>合作數</span>
                    <span className={styles.number}>{ dealCount }</span>
                  </li>
                  <li className={styles.allWrap}>
                    {
                reviewAvgScore > 0 ? (
                  <>
                    <span className={styles.title}>整體評價</span>
                    <span className={styles.number} itemProp="ratingValue">
                      {reviewAvgScore}
                      {reviewCount > 0 ? (
                        <span className={styles.numberLink}>
                          (
                          <Link to={`/evaluation/${basicId}`} data-gtm-profile="evaluation" target="_blank">{ reviewCount }</Link>
                          )
                        </span>
                      ) : (
                        <span className={styles.number}>0</span>
                      )
                      }
                    </span>
                  </>
                ) : (
                  <div className={styles.nothing}>積極尋求合作中</div>
                )
                }
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.btnWrap}>
              <Button>
                <Link to={`/profile/${basicId}${isGigId}`}>關於我</Link>
              </Button>
            </div>
          </div>
        </MobileView>
      </>
    );
  }
}

export default Siders;
