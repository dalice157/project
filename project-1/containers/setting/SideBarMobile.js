import React, { Component } from 'react';
import { Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import styles from './SideBarMobile.scss';

const sideBarList = [
  // {
  //   id: '1',
  //   title: '個人帳號/公司資料',
  //   link: '#',
  // },
  {
    id: '2',
    title: '訂閱電子報',
    link: '/edmContent',
  },
  // {
  //   id: '3',
  //   title: '設定帳務資料',
  //   link: '#',
  // },
];

class SideBar extends Component {
  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.breadcrumb}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首頁</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              設定
            </Breadcrumb.Item>
          </Breadcrumb>
          <h2>設定</h2>
        </div>
        {
          sideBarList && (
          <Menu theme="dark" mode="inline">
            { sideBarList.map((item) => {
              return (
                <Menu.Item key={item.id}>
                  <a className={styles.title} href={item.link}>
                    { item.title }
                  </a>
                </Menu.Item>
              );
            }) }
          </Menu>
          )
        }
      </div>
    );
  }
}

export default SideBar;
