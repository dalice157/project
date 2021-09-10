import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  DislikeOutlined,
  FileOutlined,
  PayCircleOutlined,
  PieChartOutlined,
  SettingOutlined,
  SnippetsOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';

import { Menu, Layout } from 'antd';
import './sider.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Default extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };


  render() {
    return (
      <Fragment>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo">
            <span className="logo-img">104</span>
            {!this.state.collapsed && <h1 className="logo-title">高手</h1>}
          </div>
          <Menu theme="dark" defaultSelectedKeys={['sub1']} mode="inline" onClick={this.handleClick}>
            <SubMenu
              key="sub1"
              title={(
                <span>
                  <PieChartOutlined />
                  <span>管理報表</span>
                </span>
              )}
            >
              {/* <Menu.Item key="90">會員統計(Not yet)</Menu.Item>
              <Menu.Item key="91">案件統計(Not yet)</Menu.Item> */}
              <Menu.Item key="92"><Link to="/statistics/marketingSales">行銷業績報表</Link></Menu.Item>
              <Menu.Item key="93"><Link to="/statistics/marketingPlans">行銷付費方案統計表</Link></Menu.Item>
              <Menu.Item key="94"><Link to="/statistics/manage">經營概況報表</Link></Menu.Item>
              <Menu.Item key="95"><Link to="/statistics/sales">經管業績報表</Link></Menu.Item>
              <Menu.Item key="96"><Link to="/statistics/plans">經管付費方案統計表</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={(
                <span>
                  <PayCircleOutlined />
                  <span>訂單管理</span>
                </span>
              )}
            >
              <Menu.Item key="81"><Link to="/deposit/todos">待處理押金退款</Link></Menu.Item>
              <Menu.Item key="82"><Link to="/deposit">押金訂單查詢</Link></Menu.Item>
              <Menu.Item key="83"><Link to="/order/payment">付費訂單查詢</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              title={(
                <span>
                  <DislikeOutlined />
                  <span>檢舉管理</span>
                </span>
              )}
            >
              <Menu.Item key="3"><Link to="/violation/todos">待處理</Link></Menu.Item>
              <Menu.Item key="4"><Link to="/violationSearch">進階查詢</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub4"
              title={(
                <span>
                  <TeamOutlined />
                  <span>會員管理</span>
                </span>
              )}
            >
              <Menu.Item key="6"><Link to="/memberSearch">進階查詢</Link></Menu.Item>
              <Menu.Item key="7"><Link to="/deleteAccountList">刪除通知列表</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub5"
              title={(
                <span>
                  <SnippetsOutlined />
                  <span>案件管理</span>
                </span>
              )}
            >
              <Menu.Item key="8"><Link to="/demandSearch">進階查詢</Link></Menu.Item>
              <Menu.Item key="9"><Link to="/demandVerification">待審—上刊前案件</Link></Menu.Item>
              <Menu.Item key="10"><Link to="/demandChecklist">後審—發佈後案件</Link></Menu.Item>
              <Menu.Item key="11"><Link to="/demandWindow">案件櫥窗</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub6"
              title={(
                <span>
                  <ToolOutlined />
                  <span>其它工具</span>
                </span>
              )}
            >
              {/* <Menu.Item key="11"><Link to="/oldSiteImport">建立預備會員</Link></Menu.Item> */}
              <Menu.Item key="12"><Link to="/activeTopMember">啟用高手產品</Link></Menu.Item>
              <Menu.Item key="13"><Link to="/acManual">AC啟用暨刪除查詢</Link></Menu.Item>
              <Menu.Item key="14"><Link to="/inviteCode">邀請代碼管理</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub7"
              title={(
                <span>
                  <SettingOutlined />
                  <span>設定</span>
                </span>
              )}
            >
              <Menu.Item key="20"><Link to="/assignment">專員分派</Link></Menu.Item>
              <Menu.Item key="21"><Link to="/testAccount">測試帳號設定</Link></Menu.Item>
            </SubMenu>
            <Menu.Item key="9999">
              <FileOutlined />
              <span>下載文件</span>
            </Menu.Item>
          </Menu>
        </Sider>
      </Fragment>
    );
  }
}


export default Default;
