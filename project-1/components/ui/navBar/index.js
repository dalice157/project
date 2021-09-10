import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';

import { Menu } from 'antd';

import { catsTreeData } from '../../../util/lablesUtils.js';

import styles from './NavBar.scss';

const treeData = catsTreeData(0);
const { SubMenu } = Menu;

const subMenu = (subData, gtm, type) => {
  const sub = subData ? (
    <ul className={styles.dropdown}>
      {subData.map(item => <li key={item.value}><Link to={`/${type === 1 ? 'caseList' : 'search'}?cats=${item.value}`} data-gtm-nav={gtm}>{item.title}</Link></li>)}
    </ul>
  )
    : null;
  return sub;
};

const mobileSubMenu = (subData, gtm) => {
  const sub = subData ? (
    subData.map(item => (
      <Menu.Item key={item.value} data-gtm-nav={gtm}>
        { item.title }
      </Menu.Item>
    ))
  )
    : null;
  return sub;
};


const NavBar = ({
  type, activeClass, choice, catsValue, onCatsChange, openKeys, onOpenChange
}) => {
  const showBar = activeClass && styles.showBar;
  const selectedKeys = catsValue || [];
  const pathType = type === 1 ? '/caseList' : (type === 2 ? '/search' : '/search-tutor');
  console.log('selectedKeys:', selectedKeys);
  return (
    <Fragment>
      <BrowserView>
        <nav className={`${styles.topMenu} ${showBar}`}>
          <ul className={styles.category}>
            { treeData.map((item) => {
              const ele = (
                <li key={item.value} className={item.value === choice ? styles.active : undefined}>
                  <Link to={`${pathType}?cats=${item.value}`} data-gtm-nav={`Nav-${item.title.replace('/', '')}`}>
                    { item.title }
                  </Link>
                  { subMenu(item.children, `Nav-${item.title.replace('/', '')}`, type) }
                </li>
              );
              return ele;
            }) }
          </ul>
        </nav>
      </BrowserView>
      <MobileView>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={selectedKeys}
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          style={{ height: '100%', borderRight: 0 }}
          className={styles.menu}
          onClick={e => onCatsChange(e, null, pathType)}
        >
          { treeData.map((item) => {
            const ele = (
              <SubMenu
                key={item.value}
                title={item.title}
              >
                { mobileSubMenu(item.children, `Nav-${item.title.replace('/', '')}`) }
              </SubMenu>
            );
            return ele;
          }) }
        </Menu>
      </MobileView>
    </Fragment>
  );
};


export default NavBar;
