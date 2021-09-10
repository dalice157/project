import React, { Component } from 'react';
import { Formik } from 'formik';
import { Form, Checkbox, SubmitButton } from 'formik-antd';
import {
  Menu, Badge, Button, Modal
} from 'antd';
import styles from './LeaveChatroomForm.scss';
import Avatar from '../../ui/avatar';
import defaultAvatar from '../../../img/common_v2/avatar-default-square.svg';
// import { DebugFormik } from '../../util/DebugFormik';

class LeaveChatroomForm extends Component {
  onSelectChatroom = (roomId, disabled, isSelected, numOfSelected, setFieldValue) => {
    if (numOfSelected >= 20 && !isSelected) {
      Modal.info({
        title: '最多只能選擇20個聊天室',
        okText: '確認',
      });
    } else if (!disabled) {
      setFieldValue(roomId, !isSelected);
    }
  }

  renderPublishingStatus = (isCommunicationOver, isInviting, publishing, isTopper) => {
    if (isCommunicationOver) {
      return <span className={styles.closed}>　結束溝通</span>;
    } else if (!publishing && isTopper) {
      return <span className={styles.closed}>　未刊登</span>;
    } else if (isInviting) {
      return <span className={styles.inviting}>　邀請中</span>;
    } else {
      return <></>;
    }
  };

  renderForm = ({ values, setFieldValue }) => {
    const {
      list, nextKey, nextPage, backToList, type, isLoadingMoreChat
    } = this.props;
    const isTopper = type === 'topper';
    const numOfSelected = list.reduce((sum, target) => (values[target.roomId] ? sum + 1 : sum), 0);
    const numOfDemander = list.length;
    const numOfTopper = list && list.length ? list.length : 0;
    const moreSign = nextKey ? '+' : '';
    return (
      <>
        <div className={styles.total}>
          {
          isTopper
            ? `共 ${numOfTopper}${moreSign} 位聯絡人`
            : `共 ${numOfDemander}${moreSign} 位案主`
        }
        </div>
        <div className={styles.deleteHeader}>
          <span>聊天室 <span className={styles.numOfSelected}>{numOfSelected}</span> / 20</span>
          <span className={styles.warn}>選擇<b>結束溝通</b>的聊天室，一次最多20個</span>
        </div>
        <Form className={styles.leaveForm}>
          <Menu className={styles.chatList} mode="inline">
            {
            list.map((chatroom) => {
              const isSelected = values[chatroom.roomId];
              const isInviting = chatroom.status === 0;
              const isCommunicationOver = chatroom.status === 2;

              // 案主(高手視角)
              const disabled = !isCommunicationOver;
              return (
                <Menu.Item key={`${chatroom.roomId}`}>
                  <div
                    disabled={disabled}
                    className={`${styles.meta} ${isSelected && styles.active} ${disabled && styles.disabled}`}
                    onClick={() => this.onSelectChatroom(chatroom.roomId, disabled, isSelected, numOfSelected, setFieldValue)}
                  >
                    <Checkbox className={styles.selected} name={chatroom.roomId} disabled={disabled} />
                    {
                      isTopper && (
                        <div className={styles.avatar}>
                          <Badge count={chatroom.totalMessage} overflowCount={10} offset={[5, 10]}>
                            <Avatar size={50} userImg={chatroom.topperImg || defaultAvatar} />
                          </Badge>
                        </div>
                      )
                    }
                    <div className={styles.metaBox}>
                      <div className={styles.nameField}>
                        <span className={styles.name}>
                          {isTopper ? chatroom.topperName : chatroom.demanderName}
                        </span>
                        {this.renderPublishingStatus(isCommunicationOver, isInviting, chatroom.publishing, isTopper)}
                      </div>
                      <span className={styles.item}>
                        { chatroom.demandTitleList.join(' / ') }
                      </span>
                    </div>
                  </div>
                </Menu.Item>
              );
            })
          }
            {nextKey && <div className={styles.moreChat} align="center"><Button type="link" onClick={() => nextPage(nextKey)} loading={isLoadingMoreChat}>更多聊天室</Button></div>}
          </Menu>
          <div className={styles.deleteFooter}>
            <Button onClick={backToList}>回聊天室列表</Button>
            <SubmitButton disabled={!(numOfSelected >= 1 && numOfSelected <= 20)}>退出聊天室</SubmitButton>
          </div>
          {/* <DebugFormik /> */}
        </Form>
      </>
    );
  };

  render() {
    const { list, onSubmitLeaveChatroom } = this.props;
    let initialData = {};
    list.forEach((user) => {
      initialData = {
        ...initialData,
        [user.roomId]: false,
      };
    });
    return (
      <Formik
        initialValues={initialData}
        onSubmit={onSubmitLeaveChatroom}
        render={this.renderForm}
      />
    );
  }
}

export default LeaveChatroomForm;
