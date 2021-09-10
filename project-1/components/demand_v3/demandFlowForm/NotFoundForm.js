import React, { PureComponent } from 'react';
import { Radio, Button } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import styles from './demandForm.scss';
import { CLOSED_DEMAND_REASON } from '../../../config/selectData';
import { notFoundSchema } from '../../../config/validation/demnad';
// import { DebugFormik } from '../../util/DebugFormik';

const RadioGroup = Radio.Group;
class NoCommunitingForm extends PureComponent {
    renderForm = ({ handleSubmit, isSubmitting }) => {
      const { data } = this.props;
      return (
        <form onSubmit={handleSubmit}>
          <div className={styles.title}>
            需求：
            {data.demandBody.title}
          </div>
          <p className={styles.label}>此需求您尚未回報合作</p>
          <p className={styles.label}>未能找到合作高手的原因：</p>
          <Field
            name="notFoundReason"
            render={({ field }) => (
              <RadioGroup
                {...field}
                options={CLOSED_DEMAND_REASON}
                className={styles.radio}
              />
            )}
          />
          <ErrorMessage name="notFoundReason">
            {msg => <p className={styles.error}>{msg}</p>}
          </ErrorMessage>
          <div className={styles.center}>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>確認送出</Button>
          </div>
          {/* <DebugFormik /> */}
        </form>
      );
    }

    onSubmit = (values, actions) => {
      const {
        data, onOpenFinishedModal, demandCloseSubmit, onCloseModal,
      } = this.props;
      const { notFoundReason } = values;
      const { demandId, depositeStatus } = data;
      demandCloseSubmit(demandId, notFoundReason, [])
        .then((result) => {
          actions.setSubmitting(false);
          if (result.payload?.success) {
            onOpenFinishedModal(depositeStatus, onCloseModal, true);
          }
        });
    }

    render() {
      const initialData = {
        notFoundReason: 0,
      };
      return (
        <Formik
          initialValues={initialData}
          validationSchema={notFoundSchema}
          render={this.renderForm}
          onSubmit={this.onSubmit}
        />
      );
    }
}

export default NoCommunitingForm;
