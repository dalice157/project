import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import Content from './Content';
import EditServiceForm from '../../../components/member/gig/EditServiceForm';
import {
  loadGigContent,
  updateGigContent,
  loadTopperName,
  writeGigMemo,
} from '../../../actions/member';
import { loadStaticArea } from '../../../actions/common';
import { catSearch } from '../../../util/categoryUtils';
import defaultImg from '../../../img/default.jpg';
import { isContainTutorCats } from '../../../util/lablesUtils';
import { error } from '../../../util/messageUtil';

class Management extends PureComponent {
  state = {
    isImageGettingRemove: false,
    fileMap: { '': [''] },
    coverPic: defaultImg,
    fileId: null,
    oriFile: null,
    enableUpdateForm: true,
    memo: '',
  }

  async componentDidMount() {
    const basicId = this.props.match.params.basicId;
    const gigId = this.props.history.location.query.gigId;
    await this.props.loadTopperName(basicId);
    await this.props.loadStaticArea();
    await this.props.loadGigContent(basicId, gigId);
    this.initGigData();
  }

  initGigData = () => {
    const {
      body,
      fileMap,
    } = this.props.gig;
    const coverPic = body && body.coverPic ? body.coverPic : null;
    this.setState({
      fileMap: fileMap,
      fileId: coverPic,
      coverPic: coverPic,
      isImageGettingRemove: false,
    }, this.onDisableUpdateForm);
  }

  onDisableUpdateForm = () => {
    this.setState({
      enableUpdateForm: false,
    });
  }

  onSubmitGigData = async (payload, setSubmitting) => {
    const gigId = this.props.history.location.query.gigId;
    const {
      assignPlace,
      target,
      description,
      experience,
      price,
      serviceWay,
      serviceInterval,
      unit,
      tags,
      gigCats,
      reviewScore,
      reviewCount,
      serviceName,
      isImageGettingRemove,
    } = payload;
    const { fileId, memo } = this.state;
    const basicId = this.props.match.params.basicId;
    const isTutor = gigCats && isContainTutorCats(gigCats);
    if (isTutor && target.length === 0) {
      error('gig-target-require');
      setSubmitting(false);
      return;
    }
    const gig = {
      basicId: this.props.match.params.basicId,
      body: {
        area: assignPlace.no,
        clientCats: isTutor ? target : [],
        coverPic: isImageGettingRemove ? null : fileId,
        desc: description,
        exp: experience,
        price: price,
        onsiteOpts: serviceWay,
        priority: serviceInterval,
        unit: unit,
      },
      catTag: tags,
      cats: gigCats,
      gigId: gigId,
      reviewCount: reviewCount,
      reviewScore: reviewScore,
      title: serviceName,
    };
    if (memo) {
      await this.onSubmitMemo(basicId, memo, gigId);
    }
    await this.props.updateGigContent(gig).then((response) => {
      if (response.payload.success) {
        // eslint-disable-next-line no-alert
        alert('已更新服務');
        window.location.reload();
      }
    });
    setSubmitting(false);
  }

  onSubmitMemo = async (basicId, memo, gigId) => {
    const memoForm = {
      basicId: basicId,
      memo: memo,
      memoSource: gigId,
    };
    await this.props.writeGigMemo(memoForm, gigId);
  }

  // 上傳/裁切圖片
  onCoverPicChange = ({ coverPic = '' }) => {
    const addImageKey = Object.keys(coverPic)[0];
    this.setState({
      fileMap: coverPic,
      coverPic: addImageKey,
    });
  }

  preReceverCropImg = ({ fileId, fileUrlMap, coordinate }) => {
    console.log(
      `preReceverCropImg fileId: ${fileId} , fileUrlMap: ${fileUrlMap} , coordinate is ${coordinate}`
    );
    console.log('fileUrlMap', fileUrlMap);
    console.log(fileUrlMap);

    this.setState({
      coverPic: fileUrlMap.w600,
      oriFile: fileUrlMap.origin,
      fileId: fileId,
    });
  }

  receverCropFid = ({ fileId, coordinate }) => {
    const coverPic = { [fileId]: [this.state.coverPic] };
    console.log(
      `onStartProcessing fileId: ${fileId} , coordinate is ${coordinate}`
    );
    this.onCoverPicChange({ id: null, coverPic: coverPic });
    this.setState({
      fileId: fileId,
    });
  }

  receverCropImg = ({ fileId, fileUrlMap, coordinate }) => {
    const coverPic = { [fileId]: [fileUrlMap.url[0]] };
    console.log(
      `onFinishProcessing fileId: ${fileId} , fileUrlMap: ${fileUrlMap} , coordinate is ${coordinate}`
    );
    console.log('fileUrlMap', fileUrlMap);
    console.log(fileUrlMap.url[0]);

    this.onCoverPicChange({ id: null, coverPic: coverPic });
    this.setState({
      coverPic: fileUrlMap.url[0],
      oriFile: fileUrlMap.origin[0],
      fileId: fileId,
    });
  }

  onUpdateGigmemo = (memo) => {
    this.setState({
      memo: memo,
    });
  }

  // TODO unused?
  updateGigImage = () => {
    const { fileMap, coverPic } = this.state;
    this.setState({
      coverPic: fileMap && coverPic ? fileMap[coverPic] : defaultImg,
      fileId: coverPic || '',
    });
  }

  render() {
    const {
      fileMap,
      coverPic,
      oriFile,
      fileId,
      enableUpdateForm,
    } = this.state;
    const {
      match, areaData, gig, topperName
    } = this.props;
    const initialData = {
      ...this.state,
      serviceName: gig.title,
      unit: gig.body && 'unit' in gig.body ? gig.body.unit : 0,
      price: gig.body && 'price' in gig.body ? gig.body.price : '',
      experience: gig.body && 'exp' in gig.body ? gig.body.exp : -1,
      serviceWay: gig.body && 'onsiteOpts' in gig.body ? gig.body.onsiteOpts : [],
      serviceInterval: gig.body && 'priority' in gig.body ? gig.body.priority : [],
      description: gig.body && 'desc' in gig.body ? gig.body.desc : '',
      target: gig.body && 'clientCats' in gig.body ? gig.body.clientCats : [],
      tags: gig.catTag ? gig.catTag || [] : [],
    };
    const area = gig.body && 'area' in gig.body ? gig.body.area : [];
    const areaList = area.map(element => catSearch(areaData, element));
    const areaNameList = areaList.map(element => element.des);
    const areaNoList = areaList.map(element => element.no);
    const assignPlace = {
      des: areaNameList,
      no: areaNoList,
    };
    const basicId = match.params.basicId;
    return (
      <div className="gigWrap">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={ `/member/${basicId}?tabs=gig` }>
              {`${topperName.name}的接案服務管理`}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{gig.title}</Breadcrumb.Item>
        </Breadcrumb>
        {gig.gigId ? (
          <>
            <Content
              gigId={ gig.gigId }
              createDate={ gig.createDate }
              modifyDate={ gig.modifyDate }
              reviewCount={ gig.reviewCount }
              reviewScore={ gig.reviewScore }
              basicId={ basicId }
            />
            <EditServiceForm
              gigId={ gig.gigId }
              initialData={ initialData }
              assignPlace={ assignPlace }
              gigCats={ gig.cats }
              tags={ gig.catTag || [] }
              fileId={ fileId }
              fileMap={ fileMap }
              coverPic={ coverPic }
              oriFile={ oriFile }
              basicId={ basicId }
              enableUpdateForm={ enableUpdateForm }
              onSubmitGigData={ this.onSubmitGigData }
              onCoverPicChange={ this.onCoverPicChange }
              preReceverCropImg={ this.preReceverCropImg }
              receverCropFid={ this.receverCropFid }
              receverCropImg={ this.receverCropImg }
              onUpdateGigmemo={ this.onUpdateGigmemo }
            />
          </>
        ) : (
          <div>
            <LoadingOutlined />
            <span style={ { fontSize: '14px', marginLeft: '10px' } }>服務載入中</span>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  areaData: state.common.area,
  gig: state.member.gig,
  topperName: state.member.topperName,
});

const mapDispatchToProps = {
  loadStaticArea,
  loadGigContent,
  updateGigContent,
  loadTopperName,
  writeGigMemo
};

export default connect(mapStateToProps, mapDispatchToProps)(Management);
