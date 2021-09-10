import React, { Component, Fragment } from 'react';
import { Checkbox } from 'antd';
import { RowLayout } from './Row';
import { methodData as _methodData, toOptions } from '../../config/selectData.js';
import styles from './ServiceItems.scss';
import Button from '../ui/button';

const CheckboxGroup = Checkbox.Group;

const methodData = toOptions(_methodData);

// console.log('methodData', methodData);

/**
 * 服務方式
 */
class Method extends Component {
  state = {
    onsiteOpts: [],
  }

  componentDidMount() {
    const { onsiteOpts } = this.props;
    this.setState({
      onsiteOpts: onsiteOpts,
    });
  }

  renderContent = () => {
    const validateStyle = this.state.onsiteOpts.length == 0 ? styles.open : '';

    return (
      <Fragment>
        <CheckboxGroup
          className={styles.checkbox}
          options={methodData}
          onChange={this.onChange}
          value={this.state.onsiteOpts}
        />
        <div className={`${styles.btnWrap} ${styles.hasValidate}`}>
          <span className={`${styles.validate} ${validateStyle}`}>請選擇服務方式</span>
          <Button onClick={this.handleHide} type="primary">
            確認
          </Button>
        </div>
      </Fragment>
    );
  };

  onChange = (selectedMethods) => {
    const { id, onMethodChange } = this.props;
    onMethodChange({ id: id, onsiteOpts: selectedMethods });
    this.setState({ onsiteOpts: selectedMethods });
  }

  handleHide = () => {
    const { onsiteOpts } = this.state;
    const {
      id, onMethodChange, handleMethodOpen, handleMethodClose,
    } = this.props;
    onMethodChange({ id: id, onsiteOpts: onsiteOpts });

    if (onsiteOpts.length > 0) {
      handleMethodClose();
    } else {
      handleMethodOpen();
    }
  }

  render() {
    const {
      title,
      onsiteOpts,
      isMethodOpen,
      handleMethodOpen,
    } = this.props;
    const methodDescs = methodData
      .filter(method => onsiteOpts
        .includes(method.value))
      .map(method => method.label);
    const method = methodDescs.length === methodData.length
      ? '不拘'
      : methodDescs.length > 0
        ? methodDescs.join('、')
        : <span className={styles.warning}>未設定</span>;

    return (
      <RowLayout
        title={title}
        content={this.renderContent()}
        isOpen={isMethodOpen}
        rowButton={this.handleCheck}
      >
        <span onClick={handleMethodOpen} className={styles.data}>
          {method}
        </span>
      </RowLayout>
    );
  }
}
export default Method;
