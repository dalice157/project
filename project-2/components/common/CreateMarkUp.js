import React, { Fragment } from 'react';
import { replaceCatNo } from '../../util/categoryUtils';
import { isGigId } from '../../util/commonUtil';

const CreateMarkup = ({ text, memoSource }) => {
  const showMemoNo = isGigId(memoSource);
  const memoNo = '【服務編號】'.concat(memoSource);
  const content = text.split('\n').map((textLine, key) => {
    textLine = replaceCatNo(textLine);
    if (textLine.length !== 0) {
      return <Fragment key={ key }>{textLine}<br /></Fragment>;
    } else {
      return <Fragment key={ key } />;
    }
  });
  return (
    <>
      { showMemoNo && memoNo }
      { showMemoNo && <br /> }
      { content }
    </>
  );
};

export default CreateMarkup;
