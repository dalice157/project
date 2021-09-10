import { generateTimeList } from './demandPublish';
import babysitter from '../img/index_v2/mobile/icon-tutor-read-babysitter.svg';
import subject from '../img/index_v2/mobile/icon-tutor-subject.svg';
import language from '../img/index_v2/mobile/icon-tutor-language.svg';
import music from '../img/index_v2/mobile/icon-tutor-music.svg';
import talent from '../img/index_v2/mobile/icon-tutor-leisure-talent.svg';
import technical from '../img/index_v2/mobile/icon-tutor-technical-section.svg';
import sport from '../img/index_v2/mobile/icon-tutor-sport-dancing.svg';
import graphic from '../img/index_v2/mobile/icon-outsourcing-image-graphic.svg';
import translate from '../img/index_v2/mobile/icon-outsourcing-edit-translate.svg';
import network from '../img/index_v2/mobile/icon-outsourcing-information-network.svg';
import advertising from '../img/index_v2/mobile/icon-outsourcing-marketing-advertising.svg';
import audiovisual from '../img/index_v2/mobile/icon-outsourcing-audiovisual-activities.svg';
import business from '../img/index_v2/mobile/icon-outsourcing-business-support.svg';
import related from '../img/index_v2/mobile/icon-outsourcing-life-related.svg';

export const experienceData = [
  {
    id: -1,
    value: -1,
    title: '無經驗',
    label: '無經驗',
  },
  {
    id: 0,
    value: 0,
    title: '1年以下',
    label: '1年以下',
  },
  {
    id: 1,
    value: 1,
    title: '1年(含)以上',
    label: '1年(含)以上',
  },
  {
    id: 2,
    value: 2,
    title: '2年(含)以上',
    label: '2年(含)以上',
  },
  {
    id: 3,
    value: 3,
    title: '3年(含)以上',
    label: '3年(含)以上',
  },
  {
    id: 4,
    value: 4,
    title: '4年(含)以上',
    label: '4年(含)以上',
  },
  {
    id: 5,
    value: 5,
    title: '5年(含)以上',
    label: '5年(含)以上',
  },
  {
    id: 6,
    value: 6,
    title: '6年(含)以上',
    label: '6年(含)以上',
  },
  {
    id: 7,
    value: 7,
    title: '7年(含)以上',
    label: '7年(含)以上',
  },
  {
    id: 8,
    value: 8,
    title: '8年(含)以上',
    label: '8年(含)以上',
  },
  {
    id: 9,
    value: 9,
    title: '9年(含)以上',
    label: '9年(含)以上',
  },
  {
    id: 10,
    value: 10,
    title: '10年(含)以上',
    label: '10年(含)以上',
  },
];
export const demandExperienceData = [
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
export const inviteesOpts = [
  {
    label: '全部受邀者',
    value: 0,
  },
  {
    label: '待高手回覆',
    value: 1,
  },
  {
    label: '已同意溝通中',
    value: 2,
  },
  {
    label: '已確認合作',
    value: 3,
  },
  {
    label: '已完成評價',
    value: 4,
  },
  {
    label: '已婉拒合作',
    value: 5,
  },
];

export const candidateData = [
  {
    label: '全部應徵者',
    value: 0,
  },
  {
    label: '待同意溝通',
    value: 1,
  },
  {
    label: '已開始溝通',
    value: 2,
  },
  {
    label: '已確認合作',
    value: 3,
  },
  {
    label: '已完成評價',
    value: 4,
  },
  {
    label: '已婉拒合作',
    value: 5,
  },
];

export const demandExperienceDatav2 = [
  {
    value: 0,
    label: '無經驗可',
  },
  {
    value: 1,
    label: '1年以下',
  },
  {
    value: 2,
    label: '1年(含)以上',
  },
  {
    value: 3,
    label: '2年(含)以上',
  },
  {
    value: 4,
    label: '3年(含)以上',
  },
  {
    value: 5,
    label: '4年(含)以上',
  },
  {
    value: 6,
    label: '5年(含)以上',
  },
  {
    value: 7,
    label: '6年(含)以上',
  },
  {
    value: 8,
    label: '7年(含)以上',
  },
  {
    value: 9,
    label: '8年(含)以上',
  },
  {
    value: 10,
    label: '9年(含)以上',
  },
  {
    value: 11,
    label: '10年(含)以上',
  },
];

export const methodData = [
  { id: 1, title: '到客戶指定地點服務' },
  { id: 2, title: '在高手的工作室服務' },
  { id: 3, title: '透過網路或電話遠端服務' },
];
export const targetData = [
  { id: 1, title: '學齡前兒童' },
  { id: 2, title: '小學生' },
  { id: 3, title: '國中生' },
  { id: 4, title: '高中生' },
  { id: 5, title: '大專生以上' },
  { id: 6, title: '社會人士' },
];

export const targetDataV2 = [
  { value: 1, label: '學齡前兒童' },
  { value: 2, label: '小學生' },
  { value: 3, label: '國中生' },
  { value: 4, label: '高中生' },
  { value: 5, label: '大專生以上' },
  { value: 6, label: '社會人士' },
];

export const tutorGrade = [
  { label: '一年級', value: 1 },
  { label: '二年級', value: 2 },
  { label: '三年級', value: 3 },
  { label: '四年級', value: 4 },
  { label: '五年級', value: 5 },
  { label: '六年級', value: 6 },
];

export const timeSlotData = [
  {
    id: 1,
    day: '平日全時段',
    times: [{ label: '平日上午', value: 1 }, { label: '平日下午', value: 2 }, { label: '平日晚上', value: 3 }],
  },
  {
    id: 2,
    day: '假日全時段',
    times: [{ label: '假日上午', value: 4 }, { label: '假日下午', value: 5 }, { label: '假日晚上', value: 6 }],
  },
];

export const priorityData = [
  { id: 1, title: '平日上午' },
  { id: 2, title: '平日下午' },
  { id: 3, title: '平日晚上' },
  { id: 4, title: '假日上午' },
  { id: 5, title: '假日下午' },
  { id: 6, title: '假日晚上' },
];

export const priceType = ['論件計酬', '時薪'];

export function toOptions(data) {
  return data.reduce((acc, val) => acc.concat({ value: val.id, label: val.title }), []);
}

export const sexes = [
  {
    label: '男',
    value: '1',
  },
  {
    label: '女',
    value: '0',
  },
];

export const tutorSexes = [
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

export const sexTitle = [
  {
    label: '先生',
    value: '1',
  },
  {
    label: '小姐',
    value: '0',
  },
];

export const location = [
  {
    label: '是',
    value: 'yes',
  },
  {
    label: '否',
    value: 'no',
  },
];

export const personTypeOpts = [
  {
    label: '個人',
    value: 'personal',
  },
  {
    label: '公司',
    value: 'company',
  },
];

export const invoiceTypeOpts = [
  {
    label: '二聯式電子發票(個人)',
    value: '2',
  },
  {
    label: '三聯式電子發票(公司)',
    value: '3',
  },
];

// eslint-disable-next-line import/no-mutable-exports
export const identityTypeOpts = [
  {
    label: '身分證',
    value: 0,
  },
  {
    label: '護照',
    value: 1,
  },
];

export const identityTypeOptsV2 = [
  {
    label: '身分證',
    value: '0',
  },
  {
    label: '護照',
    value: '1',
  },
];

export const profileSourceList = {
  tutor: 'tutor',
  case: 'outsource',
};


export const roleTypes = [
  {
    label: '請選擇身份類別',
    value: '0',
  },
  {
    label: '在校生',
    value: '1',
  },
  {
    label: '補教老師',
    value: '2',
  },
  {
    label: '專職家教',
    value: '3',
  },
  {
    label: '現職教師',
    value: '4',
  },
  {
    label: '一般職員',
    value: '5',
  },
  {
    label: '專職SOHO',
    value: '6',
  },
  {
    label: '公務人員',
    value: '7',
  },
  {
    label: '高階管理者',
    value: '8',
  },
  {
    label: '家管',
    value: '9',
  },
  {
    label: '其他',
    value: '10',
  },
];

export const caseRoleTypes = [
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


export const tutorRoleTypes = [
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

/**
 * [0: 編輯中][0.5: 審核中][1: 刊登中][2: 退款][3: 結案][FREE: 免押金][PAY: 押金]
 */
export const demandOrderTXStatus = {
  UNPUBLISH: '0',
  UNVERIFY: '0.5',
  PUBLISH: '1',
  REFUND: '2',
  FINISH: '3',
  depositeStatus: {
    FREE: 'freeDeposite',
    PAY: 'payDeposite',
  },
};

export const chatNotifyType = [
  {
    lable: '快速簡評',
    value: 1,
  },
  {
    lable: '自行填寫評論',
    value: 2,
  },
];

export const chatEvaluateComment = [
  {
    lable: '品質好，態度佳，速度快，非常值得再次合作!',
    value: '品質好，態度佳，速度快，非常值得再次合作!',
  },
  {
    lable: '好溝通，執行力符合需求，值得再次合作!',
    value: '好溝通，執行力符合需求，值得再次合作!',
  },
  {
    lable: '符合期待，態度好，可再次合作!',
    value: '符合期待，態度好，可再次合作!',
  },
  {
    lable: '服務狀況整體尚可!',
    value: '服務狀況整體尚可!',
  },
  {
    lable: '無意願再次合作!',
    value: '無意願再次合作!',
  },
];

/**
 * 預算
 */
export const moneyData = [
  {
    id: 1,
    title: '論件計酬',
    label: '論件計酬',
    value: 0,
  },
  {
    id: 2,
    title: '時薪',
    label: '時薪',
    value: 1,
  },
];

export const defaultMoneyData = {
  unit: moneyData[0].value,
  price: 0, // 100
  step: 10,
  minCase: 1,
  minHourRate: 200,
};

/**
 * 需求人數
 */
export const partnerCountData = [
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

export const partnerCountDatav2 = [
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


export const companySizeData = [
  {
    lable: '請選擇',
    value: '0',
  },
  {
    lable: '10人以下',
    value: '1',
  },
  {
    lable: '11-50人',
    value: '2',
  },
  {
    lable: '51-100人',
    value: '3',
  },
  {
    lable: '101-300人',
    value: '4',
  },
  {
    lable: '301-500人',
    value: '5',
  },
  {
    lable: '501人以上',
    value: '6',
  },
];

export const jobTitleType = [
  {
    lable: '請選擇',
    value: '0',
  },
  {
    lable: '負責人',
    value: '1',
  },
  {
    lable: '主管',
    value: '2',
  },
  {
    lable: 'HR',
    value: '3',
  },
  {
    lable: '專案管理人',
    value: '4',
  },
  {
    lable: '一般職員',
    value: '5',
  },
  {
    lable: '顧問',
    value: '6',
  },
  {
    lable: '其他',
    value: '7',
  },
];

export const planTypeList = [
  {
    name: '基本方案',
    value: '0',
  },
  {
    name: '進階方案',
    value: '1',
  },
];

export const evaluateComment = [
  {
    label: '品質好，態度佳，速度快，值得再次合作!',
    value: '品質好，態度佳，速度快，值得再次合作!',
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

export const evaluateCommentType = [
  {
    label: '快速簡評',
    value: 0,
  },
  {
    label: '自行填寫評語',
    value: 1,
  },
];

export const communicationOpts = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '待確認合作',
    value: 1,
  },
  {
    label: '已先回報合作',
    value: 2,
  },
  {
    label: '尚未回報合作',
    value: 3,
  },
  {
    label: '回絕未合作',
    value: 4,
  },
];

export const cooperationOpts = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '尚未評價',
    value: 1,
  },
  {
    label: '已邀請待評價',
    value: 2,
  },
  {
    label: '已評價',
    value: 3,
  },
];

export const closedOpts = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '已評價結案案件',
    value: 1,
  },
  {
    label: '已合作結案案件',
    value: 2,
  },
  {
    label: '溝通中結案案件',
    value: 3,
  },
  {
    label: '回絕未合作',
    value: 4,
  },
];

export const invitedRecordOpts = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '尚末讀取',
    value: 1,
  },
  {
    label: '已讀取',
    value: 2,
  },
];


export const contactOpts = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '未回報合作',
    value: 1,
  },
  {
    label: '已回報待確認合作',
    value: 2,
  },
  {
    label: '已合作未評價',
    value: 3,
  },
  {
    label: '已合作已評價',
    value: 4,
  },
];

export const demandTypes = {
  tutor: '1',
  case: '2',
};

export const tutorFrequency = [
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

export const tutorFrequencyCount = (() => {
  const countList = [];
  for (let count = 1; count <= 20; count++) {
    countList.push({
      label: count,
      value: count,
    });
  }
  return countList;
})();

export const tutorFrequencyHour = (() => {
  const hourList = [];
  for (let hour = 0.5; hour <= 10.0; hour += 0.5) {
    hourList.push({
      label: hour,
      value: hour,
    });
  }
  return hourList;
})();

export const tutorFrequencyWeek = [
  {
    label: '週一',
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

export const timeList = [
  {
    label: '白天 9：00～18：00',
    value: '900-1800',
  },
  {
    label: '上午 9：00～12：00',
    value: '900-1200',
  },
  {
    label: '中午 12：00～13：00',
    value: '1200-1300',
  },
  {
    label: '下午 12：00～18：00',
    value: '1200-1800',
  },
  {
    label: '晚上 18：00～22：00',
    value: '1800-2200',
  },
];
export const tutorTimeList = generateTimeList(7, 23);

export const reasonData = [
  {
    value: 101,
    text: '暫無接案需求',
  },
  {
    value: 102,
    text: '找不到合適案件',
  },
  {
    value: 103,
    text: '已於其他平台找到合適案件',
  },
  {
    value: 104,
    text: '已從104高手找到合適案件，暫時無法承接新案件',
  },
  {
    value: 100,
    text: '其他原因',
  },
];

export const edmTypeOpts = [{
  label: '訂閱最新案件配對信',
  value: '1',
}];

export const teachTypes = [
  {
    label: '面對面上課',
    value: 1,
  },
  {
    label: '視訊/電話上課',
    value: 2,
  },
];


export const teachDurationTypes = [
  { label: '上短期(2個月以內)', value: 1 },
  { label: '希望上長期', value: 2 },
];

export const teachPlaceTypes = [
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


export const alreadyIMLabel = {
  1: '已邀請',
  2: '該員已主應',
  3: '溝通中',
  4: '已拒絕合作',
};

export const topperTabsName = {
  inviting: {
    id: 1,
    name: '被邀請案件',
  },
  communication: {
    id: 2,
    name: '溝通中案件',
  },
  cooperation: {
    id: 3,
    name: '合作中案件',
  },
  closed: {
    id: 4,
    name: '案主已結案案件',
  },
  applied: {
    id: 5,
    name: '已應徵案件',
  },
  contact: {
    id: 6,
    name: '查閱案件',
  },
};

export const wayOfClassTypes = [
  { label: '面對面上課', value: '1' },
  { label: '視訊/電話上課', value: '2' },
];

export const CLOSED_DEMAND_REASON = [
  { value: 1, label: '找不到合適的高手' },
  { value: 2, label: '暫時已無需求' },
  { value: 3, label: '已在別的平台找到合適高手' },
  { value: 4, label: '已由親友轉介合適高手' },
];

export const NOT_FOUND_REASON = [
  { value: 1, label: '有確認合作高手' },
  { value: 2, label: '未找到' },
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

export const hotSearchObj = {
  searchTutor: [
    {
      title: '多益考試',
      link: '/search-tutor?q=%E5%A4%9A%E7%9B%8A&utm_source=top&utm_medium=top-keyword&utm_campaign=toeic',
    },
    {
      title: '全民英檢',
      link: '/search-tutor?q=%E5%85%A8%E6%B0%91%E8%8B%B1%E6%AA%A2&utm_source=top&utm_medium=top-keyword&utm_campaign=gept',
    },
    {
      title: '英文會話',
      link: '/search-tutor?q=%E8%8B%B1%E6%96%87%E6%9C%83%E8%A9%B1&utm_source=top&utm_medium=top-keyword&utm_campaign=conversation',
    },
  ],
  search: [
    {
      title: '創意文案',
      link: '/search?q=%E6%96%87%E6%A1%88&utm_source=top&utm_medium=top-keyword&utm_campaign=copywriting',
    },
    {
      title: '平面設計',
      link: '/search?q=%E5%B9%B3%E9%9D%A2%E8%A8%AD%E8%A8%88&utm_source=top&utm_medium=top-keyword&utm_campaign=design',
    },
  ],
  caseList: [
    {
      title: '設計外包',
      link: '/caseList?q=%E8%A8%AD%E8%A8%88&utm_source=top&utm_medium=top-keyword&utm_campaign=design-case',
    },
    {
      title: '英文學習',
      link: '/caseList?cats=1003001%2C1003002&utm_source=top&utm_medium=top-keyword&utm_campaign=english-learning',
    },
    {
      title: '數理先修',
      link: '/caseList?cats=1002002%2C1002003%2C1002004&utm_source=top&utm_medium=top-keyword&utm_campaign=math-science',
    },
  ],
};

export const hotIcons = {
  1001: babysitter,
  1002: subject,
  1003: language,
  1004: music,
  1005: talent,
  1006: technical,
  1007: sport,
  200: graphic,
  300: translate,
  400: network,
  500: advertising,
  600: audiovisual,
  700: business,
  800: related,
};
