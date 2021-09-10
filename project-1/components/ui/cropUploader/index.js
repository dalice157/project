import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Tabs, Tooltip, Slider, Row, Col, Popover
} from 'antd';
import { InsertPhoto } from '@material-ui/icons';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import './ReactCrop.css';
import { uaIsMobile } from 'react-device-detect';
import styled from 'styled-components';
import Modal from '../modal';
import getCroppedImg from './getCroppedImg';

import { getAtomicType, tagsMap } from '../../../config/uploadConfig.js';

import './style.css';
import blackImg from './black.png';
import whiteImg from './white.png';
import gradationBlackImg from './gradation_black.png';
import gradationWhiteImg from './gradation_white.png';

import Button from '../button';
import { uploadCroppedImage as uploadCropped, requestFileUrl } from '../../../actions/document.js';
import { error as sysError } from '../../../util/messageUtil.js';
// import 'antd/dist/antd.css';
// import persistState from 'localStorage';
// import MediaPlayer from 'components/mediaPlayer';


const pushSystemMessage = () => {
  sysError('media-type-not-allow');
};

const TabPane = Tabs.TabPane;

const UploadPane = styled.div`
  position: relative;
  min-width: 480px;
  min-height: 270px;
  background: #f9f9f9;
  border: 2px dashed #d1d1d1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1400;

  @media (max-width: 568px) {
    min-width: auto;
    width: 100%;
  }
`;

const CropImgMask = styled.div`
  position: absolute;
  top: 0;
  z-index: 11;
  height: 100%;
  width: 100%;
  ${(props) => {
    switch (props.maskName) {
      case 'blackMask':
        return `
          background: rgba(0,0,0,${props.maskAlpha});
        `;
      case 'whiteMask':
        return `
          background: rgba(255,255,255,${props.maskAlpha});
        `;
      case 'blackGradientMask':
        return `
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(0,0,0,${
  props.maskAlpha
}) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,${
  props.maskAlpha
}) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(0,0,0,${
  props.maskAlpha
}) 100%); /* Chrome10-25,Safari5.1-6 */
        `;
      case 'WhiteGradientMask':
        return `
          background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(255,255,255,${
  props.maskAlpha
}) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(255,255,255,${
  props.maskAlpha
}) 100%); /* FF3.6-15 */
          background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(255,255,255,${
  props.maskAlpha
}) 100%); /* Chrome10-25,Safari5.1-6 */
        `;
      default:
        return `
          background: rgba(0,0,0,${props.maskAlpha});
        `;
    }
  }}
`;

// const fileUrlMapConvertMap = (fileData, mediaInfo, isGallery, pending) => {
//   const page = mediaInfo.convertType === 'document' ? -1 : '';
//   // if (!fileData) return;

//   if (pending) {
//     return (
//       <div className="loading-preset">
//         <div className="loading" />
//         <p className="handleText">檔案處理中</p>
//       </div>
//     );
//   }

//   return (
//     <MediaPlayer
//       fileId={fileData.fileId || ''}
//       mediaType={mediaInfo.mediaType || 'IMAGE'}
//       convertType={mediaInfo.convertType || 'cover'}
//       meta={{}}
//       page={page}
//       isGallery={isGallery}
//     />
//   );
// };

class CropUploader extends Component {
  static propTypes = {
    aspect: PropTypes.number.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    fileId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([null, undefined]),
    ]),
    oriFile: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([null, undefined]),
    ]),
    editable: PropTypes.bool.isRequired,
    buttonPosition: PropTypes.string,
    onBeforeProcessing: PropTypes.func,
    onStartProcessing: PropTypes.func,
    onFinishProcessing: PropTypes.func,
    maskName: PropTypes.string,
    maskAlpha: PropTypes.number,
    templateType: PropTypes.string,
    multiMediaAllow: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    maskName: 'blackMask',
    maskAlpha: 0,
    editable: false,
    oriFile: null,
    fileId: null,
    multiMediaAllow: false,
    mediaType: 'IMAGE',
    convertType: 'cover',
    templateType: 'def',
    isGallery: false,
  };

  constructor(props) {
    super(props);
    this.btnRef = React.createRef();
    this.state = {
      oriFile: props.oriFile,
      fileId: props.fileId,
      mediaInfo: {
        mediaType: props.mediaType,
        convertType: props.convertType,
      },
      cropping: false,
      crop: {},
      open: false,
      activeKey: '1',
      editWrapperHoverDisplay: true,
      maskName: props.maskName,
      maskAlpha: props.maskAlpha,
      loading: false,
      uploading: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.oriFile !== prevState.oriFile && !prevState.open) {
      return {
        ...prevState,
        oriFile: nextProps.oriFile,
        fileId: nextProps.fileId,
      };
    }

    if (
      (nextProps.maskName !== prevState.maskName
        || nextProps.maskAlpha !== prevState.maskAlpha)
        && !prevState.editWrapperHoverDisplay
    ) {
      return {
        ...prevState,
        maskName: nextProps.maskName,
        maskAlpha: nextProps.maskAlpha,
      };
    }

    return null;
  }

  open = async () => {
    const { uploading, oriFile } = this.state;
    const { fileId } = this.props;
    let crop = this.state.crop || {};
    let loadOriFile = null;
    if (fileId && !oriFile) {
      let fileArr = await this.props.getFileUrl(fileId);
      loadOriFile = fileArr.origin ? fileArr.origin[0] : null;
    }

    this.setState({
      fileId: fileId,
      open: true,
      activeKey: fileId ? '2' : '1', // 有上傳過圖片，自動切到調整圖片
      oriFile: oriFile || loadOriFile,
      crop, // 讀取上次儲存的座標
      loading: uploading,
    });
  };

  openFile = () => {
    this.btnRef.click();
  };

  fileInputSetState = (f, e2, AtomicType) => {
    this.setState({
      f: f,
      oriFile: e2.target.result,
      fileId: null,
      crop: {},
      cropping: false,
      activeKey: '2',
      mediaInfo: {
        mediaType: AtomicType,
        convertType: AtomicType !== 'IMAGE'
          ? AtomicType.toLowerCase()
          : 'cover',
      },
      uploading: AtomicType !== 'IMAGE',
      loading: AtomicType !== 'IMAGE',
    });
  };

  handleFileInput = (e) => {
    const files = Array.prototype.slice.call(e.target.files, 0);
    const {
      multiMediaAllow,
      nowChangeLoadingFileId,
      fileId,
      indexNumber
    } = this.props;
    this.setState({ loading: true });

    files.forEach((f) => {
      let AtomicType = getAtomicType(f.type);
      if (AtomicType) {
        if (multiMediaAllow && AtomicType !== 'IMAGE') {
          const reader = new FileReader();
          reader.readAsDataURL(f);
          reader.onload = (e2) => {
            this.handleFileUploadOnly(
              f,
              {},
              AtomicType,
              AtomicType.toLowerCase()
            );
            setTimeout(() => {
              this.fileInputSetState(f, e2, AtomicType);
            }, 500);
          };
        } else if (AtomicType === 'IMAGE') {
          const reader = new FileReader();
          reader.readAsDataURL(f);
          reader.onload = (e2) => {
            this.fileInputSetState(f, e2, AtomicType);
          };
        } else {
          pushSystemMessage();
          return false;
        }
      } else {
        pushSystemMessage();
        return false;
      }
    });

    if (nowChangeLoadingFileId) {
      nowChangeLoadingFileId(fileId, indexNumber);
    }
  };

  completeCrop = () => {};

  onComplete = (crop, pixelCrop) => {
    this.pixelCrop = pixelCrop;
    this.setState({ crop });
  };

  onChange = (crop) => {
    this.setState({ crop });
  };

  onImageLoaded = (image) => {
    const crop = makeAspectCrop(
      {
        x: this.state.crop.x || 0,
        y: this.state.crop.y || 0,
        aspect: this.props.aspect,
        width: this.state.crop.width || 50,
      },
      image.naturalWidth / image.naturalHeight
    );

    this.setState({ crop, image, loading: false }, () => {
      const pixelCrop = {
        x: Math.round(image.naturalWidth * (crop.x / 100)),
        y: Math.round(image.naturalHeight * (crop.y / 100)),
        width: Math.round(image.naturalWidth * (crop.width / 100)),
        height: Math.round(image.naturalHeight * (crop.height / 100)),
      };
      this.onComplete(crop, pixelCrop);
    });
  };

  onFinishProcessing = ({ fileId, fileUrlMap, coordinate }) => {
    // 更新 or 新增 crop 物件到 localStorage
    // persistState.saveState(['crop', fileId], this.state.crop);
    this.setState(
      {
        uploading: false,
        fileId,
        oriFile: fileUrlMap.origin[0],
      },
      () => {
        // hook: 完成所有上傳程序並提供 fileId & file URI
        if (typeof this.props.onFinishProcessing === 'function') {
          this.props.onFinishProcessing({ fileId, fileUrlMap, coordinate });
        }
      }
    );
  };

  handleFileUploadOnly = (f, coordinate, mediaType, convertType) => {
    const {
      uploadCroppedImage,
      componentType,
      getFileData,
      onStartProcessing,
    } = this.props;
    // 上傳 & 更新 fileId
    uploadCroppedImage(f, {
      contentType: f && f.type,
      fileName: f && f.name,
      fileId: null,
      coordinate,
      mediaType,
      convertType,
      componentType: componentType || '',
      getFileData: getFileData || '', // 作品集判斷是否正在轉擋中用
      onStartProcessing: onStartProcessing,
      onFinishProcessing: this.onFinishProcessing,
    });
  };

  handleSubmit = () => {
    const {
      image, f, loading, uploading, mediaInfo // , crop
    } = this.state;
    if (loading || uploading) return;
    const {
      fileId,
      componentType,
      getFileData,
      onStartProcessing,
      onBeforeProcessing,
      uploadCroppedImage,
    } = this.props;
    const { convertType, mediaType } = mediaInfo;
    const convertTypeMap = tagsMap[mediaType] || {};
    const dataURI = getCroppedImg(image, this.pixelCrop, '123');
    const coordinate = {
      ltx: this.pixelCrop.x,
      lty: this.pixelCrop.y,
      rbx: this.pixelCrop.x + this.pixelCrop.width,
      rby: this.pixelCrop.y + this.pixelCrop.height,
    };

    let fileUrlMap = (convertTypeMap[convertType] || []).reduce(
      (map, tag) => ({ ...map, [tag]: dataURI }),
      {}
    );

    // hook: 提供 data URI & 座標
    onBeforeProcessing({
      fileId: fileId,
      fileUrlMap,
      coordinate,
    });

    // 上傳 & 更新 fileId
    uploadCroppedImage(f, {
      contentType: f && f.type,
      fileName: f && f.name,
      fileId: this.state.fileId,
      coordinate,
      mediaType,
      convertType,
      componentType: componentType || '',
      getFileData: getFileData || '', // 作品集判斷是否正在轉擋中用
      onStartProcessing: onStartProcessing,
      onFinishProcessing: this.onFinishProcessing,
    });

    // 調整圖片的話，更新 crop 物件到 localStorage
    // if (this.state.fileId) {
    //   persistState.saveState(['crop', this.state.fileId], crop);
    // }

    this.setState({ uploading: true, loading: true, open: false });
  };

  handleCancel = () => {
    this.pixelCrop = undefined;
    this.setState({
      cropping: false,
      open: false,
      activeKey: '1',
    });
  };

  onTabClick = value => this.setState({ activeKey: value });

  onSliderChange = (value) => {
    this.setState({ maskAlpha: value });
  };

  handleMaskChange = (value) => {
    this.setState({ maskName: value });
  };

  handleMaskSubmit = () => {
    this.props.saveMask(
      this.props.uniKey,
      this.props.templateType,
      this.state.maskName,
      this.state.maskAlpha
    );
    this.maskContent();
  };

  formatter = (value) => {
    return `${value}%`;
  };

  maskContent = () => {
    this.setState({
      editWrapperHoverDisplay: !this.state.editWrapperHoverDisplay,
    });
  };

  render() {
    const {
      className,
      mask,
      editable,
      buttonPosition,
      children,
      // fileData,
      // isGallery,
      // pending,
      componentType,
    } = this.props;
    const {
      oriFile,
      editWrapperHoverDisplay,
      maskAlpha,
      maskName,
      uploading,
      loading,
      mediaInfo,
    } = this.state;

    const isMobile = uaIsMobile();
    const TriggerButton = styled.span`
      position: absolute;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
      z-index: 300;
      ${(props) => {
    if (props.buttonPosition) {
      return 'top: calc(50% - 19px); left: calc(50% - 19px);';
    } else if (props.isMask && isMobile) {
      return 'right: 20px; top: 16%;';
    } else {
      return 'right: 20px; bottom: 20px;';
    }
  }}
    `;

    return (
      <div className={`${className || ''} edit-wrapper`}>
        {editable && (
          <div
            className={
              !editWrapperHoverDisplay
                ? 'crop-icon'
                : 'crop-icon force-display-block'
            }
          >
            <TriggerButton buttonPosition={buttonPosition} isMask={mask}>
              <Tooltip
                placement="bottom"
                title={
                  componentType && '變更圖片'
                }
              >
                <InsertPhoto size="large" onClick={this.open} />
              </Tooltip>
              {mask && !isMobile && (
                <Popover
                  placement="topRight"
                  content={
                    (
                      <Fragment>
                        <div className="crop_mask_menu">
                          <div
                            onClick={() => this.handleMaskChange('blackMask')}
                            className={
                              maskName === 'blackMask'
                                ? 'crop_mask_focus'
                                : 'crop_mask_on_focus'
                            }
                          >
                            <img
                              src={blackImg}
                              alt="black"
                              width="30"
                              height="30"
                            />
                          </div>
                          <div
                            onClick={() => this.handleMaskChange('whiteMask')}
                            className={
                              maskName === 'whiteMask'
                                ? 'crop_mask_focus'
                                : 'crop_mask_on_focus'
                            }
                          >
                            <img
                              src={whiteImg}
                              alt="black"
                              width="30"
                              height="30"
                            />
                          </div>
                          <div
                            onClick={() => this.handleMaskChange('blackGradientMask')}
                            className={
                              maskName === 'blackGradientMask'
                                ? 'crop_mask_focus'
                                : 'crop_mask_on_focus'
                            }
                          >
                            <img
                              src={gradationBlackImg}
                              alt="black"
                              width="30"
                              height="30"
                            />
                          </div>
                          <div
                            onClick={() => this.handleMaskChange('WhiteGradientMask')}
                            className={
                              maskName === 'WhiteGradientMask'
                                ? 'crop_mask_focus'
                                : 'crop_mask_on_focus'
                            }
                          >
                            <img
                              src={gradationWhiteImg}
                              alt="black"
                              width="30"
                              height="30"
                            />
                          </div>
                        </div>
                        <div>
                          <Row>
                            <Col span={33}>
                              <Slider
                                min={0}
                                max={100}
                                onChange={this.onSliderChange}
                                value={maskAlpha || 0}
                                step={1}
                                tipFormatter={this.formatter}
                              />
                            </Col>
                          </Row>
                        </div>
                        <div className="submit-div">
                          <Button type="primary" onClick={this.handleMaskSubmit}>
                            儲存變更
                          </Button>
                        </div>
                      </Fragment>
                    )
                  }
                  title="調整透明度"
                  trigger="click"
                  onVisibleChange={this.maskContent}
                  visible={editWrapperHoverDisplay}
                >
                  <Tooltip placement="bottom" title="調整透明度">
                    <span className="icon-overlay_icon">
                      <span className="path1" />
                      <span className="path2" />
                    </span>
                  </Tooltip>
                </Popover>
              )}
            </TriggerButton>
          </div>
        )}
        <div className="children-main">
          {children}
          {mask && !isMobile && (
          <CropImgMask
            maskName={maskName || 'blackMask'}
            maskAlpha={(maskAlpha || 0) / 100}
          />
          )}
        </div>
        <input
          type="file"
          ref={(ref) => { this.btnRef = ref; }}
          style={{ display: 'none' }}
          onChange={this.handleFileInput}
        />
        {this.state.open && (
          <Modal
            title={componentType && componentType === 'gallery' ? '檔案' : '圖像'}
            visible={this.state.open}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            footer={[]}
          >

            <Tabs
              activeKey={this.state.activeKey}
              onTabClick={this.onTabClick}
              defaultActiveKey="1"
              size="large"
            >
              <TabPane
                tab={
                  componentType && componentType === 'gallery'
                    ? '上傳檔案'
                    : '上傳圖片'
                }
                key="1"
                disabled={uploading}
              >
                <UploadPane>
                  <Button type="primary" onClick={this.openFile}>選擇檔案</Button>
                </UploadPane>
              </TabPane>
              <TabPane
                tab={
                  componentType && componentType === 'gallery'
                    ? '檔案預覽'
                    : '圖片預覽'
                }
                key="2"
                disabled={!oriFile}
              >
                {mediaInfo.mediaType === 'IMAGE' && (
                  <Fragment>
                    <div className="crop-wrapper">
                      {loading && (
                      <h4>{uploading ? '上傳中 ...' : '讀取中 ...'}</h4>
                      )}
                      <ReactCrop
                        src={oriFile || ''}
                        crop={this.state.crop}
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onComplete}
                        onChange={this.onChange}
                        imageStyle={{ maxHeight: '60vh' }}
                        style={loading ? { display: 'none' } : {}}
                        keepSelection={true}
                        crossorigin="anonymous"
                      />
                    </div>
                    {!loading && (
                      <div className="submit-div">
                        <Button type="primary" onClick={this.handleSubmit}>
                          儲存
                        </Button>
                      </div>
                    )}
                  </Fragment>
                )}

              </TabPane>
            </Tabs>

          </Modal>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadCroppedImage: (f, config) => {
      dispatch(uploadCropped(f, config));
    },
    saveMask: (uniKey, templateType, maskName, maskAlpha) => {
      console.log('saveMask:' + uniKey + templateType + maskName + maskAlpha);
    },
    getFileUrl: fileId => requestFileUrl(dispatch, fileId)
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CropUploader);
