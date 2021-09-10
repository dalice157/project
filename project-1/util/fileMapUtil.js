import defaultImg from '../img/default.jpg';

export function imgUrlByfileMap(fid, fileMap) {
  if (!fid && !fileMap) {
    return defaultImg;
  }

  return fileMap[fid] ? fileMap[fid][0] : defaultImg;
}
