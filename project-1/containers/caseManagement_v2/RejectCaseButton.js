import React, { Component } from 'react';
import { notification } from 'antd';
import Button from '../../components/ui/button_v2';

class RejectCaseButton extends Component {
  state = {
    isLoading: false,
  };

  onUnableCase = (demandId, demanderId) => {
    this.setState({ isLoading: true }, async () => {
      const result = await this.props.onRejectInviting(demandId, demanderId);
      if (result.payload.success) {
        notification.success({
          duration: 2,
          message: '已回報案主您無法接案',
          description:
          '系統將同步發送你無法接此案件之系統通知給案主。',
        });
      }
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { demandId, demanderId } = this.props;
    const { isLoading } = this.state;
    return (<Button onClick={() => this.onUnableCase(demandId, demanderId)} loading={isLoading}>無法接案</Button>);
  }
}

export default RejectCaseButton;
