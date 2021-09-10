import { catsTreeData } from '../util/lablesUtils';

const presetTime = [
  {
    id: 'daytime',
    text: '白天',
    startTime: '9:00',
    endTime: '18:00',
    info: {
      startTimeVal: 900,
      endTimeVal: 1800,
    },
  },
  {
    id: 'am',
    text: '上午',
    startTime: '9:00',
    endTime: '12:00',
    info: {
      startTimeVal: 900,
      endTimeVal: 1200,
    },
  },
  {
    id: 'pm',
    text: '下午',
    startTime: '12:00',
    endTime: '18:00',
    info: {
      startTimeVal: 1200,
      endTimeVal: 1800,
    },
  },
  {
    id: 'noon',
    text: '中午',
    startTime: '12:00',
    endTime: '13:00',
    info: {
      startTimeVal: 1200,
      endTimeVal: 1300,
    },
  },
  {
    id: 'night',
    text: '晚上',
    startTime: '18:00',
    endTime: '22:00',
    info: {
      startTimeVal: 1800,
      endTimeVal: 2200,
    },
  },
];

const partnerCountData = [
  {
    id: 1,
    title: '1人',
    value: 1,
  },
  {
    id: 2,
    title: '2人',
    value: 2,
  },
  {
    id: 3,
    title: '3人',
    value: 3,
  },
  {
    id: 4,
    title: '4人',
    value: 4,
  },
  {
    id: 5,
    title: '5人',
    value: 5,
  },
];


const byKeyOptions = [
  // type: acName/basicId/pid/idNo/email/cellphone/phone/identityOrPassport/invoice/demandId
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
    label: '姓名',
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
];
// 全部
// 編輯中
// 待審核
// 刊登中_公開
// 刊登中_不公開
// 結束刊登
// 結束刊登(未上刊關閉)
const onlineStatusOpts = [
  // 待審核案件：[0:編輯中(未刊登)] [1: 刊登中_公開] [2: 刊登中_不公開] [3: 結束刊登]
  {
    label: '待審中',
    value: -1,
  },
  {
    label: '編輯中',
    value: 0,
  },
  {
    label: '刊登中__公開',
    value: 1,
  },
  {
    label: '刊登中__不公開',
    value: 2,
  },
  {
    label: '結束刊登',
    value: 3,
  },
];

const onlineStatusOptsForDemand = {
  // 新增：[0:編輯中(未刊登)] [1: 刊登中_公開] [2: 刊登中_不公開]
  // 修改：[0:編輯中(未刊登)] [1: 刊登中_公開] [2: 刊登中_不公開] [3: 結束刊登]
  0: {
    label: '編輯中',
    value: 0,
  },
  1: {
    label: '刊登中__公開',
    value: 1,
  },
  2: {
    label: '刊登中__不公開',
    value: 2,
  },
  3: {
    label: '結束刊登',
    value: 3,
  },
  4: {
    label: '結束刊登(未上刊關閉)',
    value: 3,
  },
  '-1': {
    label: '待審中',
    value: -1,
  },
};

const onlineStatusOptsOfAddDemand = {
  phoneNotFound: [0].map(key => onlineStatusOptsForDemand[key]),
  phoneNotVerified: [0].map(key => onlineStatusOptsForDemand[key]),
  phoneVerified: [0, 1, 2].map(key => onlineStatusOptsForDemand[key]),
};

const onlineStatusOptsOfModifyDemand = {
  editing: { // 0
    phoneNotFound: [0, 4].map(key => onlineStatusOptsForDemand[key]),
    phoneNotVerified: [0, 4].map(key => onlineStatusOptsForDemand[key]),
    phoneVerified: [0, 1, 2, 4].map(key => onlineStatusOptsForDemand[key]),
  },
  verifying: { // 0.5
    unpay: {
      notVerified: [-1, 4].map(key => onlineStatusOptsForDemand[key]),
      verified: [-1, 1, 2, 4].map(key => onlineStatusOptsForDemand[key]),
    },
    pay: {
      notVerified: [-1, 4].map(key => onlineStatusOptsForDemand[key]),
      verified: [-1, 1, 2, 4].map(key => onlineStatusOptsForDemand[key]),
    },
  },
  // usageStage: 1 刊登中_公開+不公開
  publishing: [1, 2, 3].map(key => onlineStatusOptsForDemand[key]),
  publish: {// 1
    cooperated: [1, 2, 3].map(key => onlineStatusOptsForDemand[key]),
    notCooperated: [1, 2, 3].map(key => onlineStatusOptsForDemand[key]),
  },
  unpublish: {// 2
    cooperated: [1, 2, 3].map(key => onlineStatusOptsForDemand[key]),
    notCooperated: [1, 2, 3].map(key => onlineStatusOptsForDemand[key]),
  },
};


const unitOpts = [
  {
    label: '論件計酬',
    value: 0,
  },
  {
    label: '時薪',
    value: 1,
  },
];

const partnerCountOpts = [
  {
    label: '1人',
    value: 1,
  },
  {
    label: '2人',
    value: 2,
  },
  {
    label: '3人',
    value: 3,
  },
  {
    label: '4人',
    value: 4,
  },
  {
    label: '5人',
    value: 5,
  },
];

const designatedPlaceOpts = [
  {
    label: '是',
    value: true,
  },
  {
    label: '否',
    value: false,
  },
];

const depositResourceOpts = [
  {
    label: '上線中',
    value: 'orderTX',
  },
  {
    label: '免押金(前台)',
    value: 'free',
  },
  {
    label: '免押金(後台)',
    value: 'staffAuthorize',
  },
  {
    label: '免押金(邀請碼)',
    value: 'inviteCode',
  },
];

const offReasonList = {
  '-1': {
    label: '請選擇結案理由',
    value: -1,
  },
  0: {
    label: '需求已完成結案',
    value: 0,
  },
  1: {
    label: '找不到合適的專家',
    value: 1,
  },
  2: {
    label: '暫時已無需求',
    value: 2,
  },
  3: {
    label: '已在別的平台找到合適專家',
    value: 3,
  },
  4: {
    label: '已由親友轉介合適專家',
    value: 4,
  },
  5: {
    label: '因違規系統關案',
    value: 5,
  },
  '6-ap': {
    label: '到期自動結案',
    value: 6,
  },
  7: {
    label: '聯絡無回，無法刊登',
    value: 7,
  },
  8: {
    label: '重複案件',
    value: 8,
  },
  9: {
    label: '不適合刊登(業務、職缺...)',
    value: 9,
  },
  10: {
    label: '接案方誤填發案資料',
    value: 10,
  },
  11: {
    label: '案件內容不足未補',
    value: 11,
  },
  12: {
    label: '工程或企劃單位測試',
    value: 12,
  },

  // 編輯中關閉
  '100-b': {
    label: '重複案件',
    value: 100,
  },
  '100-f': {
    label: '重複刊登',
    value: 100,
  },
  101: {
    label: '會員自行刪除',
    value: 101,
  },
  '102-b': {
    label: '接案方誤填發案資料',
    value: 102,
  },
  '102-f': {
    label: '想接案誤填發案需求',
    value: 102,
  },
  103: {
    label: '在別的平台找到人',
    value: 103,
  },
  104: {
    label: '親友介紹找到人',
    value: 104,
  },
  105: {
    label: '不適合刊登(業務、職缺...)',
    value: 105,
  },
  106: {
    label: '聯絡無回，無法刊登',
    value: 106,
  },
  107: {
    label: '工程或企劃單位測試',
    value: 107,
  },
  108: {
    label: '暫時已無需求',
    value: 108,
  },
  // 審核中關閉
  150: {
    label: '重複案件',
    value: 150,
  },
  151: {
    label: '暫時無需求',
    value: 151,
  },
  152: {
    label: '接案方誤填發案資料',
    value: 152,
  },
  153: {
    label: '在別的平台找到人',
    value: 153,
  },
  154: {
    label: '親友介紹找到人',
    value: 154,
  },
  155: {
    label: '不適合刊登(業務、職缺...)',
    value: 155,
  },
  156: {
    label: '聯絡無回，無法刊登',
    value: 156,
  },
  157: {
    label: '工程或企劃單位測試',
    value: 157,
  },
};

const findOffReasonLabel = (value) => {
  for (const offReason in offReasonList) {
    if (offReasonList[offReason].value === value) {
      return offReasonList[offReason].label;
    }
  }
  return null;
};

// 根據usageStage使用
const offReasonStatusList = {
  0: 'editingOfBack',
  0.5: 'verifyingOfBack',
  1: 'noncooperationOfBack',
};

const offReasonOpts = {
  // 已上刊_已評價
  hasEvaluated: ['-1', '0'].map(key => offReasonList[key]),
  // 已上刊_未合作_前台: 前台用
  noncooperationOfFront: ['1', '2', '3', '4'].map(key => offReasonList[key]),
  // 已上刊_未合作_後台
  noncooperationOfBack: ['-1', '0', '1', '2', '3', '4', '7', '8', '9', '10', '11', '12'].map(key => offReasonList[key]),
  // 已刊登_公開+不公開_未溝通過
  nonCommunicated: ['-1', '1', '2', '3', '4', '7', '8', '9', '10', '11', '12'].map(key => offReasonList[key]),
  // 編輯中_前台: 前台用
  editingOfFront: ['100-f', '101', '102-f'].map(key => offReasonList[key]),
  // 編輯中_後台
  editingOfBack: ['-1', '100-b', '108', '102-b', '103', '104', '105', '106', '107'].map(key => offReasonList[key]),
  // 審核中_後台
  verifyingOfBack: ['-1', '150', '151', '152', '153', '154', '155', '156', '157'].map(key => offReasonList[key]),
  // 結案不顯示
};

const experienceData = [
  {
    id: 0,
    title: '無經驗',
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

const tutorGrade = [
  { label: '一年級', value: 1 },
  { label: '二年級', value: 2 },
  { label: '三年級', value: 3 },
  { label: '四年級', value: 4 },
  { label: '五年級', value: 5 },
  { label: '六年級', value: 6 },
];

const educationalStageOpts = [
  {
    label: '請選擇教學對象',
    value: 0,
  },
  {
    label: '學齡前兒童',
    value: 1,
  },
  {
    label: '小學生',
    value: 2,
  },
  {
    label: '國中生',
    value: 3,
  },
  {
    label: '高中生',
    value: 4,
  },
  {
    label: '大專生以上',
    value: 5,
  },
  {
    label: '社會人士',
    value: 6,
  },
];

const offPersonOpts = [
  {
    label: '前台案主結案',
    value: 'member',
  },
  {
    label: '後台客服結案',
    value: 'staff',
  },
  {
    label: '到期自動結案',
    value: 'system-expire',
  },
  {
    label: '檢舉成立退刊',
    value: 'system-violation',
  },
];

const solutionType = [
  {
    label: '一般方案',
    value: 0,
  },
  {
    label: '進階方案',
    value: 1,
  },
];

const demandTypeList = [
  {
    label: '家教類',
    value: 1,
  },
  {
    label: '外包類',
    value: 2,
  },
];

const tutorFrequency = [
  {
    label: '日',
    value: 0,
  },
  {
    label: '周',
    value: 1,
  },
  {
    label: '雙周',
    value: 2,
  },
  {
    label: '月',
    value: 3,
  },
];

const tutorFrequencyCount = (() => {
  const countList = [];
  for (let count = 1; count <= 20; count++) {
    countList.push({
      label: count,
      value: count,
    });
  }
  return countList;
})();

const tutorFrequencyHour = (() => {
  const hourList = [];
  for (let hour = 0.5; hour <= 10.0; hour += 0.5) {
    hourList.push({
      label: hour,
      value: hour,
    });
  }
  return hourList;
})();

const tutorFrequencyWeek = [
  {
    label: '周一',
    value: 1,
  },
  {
    label: '週二',
    value: 2,
  },
  {
    label: '週三',
    value: 3,
  },
  {
    label: '週四',
    value: 4,
  },
  {
    label: '週五',
    value: 5,
  },
  {
    label: '週六',
    value: 6,
  },
  {
    label: '週日',
    value: 7,
  },
];

const generateTimeList = (startTime = 7, endTime = 23) => {
  const timeList = [];
  for (let hour = startTime; hour <= endTime; hour++) {
    timeList.push(
      {
        value: Number(`${`${hour}00`}`),
        label: `${`${hour}:00`}`,
        hour,
      },
      {
        value: Number(`${`${hour}30`}`),
        label: `${`${hour}:30`}`,
        hour,
      },
    );
  }
  return timeList;
};

const tutorTimeList = generateTimeList(7, 23);
const tutorTreeData = Object.assign({}, catsTreeData(1000000)).children;
const caseTreeData = Array(...catsTreeData(0)).splice(1, 8);
const tutorSexes = [
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 0,
  },
  {
    label: '男女皆有',
    value: 2,
  },
];
const tutorRoleTypes = [
  {
    label: '不拘',
    value: 0,
  },
  {
    label: '學生',
    value: 1,
  },
  {
    label: '社會人士',
    value: 2,
  },
  {
    label: '現職教師',
    value: 3,
  },
  {
    label: '補教/家教專職老師',
    value: 4,
  },
];
const caseRoleTypes = [
  {
    label: '不拘',
    value: 0,
  },
  {
    label: '學生',
    value: 1,
  },
  {
    label: '兼職接案',
    value: 2,
  },
  {
    label: '專職SOHO',
    value: 3,
  },
  {
    label: '工作室/公司',
    value: 4,
  },
];

const teachTypes = [
  {
    label: '面對面上課',
    value: 1,
  },
  {
    label: '視訊/電話上課',
    value: 2,
  },
];

const teachDurationTypes = [
  {
    label: '短期（兩個月內）',
    value: 1,
  },
  {
    label: '長期（超過兩個月）',
    value: 2,
  },
];

const teachPlaceTypes = [
  {
    label: '家裡上課',
    value: 1,
  },
  {
    label: '公司上課',
    value: 2,
  },
  {
    label: '外面上課',
    value: 3,
  },
  {
    label: '老師家上課',
    value: 4,
  },
];

export {
  presetTime,
  byKeyOptions,
  onlineStatusOpts,
  unitOpts,
  partnerCountOpts,
  designatedPlaceOpts,
  depositResourceOpts,
  offReasonOpts,
  educationalStageOpts,
  offPersonOpts,
  solutionType,
  offReasonStatusList,
  onlineStatusOptsOfAddDemand,
  onlineStatusOptsOfModifyDemand,
  offReasonList,
  onlineStatusOptsForDemand,
  findOffReasonLabel,
  demandTypeList,
  tutorFrequency,
  tutorFrequencyCount,
  tutorFrequencyHour,
  tutorFrequencyWeek,
  tutorTimeList,
  tutorTreeData,
  caseTreeData,
  partnerCountData,
  tutorSexes,
  experienceData,
  tutorRoleTypes,
  tutorGrade,
  caseRoleTypes,
  teachTypes,
  teachDurationTypes,
  teachPlaceTypes,
};
