import React, { PureComponent } from 'react';
import {
  Select, Button, Rate, Radio, Input,
} from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import styles from './demandForm.scss';
import { evaluateCommentType, EVALUATION_COMMENT } from '../../../config/selectData';
import { evaluationSchema } from '../../../config/validation/demnad';
// import { DebugFormik } from '../../util/DebugFormik';

const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class EvaluateForm extends PureComponent {
    renderForm = ({
      setFieldValue, values, handleSubmit, isSubmitting,
    }) => {
      const {
        gigList, data, evaluationQueue,
      } = this.props;
      const { confirmedTopper } = data;
      const { commentType, gigTitle } = values;
      const hasNextEvaluation = evaluationQueue.length >= 1;
      const gigListTable = gigList.reduce((table, gig) => {
        table[gig.gigTitle] = gig.gigId;
        return table;
      }, {});
      return (
        <form onSubmit={handleSubmit}>
          <p className={styles.label}>請協助給予合作高手評價以茲鼓勵！</p>
          <Field
            name="topperName"
            render={({ field }) => (
              <div>
                <div className={styles.line}>
                  <span className={styles.label}>高手名稱</span>
                </div>
                <Select
                  {...field}
                  style={{ minWidth: '255px' }}
                  disabled
                >
                  {
                confirmedTopper.map(user => (
                  <Option key={user.topperId} value={user.topperId}>{user.topperName}</Option>
                ))
              }
                </Select>
              </div>
            )}
          />
          <Field
            name="gigTitle"
            render={({ field }) => (
              <div>
                <div className={styles.line}>
                  <span className={styles.label}>服務項目</span>
                </div>
                <Select
                  {...field}
                  style={{ minWidth: '255px' }}
                  value={gigTitle || '請選擇該需求對應高手的服務項目'}
                  onChange={(value) => {
                    setFieldValue('gigTitle', value);
                    setFieldValue('gigId', gigListTable[value]);
                  }}
                >
                  {
                gigList.map(user => (
                  <Option key={user.gigId} value={user.gigTitle}>{user.gigTitle}</Option>
                ))
              }
                </Select>
              </div>
            )}
          />
          <ErrorMessage name="gigTitle">
            {msg => <p className={styles.error}>{msg}</p>}
          </ErrorMessage>
          <div className={`${styles.block}`}>
            <Field
              name="ranking1"
              render={({ field }) => (
                <div className={`${styles.line} ${styles.evaluate}`}>
                  <span className={styles.label}>合作高手的溝通及處理態度</span>
                  <Rate
                    {...field}
                    allowHalf
                    onChange={value => setFieldValue('ranking1', value)}
                  />
                </div>
              )}
            />
            <Field
              name="ranking2"
              render={({ field }) => (
                <div className={`${styles.line} ${styles.evaluate}`}>
                  <span className={styles.label}>合作高手的服務品質滿意度</span>
                  <Rate
                    {...field}
                    allowHalf
                    onChange={value => setFieldValue('ranking2', value)}
                  />
                </div>
              )}
            />
            <Field
              name="ranking3"
              render={({ field }) => (
                <div className={`${styles.line} ${styles.evaluate}`}>
                  <span className={styles.label}>
                    是否推薦此高手給朋友
                    {'　　'}
                  </span>
                  <Rate
                    {...field}
                    allowHalf
                    onChange={value => setFieldValue('ranking3', value)}
                  />
                </div>
              )}
            />
          </div>
          <ErrorMessage name="ranking1">
            {msg => <p className={styles.error}>{msg}</p>}
          </ErrorMessage>
          <ErrorMessage name="ranking2">
            {msg => <p className={styles.error}>{msg}</p>}
          </ErrorMessage>
          <ErrorMessage name="ranking3">
            {msg => <p className={styles.error}>{msg}</p>}
          </ErrorMessage>
          <Field
            name="commentType"
            render={({ field }) => (
              <RadioGroup
                {...field}
                options={evaluateCommentType}
                onChange={(event) => {
                  setFieldValue('comment', '');
                  setFieldValue('commentType', event.target.value);
                }}
              />
            )}
          />
          {
            commentType === 0 && (
              <Field
                name="comment"
                render={({ field }) => (
                  <Select
                    {...field}
                    value={values.comment || '請選出符合您的簡評'}
                    onChange={value => setFieldValue('comment', value)}
                  >
                    { EVALUATION_COMMENT
                      .map(comment => <Option key={comment.value} value={comment.value}>{comment.label}</Option>) }
                  </Select>
                )}
              />
            )
          }
          {
            commentType === 1 && (
              <Field
                name="comment"
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder="請填寫您的評論"
                    autoSize={{ minRows: 4, maxRows: 4 }}
                    onChange={event => setFieldValue('comment', event.target.value)}
                  />
                )}
              />
            )
          }
          <ErrorMessage name="comment">
            {msg => <p className={styles.error}>{msg}</p>}
          </ErrorMessage>
          <div className={styles.center}>
            <Button onClick={this.onCancelSubmit}>下次再評</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>{hasNextEvaluation ? '繼續評價下一位' : '送出評價'}</Button>
          </div>
          {/* <DebugFormik /> */}
        </form>
      );
    }

    onCancelSubmit = () => {
      const { handleNextEvaluation, evaluationQueue } = this.props;
      const hasNextEvaluation = evaluationQueue.length >= 1;
      handleNextEvaluation(hasNextEvaluation);
    }

    onSubmit = (values, actions) => {
      const {
        data, evaluationQueue, evaluationTopper, evaluateTopper, handleNextEvaluation,
      } = this.props;
      const { demandId, demandBody } = data;
      const demandTitle = demandBody.title;
      const {
        comment, ranking1, ranking2, ranking3, gigTitle, gigId,
      } = values;
      const reviewBody = {
        comment, demandId, demandTitle, gigTitle, ranking1, ranking2, ranking3,
      };
      const hasNextEvaluation = evaluationQueue.length >= 1;
      evaluateTopper(evaluationTopper.topperId, gigId, reviewBody)
        .then((result) => {
          actions.setSubmitting(false);
          if (result.payload?.success) {
            handleNextEvaluation(hasNextEvaluation);
          }
        });
    }

    render() {
      const { evaluationTopper } = this.props;
      const initialData = {
        topperName: evaluationTopper.topperName,
        gigTitle: '',
        gigId: 0,
        ranking1: 0,
        ranking2: 0,
        ranking3: 0,
        commentType: 0,
        comment: '',
      };
      return (
        <Formik
          key={`${evaluationTopper.topperName}`}
          initialValues={initialData}
          validationSchema={evaluationSchema}
          onSubmit={this.onSubmit}
          render={this.renderForm}
        />
      );
    }
}

export default EvaluateForm;
