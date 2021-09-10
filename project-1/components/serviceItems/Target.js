import React, { Component } from 'react';
import { Checkbox } from 'antd';
import { RowLayout } from './Row';
// import { targetData } from './popoverData.js';
import { targetData as _targetData, toOptions } from '../../config/selectData.js';
import styles from './ServiceItems.scss';
import Button from '../ui/button';

const CheckboxGroup = Checkbox.Group;
const targetData = toOptions(_targetData);

/**
 * 服務對象
 */
class Target extends Component {
  state = {
    isOpen: false,
    clientCats: [], // 0, 1, 2, 3, 4, 5
  }

  componentDidMount() {
    const { clientCats } = this.props;
    this.setState({ clientCats: clientCats, });
  }

  renderContent = () => {
    const {
      isTargetRequired
    } = this.props;
    const validateStyle = isTargetRequired && this.state.clientCats.length == 0 ? styles.open : '';

    return (
      <div className={styles.popover}>
        <CheckboxGroup
          className={styles.checkbox}
          options={targetData}
          onChange={this.onChange}
          value={this.state.clientCats}
        />
        <div className={`${styles.btnWrap} ${styles.hasValidate}`}>
          <span className={`${styles.validate} ${validateStyle}`}>請選擇服務對象</span>
          <Button onClick={this.handleHide} type="primary">
            確認
          </Button>
        </div>
      </div>
    );
  };

  onChange = (checkedValues) => {
    const {
      id,
      onTargetChange,
    } = this.props;
    onTargetChange({ id: id, clientCats: checkedValues });
    this.setState({ clientCats: checkedValues, });
  }

  handleHide = () => {
    const { clientCats } = this.state;
    const {
      id,
      onTargetChange,
      isTargetRequired,
      handleTargetOpen,
      handleTargetClose,
    } = this.props;

    if (!isTargetRequired || clientCats.length > 0) {
      onTargetChange({ id: id, clientCats: clientCats });
      handleTargetClose();
    } else {
      handleTargetOpen();
    }
  }

  render() {
    const {
      title,
      clientCats,
      isTargetOpen,
      handleTargetOpen,
      isTargetRequired,
    } = this.props;
    const targetDescs = targetData
      .filter(target => clientCats.includes(target.value))
      .map(target => target.label);
    const target = targetDescs.length === targetData.length
      ? '不拘'
      : targetDescs.join('、');

    return (
      <RowLayout
        title={title}
        content={this.renderContent()}
        isOpen={isTargetOpen}
      >
        <span onClick={handleTargetOpen} className={styles.data}>
          { target || (isTargetRequired ? <span className={styles.warning}>未設定</span> : '未設定') }
        </span>
      </RowLayout>
    );
  }
}
export default Target;
