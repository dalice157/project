import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import styles from './SideBarMobile.scss';

class SideBar extends Component {
  render() {
    const { sideBarList, basicId } = this.props;
    return (
      <div className={styles.wrap}>
        {
          sideBarList && (
          <Menu mode="inline" defaultSelectedKeys={[sideBarList[0].gigId]}>
            {
              sideBarList.map((gig) => {
                return (
                  <Menu.Item key={gig.gigId}>
                    <Link
                      className={styles.title}
                      to={`/evaluationList?bid=${basicId}&gid=${gig.gigId}&title=${gig.gigTitle}`}
                    >
                      { gig.gigTitle }
                    </Link>
                  </Menu.Item>
                );
              })
            }
          </Menu>
          )
        }
      </div>
    );
  }
}

export default SideBar;
