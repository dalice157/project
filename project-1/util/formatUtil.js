import React from 'react';
import dayjs from 'dayjs';
import { dateFormat } from '../config/constant';

export const generateStarRate = (score) => {
  const ceilScore = Math.ceil(score);
  const floorScore = Math.floor(score);
  if (score === ceilScore || score === floorScore) {
    return score;
  } else if (score <= (floorScore + 0.5)) {
    return floorScore + 0.5;
  }
  return ceilScore;
};

export const formatFileSize = (size) => {
  // MB size
  const isSizeLarge = size >= 1000000 && size < 1000000000;
  // KB size
  const isSizeMedium = size >= 1000 && size < 1000000;
  if (isSizeLarge) {
    return `${Math.round(size / 1000000)} MB`;
  } else if (isSizeMedium) {
    return `${Math.round(size / 1000)} KB`;
  }
  return `${size} byte`;
};

export const optionsToTable = options => options.reduce((result, target) => {
  result[target.value] = target.label;
  return result;
}, {});

export const renderDateInfo = (dateList, styles) => {
  // 舊日期 -> 新日期
  dateList.sort((a, b) => a.date && b.date && a.date.diff(b.date));
  return (
    <>
      { dateList.map(dateData => dateData.isShow && (
      <div key={dateData.text} className={`${styles.infoNo} ${dateData.isWarningStyle ? styles.reject : ''}`}>
        {dateData.text}
        {' '}
        {dateData.date ? dateData.date.format(dateFormat) : ''}
      </div>
      )) }
    </>
  );
};

export const dayFormat = (val) => {
  if (val === 'current') {
    return dayjs().format(dateFormat);
  }
  return dayjs(val).format(dateFormat);
};
