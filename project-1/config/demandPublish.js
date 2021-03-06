import { getCatChildrenList, catsTreeData } from '../util/lablesUtils';

const content = [
  // 圖像/製圖 平面設計/美編、貼圖/插畫設計: 0
  // 2001000 2002000
  '案件內容說明範例：\n1. 製作需求：例如餐廳DM美編設計，尺寸A4雙面，偏好文青風格，相關圖片由我方提供，完成後給予AI原始檔等等\n2. 執行時間：例如10月底前完成\n3. 注意事項：例如應徵請附上相關作品、相關技能、是否須配合開會，是否為急件、需長期合作等',
  // 圖像/製圖 室內設計、建築設計、舞台/展場設計、景觀園藝設計: 1
  // 2003000 2004000 2005000 2006000
  '案件內容說明範例：\n1. 執行需求：例如3C商品展場設計，展場位於室內，設計內容包含丈量、繪圖、估價等等，希望具現代感的風格等\n2. 執行時間：例如10月底前完成\n3. 注意事項：例如應徵請附上相關作品、相關證照、是否須配合開會、是否需長期合作等',
  // 圖像/製圖 產品與工業設計、水電及工程繪圖、電子電路設計、服裝設計製作: 2
  // 2007000 2008000 2009000 2010000
  '案件內容說明範例：\n1. 執行需求：例如3C產品繪圖設計，需要2D和3D建模＋渲染，目前已有手繪圖稿，需要轉繪電子圖檔等\n2. 執行時間：例如10月底前完成\n3. 注意事項：例如應徵請附上相關作品、相關技能、是否須配合開會，是否為急件、需長期合作等',
  // 編輯/翻譯 文字翻譯、同步口譯: 3
  // 3003000 3004000
  '案件內容說明範例：\n1. 執行需求：例如需要翻譯的語言、文件類型、翻譯主題、是否需要相關專業知識用語，原文大約字數（或頁數），是否需要排版服務\n2. 交搞日期：例如10月底前完成\n3. 注意事項：例如應徵請附上相關作品、證照、旅居國外經驗、是否須配合開會、是否為急件、需長期合作等',
  // 編輯/翻譯 文字創作、採訪編輯、排版/校對、教材編寫、書籍編輯、文字Keyin、聽打: 4
  // 3001000 3002000 3007000 3005000 3006000 3008000 3009000
  '案件內容說明範例：\n1. 執行需求：例如需要撰寫或編輯的文章類別主題，內容大約字數，是否需置入圖片素材，素材由我方或接案方提供，希望行文風格等等\n2. 交稿日期：例如10月底前完成\n3. 注意事項： 例如應徵請附上相關作品、部落格或社群粉絲數要求、是否須配合開會、是否為急件、需長期合作等',
  // 資訊網路 網頁設計: 5
  // 4001000
  '案件內容說明範例：\n1. 執行需求：例如需求的網站類型，須規劃座全新的網站、將原有網站重新設計、增加新功能或修改功能，還是升級為RWD響應式網站，是否\n2. 執行時間：例如10月底前完成\n3. 注意事項：例如應徵請附上相關作品、使用工具、是否須配合開會、是否為急件、需長期合作等',
  // 資訊網路 資料庫工程、通訊/網路工程、程式開發、聊天機器人建置、QC/QA、韌體/硬體程式、ERP規劃、IT技術諮詢: 6
  // 4003000 4002000 4004000 4005000 4006000 4007000 4009000 4010000
  '案件內容說明範例：\n1. 執行需求：例如需要開發的項目例如網站、後端管理系統、電腦應用程式、手機應用程式、手遊或電腦遊戲等等，希望使用哪種程式語言，是否需要部屬、維護或其他技術支援，是否已有介面流程和測試版等\n2. 執行時間：例如10月底前完成\n3. 注意事項：例如應徵請附上相關作品、使用工具、是否須配合開會、是否為急件、需長期合作等',
  // 行銷/廣告(全類): 7
  // 5000000
  '案件內容說明範例：\n1. 執行需求：例如需要FB/IG或其他論壇社群平台的小編，所經營的社群產品類型，一個月需多少則貼文、貼文形式，圖片或相關素材由我方或接案方提供，貼文成效或目標追蹤等\n2. 執行時間：例如10-11月\n3. 注意事項：例如應徵請附上相關作品、部落格或社群粉絲數要求、是否須配合開會、是否為急件、需長期合作等',
  // 影音/活動 影像拍攝/後製、多媒體動畫、音樂創作、配音: 8
  // 6004000 6003000 6001000 6002000
  '案件內容說明範例：\n1. 執行需求：例如Youtube影片需要後製和剪輯，影片長度約5-10分鐘，另需上字幕和音效配置，已有拍攝好的毛片，需要的影片風格等\n2. 執行時間：例如10月底前完成\n3. 注意事項：例如應徵請附上相關作品、使用工具、是否須配合開會、是否為急件、需長期合作等',
  // 影音/活動 活動企劃/主持、表演者與DJ、模特兒/演員、造型設計: 9
  // 6005000 6007000 6008000 6006000
  '案件內容說明範例：\n1. 執行需求：例如活動的類型、場地、活動時間、活動人數，是否需要主持人或表演者、額外的燈光、音響、桌椅等硬體支援等\n2. 執行時間：例如10/20-10/22\n3. 注意事項：例如應徵請附上相關作品、是否須配合開會等',
  // 商務支援(全類): 10
  // 7000000
  '案件內容說明範例：\n1. 執行需求：例如需要諮詢的類型，預設目標或想學會的項目等\n2. 執行時間：例如兩週內\n3. 注意事項：例如應徵請附上相關作品、諮詢教學方式、是否需長期合作等',
  // 生活相關(全類): 11
  // 8000000
  '案件內容說明範例：\n1. 執行需求：例如需要一般居家清潔服務，地點區域，空間約20坪，有幾間衛浴需打掃，是否有養寵物，預估打掃時間和可打掃時段，需要清潔的頻率等\n2. 執行時間：例如週六或日下午時段\n3. 注意事項：例如應徵請附上相關經驗等',
];

const generateLargeCatList = (largeCat, contentIndex) => {
  let catChildrenList = getCatChildrenList(largeCat);
  let indexObject = { [largeCat]: contentIndex };
  for (let element of catChildrenList) {
    indexObject[element] = contentIndex;
  }
  return indexObject;
};

const contentIndex = {
  2001000: 0,
  2002000: 0,
  2003000: 1,
  2004000: 1,
  2005000: 1,
  2006000: 1,
  2007000: 2,
  2008000: 2,
  2009000: 2,
  2010000: 2,
  3003000: 3,
  3004000: 3,
  3001000: 4,
  3002000: 4,
  3007000: 4,
  3005000: 4,
  3006000: 4,
  3008000: 4,
  3009000: 4,
  4001000: 5,
  4003000: 6,
  4002000: 6,
  4004000: 6,
  4005000: 6,
  4006000: 6,
  4007000: 6,
  4009000: 6,
  4010000: 6,
  ...generateLargeCatList(5000000, 7),
  6004000: 8,
  6003000: 8,
  6001000: 8,
  6002000: 8,
  6005000: 9,
  6007000: 9,
  6008000: 9,
  6006000: 9,
  ...generateLargeCatList(7000000, 10),
  ...generateLargeCatList(8000000, 11),
};
const getContentByCat = (cat) => {
  if (!cat) {
    return null;
  }
  return content[contentIndex[cat]];
};

const generateTimeList = (startTime = 7, endTime = 23) => {
  let timeList = [];
  for (let hour = startTime; hour <= endTime; hour++) {
    timeList.push(
      {
        value: Number(`${hour + '00'}`),
        label: `${hour + ':00'}`,
        hour: hour,
      },
      {
        value: Number(`${hour + '30'}`),
        label: `${hour + ':30'}`,
        hour: hour,
      }
    );
  }
  return timeList;
};

const tutorTreeData = Object.assign({}, catsTreeData(1000000)).children;
const caseTreeData = Array(...catsTreeData(0)).splice(1, 8);

export {
  getContentByCat,
  generateTimeList,
  tutorTreeData,
  caseTreeData,
};
