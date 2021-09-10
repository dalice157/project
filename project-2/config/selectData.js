import config from './config';

const unitData = [
  {
    label: '論件計酬',
    value: 0,
  },
  {
    label: '時薪',
    value: 1,
  },
];

const defaultMoneyData = {
  unit: unitData[0].value,
  price: 0, // 100
  minCase: 1,
  minHourRate: 158,
};

const demandExperienceData = [
  {
    id: 0,
    title: '無經驗可',
  },
  {
    id: 1,
    title: '1年以下',
  },
  {
    id: 2,
    title: '1年(含)以上',
  },
  {
    id: 3,
    title: '2年(含)以上',
  },
  {
    id: 4,
    title: '3年(含)以上',
  },
  {
    id: 5,
    title: '4年(含)以上',
  },
  {
    id: 6,
    title: '5年(含)以上',
  },
  {
    id: 7,
    title: '6年(含)以上',
  },
  {
    id: 8,
    title: '7年(含)以上',
  },
  {
    id: 9,
    title: '8年(含)以上',
  },
  {
    id: 10,
    title: '9年(含)以上',
  },
  {
    id: 11,
    title: '10年(含)以上',
  },
];

const gigExperienceData = [
  {
    id: -1,
    title: '無經驗',
  },
  {
    id: 0,
    title: '1年以下',
  },
  {
    id: 1,
    title: '1年(含)以上',
  },
  {
    id: 2,
    title: '2年(含)以上',
  },
  {
    id: 3,
    title: '3年(含)以上',
  },
  {
    id: 4,
    title: '4年(含)以上',
  },
  {
    id: 5,
    title: '5年(含)以上',
  },
  {
    id: 6,
    title: '6年(含)以上',
  },
  {
    id: 7,
    title: '7年(含)以上',
  },
  {
    id: 8,
    title: '8年(含)以上',
  },
  {
    id: 9,
    title: '9年(含)以上',
  },
  {
    id: 10,
    title: '10年(含)以上',
  },
];
const methodData = [
  { id: 1, title: '到客戶指定地點服務' },
  { id: 2, title: '在高手的工作室服務' },
  { id: 3, title: '透過網路或電話遠端服務' },
];
const targetData = [
  { id: 1, title: '學齡前兒童' },
  { id: 2, title: '小學生' },
  { id: 3, title: '國中生' },
  { id: 4, title: '高中生' },
  { id: 5, title: '大專生以上' },
  { id: 6, title: '社會人士' },
];

const timeSlotData = [
  {
    id: 1,
    day: '平日全時段',
    times: [
      { label: '平日上午', value: 1 },
      { label: '平日下午', value: 2 },
      { label: '平日晚上', value: 3 },
    ],
  },
  {
    id: 2,
    day: '假日全時段',
    times: [
      { label: '假日上午', value: 4 },
      { label: '假日下午', value: 5 },
      { label: '假日晚上', value: 6 },
    ],
  },
];

const demandMultiSearchOptions = {
  dateType: [
    { label: '建立日期', value: 'createDate' },
    { label: '刊登日期', value: 'onlineDate' },
    { label: '結案日期', value: 'offDate' },
  ],
  onlineStatus: [
    { label: '全部', value: 0 },
    { label: '編輯中', value: 1 },
    { label: '待審核', value: 2 },
    { label: '刊登中_公開', value: 3 },
    { label: '刊登中_不公開', value: 4 },
    { label: '結束刊登', value: 5 },
    { label: '結束刊登(未上刊關閉)', value: 6 },
  ],
  depositStatus: [
    { label: '全部', value: 0 },
    { label: '上線中', value: 1 },
    { label: '申請/代辦', value: 2 },
    { label: '結案/已退款', value: 3 },
    { label: '押金轉收入', value: 4 },
    { label: '免押金(後台)', value: 5 },
    { label: '免押金(前台)', value: 6 },
  ],
  violationStatus: [
    { label: '全部', value: 0 },
    { label: '無違規（含待處理及不成立）', value: 1 },
    { label: '檢舉違規成立', value: 2 },
  ],
};
const memberMultiSearchOptions = {
  name: {
    dateType: 'dateType',
    onlineStatus: 'onlineStatus',
    serviceStatus: 'serviceStatus',
    blockStatus: 'blockStatus',
    memberStatus: 'memberStatus',
    oldSiteType: 'oldSiteType',
    yearMonth: 'times.yearMonth',
    start: 'times.start',
    end: 'times.end',
  },
  dateType: [
    { label: '加入日期', value: 0 },
    { label: '最近登入日期', value: 1 },
  ],
  onlineStatus: [
    { label: '全部', value: 0 },
    { label: '刊登中', value: 1 },
    { label: '未刊登', value: 2 },
  ],
  serviceStatus: [
    { label: '全部', value: 0 },
    { label: '接案會員', value: 1 },
    { label: '發案會員', value: 2 },
    { label: '接案+發案會員', value: 3 },
    { label: '基本會員', value: 4 },
  ],
  blockStatus: [
    { label: '全部', value: 0 },
    { label: '是', value: 1 },
    { label: '否', value: 2 },
  ],
  memberStatus: [
    { label: '全部', value: 0 },
    { label: '會員', value: 1 },
    { label: '非會員（刪除AC帳號/高手服務）', value: 2 },
  ],
  oldSiteType: [
    { label: '全部', value: 0 },
    { label: '外包會員', value: 1 },
    { label: '外包VIP (曾付)', value: 2 },
    { label: '家教會員', value: 3 },
    { label: '家教VIP (曾付)', value: 4 },
    { label: '全新會員', value: 5 },
  ],
};

const customerServiceMember = [
  { name: '當月全部', value: -2 },
  { name: '家惠', value: 0 },
  { name: '怡雯', value: 1 },
  { name: '慧仙', value: 2 },
  { name: '佳珍', value: 3 },
  { name: '其他', value: -1 },
];
const clerkSlotData = [
  { id: '0559', name: '高家惠' },
  { id: '2380', name: '尤怡雯' },
  { id: '1837', name: '劉慧仙' },
  { id: '1234', name: '李佳珍' },
];

const memberPublishStatus = [
  { label: '未刊登', value: null },
  { label: '刊登中', value: 'on' },
  { label: '取消刊登', value: 'off' },
];

const memberDepositStatus = [
  { label: '全部', value: 0 },
  { label: '上線中', value: 1 },
  { label: '申請/代辦', value: 2 },
  { label: '結案/已退款', value: 3 },
  { label: '押金轉收入', value: 4 },
  { label: '免押金(後台)', value: 5 },
  { label: '免押金(前台)', value: 6 },
];

const tabs = [
  {
    tab: '備註總表',
    key: 'all',
  },
  {
    tab: '會員備註',
    key: 'basic',
  },
  {
    tab: '接案備註',
    key: 'gig',
  },
  {
    tab: '案件備註',
    key: 'demand',
  },
  {
    tab: '檢舉備註',
    key: 'violation',
  },
  {
    tab: '聊天室備註頁',
    key: 'chatMeta',
  },
  {
    tab: '服務評價備註',
    key: 'review',
  },
];

const toolList = [
  {
    label: '代碼',
    value: 0,
  },
  {
    label: '綁定人PID',
    value: 1,
  },
  {
    label: '綁定人BasicID',
    value: 2,
  },
  {
    label: '綁定人Email',
    value: 3,
  },
];

const toolMultiSearchOptions = {
  name: {
    dateType: 'dateType',
    bindingMethod: 'bindingMethod',
    redemptionStatus: 'redemptionStatus',
    yearMonth: 'times.yearMonth',
    start: 'times.start',
    end: 'times.end',
  },
  dateType: [
    {
      label: '申請日',
      value: 0,
    },
    {
      label: '到期日',
      value: 1,
    },
    {
      label: '使用日',
      value: 2,
    },
  ],
  bindingMethod: [
    {
      label: '全部',
      value: 0,
    },
    {
      label: '以PID',
      value: 1,
    },
    {
      label: '以BasicID',
      value: 2,
    },
    {
      label: '以Email',
      value: 3,
    },
  ],
  redemptionStatus: [
    {
      label: '全部',
      value: 0,
    },
    {
      label: '已使用',
      value: 1,
    },
    {
      label: '未使用',
      value: 2,
    },
  ],
};

const unpublish = [
  {
    label: '請選擇理由或自行填寫備註',
    value: 200,
  },
  {
    label: '暫時無接案需求',
    value: 201,
  },
  {
    label: '會員要求刪除AC帳號或高手服務',
    value: 202,
  },
  {
    label: '違反服務規約或被檢舉',
    value: 203,
  },
  {
    label: 'VIP會員要求退費並取消刊登',
    value: 204,
  },
  {
    label: '工程或企劃單位測試',
    value: 205,
  },
];


const searchOpts = [
  {
    label: '聯絡人手機',
    value: 1,
  },
  {
    label: '聯絡人室話',
    value: 2,
  },
  {
    label: '聯絡人EMAIL',
    value: 3,
  },
  {
    label: '案件編號',
    value: 4,
  },
];

const demandContactType = [
  {
    label: '依服務刊登期',
    value: 0,
    key: 0,
  },
  {
    label: '依付費訂單',
    value: 1,
    key: 1,
  },
];

const closedOptions = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '已合作',
    value: 1,
  },
  {
    label: '未合作',
    value: 2,
  },
];

const memberDepositPublishStatus = {
  orderTX: '押金',
  inviteCode: '邀請碼',
  oldSiteVIP: '舊站VIP',
  beginnerExperience: '新手體驗',
};

const orderStatusTypes = {
  2: '上線中',
  3: '申請待辦',
  4: '結案已退款',
  5: '押金轉收入',
};

const depositStatus = {
  2: '上線中',
  3: '申請待辦',
  4: '結案已退款',
  5: '押金轉收入',
};

const edmTypeOpts = [{
  id: '1',
  title: '訂閱最新案件配對信',
}];

const mtsTypeOpts = [
  {
    id: '304',
    title: '訂閱104高手接案資訊報',
  },
  {
    id: '305',
    title: '訂閱104高手發案找人才資訊報',
  },
];

const searchDateOptions = [
  { value: 0, label: '今天' },
  { value: 1, label: '最近7天' },
  { value: 2, label: '上個月' },
  { value: 3, label: '自訂' },
];

const plansSearchTypeOptions = [
  { value: 0, label: '上一個時段' },
  { value: 1, label: '前一年' },
];

const salesSearchTypeOptions = [
  { value: 0, label: '自訂' },
  { value: 1, label: '上個月' },
];

const searchMonthTypeOptions = [
  { value: 0, label: '本月' },
  { value: 1, label: '上個月' },
  { value: 2, label: '前3個月' },
  { value: 3, label: '前6個月' },
  { value: 4, label: '前9個月' },
  { value: 5, label: '前12個月' },
  { value: 6, label: '自訂(最長2年)' },
];
const searchDateTypeOptions = [
  { value: 0, label: '昨天' },
  { value: 1, label: '前7天(不含今天)' },
  { value: 2, label: '前14天(不含今天)' },
  { value: 3, label: '前21天(不含今天)' },
  { value: 4, label: '前28天(不含今天)' },
  { value: 5, label: '自訂(限31天)' },
];

// 顯示用
const statusTypes = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '未付款',
    value: 1,
  },
  {
    label: '上線中',
    value: 2,
  },
  {
    label: '申請/待辦',
    value: 3,
  },
  {
    label: '結案/已退款',
    value: 4,
  },
  {
    label: '押金轉收入',
    value: 5,
  },
];

const applyType = {
  1: '(自行退款)',
  2: '(到期退款)',
  3: '(檢舉轉收入)',
};

const orderTypeObj = {
  1: '上線中',
  2: '到期下線',
  3: '申請退款',
  4: '已退款 ',
};

const paymentTypeObj = {
  1: '信用卡',
  2: 'ibon',
  3: '實體ATM',
  4: '家教點數轉換',
  5: '外包刊期轉換',

};

// 搜尋用
const paySingleOpts = [
  {
    label: '會員編號',
    value: 'basicId',
  },
  {
    label: '身分證/護照',
    value: 'identityOrPassport',
  },
  {
    label: '委刊單號',
    value: 'soNo',
  },
  {
    label: '銷帳編號',
    value: 'virtualAccount',
  },
  {
    label: '訂單編號',
    value: 'orderId',
  },
];

const creditOpts = [
  {
    label: '信用不良',
    value: -1,
  },
  {
    label: '一般',
    value: 0,
  },
  {
    label: '優質會員(邀請)',
    value: 1,
  },
];

const payOrderTypeObj = {
  1: '未付款',
  3: '申請退款',
  4: '已退款 ',
  5: '上線中',
  6: '到期下線',
  7: '已付款待上線',
  8: '升級下線',
};

const statisticsType = {
  1: '新單',
  2: '續約單',
  3: '回流單',
};

const marketingStatisticsType = {
  1: '新單',
  2: '續約單',
  3: '回流單',
};

const paymentStatusObj = {
  0: '未付款',
  1: '付款成功',
};

const invoiceType = {
  2: '二聯',
  3: '三聯',
};

const invoiceHandleType = {
  4: '手機載具',
  5: '捐贈',
  9: '會員載具',
};

const orderGroup = {
  name: {
    dateType: 'dateType',
    paymentType: 'paymentType',
    paymentStatus: 'paymentStatus',
    orderStatus: 'orderStatus',
    yearMonth: 'times.yearMonth',
    start: 'times.start',
    end: 'times.end',
    purchaseProduct: 'purchaseProduct',
  },
  dateTypeObj: [
    { label: '訂單日期', value: 0 },
    { label: '付款日期', value: 1 },
  ],
  paymentTypeObj: [
    { label: '全部', value: 0 },
    { label: '信用卡', value: 1 },
    { label: '實體ATM', value: 2 },
    { label: 'ibon', value: 3 },
    { label: '家教點數轉換', value: 4 },
    { label: '外包刊期轉換', value: 5 },
  ],
  paymentStatusObj: [
    { label: '全部', value: 0 },
    { label: '付款成功', value: 1 },
    { label: '未付款', value: 2 },
  ],
  orderStatusObj: [
    { label: '全部', value: 0 },
    { label: '未付款', value: 1 },
    { label: '上線中', value: 2 },
    { label: '到期下線', value: 3 },
    { label: '申請退款', value: 4 },
    { label: '已退款', value: 5 },
    { label: '已付款待上線', value: 6 },
  ],
  purchaseProducts:
  [{ label: '全部', value: 'all' }].concat(Object.keys(config.purchaseProducts).map(key => ({ label: config.purchaseProducts[key], value: key }))),
};

const manageGroup = {
  displaySegmentObj: [
    { label: '供給(接案)', value: 0 },
    { label: '需求(案件)', value: 1 },
    { label: '供需(on接案+案件)', value: 2 },
  ],
  sourceObj: [
    { label: '接案會員種類', value: 0 },
    { label: '會員來源', value: 1 },
    { label: '刊登方案', value: 2 }, // deprecate
    { label: '案件來源', value: 3 },
    { label: '案主種類(新/續/回)', value: 4 },
    { label: '依案件預算(5000以上及5000以下+時薪)', value: 5 },
    { label: '服務8大類', value: 6 },
    { label: '身份類型', value: 7 },
  ],
  targetObj: [
    { label: '進水', value: 0 },
    { label: '水位', value: 1 },
    { label: '水位+進水', value: 2 },
    { label: '互動', value: 3 },
  ],
  dimensionObj: [
    { label: '依8大類', value: 0 },
    { label: '依家教中類', value: 1 },
    { label: '依家教小類', value: 2 },
    { label: '依外包中類', value: 3 },
    // { label: '接案會員種類', value: 4 },
    // { label: '會員來源', value: 5 },
  ],
  caseBudgetTitleObj: {
    0: '五千以下',
    1: '五千以上',
    2: '時薪',
  },
  shipTypeTitleObj: {
    1: '在校生',
    2: '補教老師',
    3: '專職家教',
    4: '現職教師',
    5: '一般職員',
    6: '專職SOHO',
    7: '公務人員',
    8: '高階管理者',
    9: '家管',
    10: '其他',
  },
  sourceTitleObj: {
    0: '全新',
    1: '家教',
    2: '外包',
    3: '二者皆有',
  },
  memberTypeTitleObj: {
    0: '預備',
    1: '體驗',
    2: '付費',
  },
};


export {
  gigExperienceData,
  methodData,
  targetData,
  timeSlotData,
  demandMultiSearchOptions,
  memberMultiSearchOptions,
  customerServiceMember,
  clerkSlotData,
  tabs,
  toolList,
  toolMultiSearchOptions,
  unpublish,
  unitData,
  searchOpts,
  demandContactType,
  closedOptions,
  memberPublishStatus,
  depositStatus,
  memberDepositPublishStatus,
  memberDepositStatus,
  defaultMoneyData,
  demandExperienceData,
  edmTypeOpts,
  mtsTypeOpts,
  searchDateOptions,
  plansSearchTypeOptions,
  salesSearchTypeOptions,
  orderStatusTypes,
  statusTypes,
  orderTypeObj,
  paymentTypeObj,
  paySingleOpts,
  payOrderTypeObj,
  statisticsType,
  marketingStatisticsType,
  paymentStatusObj,
  invoiceType,
  invoiceHandleType,
  orderGroup,
  applyType,
  creditOpts,
  searchMonthTypeOptions,
  searchDateTypeOptions,
  manageGroup,
};
