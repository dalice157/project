import React, { Component } from 'react';
import styles from './CancelFinshModel.scss';
import PopModal from './PopModal';
import Button from '../ui/button';


class CancelFinshModel extends Component {
  state = {
    visibleFinsh: false,
  }

  onClick=() => {
    // this.props.onPrevClose();
    this.setState({
      visibleFinsh: true,
    });
    this.props.onPrevClose();
  }

  onClose = (e) => {
    this.props.onDropdown(e);
    this.setState({
      visibleFinsh: false
    });
  }


  render() {
    const {
      isPremiumDepositMember,
      isDepositMoreThanOneYear,
    } = this.props;

    const premiumMemberDescription = (
      <div>
        申請取消刊登已完成，即刻起系統將停止刊登你的品牌頁。<br /><br />
        感謝使用，期待未來再次刊登！
      </div>
    );

    const normalMemberDescription = (
      <div>
        申請取消刊登已完成，即刻起系統將停止刊登你的品牌頁。若要重新刊登，請再次支付押金。<br /><br />
        我們將會在14個工作天內退還刊登押金 NT$ 1000元。<br />
        退款方式為退刷至原付款之信用卡帳單內，因各銀行退款處理時間不同，敬請注意近兩期帳單。
      </div>
    );

    const cancelledBtnText = isPremiumDepositMember ? '確認取消刊登' : '確認取消刊登退押金';

    return (
      <PopModal
        btnType="primary"
        btnText={cancelledBtnText}
        title="取消刊登完成"
        onClick={this.onClick}
        onClose={this.onClose}
        visible={this.state.visibleFinsh}
      >
        <div className={styles.content}>
          {
            isPremiumDepositMember || isDepositMoreThanOneYear
              ? premiumMemberDescription
              : normalMemberDescription
          }
        </div>
        <div className={styles.btnWrap}>
          <Button href="/">前往首頁</Button>
        </div>
      </PopModal>
    );
  }
}

export default CancelFinshModel;
