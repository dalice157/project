import React from 'react';
import Button from '../button_v2';

const PagerInfo = ({
  nextKey, nextPage, pageSize, showCeilingPage
}) => {
  // console.log('nextKey:', nextKey);
  return (
    <>
      { nextKey && (
      <Button type="link" onClick={() => nextPage(nextKey)}>下
        { pageSize || 50 }筆
      </Button>
      ) }
      { showCeilingPage && <>僅顯示前{showCeilingPage}頁查詢結果 </>}
    </>
  );
};

export default PagerInfo;
