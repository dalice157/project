import React, { Component } from 'react';
import { Button } from 'antd';
import PopModal from '../../common_v2/PopModal';
import styles from './Modal.scss';

class OkPayModal extends Component {
  state ={
    visible: false
  }

  onClickCloseDemand = (e) => {
    if (this.props.onSubmit(e)) {
      this.setState({
        visible: false,
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  }

  onCloseModal = () => {
    this.props.onClose();
    this.setState({
      visible: false
    });
  }

  onClickCloseModel = () => {
    location.reload();
    this.onClose();
  }

  render() {
    const { isDepositDemand } = this.props;
    return (
      <PopModal
        btnType="primary"
        btnText="確認送出"
        htmlType="submit"
        title="您的需求結案申請已完成"
        onClick={this.onClickCloseDemand}
        onClose={this.onCloseModal} // 重打API更新資訊
        visible={this.state.visible}
      >
        <div className={styles.okPay}>
          <p className={styles.content}> 感謝您的使用，您的案件已完成結案關閉。<br />
            {/* 需判斷此案件是否為押金案件，若沒有押金，不顯示文案 */}
            {isDepositDemand && '**若您有支付押金NT$1000，則將會14個工作天內退刷至原信用卡，因各銀行作業時間不同，敬請注意近二期帳單。'}
          </p>
          <div className={styles.btnWrap}>
            <Button type="primary" onClick={this.onClickCloseModel}>關閉</Button>
          </div>
        </div>
      </PopModal>
    );
  }
}

export default OkPayModal;
