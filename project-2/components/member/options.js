const byKeyOptions = [
  //  type: acName/basicId/pid/idNo/email/cellphone/phone/identityOrPassport/invoice/demandId
  {
    label: '會員編號',
    value: 'basicId',
  },
  {
    label: '身份證字號/護照',
    value: 'identityOrPassport',
  },
  {
    label: 'PID',
    value: 'pid',
  },
  {
    label: 'AC姓名',
    value: 'acName',
  },
  {
    label: 'IDNO',
    value: 'idNo',
  },
  {
    label: 'e-mail',
    value: 'email',
  },
  {
    label: '手機號碼',
    value: 'cellphone',
  },
  {
    label: '室內電話',
    value: 'phone',
  },
  {
    label: '統一編號',
    value: 'invoice',
  },
  {
    label: '案件編號',
    value: 'demandId',
  },
  {
    label: '備份PID',
    value: 'backUpPid',
  },
];

const dateType = [
  {
    label: '加入日期',
    value: 1,
  },
  {
    label: '最後登入日期',
    value: 2,
  },
];

const orderType = [
  // 1:服務保證金 2:案件保證金 3:無保證金
  {
    label: '全部',
    value: 0,
  },
  {
    label: '服務押金',
    value: 1,
  },
  {
    label: '案件押金',
    value: 2,
  },
  {
    label: '無押金',
    value: 3,
  },
];
const serviceType = [
  // 0:全部 1:接案 2:發案 3:接案+發案
  {
    label: '全部',
    value: 0,
  },
  {
    label: '接案',
    value: 1,
  },
  {
    label: '發案',
    value: 2,
  },
  {
    label: '接案+發案',
    value: 3,
  },
];
const memberType = [
  // /0:全部 1:外包網 2:家教網 3:外包網+家教網 4:全新會員
  {
    label: '全部',
    value: 0,
  },
  {
    label: '外包網',
    value: 1,
  },
  {
    label: '家教網',
    value: 2,
  },
  {
    label: '外包網+家教網',
    value: 3,
  },
  {
    label: '全新會員',
    value: 4,
  },
];
const blackList = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },

];
// [身分類別] 1:在校生 2:補教老師 3:專職家教 4:現職教師 5:一般職員 6:專職SOHO 7:公務人員 8:高階管理者 9:家管 10:其他
const roleTypes = [
  {
    label: '請選擇身份類別',
    value: 0,
  },
  {
    label: '在校生',
    value: 1,
  },
  {
    label: '補教老師',
    value: 2,
  },
  {
    label: '專職家教',
    value: 3,
  },
  {
    label: '現職教師',
    value: 4,
  },
  {
    label: '一般職員',
    value: 5,
  },
  {
    label: '專職SOHO',
    value: 6,
  },
  {
    label: '公務人員',
    value: 7,
  },
  {
    label: '高階管理者',
    value: 8,
  },
  {
    label: '家管',
    value: 9,
  },
  {
    label: '其他',
    value: 10,
  },
];

const sexOpts = [
  {
    label: '男',
    value: '1',
  },
  {
    label: '女',
    value: '0',
  },
];

const sexTitleOpts = [
  {
    label: '先生',
    value: '1',
  },
  {
    label: '小姐',
    value: '0',
  },
];

const chosenRoleOpts = [
  {
    label: '個人',
    value: 'personal',
  },
  {
    label: '公司',
    value: 'company',
  },
];

const identityTypeOpts = [
  {
    label: '身分證',
    value: 0,
  },
  {
    label: '護照',
    value: 1,
  },
];

const memoTypeOpts = [
  // 個人資料相關 接案相關 發案相關 帳務相關
  {
    label: '個人資料相關',
    value: 'Basic',
  },
  {
    label: '接案相關',
    value: 'Gig',
  },
  {
    label: '發案相關',
    value: 'Demand',
  },
  {
    label: '帳務相關',
    value: 'Order',
  },
  {
    label: '全部',
    value: 'All',
  },
];

const handleDeleteAccountOpts = [
  {
    label: '處理中',
    value: 1,
  },
  {
    label: '已刪除',
    value: 2,
  },
  {
    label: '已慰留',
    value: 3,
  },
  {
    label: '已處理',
    value: 4,
  },
];

const rankingOpts = [
  {
    label: '0.5',
    value: 0.5,
  },
  {
    label: '1',
    value: 1,
  },
  {
    label: '1.5',
    value: 1.5,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '2.5',
    value: 2.5,
  },
  {
    label: '3',
    value: 3,
  },
  {
    label: '3.5',
    value: 3.5,
  },
  {
    label: '4',
    value: 4,
  },
  {
    label: '4.5',
    value: 4.5,
  },
  {
    label: '5',
    value: 5,
  },
];

//  "公司員工人數 [0: 後台顯示-未設定(選填) / 前台顯示-請選擇員工人數(必填)] [1: 10人以下] [2: 11-50人] [3: 51-100人] [4: 101-300人] [5: 301-500人] [6: 501人以上]
const employeeCountOpts = [
  {
    label: '未設定',
    value: 0,
  },
  {
    label: '10人以下',
    value: 1,
  },
  {
    label: '11-50人',
    value: 2,
  },
  {
    label: '51-100人',
    value: 3,
  },
  {
    label: '101-300人',
    value: 4,
  },
  {
    label: '301-500人',
    value: 5,
  },
  {
    label: '500人以上',
    value: 6,
  },
];

// 公司職稱 [0: 後台顯示-未設定(選填) / 前台顯示-請選擇職稱(必填)] [1: 負責人] [2: 主管] [3: HR] [4: 專案管理人] [5: 一般職員] [6: 顧問] [7: 其他]
const jobTitleOpts = [
  {
    label: '未設定',
    value: 0,
  },
  {
    label: '負責人',
    value: 1,
  },
  {
    label: '主管',
    value: 2,
  },
  {
    label: 'HR',
    value: 3,
  },
  {
    label: '專案管理人',
    value: 4,
  },
  {
    label: '一般職員',
    value: 5,
  },
  {
    label: '顧問',
    value: 6,
  },
  {
    label: '其他',
    value: 7,
  },
];

export const EVALUATION_COMMENT_TYPE = [
  {
    label: '快速簡評',
    value: 0,
  },
  {
    label: '自行填寫評語',
    value: 1,
  },
];

export const EVALUATION_COMMENT = [
  {
    label: '品質好，態度佳，速度快，非常值得再次合作!',
    value: '品質好，態度佳，速度快，非常值得再次合作!',
  },
  {
    label: '好溝通，執行力符合需求，值得再次合作!',
    value: '好溝通，執行力符合需求，值得再次合作!',
  },
  {
    label: '符合期待，態度好，可再次合作!',
    value: '符合期待，態度好，可再次合作!',
  },
  {
    label: '服務狀況整體尚可!',
    value: '服務狀況整體尚可!',
  },
  {
    label: '無意願再次合作!',
    value: '無意願再次合作!',
  },
];

export const delReviewOptions = [
  {
    label: '僅刪除評價',
    value: false,
  },
  {
    label: '需同時刪除評價 及 合作數(成交數)',
    value: true,
  },
];

export {
  byKeyOptions,
  dateType,
  orderType,
  serviceType,
  memberType,
  blackList,
  roleTypes,
  sexOpts,
  chosenRoleOpts,
  identityTypeOpts,
  memoTypeOpts,
  handleDeleteAccountOpts,
  rankingOpts,
  employeeCountOpts,
  jobTitleOpts,
  sexTitleOpts,
};
