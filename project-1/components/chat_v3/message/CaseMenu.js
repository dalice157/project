import React from 'react';
import { uaIsMobile } from 'react-device-detect';

import { Menu } from 'antd';
import styles from './CaseMenu.scss';
import StatusButton from '../StatusButton';
// import * as chatmetaUtil from '../../../util/chatmetaUtil';
import * as topperUtil from '../../../util/topperUtil';

/**
 * 所有案件抽屜 - 高手專用
 * @param {*} modalCase
 * @param {*} unConfirmDemands
 * @param {*} gigs
 * @param {*} chatmetaEvent
 */
const CaseMenu = ({
  chatRole, topperMeta, modalCase, gigs, chatmetaEvent, setDropdownUnVisible, loadDeskDemand, roomId, confirmChat
}) => {
  const drawerDemander = modalCase ? topperUtil.getDrawerCase(modalCase) : [];
  const evaluableDemands = modalCase ? topperUtil.getEvaluableDemands(modalCase) : [];
  const isMobile = uaIsMobile();
  const isStyleMobile = isMobile ? styles.mobile : '';
  return (
    <Menu className={`${styles.menu} ${isStyleMobile}`}>
      {
        drawerDemander.map((demand) => {
          return (
            <Menu.Item className={`${styles.menuItem}`} key={demand.demandId}>
              <a className={styles.title} href={`/caseInfo?basicId=${demand.demanderId}&demandId=${demand.demandId}`} target="_blank">{demand.demandTitle}</a>
              <StatusButton
                chatRole={chatRole}
                chatStatus={demand.dealStep}
                gigs={gigs}
                demand={demand}
                roomId={roomId}
                evaluableDemands={evaluableDemands}
                topperMeta={topperMeta}
                chatmetaEvent={chatmetaEvent}
                setDropdownUnVisible={setDropdownUnVisible}
                loadDeskDemand={loadDeskDemand}
                confirmChat={confirmChat}
              />
            </Menu.Item>
          );
        })
      }
    </Menu>
  );
};

export default CaseMenu;
