import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import { makeUpChatMeta } from '../../actions/cases';

class ChatMetaButton extends Component {
  handleChatMeta = () => {
    const {
      step, demandId, demanderId, chatMetaId
    } = this.props.item;
    if (step === 4 && !chatMetaId) {
      Modal.info({
        content: '案件已結案,因您與此高手皆以電話或e-mail聯絡溝通,無建立聊天室,無法重新建立或開啟聊天室！',
        okText: '確認',
      });
    } else {
      this.props.makeUpChatMeta(demandId).then(() => {
        location.href = `/chat?demanderId=${demanderId}`;
      });
    }
  }


  render() {
    return (
      <Button onClick={this.handleChatMeta}>前往聊天室</Button>
    );
  }
}

const mapDispatchToProps = {
  makeUpChatMeta
};

export default connect(null, mapDispatchToProps)(withRouter(ChatMetaButton));
