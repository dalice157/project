import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView, uaIsMobile } from 'react-device-detect';
import { Tabs } from 'antd';
import { chkActiveProcess } from '../../actions/common';
import decoLeft from '../../img/common_v2/blue-deco-left.svg';
import decoRight from '../../img/common_v2/blue-deco-right.svg';
import iconPeople1 from '../../img/common_v2/icon-payment-3.svg';
import iconPeople2 from '../../img/common_v2/icon-payment-1.svg';
import iconPeople3 from '../../img/common_v2/icon-payment-2.svg';
import checkV from '../../img/common_v2/icon-arrow.svg';
import BeTopperButton from '../common_v2/BeTopperButton';
import Footer from '../../components/footer_v3';
import styles from './PublicationPlan.scss';
import TerminateModal from '../../components/terminateModal';

const { TabPane } = Tabs;
class PublicationPlan extends PureComponent {
  modalContext = (
    <>
      <p>
        1. 2021年10月1日(五)起，將停止販售 超值型NT$399/60天、無限型NT$1980/60天 等接案方案。<br />
        2. 免費體驗同步停止申請。
      </p>
      <br />
      <p>感謝您的使用與支持，造成您的不便敬請見諒。</p>
    </>
  )

  render() {
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    return (
      <>
        <div className={`${styles.bg} ${isMobileStyle}`}>
          <div className={styles.wrap}>
            <h2 className={styles.title}>
              <img src={decoLeft} alt="標題" />
              接案會員權益比較表
              <img src={decoRight} alt="標題" />
            </h2>
            <BrowserView>
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
                  <td>免費 / 30天</td>
                  <td>
                    NT$399 / 60天
                  </td>
                  <td>
                    NT$1980 / 60天
                  </td>
                </tr>
                <tr className={styles.tr}>
                  <td>特別說明</td>
                  <td>開放首次使用104高手的新手免費申請</td>
                  <td>續購享9折優惠</td>
                  <td>續購享9折優惠</td>
                </tr>
              </table>
            </BrowserView>
            <MobileView>
              <Tabs type="card">
                <TabPane tab="體驗型" key="1">
                  <div className={styles.freeBlock}>
                    <header className={`${styles.header} ${styles.bg1}`}>
                      <img className={styles.icon} src={iconPeople1} alt="體驗型" />
                      體驗型
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
                    </ul>
                  </div>
                </TabPane>
                <TabPane tab="超值型" key="2">
                  <div className={styles.freeBlock}>
                    <header className={`${styles.header} ${styles.bg2}`}>
                      <img className={styles.icon} src={iconPeople2} alt="超值型" />
                      超值型
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
                        <div className={styles.row}>
                          NT$399  / 60 天
                        </div>
                      </li>
                      <li className={styles.item}>
                        <label>特別說明</label>
                        <div className={styles.row}>續購享9折優惠</div>
                      </li>
                    </ul>
                  </div>
                </TabPane>
                <TabPane tab="無限型" key="3">
                  <div className={styles.freeBlock}>
                    <header className={`${styles.header} ${styles.bg3}`}>
                      <img className={styles.icon} src={iconPeople3} alt="無限型" />
                      無限型
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
                        <div className={styles.row}>NT$ 1,980 / 60 天</div>
                      </li>
                      <li className={styles.item}>
                        <label>特別說明</label>
                        <div className={styles.row}>續購享9折優惠</div>
                      </li>
                    </ul>
                  </div>
                </TabPane>
              </Tabs>
            </MobileView>
            {/* <div className={styles.ps}>
              ＊體驗型方案目前已結束申請，未來開放時間敬請留意網站活動公告。
            </div> */}
            <div className={styles.btnWrap}>
              <BeTopperButton text="立即購買" gtmFrom="publish-plan" />
            </div>
          </div>
        </div>
        <Footer memberCheck={this.props.chkActiveProcess} />
        <TerminateModal
          title="104高手方案販售變更通知"
          context={this.modalContext}
        />
      </>
    );
  }
}

const mapDispatchToProps = {
  chkActiveProcess,
};
export default connect(null, mapDispatchToProps)(PublicationPlan);
