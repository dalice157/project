import React, { PureComponent } from 'react';
import {
  Radio, Select, Divider, Button, InputNumber,
} from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import dayjs from 'dayjs';
import { Delete } from '@material-ui/icons';
import styles from './demandForm.scss';
import { moneyData, NOT_FOUND_REASON } from '../../../config/selectData';
import { communitingSchema } from '../../../config/validation/demnad';
// import { DebugFormik } from '../../util/DebugFormik';

const { Option } = Select;
const RadioGroup = Radio.Group;

class CommunitingForm extends PureComponent {
    renderTopperField = (topperData, negotiatedTopper, setFieldValue, foundType) => {
      const selectedTopperId = topperData.map(topper => topper.topperId);
      return topperData.map((data, index) => (
        <div key={data.key}>
          <Field
            name={`topperData[${index}].topperId`}
            render={({ field }) => (
              <div>
                <div className={styles.line}>
                  <span className={styles.label}>高手名稱</span>
                  {
                  index > 0 && (
                  <Delete
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      const newTopperData = [...topperData];
                      newTopperData.splice(index, 1);
                      setFieldValue('topperData', newTopperData);
                    }}
                  />
                  ) }
                </div>
                <Select
                  {...field}
                  value={topperData[index]?.topperName || '請選擇合作高手'}
                  onChange={(value) => {
                    setFieldValue(`topperData[${index}].topperId`, value);
                    setFieldValue(`topperData[${index}].topperName`, negotiatedTopper.find(topper => topper.topperId === value)?.topperName);
                  }}
                  style={{ minWidth: '255px' }}
                  disabled={foundType === 2}
                >
                  {
                negotiatedTopper
                  .filter(topper => !selectedTopperId.includes(topper.topperId))
                  .map(topper => <Option key={topper.topperId} value={topper.topperId}>{topper.topperName}</Option>)
                }
                </Select>
                <ErrorMessage name={`topperData[${index}].topperId`}>
                  {msg => <p className={styles.error}>{msg}</p>}
                </ErrorMessage>
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
                  disabled={foundType === 2}
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
                  disabled={(topperData[index].unit === -1) || foundType === 2}
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
      ));
    };

    renderForm = ({
      values, setFieldValue, handleSubmit, isSubmitting,
    }) => {
      const { data, openNotFoundForm } = this.props;
      const { negotiatedTopper } = data;
      const { topperData, foundType } = values;
      const hasNextTopper = topperData.length < negotiatedTopper.length;
      return (
        <form onSubmit={handleSubmit}>
          <div className={styles.title}>
            需求：
            {data.demandBody.title}
          </div>
          <p className={styles.label}>此需求您尚未回報合作，本案是否找到合作的高手</p>
          <Field
            name="foundType"
            render={({ field }) => (
              <RadioGroup
                {...field}
                options={NOT_FOUND_REASON}
                onChange={(event) => {
                  if (event.target.value === 2) {
                    // 選擇未找到高手，馬上導入到新視窗
                    openNotFoundForm();
                  } else {
                    setFieldValue('foundType', event.target.value);
                  }
                }}
              />
            )}
          />
          <ErrorMessage name="foundType">
            {msg => <p className={styles.error}>{msg}</p>}
          </ErrorMessage>
          <Divider />
          { this.renderTopperField(topperData, negotiatedTopper, setFieldValue, foundType) }
          {
              hasNextTopper && (
                <p
                  className={styles.clickText}
                  onClick={() => {
                    setFieldValue('topperData', [
                      ...topperData,
                      {
                        topperId: '',
                        topperName: '',
                        price: 0,
                        unit: data.demandBody?.unit || 0,
                        key: dayjs().format('hh:mm:ss'),
                      },
                    ]);
                  }}
                >
                  ＋ 回報下一位高手
                </p>
              )
          }
          <div className={styles.center}>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>確認送出</Button>
          </div>
          {/* <DebugFormik /> */}
        </form>
      );
    }

    onSubmit = (values, actions) => {
      const {
        data, onOpenFinishedModal, demandCloseSubmit, openNotFoundForm, onCloseModal,
      } = this.props;
      const { foundType, topperData } = values;
      const { demandId, depositeStatus } = data;
      const dealPriceList = topperData.map((topperDeal) => {
        // 目前無法提供金額
        if (topperDeal.unit === -1) {
          return {
            topperId: topperDeal.topperId,
            unit: null,
            price: null,
          };
        }
        return {
          topperId: topperDeal.topperId,
          unit: topperDeal.unit,
          price: topperDeal.price,
        };
      });
      if (foundType === 2) {
        // 有溝通高手，尚未確認合作 - 回報未找到合作高手，導入填寫原因流程
        openNotFoundForm();
      } else {
        // 有溝通高手，尚未確認合作 - 回報確認合作
        demandCloseSubmit(demandId, 0, dealPriceList)
          .then((result) => {
            actions.setSubmitting(false);
            if (result.payload?.success) {
              onOpenFinishedModal(depositeStatus, onCloseModal, true);
            }
          });
      }
    }

    render() {
      const { data } = this.props;
      const initialData = {
        foundType: NOT_FOUND_REASON[0].value,
        topperData: [
          {
            topperId: '',
            topperName: '',
            price: 0,
            unit: data.demandBody?.unit || 0,
            key: `${dayjs().format('hh:mm:ss')}`,
          },
        ],
      };
      return (
        <Formik
          key={`${dayjs().format('hh:mm:ss')}`}
          initialValues={initialData}
          validationSchema={communitingSchema}
          render={this.renderForm}
          onSubmit={this.onSubmit}
        />
      );
    }
}

export default CommunitingForm;
