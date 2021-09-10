import React, { Fragment } from 'react';
import {
  Select, Input, // Icon, Upload,
} from 'antd';
import CropUploader from '../ui/cropUploader';
import Modal from '../ui/modal';
import Button from '../ui/button';
import styles from './Modal.scss';
import * as chatmetaUtil from '../../util/chatmetaUtil';
import defaultImg20 from '../ui/cropUploader/default_20.jpg';

const { Option } = Select;
const { TextArea } = Input;

const TopInnerText = ({ name }) => (
  <Fragment>
    <div className={styles.innerText}>
      過程中如遇到不實接案者，或成交後避不見面，或有騷擾行為…等，歡迎您回報相關的問題，我們將自動為您建立客服工單審查案件，並回覆您審查進度，此內容不會對外公開。
    </div>
    <div className={styles.userName}>
      <b>合作高手：</b>
      {' '}
      {name}
    </div>
  </Fragment>
);
const CaseInnerText = ({ name }) => (
  <Fragment>
    <div className={styles.innerText}>
      如遇案主案件不實，或有騷擾行為…等，歡迎您回報相關的問題，我們將自動為您建立客服工單審查案件，並回覆您審查進度，此內容不會對外公開。
    </div>
    <div className={styles.userName}>
      <b>合作案主：</b>
      {' '}
      {name}
    </div>
  </Fragment>
);

const ReportModal = ({
  title, loading, visible, handleSubmitReport, onCancel, chatRole, name, // uploadFile,
  reportOption,
  handleCauseTypeChange,
  handleTargetDemandChange,
  handleCauseDescChange,
  reportDemandList = {
    demandList: [],
    demanderId: 0,
    topperId: 0,
    topperName: '',
  },
  coverPic,
  CUploaderProps,
}) => {
  const {
    demandList,
  } = reportDemandList;
  const {
    causeType,
    targetDemandId,
    causeDesc,
  } = reportOption;

  const demandSelectList = demandList.length > 0 ? (
    <div className={styles.type}>
      <Select
        style={{ width: '100%' }}
        placeholder="請選擇合作案件"
        onChange={handleTargetDemandChange}
        value={targetDemandId === '' ? undefined : targetDemandId}
      >
        {
          demandList.map(demand => (
            <Option key={demand.demandId} value={demand.demandId}>{demand.demandTitle}</Option>
          ))
        }
      </Select>
    </div>
  ) : '';
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSubmitReport}
      onCancel={onCancel}
      footer={[
        <Button
          loading={loading}
          key="1"
          type="primary"
          htmlType="submit"
          onClick={handleSubmitReport}
        >
          {' '}
          送出
        </Button>,
      ]}
    >
      <div className={styles.modal}>
        {
            chatRole === chatmetaUtil.ROLE.DEMANDER
              ? <TopInnerText name={name} />
              : <CaseInnerText name={name} reportDemandList={reportDemandList} />
        }
        { demandSelectList }
        <div className={styles.type}>
          <Select
            style={{ width: '100%' }}
            placeholder="請選擇本次檢舉類型"
            onChange={handleCauseTypeChange}
            value={causeType === '0' ? undefined : causeType}
          >
            <Option value="1">案件合作中聯絡不上人</Option>
            <Option value="2">刊登資訊與實際不符</Option>
            <Option value="3">案件有交易糾紛</Option>
            <Option value="4">補教冒充個人刊登</Option>
            <Option value="5">安全疑慮</Option>
            <Option value="6">性騷擾</Option>
            <Option value="7">其他</Option>
          </Select>
        </div>
        <div className={styles.description}><b>檢舉事證說明：</b></div>
        <div className={styles.textArea}>
          <TextArea
            rows={4}
            placeholder="在此輸入訊息"
            autosize={{ minRows: 4, maxRows: 4 }}
            onChange={handleCauseDescChange}
            value={causeDesc}
          />
        </div>
        <div className={styles.attach}>
          <b>檢舉事證附件：</b>
          <span>(相關訊息劃面截圖或報價不實之文件資料)</span>
        </div>
        <div className={styles.img}>
          <CropUploader {...CUploaderProps}>
            <img
              src={coverPic}
              onError={(e) => {
                console.log(e);
                e.target.src = defaultImg20;
              }
              }
              alt="預設圖"
            />
          </CropUploader>
        </div>
        {/* <div className={styles.upload}>
          <Upload {...uploadFile}>
            <Button>
              <Icon type="upload" /> 選擇檔案
            </Button>
          </Upload>
        </div> */}
      </div>
    </Modal>
  );
};

export default ReportModal;
