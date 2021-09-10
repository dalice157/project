import { Modal } from 'antd';
import React, { PureComponent } from 'react';
import { Formik, ErrorMessage } from 'formik';
import {
  Form, SubmitButton, Rate, Radio, Input, Select
} from 'formik-antd';
import styles from './EvaluationModal.scss';
import { evaluateComment, evaluateCommentType } from '../../../config/selectData';
import { validateEvaluationTopper } from '../../common_v2/Validates';
// import { DebugFormik } from '../util/DebugFormik';

const { Option } = Select;
const { TextArea } = Input;
class EvaluationModal extends PureComponent {
  EvaluationForm = ({ values }) => {
    const { onChangeGig, evaluationInfo } = this.props;
    const {
      demandTitle, topperName, commentType, titleList, comment
    } = values;
    console.log('values:', values);
    console.log('evaluationInfo:', evaluationInfo);
    const hasEvaluate = commentType === evaluateCommentType[1].value ? comment && comment.length > 0 : true;
    return (
      <Form className={styles.form}>
        <div className={styles.row}>
          <p className={styles.detail}>需求名稱：{demandTitle}</p>
        </div>
        <div className={styles.row}>
          <p className={styles.detail}>高手名稱：{topperName}</p>
        </div>
        <div className={styles.row}>
          <div className={styles.detail}>
            服務項目：
            {
              (evaluationInfo.gigIndex && evaluationInfo.gigIndex !== null) ? evaluationInfo.gigIndex.title : (
                <>
                  <Select
                    name="gigTitle"
                    className={styles.titleList}
                    onChange={onChangeGig}
                  >
                    <Option key="-" value="-">請選擇服務項目</Option>
                    {
                      titleList.map(option => (
                        <Option key={option.gigId} value={option.gigId}>
                          { option.gigTitle }
                        </Option>
                      ))
                    }
                  </Select>
                  <ErrorMessage name="gigTitle">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage>
                </>
              )
            }

          </div>
        </div>
        <div className={styles.row}>
          <p className={styles.detail}>請給予本次合作的高手評價及評論：</p>
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
          <SubmitButton type="primary" disabled={!hasEvaluate}>送出</SubmitButton>
        </div>
        {/* <DebugFormik /> */}
      </Form>
    );
  };

  render() {
    const {
      evaluationInfo, onSubmitEvaluation, onCancel, visibleEvaluation, titleList, reviewedCount, cooperatingCount
    } = this.props;
    const {
      demandTitle, topperName, topperId,
    } = evaluationInfo;
    const initialData = {
      demandTitle,
      topperName,
      titleList,
      topperId,
      reviewedCount,
      cooperatingCount,
      gigTitle: '-',
      communicationScore: 0,
      qualityScore: 0,
      recommandationScore: 0,
      commentType: 1,
      commentOption: '品質好，態度佳，速度快，值得再次合作!',
      comment: '',
    };
    return (
      <Modal
        title="給予高手評價"
        visible={visibleEvaluation}
        onCancel={onCancel}
        footer={null}
      >
        <Formik
          initialValues={initialData}
          render={this.EvaluationForm}
          onSubmit={onSubmitEvaluation}
          validationSchema={validateEvaluationTopper}
          enableReinitialize={true}
        />
      </Modal>
    );
  }
}

export default EvaluationModal;
