import React, { Component } from 'react';
import { uaIsMobile, } from 'react-device-detect';
import { Button, Collapse } from 'antd';
import decoLeft from '../../img/common_v2/white-deco-left.svg';
import decoRight from '../../img/common_v2/white-deco-right.svg';
import answer from '../../img/join_v2/answer.svg';
import woman from '../../img/join_v2/banner4_woman.gif';
import { faqDatav2 } from '../../config/joinData';
import styles from './Faq.scss';

const { Panel } = Collapse;

class Faq extends Component {
  render() {
    const isMobile = uaIsMobile() ? styles.mobile : '';
    return (
      <div className={`${styles.faqBanner} ${isMobile}`}>
        <div className={styles.wrap}>
          <div className={styles.pic}>
            <img src={woman} alt="女生動畫" />
          </div>
          <h2 className={styles.title}>
            <img src={decoLeft} alt="標題" /> 常見問題 <img src={decoRight} alt="標題" />
          </h2>
          <div className={styles.collapse}>
            <Collapse
              defaultActiveKey={['0']}
              accordion
              expandIconPosition="right"
            >
              {
                faqDatav2.map((item, index) => {
                  return (
                    <Panel
                      key={index}
                      header={(
                        <div className={styles.panel}>
                          <div className={styles.question}>
                            Q
                          </div>
                          <div className={styles.title}>{item.title}</div>
                        </div>
                  )}
                    >
                      <div className={styles.answer}>
                        <img src={answer} alt="回答" />
                      </div>
                      <p>{item.desc}</p>
                    </Panel>
                  );
                })
            }
            </Collapse>
          </div>
          <div className={styles.btnWrap}>
            <Button target="_blank" type="primary" href="https://blog.top.104.com.tw/top_guide/" data-gtm-join="查看更多幫助">查看更多幫助</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Faq;
