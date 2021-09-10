import React from 'react';
import { Modal } from 'antd';
import styles from './Modal.scss';

const Modals = ({
  title, visible, onOk, onCancel, footer, children
}) => (
  <Modal
    width="600px"
    title={title}
    visible={visible}
    onOk={onOk}
    onCancel={onCancel}
    footer={footer}
    className={styles.modal}
    maskClosable={false}
  >
    {children}
  </Modal>
);

export default Modals;
