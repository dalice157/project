import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Menu } from 'antd';
import { tabs } from '../../../config/selectData.js';
import './memo.scss';

class MemoTabs extends PureComponent {
  render() {
    const {
      basicId, handleClick, current,
    } = this.props;
    return (
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        {
          tabs.map(tab => (
            <Menu.Item key={tab.key}>
              <Link to={`/member/memo/${tab.key}/${basicId}`}>
                {tab.tab}
              </Link>
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }
}

export default withRouter(MemoTabs);
