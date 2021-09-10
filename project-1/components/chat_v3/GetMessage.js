import React from 'react';
import { Input, Select } from 'antd';
import styles from './GetMessage.scss';
import { chatEvaluateComment } from '../../config/selectData';

const { Option } = Select;

const { TextArea } = Input;


const GetMessage = ({ comment, notifyType, onCommentChange }) => {
  let commentText = '';

  if (notifyType == 1) {
    commentText = [
      chatEvaluateComment[0].value,
      chatEvaluateComment[1].value,
      chatEvaluateComment[2].value,
      chatEvaluateComment[3].value,
      chatEvaluateComment[4].value,
    ].findIndex(el => el === comment) > -1
      ? comment
      : chatEvaluateComment[0].value;
  } else {
    commentText = comment;
  }

  switch (notifyType) {
    // case 1:
    //   return <div className={styles.title}>「本次合作愉快，麻煩您花30秒，幫我累積一下評價 / 評論，讓我得以更進步，在此先感謝您 !」</div>;
    case 1: return (
      <Select
        style={{ width: '100%' }}
        onChange={onCommentChange}
        defaultValue={chatEvaluateComment[0].value}
        value={commentText}
      >
        {
          chatEvaluateComment.map(evaluateComment => (
            <Option key={evaluateComment.value} value={evaluateComment.value}>{ evaluateComment.value }</Option>
          ))
        }
        {/* <Option value="品質好，態度佳，速度快，非常值得再次合作!">品質好，態度佳，速度快，非常值得再次合作! </Option>
        <Option value="好溝通，執行力符合需求，值得再次合作!">好溝通，執行力符合需求，值得再次合作!</Option>
        <Option value="符合期待，態度好，可再次合作!">符合期待，態度好，可再次合作!</Option>
        <Option value="服務狀況整體尚可!">服務狀況整體尚可!</Option>
        <Option value="無意願再次合作!">無意願再次合作!</Option> */}
      </Select>
    );
    case 2:
      return <TextArea className={styles.area} rows={4} onChange={onCommentChange} />;
    default:
      return null;
  }
};

export default GetMessage;
