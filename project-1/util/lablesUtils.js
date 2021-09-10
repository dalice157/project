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

// 取得各項類別
export function getCatTitleListByNo(catNo) {
  if (!catNo) return [];

  if (catNo.includes(',')) {
    const largeCatNo = catNo.split(',')[0].charAt(0).concat('000000');
    return [getCatTitleByNo(largeCatNo)];
  } else {
  // e.g. 1001001
  // 大項: 0 中項: 3 小項: 6
    const largeCatNo = catNo.charAt(0).concat('000000');
    const midCatNo = catNo.substring(0, 4).concat('000');
    if (catNo.charAt(6) !== '0') {
      return [getCatTitleByNo(largeCatNo), getCatTitleByNo(midCatNo), getCatTitleByNo(catNo)];
    } else if (catNo.charAt(3) !== '0') {
      return [getCatTitleByNo(largeCatNo), getCatTitleByNo(midCatNo)];
    } else if (catNo.charAt(0) !== '0') {
      return [getCatTitleByNo(largeCatNo)];
    } else {
      return [];
    }
  }
}

// 藉由編號取得
export function getCatTitleByNo(number) {
  number = typeof number === 'number' ? String(number) : number;
  // bfs
  let categoriesQueue = Array(...labels.treeData);
  while (categoriesQueue.length !== 0) {
    let category = categoriesQueue.pop();
    if (number === category.value) {
      return category.title;
    }
    let childrenOfCategory = category.children === undefined ? null : Array(...category.children);
    if (childrenOfCategory !== null && childrenOfCategory !== undefined) {
      for (let i = 0; i < childrenOfCategory.length; i++) {
        // unshift等同於Queue的push
        categoriesQueue.unshift(childrenOfCategory[i]);
      }
    }
  }
  // default 全部
  return 0;
}

export function getCatSubtreeByNo(number) {
  number = typeof number === 'number' ? String(number) : number;
  let categoriesQueue = Array(...labels.treeData);
  while (categoriesQueue.length !== 0) {
    let category = categoriesQueue.pop();
    if (number === category.value) {
      return category;
    }
    let childrenOfCategory = category.children === undefined ? null : Array(...category.children);
    if (childrenOfCategory !== null && childrenOfCategory !== undefined) {
      for (let i = 0; i < childrenOfCategory.length; i++) {
        categoriesQueue.unshift(childrenOfCategory[i]);
      }
    }
  }
  return {};
}

export function getCatNoByTitle(title) {
  // bfs
  let categoriesQueue = Array(...labels.treeData);
  while (categoriesQueue.length !== 0) {
    let category = categoriesQueue.pop();
    if (title === category.title) {
      return category.key;
    }
    let childrenOfCategory = Array(...category.children);
    if (childrenOfCategory !== null && childrenOfCategory !== undefined) {
      for (let i = 0; i < childrenOfCategory.length; i++) {
        // unshift等同於Queue的push
        categoriesQueue.unshift(childrenOfCategory[i]);
      }
    }
  }
  // default 全部
  return 0;
}

// all: 1000000, mid: 10001000, small: 10001001
export function catsTreeData(catNo) {
  if (!catNo) return labels.treeData;
  if (catNo.toString().length != 7) throw new Error('catNo length not correct');

  let tmp = catNo;
  // const smallLevel = tmp % 1000;
  const midCode = tmp / 1000;
  // const midLevel = midCode % 1000;
  const topLevel = Math.floor(midCode / 1000);


  const topNode = fetchNode(labels.treeData, topLevel + '000000');
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

export function filterValidCats(catNos = []) {
  let validCats = [];

  catNos.forEach((no) => {
    try {
      catsSimpleData(no);
      validCats = [...validCats, no];
    } catch (error) {
      console.warn(`查無服務編號 ${no}`, error);
    }
  });

  return validCats.filter(cats => cats != '');
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
  return arrayData.find(object => object.key == catNo); // 字串比較數字,用二個等號
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
  return catDesc[key] || '';
}

export function isContainTutorCats(cats) {
  let found = false;
  cats.forEach((cat) => {
    if (String(cat).substring(0, 3) == '100') {
      found = true;
    }
  });

  return found;
}
