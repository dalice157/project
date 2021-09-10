/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  Input, Tag, Icon
} from 'antd';
import { Clear, FilterNone } from '@material-ui/icons';
import styles from './ServiceItems.scss';
import CropUploader from '../ui/cropUploader';
import TreeSelect from '../ui/treeSelect';
import defaultImg from '../../img/default.jpg';
// import { moneyData, experienceData } from './popoverData.js';
import MoneyAmount from './MoneyAmount';
import Experience from './Experience';
import Area from './Area';
import Method from './Method';
import Target from './Target';
import TimeSlot from './TimeSlot';
import defaultImg20 from '../ui/cropUploader/default_20.jpg';
import { isContainTutorCats } from '../../util/lablesUtils.js';

const { TextArea } = Input;

/**
 * 服務項目
 */
class Card extends Component {
  state = {
    value: undefined,
    pic: defaultImg,
    oriFile: null,
    fileId: null,
    catTag: [],
    inputVisible: false,
    desc: '',
    inputValue: '',
    title: this.props.title,
    isMoneyOpen: false,
    isExperienceOpen: false,
    isMethodOpen: false,
    isTargetOpen: false,
    isTimeOpen: false,
  }

  componentDidMount() {
    const { gig, coverPic } = this.props;
    const { body } = gig;

    this.setState({
      desc: body && body.desc ? gig.body.desc : '',
      pic: coverPic.length ? coverPic : defaultImg,
      fileId: body && body.coverPic ? gig.body.coverPic : '',
    });
  }

  preReceverCropImg = ({
    fileId,
    fileUrlMap,
    coordinate
  }) => {
    console.log(`preReceverCropImg fileId: ${fileId} , fileUrlMap: ${fileUrlMap} , coordinate is ${coordinate}`);
    console.log('fileUrlMap', fileUrlMap);
    console.log(fileUrlMap);

    this.setState({
      pic: fileUrlMap.w600,
      oriFile: fileUrlMap.origin,
      fileId: fileId
    });
  }

  receverCropFid = ({ fileId, coordinate }) => {
    const { gig, onGigChange, } = this.props;
    const { onCoverPicChange } = onGigChange;
    const coverPic = { [fileId]: [this.state.pic] };
    console.log(`onStartProcessing fileId: ${fileId} , coordinate is ${coordinate}`);
    onCoverPicChange({ id: gig.id, coverPic: coverPic });
    this.setState({
      fileId: fileId
    });
  }

  receverCropImg = ({
    fileId,
    fileUrlMap,
    coordinate
  }) => {
    const { gig, onGigChange, } = this.props;
    const { onCoverPicChange } = onGigChange;
    const coverPic = { [fileId]: [fileUrlMap.url[0]] };
    console.log(`onFinishProcessing fileId: ${fileId} , fileUrlMap: ${fileUrlMap} , coordinate is ${coordinate}`);
    console.log('fileUrlMap', fileUrlMap);
    console.log(fileUrlMap.url[0]);

    onCoverPicChange({ id: gig.id, coverPic: coverPic });
    this.setState({
      pic: fileUrlMap.url[0],
      oriFile: fileUrlMap.origin[0],
      fileId: fileId
    });
  }

  handleClose = (removedTag) => {
    const { gig, onGigChange } = this.props;
    const gigCatTag = gig.catTag.filter(tag => tag !== removedTag);
    onGigChange.onCatTagChange({ id: gig.id, catTag: gigCatTag });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { gig, onGigChange } = this.props;
    let gigCatTag = gig.catTag ? gig.catTag : [];

    if (inputValue && gigCatTag && gigCatTag.indexOf(inputValue) === -1) {
      gigCatTag = [...gigCatTag, inputValue];
    }

    onGigChange.onCatTagChange({ id: gig.id, catTag: gigCatTag });

    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  }

  // 服務名稱: 最多 20 個字
  onTitleChange({ e = {}, id = '', onGigChange = {} }) {
    const title = String(e.target.value).substring(0, 20);
    onGigChange.onTitleChange({ id: id, title: title });
  }

  onDescChange({ e = {}, gig = {}, onGigChange = {} }) {
    onGigChange.onDescChange({ id: gig.id, desc: e.target.value });
    this.setState({ desc: e.target.value });
  }

  saveInputRef = input => this.input = input

  handleMoneyOpen = () => {
    this.setState(state => ({
      isMoneyOpen: !state.isMoneyOpen,
      isExperienceOpen: false,
      isMethodOpen: false,
      isTargetOpen: false,
      isTimeOpen: false,
    }));
  }

  handleMoneyClose = () => {
    this.setState({
      isMoneyOpen: false,
    });
  }

  handleExperienceOpen = () => {
    this.setState(state => ({
      isMoneyOpen: false,
      isExperienceOpen: !state.isExperienceOpen,
      isMethodOpen: false,
      isTargetOpen: false,
      isTimeOpen: false,
    }));
  }

  handleExperienceClose = () => {
    this.setState({
      isExperienceOpen: false,
    });
  }

  handleAreaOpen = () => {
    this.setState({
      isMoneyOpen: false,
      isExperienceOpen: false,
      isMethodOpen: false,
      isTargetOpen: false,
      isTimeOpen: false,
    });
  }

  handleMethodOpen = () => {
    this.setState(state => ({
      isMoneyOpen: false,
      isExperienceOpen: false,
      isMethodOpen: !state.isMethodOpen,
      isTargetOpen: false,
      isTimeOpen: false,
    }));
  }

  handleMethodClose = () => {
    this.setState({
      isMethodOpen: false,
    });
  }

  handleTargetOpen = () => {
    this.setState(state => ({
      isMoneyOpen: false,
      isExperienceOpen: false,
      isMethodOpen: false,
      isTargetOpen: !state.isTargetOpen,
      isTimeOpen: false,
    }));
  }

  handleTargetClose = () => {
    this.setState({
      isTargetOpen: false,
    });
  }

  handleTimeOpen = () => {
    this.setState(state => ({
      isMoneyOpen: false,
      isExperienceOpen: false,
      isMethodOpen: false,
      isTargetOpen: false,
      isTimeOpen: !state.isTimeOpen,
    }));
  }

  handleTimeClose = () => {
    this.setState({
      isTimeOpen: false,
    });
  }

  render() {
    const {
      inputVisible,
      inputValue,
      desc,
      isMoneyOpen,
      isExperienceOpen,
      isMethodOpen,
      isTargetOpen,
      isTimeOpen,
    } = this.state;
    const {
      gigsLength, gig, coverPic, areaCats, onClickCopy, onClickDel, onGigChange,
    } = this.props;
    const CUploaderProps = {
      aspect: 16 / 9,
      fileId: this.state.fileId,
      oriFile: this.state.oriFile,
      onBeforeProcessing: this.preReceverCropImg,
      onStartProcessing: this.receverCropFid,
      onFinishProcessing: this.receverCropImg,
      editable: true,
      componentType: 'gallery',
      buttonPosition: 'center'
    };
    const {
      id,
      title,
      body,
      catTag,
      cats,
    } = gig;
    const {
      unit,
      price,
      exp,
      area,
      onsiteOpts,
      clientCats,
      priority,
      desc: gigDesc,
    } = body;
    const money = {
      unit: unit,
      price: price,
    };

    // console.log(gig);
    // 若只剩一組，不顯示刪除功能
    const deleteBtn = gigsLength > 1
      ? <a onClick={() => onClickDel(gig.id, gig)} href="#"><Clear /></a>
      : '';

    // TODO: 第一次開啟時編輯圖片功能
    // console.log('CUploaderProps: ', CUploaderProps);
    const isTargetRequired = isContainTutorCats(cats); // 服務類型包含家教/技能類，該欄位必填
    const clientCatsLength = clientCats.length;
    const shouldTargetOpen = isTargetOpen || isTargetRequired && clientCatsLength == 0;
    // console.log(`id: ${id}, isTargetRequired: ${isTargetRequired}, isTargetOpen: ${isTargetOpen}, shouldTargetOpen: ${shouldTargetOpen}`);

    const catsWarrning = cats.length ? '' : (
      <span className={styles.validate}>請選擇服務類型</span>
    );
    const isValidate = title.length == 0 ? styles.validate : '';
    console.log(

      `
      id : ${id}
      cats : ${cats}
      `
    );


    return (
      <div className={styles.main}>
        <div className={styles.img}>
          <CropUploader {...CUploaderProps}>
            <img
              src={coverPic || this.state.pic}
              onError={(e) => { e.target.src = defaultImg20; }}
              alt={title || '預設圖'}
            />
          </CropUploader>
        </div>
        <input
          type="text"
          placeholder="請填寫服務名稱(必填)"
          className={`${styles.serviceInp} ${isValidate}`}
          value={title}
          onChange={e => this.onTitleChange({ e: e, id: id, onGigChange: onGigChange })}
        />
        <TreeSelect
          id={id}
          cats={cats}
          onCatsChange={onGigChange.onCatsChange}
        />
        <MoneyAmount
          title="金額"
          id={id}
          money={money}
          isMoneyOpen={isMoneyOpen}
          handleMoneyOpen={this.handleMoneyOpen}
          handleMoneyClose={this.handleMoneyClose}
          onMoneyChange={onGigChange.onMoneyChange}
        />
        <Experience
          title="經驗"
          id={id}
          exp={exp}
          isExperienceOpen={isExperienceOpen}
          handleExperienceOpen={this.handleExperienceOpen}
          handleExperienceClose={this.handleExperienceClose}
          onExperienceChange={onGigChange.onExperienceChange}
        />
        <Area
          title="地區"
          areaCats={areaCats}
          gig={gig}
          id={id}
          area={area}
          handleAreaOpen={this.handleAreaOpen}
          onAreaChange={onGigChange.onAreaChange}
        />
        <Method
          title="方式"
          id={id}
          onsiteOpts={onsiteOpts}
          isMethodOpen={isMethodOpen}
          handleMethodOpen={this.handleMethodOpen}
          handleMethodClose={this.handleMethodClose}
          onMethodChange={onGigChange.onMethodChange}
        />
        { isTargetRequired ? (
          <Target
            title="對象"
            id={id}
            clientCats={clientCats}
            isTargetOpen={isTargetOpen}
            handleTargetOpen={this.handleTargetOpen}
            handleTargetClose={this.handleTargetClose}
            isTargetRequired={isTargetRequired}
            onTargetChange={onGigChange.onTargetChange}
          />
        ) : null}
        <TimeSlot
          title="時段"
          id={id}
          priority={priority}
          isTimeOpen={isTimeOpen}
          handleTimeOpen={this.handleTimeOpen}
          handleTimeClose={this.handleTimeClose}
          onTimeSlotChange={onGigChange.onTimeSlotChange}
        />
        <TextArea
          className={styles.textArea}
          placeholder="請詳細描述服務內容，可提高客戶聯絡機會！"
          autosize={{ minRows: 2, maxRows: 6 }}
          onChange={e => this.onDescChange({ e: e, gig: gig, onGigChange: onGigChange })}
          value={gigDesc}
        />
        { (gigDesc.length > 2500) ? <p className={styles.error}>服務內容不可超過2500個字</p> : <></> }
        <div className={styles.tags}>
          {
            catTag && catTag.length > 0 && catTag.map((tag) => {
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag key={tag} closable onClose={() => this.handleClose(tag)} itemProp="tag" property="article:tag">
                  {isLongTag ? `${tag.slice(0, 5)}...` : `${tag}`}
                </Tag>
              );
              return tagElem;
            })
          }
          {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
          )}
          {!inputVisible && catTag && catTag.length < 6 && (
            <a onClick={this.showInput}>
              <Tag
                className={styles.tag}
                itemProp="tag"
                property="article:tag"
              >
                <Icon type="plus" /> 新增服務標籤
              </Tag>
            </a>
          )}
        </div>
        <div className={styles.setting}>
          <a onClick={onClickCopy(gig.id)} href="#"><FilterNone /></a>
          {deleteBtn}
        </div>
      </div>
    );
  }
}

export default Card;
