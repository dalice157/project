import React from 'react';
import styles from './SelectDemand.scss';
import tutorImage from '../../img/index/math-tutor.jpg';
import caseImage from '../../img/index/2d-design.jpg';
import { demandTypes } from '../../config/selectData';

const SelectDemand = ({ demandType, onInitialCashField, onHandleChangeDemandType }) => {
  const selectedStyle = {
    border: '#f5b524 5px solid'
  };
  return (
    <div className={styles.wrap}>
      <h1 className={styles.guide}>請問您的需求案件是以下哪一類？</h1>
      <ul className={styles.demandList}>
        <li
          className={styles.demandElement}
          onClick={() => {
            onHandleChangeDemandType(demandTypes.tutor);
            onInitialCashField(demandTypes.tutor);
          }}
          style={demandType === demandTypes.tutor ? selectedStyle : null}
        >
          <img src={tutorImage} alt="家教老師" />
          <h2 className={styles.title}>我想找家教老師</h2>
          <h3 className={styles.type}>教學類型</h3>
          <p className={styles.desc}>學科/語文/伴讀/術科/職場技能/音樂/體育/才藝</p>
        </li>
        <li
          className={styles.demandElement}
          onClick={() => {
            onHandleChangeDemandType(demandTypes.case);
            onInitialCashField(demandTypes.case);
          }}
          style={demandType === demandTypes.case ? selectedStyle : null}
        >
          <img src={caseImage} alt="外包人才" />
          <h2 className={styles.title}>我想找外包接案人才</h2>
          <h3 className={styles.type}>需求類型</h3>
          <p className={styles.desc}>設計/程式開發/行銷廣告/編輯/翻譯/影音活動/生活相關 </p>
        </li>
      </ul>
    </div>
  );
};

export default SelectDemand;
