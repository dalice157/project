import React from 'react';
import { Icon } from 'antd';
import styles from './InputArea.scss';

const InputArea = ({
  input, onAreaClick, area, areaNo
}) => {
  input.value = {
    area,
    areaNo
  };
  return (
    <div className={styles.county} onClick={onAreaClick}>
      {area || '請選擇地區'}
      <Icon type="down" />
    </div>
  );
};

export default InputArea;
