import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
import styles from './Modal.scss';

class Modal extends Component {
  render() {
    const {
      title, desc, onOk, buttonText, visible
    } = this.props;
    return (
      <Fragment>
        {visible
          ? (
            <div className={styles.modal}>
              <div className={styles.innerModal}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.desc}>{desc}</p>
                <Button className={styles.button} type="primary" onClick={onOk}>{buttonText}</Button>
              </div>
            </div>
          ) : <></>
        }
      </Fragment>
    );
  }
}
export default Modal;
