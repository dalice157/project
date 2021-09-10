import React from 'react';
import { Formik, ErrorMessage } from 'formik';
import {
  Form, SubmitButton, Rate, Radio, Input, Select
} from 'formik-antd';
import styles from './EDM.scss';
import { evaluateComment, evaluateCommentType } from '../../config/selectData';
import { validateEvaluationEDM } from '../common_v2/Validates';
// import { DebugFormik } from '../util/DebugFormik';

const EvaluationEDMForm = (props) => {
  const { values } = props;
  const {
    demandTitle, topper, commentType, gigTitle, comment, commentOption, hasSubmit
  } = values;
  const { Option } = Select;
  const { TextArea } = Input;
  const isCommentUsed = (commentType === evaluateCommentType[0].value) ? commentOption : comment;
  const allowSubmit = !hasSubmit && isCommentUsed;
  return (
    <Form className={styles.wrap}>
      <div className={styles.brand}>
        <div className={styles.sign} />
        <h1 className={styles.pageTitle}>合作評價</h1>
      </div>
      <div className={styles.form}>
        <div className={styles.row}>
          <p className={styles.detail}>需求名稱：{demandTitle}</p>
        </div>
        <div className={styles.row}>
          <p className={styles.detail}>合作高手：{topper}</p>
        </div>
        <div className={styles.row}>
          <p className={styles.detail}>給予評價的服務項目：{gigTitle}</p>
        </div>
        <div className={styles.row}>
          <p className={styles.require}>請給予本次合作的高手評價及評論：</p>
        </div>
        <div className={`${styles.row} ${styles.rate}`}>
          <span className={styles.rateTitle}>高手的溝通及處理態度</span>
          <div className={styles.rateWrap}>
            <span className={styles.lowRate}>要加油</span>
            <Rate allowClear={false} className={styles.rateIcon} name="communicationScore" allowHalf />
            <span className={styles.highRate}>很棒</span>
          </div>
          <ErrorMessage name="communicationScore">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={`${styles.row} ${styles.rate}`}>
          <span className={styles.rateTitle}>高手的服務品質滿意度</span>
          <div className={styles.rateWrap}>
            <span className={styles.lowRate}>不滿意</span>
            <Rate allowClear={false} className={styles.rateIcon} name="qualityScore" allowHalf />
            <span className={styles.highRate}>很滿意</span>
          </div>
          <ErrorMessage name="qualityScore">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={`${styles.row} ${styles.rate}`}>
          <span className={styles.rateTitle}>是否推薦此高手給朋友</span>
          <div className={styles.rateWrap}>
            <span className={styles.lowRate}>不會</span>
            <Rate allowClear={false} className={styles.rateIcon} name="recommandationScore" allowHalf />
            <span className={styles.highRate}>一定會</span>
          </div>
          <ErrorMessage name="recommandationScore">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
        </div>
        <div className={styles.row}>
          <Radio.Group name="commentType">
            {evaluateCommentType.map(type => <Radio value={type.value} key={type.value}>{type.label}</Radio>)}
          </Radio.Group>
        </div>
        <div className={styles.row}>
          {
            commentType === evaluateCommentType[0].value
              ? (
                <Select
                  name="commentOption"
                  className={styles.comment}
                >
                  {evaluateComment.map(option => (
                    <Option key={option.label} value={option.value}>{ option.value }</Option>
                  ))}
                </Select>
              )
              : (<TextArea name="comment" className={styles.commentTextarea} />)
            }
        </div>
        <div className={styles.btn}>
          <SubmitButton type="primary" disabled={!allowSubmit}>送出</SubmitButton>
        </div>
      </div>
      {/* <DebugFormik /> */}
    </Form>
  );
};

const EvaluationEDM = (props) => {
  const { initialData, onSubmitEvaluation } = props;
  return (
    <Formik
      initialValues={initialData}
      render={EvaluationEDMForm}
      onSubmit={onSubmitEvaluation}
      validationSchema={validateEvaluationEDM}
      enableReinitialize={true}
    />
  );
};
export default EvaluationEDM;
