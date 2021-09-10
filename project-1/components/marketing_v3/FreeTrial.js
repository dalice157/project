import React, { Component } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import decoLeft from '../../img/common_v2/blue-deco-left.svg';
import decoRight from '../../img/common_v2/blue-deco-right.svg';
import checkV from '../../img/common_v2/icon-arrow.svg';
import lamps from '../../img/join_v3/banner-2-lamps.svg';
import light from '../../img/join_v3/banner-2-light.png';
import man from '../../img/join_v3/man-left.png';
import woman from '../../img/join_v3/woman-right.png';
import iconPeople1 from '../../img/common_v2/icon-payment-3.svg';
import iconPeople2 from '../../img/common_v2/icon-payment-1.svg';
import iconPeople3 from '../../img/common_v2/icon-payment-2.svg';
import BeTopperButton from '../../containers/common_v2/BeTopperButton';
import styles from './FreeTrial.scss';

class FreeTrial extends Component {
  render() {
    const isActiveManGif = this.props.isShow ? '' : styles.active;
    const isActiveWomanGif = this.props.isShow ? '' : styles.active;
    const isLightShow = this.props.isShow ? styles.active : '';
    return (
      <>
        <BrowserView>
          <div className={styles.bg}>
            <div className={styles.wrap}>
              <h2 className={styles.title}>
                <img src={decoLeft} alt="標題" />
                {' '}
                接案方案比較表
                {' '}
                <img src={decoRight} alt="標題" />
              </h2>
              <table className={styles.table}>
                <tr>
                  <th />
                  <th>
                    <img className={styles.icon} src={iconPeople1} alt="體驗型" />
                    體驗型
                  </th>
                  <th>
                    <img className={styles.icon} src={iconPeople2} alt="超值型" />
                    超值型
                  </th>
                  <th>
                    <img className={styles.icon} src={iconPeople3} alt="無限型" />
                    無限型
                  </th>
                </tr>
                <tr className={styles.tr}>
                  <td>適合類型</td>
                  <td>適合新手入門</td>
                  <td>適合家教、小型外包接案</td>
                  <td>適合全類型外包接案</td>
                </tr>
                <tr className={styles.tr}>
                  <td>個人檔案刊登</td>
                  <td><img src={checkV} alt="ok" /></td>
                  <td><img src={checkV} alt="ok" /></td>
                  <td><img src={checkV} alt="ok" /></td>
                </tr>
                <tr className={styles.tr}>
                  <td>案件配對信</td>
                  <td><img src={checkV} alt="ok" /></td>
                  <td><img src={checkV} alt="ok" /></td>
                  <td><img src={checkV} alt="ok" /></td>
                </tr>
                <tr className={styles.tr}>
                  <td>案主邀請提案</td>
                  <td><img src={checkV} alt="ok" /></td>
                  <td><img src={checkV} alt="ok" /></td>
                  <td><img src={checkV} alt="ok" /></td>
                </tr>
                <tr className={styles.tr}>
                  <td>可應徵/查看案件類型</td>
                  <td>最高預算5,000元以下 與 時薪案件</td>
                  <td>最高預算5,000元以下 與 時薪案件</td>
                  <td>不限類型</td>
                </tr>
                <tr className={styles.tr}>
                  <td>可查看案件聯絡資訊次數</td>
                  <td>2次 / 每周</td>
                  <td>不限次數</td>
                  <td>不限次數</td>
                </tr>
                <tr className={styles.tr}>
                  <td>費用 / 使用天數</td>
                  <td>免費 / 30 天</td>
                  <td>399 元 / 60 天</td>
                  <td>1,980元 / 60 天</td>
                </tr>
                <tr className={styles.tr}>
                  <td>特別說明</td>
                  <td>開放首次使用104高手的新手免費申請</td>
                  <td>續購享9折優惠</td>
                  <td>續購享9折優惠</td>
                </tr>
                <tr className={styles.tr}>
                  <td />
                  <td><BeTopperButton text="立即申請" gtmFrom="join-freeTrial" /></td>
                  <td><BeTopperButton text="立即購買" gtmFrom="join-valuable" /></td>
                  <td><BeTopperButton text="立即購買" gtmFrom="join-infinite" /></td>
                </tr>
              </table>
              <div className={styles.lamps}>
                <img src={lamps} alt="電燈" />
              </div>
              <div className={`${styles.light} ${isLightShow}`}>
                <img src={light} alt="燈光" />
              </div>
              <div className={`${styles.leftImg} ${isActiveManGif}`}>
                <img src={man} alt="男左" />
              </div>
              <div className={`${styles.rightImg} ${isActiveWomanGif}`}>
                <img src={woman} alt="女右" />
              </div>
            </div>
          </div>
        </BrowserView>
        <MobileView>
          <div className={`${styles.bg} ${styles.mobile}`}>
            <h2 className={styles.title}>
              <img src={decoLeft} alt="標題" />
              {' '}
              接案方案比較表
              {' '}
              <img src={decoRight} alt="標題" />
            </h2>
            <div className={styles.freeBlock}>
              <header className={`${styles.header} ${styles.bg1}`}>
                <img className={styles.icon} src={iconPeople1} alt="體驗型" />
                體驗型 |
                {' '}
                <span className={styles.narrate}>適合新手入門</span>
              </header>
              <ul className={styles.infoWrap}>
                <li className={styles.array}>
                  <div className={styles.list}>
                    <label>個人檔案刊登</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                  <div className={styles.list}>
                    <label>案件配對信</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                  <div className={styles.list}>
                    <label>案主邀請提案</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                </li>
                <li className={styles.item}>
                  <label>可應徵/查看案件類型</label>
                  <div className={styles.row}>最高預算5,000元以下 與 時薪案件</div>
                </li>
                <li className={styles.item}>
                  <label>可查看案件聯絡資訊次數</label>
                  <div className={styles.row}>2次 / 每周</div>
                </li>
                <li className={styles.item}>
                  <label>費用 / 使用天數</label>
                  <div className={styles.row}>免費 / 30 天</div>
                </li>
                <li className={styles.item}>
                  <label>特別說明</label>
                  <div className={styles.row}>開放首次使用104高手的新手免費申請</div>
                </li>
                <li className={styles.btnWrap}>
                  <BeTopperButton text="立即申請" gtmFrom="join-freeTrial" />
                </li>
              </ul>
            </div>
            <div className={styles.freeBlock}>
              <header className={`${styles.header} ${styles.bg2}`}>
                <img className={styles.icon} src={iconPeople2} alt="超值型" />
                超值型 |
                {' '}
                <span className={styles.narrate}>適合家教、小型外包接案</span>
              </header>
              <ul className={styles.infoWrap}>
                <li className={styles.array}>
                  <div className={styles.list}>
                    <label>個人檔案刊登</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                  <div className={styles.list}>
                    <label>案件配對信</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                  <div className={styles.list}>
                    <label>案主邀請提案</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                </li>
                <li className={styles.item}>
                  <label>可應徵/查看案件類型</label>
                  <div className={styles.row}>最高預算5,000元以下 與 時薪案件</div>
                </li>
                <li className={styles.item}>
                  <label>可查看案件聯絡資訊次數</label>
                  <div className={styles.row}>不限次數</div>
                </li>
                <li className={styles.item}>
                  <label>費用 / 使用天數</label>
                  <div className={styles.row}>399 元 / 60 天</div>
                </li>
                <li className={styles.item}>
                  <label>特別說明</label>
                  <div className={styles.row}>續購享9折優惠</div>
                </li>
                <li className={styles.btnWrap}>
                  <BeTopperButton text="立即購買" gtmFrom="join-valuable" />
                </li>
              </ul>
            </div>
            <div className={styles.freeBlock}>
              <header className={`${styles.header} ${styles.bg3}`}>
                <img className={styles.icon} src={iconPeople3} alt="無限型" />
                無限型 |
                {' '}
                <span className={styles.narrate}>適合全類型外包接案</span>
              </header>
              <ul className={styles.infoWrap}>
                <li className={styles.array}>
                  <div className={styles.list}>
                    <label>個人檔案刊登</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                  <div className={styles.list}>
                    <label>案件配對信</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                  <div className={styles.list}>
                    <label>案主邀請提案</label>
                    <div><img src={checkV} alt="ok" /></div>
                  </div>
                </li>
                <li className={styles.item}>
                  <label>可應徵/查看案件類型</label>
                  <div className={styles.row}>不限類型</div>
                </li>
                <li className={styles.item}>
                  <label>可查看案件聯絡資訊次數</label>
                  <div className={styles.row}>不限次數</div>
                </li>
                <li className={styles.item}>
                  <label>費用 / 使用天數</label>
                  <div className={styles.row}>
                    1,980元 / 60 天
                  </div>
                </li>
                <li className={styles.item}>
                  <label>特別說明</label>
                  <div className={styles.row}>續購享9折優惠</div>
                </li>
                <li className={styles.btnWrap}>
                  <BeTopperButton text="立即購買" gtmFrom="join-infinite" />
                </li>
              </ul>
            </div>
          </div>
        </MobileView>
      </>
    );
  }
}

export default FreeTrial;
