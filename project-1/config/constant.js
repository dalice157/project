import labels from './lables-zh_TW';
import routePath from './routePath';
import icon1 from '../img/common_v2/icon-payment-3.svg';
import icon2 from '../img/common_v2/icon-payment-1.svg';
import icon3 from '../img/common_v2/icon-payment-2.svg';

export const REJECTOR = {
  demander: 1,
  topper: 2,
};

export const COOPERATE_TYPE = {
  report: 0,
  confirm: 1,
};

export const MAX_LENGTH = {
  title: 20,
  desc: 2000,
  otherContactWay: 2000,
};

export const SHOW_KEY = ['q', 'cats', 'areas', 'clientCats', 'expCat', 'onsiteOpts', 'priceMax', 'priceMin', 'proirityOpts', 'classWay', 'isOnlyMedal'];

export const TUTOR_RECOMMENDATION = {
  cookieStamp: 'tutorSearch',
  tutorNo: labels.treeData[0].value,
  tutorNoList: {
    all: -1,
    tutor: 1,
    cramSchool: 2,
    onlineCourse: 3,
  },
};

// SEO結構化資料處理頁面
export const PAGE = {
  service: routePath.service.split('/')[1],
  profile: routePath.profile.split('/')[1],
  caseInfo: routePath.caseInfo.split('/')[1],
  search: routePath.search.split('/')[1],
  searchTutor: routePath.searchT.split('/')[1],
  caseList: routePath.caseList.split('/')[1],
  root: routePath.root.split('/')[1],
  join: routePath.marketing.split('/')[1],
  evaluation: routePath.evaluation.split('/')[1],
};

// 過濾SEO處理的重複頁面
export const FILTER_PAGE = {
  serviceItems: routePath.serviceItems.split('/')[1],
};

export const dashboardNotify = [{
  id: 1,
  title: '【公告】全新付費方案上線，最低只要399元！立即享有更多接案機會GO >>',
  link: '/publication-plan',
}];


export const acDateFormat = 'YYYY-MM-DD';
export const dateFormat = 'YYYY/MM/DD';

export const depositTypes = {
  orderTX: '支付押金',
  inviteCode: '邀請碼',
  oldSiteVIP: '舊站VIP',
};

export const invoiceTypes = {
  2: '二聯',
  3: '三聯',
};

// 1:限掛、2:限時、3:交給業務、4:電子發票(手機載具)、5:捐贈、6:快遞、7:平信(紙本寄送)、8:開給104、9:上傳金財通(電子發票-會員載具)、0:自然人憑證
export const invoiceHandleTypes = {
  4: '手機條碼載具',
  5: '捐贈發票',
  9: '104會員載具',
};

// [0:尚未刊登][1:體驗方案][2:計次方案(不限金額)][3:超值方案(期間不限次數，5000元以下案件)][4:無限方案(期間不限次數，不限案件金額)][5:到期下刊會員(不限時間，曾有刊登到期下線就算)]
export const paidTypes = {
  freeTrial: 1,
  countable: 2,
  valuable: 3,
  infinite: 4,
  expired: 5,
};

export const paidTable = {
  0: '尚未刊登',
  1: '體驗會員',
  2: '計次會員',
  3: '超值雙月刊會員',
  4: '無限雙月刊會員',
  5: '到期下刊會員',
};

export const paidTableContent = {
  1: '體驗方案',
  2: '計次方案',
  3: '超值雙月刊（60天）',
  4: '無限雙月刊（60天）',
  5: '到期下刊',
};

export const paymentTypes = {
  0: null,
  1: '信用卡',
  3: 'ibon',
  4: '超商臨櫃',
  5: 'ATM',
};

export const bankAccount = '004（臺灣銀行）';

export const productsDesc = {
  freeTrial: '可應徵5,000元以下或時薪案件,每周查閱2次',
  valuable: '無限次 應徵/查閱 5000元以下或時薪案件',
  infinite: '無限次 應徵/查閱 所有案件',
};

export const productsObj = {
  lab: {
    top: {
      MISC2010000034: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '超值雙月刊60天',
        productAmount: 399,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值雙月刊會員',
      },
      MISC2010000036: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '超值季刊90天+送30天',
        productAmount: 699,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000035: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '超值半年刊180天+送60天',
        productAmount: 1299,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000042: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '超值年刊365天',
        productAmount: 1899,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值年刊會員',
      },
      MISC2010000033: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '無限型雙月刊60天',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限雙月刊會員',
      },
      MISC2010000041: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '無限型季刊90天+送30天',
        productAmount: 3160,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000040: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '無限型半年刊180天+送60天',
        productAmount: 5600,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000038: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '無限年刊365天',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限年刊會員',
      },
      MISC2010000037: {
        contentQuantity: 30,
        productUnit: '次',
        productName: '計次型30次',
        productAmount: 2100,
      },
      MISC2010000039: {
        contentQuantity: 1,
        productUnit: '次',
        productName: '計次型贈1次',
        productAmount: 0,
      },
      MISC2010000009: {
        contentQuantity: 0,
        productUnit: '天',
        productName: '無限方案',
        productAmount: '',
        title: '無限型',
        img: icon1,
        description: productsDesc.infinite,
        categoryName: '無限方案',
      },
      MISC2010000043: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '升級無限雙月刊',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '升級無限雙月刊',
      },
      MISC2010000044: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '升級無限年刊',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '升級無限年刊',
      },
    },
    tutor: {
      MISC2010000034: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '超值雙月刊60天',
        productAmount: 399,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值雙月刊會員',
      },
      MISC2010000036: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '超值季刊90天+送30天',
        productAmount: 699,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000035: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '超值半年刊180天+送60天',
        productAmount: 1299,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000042: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '超值年刊365天',
        productAmount: 1899,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值年刊會員',
      },
      MISC2010000033: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '無限型雙月刊60天',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限雙月刊會員',
      },
      MISC2010000041: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '無限型季刊90天+送30天',
        productAmount: 3160,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000040: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '無限型半年刊180天+送60天',
        productAmount: 5600,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000038: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '無限年刊365天',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限年刊會員',
      },
      MISC2010000037: {
        contentQuantity: 30,
        productUnit: '次',
        productName: '計次型30次',
        productAmount: 2100,
      },
      MISC2010000039: {
        contentQuantity: 1,
        productUnit: '次',
        productName: '計次型贈1次',
        productAmount: 0,
      },
    },
    outsource: {
      MISC2010000009: {
        contentQuantity: 0,
        productUnit: '天',
        productName: '無限方案',
        productAmount: '',
        title: '無限型',
        img: icon1,
        description: productsDesc.infinite,
        categoryName: '無限方案',
      },
    },
  },
  stg: {
    top: {
      MISC2010000043: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '超值雙月刊60天',
        productAmount: 399,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值雙月刊會員',
      },
      MISC2010000045: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '超值季刊90天+送30天',
        productAmount: 699,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000044: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '超值半年刊180天+送60天',
        productAmount: 1299,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000046: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '超值年刊365天',
        productAmount: 1899,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值年刊會員',
      },
      MISC2010000041: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '無限型雙月刊60天',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限雙月刊會員',
      },
      MISC2010000047: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '無限型季刊90天+送30天',
        productAmount: 3160,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000049: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '無限型半年刊180天+送60天',
        productAmount: 5600,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000048: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '無限年刊365天',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限年刊會員',
      },
      MISC2010000042: {
        contentQuantity: 30,
        productUnit: '次',
        productName: '計次型30次',
        productAmount: 2100,
      },
      MISC2010000040: {
        contentQuantity: 1,
        productUnit: '次',
        productName: '計次型贈1次',
        productAmount: 0,
      },
      MISC2010000009: {
        contentQuantity: 0,
        productUnit: '天',
        productName: '無限方案',
        productAmount: '',
        title: '無限型',
        img: icon1,
        description: productsDesc.infinite,
        categoryName: '無限方案',
      },
      MISC2010000050: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '升級無限雙月刊',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '升級無限雙月刊',
      },
      MISC2010000051: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '升級無限年刊',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '升級無限年刊',
      },
    },
    tutor: {
      MISC2010000043: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '超值雙月刊60天',
        productAmount: 399,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值雙月刊會員',
      },
      MISC2010000045: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '超值季刊90天+送30天',
        productAmount: 699,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000044: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '超值半年刊180天+送60天',
        productAmount: 1299,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000046: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '超值年刊365天',
        productAmount: 1899,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值年刊會員',
      },
      MISC2010000041: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '無限型雙月刊60天',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限雙月刊會員',
      },
      MISC2010000047: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '無限型季刊90天+送30天',
        productAmount: 3160,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000049: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '無限型半年刊180天+送60天',
        productAmount: 5600,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000048: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '無限年刊365天',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限年刊會員',
      },
      MISC2010000042: {
        contentQuantity: 30,
        productUnit: '次',
        productName: '計次型30次',
        productAmount: 2100,
      },
      MISC2010000040: {
        contentQuantity: 1,
        productUnit: '次',
        productName: '計次型贈1次',
        productAmount: 0,
      },
    },
    outsource: {
      MISC2010000009: {
        contentQuantity: 0,
        productUnit: '天',
        productName: '無限方案',
        productAmount: '',
        title: '無限型',
        img: icon1,
        description: productsDesc.infinite,
        categoryName: '無限方案',
      },
    },
  },
  prod: {
    top: {
      MISC2010000043: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '超值雙月刊60天',
        productAmount: 399,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值雙月刊會員',
      },
      MISC2010000045: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '超值季刊90天+送30天',
        productAmount: 699,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000042: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '超值半年刊180天+送60天',
        productAmount: 1299,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000041: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '超值年刊365天',
        productAmount: 1899,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值年刊會員',
      },
      MISC2010000047: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '無限型雙月刊60天',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限雙月刊會員',
      },
      MISC2010000040: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '無限型季刊90天+送30天',
        productAmount: 3160,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000044: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '無限型半年刊180天+送60天',
        productAmount: 5600,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000046: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '無限年刊365天',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限年刊會員',
      },
      MISC2010000049: {
        contentQuantity: 30,
        productUnit: '次',
        productName: '計次型30次',
        productAmount: 2100,
      },
      MISC2010000048: {
        contentQuantity: 1,
        productUnit: '次',
        productName: '計次型贈1次',
        productAmount: 0,
      },
      MISC2010000009: {
        contentQuantity: 0,
        productUnit: '天',
        productName: '無限方案',
        productAmount: '',
        title: '無限型',
        img: icon1,
        description: productsDesc.infinite,
        categoryName: '無限方案',
      },
      MISC2010000050: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '升級無限雙月刊',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '升級無限雙月刊',
      },
      MISC2010000051: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '升級無限年刊',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '升級無限年刊',
      },
    },
    tutor: {
      MISC2010000043: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '超值雙月刊60天',
        productAmount: 399,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值雙月刊會員',
      },
      MISC2010000045: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '超值季刊90天+送30天',
        productAmount: 699,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000042: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '超值半年刊180天+送60天',
        productAmount: 1299,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
      },
      MISC2010000041: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '超值年刊365天',
        productAmount: 1899,
        title: '超值型',
        img: icon2,
        description: productsDesc.valuable,
        categoryName: '超值年刊會員',
      },
      MISC2010000047: {
        contentQuantity: 60,
        productUnit: '天',
        productName: '無限型雙月刊60天',
        productAmount: 1980,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限雙月刊會員',
      },
      MISC2010000040: {
        contentQuantity: 120,
        productUnit: '天',
        productName: '無限型季刊90天+送30天',
        productAmount: 3160,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000044: {
        contentQuantity: 240,
        productUnit: '天',
        productName: '無限型半年刊180天+送60天',
        productAmount: 5600,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
      },
      MISC2010000046: {
        contentQuantity: 365,
        productUnit: '天',
        productName: '無限年刊365天',
        productAmount: 7800,
        title: '無限型',
        img: icon3,
        description: productsDesc.infinite,
        categoryName: '無限年刊會員',
      },
      MISC2010000049: {
        contentQuantity: 30,
        productUnit: '次',
        productName: '計次型30次',
        productAmount: 2100,
      },
      MISC2010000048: {
        contentQuantity: 1,
        productUnit: '次',
        productName: '計次型贈1次',
        productAmount: 0,
      },
    },
    outsource: {
      MISC2010000009: {
        contentQuantity: 0,
        productUnit: '天',
        productName: '無限方案',
        productAmount: '',
        title: '無限型',
        img: icon1,
        description: productsDesc.infinite,
        categoryName: '無限方案',
      },
    },
  },

};

export const payChooseStatus = {
  normal: 1,
  unlimited: 2,
  quota: 3,
  free: 4,
};


export const payChooseObj = {
  [payChooseStatus.normal]: {
    title: '超值型',
    img: icon2,
    depiction: productsDesc.valuable,
  },
  [payChooseStatus.unlimited]: {
    title: '無限型',
    img: icon3,
    depiction: productsDesc.infinite,
  },
  [payChooseStatus.quota]: {
    title: '計次',
    img: icon1,
    depiction: '每月兩次查閱5,000元以下或時薪案件',
  },
  [payChooseStatus.free]: {
    title: '體驗',
    img: icon1,
    depiction: '每日5次查閱刊登中所有案件',
    options: [
      {
        value: 'freeToDeposit',
        productName: '外包VIP會員 免費體驗',
      },
    ],
  },
};

export const CHAT_MOBILE_PAGE = {
  chatlist: '1',
  chatroom: '2',
};

export const EVALUATION_TYPE = {
  all: '0',
  positive: '1',
  negative: '-1',
};

export const usageStageTypes = {
  editing: '0',
  publishing: '1',
  unPublishing: '2',
  closed: '3',
  closedWithoutPublishing: '4',
  pending: '0.5',
};

// offDemandPath: [0: 完成申退][1: 有溝通高手但未確認合作][2: 有多位確認合作但未評價][3: 已確認已評價]
export const OFF_DEMAND_PATH = {
  applyFinished: 0,
  communicateUncooperate: 1,
  multiCooperateNotEvaluate: 2,
  evaluated: 3,
};
