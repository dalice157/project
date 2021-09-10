import React, { PureComponent } from 'react';
import dayjs from 'dayjs';
import { Room, Person } from '@material-ui/icons';
import { Badge, Tag } from 'antd';
import { priceType, targetDataV2, sexTitle } from '../../config/selectData.js';
import { dateFormat } from '../../config/constant';
import { moneyFormat, showAreaText, demandNo } from '../../util/commonUtil';
import styles from './CaseInfo.scss';
import { optionsToTable } from '../../util/formatUtil';

const targetTable = optionsToTable(targetDataV2);
class CaseInfo extends PureComponent {
  onRenderTitle = (currentPage, isLink) => {
    const {
      dealLists, inviteDate, communicateDate, cooperatedDate
    } = this.props.demandData;
    switch (currentPage) {
      case 'inviting': {
        return (dayjs(dealLists.lastWatchInviting).format(dateFormat) < dayjs(inviteDate).format(dateFormat)) ? <Badge dot>{isLink}</Badge> : isLink;
      }
      case 'communication': {
        return (dayjs(dealLists.lastWatchCommunicating).format(dateFormat) < dayjs(communicateDate).format(dateFormat)) ? <Badge dot>{isLink}</Badge> : isLink;
      }
      case 'cooperation': {
        return (dayjs(dealLists.lastWatchCooperating).format(dateFormat) < dayjs(cooperatedDate).format(dateFormat)) ? <Badge dot>{isLink}</Badge> : isLink;
      }
      default: {
        return <>{isLink}</>;
      }
    }
  }

  render() {
    const {
      title, unit, minPrice, maxPrice, assignPlace, educationalStage, area, step, demandId, demanderId, demanderFamilyName, demanderSex
    } = this.props.demandData;
    const findSex = sexTitle.find(sex => sex.value == demanderSex);
    const sexText = findSex === undefined ? '' : findSex.label;
    const demanderNameAndTitle = (demanderFamilyName == '' || sexText == '')
      ? '無資料' : `${demanderFamilyName} ${sexText}`;
    const { currentPage, isMobile } = this.props;
    const isArea = assignPlace && area.length !== 0 && assignPlace.length !== 0 ? showAreaText(area, assignPlace) : '不拘';
    const isLink = step !== 4 ? <a target="_blank" href={`/caseInfo?basicId=${demanderId}&demandId=${demandId}`}>{title}</a> : title;
    if (isMobile) {
      return (
        <>
          <div className={styles.titleWrap}>
            <div className={styles.title}>
              { this.onRenderTitle(currentPage, isLink) }
            </div>
            <div className={styles.demandNo}>
              <span>NO：{demandNo(demandId)}</span>
              { step === 4 ? <Tag color="red">已結案關閉</Tag> : <Tag color="green">刊登中</Tag> }
            </div>
            <div className={styles.caseOwner}>
              <span className={styles.text}>
                案主：{demanderNameAndTitle}
              </span>
            </div>
          </div>
          <div className={styles.price}>
            { priceType[unit] === '時薪' ? '時薪' : '論件' } NT$ { moneyFormat(String(minPrice)) } ~ { moneyFormat(String(maxPrice)) } 元
          </div>
          <div className={styles.info}>
            <div className={styles.area}>
              <Room />
              <span className={styles.text}>
                {isArea}
              </span>
            </div>
            {
              educationalStage && (
              <div className={styles.person}>
                <Person />
                <span className={styles.text}>{ targetTable[educationalStage] }</span>
              </div>
              )
            }
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.titleWrap}>
            <div className={styles.title}>
              { this.onRenderTitle(currentPage, isLink) }
            </div>
            <div className={styles.demandNo}>
              <span>NO：{demandNo(demandId)}</span>
              { step === 4 ? <Tag color="red">已結案關閉</Tag> : <Tag color="green">刊登中</Tag> }
            </div>
            <div className={styles.caseOwner}>
              <span className={styles.text}>
                案主：{demanderNameAndTitle}
              </span>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.price}>
              { priceType[unit] === '時薪' ? '時薪' : '論件' } NT$ { moneyFormat(String(minPrice)) } ~ { moneyFormat(String(maxPrice)) } 元
            </div>
            <div className={styles.area}>
              <Room />
              <span className={styles.text}>
                {isArea}
              </span>
            </div>
            {
            educationalStage && (
            <div className={styles.person}>
              <Person />
              <span className={styles.text}>{ targetTable[educationalStage] }</span>
            </div>
            )
          }
          </div>
        </>
      );
    }
  }
}

export default CaseInfo;
