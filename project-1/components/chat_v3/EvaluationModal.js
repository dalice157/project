import React, { Component } from 'react';
import {
  Select, Rate, Checkbox, Radio,
} from 'antd';
import Modal from '../ui/modal';
import Button from '../ui/button';
import GetMessage from './GetMessage';
import styles from './Modal.scss';
import { chatNotifyType } from '../../config/selectData';
import * as chatmetaUtil from '../../util/chatmetaUtil';

const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

/**
 * 合作評價-評價高手
 * @param {object[]} onEvaluateDemandChange
 * @param {object[]} demands 需求
 */
const EvaluateTopper = ({
  topperMeta = {}, gigs = [], onEvaluateDemandChange, demands = [], defaultEvaluation = {},
  notifyType,
  onNotifyTypeChange,
}) => {
  const {
    eveluateDemandId,
    gigId,
    starChange,
    comment,
    onDemandChange,
    onTopperChange,
    onGigChange,
    onCommentChange,
  } = onEvaluateDemandChange;
  const {
    ranking1RatingChange,
    ranking2RatingChange,
    ranking3RatingChange,
    ranking1Rating,
    ranking2Rating,
    ranking3Rating,
  } = starChange;

  return (
    <div className={styles.buttonModal}>
      <div className={styles.text}>
        請給予，為您完成需求的高手本次服務的評價 / 評論
      </div>
      <div className={styles.select}>
        <span className={styles.label}>需求名稱：</span>
        <Select
          style={{ minWidth: '200px' }}
          onChange={onDemandChange}
          defaultValue={defaultEvaluation.demandId}
          value={eveluateDemandId}
        >
          {
            demands.map(demand => (
              <Option key={demand.demandId} value={demand.demandId}>{demand.demandTitle}</Option>
            ))
          }
        </Select>
      </div>
      <div className={styles.text}>
        合作高手名稱及對應之服務：
      </div>
      <div className={styles.select}>
        <span className={styles.label}>高手名稱：</span>
        <Select
          style={{ minWidth: '200px' }}
          onChange={onTopperChange}
          defaultValue={topperMeta.topperName}
        >
          <Option key={topperMeta.topperId} value={topperMeta.topperId}>{topperMeta.topperName}</Option>
        </Select>
      </div>
      <div className={styles.select}>
        <span className={styles.label}>服務項目：</span>
        <Select
          style={{ minWidth: '255px' }}
          onChange={onGigChange}
          placeholder="請選擇該需求對應高手的服務項目"
          defaultValue={defaultEvaluation.gigId}
          value={gigId}
        >
          {
            gigs.map(gig => (
              <Option key={gig.gigId} value={gig.gigId}>{gig.title}</Option>
            ))
          }
        </Select>
      </div>
      <div className={styles.text}>
        請給予本次合作的高手評價及評論：
      </div>
      <div className={styles.rate}>
        <div className={styles.item}>
          <span className={styles.rateType}>高手的溝通及處理態度</span>
          <div className={styles.rateWrap}>
            <span className={styles.lowRate}>要加油</span>
            <Rate allowHalf onChange={ranking1RatingChange} value={ranking1Rating} />
            <span className={styles.highRate}>很棒</span>
          </div>
        </div>
        <div className={styles.item}>
          <span className={styles.rateType}>高手的服務品質滿意度</span>
          <div className={styles.rateWrap}>
            <span className={styles.lowRate}>不滿意</span>
            <Rate allowHalf onChange={ranking2RatingChange} value={ranking2Rating} />
            <span className={styles.highRate}>很滿意</span>
          </div>
        </div>
        <div className={styles.item}>
          <span className={styles.rateType}>是否推薦此高手給朋友</span>
          <div className={styles.rateWrap}>
            <span className={styles.lowRate}>不會</span>
            <Rate allowHalf onChange={ranking3RatingChange} value={ranking3Rating} />
            <span className={styles.highRate}>一定會</span>
          </div>
        </div>
      </div>
      <RadioGroup onChange={onNotifyTypeChange} defaultValue={chatNotifyType[1].value} value={notifyType}>
        {
          chatNotifyType.map((notifyTypeEnum, index) => (
            <Radio key={index} value={notifyTypeEnum.value}>{ notifyTypeEnum.lable }</Radio>
          ))
        }
      </RadioGroup>
      <GetMessage
        notifyType={notifyType}
        comment={comment}
        onCommentChange={onCommentChange}
      />
    </div>
  );
};

/**
 * 邀請案主評價
 * @param {object[]} demands 可評價的需求
 * @param {string[]} gigs 服務類型
 */
class EvaluateDemander extends Component {
  render() {
    const {
      demands = [],
      gigs = [],
      onEvaluateDemandChange = [],
      // notifyType = 0,
      // onNotifyTypeChange = {}
    } = this.props;
    const {
      eveluateDemandId,
      evaluateDemands,
      onDemandChange,
      onGigChange,
      // onCommentChange
    } = onEvaluateDemandChange;
    return (
      <div className={`${styles.buttonModal} ${styles.case}`}>
        <div className={styles.text}>
          <strong>
            你與案主合作需求
            {' '}
            <span className={styles.user}>{demands.length}</span>
            {' '}
            件
          </strong>
        </div>
        <div className={styles.text}>以下為你合作的案件，本次你要請案主評價的是那件需求?</div>
        <div className={styles.text}>選擇需求，並按下「確認」後，將會發送訊息通知案主，請案主評價幫你累積接案經驗與評價!</div>
        <CheckboxGroup onChange={onDemandChange} value={eveluateDemandId}>
          {
          demands.map((demand, idx) => {
            const defaultGig = evaluateDemands.some(evaluateDemand => evaluateDemand.demandId === demand.demandId)
              ? evaluateDemands.find(evaluateDemand => evaluateDemand.demandId === demand.demandId).gigId
              : '請選擇本次評薦，屬於您設定哪個服務類型';
            return (
              <Checkbox key={idx} value={demand.demandId}>
                {demand.demandTitle}
                <SelectServiceType gigs={gigs} onChange={gigId => onGigChange(gigId, demand)} defaultGig={defaultGig} />
              </Checkbox>
            );
          })
      }
        </CheckboxGroup>
        {
          (eveluateDemandId.length === 0 || (evaluateDemands == undefined || evaluateDemands.length === 0)) && <span className={styles.error}>請選擇服務項目</span>
        }
        {/* <div className={styles.text}>
          <strong>顯示通知訊息內容：</strong>
        </div>
        <RadioGroup onChange={onNotifyTypeChange} defaultValue={1} value={notifyType}>
          <Radio value={1}>快速簡評</Radio>
          <Radio value={2}>自行填寫評論</Radio>
        </RadioGroup>
        <GetMessage
          values={notifyType}
          onCommentChange={onCommentChange}
        /> */}
      </div>
    );
  }
}

/**
 * 服務類型
 */
const SelectServiceType = ({ gigs, onChange, defaultGig }) => (
  <Select onChange={onChange} defaultValue="請選擇本次評薦，屬於您設定哪個服務類型" value={defaultGig}>
    {
      gigs.map((gig, idx) => (
        <Option key={idx} value={gig.gigId}>{gig.title}</Option>
      ))
    }
  </Select>
);

/**
 * 合作評價-評價高手 or 邀請案主評價
 * @param {object[]} modalCase 可評價的需求
 * @param {string} chatRole 身份
 * @param {boolean} loading UI 效果
 * @param {boolean} visible UI 效果
 * @param {object} onOk 送出
 * @param {object} onCancel 取消
 * @param {object} onEvaluateDemandChange
 * @param {?} gigs 可選服務項目
 */
const EvaluationModal = ({
  chatRole, topperMeta, evaluableDemands, gigs, loading, visible, onOk, onCancel, onEvaluateDemandChange, notifyType, onNotifyTypeChange, defaultEvaluation,
}) => {
  const titleName = chatRole === chatmetaUtil.ROLE.DEMANDER ? '合作評價' : '邀請案主評價';
  const { eveluateDemandId, evaluateDemands } = onEvaluateDemandChange;
  const isDisabled = chatRole !== chatmetaUtil.ROLE.DEMANDER && (eveluateDemandId.length === 0 || (evaluateDemands == undefined || evaluateDemands.length === 0)) ? 'disabled' : 'primary';

  return (
    <Modal
      title={titleName}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button
          loading={loading}
          key="1"
          type={isDisabled}
          htmlType="submit"
          onClick={onOk}
        >
          {' '}
          送出
        </Button>,
      ]}
    >
      {
        chatRole === chatmetaUtil.ROLE.DEMANDER
          ? (
            <EvaluateTopper
              demands={evaluableDemands}
              topperMeta={topperMeta}
              gigs={gigs}
              defaultEvaluation={defaultEvaluation}
              onEvaluateDemandChange={onEvaluateDemandChange}
              notifyType={notifyType}
              onNotifyTypeChange={onNotifyTypeChange}
            />
          )
          : (
            <EvaluateDemander
              demands={evaluableDemands}
              gigs={gigs}
              onEvaluateDemandChange={onEvaluateDemandChange}
              notifyType={notifyType}
              onNotifyTypeChange={onNotifyTypeChange}
            />
          )
      }
    </Modal>
  );
};

export default EvaluationModal;
