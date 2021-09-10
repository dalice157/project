import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import styles from './PromptModal.scss';

class PromptModal extends Component {
  state = { visible: false };

  componentDidUpdate(prevProps) {
    if (prevProps.promptVisible !== this.props.promptVisible) {
      this.onCancel();
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  onCancel = () => {
    this.setState({
      visible: false
    });
  }


  render() {
    const { text, children, isLink } = this.props;
    return (
      <>
        {
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        isLink ? <a title={text} onClick={this.showModal} /> : (
          <Button type="primary" onClick={this.showModal}>
            {text}
          </Button>
        )
      }

        <Modal
          title="請注意"
          closable={false}
          visible={this.state.visible}
          footer={null}
        >
          <p className={styles.promptsContent}>3/22(一)起，購買或家教點數轉換『超值型方案 399/60 天』的會員，<b>可應徵案件類型將調整為『5,000 以下 與 時薪案件』</b>，如您在 3/22 前購買，則不受此調整影響。</p>
          <div className={styles.promptsButtonWrap}>
            {children}
          </div>
        </Modal>
      </>
    );
  }
}

export default PromptModal;
