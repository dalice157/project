import React, { PureComponent } from 'react';
import {
  Radio, Select, InputNumber, Divider, Button,
} from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import dayjs from 'dayjs';
import styles from './demandForm.scss';
import { moneyData } from '../../../config/selectData';
import { cooperatingSchema } from '../../../config/validation/demnad';
// import { DebugFormik } from '../../util/DebugFormik';

const { Option } = Select;
const RadioGroup = Radio.Group;

class CommunitingForm extends PureComponent {
    renderTopperField = (topperData, topperList, setFieldValue) => topperData.map((data, index) => (
      <div key={data.key}>
        <Field
          name={`topperData[${index}].topperId`}
          render={({ field }) => (
            <div>
              <div className={styles.line}>
                <span className={styles.label}>高手名稱</span>
              </div>
              <Select
                {...field}
                onChange={(value) => {
                  setFieldValue(`topperData[${index}].topperId`, value);
                  setFieldValue(`topperData[${index}].topperName`, topperList.find(topper => topper.topperId === value)?.topperName);
                }}
                style={{ minWidth: '255px' }}
                disabled
              >
                {
                topperList.map(user => (
                  <Option key={user.topperId} value={user.topperId}>{user.topperName}</Option>
                ))
              }
              </Select>
            </div>
          )}
        />
        <Field
          name={`topperData[${index}].unit`}
          render={({ field }) => (
            <div>
              <p className={styles.label}>成交金額</p>
              <RadioGroup
                {...field}
              >
                { moneyData
                  .map(unitData => <Radio key={unitData.value} value={unitData.value}>{unitData.title}</Radio>) }
                <Radio value={-1}>目前無法提供</Radio>
              </RadioGroup>
            </div>

          )}
        />
        <Field
          name={`topperData[${index}].price`}
          render={({ field }) => (
            <div className={styles.line}>
              <span>台幣</span>
              <InputNumber
                {...field}
                disabled={(topperData[index].unit === -1)}
                style={{ width: '100px', marginLeft: '10px' }}
                onChange={(value) => {
                  if (Number.isInteger(value)) {
                    setFieldValue(`topperData[${index}].price`, value);
                  } else {
                    setFieldValue(`topperData[${index}].price`, 0);
                  }
                }}
              />
            </div>
          )}
        />
        <ErrorMessage name={`topperData[${index}].price`}>
          {msg => <p className={styles.error}>{msg}</p>}
        </ErrorMessage>
        <Divider />
      </div>
    ))

    renderForm = ({
      values, setFieldValue, handleSubmit, isSubmitting,
    }) => {
      const { data } = this.props;
      const { confirmedTopper, reviewedTopper } = data;
      const topperList = [...confirmedTopper, ...reviewedTopper];
      const { topperData } = values;
      return (
        <form onSubmit={handleSubmit}>
          <div className={styles.title}>
            需求：
            {data.demandBody.title}
          </div>
          <p className={styles.label}>請協助回報成交金額</p>
          <Divider />
          { this.renderTopperField(topperData, topperList, setFieldValue) }
          <div className={styles.center}>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>確認送出</Button>
          </div>
          {/* <DebugFormik /> */}
        </form>
      );
    }

    onSubmit = (values, actions) => {
      const {
        data, onOpenFinishedModal, demandCloseSubmit, openNotFoundForm, openEvaluation, onCloseModal,
      } = this.props;
      const { foundType, topperData } = values;
      const { demandId, depositeStatus, reviewedTopper } = data;
      actions.setSubmitting(true);

      const dealPriceList = topperData.map((topperDeal) => {
        // 目前無法提供金額
        if (topperDeal.unit === -1) {
          return {
            topperId: topperDeal.topperId,
            topperName: topperDeal.topperName,
            unit: null,
            price: null,
          };
        }
        return {
          topperId: topperDeal.topperId,
          topperName: topperDeal.topperName,
          unit: topperDeal.unit,
          price: topperDeal.price,
        };
      });
      if (foundType === 2) {
        // 有溝通高手，尚未確認合作 - 回報未找到合作高手，導入填寫原因流程
        openNotFoundForm();
      } else {
        // 有溝通高手，尚未確認合作 - 回報確認合作
        demandCloseSubmit(demandId, 0, dealPriceList).then((result) => {
          actions.setSubmitting(false);
          if (result.payload?.success) {
            const reviewedTopperIdList = reviewedTopper.map(topper => topper.topperId);
            // 已評價的高手不需要再評價
            const evaluationQueue = dealPriceList
              .filter(topper => !reviewedTopperIdList.includes(topper.topperId));
            if (evaluationQueue.length >= 1) {
              onOpenFinishedModal(depositeStatus, openEvaluation, evaluationQueue);
            } else {
              onOpenFinishedModal(depositeStatus, onCloseModal, true);
            }
          }
        });
      }
    }

    render() {
      const { data } = this.props;
      // 需輸入金額的高手包含已合作與已評價（confirmedTopper, reviewedTopper）
      const { confirmedTopper, reviewedTopper } = data;
      const topperList = [...confirmedTopper, ...reviewedTopper];
      const initialData = {
        topperData: topperList.map(topper => ({
          topperId: topper.topperId,
          topperName: topper.topperName,
          price: 0,
          unit: data.demandBody?.unit || 0,
          key: `${dayjs().format('hh:mm:ss')}-${topper.topperId}`,
        })),
      };
      return (
        <Formik
          key={`${dayjs().format('hh:mm:ss')}`}
          initialValues={initialData}
          validationSchema={cooperatingSchema}
          render={this.renderForm}
          onSubmit={this.onSubmit}
        />
      );
    }
}

export default CommunitingForm;
