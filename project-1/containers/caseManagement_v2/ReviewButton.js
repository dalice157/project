import React, { Component } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import {
  Modal, Select, Rate, message
} from 'antd';
import { dateFormat } from '../../config/constant';
import { getTitleList, getReview, sendAskReview } from '../../actions/gigManage';
import Button from '../../components/ui/button_v2';
import CreateMarkup from '../../components/common_v2/CreateMarkup';
import styles from './ReviewButton.scss';

const { Option } = Select;

class ReviewButton extends Component {
  state = {
    opt: '請選擇',
    visible: false,
    isLoading: false,
  }

  handleInviteEvaluation = () => {
    const { requireReviewDate } = this.props.reviewDateObj;
    const isToday = dayjs().format(dateFormat) == dayjs(requireReviewDate).format(dateFormat);
    isToday ? (
      message.warning('今日已邀請過，無法再次邀請。')
    ) : (
      this.props.getTitleList().then(() => {
        this.setState({
          visible: true,
        });
      })
    );
  }

  handleOk = () => {
    const {
      demandId, demanderId, currentPage, dateOpt
    } = this.props.reviewDateObj;
    const { onReloadList } = this.props;
    const { opt } = this.state;
    const isContact = currentPage === 'contact' ? 'getContactList' : 'dealMetaList';
    console.log('onReloadList:', onReloadList);
    this.setState({ isLoading: true }, () => {
      this.props.sendAskReview(demandId, demanderId, isContact, opt).then(() => {
        this.setState({ isLoading: false, opt: '請選擇' });
        this.handleCancel();
        onReloadList('', dateOpt);
      });
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleChange =(val) => {
    console.log(`selected ${val}`);
    this.setState({
      opt: val
    });
  }

  handleCheckEvaluation = async () => {
    const { demandId } = this.props.reviewDateObj;
    const result = await this.props.getReview(demandId);
    if (result?.payload?.gigTitle) {
      const {
        comment, gigTitle, demanderName, ranking1, ranking2, ranking3
      } = this.props.reviewData;
      Modal.info({
        className: styles.info,
        icon: null,
        title: '案主評價',
        okText: '關閉',
        okType: 'default',
        content: (
          <>
            <h3 className={styles.title}>{this.props.title}</h3>
            <ul className={styles.list}>
              <li>案主：{demanderName}</li>
              <li>評價服務項目：{gigTitle}</li>
            </ul>
            <div className={styles.rate}>
              <div className={styles.item}>
                <span>對方的溝通態度</span>
                <Rate allowHalf disabled value={ranking1 ? Number(ranking1) : 0} />
              </div>
              <div className={styles.item}>
                <span>對方說明清楚程度</span>
                <Rate allowHalf disabled value={ranking2 ? Number(ranking2) : 0} />
              </div>
              <div className={styles.item}>
                <span>整體溝通滿意度</span>
                <Rate allowHalf disabled value={ranking3 ? Number(ranking3) : 0} />
              </div>
            </div>
            <div className={styles.desc}>
              <CreateMarkup text={comment} />
            </div>
          </>
        ),
      });
    }
  }

  render() {
    const { isLoading, opt } = this.state;
    const { titleLists } = this.props;
    const {
      reviewDate, requireReviewDate, cooperatedDate, demandTitle
    } = this.props.reviewDateObj;
    const isDisabled = opt === '請選擇' ? 'disabled' : 'danger';
    return (
      <>
        {
          (cooperatedDate && requireReviewDate === null && reviewDate === null) && <Button type="primary" onClick={this.handleInviteEvaluation} loading={isLoading}>邀請案主評價</Button>
        }
        {
          (cooperatedDate && requireReviewDate && reviewDate === null) && <Button type="primary" onClick={this.handleInviteEvaluation} loading={isLoading}>再次邀請案主評價</Button>
        }
        {
          (reviewDate) && <Button type="primary" onClick={this.handleCheckEvaluation}>查看評價</Button>
        }
        <Modal
          title="邀請案主評價"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <h3 className={styles.title}>{demandTitle}</h3>
          <div className={styles.select}>請選擇對應的服務項目:
            <Select value={this.state.opt} onChange={this.handleChange}>
              <Option value="請選擇">請選擇</Option>
              {
                titleLists.map((list) => {
                  return (<Option key={list.gigId} value={list.gigId}>{list.gigTitle}</Option>);
                })
              }
            </Select>
          </div>
          <br />
          <p>按下「送出」後，將會發送訊息通知案主，請案主協助你累積接案評價。 </p>
          <div className={styles.btnWrap}>
            <Button onClick={this.handleOk} type={isDisabled}>送出</Button>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  titleLists: state.gigManage.titleLists,
  reviewData: state.gigManage.reviewData,
});
const mapDispatchToProps = {
  getTitleList,
  getReview,
  sendAskReview
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewButton);
