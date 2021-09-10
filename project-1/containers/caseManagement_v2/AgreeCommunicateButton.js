import React, { Component } from 'react';
import { Modal, } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './AgreeCommunicateButton.scss';
import Button from '../../components/ui/button';

class AgreeCommunicateButton extends Component {
  state = {
    isLoading: false,
    agreeVisible: false,
    forbiddenVisible: false,
  };

  onOpenModal = (demandId, demanderId) => {
    this.setState({ isLoading: true }, async () => {
      const result = await this.props.agreeToCommunicate(demandId, demanderId);
      if (result.payload.success) {
        this.setState({
          isLoading: false,
          agreeVisible: true,
        });
      } else {
        this.setState({
          isLoading: false,
          forbiddenVisible: true,
        });
      }
    });
  };

  onCloseModal = () => {
    this.setState({
      ...this.state,
      agreeVisible: false,
      forbiddenVisible: false,
    });
  };

  goBackToList = () => {
    this.props.onRefreshPage();
    this.setState({
      ...this.state,
      agreeVisible: false,
      forbiddenVisible: false,
    });
  };


  goToChatPage = () => {
    location.href = '/chat';
    // 更新Store，避免回上一頁沒更新資料
    this.props.onRefreshPage();
  };

  goToPublishPage = () => {
    location.href = '/editor';
    // 更新Store，避免回上一頁沒更新資料
    this.props.onRefreshPage();
  }

  onRenderAgreeModal = () => {
    const { agreeVisible } = this.state;
    return (
      <Modal
        title="您已對本邀請案件「同意溝通」"
        visible={agreeVisible}
        onCancel={this.onCloseModal}
        footer={null}
      >
        <div className={styles.wrap}>
          <p>系統已同步通知案主，您對本案有興趣溝通！</p>
          <p>您可點「前往聊天室」將立即開啟與案主之聊天室，直接留訊與案主溝通。</p>
          <p>或卻先關閉此視窗，回管理中心繼續查看其他案件狀況。</p>
          <div className={styles.btnWrap}>
            <Button onClick={this.goBackToList}>回管理中心</Button>
            <Button onClick={this.goToChatPage} type="primary">前往聊天室</Button>
          </div>
        </div>
      </Modal>
    );
  }

  onRenderForbiddenModal = () => {
    const { forbiddenVisible } = this.state;
    return (
      <Modal
        title="很抱歉，您目前無法回報！！"
        visible={forbiddenVisible}
        onCancel={this.onCloseModal}
        footer={null}
      >
        <div className={styles.wrap}>
          <p>您已取消刊登接案服務，若您要回報，請重新刊登發佈您的接案服務，才可繼續累積合作/評價。 </p>
          <p>可點選【立即刊登】前往編輯品牌發佈 </p>
          <p>或點選【離開】即關閉不回報。 </p>
          <div className={styles.btnWrap}>
            <Button onClick={this.onCloseModal}>離開</Button>
            <Button onClick={this.goToPublishPage} type="primary">立即刊登</Button>
          </div>
        </div>
      </Modal>
    );
  }

  render() {
    const { isLoading } = this.state;
    const { demandId, demanderId } = this.props;
    return (
      <>
        <Button onClick={() => this.onOpenModal(demandId, demanderId)} type="primary" loading={isLoading}>同意溝通</Button>
        {this.onRenderAgreeModal()}
        {this.onRenderForbiddenModal()}
      </>
    );
  }
}


export default withRouter(AgreeCommunicateButton);
