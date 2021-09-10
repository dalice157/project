const MIMEMap = {
  'image/jpeg': 'IMAGE',
  'image/png': 'IMAGE',
  'image/gif': 'IMAGE',
  'image/bmp': 'IMAGE',
  'image/vnd.wap.wbmp': 'IMAGE',
  'application/pdf': 'DOCUMENT',
  'application/msword': 'DOCUMENT',
  'application/rtf': 'DOCUMENT',
  'application/vnd.ms-powerpoint': 'DOCUMENT',
  'application/vnd.ms-powerpoint.slideshow.macroenabled.12': 'DOCUMENT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'DOCUMENT',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
    'DOCUMENT',
  'application/vnd.openxmlformats-officedocument.presentationml.template':
    'DOCUMENT',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCUMENT',
  'application/vnd.ms-powerpoint.template.macroenabled.12': 'DOCUMENT',
  'audio/x-wav': 'AUDIO',
  'audio/x-ms-wma': 'AUDIO',
  'audio/mp3': 'AUDIO',
  'audio/mpeg': 'AUDIO',
  'audio/x-m4a': 'AUDIO',
  'audio/mp4': 'AUDIO',
  'audio/m4a': 'AUDIO',
  'video/3gpp': 'VIDEO',
  'video/mpeg': 'VIDEO',
  'video/x-msvideo': 'VIDEO',
  'video/x-ms-wmv': 'VIDEO',
  'video/vnd.uvvu.mp4': 'VIDEO',
  'video/mp4': 'VIDEO',
  'video/x-flv': 'VIDEO',
  'video/webm': 'VIDEO',
  'video/mov': 'VIDEO',
};

export function getAtomicType(MIMEType) {
  if (MIMEMap[MIMEType]) {
    return MIMEMap[MIMEType];
  } else {
    // alert('不支援的檔案格式');
    return false;
  }
}

/**
 * 上傳檔案類型設定表
 */
export const mediaTypeMap = {
  YOUTUBE: {
    tagType: 'YOUTUBE',
    contentType: 0,
  },
  TEXT: {
    tagType: 'TEXT',
    contentType: 1,
  },
  IMAGE: {
    tagType: 'IMAGE',
    contentType: 2,
    title: '圖片',
    description: '圖片',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/vnd.wap.wbmp',
      // extra
      'application/x-png',
      'application/x-jpg',
      'image/heif',
      'image/heif-sequence',
      'image/heic',
      'image/heic-sequence',
    ],
  },
  VIDEO: {
    tagType: 'VIDEO',
    contentType: 3,
    mimeTypes: [
      'video/3gpp',
      'video/mpeg',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/vnd.uvvu.mp4',
      'video/mp4',
      'video/x-flv',
      'video/webm',
      'video/mov',
      // extra
      'video/mpeg4',
      'video/quicktime',
      'model/vnd.mts',
      'video/vnd.dlna.mpeg-tts',
      'video/avi',
    ],
  },
  DOCUMENT: {
    tagType: 'DOCUMENT',
    contentType: 4,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/rtf',
      'application/vnd.ms-powerpoint',
      'application/vnd.ms-powerpoint.slideshow.macroenabled.12',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
      'application/vnd.openxmlformats-officedocument.presentationml.template',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint.template.macroenabled.12',
      // extra
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-xls',
      'application/vnd.ms-excel',
      'application/x-ppt',
    ],
  },
  AUDIO: {
    tagType: 'AUDIO',
    contentType: 5,
    mimeTypes: [
      'audio/x-wav',
      'audio/x-ms-wma',
      'audio/mp3',
      'audio/mpeg',
      'audio/x-m4a',
      'audio/mp4',
      'audio/m4a',
      // extra
      'audio/mp3*'
    ],
  },
  HYPERLINK: {
    tagType: 'HYPERLINK',
    contentType: 6,
  },
  LINK: {
    tagType: 'LINK',
    contentType: 6
  }
};


/**
 * 用 mediaType + convertType 取得對應 tag
 * TODO: convertType 與 tag 要跟後端再確認
 */
export const tagsMap = {
  // mediaType
  TEXT: {},
  IMAGE: {
    // convertType
    avatar: ['avatarWeb', 'w600', 'origin'],
    cover: ['crop', 'w600', 'w960', 'w1920', 'origin'],
    companyLogo: ['w300', 'origin'],
    activity: ['activityGrid', 'origin'],
  },
  VIDEO: {
    video: ['720p', 'activityProcess', 'w600', 'w960', 'w1920'],
  },
  DOCUMENT: {
    document: ['activityPlay', 'w600', 'w960', 'w1920'],
  },
  AUDIO: {
    audio: ['activityPlay', '128k', 'origin'],
  },
  HYPERLINK: {
    link: ['origin'],
  },
  LINK: {},
  YOUTUBE: {
    link: ['origin'],
  },
};

/**
 * 取得 getFileArr 參數
 * http://wiki.104.com.tw/Doc_Api#.E5.8F.96.E5.BE.97.E6.AA.94.E6.A1.88.E9.80.A3.E7.B5.90.28getFileUrl.29
 * @param {object} param
 */
export const tagsToGetFileArr = ({
  fileId, mediaType, convertType, target, page
}) => {
  if (!mediaTypeMap.mediaType || !tagsMap[mediaType].convertType) {
    console.error('Invalid mediaType or convertType', mediaType, convertType);
    return [];
  }
  if (!fileId) {
    console.error('Invalid fileId: ', fileId);
    return [];
  }
  return tagsMap[mediaType][convertType].map(fileTag => ({
    fileId, protocol: 'https', fileTag, target, page
  }));
};

/**
 * 按順序取得 tag，若該 tag 沒資料就按順序換下個 tag，直到完全找不到
 * @param {object} fileUrlMap
 * @param {array} tagsOrder
 */
export const pickTagWithOrder = (fileUrlMap = {}, tagsOrder = []) => {
  if (!Array.isArray(tagsOrder) || typeof fileUrlMap !== 'object') return false;

  for (let tag of tagsOrder) {
    if (fileUrlMap[tag]) {
      return fileUrlMap[tag];
    }
  }
  return false;
};
