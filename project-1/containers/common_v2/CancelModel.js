import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import { MoreVert } from '@material-ui/icons';
import {
  Radio, Input, Checkbox, Modal
} from 'antd';
import { reasonData } from '../../config/selectData';
import { loadUserInfo, getCancel, cancel } from '../../actions/basic';
import CancelFinshModel from '../../components/common_v2/CancelFinshModel';
import styles from './CancelModel.scss';
import PopModal from '../../components/common_v2/PopModal';
import Button from '../../components/ui/button_v2';


const { TextArea } = Input;

/**
 * 取消刊登 Modal
 */
class CancelModel extends Component {
  state = {
    visible: false,
    dropdownVisible: false,
    reasonValue: null,
    checked: true,
    textAreaValue: ''
  }

  componentDidMount() {
    this.props.initUser();
    document.addEventListener('click', () => {
      this.setState({
        dropdownVisible: false
      });
    });
  }

  onOk = (e) => {
    this.onDropdown(e);
    this.onClose();
  }

  onClick = (e) => {
    this.stopPropagation(e);
    this.props.loadGetCancel();
    this.setState({
      visible: true,
    });
  }

  onCancel = () => {
    console.log(`reason=${this.state.textAreaValue}, reasonOpt=${typeof (this.state.reasonValue)}, cancelSubscription=${this.state.checked}`);
    this.props.putCancel(this.state.reasonValue, this.state.textAreaValue, this.state.checked);
    this.onClose();
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  }

  stopPropagation = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }

  onDropdown = (e) => {
    this.stopPropagation(e);
    this.setState({
      dropdownVisible: !this.state.dropdownVisible
    });
  }

  onRadioChange = (e) => {
    this.setState({
      reasonValue: e.target.value,
      textAreaValue: e.target.value === 100 ? '' : reasonData.find(item => item.value === e.target.value).text
    });
  };

  onCheckChange = (e) => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked: e.target.checked,
    });
  };

  onTextAreaChange = ({ target: { value } }) => {
    console.log('value:', value);
    this.setState({
      textAreaValue: this.state.reasonValue === 100 ? value : reasonData.find(item => item.value === value).text
    });
  };

  render() {
    const { type, content } = this.props;
    const {
      pastYear,
      pastMonth,
      dealCount,
      reviewCount,
      reviewAvgScore,
      isViolation,
      isTopperHaveCooperatingDemand,
    } = this.props.getCancel;
    const {
      meta
    } = this.props.user;
    const isPremiumDepositMember = (meta.credit == 1 && meta.deposit == 0);
    const isDepositMoreThanOneYear = pastYear > 0;
    const { reasonValue, textAreaValue, checked } = this.state;
    let popupContent = (
      <Fragment>
        <div className={styles.content}>你的履歷檔案啟用至今約
          {
            pastYear < 1 && (
              <Fragment><span className={styles.num}>{pastYear}</span> 年</Fragment>
            )
          }
          <span className={styles.num}>{pastMonth}</span> 個月
          {
            isPremiumDepositMember || isDepositMoreThanOneYear
              ? '，無違規事證，且目前無押金。'
              : '，且無違規事證。'
          }
          {
            dealCount > 0 && <Fragment><br />累計合作數共 <span className={styles.num}>{dealCount}</span> 個<br /></Fragment>
          }
          {
            reviewCount > 0 && <Fragment>相關服務評價共 <span className={styles.num}>{reviewCount}</span> 個<br /></Fragment>
          }
          {
            reviewAvgScore > 0 && <Fragment>評價平均星數為 <span className={styles.num}>{reviewAvgScore}</span><br /></Fragment>
          }
          <br />
          {
            isPremiumDepositMember || isDepositMoreThanOneYear
              ? '取消刊登後，未來若要重新刊登，必需支付NT$ 1000元押金。確定要現在取消刊登，停止接案嗎？'
              : '押金刊登滿半年且無違規被檢舉事項，系統即會自動返選押金，現在取消有點可惜，確定現在要取消刊登嗎？'
          }
        </div>
        <h3 className={styles.cancelReason}>請選擇取消刊登原因：</h3>
        <Radio.Group onChange={this.onRadioChange} value={reasonValue}>
          {
            reasonData.map((choose) => {
              return (
                <Radio key={choose.value} className={styles.radio} value={choose.value}>
                  {choose.text}
                </Radio>
              );
            })
          }
        </Radio.Group>
        {reasonValue === 100 && (
        <TextArea
          placeholder="請填寫取消原因"
          className={styles.answer}
          rows={4}
          value={textAreaValue}
          onChange={this.onTextAreaChange}
        />
        )}
        <Checkbox
          className={styles.checkbox}
          checked={checked}
          onChange={this.onCheckChange}
        >
          同時取消配對信發送
        </Checkbox>
        <div className={styles.btnWrap}>
          <Button onClick={this.onOk}>繼續刊登</Button>
          {
            (reasonValue === null || (reasonValue === 100 && textAreaValue === '')) ? (
              <Button type="disabled">確認取消刊登</Button>
            ) : (
              <CancelFinshModel
                onDropdown={this.onDropdown}
                onPrevClose={this.onCancel}
                isPremiumDepositMember={isPremiumDepositMember}
                isDepositMoreThanOneYear={isDepositMoreThanOneYear}
              />
            )
          }
        </div>
      </Fragment>
    );

    if (isViolation === 'true') {
      popupContent = (
        <div className={styles.content}>
          你有違規被檢舉記錄，未查核確認前，無法取消刊登品牌頁。
          <br />
          如有疑問，請洽客服 (02)2912-6104 #8658
        </div>
      );
    } else if (isTopperHaveCooperatingDemand === 'true') {
      popupContent = (
        <div className={styles.content}>
          合作中的案件尚未結案，不可取消刊登品牌頁。
        </div>
      );
    }
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';

    if (type === 'button') {
      return (
        <div className={styles.wrap}>
          <Button type="normal" onClick={this.onClick}>{content}</Button>
          <Modal
            maskClosable={false}
            visible={this.state.visible}
            onCancel={this.onClose}
            title="取消刊登高手檔案"
            centered={true}
            footer={null}
          >
            {popupContent}
          </Modal>
        </div>
      );
    } else {
      return (
        <div className={styles.wrap}>
          <a onClick={this.onDropdown} href="#">
            <MoreVert />
          </a>
          {
            this.state.dropdownVisible
            && (
              <div onClick={e => this.stopPropagation(e)} className={`${styles.dropdown} ${isMobileStyle}`}>
                <PopModal
                  btnType=""
                  btnText="取消刊登高手檔案"
                  title="取消刊登高手檔案"
                  onClick={this.onClick}
                  onClose={this.onClose}
                  visible={this.state.visible}
                >
                  {popupContent}
                </PopModal>
              </div>
            )
          }
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  userStatus: state.user.status,
  getCancel: state.basic.getCancel,
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  loadGetCancel: getCancel,
  putCancel: cancel,
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelModel);
