import React, { Component } from 'react';
import { uaIsMobile } from 'react-device-detect';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Message from './Message';
import styles from './Message.scss';

const chDateFormat = (getDate) => {
  return getDate.getFullYear() + ' / ' + ('0' + (getDate.getMonth() + 1)).slice(-2) + ' / ' + ('0' + (getDate.getDate())).slice(-2);
};

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.messageRefList = [];
  }

  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    messages: [],
    isLoadingNewMessage: true,
  }

  onUpdateScrollMessage = (event) => {
    this.props.updateScrollMessage(event);
    this.props.handleScrollDownStatus(event);
  }

  componentDidMount() {
    const isMobile = uaIsMobile();
    const isMobileBrowser = isMobile && document.scrollingElement;
    if (isMobileBrowser) {
      addEventListener('scroll', this.onUpdateScrollMessage);
    }
  }

  componentWillUnmount() {
    const isMobile = uaIsMobile();
    const isMobileBrowser = isMobile && document.scrollingElement;
    if (isMobileBrowser) {
      removeEventListener('scroll', this.onUpdateScrollMessage);
    }
  }

  componentDidUpdate = (prevProps) => {
    const isMobile = uaIsMobile();
    if (prevProps.channel !== this.props.channel) {
      let length = this.props.messages.length > 20 ? 21 : this.props.messages.length;
      this.messageRefList = this.messageRefList.slice(0, length);
    }
    const isMobileBrowser = isMobile && document.scrollingElement;
    this.messageRefList = this.messageRefList.filter(messageRef => messageRef && messageRef.message !== null);
    const isUserScrollToTop = isMobileBrowser ? document.scrollingElement.scrollTop < 10 : this.messageRefList.length > 20;
    if (isMobileBrowser && this.props.isUpdatingMessage !== prevProps.isUpdatingMessage) {
      if (this.props.isUpdatingMessage) {
        removeEventListener('scroll', this.onUpdateScrollMessage);
      } else {
        addEventListener('scroll', this.onUpdateScrollMessage);
      }
    }
    if (this.props.isLoadingNewMessage) {
      // 滾輪滾到底
      if (isMobileBrowser) {
        document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
        this.props.updateScrollSize(this.props.messagesListRef.scrollHeight);
      } else {
        this.props.updateScrollSize(this.props.messagesListRef.scrollHeight);
      }
    } else if (isUserScrollToTop) {
      // 使用者往上滾動時觸發
      const increaseLength = this.props.messages.length - prevProps.messages.length;
      const increaseScrollLength = this.messageRefList.slice(0, increaseLength).reduce((sum, messageRef) => {
        if (messageRef.message && messageRef.message.clientHeight) {
          return sum + messageRef.message.clientHeight;
        } else {
          return sum;
        }
      }, 0);
      if (increaseScrollLength > 0) {
        if (isMobileBrowser) {
          document.scrollingElement.scrollTop = 20;
          // this.messagesListRef.scrollTop = 20;
          this.props.updateScrollSize(20);
        } else {
          console.log('increaseScrollLength ', increaseScrollLength);
          // this.messagesListRef.scrollTop = increaseScrollLength;
          this.props.updateScrollSize(increaseScrollLength);
        }
      }
    }
  }

  setMessageRef = (message) => {
    this.messageRefList.push(message);
  }

  render() {
    const {
      setDropdownUnVisible, isLoadingInitialMessages, userDenyNegotiating, roomId, reloadChatMeta, lastReadMessagesIndex, isUploadingFile
    } = this.props;
    const isMobile = uaIsMobile();
    const isStyleMobile = isMobile ? styles.mobile : '';
    const loadingMessageList = [...new Array(5)];
    if (isLoadingInitialMessages) {
      return (
        <div className={`${styles.MessageList} ${styles.MessageLoading} ${isStyleMobile}`} ref={this.props.updateMessagesListRef}>
          {loadingMessageList.map((empty, i) => <div key={i} className={styles.loadingBlock} />)}
        </div>
      );
    } else {
      return (
        <div
          className={`${styles.MessageList} ${isStyleMobile}`}
          ref={this.props.updateMessagesListRef}
          onScroll={this.onUpdateScrollMessage}
        >
          {this.props.messages.map((message) => {
            const tempDate = message.timestamp.toDateString();
            const showDate = this.preDate != tempDate ? chDateFormat(message.timestamp) : null;
            const hasReadMessage = message.index <= lastReadMessagesIndex;
            this.preDate = tempDate;
            return (
              <Message
                key={message.index}
                ref={this.setMessageRef}
                hasReadMessage={hasReadMessage}
                {...{ ...message, ...this.props.chatmetaEvent }}
                showDate={showDate}
                demanderMeta={this.props.demanderMeta}
                selectedDemand={this.props.selectedDemand}
                userPid={this.props.userPid}
                modalCase={this.props.modalCase}
                chatmeta={this.props.chatmeta}
                chatRole={this.props.chatRole}
                topperMeta={this.props.topperMeta}
                gigs={this.props.gigs}
                setDropdownUnVisible={setDropdownUnVisible}
                userDenyNegotiating={userDenyNegotiating}
                roomId={roomId}
                reloadChatMeta={reloadChatMeta}
              />
            );
          })
        }
          { isUploadingFile && (
          <div className={`${styles.uploadFileStatus} ${isStyleMobile}`}>
            <Icon type="loading" />
            <span>上傳檔案中</span>
          </div>
          )}
        </div>
      );
    }
  }
}

export default MessageList;
