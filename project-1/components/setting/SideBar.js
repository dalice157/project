import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import styles from './SideBar.scss';

const { Sider } = Layout;

class SideBar extends Component {
  render() {
    const { sideBarList } = this.props;
    return (
      <Sider breakpoint="lg" collapsedWidth="0">
        {
          sideBarList && (
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[sideBarList[0].id]}>
            {
              sideBarList.map((item) => {
                return (
                  <Menu.Item key={item.id}>
                    <Link className={styles.title} to={item.link}>
                      {item.title}
                    </Link>
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
