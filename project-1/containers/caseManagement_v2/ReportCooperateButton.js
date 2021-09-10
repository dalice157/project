import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, message } from 'antd';
import dayjs from 'dayjs';
import { dateFormat } from '../../config/constant';
import { reportCooperation, confirmCooperation } from '../../actions/gigManage';
import Button from '../../components/ui/button_v2';
import styles from './ReportCooperateButton.scss';

const { confirm } = Modal;
class ReportCooperateButton extends Component {
  state = {
    loadingPublishingReport: false,
    loadingPublishingCheckReport: false,
  };

  onSendReportCooperation = () => {
    const { requestCooperationDateObj, onReloadList } = this.props;
    const {
      demandId, demanderId, currentPage, dateOpt
    } = requestCooperationDateObj;
    const isContact = currentPage === 'contact' ? 'getContactList' : 'dealMetaList';
    this.setState({ loadingPublishingReport: true }, () => {
      this.props.reportCooperation(demandId, demanderId, isContact).then(() => {
        this.setState({ loadingPublishingReport: false });
        onReloadList('', dateOpt);
      });
    });
  }

  onSendConfirmCooperation = () => {
    const { requestCooperationDateObj, onReloadList } = this.props;
    const {
      demandId, demanderId, currentPage, dateOpt
    } = requestCooperationDateObj;
    const isContact = currentPage === 'contact' ? 'getContactList' : 'dealMetaList';
    this.setState({ loadingPublishingCheckReport: true }, () => {
      this.props.confirmCooperation(demandId, demanderId, isContact).then(() => {
        this.setState({ loadingPublishingCheckReport: false });
        onReloadList('', dateOpt);
      });
    });
  }

  handleReturn = () => {
    const { title, partBRequestCooperationDate } = this.props.requestCooperationDateObj;
    const isToday = dayjs().format(dateFormat) == dayjs(partBRequestCooperationDate).format(dateFormat);
    isToday ? (
      message.warning('今日已回報過，無法再次回報。')
    ) : (
      confirm({
        className: styles.info,
        icon: null,
        title: '回報合作',
        okText: '確認',
        cancelText: '取消',
        onOk: () => {
          this.onSendReportCooperation();
        },
        content: (
          <>
            <p>您確認要向案主回報合作 <b>{title}</b> 嗎?</p><br />
            <p>按下「確認」後，將會通知案主你的回報，請案主確認合作! 以利後續溝通並累積您的成交評價！ </p>
          </>
        ),
      })
    );
  }

  handleConfirm = () => {
    const { demanderName, title } = this.props.requestCooperationDateObj;
    confirm({
      className: styles.info,
      icon: null,
      title: '確認合作',
      okText: '送出',
      cancelText: '取消',
      onOk: () => this.onSendConfirmCooperation(),
      content: (
        <>
          <p>案主 <b>{demanderName}</b>  確認與你合作案件 <b>{title}</b></p><br />
          <p>您確認已與案主完成溝通並已確定合作嗎?<br />按下「送出」後，將會通知案主你已確認合作! 以後續溝通及評價！  </p>
        </>
      ),
    });
  }

  render() {
    const { loadingPublishingReport, loadingPublishingCheckReport } = this.state;
    const {
      partARequestCooperationDate, partBRequestCooperationDate, communicateDate, cooperatedDate
    } = this.props.requestCooperationDateObj;
    return (
      <>
        {
          (communicateDate && partARequestCooperationDate === null && partBRequestCooperationDate === null && cooperatedDate === null) && <Button type="primary" onClick={this.handleReturn} loading={loadingPublishingReport}>回報合作</Button>
        }
        {
          (communicateDate && partBRequestCooperationDate && cooperatedDate === null) && <Button type="primary" onClick={this.handleReturn} loading={loadingPublishingReport}>再次回報合作</Button>
        }
        {
          (partARequestCooperationDate && cooperatedDate === null) && <Button type="danger" onClick={this.handleConfirm} loading={loadingPublishingCheckReport}>確認合作</Button>
        }
      </>
    );
  }
}


const mapStateToProps = state => ({
  reportCooperationData: state.gigManage.reportCooperationData,
  confirmCooperationData: state.gigManage.confirmCooperationData,
});
const mapDispatchToProps = {
  reportCooperation,
  confirmCooperation
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportCooperateButton);
