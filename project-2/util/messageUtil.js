import { message } from 'antd';
import errorMsg from '../config/errorMsg-zh_TW.js';
import labels from '../config/lables-zh_TW.js';

export default function sysMsg(action, handleError = false) {
  if (!action.error) message.success(action.msg || labels.message.save_success);
  else if (handleError) {
    const errorCode = (action.payload.response && action.payload.response.sysMsgKey) || action.payload.status || 500;
    if (errorCode === 'SHOW-SYS-MESSAGE') {
      message.error(action.payload.response.errors.message, 20);  
    } else {
      message.error(errorMsg.info[errorCode]);
    }
  }
}

export function info(msgKey) {
  message.info(labels.message[msgKey]);
}

export function error(errorCode) {
  message.error(errorMsg.info[errorCode]);
}
