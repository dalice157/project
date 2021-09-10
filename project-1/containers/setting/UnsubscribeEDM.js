import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import { uaIsMobile } from 'react-device-detect';
import styles from './UnsubscribeEDM.scss';
import unsubscribeImg from '../../img/edm/unsubscribe.png';
import { onUnSubscribe, onCheckSubscribe } from '../../actions/common';
import Modal from './Modal.js';


class UnsubscribeEDM extends Component {
  state = {
    keepSubscribe: false,
    modalDesc: '已取消訂閱最新案件報',
    buttonText: '前往首頁',
    onUserCheck: () => this.props.history.push('/')
  };

  onUnsubscribe = () => {
    const payload = this.props.location.query.payload || '';
    this.props.onUnSubscribe(payload);
  }

  onKeepSubscribe = (isMobile) => {
    if (this.props.unsubscribeStatus) {
      // 已訂閱的狀況
      this.setState({
        ...this.state,
        keepSubscribe: true,
        modalDesc: '已保留訂閱最新案件報'
      });
    } else {
      // 使用者已取消訂閱的狀況
      this.setState({
        ...this.state,
        keepSubscribe: true,
        modalDesc: '目前未訂閱電子報，如要訂閱請前往設定頁重新訂閱',
        buttonText: '前往設定頁',
        onUserCheck: isMobile ? () => this.props.history.push('/setting') : () => this.props.history.push('/settingEdm')
      });
    }
  }

  componentDidMount() {
    const payload = this.props.location.query.payload || '';
    if (payload === '') {
      message.error('請由電子報取消訂閱連結進入');
      this.props.history.push('/');
    }
    this.props.onCheckSubscribe(payload);
  }

  render() {
    const isMobile = uaIsMobile();
    return (
      <Fragment>
        <div className={styles.wrap}>
          <img className={styles.img} src={unsubscribeImg} alt="" />
          <p className={styles.content}>確定取消訂閱『最新案件配對信』？</p>
          <div className={styles.buttonList}>
            <Button type="default" onClick={() => this.onKeepSubscribe(isMobile)}>否</Button>
            <Button type="ghost" onClick={() => this.onUnsubscribe()}>是的，我要取消</Button>
          </div>
        </div>
        <Modal
          desc={this.state.modalDesc}
          buttonText={this.state.buttonText}
          onOk={this.state.onUserCheck}
          visible={this.state.keepSubscribe || this.props.unsubscribe}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  unsubscribe: state.common.unsubscribe,
  unsubscribeStatus: state.common.unsubscribeStatus
});

const mapDispatchToProps = {
  onUnSubscribe,
  onCheckSubscribe,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UnsubscribeEDM));
