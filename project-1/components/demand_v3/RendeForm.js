import React, { Component } from 'react';
import {
  Radio, Rate, Select, Input
} from 'antd';
import styles from './modal/Modal.scss';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class RenderForm extends Component {
  render() {
    const {
      nameData, closeForm, demandChange, gigId
    } = this.props;
    const { isError, errors } = this.props.errorData;
    const {
      onTopperChange, onGigChange, onCommentChange, comment, topperId, radioComment
    } = demandChange;
    const { radioCommentVal, onRadioCommentChange } = radioComment;
    const {
      ranking1Rating, ranking2Rating, ranking3Rating, ranking1RatingChange, ranking2RatingChange, ranking3RatingChange
    } = demandChange.starChange;
    const { gigs } = closeForm;
    return (
      <>
        <div className={styles.select}>
          <span className={styles.label}>高手名稱：</span>
          <Select
            style={{ minWidth: '255px' }}
            onChange={onTopperChange}
            value={topperId}
          >
            {
            nameData.map(user => (
              <Option key={user.topperId} value={user.topperId}>{user.topperName}</Option>
            ))
          }
          </Select>
          {
          isError
          && <span className={styles.error}>{errors.topperName}</span>
        }
        </div>
        <div className={styles.select}>
          <span className={styles.label}>服務項目：</span>
          <Select
            style={{ minWidth: '255px' }}
            labelInValue
            onChange={onGigChange}
            value={{ key: gigId }}
          >
            {
            gigs.map(option => (
              <Option key={option.gigId} value={option.gigId}>{option.title}</Option>
            ))
          }
          </Select>
          {
          isError
          && <span className={styles.error}>{errors.confirmedTopper}</span>
        }
        </div>
        <div className={styles.rateText}>
          請給予本次合作的高手評價及評論：
        </div>
        <div className={styles.rate}>
          <div className={styles.item}>
            <span className={styles.rateType}>高手的溝通及處理態度</span>
            <div className={styles.rateWrap}>
              <span className={styles.lowRate}>要加油</span>
              <Rate className={styles.rateIcon} allowHalf onChange={ranking1RatingChange} value={ranking1Rating} />
              <span className={styles.highRate}>很棒</span>
            </div>
          </div>
          <div className={styles.item}>
            <span className={styles.rateType}>高手的服務品質滿意度</span>
            <div className={styles.rateWrap}>
              <span className={styles.lowRate}>不滿意</span>
              <Rate className={styles.rateIcon} allowHalf onChange={ranking2RatingChange} value={ranking2Rating} />
              <span className={styles.highRate}>很滿意</span>
            </div>
          </div>
          <div className={styles.item}>
            <span className={styles.rateType}>是否推薦此高手給朋友</span>
            <div className={styles.rateWrap}>
              <span className={styles.lowRate}>不會</span>
              <Rate className={styles.rateIcon} allowHalf onChange={ranking3RatingChange} value={ranking3Rating} />
              <span className={styles.highRate}>一定會</span>
            </div>
          </div>
          {
          isError
          && <span className={styles.error}>{errors.rankingRating}</span>
        }
        </div>
        <RadioGroup className={styles.radio} onChange={onRadioCommentChange} value={radioCommentVal}>
          <Radio value={1}>
            快速簡評
          </Radio>
          <Radio value={2}>
            自行填寫評論
          </Radio>
        </RadioGroup>
        {
        radioCommentVal === 1 && (
          <>
            <div className={styles.commentText}>請選出符合您的簡評</div>
            <Select
              className={styles.commentSelect}
              style={{ width: '100%' }}
              onChange={onCommentChange}
              value={comment}
              defaultValue="品質好，態度佳，速度快，非常值得再次合作!"
            >
              <Option value="品質好，態度佳，速度快，非常值得再次合作!">品質好，態度佳，速度快，非常值得再次合作! </Option>
              <Option value="好溝通，執行力符合需求，值得再次合作!">好溝通，執行力符合需求，值得再次合作!</Option>
              <Option value="符合期待，態度好，可再次合作!">符合期待，態度好，可再次合作!</Option>
              <Option value="服務狀況整體尚可!">服務狀況整體尚可!</Option>
              <Option value="無意願再次合作!">無意願再次合作!</Option>
            </Select>
          </>
        )
      }
        {
        radioCommentVal === 2 && (
          <TextArea
            className={styles.textArea}
            rows={4}
            onChange={onCommentChange}
            placeholder="請填寫您的評論"
            autoSize={{ minRows: 4, maxRows: 4 }}
          />
        )
      }
        {
          isError
          && <span className={styles.error}>{errors.comment}</span>
        }
      </>
    );
  }
}

export default RenderForm;
