import React, { Component } from 'react';
import { Button, Modal } from 'antd';

class TerminateModal extends Component {
  state = {
    modalVisible: true,
  }

  onOk = () => {
    window.open('https://blog.top.104.com.tw/notice-of-termination/');
  };

  onCancel = () => {
    this.setState({ modalVisible: false });
  }

  render() {
    const { title, context } = this.props;
    return (
      <>
        <Modal
          title={title}
          visible={this.state.modalVisible}
          footer={[
            <Button key="submit" type="primary" onClick={this.onOk}>了解詳情</Button>,
          ]}
          onCancel={this.onCancel}
        >
          {context}
        </Modal>
      </>
    );
  }
}

export default TerminateModal;
