import React from 'react';

import { Link } from 'react-router-dom';

// import NavBar from '../ui/navBar';

// import Search from './Search';

import styles from './MobileNav.scss';

const MobileNav = ({
  ...props
}) => {
  const { location } = props;

  return (
    <div className={styles.wrap}>
      <ul className={styles.menu}>
        <li className={location.pathname === '/search-tutor' ? styles.active : ''}>
          <Link to="/search-tutor">找老師</Link>
        </li>
        <li className={location.pathname === '/search' ? styles.active : ''}><Link to="/search">找報價</Link></li>
        <li className={location.pathname === '/caseList' ? styles.active : ''}><Link to="/caseList">找案件</Link></li>
      </ul>
    </div>
  );
};

export default MobileNav;
