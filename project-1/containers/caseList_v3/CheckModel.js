import React, { Component } from 'react';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/button';
import styles from './CheckModel.scss';

class CheckModel extends Component {
  handleCancel = () => {
    this.props.onClose(true);
  };

  render() {
    const {
      used, capacity, usedCnt, orderType, limitContractCase
    } = this.props.bargainingPower;
    const available = !used && orderType == 1 ? capacity - usedCnt : 0;
    return (
      <Modal
        title="應徵完成"
        visible={this.props.openImModel}
        maskClosable={false}
        onCancel={this.handleCancel}
        centered={true}
        footer={null}
      >
        <div className={styles.wrap}>
          <div className={styles.content}>
            已將您的應徵資料發送通知信給案主，待案主同意與您溝通後，即可進入使用聊天室！
          </div>
          {
            used && (
              <div className={styles.content}>
                本案件您已取得主動聯絡權。查閱聯絡資料即可查看聯絡資訊。
              </div>
            )
          }
          {
            !used && ((orderType == 3 && !limitContractCase) || orderType == 4) && (
              <div className={styles.content}>
                <br />或<br />
                若您想主動聯絡案件聯絡人，可以點【查閱聯絡資料】顯示案件聯絡人聯絡資訊。
                <br />
                或
                <br />
                點選【開啟聊天室】，主動於聊天室留言給案主，亦可於聊天室查看聯絡人資料。
              </div>
            )
          }
          {
            !used && available > 0 && orderType == 1 && (
              <div className={styles.content}>
                <br />或<br />
                你可以 選擇「開啟聊天室」或「查閱聯絡資料」任一項立即聯絡案主(本週尚餘 <span className={`${styles.frequency} ${styles.remain}`}>{available}</span> 次機會.)
                <div className={`${styles.warning}`}>
                  會員獨享好康：<br />體驗期間、免費提供您每週<span className={styles.frequency}>{capacity}</span>次機會，可以立即聯絡案主。
                </div>
              </div>
            )
          }
          {
            !used && available < 1 && orderType == 1 && (
              <div className={styles.content}>
                <br />或<br />
                你可以 選擇「開啟聊天室」或「查閱聯絡資料」任一項立即聯絡案主(本週尚餘<span className={`${styles.frequency} ${styles.remain}`}>{available}</span> 次機會.)<br />
                若您對本案件有興趣想取得聯絡權，可於下週再次應徵後取得。
                <div className={`${styles.warning}`}>
                  會員獨享好康：<br />體驗期間、免費提供您每週<span className={styles.frequency}>{capacity}</span>次機會，可以立即聯絡案主。
                  <Link to="/publication-plan"><Button>想要更多機會</Button></Link>
                </div>
              </div>
            )
          }
          <div className={styles.btnWrap}>
            {
              used && <Button onClick={this.props.handleChatMeta}>開啟聊天室</Button>
            }
            {
              !used && ((orderType == 1 && available > 0) || (orderType == 3 && !limitContractCase) || orderType == 4) && <Button onClick={this.props.handleOk}>開啟聊天室</Button>
            }
            {
              !used && ((orderType == 1 && available > 0) || (orderType == 3 && !limitContractCase) || orderType == 4) && (
                <Button type="primary" onClick={this.props.handleProfile}>查閱聯絡資料</Button>
              )
            }
          </div>
        </div>
      </Modal>
    );
  }
}

export default CheckModel;
