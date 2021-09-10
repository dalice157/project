import React, { Component } from 'react';
import { Select } from 'antd';
import { RowLayout } from './Row';
import { experienceData } from '../../config/selectData.js';
import styles from './ServiceItems.scss';
import Button from '../ui/button';

const Option = Select.Option;
/**
 * 服務經驗
 */
class Experience extends Component {
  state = {
    experience: '無經驗',
  }

  componentDidMount() {
    const { exp } = this.props;
    experienceData.find(expData => expData.id == exp) && this.setState({
      experience: exp,
    });
  }

  handleHide = () => {
    const { experience } = this.state;
    const { id, onExperienceChange, handleExperienceClose } = this.props;
    onExperienceChange({ id: id, experience: experience });
    handleExperienceClose();
  }

  renderContent = () => (
    <div className={styles.popover}>
      <Select
        style={{ width: '200px' }}
        defaultValue={experienceData[1].id}
        onChange={this.onSelectExpChange}
        value={this.state.experience}
      >
        {this.renderOptions}
      </Select>
      <div className={`${styles.btnWrap} ${styles.noValidate}`}>
        <Button onClick={this.handleHide} type="primary">
          確認
        </Button>
      </div>
    </div>
  );

  onSelectExpChange = (value) => {
    const { id, onExperienceChange, } = this.props;
    onExperienceChange({ id: id, experience: value });
    this.setState({ experience: value });
  };

  renderOptions = (
    experienceData.map(item => (
      <Option key={item.id} value={item.id}>{item.title}</Option>
    ))
  );

  render() {
    const { isExperienceOpen, } = this.props;
    const { title, exp, handleExperienceOpen } = this.props;
    const experienceObj = experienceData.find(expData => expData.id == exp);

    return (
      <RowLayout
        title={title}
        content={this.renderContent()}
        isOpen={isExperienceOpen}
      >
        <span onClick={handleExperienceOpen} className={styles.data}>
          { experienceObj ? experienceObj.title : <span className={styles.warning}>未設定</span> }
        </span>
      </RowLayout>
    );
  }
}
export default Experience;
