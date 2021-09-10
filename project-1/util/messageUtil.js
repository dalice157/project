import React from 'react';
import {
  message, Button, notification, Modal
} from 'antd';
import errorMsg from '../config/errorMsg-zh_TW.js';
import labels from '../config/lables-zh_TW.js';

export default function sysMsg(action, handleError = false) {
  if (!action.error) message.success(action.msg || labels.message.save_success);
  else if (handleError) {
    const errorCode = (action.payload.response && action.payload.response.sysMsgKey) || action.payload.status || 500;

    if (errorCode == 401) {
      requireLoginNotification();
    } else if (errorCode == 311) {
      message.loading('Loading in progress..', 0);
      location.href = action.payload.response.location;
    } else if (errorCode == 428) {
      requireCompleteInfoNotification(action.payload.response);
    } else {
      message.error(errorMsg.info[errorCode]);
    }
  }
}

export function info(msgKey) {
  message.info(labels.message[msgKey]);
}

export function error(errorCode) {
  console.log('errorCode:', errorCode);
  message.error(errorMsg.info[errorCode], 6);
}

function requireLoginNotification() {
  notification.config({
    placement: 'topRight',
    top: 65,
    duration: 0,
  });
  const description = (<div>登入狀態己過期，請重新登入使用。</div>);
  const key = `open${Date.now()}`;
  const btn = (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        notification.close(key);
        open('/api/login');
      }}
    >
      登入
    </Button>
  );
  notification.error({
    message: '系統錯誤提示',
    description,
    btn,
    key,
    // onClick() {
    //   location.href = '/';
    // },
  });
}

function requireCompleteInfoNotification(apiResp) {
  const { nextStep } = apiResp;
  const title = '親愛的104高手會員您好';
  const content = '為提供客戶服務品質，請確認個人或公司相關資料完整性。';
  const redirectTo = encodeURIComponent(`/enableCaseUser${nextStep ? '?nextStep=' + encodeURIComponent(nextStep) : ''}`);
  let uri = `/api/saveOriginPage?redirectTo=${redirectTo}`;
  // console.log('uri = ', uri);

  Modal.warning({
    title: title,
    content: content,
    okText: '立即確認',
    onOk: () => { location.href = uri; }
  });
}

export function alertSubmitForm(errors) {
  if (Object.keys(errors).length !== 0) {
    message.error('請確認各欄位是否填寫完整');
  }
}
