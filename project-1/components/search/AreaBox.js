import React from 'react';
import { Icon } from 'antd';

import styles from './Sider.scss';


class AreaBox extends React.Component {
  render() {
    const { areaLabel, onAreaClick } = this.props;
    return (
      <div className={styles.area} onClick={onAreaClick}>
        {areaLabel}
        <Icon type="down" />
      </div>
    );
  }
}

export default AreaBox;
