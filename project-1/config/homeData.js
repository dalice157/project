import findTeacher1 from '../img/index_v2/find-teacher-1.svg';
import findTeacher2 from '../img/index_v2/find-teacher-2.svg';
import findTeacher3 from '../img/index_v2/find-teacher-3.svg';
import findTeacher4 from '../img/index_v2/find-teacher-4.svg';

import findCase1 from '../img/index_v2/find-case-1.svg';
import findCase2 from '../img/index_v2/find-case-2.svg';
import findCase3 from '../img/index_v2/find-case-3.svg';
import findCase4 from '../img/index_v2/find-case-4.svg';
import findCase5 from '../img/index_v2/find-case-5.svg';
import findCase6 from '../img/index_v2/find-case-6.svg';

import profileTeacher1 from '../img/index_v2/profile-teacher-1.jpg';
import profileTeacher2 from '../img/index_v2/profile-teacher-2.jpg';
import profileTeacher3 from '../img/index_v2/profile-teacher-3.jpg';

import profileCase1 from '../img/index_v2/profile-case-1.jpg';
import profileCase2 from '../img/index_v2/profile-case-2.jpg';
import profileCase4 from '../img/index_v2/profile-case-4.jpg';

import avatarTeacher1 from '../img/index_v2/avatar-teacher-1.jpg';
import avatarTeacher2 from '../img/index_v2/avatar-teacher-2.jpg';
import avatarTeacher3 from '../img/index_v2/avatar-teacher-3.jpg';
import avatarTeacher4 from '../img/index_v2/avatar-teacher-4.jpg';
import avatarTeacher5 from '../img/index_v2/avatar-teacher-5.jpg';

import avatarCase1 from '../img/index_v2/avatar-case-1.jpg';
import avatarCase2 from '../img/index_v2/avatar-case-2.jpg';
import avatarCase3 from '../img/index_v2/avatar-case-3.jpg';
import avatarCase4 from '../img/index_v2/avatar-case-4.jpg';
import avatarCase5 from '../img/index_v2/avatar-case-5.jpg';

import teacherStep1 from '../img/index_v2/teacher_step_1.svg';
import teacherStep2 from '../img/index_v2/teacher_step_2.svg';
import teacherStep3 from '../img/index_v2/teacher_step_3.svg';

import caseStep1 from '../img/index_v2/case_step_1.png';
import caseStep2 from '../img/index_v2/case_step_2.png';
import caseStep3 from '../img/index_v2/case_step_3.png';


export const teacherData = [
  {
    title: '學科教學',
    img: findTeacher1,
    subData: [
      {
        title: '伴讀',
        link: '?cats=1001000'
      },
      {
        title: '數學',
        link: '?cats=1002002'
      },
      {
        title: '國文',
        link: '?cats=1002001'
      },
      {
        title: '物理',
        link: '?cats=1002004'
      },
      {
        title: '化學',
        link: '?cats=1002005'
      },
      {
        title: '生物',
        link: '?cats=1002010'
      },
      {
        title: '歷史',
        link: '?cats=1002006'
      },
      {
        title: '地理',
        link: '?cats=1002007'
      },
    ]
  },
  {
    title: '語文教學',
    img: findTeacher2,
    subData: [
      {
        title: '英文',
        link: '?cats=1003001'
      },
      {
        title: '英文寫作',
        link: '?cats=1003002'
      },
      {
        title: '日文',
        link: '?cats=1003003'
      },
      {
        title: '韓文',
        link: '?cats=1003004'
      },
      {
        title: '中文華語',
        link: '?cats=1003012'
      },
      {
        title: '法文',
        link: '?cats=1003006'
      },
      {
        title: '德文',
        link: '?cats=1003005'
      },
    ]
  },
  {
    title: '休閒才藝',
    img: findTeacher3,
    subData: [
      {
        title: '鋼琴/電子琴',
        link: '?cats=1004001'
      },
      {
        title: '大/小提琴',
        link: '?cats=1004002'
      },
      {
        title: '繪畫',
        link: '?cats=1005002'
      },
      {
        title: '體育/舞蹈',
        link: '?cats=1007000'
      },
    ]
  },
  {
    title: '術科/職場技能',
    img: findTeacher4,
    subData: [
      {
        title: '微積分',
        link: '?q=微積分'
      },
      {
        title: '統計學',
        link: '?q=統計學'
      },
      {
        title: '財會/金融類',
        link: '?cats=1006002'
      },
      {
        title: '資訊軟體系統類',
        link: '?cats=1006004'
      },
      {
        title: '檢定考試',
        link: '?cats=1006010'
      },
    ]
  },
];


export const caseData = [
  {
    title: '圖像/製圖',
    img: findCase1,
    subData: [
      {
        title: '平面設計/美編',
        link: '?cats=2001000'
      },
      {
        title: '貼圖/插畫設計',
        link: '?cats=2002000'
      },
      {
        title: '室內設計',
        link: '?cats=2004000'
      },
      {
        title: '產品與工業設計',
        link: '?cats=2008000'
      },
      {
        title: '建築設計',
        link: '?cats=2003000'
      },
      {
        title: '水電及工程繪圖',
        link: '?cats=2009000'
      },
    ]
  },
  {
    title: '編輯翻譯',
    img: findCase2,
    subData: [
      {
        title: '文字創作',
        link: '?cats=3001000'
      },
      {
        title: '採訪編輯',
        link: '?cats=3002000'
      },
      {
        title: '文字翻譯',
        link: '?cats=3004000'
      },
      {
        title: '教材編寫',
        link: '?cats=3005000'
      },
      {
        title: '排版校對',
        link: '?cats=3007000'
      },
      {
        title: '文字KEY-IN',
        link: '?cats=3008000'
      },
    ]
  },
  {
    title: '資訊網路',
    img: findCase3,
    subData: [
      {
        title: '網頁設計',
        link: '?cats=4001000'
      },
      {
        title: '資料庫工程',
        link: '?cats=4003000'
      },
      {
        title: '程式開發',
        link: '?cats=4004000'
      },
      {
        title: 'ERP規劃',
        link: '?cats=4009000'
      },
      {
        title: '聊天機器人',
        link: '?cats=4005000'
      },
      {
        title: 'IT技術諮詢',
        link: '?cats=4010000'
      },
    ]
  },
  {
    title: '行銷/廣告',
    img: findCase4,
    subData: [
      {
        title: 'SEO/關鍵字',
        link: '?cats=5001000'
      },
      {
        title: '社群經營',
        link: '?cats=5002000'
      },
      {
        title: '網路廣告',
        link: '?cats=5004000'
      },
      {
        title: '部落客/網紅',
        link: '?cats=5006000'
      },
    ]
  },
  {
    title: '影音/活動',
    img: findCase5,
    subData: [
      {
        title: '多媒體動畫',
        link: '?cats=6003000'
      },
      {
        title: '影像拍攝/後製',
        link: '?cats=6004000'
      },
      {
        title: '活動企劃/主持',
        link: '?cats=6005000'
      },
      {
        title: '音樂創作',
        link: '?cats=6001000'
      },
    ]
  },
  {
    title: '商業支援',
    img: findCase6,
    subData: [
      {
        title: '產品企劃',
        link: '?cats=7001000'
      },
      {
        title: '會計與稅務',
        link: '?cats=7005000'
      },
      {
        title: '商業營運諮詢',
        link: '?cats=7004000'
      },
      {
        title: '商品上架',
        link: '?cats=7009000'
      },
    ]
  },
];

// 精選專業師資
export const professionalTeacherData = [
  {
    basicId: 3417534944020948,
    profileName: '林心',
    avatarFileUrl: avatarTeacher1,
    reviewScore: '4.9',
    dealCount: '28',
    schoolName: '國立中興大學',
    exp: 5,
    cats: '數理、物理',
    reviewComment: '104家教網金牌老師。林心老師提供教學場所上課/輔導/自習空間，課堂風趣幽默讓學生喜歡上課，每一堂課規劃上課進度，數學物理生活化，獨特的上課教學，不同以往古板方式記法，學數學物理化學更活用。'
  },
  {
    basicId: 3361669812132636,
    profileName: '欣霓',
    avatarFileUrl: avatarTeacher2,
    reviewScore: '5.0',
    dealCount: '21',
    schoolName: '景文科技大學',
    exp: 3,
    cats: '英文',
    reviewComment: '104家教網金牌老師之一，大學二年級在補習班，擔任過英文輔導老師，對學生很有耐心。教學認真負責，不遲到不早退的老師，家教上課時間可彈性，以學生和學生家長為主。'
  },
  {
    basicId: 3412089981046725,
    profileName: '志宇',
    avatarFileUrl: avatarTeacher3,
    reviewScore: '5.0',
    dealCount: '20',
    schoolName: '台北科技大學',
    exp: 10,
    cats: '資工專業課程',
    reviewComment: '從事專職家教已超過十年，教學品質相當穩定。主要教授的科目為國高中數學、微積分、資訊工程相關課程。偏重理解並實作，從觀念去推想要如何實作出來，進而漸漸能培養出自己解題及寫作程式的想法。'
  },
  {
    basicId: 3357861239579989,
    profileName: '邱老師',
    avatarFileUrl: avatarTeacher4,
    reviewScore: '5.0',
    dealCount: '39',
    schoolName: '國立彰化師範大學',
    exp: 10,
    cats: '國文、作文',
    reviewComment: '曾擔任桃園縣國中國文代課教師、國中國小國文作文補習班老師、國小文言文啟蒙班視訊教學，並且在彰師大就學期間，擔任「國文」、「生命教育」課程教學助理，對於輔導各年齡階層學生的國文課業和心靈成長有許多經驗。'
  },
  {
    basicId: 3369272021763190,
    profileName: '芷萱',
    avatarFileUrl: avatarTeacher5,
    reviewScore: '5.0',
    dealCount: '41',
    schoolName: '巴黎大學',
    exp: 8,
    cats: '英文、法文',
    reviewComment: '無論是聽說讀寫，或是針對升學考試、企業界英文需求，全都有豐富的教授經驗，提供30分免費試教。'
  },
];

export const professionalCaseData = [
  {
    basicId: 8762430771398840,
    profileName: 'Mandy Chang',
    avatarFileUrl: avatarCase1,
    reviewScore: '5.0',
    dealCount: '34',
    exp: 5,
    cats: '#文案採訪寫作',
    reviewComment: '前報社、電視台記者，現專職自由接案，擅長品牌故事、商品文案與採訪寫作。'
  },
  {
    basicId: 8747826618780540,
    profileName: 'miniking00李先生',
    avatarFileUrl: avatarCase2,
    reviewScore: '5.0',
    dealCount: '47',
    exp: 9,
    cats: '#平面設計美編',
    reviewComment: '在設計相關職場上有著9年的豐富實戰經驗，目前為個人兼職接案，美學能力、執行能力及創意發想上有著紮實的底子，並且堅持設計出良好的作品。'
  },
  {
    basicId: 8804604153940351,
    profileName: '鈺欣',
    avatarFileUrl: avatarCase3,
    reviewScore: '4.9',
    dealCount: '11',
    exp: 5,
    cats: '#平面設計美編',
    reviewComment: '提供各式平面設計服務，Banner、活動頁、型錄、DM/菜單、品牌設計等，歡迎洽詢看更多作品。'
  },
  {
    basicId: 8748060120839946,
    profileName: 'Helen',
    avatarFileUrl: avatarCase4,
    reviewScore: '5.0',
    dealCount: '28',
    exp: 10,
    cats: '#網站建置',
    reviewComment: '專長品牌規畫設計、網站設計建置與UI/UX設計。'
  },
  {
    basicId: 2766111807463087,
    profileName: 'Renee Lin',
    avatarFileUrl: avatarCase5,
    reviewScore: '4.6',
    dealCount: '6',
    exp: 10,
    cats: '#品牌規劃',
    reviewComment: '擅長為品牌商品抓定位，洞悉消費者心理。從商品設計、品牌設定、廣告行銷建議、視覺設計，系統化包攬，和團隊一起建立長期的合作默契。'
  },
];

export const popularTeacherData = [
  {
    topperId: 2846763816096472,
    topperPicUrl: profileTeacher1,
    demandTitle: '指考教學',
    reviewScore: '4.8',
    profileName: '冠宏',
    area: '雙北市',
    exp: 1,
    reviewComment: '教學內容認真，找出學員問題，主動提出改善方法，以自身經驗融合學員認知，是位很棒教師！'
  },
  {
    topperId: 2808886720443094,
    topperPicUrl: profileTeacher2,
    demandTitle: '國一英文',
    reviewScore: '5.0',
    profileName: '翊庭',
    area: '雙北市',
    exp: 2,
    reviewComment: '老師教學非常認真，對小孩也很有耐心，出勤紀律更是一級棒，很開心能經由高手網認識翊庭老師，真心推薦！'
  },
  {
    topperId: 3168451968017641,
    topperPicUrl: profileTeacher3,
    demandTitle: '小三小提琴',
    reviewScore: '5.0',
    profileName: '楊竣傑',
    area: '雙北市',
    exp: 9,
    reviewComment: '品質好，態度佳，速度快，非常值得再次合作！'
  },
];

export const popularCaseData = [
  {
    topperId: 2882933809387546,
    topperPicUrl: profileCase1,
    demandTitle: '商品貼紙設計',
    reviewScore: '4.7',
    profileName: 'Omnivorous Studio',
    area: '台中市',
    exp: 1,
    reviewComment: '好溝通，執行力符合需求，值得再次合作！'
  },
  {
    topperId: 3219050926968907,
    topperPicUrl: profileCase2,
    demandTitle: '聊天機器人建置',
    reviewScore: '5.0',
    profileName: 'Don',
    area: '台北市',
    exp: 0,
    reviewComment: '作品很符合需求且效率極佳，態度也很親切，很值得推薦的人。'
  },
  {
    topperId: 3245353371691985,
    topperPicUrl: null,
    demandTitle: '研討會活動拍照攝影',
    reviewScore: '5.0',
    profileName: '楊承翰',
    area: '台灣地區',
    exp: 3,
    reviewComment: '品質好，態度佳，速度快，非常值得再次合作！'
  },
  {
    topperId: 3200837208225598,
    topperPicUrl: profileCase4,
    demandTitle: 'javascript coding',
    reviewScore: '4.5',
    profileName: '雷希股份有限公司',
    area: '台灣地區',
    exp: 5,
    reviewComment: '品質好，態度佳，速度快，非常值得再次合作！'
  },
  {
    topperId: 3194573135099871,
    topperPicUrl: null,
    demandTitle: '美妝商品白底照精修',
    reviewScore: '5.0',
    profileName: '何冠儒',
    area: '台灣地區',
    exp: 5,
    reviewComment: '品質好，態度佳，速度快，非常值得再次合作！'
  },
  {
    topperId: 3263314268542374,
    topperPicUrl: null,
    demandTitle: '急徵文字編輯',
    reviewScore: '4.5',
    profileName: '源茹',
    area: '台灣地區',
    exp: 0,
    reviewComment: '好溝通，執行力符合需求，值得再次合作！'
  },
];

export const teacherStep = [
  {
    id: 1,
    img: teacherStep1,
    desc: '填寫徵師條件，免費刊登案件'
  },
  {
    id: 2,
    img: teacherStep2,
    desc: '專業師資主動應徵，或直接邀請老師面試'
  },
  {
    id: 3,
    img: teacherStep3,
    desc: '與老師進一步溝通，確認錄取人選'
  },
];

export const caseStep = [
  {
    id: 1,
    img: caseStep1,
    desc: '填寫需求內容和細節，免費刊登案件'
  },
  {
    id: 2,
    img: caseStep2,
    desc: '接案高手主動應徵聯絡，或直接邀請人才報價'
  },
  {
    id: 3,
    img: caseStep3,
    desc: '雙方進一步溝通後，確認合作人選'
  },
];
