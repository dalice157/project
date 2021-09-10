import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

class MemoMenu extends Component {
  render() {
    const { basicId } = this.props;
    return (
      <Menu className="menu" selectedKeys={ ['memo'] } mode="horizontal">
        <Menu.Item key="basic">
          <Link to={ `/member/${basicId}?tabs=basic` }>會員資料
          </Link>
        </Menu.Item>
        <Menu.Item key="gig">
          <Link to={ `/member/${basicId}?tabs=gig` }>接案服務</Link>
        </Menu.Item>
        <Menu.Item key="review">
          <Link to={ `/member/${basicId}?tabs=review` }>服務評價</Link>
        </Menu.Item>
        <Menu.Item key="demand">
          <Link to={ `/member/${basicId}?tabs=demand` }>案件資料</Link>
        </Menu.Item>
        <Menu.Item key="memo">
          客服備註
        </Menu.Item>
        <Menu.Item key="orderRecord">
          <Link to={ `/member/${basicId}?tabs=orderRecord` }>訂單記錄</Link>
        </Menu.Item>
      </Menu>
    );
  }
}


export default MemoMenu;
