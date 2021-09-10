import React, { Fragment } from 'react';
import { Button } from 'antd';

const Default = ({
  data, nextKey, nextPage, pageSize
}) => {
  return (
    <Fragment>
      <span>查詢資料 共 {data && data.length ? data.length : 0}{nextKey && '+'} 筆</span> {nextKey && <Button type="link" onClick={ () => nextPage(nextKey) }>下{pageSize || 50}筆</Button>}
    </Fragment>
  );
};

export default Default;
