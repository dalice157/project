/* eslint-disable react/jsx-no-undef */
import React, { PureComponent } from 'react';
import { BrowserView, MobileView, uaIsMobile } from 'react-device-detect';
import { Collapse } from 'antd';
import Tags from '../ui/tags';
import styles from './FindCard.scss';

const { Panel } = Collapse;

class FindCard extends PureComponent {
  render() {
    const { data, btnLink } = this.props;
    const isMobile = uaIsMobile() ? styles.mobile : '';
    return (
      <>
        <div className={`${styles.cardWarp} ${isMobile}`}>
          <BrowserView className={styles.pc}>
            {
              data.map(card => (
                <div key={card.title} className={styles.wrap}>
                  <div className={styles.left}>
                    <div className={styles.container}>
                      <div className={styles.title}>{card.title}</div>
                      <img src={card.img} alt={card.title} />
                    </div>
                  </div>
                  <div className={styles.right}>
                    {
                    card.subData.map(item => <Tags key={item.title} title={item.title} link={btnLink + item.link} />)
                    }
                  </div>
                </div>
              ))
            }
          </BrowserView>
          <MobileView>
            <div className={styles.collapse}>
              <Collapse defaultActiveKey={['0']} accordion expandIconPosition="right">
                {
              data.map(card => (
                <Panel
                  header={(
                    <div className={styles.panel}>
                      <img src={card.img} alt={card.title} />
                      <div className={styles.title}>{card.title}</div>
                    </div>
                  )}
                  key={card.title}
                >
                  <div className={styles.tagWrap}>
                    { card.subData.map(item => <Tags key={item.title} title={item.title} link={btnLink + item.link} />) }
                  </div>
                </Panel>
              ))
            }
              </Collapse>
            </div>
          </MobileView>
        </div>
      </>
    );
  }
}

export default FindCard;
