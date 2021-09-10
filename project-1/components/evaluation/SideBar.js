import React, { Component } from 'react';
import { Layout, Menu } from 'antd';

import styles from './SideBar.scss';

const { Sider } = Layout;

class SideBar extends Component {
  render() {
    const { sideBarList, handleClick, selectedGig } = this.props;
    return (
      <Sider breakpoint="lg" collapsedWidth="0">
        {
          sideBarList && (
            <Menu theme="dark" mode="inline" selectedKeys={selectedGig || sideBarList[0].gigId}>
              {
                sideBarList.map((gig) => {
                  return (
                    <Menu.Item key={gig.gigId} onClick={() => handleClick(gig.gigId)}>
                      <span className={styles.title}>{gig.gigTitle}</span>
                    </Menu.Item>
                  );
                })
              }
            </Menu>
          )
        }

      </Sider>
    );
  }
}

export default SideBar;
