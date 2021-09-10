import React, { PureComponent } from 'react';
import { Select, Checkbox } from 'antd';
import { Tune, ArrowForwardIos } from '@material-ui/icons';
import { catsSimpleData } from '../../util/lablesUtils.js';
import { TUTOR_RECOMMENDATION } from '../../config/constant.js';
import { wayOfClassTypes } from '../../config/selectData.js';

import Category from './Category';
import CashRange from './CashRange';
import TimeSlot from './TimeSlot';
import AreaBox from './AreaBox';

import styles from './MobileFilter.scss';

const { Option } = Select;

class MobileFilter extends PureComponent {
  render() {
    const { siderProps } = this.props;
    const { filterVisible, showFilter, hideFilter } = siderProps;
    const isToggleStyle = filterVisible ? styles.open : '';
    const clickFilter = filterVisible ? hideFilter : showFilter;

    const {
      type, catsSetting, cashs, dataAll, areaLabel, onAreaClick, setting, handleExperienceChange, handletMethodChange, handletTargetChange, handleTimeslotChange, loading, waySetting,
    } = siderProps;
    const {
      onCatsChange, data, catsValue, catNo, qValue,
    } = catsSetting;
    const { cashStart, cashEnd, onCashGo } = cashs;
    const {
      experienceData, expCatValue, methodData, methodValue, targetData, targetValue, timeSlotData, timeSlotValue,
    } = dataAll;

    const { isSetting } = setting;

    const isShowClassName = isSetting ? styles.hide : styles.show;
    const typeLabel = type === 1 ? '案件' : '服務';
    const { tutorNo } = TUTOR_RECOMMENDATION;
    const catValNo = catsValue ? catsValue[0] : null;
    const treeData = catsSimpleData(catValNo);
    const inTutorPage = treeData.key === tutorNo;

    return (
      <>
        <div className={`${styles.bg} ${isToggleStyle}`} />
        <nav className={`${styles.floatNav} ${isToggleStyle}`}>
          <div className={styles.filterWrap}>
            <div className={`${styles.sider} ${styles.mobile}`}>
              <h2 className={styles.type}>
                {typeLabel}
                分類
              </h2>
              <Category qValue={qValue} onChange={onCatsChange} value={catsValue} dataType={type} data={data} type={catNo ? 2 : 1} disabled={loading} />
              <div className={isShowClassName}>
                <h2 className={styles.type}>
                  {typeLabel}
                  金額
                </h2>
                <CashRange onCashGo={(s, e) => { onCashGo(s, e); hideFilter(); }} cashStart={cashStart} caseEnd={cashEnd} />
                {type !== 1 && (
                <div className={styles.block}>
                  <h2 className={styles.type}>
                    {typeLabel}
                    經驗
                  </h2>
                  <Select value={expCatValue && parseInt(expCatValue)} className={styles.select} onChange={handleExperienceChange} placeholder="不拘">
                    { experienceData.map(item => (
                      <Option key={item.id} value={item.id}>
                        { item.title }
                      </Option>
                    )) }
                  </Select>
                </div>
                )}
                <div className={styles.block}>
                  <h2 className={styles.type}>
                    {typeLabel}
                    地區
                  </h2>
                  <AreaBox onAreaClick={onAreaClick} areaLabel={areaLabel} />
                </div>
                {type !== 1 && (
                <div className={styles.block}>
                  <h2 className={styles.type}>
                    {typeLabel}
                    方式
                  </h2>
                  <Select value={methodValue && parseInt(methodValue)} className={styles.select} onChange={handletMethodChange} placeholder="不拘">
                    { methodData.map(item => (
                      <Option key={item.id} value={item.id}>
                        { item.title }
                      </Option>
                    )) }
                  </Select>
                </div>
                )}
                {
                ((type === 1 && !/[2-8]000000/.test(treeData.key)) || (type !== 1 && inTutorPage)) && (
                <div className={styles.block}>
                  <h2 className={styles.type}>教學對象</h2>
                  <Select value={targetValue && parseInt(targetValue)} className={styles.select} onChange={handletTargetChange} placeholder="不拘">
                    { targetData.map(item => (
                      <Option key={item.id} value={item.id}>
                        { item.title }
                      </Option>
                    )) }
                  </Select>
                </div>
                )
              }
                {
            (type === 1 && !/[2-8]000000/.test(treeData.key)) && (
            <div className={styles.block}>
              <h2 className={styles.type}>上課方式</h2>
              <Checkbox.Group
                className={styles.wayClass}
                value={waySetting.wayVal}
                onChange={waySetting.handletWayChange}
                options={wayOfClassTypes}
              />
            </div>
            )
          }
                {type !== 1 && (
                <h2 className={styles.type}>
                  {typeLabel}
                  時段
                </h2>
                )}
                {type !== 1 && (
                <TimeSlot
                  timeSlotData={timeSlotData}
                  timeSlotValue={timeSlotValue}
                  onChange={handleTimeslotChange}
                />
                )}
              </div>
            </div>
          </div>
        </nav>
        <div className={`${styles.toggle} ${isToggleStyle}`} onClick={clickFilter}>
          <ArrowForwardIos className={styles.closeIcon} />
          <Tune className={styles.openIcon} />
        </div>
      </>
    );
  }
}

export default MobileFilter;
