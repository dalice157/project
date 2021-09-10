import labels from '../config/lables-zh_TW.js';

export function getCatChildrenList(largeCat) {
  largeCat = typeof largeCat === 'number' ? String(largeCat) : largeCat;
  let childrenKeyList = [];
  let categoriesQueue = [...catsTreeData(largeCat).children];
  while (categoriesQueue.length !== 0) {
    let category = categoriesQueue.pop();
    childrenKeyList.push(category.key);
    let childrenOfCategory = category.children === undefined ? null : Array(...category.children);
    if (childrenOfCategory !== null && childrenOfCategory !== undefined) {
      for (let i = 0; i < childrenOfCategory.length; i++) {
        categoriesQueue.unshift(childrenOfCategory[i]);
      }
    }
  }
  return childrenKeyList;
}

export function getCategoriesByNo(number) {
  if (number === '0' || number === undefined) {
    return ['全部', '家教技能', '圖像/製圖', '編輯/翻譯', '資訊網路', '行銷/廣告', '影音/活動', '商務支援', '生活相關'];
  }

  // bfs
  let categoriesQueue = Array.apply(null, labels.treeData);
  let categoriesNo = [];
  while (categoriesQueue.length !== 0) {
    let category = categoriesQueue.shift();
    if (number === category.value) {
      let temp = Array.apply(null, category.children);
      for (let i = 0; i < temp.length; i++) {
        categoriesNo.push(temp[i].title);
      }
      return categoriesNo;
    }
    let childrenOfCategory = Array.apply(null, category.children);
    if (childrenOfCategory !== null && childrenOfCategory !== undefined) {
      for (let i = 0; i < childrenOfCategory.length; i++) {
        // unshift等同於Queue的push
        categoriesQueue.unshift(childrenOfCategory[i]);
      }
    }
  }
  return [];
}

export function getCatNoByTitle(title) {
  // bfs
  let categoriesQueue = Array.apply(null, labels.treeData);
  while (categoriesQueue.length !== 0) {
    let category = categoriesQueue.pop();
    if (title === category.title) {
      return category.key;
    }
    let childrenOfCategory = Array.apply(null, category.children);
    if (childrenOfCategory !== null && childrenOfCategory !== undefined) {
      for (let i = 0; i < childrenOfCategory.length; i++) {
        // unshift等同於Queue的push
        categoriesQueue.unshift(childrenOfCategory[i]);
      }
    }
  }
  return title;
}

export function getCatTitleByRegNo(matchCatNo) {
  return getCatTitleByNo(matchCatNo.substring(1, matchCatNo.length - 1));
}

export function getCatTitleByNo(number) {
  // bfs
  let categoriesQueue = Array.apply(null, labels.treeData);
  while (categoriesQueue.length !== 0) {
    let category = categoriesQueue.pop();
    if (number === category.value) {
      return category.title;
    }
    let childrenOfCategory = Array.apply(null, category.children);
    if (childrenOfCategory !== null && childrenOfCategory !== undefined) {
      for (let i = 0; i < childrenOfCategory.length; i++) {
        // unshift等同於Queue的push
        categoriesQueue.unshift(childrenOfCategory[i]);
      }
    }
  }
  return number;
}

// all: 0000000, mid: 10000000, small: 10001000
export function catsTreeData(catNo) {
  if (!catNo) return labels.treeData;
  if (catNo.toString().length !== 7) throw new Error('catNo length not correct');

  let tmp = catNo;
  // const smallLevel = tmp % 1000;
  const midCode = tmp / 1000;
  // const midLevel = midCode % 1000;
  const topLevel = Math.floor(midCode / 1000);

  // console.log('topLevel', topLevel);
  // console.log('midLevel', midLevel);
  const topNode = fetchNode(labels.treeData, topLevel + '000000');
  // console.log('topNode', topNode);
  // if (midLevel) {
  //   const midNode = fetchNode(topNode.children, midCode + '000');
  //   return midNode;
  // } else {
  return topNode;
  // }
}

export function catSelectorData(catNo) {
  const list = catsTreeData(catNo);
  return markNode(list);
}

export function catsSimpleData(catNo) {
  const list = catsTreeData(catNo);
  return catNo ? list : list.map(item => ({ id: item.key, text: item.title }));
}

function flattenDeep(arr1) {
  return arr1.reduce((acc, val) => {
    return val.children
      ? { ...acc, [val.key]: val.title, ...flattenDeep(val.children) }
      : Object.assign(acc, { [val.key]: val.title });
  }, {});
}

const catDesc = flattenDeep(labels.treeData);


export function showCat(key) {
  return catDesc[key];
}

// duplicate
export function findNodeDesc(catNo) {
  return catDesc[catNo];
}

function markNode(list) {
  const ret = list.map((item) => {
    if (item.children) {
      return {
        ...item,
        children: markNode(item.children),
        selectable: false
      };
    } else {
      return item;
    }
  });
  return ret;
}

function fetchNode(arrayData, catNo) {
  // eslint-disable-next-line
    return arrayData.find(object => object.key == catNo); // 字串比較數字,用二個等號
}

export function isContainTutorCats(cats) {
  return cats.some(cat => (String(cat).substring(0, 3) === '100'));
}

/**
 *
 * @param {} type code or title
 * @returns
 */
export function getPrimaryCatCodeList(type) {
  if (type === 'code') {
    return labels.treeData.map(item => item.value);
  } else {
    return labels.treeData.map(item => item.title);
  }
}
