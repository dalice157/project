import React from 'react';
import { Checkbox } from 'antd';
import Modal from '../ui/modal';
import Button from '../ui/button';
import styles from './Modal.scss';
import * as chatmetaUtil from '../../util/chatmetaUtil';

const CheckboxGroup = Checkbox.Group;

/**
 * 案主回報合作
 * @param {object} topperMeta 高手聊天 meta
 * @param {object} onTopChange
 * @param {object[]} selectedDemand 已選擇的需求資料
 */
const ReportTopper = ({
  unConfirmDemands = [], topperMeta, onTopChange, selectedDemand = [],
}) => (
  <div className={styles.buttonModal}>
    <div className={styles.text}>
      您確認已與高手
      {' '}
      <span className={styles.user}>{topperMeta.topperName}</span>
      {' '}
      完成溝通並確定合作嗎?   以下是您有發送給
      {' '}
      <span className={styles.user}>{topperMeta.topperName}</span>
      {' '}
      溝通的需求案件列表，請確認您要回報的是那件需求。請勾選後，並案下「確認」，我們將會為您通知高手，請高手確認!
    </div>
    <div className={styles.danger}>請注意：合作需雙方皆確認合作才成立，否則此訊息功能將會於開始溝通30天後關閉!!</div>
    <CheckboxGroup style={{ width: '100%' }} onChange={onTopChange} defaultValue={[]} value={selectedDemand}>
      {
        unConfirmDemands.map((demand, idx) => (
          <Checkbox key={idx} value={demand.demandId}>
            {demand.title}
            {' '}
            已確認合作高手
            {' '}
            <span className={styles.person}>{demand.partnerCount}</span>
            {' '}
            位，最多5位
          </Checkbox>
        ))
      }
    </CheckboxGroup>
  </div>
);

/**
 * 高手回報合作
 * @param {object[]} unConfirmDemands
 * @param {object} onCaseChange
 * @param {object[]} selectedDemand 已選擇的需求資料
 */
const ReportDemander = ({
  unConfirmDemands = [], onCaseChange, selectedDemand = [],
}) => (
  <div className={styles.buttonModal}>
    <div className={styles.text}>
      以下為你與此案主合作的案件，您與案主已完成溝通並已確定合作嗎?
    </div>
    <div className={styles.text}>按下「確認」後，將會通知案主你的回報，請案主確認合作! 以利繼續溝通累積您的合作評價!</div>
    <CheckboxGroup style={{ width: '100%' }} onChange={onCaseChange} defaultValue={[]} value={selectedDemand}>
      {
        unConfirmDemands.map((demand, idx) => (
          <Checkbox key={idx} value={demand.demandId}>
            {demand.title}
            {' '}
            已確認合作高手
            {' '}
            <span className={styles.person}>{demand.partnerCount}</span>
            {' '}
            位，最多5位
          </Checkbox>
        ))
      }
    </CheckboxGroup>
  </div>
);

/**
 * 案主 or 高手回報合作
 * @param {object[]} modalCase 回報合作需求
 * @param {object[]} unConfirmDemands 高手回報合作需求
 * @param {object[]} chatRole 身份
 * @param {object} topperMeta 高手聊天 meta
 * @param {object} visible UI 效果
 * @param {object} onTopChange
 * @param {object} onCaseChange
 * @param {object} onReportCoperate
 * @param {object} onCancel
 */
const ReturnModal = ({
  unConfirmDemands, chatRole, topperMeta, loading, visible, onTopChange, onCaseChange, onReportCoperate, onCancel, selectedDemand,
}) => (
  <Modal
    title="回報合作"
    visible={visible}
    onOk={onReportCoperate}
    onCancel={onCancel}
    footer={[
      <Button
        loading={loading}
        key="1"
        type="primary"
        htmlType="submit"
        onClick={onReportCoperate}
      >
        {' '}
        送出
      </Button>,
    ]}
  >
    {
        chatRole === chatmetaUtil.ROLE.DEMANDER
          ? (
            <ReportTopper
              unConfirmDemands={unConfirmDemands}
              topperMeta={topperMeta}
              onTopChange={onTopChange}
              selectedDemand={selectedDemand}
            />
          )
          : (
            <ReportDemander
              unConfirmDemands={unConfirmDemands}
              onCaseChange={onCaseChange}
              selectedDemand={selectedDemand}
            />
          )
      }
  </Modal>
);

export default ReturnModal;
