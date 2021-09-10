import React from 'react';
// import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import { showCat } from '../../util/lablesUtils.js';
import styles from './TagCloud.scss';
import { SHOW_KEY } from '../../config/constant.js';

const TagCloud = ({
  pageType = 1, facets, onClick, onTagChange, isCat, ferretOut = {}
}) => {
  let buckets = null;
  const params = Object.keys(ferretOut).filter(key => SHOW_KEY.includes(key));
  const useCat = isCat || params.length === 0;
  if (useCat) {
    buckets = facets && ((facets.cats && facets.cats.buckets) || (facets.demand_cats && facets.demand_cats.buckets));
  } else {
    buckets = facets && facets.cat_tags && facets.cat_tags.buckets;
  }

  const checkCat = (v) => {
    if (useCat && pageType !== 3) {
      return pageType === 1 ? v < 2000000 : v >= 2000000;
    } else {
      return true;
    }
  };
  // console.log('useCat:' + useCat);
  // console.log('buckets:', buckets);
  return (buckets && buckets.length) ? (
    <div className={styles.tagCloud}>
      <h3 className={styles.label}>{useCat ? '熱門類別' : '熱門標籤'}：</h3>
      {
        buckets.map((item) => { return checkCat(item.value) ? <a className={styles.tag} title={useCat ? showCat(item.value) : item.value} key={'tag_' + item.value} onClick={() => { return useCat ? onClick(item.value) : onTagChange(item.value); }}><Tag color="blue">{useCat ? showCat(item.value) : '#' + item.value}</Tag></a> : ''; })
      }
    </div>
  ) : '';
};

export default TagCloud;
