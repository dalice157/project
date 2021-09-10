import React, { Component, Fragment } from 'react';
import { Modal, Button } from 'antd';
import Avatar from '../ui/avatar';
import styles from './PopModal.scss';

class PopModal extends Component {
  render() {
    const {
      isAvatar,
      btnType,
      btnText,
      title,
      children,
      onClick,
      onClose,
      visible,
      htmlType,
      hideBtn,
      dataGtmProfile,
      dataGtmCase,
      dataGtmMarketing,
      dataGtmJoin,
      dataGtmPlan,
      size,
    } = this.props;
    return (
      <Fragment>
        {
          hideBtn == 'hide' ? (
            <div className={styles.hide}>
              <Button
                htmlType={htmlType}
                onClick={onClick}
                type={btnType}
                size={size}
                dataGtmProfile={dataGtmProfile}
                dataGtmCase={dataGtmCase}
                dataGtmMarketing={dataGtmMarketing}
                dataGtmJoin={dataGtmJoin}
                dataGtmPlan={dataGtmPlan}
              >
                { isAvatar ? <Avatar size={21} /> : '' }
                { btnText }
              </Button>
            </div>
          ) : (
            <Button
              htmlType={htmlType}
              onClick={onClick}
              type={btnType}
              size={size}
              dataGtmProfile={dataGtmProfile}
              dataGtmCase={dataGtmCase}
              dataGtmMarketing={dataGtmMarketing}
              dataGtmJoin={dataGtmJoin}
              dataGtmPlan={dataGtmPlan}
            >
              { isAvatar ? <Avatar size={21} /> : '' }
              { btnText }
            </Button>
          )
        }
        <Modal
          maskClosable={false}
          visible={visible}
          onCancel={onClose}
          title={title}
          className={styles.popModal}
          centered={true}
          footer={null}
          dataGtmCase={dataGtmCase}
          dataGtmJoin={dataGtmJoin}
          dataGtmPlan={dataGtmPlan}
        >
          {children}
        </Modal>
      </Fragment>
    );
  }
}

export default PopModal;
