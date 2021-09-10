import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Button, Card } from 'antd';
import { RadioField, TextAreaField, SelectField, TextField, CheckboxField } from 'redux-form-antd';
import { staffHandleStatus as staffHandleOption, carrierType as carrierTypeOpt, hostingHandleStatus } from './options'

const required = value => (value ? undefined : '請輸入必填欄位');
class ViolationMemoForm extends Component {

    showHandleHosting = hostingInfo => {
        const { hasHostingMoney, hostingPrice, causeType, isBlackList } = hostingInfo
        return (
            <Fragment><label><b><font color="red">**</font> {hasHostingMoney ? `目前尚有押金 ${hostingPrice} 元，是否扣款結案：` : `目前沒有保證金，請選擇處理方式：`}</b></label>
                {causeType === 6
                    ? <div><font color="red">詐騙/性騷擾檢舉 成立</font>
                        <Field name="hostingHandleStatus" component={RadioField} validate={required} options={hostingHandleStatus} disabled />
                    </div>
                    : <Field name="hostingHandleStatus" component={RadioField} validate={required} options={hostingHandleStatus} />
                }
                {isBlackList
                    ? <div><font color="red">會員已是黑名單</font>
                        <Field name="addToBlackList" component={CheckboxField} checked disabled>是否加入黑名單</Field>
                    </div>
                    : <Field name="addToBlackList" component={CheckboxField}>是否加入黑名單</Field>

                }
            </Fragment>
        );
    }
    showInvoiceForm = carrierType => {

        return (
            <Fragment>
                <Card>
                    <h3>平台服務費：發票資料</h3><br />
                    <div>
                        *發票抬頭：<Field name="receiptTitle" component={TextField} validate={required} style={{ width: 200 }} />(僅開立二聯發票)<br /><br />
                        *發票載具：
                        <Field name="carrierType" component={RadioField} validate={required} options={carrierTypeOpt} />
                        {carrierType === '2' && <Field name="carrier" component={TextField} validate={required} style={{ width: 200 }} label="請輸入手機載具號碼：" />}
                        *得獎發票寄送地址：<Field name="receiptAddress" component={TextField} validate={required} style={{ width: 500 }} />
                    </div>
                </Card>
            </Fragment>);
    }

    onClick = () => {
        window.location.reload();
        window.close();
    }

    render() {
        const { violation, handleFormValue, handleSubmit, submitting } = this.props;
        const { staffHandleStatus, hostingHandleStatus, carrierType } = handleFormValue;
        const hostingInfo = {
            hasHostingMoney: violation.hasHostingMoney,
            hostingPrice: violation.hostingPrice,
            causeType: violation.causeType,
            isBlackList: violation.blackList
        }

        return (
            <Fragment><br />
                <Card title={<Fragment>客服處理備註：【<span style={{ color: 'red' }}>處理中請留下聯絡狀況，若「檢舉成立」，必須選擇是否扣款。</span>】</Fragment>}>
                    <form onSubmit={handleSubmit} >
                        <div>客服處理狀態：
                            <Field name="staffHandleStatus" component={SelectField} options={staffHandleOption} validate={required} placeholder="請選擇目前聯絡狀態" />
                            客服備註：
                            <Field name="memo" component={TextAreaField} validate={required} rows={6} />
                        </div> <br />
                        {staffHandleStatus === '7' && this.showHandleHosting(hostingInfo)}<br />
                        {(hostingHandleStatus === '3' && staffHandleStatus === '7') && this.showInvoiceForm(carrierType)}
                        <hr className="hr" />
                        <Button htmlType="submit" type="primary" disabled={submitting}>送出</Button>
                        <Button type="close" onClick={this.onClick}>關閉回列表</Button>
                        <Field name="yyyyMM" component={TextField} type="hidden" />
                        <Field name="recordId" component={TextField} type="hidden" />
                        <Field name="staff" component={TextField} type="hidden" />
                    </form>
                </Card>
            </Fragment >
        )
    }

}

export default reduxForm({
    form: 'ViolationMemoForm', // a unique name for this form
    enableReinitialize: true
})(ViolationMemoForm);