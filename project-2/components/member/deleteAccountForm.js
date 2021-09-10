import React, { Component, Fragment } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Button, Card } from 'antd';
import { RadioField, TextAreaField, TextField } from 'redux-form-antd';
import { handleDeleteAccountOpts } from './options';
import { dateFormat } from '../../util/formatUtil.js';
import { mappingStaffName } from '../../util/commonUtil.js';

const required = value => (value ? undefined : '請輸入必填欄位');

class DeleteAccountForm extends Component {
    // 根據AC Queue的種類決定可進行哪些動作
    showHandleActions = (queueType, directDel) => {
      let actions = [];
      if (queueType === 1) {
        // 1:處理中 2:已刪除 3:已慰留 4:已處理
        if (directDel) {
          actions = [1, 2];
        } else {
          actions = [1, 2, 3];
        }
      } else {
        actions = [1, 4];
      }

      let showActions = [];
      handleDeleteAccountOpts.map((item) => {
        actions.map((x) => {
          if (x === item.value) {
            showActions.push(item);
          }
          return showActions;
        });
        return showActions;
      });
      return (
        <Fragment>
          <Field label="處理結果" name="handleStatus" component={ RadioField } validate={ required } options={ showActions } />
        </Fragment>
      );
    }

    showQueueTypeDesc = (queueType, directDel) => {
      let queueDesc = '';
      switch (queueType) {
        case 1:
          if (directDel) {
            queueDesc = '刪除盜用帳號';
          } else {
            queueDesc = '刪除帳號';
          }
          break;
        case 2:
          queueDesc = '刪除服務';
          break;
        case 3:
          queueDesc = '轉拋服務';
          break;
        default:
          break;
      }
      return queueDesc;
    }

    showLastMemo = (lastMemo) => {
      if (lastMemo != null) {
        const {
          createDate: lastMemoDate,
          staff,
          clerk,
          memo
        } = lastMemo;
        return <div>{dateFormat(lastMemoDate, true)}&emsp;【{staff ? mappingStaffName(staff) : clerk}】&emsp;<br />{memo}</div>;
      }
    }

    render() {
      const { deleteAccountRecord, handleSubmit, submitting } = this.props;
      const {
        recordId,
        basicId,
        queueType,
        acDirectDel,
        acStarter,
        acFreeKey,
        acName,
        acMainEmail,
        createDate: startTime,
        lastMemo
      } = deleteAccountRecord;


      return (
        <Fragment><br />
          <Card>
            <form onSubmit={ handleSubmit }>
              <p>
                <b>通知編號</b> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{recordId}
              </p>
              <p>
                <b>啟動刪除產品</b> &emsp;&emsp;&emsp;&emsp;&emsp;{acStarter}
              </p>
              <p>
                <b>通知日期</b> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{dateFormat(startTime, true)}
              </p>
              <p>
                <b>會員姓名</b> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{acName}
              </p>
              <p>
                <b>會員編號</b> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<a href={ `/admin/member/${basicId}?tabs=basic` } target="_blank" rel="noopener noreferrer">{basicId}</a>
              </p>
              <p>
                <b>e-mail</b> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{acMainEmail}
              </p>
              <p>
                <b>通知類別</b> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{this.showQueueTypeDesc(queueType, acDirectDel)}
              </p>
              <p>
                <b>原因</b> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{acFreeKey}
              </p>
              <div>
                {this.showHandleActions(queueType, acDirectDel)}
              </div>
              <div>
                <Field label="客服備註" name="memo" component={ TextAreaField } rows={ 6 } />
                {this.showLastMemo(lastMemo)}
              </div><br /><br />
              <Field name="recordId" component={ TextField } type="hidden" />
              <Button htmlType="submit" type="primary" disabled={ submitting }>送出修改</Button>
            </form>
          </Card>
        </Fragment>
      );
    }
}

export default reduxForm({
  form: 'DeleteAccountForm', // a unique name for this form
  enableReinitialize: true
})(DeleteAccountForm);
