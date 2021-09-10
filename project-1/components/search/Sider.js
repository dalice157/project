import React, { Fragment } from 'react';
import { BrowserView } from 'react-device-detect';

import {
  Layout, Select, Icon, Checkbox,
} from 'antd';

import { catsSimpleData } from '../../util/lablesUtils.js';
import { TUTOR_RECOMMENDATION } from '../../config/constant.js';
import { wayOfClassTypes } from '../../config/selectData.js';

import Category from './Category';
import CashRange from './CashRange';
import TimeSlot from './TimeSlot';
import AreaBox from './AreaBox';

import styles from './Sider.scss';

const { Sider } = Layout;


const { Option } = Select;


const Siders = ({
  type, catsSetting, cashs, dataAll, areaLabel, onAreaClick, setting, handleExperienceChange, handletMethodChange, handletTargetChange, handleTimeslotChange, loading, waySetting,
}) => {
  const {
    onCatsChange, data, catsValue, catNo,
  } = catsSetting;
  const { cashStart, cashEnd, onCashGo } = cashs;
  const {
    experienceData, expCatValue, methodData, methodValue, targetData, targetValue, timeSlotData, timeSlotValue,
  } = dataAll;

  const { onSettingClick, isSetting } = setting;

  const isShowClassName = isSetting ? styles.hide : styles.show;
  const isShowIcon = isSetting ? 'down' : 'up';
  const typeLabel = type === 1 ? '案件' : '服務';
  const { tutorNo } = TUTOR_RECOMMENDATION;
  const catValNo = catsValue ? catsValue[0] : null;
  const treeData = catsSimpleData(catValNo);
  const inTutorPage = treeData.key === tutorNo;
  console.log('type:', type);
  return (
    <Fragment>
      <BrowserView>
        <Sider className={styles.sider}>
          <h2 className={styles.type}>
            {typeLabel}
            分類
          </h2>
          <Category onChange={onCatsChange} value={catsValue} data={data} dataType={type} type={catNo ? 2 : 1} disabled={loading} />
          <h2 className={styles.filiter} onClick={onSettingClick}>
            進階篩選
            <Icon type={isShowIcon} />
          </h2>
          <div className={isShowClassName}>
            <CashRange
              onCashGo={onCashGo}
              cashStart={cashStart}
              caseEnd={cashEnd}
              typeLabel={typeLabel}
            />
            {type !== 1 && (
              <div className={styles.block}>
                <h3 className={styles.setTitle}>
                  {typeLabel}
                  經驗
                </h3>
                <Select value={expCatValue && parseInt(expCatValue)} className={styles.select} onChange={handleExperienceChange} placeholder="不拘">
                  {
                experienceData.map(item => (
                  <Option key={item.id} value={item.id}>{item.title}</Option>
                ))
              }
                </Select>
              </div>
            )}
            <div className={styles.block}>
              <h3 className={styles.setTitle}>
                {typeLabel}
                地區
              </h3>
              <AreaBox onAreaClick={onAreaClick} areaLabel={areaLabel} />
            </div>
            {type !== 1 && (
              <div className={styles.block}>
                <h3 className={styles.setTitle}>
                  { typeLabel }
                  方式
                </h3>
                <Select value={methodValue && parseInt(methodValue)} className={styles.select} onChange={handletMethodChange} placeholder="不拘">
                  {
                methodData.map(item => (
                  <Option key={item.id} value={item.id}>{item.title}</Option>
                ))
              }
                </Select>
              </div>
            )}
            {
              ((type === 1 && !/[2-8]000000/.test(treeData.key)) || (type !== 1 && inTutorPage)) && (
              <div className={styles.block}>
                <h3 className={styles.setTitle}>教學對象</h3>
                <Select value={targetValue && parseInt(targetValue)} className={styles.select} onChange={handletTargetChange} placeholder="不拘">
                  {
                      targetData.map(item => (
                        <Option key={item.id} value={item.id}>{item.title}</Option>
                      ))
                    }
                </Select>
              </div>
              )
            }
            {
              (type === 1 && (!/[2-8]000000/.test(treeData.key))) && (
                <div className={styles.block}>
                  <h3 className={styles.setTitle}>上課方式</h3>
                  <Checkbox.Group value={waySetting.wayVal} onChange={waySetting.handletWayChange} className={styles.wayClass} options={wayOfClassTypes} />
                </div>
              )
            }
            {type !== 1 && <TimeSlot timeSlotData={timeSlotData} timeSlotValue={timeSlotValue} onChange={handleTimeslotChange} />}
          </div>
        </Sider>
      </BrowserView>
    </Fragment>
  );
};

export default Siders;
