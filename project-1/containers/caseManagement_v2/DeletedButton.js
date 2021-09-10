import React, { Component } from 'react';
import { Modal, message } from 'antd';
import Button from '../../components/ui/button_v2';
import styles from './DeletedButton.scss';

class DeletedButton extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.handleCancel();
    message.success('應徵案件已刪除成功!');
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };


  render() {
    return (
      <>
        <Button onClick={this.showModal}>刪除</Button>
        <Modal
          title="確認刪除此筆紀錄"
          visible={this.state.visible}
          okText="刪除"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p className={styles.text}>刪除後無法回復，確認要刪除嗎？</p>
        </Modal>
      </>
    );
  }
}

export default DeletedButton;
