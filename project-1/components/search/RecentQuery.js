import React from 'react';
import queryString from 'query-string';
import { reactLocalStorage } from '../../util/cookieUtil.js';
import styles from './RecentQuery.scss';

const RecentQuery = ({ type, linkTo, isHome }) => {
  const list = reactLocalStorage.getObject('_recent_' + type, { list: [] }).list;
  const showLists = isHome ? list.slice(0, 3) : list;
  return (
    <>
      {
      list.length > 0 && (
        <ol className={styles.wrap}>
          <li className={styles.title}>最近搜尋條件：</li>
          {
          showLists.map((item, index) => (
            <li className={styles.list} key={type + '_' + index}><a onClick={() => linkTo(`/${type}?${queryString.stringify(item.param)}`)}>{item.tag.join('／')}</a></li>
          ))
        }
        </ol>
      )
    }
    </>
  );
};

export default RecentQuery;
