import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import {
  teachPlaceTypes, tutorGrade, priceType, partnerCountDatav2, demandExperienceDatav2, tutorRoleTypes, caseRoleTypes, targetData, tutorSexes, tutorFrequencyCount, tutorFrequencyHour, tutorFrequency, tutorFrequencyWeek, tutorTimeList, teachTypes, teachDurationTypes
} from '../../config/selectData.js';
import { showCat } from '../../util/lablesUtils.js';
import { moneyFormat, showAreaText } from '../../util/commonUtil';
import { dateFormat } from '../../config/constant';
import CreateMarkup from '../common_v2/CreateMarkup';
import { optionsToTable } from '../../util/formatUtil';
import styles from './Introduction.scss';

const generateRoleType = (roleTypes, jobOccupation) => {
  const isAllType = jobOccupation.find(no => no === 0) || jobOccupation.length === 0;
  if (isAllType) {
    return '不拘';
  } else {
    return roleTypes.filter((roleType) => {
      const roleTypeIndex = jobOccupation.find(typeNo => (typeNo === roleType.value) && roleType.label);
      if (roleTypeIndex !== null && roleTypeIndex !== undefined) {
        return roleTypes[roleTypeIndex].label;
      }
    }).map(element => element.label).join('、');
  }
};


const ExpectInfo = (partnerCount, demandInfo, isTutor) => {
  if (!demandInfo) {
    return <></>;
  }
  const experience = demandInfo && demandInfo.experience;
  const jobOccupation = demandInfo && demandInfo.jobOccupation;
  return (
    <>
      <li><span className={styles.title}>需求人數</span><span className={styles.info}>{partnerCount !== null ? optionsToTable(partnerCountDatav2)[partnerCount] : ''}</span></li>
      <li><span className={styles.title}>需求經驗</span><span className={styles.info}>{experience !== null ? optionsToTable(demandExperienceDatav2)[experience] : ''}</span></li>
      <li><span className={styles.title}>希望身份</span><span className={styles.info}>{isTutor ? (generateRoleType(tutorRoleTypes, jobOccupation)) : (generateRoleType(caseRoleTypes, jobOccupation))}</span></li>
    </>
  );
};

const StudentInfo = (demandTutorInfo, educationalStage) => {
  if (!demandTutorInfo) {
    return <></>;
  }
  const {
    studentTotal, studentSex, classFrequencyUnit, classFrequencyTime, classFrequencyHour, classEveryWeekDay, classEveryWeekHourBegin, classEveryWeekHourEnd, educationalGrade, classWay, classDuration
  } = demandTutorInfo;
  return (
    <>
      <h2 className={styles.studentTitle}>學生上課資訊：</h2>
      <li><span className={styles.title}>教學對象</span><span className={styles.info}>{educationalStage !== null ? targetData[educationalStage - 1].title : ''} {educationalGrade !== null ? optionsToTable(tutorGrade)[educationalGrade] : ''}</span></li>
      <li><span className={styles.title}>上課人數</span><span className={styles.info}>{studentTotal !== null ? optionsToTable(partnerCountDatav2)[studentTotal] : ''}</span></li>
      <li><span className={styles.title}>學生性別</span><span className={styles.info}>{studentSex !== null ? optionsToTable(tutorSexes)[studentSex] : ''}</span></li>
      <li><span className={styles.title}>希望上課方式</span><span className={styles.info}>{classWay !== null && classWay.length !== 0 ? classWay.map(value => optionsToTable(teachTypes)[value]).join('、') : <></>}</span></li>
      <li><span className={styles.title}>上課次數</span><span className={styles.info}>每{classFrequencyUnit !== null ? optionsToTable(tutorFrequency)[classFrequencyUnit] : ''}上課{tutorFrequencyCount !== null ? optionsToTable(tutorFrequencyCount)[classFrequencyTime] : ''}次，每次上課{tutorFrequencyHour !== null ? optionsToTable(tutorFrequencyHour)[classFrequencyHour] : ''}小時</span></li>
      <li><span className={styles.title}>預計上課時間</span><span className={styles.info}>每{classEveryWeekDay !== null ? classEveryWeekDay.map(value => optionsToTable(tutorFrequencyWeek)[value]).join('、') : ''}，{classEveryWeekHourBegin !== null ? optionsToTable(tutorTimeList)[classEveryWeekHourBegin] : ''}～{classEveryWeekHourEnd !== null ? optionsToTable(tutorTimeList)[classEveryWeekHourEnd] : ''}</span></li>
      <li><span className={styles.title}>預計上課期限</span><span className={styles.info}>{classDuration !== null ? optionsToTable(teachDurationTypes)[classDuration] : '' }</span></li>
    </>
  );
};

function showCatTags(arr) {
  let _rootKey = null;
  let _midKey = null;
  let _Key = null;
  let result = null;
  if (arr) {
    for (let key of arr) {
      let rootKey = null;
      let midKey = null;
      if (key % 1000 === 0) {
        rootKey = Math.floor(key / 1000000) * 1000000;
      } else {
        rootKey = Math.floor(key / 1000000) * 1000000;
        midKey = Math.floor(key / 1000) * 1000;
      }

      if (_rootKey) {
        result = (
          <>
            <Link target="_blank" to={`/caseList?cats=${_rootKey}`}>
              <Tag color="blue" key={_rootKey} itemProp="tag" property="article:tag">
                { showCat(_rootKey) }
              </Tag>
            </Link>
            { _midKey && (
              <Link target="_blank" to={`/caseList?cats=${_midKey}`}>
                <Tag color="blue" key={_midKey} itemProp="tag" property="article:tag">
                  { showCat(_midKey) }
                </Tag>
              </Link>
            ) }
            <Link target="_blank" to={`/caseList?cats=${_Key}`}>
              <Tag color="blue" key={_Key} itemProp="tag" property="article:tag">
                { showCat(_Key) }
              </Tag>
            </Link>
            { _rootKey !== rootKey && (
              <Link target="_blank" to={`/caseList?cats=${rootKey}`}>
                <Tag color="blue" key={rootKey} itemProp="tag" property="article:tag">
                  { showCat(rootKey) }
                </Tag>
              </Link>
            ) }
            { midKey && _midKey !== midKey && (
              <Link target="_blank" to={`/caseList?cats=${midKey}`}>
                <Tag color="blue" key={midKey} itemProp="tag" property="article:tag">
                  { showCat(midKey) }
                </Tag>
              </Link>
            ) }
            <Link target="_blank" to={`/caseList?cats=${key}`}>
              <Tag color="blue" key={key} itemProp="tag" property="article:tag">
                { showCat(key) }
              </Tag>
            </Link>
          </>
        );
      }

      if (!_rootKey) { _rootKey = rootKey; }
      if (!_midKey) { _midKey = midKey; }
      if (!_Key) { _Key = key; }
    }
  }


  if (!result) {
    result = (
      <>
        {
          _rootKey && (
            <Link target="_blank" to={`/caseList?cats=${_rootKey}`}>
              <Tag color="blue" key={_rootKey} itemProp="tag" property="article:tag">
                { showCat(_rootKey) }
              </Tag>
            </Link>
          )
        }
        { _midKey && (
          <Link target="_blank" to={`/caseList?cats=${_midKey}`}>
            <Tag color="blue" key={_midKey} itemProp="tag" property="article:tag">
              { showCat(_midKey) }
            </Tag>
          </Link>
        ) }
        <Link target="_blank" to={`/caseList?cats=${_Key}`}>
          <Tag color="blue" key={_Key} itemProp="tag" property="article:tag">
            { showCat(_Key) }
          </Tag>
        </Link>
      </>
    );
  }

  return result;
}

const Introduction = ({
  data, areaData
}) => {
  const {
    onlineDate, demandId, demandCategory, title, minPrice, maxPrice, unit, assignPlace, partnerCount, desc, educationalStage, demandTutorInfo, demandOutsourceInfo
  } = data;
  const dateChange = onlineDate ? dayjs(onlineDate).format(dateFormat) : '無';
  const numCase = demandId.slice(7);
  const isArea = areaData && areaData.length !== 0 && assignPlace && assignPlace.length !== 0 ? showAreaText(areaData, assignPlace) : null;
  const minNum = minPrice ? minPrice.toString() : '0';
  const maxNum = maxPrice ? maxPrice.toString() : '0';
  const isTutor = (educationalStage !== null && demandOutsourceInfo === null);

  return (
    <>
      <BrowserView>
        <div className={styles.wrap}>
          <h1><span className={styles.sort}>{title}</span><span className={styles.hide}>-{dateChange}</span></h1>
          <ul className={styles.intro}>
            <li>
              <span className={styles.title}>案件預算</span><span className={`${styles.info} ${styles.money}`}><span className={styles.type}>{ priceType[unit] === '時薪' ? '時薪' : '論件' }</span> NT$ { moneyFormat(minNum) } ~ { moneyFormat(maxNum) }<span className={styles.textSmall}> 元</span></span>
            </li>
            <li>
              <span className={styles.title}>指定地點</span>
              {
                isTutor ? (
                  <ul className={styles.info}>
                    <li><address>{isArea || '不指定'}</address></li>
                    {(demandTutorInfo && demandTutorInfo.classPlace !== null && demandTutorInfo.classPlace.length !== 0) && (<li>{demandTutorInfo.classPlace.map(value => optionsToTable(teachPlaceTypes)[value]).join('、')}</li>)}
                    {(demandTutorInfo && demandTutorInfo.classPlaceDesc !== '' && demandTutorInfo.classPlaceDesc !== null) && (<li><span>附近地標：{demandTutorInfo.classPlaceDesc}</span></li>)}
                  </ul>
                ) : <address className={styles.info}>{isArea || '不指定'}</address>
              }
            </li>
            { ExpectInfo(partnerCount, isTutor ? demandTutorInfo : demandOutsourceInfo, isTutor) }
            { demandTutorInfo ? StudentInfo(demandTutorInfo, educationalStage) : null }
            {
              desc && (
              <li className={styles.desc}>
                <span className={styles.title}>需求描述</span>
                <span className={styles.info}>
                  <CreateMarkup text={desc} />
                </span>
              </li>
              )
            }
            <li>
              <span className={styles.title}>刊登日期</span><span className={styles.info}>{dateChange}</span>
            </li>
            <li>
              <span className={styles.title}>案件編號</span><span className={styles.info}>{numCase}</span>
            </li>
          </ul>
          <div className={styles.tagWrap}>
            {
              showCatTags(demandCategory)
            }
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className={`${styles.wrap} ${styles.mobile}`}>
          <h1><span className={styles.sort}>{title}</span><span className={styles.hide}>-{dateChange}</span></h1>
          <ul className={styles.intro}>
            <li>
              <span className={styles.title}>案件預算</span><span className={`${styles.info} ${styles.money}`}><span className={styles.type}>{ priceType[unit] === '時薪' ? '時薪' : '論件' }</span> NT$ { moneyFormat(minNum) } ~ { moneyFormat(maxNum) }<span className={styles.textSmall}> 元</span></span>
            </li>
            <li>
              <span className={styles.title}>指定地點</span>
              {
                isTutor ? (
                  <ul className={styles.info}>
                    <li><address>{isArea || '不指定'}</address></li>
                    {(demandTutorInfo && demandTutorInfo.classPlace !== null && demandTutorInfo.classPlace.length !== 0) && (<li>{demandTutorInfo.classPlace.map(value => optionsToTable(teachPlaceTypes)[value]).join('、')}</li>)}
                    {(demandTutorInfo && demandTutorInfo.classPlaceDesc !== '' && demandTutorInfo.classPlaceDesc !== null) && (<li><span>附近地標：{demandTutorInfo.classPlaceDesc}</span></li>)}
                  </ul>
                ) : <address className={styles.info}>{isArea || '不指定'}</address>
              }
            </li>
            { ExpectInfo(partnerCount, isTutor ? demandTutorInfo : demandOutsourceInfo, isTutor) }
            { demandTutorInfo ? StudentInfo(demandTutorInfo, educationalStage) : null }
            {
              desc && (
              <li className={styles.desc}>
                <span className={styles.title}>需求描述</span>
                <span className={styles.info}>
                  <CreateMarkup text={desc} />
                </span>
              </li>
              )
            }
            <li>
              <span className={styles.title}>刊登日期</span><span className={styles.info}>{dateChange}</span>
            </li>
            <li>
              <span className={styles.title}>案件編號</span><span className={styles.info}>{numCase}</span>
            </li>
          </ul>
          <div className={styles.tagWrap}>
            {
              showCatTags(demandCategory)
            }
          </div>
        </div>
      </MobileView>
    </>
  );
};

export default Introduction;
