import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button, Modal, Select, message
} from 'antd';
import {
  getTitleList, sendTitleInfo, sendReportCooperate, sendConfirmCooperate
} from '../../../actions/member.js';
import './gig.scss';

const { Option } = Select;


class GigConfirmBtn extends Component {
  state = {
    visible: false,
    opt: ''
  };

  showModal = () => {
    const { data } = this.props;
    this.setState({
      visible: true,
    });
    this.props.getTitleList(data.topperId).then(() => {
      this.setState({
        opt: this.props.titleList[0].gigId
      });
    });
  };

  handleChange = (val) => {
    console.log(`selected ${val}`);
    this.setState({
      opt: val
    });
  }

  onUnConfirm = () => {
    const { data } = this.props;
    this.props.sendConfirmCooperate(data.demandId, data.demanderId, data.topperId).then(() => {
      window.location.reload();
    });
    message.success('已完成確認合作');
  }

  onAcceptConfirm = () => { // 邀請評價
    const { data } = this.props;
    const { opt } = this.state;
    this.props.sendTitleInfo(data.demandId, data.demanderId, opt, data.topperId).then(() => {
      this.setState({
        visible: false,
      });
      window.location.reload();
    });
  }

  onReportCooperate = () => { // 回報合作
    const { data } = this.props;
    this.props.sendReportCooperate(data.demandId, data.demanderId, data.topperId).then(() => {
      window.location.reload();
    });
    message.success('已發送回報合作通知給案件聯絡人');
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const clickObj = [
      {
        text: '確認合作',
        onClick: this.onUnConfirm
      },
      {
        text: '再次回報合作',
        onClick: this.onReportCooperate
      },
      {
        text: '邀請評價',
        onClick: this.onAcceptConfirm
      },
      {
        text: '回報合作',
        onClick: this.onReportCooperate
      },
    ];
    const { statusType, titleList, data } = this.props;
    const isDisabled = statusType === 2.5 || data.rejectDate;
    const statusTypeChange = statusType === 2.5 ? 2 : statusType;
    const chooseClick = statusTypeChange === 2 ? this.showModal : clickObj[statusTypeChange].onClick;
    return (
      <>
        <Button type="primary" disabled={ isDisabled } onClick={ chooseClick }>{clickObj[statusTypeChange].text}</Button>
        <Modal
          title={ null }
          visible={ this.state.visible }
          onCancel={ this.handleCancel }
          footer={ null }
        >
          <p className="modalTitle">請選擇欲累積評價的服務：</p>
          {
            titleList.length > 0 && (
            <Select className="modalSelect" defaultValue={ titleList[0].gigId } onChange={ this.handleChange }>
              {
              titleList.map(opt => (
                <Option key={ opt.gigId } value={ opt.gigId }>{opt.gigTitle}</Option>
              ))
            }
            </Select>
            )
          }
          <div className="modalBtn">
            <Button type="primary" onClick={ clickObj[2].onClick }>送出</Button>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    titleList: state.member.titleList,
  };
};

const mapDispatchToProps = {
  getTitleList,
  sendTitleInfo,
  sendReportCooperate,
  sendConfirmCooperate,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigConfirmBtn);
