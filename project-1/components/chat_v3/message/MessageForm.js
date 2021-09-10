import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import PropTypes from 'prop-types';
import {
  Icon, Upload, Input, Menu, Spin
} from 'antd';
import { Add } from '@material-ui/icons';
import Dropdown from '../../ui/dropdown';
import QuickQAModal from '../QuickQAModal';
import styles from './Message.scss';
import Button from '../../ui/button';
import * as chatmetaUtil from '../../../util/chatmetaUtil';
import ScrollDown from './ScrollDown';

const { TextArea } = Input;

class MessageForm extends Component {
  state = {
    value: '',
    visible: false,
  }

  quickdemands = [];

  static propTypes = {
    chatRole: PropTypes.string.isRequired, // 身份
    unInviteDemands: PropTypes.array.isRequired, // 其他案件
    onSendMessage: PropTypes.func.isRequired, // 送出聊天訊息
    chatmetaEvent: PropTypes.object.isRequired, // 快速發問其他需求
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  handleFormSubmit = (event) => {
    if (!event.shiftKey) {
      event.preventDefault();
      this.props.onSendMessage(this.state.value);
      this.setState({ value: '' });
    }
  }

  showModal = () => {
    this.setState({ visible: true, });
  }

  /**
   * 快速發問其他需求
   */
  handleQuickDemandChange = (checkedDeamndIds) => {
    this.quickdemands = checkedDeamndIds;
  };

  handleOk = () => {
    this.setState({ loading: true });

    this.props.chatmetaEvent.onRequestQuickQAModal(this.props.topperMeta.topperId, this.quickdemands).then(() => {
      this.setState({ loading: false, visible: false });
    });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  // 手機版案主可上傳檔案
  DropdownMenu = (buttonType) => {
    const { isUploading, chatmetaEvent, } = this.props;
    const { uploadFile } = chatmetaEvent;
    return (
      <Menu>
        <Menu.Item key="0">
          { isUploading && <Spin className={styles.upload} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} /> }
          {
              !isUploading
              && (
              <Upload
                className={styles.upload}
                accept={chatmetaUtil.UPLOAD_ACCEPT_TYPE}
                beforeUpload={(file) => {
                  uploadFile(file);
                  return false;
                }}
                showUploadList={false}
              >
                <Button type={buttonType.upload}>
                  <Icon type="paper-clip" />
                </Button>
              </Upload>
              )
            }
        </Menu.Item>
        <Menu.Item key="1" className={styles.questionMobile}>
          <Button type={buttonType.ask} onClick={this.showModal}>快速發問其他需求</Button>
        </Menu.Item>
      </Menu>
    );
  };

  renderIconButton = (disableInput, isMobile) => {
    const { chatmetaEvent, chatRole } = this.props;
    const { uploadFile } = chatmetaEvent;
    const buttonType = {
      upload: disableInput ? 'disabled' : '',
      ask: disableInput ? 'disabled' : '',
      edit: disableInput ? 'disabled' : 'danger'
    };

    if (isMobile) {
      if (chatRole === chatmetaUtil.ROLE.DEMANDER) {
        return (
          <div className={styles.bar}>
            <Dropdown overlay={() => this.DropdownMenu(buttonType)} placement="topLeft">
              <a className="ant-dropdown-link" href="#">
                <Add />
              </a>
            </Dropdown>
          </div>
        );
      } else if (chatRole === chatmetaUtil.ROLE.TOPPER) {
        return (
          <div className={styles.bar}>
            <Upload
              className={styles.upload}
              accept={chatmetaUtil.UPLOAD_ACCEPT_TYPE}
              beforeUpload={(file) => {
                uploadFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button type={buttonType.upload}>
                <Icon type="paper-clip" />
              </Button>
            </Upload>
          </div>
        );
      }
    }
  }

  isButtonType = (disableInput, isMobile) => {
    const {
      chatmetaEvent, chatRole, isUploading
    } = this.props;
    const buttonType = {
      upload: disableInput ? 'disabled' : '',
      ask: disableInput ? 'disabled' : '',
      edit: disableInput ? 'disabled' : 'primary'
    };
    const { uploadFile } = chatmetaEvent;

    return (
      isMobile ? (
        <Button type={buttonType.edit} htmlType="submit">
          送出
        </Button>
      ) : (
        <div className={styles.buttonContainer}>
          { isUploading && <Spin className={styles.upload} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} /> }
          {
            !isUploading
            && (
            <Upload
              className={styles.upload}
              accept=".jpeg,.jpg,.png,.gif,.xls,.xlsx,.ppt,.pptx,.doc,.docx"
              beforeUpload={(file) => {
                console.log(file);
                uploadFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button type={buttonType.upload}>
                <Icon type="paper-clip" />
              </Button>
            </Upload>
            )
          }
          { chatRole === chatmetaUtil.ROLE.DEMANDER && <Button type={buttonType.ask} className={styles.question} onClick={this.showModal} href="#">快速發問其他需求</Button> }
          <Button type={buttonType.edit} htmlType="submit">
            送出
          </Button>
        </div>
      )
    );
  }

  render() {
    const { value } = this.state;
    const {
      unInviteDemands,
      addDemand,
      disableForm,
      scrollMessageDown,
      isUserScrollToBottom,
    } = this.props;

    const isMobile = uaIsMobile();
    const isStyleMobile = isMobile ? styles.mobile : '';
    const isRowsMobile = isMobile ? 1 : 6;
    return (
      <>
        <form className={`${styles.MessageForm} ${isStyleMobile}`} onSubmit={this.handleFormSubmit}>
          {
            this.renderIconButton(disableForm, isMobile)
          }
          <TextArea
            rows={isRowsMobile}
            disabled={disableForm}
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.handleFormSubmit}
            placeholder="在此輸入訊息"
            autoSize={{ minRows: isRowsMobile }}
          />
          {this.isButtonType(disableForm, isMobile)}
          <ScrollDown isMobile={isMobile} isUserScrollToBottom={isUserScrollToBottom} scrollMessageDown={scrollMessageDown} />
        </form>
        <QuickQAModal
          title="發送其他案件給高手"
          unInviteDemands={unInviteDemands}
          loading={this.state.loading}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          onQuickDemandChange={this.handleQuickDemandChange}
          addDemand={addDemand}
        />
      </>
    );
  }
}

export default MessageForm;
