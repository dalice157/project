import React, { Fragment } from 'react';
import { getCatTitleByRegNo } from './lablesUtils';
// all: 6001000000, mid: 6001001000, small: 6001001001
export function catsTreeData(catData, catNo) {
  if (!catNo) return catData;
  if (catNo.toString().length !== 10) throw new Error('catNo length not correct');

  const midCode = Math.floor(catNo / 1000);
  const topLevel = Math.floor(midCode / 100);
  const topNode = fetchNode(catData, topLevel + '00000');

  return topNode;
}
// 搜尋地區用
export function catSearch(catData, catNo) {
  const index = catData.findIndex(cat => cat.no === catNo);
  const midCode = Math.floor(catNo / 1000);
  const topLevel = Math.floor(midCode / 100);
  const mid = catData.find(cat => cat.no === midCode + '000');
  const top = catData.find(cat => cat.no === topLevel + '00000');
  if (index > -1) {
    let { des, no } = catData.find(cat => cat.no === catNo);
    return { des: des, no: no };
  } else if (top && top.n) {
    return catSearch(top.n, catNo);
  } else if (mid && mid.n) {
    return catSearch(mid.n, catNo);
  } else {
    throw Error(`查無資料, no: ${catNo}`);
  }
}

export function catSelectorData(catData, no) {
  const list = catsTreeData(catData, no);

  return markNode(list.n);
}

export function catsSimpleData(catData, no) {
  const list = catsTreeData(catData, no);

  return no ? list : list.map(item => ({ no: item.no, des: item.des }));
}

function markNode(list) {
  const ret = list.map((item) => {
    if (item.n) {
      return {
        ...item,
        n: markNode(item.n),
      };
    } else {
      return item;
    }
  });
  return ret;
}

function fetchNode(arrayData, catNo) {
  return arrayData.find(object => object.no === catNo); // 字串比較數字,用二個等號
}

export function replaceCatNo(content) {
  const catNoExpression = /:\d{7}:/g;
  const replacedContent = content.replaceAll(catNoExpression, getCatTitleByRegNo);
  return content ? replacedContent : content;
}

export function generateMemo(content) {
  const trimmedContent = content.split('\n').map((textLine, key) => {
    textLine = replaceCatNo(textLine);
    if (textLine.length !== 0) {
      return <Fragment key={ key }>{textLine}<br /></Fragment>;
    } else {
      return <Fragment key={ key } />;
    }
  });
  return trimmedContent;
}
