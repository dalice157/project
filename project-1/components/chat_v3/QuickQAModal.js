import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from 'antd';
import Modal from '../ui/modal';
import Button from '../ui/button';
import styles from './Modal.scss';
import { alreadyIMLabel } from '../../config/selectData';
import config from '../../config/config';

const ActiveDemandContent = ({ unInviteDemands, onQuickDemandChange }) => {
  let invitableDemands = [];

  if (unInviteDemands.length > 0) {
    unInviteDemands.forEach((element) => {
      invitableDemands = [...invitableDemands, {
        alreadyIM: element.alreadyIM,
        label: element.demandTitle,
        value: element.demandId,
        orderTXStatus: element.orderTXStatus,
        inviteCount: element.inviteCount,
      }];
    });
  }

  return unInviteDemands.length > 0 ? (
    <div className={styles.quickCaseContent}>
      <div className={styles.text}>以下為您的所有需求，請勾選您要再與此高手溝通的需求案件。</div>
      <div className={styles.text}>注意：若需求尚在審核中，邀請後不會立即通知高手，待審核上線刊登時，才會發送邀請訊息通知給高手。</div>
      <div className={styles.text}>已上線刊登中案件將會立即發送邀請訊息給高手。</div>
      <Checkbox.Group onChange={onQuickDemandChange}>
        {
          invitableDemands.map((demand) => {
            return (
              <Checkbox
                key={demand.value}
                value={demand.value}
                disabled={demand.alreadyIM != 0 || demand.inviteCount >= config.INVITING_LIMIT}
              >
                {demand.label}
                {
                  demand.orderTXStatus === '0.5' && (
                  <span className={`${styles.error} ${styles.errorMg}`}>(審核中)</span>
                  )
                }
                {
                  (demand.alreadyIM !== 0 && demand.inviteCount < config.INVITING_LIMIT) && (
                    <span className={`${styles.aready}`}>
                      ({alreadyIMLabel[demand.alreadyIM]})
                    </span>
                  )
                }
                {
                  demand.inviteCount >= config.INVITING_LIMIT && (
                    <span className={`${styles.aready}`}>
                      (已達邀請上限{config.INVITING_LIMIT}人)
                    </span>
                  )
                }
              </Checkbox>
            );
          })
        }
      </Checkbox.Group>
    </div>
  )
    : (
      <div className={styles.noCaseText}>
        您目前已無任何未結案之需求。 請重新新增需求，方可再與高手聯絡。
      </div>
    );
};

const ActiveDemandButton = ({
  hasCase, loading, onOk, onCancel
}) => {
  return hasCase
    ? (
      <Fragment>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          onClick={onOk}
        > 送出
        </Button>
        {/* { addDemand } */}
      </Fragment>
    )
    : (
      <Fragment>
        <Button><Link to="/demand" target="_blank">查看我的需求</Link></Button>&nbsp;&nbsp;&nbsp;&nbsp;
        {/* { addDemand } */}
        <Button type="primary" onClick={onCancel}><Link to="/caseForm" target="_blank">新增需求</Link>
        </Button>
      </Fragment>
    );
};

/**
 * 快速發問其他需求
 * @param {string} title 標題
 * @param {boolean} loading UI 效果
 * @param {boolean} visible for Modal
 * @param {object} onOk 送出
 * @param {object} onCancel 取消
 * @param {object} unInviteDemands 其他需求
 */
const QuickQAModal = ({
  title, loading, visible, onOk, onCancel, unInviteDemands, onQuickDemandChange, addDemand
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <ActiveDemandButton key="1" loading={loading} hasCase={unInviteDemands.length > 0} onOk={onOk} addDemand={addDemand} onCancel={onCancel} />
      ]}
    >
      <div className={styles.modal}>
        <ActiveDemandContent unInviteDemands={unInviteDemands} onQuickDemandChange={onQuickDemandChange} />
      </div>
    </Modal>
  );
};

export default QuickQAModal;
