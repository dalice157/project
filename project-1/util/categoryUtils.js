
// all: 6001000000, mid: 6001001000, small: 6001001001
export function catsTreeData(catData, catNo) {
  if (!catNo) return catData;
  if (catNo.toString().length != 10) throw new Error('catNo length not correct');

  const midCode = Math.floor(catNo / 1000);
  const topLevel = Math.floor(midCode / 100);
  const topNode = fetchNode(catData, `${topLevel}00000`);

  return topNode;
}

export function catSearch(catData, catNo) {
  const index = catData.findIndex(cat => cat.no == catNo);
  const midCode = Math.floor(catNo / 1000);
  const topLevel = Math.floor(midCode / 100);
  const mid = catData.find(cat => cat.no == `${midCode}000`);
  const top = catData.find(cat => cat.no == `${topLevel}00000`);

  if (index > -1) {
    const { des, no } = catData.find(cat => cat.no == catNo);
    return { des, no };
  } else if (top && top.n) {
    return catSearch(top.n, catNo);
  } else if (mid && mid.n) {
    return catSearch(mid.n, catNo);
  }
  throw Error(`查無資料, no: ${catNo}`);
}

export function filterValidCategory(catData, catNos = []) {
  let validCats = [];

  catNos.forEach((no) => {
    try {
      catSearch(catData, no);
      validCats = [...validCats, no];
    } catch (error) {
      console.warn(`查無編號 ${no}`, error);
    }
  });

  return validCats;
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
    }
    return item;
  });
  return ret;
}

function fetchNode(arrayData, catNo) {
  return arrayData.find(object => object.no == catNo); // 字串比較數字,用二個等號
}
