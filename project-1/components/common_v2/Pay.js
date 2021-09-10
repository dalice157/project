import React, { Component } from 'react';
import { Checkbox } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import { modalData } from '../ui/step/stepData';
import config from '../../config/config';
import Step from '../ui/step';
import Button from '../ui/button';
import styles from './Form.scss';


class Pay extends Component {
  renderForm = (props) => {
    const { onProfilePrev } = this.props.payPage;
    return (
      <form onSubmit={props.handleSubmit}>
        <div className={`${styles.block} ${styles.spec}`}>
          <Field
            name="spec"
            render={({ field }) => (
              <Checkbox {...field}>
                已詳細閱讀並接受 <a target="_blank" href={`${config.contentSite.domain}/guarantee_deposit/`}>需求溝通押金規範</a>
              </Checkbox>
            )}
          />
          <ErrorMessage name="spec">
            { msg => <span className={styles.error}>{ msg }</span> }
          </ErrorMessage>
        </div>
        <div className={styles.btnWrap}>
          <Button onClick={onProfilePrev} dataGtmCase="step3-prev">上一步</Button>
          <Button type="primary" htmlType="submit" dataGtmCase="step3-pay">支付押金</Button>
        </div>
      </form>
    );
  }

  render() {
    const {
      onSubmit, validatePay
    } = this.props.payPage;
    return (
      <div className={styles.pay}>
        <Step current={2} stepData={modalData} stepModel />
        <div className={`${styles.block} ${styles.margin}`}>
          <h3>支付需求溝通押金NT$1,000 <a className={styles.link} href="https://blog.top.104.com.tw/2019/09/20/security_deposit/" target="_blank">(何謂押金？)</a></h3>
          <p className={styles.text}>押金為確保需求真實，且不可為正職職缺招募或有詐騙及騷擾…等違規違法</p>
          <ol className={styles.list}>
            <li>需求刊案期間為30天，可主動邀請高手於即時溝通系統內討論及雙方回報確認合作，逾期雙方未確認合作，即無法再交談，系統自動結案退還押金。</li>
            <li>刊登期間，隨時可自行申請結案退還押金。</li>
          </ol>
          <p className={styles.text}><b>**本網站僅為提供高手與案主之查詢與溝通平台，高手與案主間之相關交易行為，由合作雙方自行簽約與履約，本網站不負與此有關之任何法律責任。</b></p>
        </div>
        <Formik
          onSubmit={onSubmit}
          initialValues={{ spec: false }}
          validationSchema={validatePay}
          render={this.renderForm}
        />
      </div>
    );
  }
}

export default Pay;
