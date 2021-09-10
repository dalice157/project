import React, { memo } from 'react';
import { Pagination } from 'antd';
import PagerInfo from '../pagerInfo';

const Paginating = memo((props) => {
  const {
    className, nextKey, nextPage, total, defaultPageSize, ceiling
  } = props;
  const overCeiling = ceiling < total;
  const ctrlTotal = overCeiling ? ceiling : total;
  return (
    <div className={className}>
      <Pagination {...props} total={ctrlTotal} />
      <PagerInfo
        nextKey={nextKey}
        nextPage={nextPage}
        pageSize={total}
        showCeilingPage={overCeiling && ceiling / defaultPageSize}
      />
    </div>
  );
});

export default Paginating;
