const moneyData = [
  {
    id: 1,
    title: '論件計酬',
    value: 0,
  },
  {
    id: 2,
    title: '時薪',
    value: 1,
  }
];

const defaultMoneyData = {
  unit: moneyData[0].value,
  price: 0, // 100
  minCase: 1,
  minHourRate: 158,
};

const timeSlotData = [
  {
    id: 1,
    allTimes: '平日全時段',
    times: ['平日上午', '平日下午', '平日晚上'],
    values: [1, 2, 3],
  },
  {
    id: 2,
    allTimes: '假日全時段',
    times: ['假日上午', '假日下午', '假日晚上'],
    values: [4, 5, 6],
  }
];

const gigData = {
  id: '',
  // gigId: '',
  title: '', // 服務名稱
  cats: [], // 類別項目
  body: {
    // coverPic: '', // 封面照
    unit: defaultMoneyData.unit, // 價格單位 0:論件計酬 1:時薪
    price: defaultMoneyData.price, // 參考價格
    exp: -2, // 經驗 -1
    area: [], // 服務區域: 預設台灣區域 '6001000000'
    onsiteOpts: [], // 服務方式 1:到客戶指定地點, 2:在我的工作室, 3:遠端服務 1, 2, 3
    clientCats: [], // 服務對象 1:學齡前兒童, 2:國小生, 3:國中生, 4:高中生, 5:大學生, 6:社會人士 1, 2, 3, 4, 5, 6
    priority: [], // 服務時段 平日 1:上午 2:下午 3:晚上 假日 4:上午 5:下午 6:晚上 1, 2, 3, 4, 5, 6
    desc: '', // 描述
  },
  catTag: [], // 類別標籤
};

export {
  defaultMoneyData,
  moneyData,
  timeSlotData,
  gigData,
};
