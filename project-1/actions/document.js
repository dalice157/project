import { RSAA } from 'redux-api-middleware';
import config from '../config/config.js';
import { error as sysError } from '../util/messageUtil.js';

// 建立並取得檔案上傳簽章
const requestDocumentSignature = param => ({
  [RSAA]: {
    endpoint: '/api/signature',
    types: [
      'REQUEST_DOCUMENT_SIGNATURE',
      'RECIEVE_DOCUMENT_SIGNATURE',
      'FAILURE_DOCUMENT_SIGNATURE',
    ],
    method: 'post',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(param)
  },
});

const requestDocumentArrayUrl = (param) => {
  return {
    [RSAA]: {
      endpoint: `/api/file-url/${param.fileId}/${
        param.convertType
      }`,
      types: [
        'REQUEST_DOCUMENT_ARRAY_URL',
        'RECIEVE_DOCUMENT_ARRAY_URL',
        'FAILURE_DOCUMENT_ARRAY_URL',
      ],
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  };
};

const requestDocumentReConvert = param => ({
  [RSAA]: {
    endpoint: `/api/reconvert/${param.fileId}`,
    types: [
      'REQUEST_DOCUMENT_RECONVERT',
      'RECIEVE_DOCUMENT_RECONVERT',
      'FAILURE_DOCUMENT_RECONVERT',
    ],
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(param),
    credentials: 'include',
  },
});

const uploadToS3 = (file, signature) => {
  let formData = new FormData();
  formData.append('key', signature.objectKey);
  formData.append('content-type', file.type);
  formData.append('acl', signature.acl);
  formData.append('X-Amz-Credential', signature.xAmzCredential);
  formData.append('X-Amz-Algorithm', signature.xAmzAlgorithm);
  formData.append('X-Amz-Date', signature.xAmzDate);
  formData.append('policy', signature.policyDocument);
  formData.append('X-Amz-Signature', signature.signature);
  formData.append('file', file);
  formData.append('Content-Disposition', file.name);

  return {
    [RSAA]: {
      endpoint: `${config.document.s3}`,
      types: [
        'REQUEST_DOCUMENT_UPLOAD',
        'RECIEVE_DOCUMENT_UPLOAD',
        'FAILURE_DOCUMENT_UPLOAD',
      ],
      method: 'post',
      credentials: 'include',
      body: formData
    },
  };
};

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function requestFileUrl(dispatch, newFileId, convertType) {
  let result = await dispatch(
    requestDocumentArrayUrl({
      fileId: newFileId,
      convertType: convertType || 'cover',
    })
  );

  let fileUrlMap = {};
  const fileUrls = result.payload.response;
  fileUrlMap = fileUrls.reduce(
    (urlsMap, f) => (f.tag ? Object.assign(urlsMap, { [f.tag]: f.url }) : (urlsMap)
    )
  );

  return fileUrlMap;
}

const pollingUrlRequest = async (dispatch, newFileId, convertType, componentType, passingTime) => {
  let result = await dispatch(
    requestDocumentArrayUrl({
      fileId: newFileId,
      convertType: convertType || 'cover',
    })
  );
  const fileUrls = result.payload.response;

  if (fileUrls.every(file => file.convertStatus === 'success')) {
    return result;
  } else if (componentType
    && componentType === 'gallery'
    && fileUrls.every(file => file.convertStatus === 'pending'
      || file.convertStatus === 'uploading')
  ) {
    passingTime += 2000;
    await timeout(2000);
    result = await pollingUrlRequest(dispatch, newFileId, convertType, componentType, passingTime);
    return result;
  } else if (
    fileUrls.some(file => file.convertStatus === 'failed'
      || file.convertStatus === 'stopped')
  ) {
    sysError('media-convert-failure');
    throw Error(`轉檔失敗, fileId: ${newFileId}, response: `, result);
  } else if (passingTime > 60000) {
    sysError('media-convert-timeout');
    throw Error(`轉檔逾時, fileId: ${newFileId}, response: `, result);
  }
};

/**
 * 上傳已裁切圖片 TODO: 調整成檔案上傳共用
 */
export function uploadCroppedImage(file, payload, pid) {
  const {
    contentType,
    fileId,
    fileName,
    coordinate,
    componentType,
    // getFileData,
    onStartProcessing,
    onFinishProcessing,
    convertType,
  } = payload;

  // const key = fileId || uuid();
  let newFileId = fileId;

  return async (dispatch) => {
    // 上傳新圖片
    if (!newFileId) {
      const signature = await dispatch(requestDocumentSignature({
        pid,
        contentType: contentType || 'image/jpeg',
        convertType: convertType || 'cover',
        fileName: fileName || 'upload.jpg',
        coordinate,
      }));

      // console.log('signature', signature);

      await dispatch(uploadToS3(file, signature.payload.response));

      newFileId = signature.payload.response.fileId;

      // 調整頭像圖片位置 (只需要更新座標即可)
    } else if (convertType === 'avatar') {
      // 用不到,只在cprofile 裡有
      // const result = yield take([
      //   BLOCK_DATA_UPDATE_PROCESS_END,
      //   BLOCK_DATA_UPDATE_PROCESS_ERROR,
      // ]);

      // if (result.error) throw Error(result);

      // 調整其他圖片位置
    } else {
      await dispatch(requestDocumentReConvert({
        pid,
        fileId,
        coordinate,
        convertType
      }));
    }
    // update fileId & coordinate
    if (typeof onStartProcessing === 'function') {
      onStartProcessing({
        fileId: newFileId,
        coordinate,
        convertType,
      });
    }

    let passingTime = 0;
    let fileUrlMap = {};

    const result = await pollingUrlRequest(dispatch, newFileId, convertType, componentType, passingTime);
    const fileUrls = result.payload.response;
    fileUrlMap = fileUrls.reduce(
      (urlsMap, f) => (f.tag ? Object.assign(urlsMap, { [f.tag]: f.url }) : (urlsMap)
      )
    );

    if (typeof onFinishProcessing === 'function') {
      onFinishProcessing({
        fileId: newFileId,
        fileUrlMap,
        coordinate,
        convertType,
      });
    }
  };
}
