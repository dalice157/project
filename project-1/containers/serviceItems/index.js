import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { AddCircleOutline } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { Modal, Spin } from 'antd';
import { loadStaticArea } from '../../actions/common';
import {
  loadUserInfo, loadGigs, saveGigs, deleteGig, publish, getCancel, cancel, loadDefaultProfile, loadTestUser
} from '../../actions/basic';
import styles from './ServiceItems.scss';
import Step from '../../components/ui/step';
import Button from '../../components/ui/button';
import Card from '../../components/serviceItems/Card';
import {
  defaultMoneyData, moneyData, timeSlotData, gigData
} from '../../components/serviceItems/popoverData';
import { experienceData } from '../../config/selectData';
import { isContainTutorCats } from '../../util/lablesUtils';
import { error as sysError } from '../../util/messageUtil';
import { stepIterator } from '../../util/editStepUtil';

const timeDescs = [...timeSlotData[0].times, ...timeSlotData[1].times];
const timeValues = [...timeSlotData[0].values, ...timeSlotData[1].values];
const GIG_MAX_LENGTH = 7;
const confirm = Modal.confirm;
class ServiceItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gigs: [],
      images: {},
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.loadTestUser();
    this.props.initUser().then(() => {
      this.initializeGigs();
    });
  }

  initializeGigs = async () => {
    await this.props.loadGigs();
    await this.props.loadStaticArea();
    await this.props.loadDefaultProfile().then(() => {
      this.setState({ loading: false });
    });
    const gigs = this.props.gigs.data.length
      ? this.props.gigs.data
      : [JSON.parse(JSON.stringify(gigData))]; // 預設一組服務項目

    gigs.forEach((gig, index) => {
      gig.id = index + 1;
      gig.title = gig.title ? gig.title : '';
      gig.cats = gig.cats ? gig.cats : [];
      gig.body = gig.body ? gig.body : {};
      gig.body.unit = gig.body.unit ? gig.body.unit : defaultMoneyData.unit;
      gig.body.price = gig.body.price ? gig.body.price : defaultMoneyData.price;
      gig.body.exp = gig.body.exp ? gig.body.exp : 0;
      gig.body.area = gig.body.area ? gig.body.area : []; // '6001000000'
      gig.body.onsiteOpts = gig.body.onsiteOpts ? gig.body.onsiteOpts : []; // 0, 1, 2
      gig.body.clientCats = gig.body.clientCats ? gig.body.clientCats : []; // 0, 1, 2, 3, 4, 5
      gig.body.priority = gig.body.priority ? gig.body.priority : []; // 1, 2, 3, 4, 5, 6
      gig.body.desc = gig.body.desc ? gig.body.desc : '';
      gig.catTag = gig.catTag ? gig.catTag : [];
    });

    this.setState({
      oldGigs: JSON.parse(JSON.stringify(gigs)),
      gigs: gigs,
      images: this.props.gigs.fileMap,
    });
  }

  onClickAdd = (e) => {
    e.preventDefault();
    const { gigs } = this.state;
    const newGig = JSON.parse(JSON.stringify(gigData));
    newGig.id = Date.now();

    const newGigs = gigs.length < GIG_MAX_LENGTH
      ? [newGig, ...gigs]
      : gigs;
    scrollTo(0, 0);
    this.setState({ gigs: newGigs });
  }

  onClickCopy = id => (e) => {
    e.preventDefault();
    const { gigs } = this.state;
    const target = gigs.find(gig => gig.id === id);
    const newGig = JSON.parse(JSON.stringify(target));

    if (newGig.gigId) {
      delete newGig.gigId;
    }

    newGig.id = Date.now();

    const newGigs = gigs.length < GIG_MAX_LENGTH
      ? [newGig, ...gigs]
      : gigs;
    scrollTo(0, 0);
    this.setState({ gigs: newGigs });
  }

  onClickDel = (id, data) => {
    const delGig = this.state.gigs.find(gig => gig.id === id);
    const isNewGig = delGig.gigId === undefined;
    const isReviewCount = data.reviewCount !== undefined && data.reviewCount !== 0 ? '該服務已累積成交評價，確定要刪除嗎？' : '刪除後無法復原，確定要刪除嗎？';
    confirm({
      title: isReviewCount,
      okText: '刪除',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (!isNewGig) {
            await this.props.deleteGig(delGig.gigId);
          }

          if (isNewGig || this.props.delGig.success) {
            const { gigs } = this.state;
            const newGigs = gigs.filter(gig => gig.id != id);
            this.setState({ gigs: newGigs });
          }
        } catch (error) {
          console.log(error);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 上傳/裁切圖片
  onCoverPicChange = ({ id = '', coverPic = '' }) => {
    const { gigs, images } = this.state;
    const addImageKey = Object.keys(coverPic)[0];
    const changeGig = gigs.find(gig => gig.id === id);
    const changeImageKey = changeGig.body.coverPic;
    const isNewImage = addImageKey !== changeImageKey && addImageKey.length >= 34; // TODO 暫時解決上傳圖的過程中離開頁面，導致 coverPic 會是 undefined
    const newImages = JSON.parse(JSON.stringify(images)) || {};

    newImages[addImageKey] = coverPic[addImageKey];

    if (isNewImage) {
      delete newImages[changeImageKey];
    }

    this.setState({
      gigs: gigs.map((gig) => {
        gig.body.coverPic = gig.id === id ? addImageKey : gig.body.coverPic;

        return gig;
      }),
      images: newImages
    });
  }

  onTitleChange = ({ id = '', title = '' }) => {
    const { gigs } = this.state;

    this.setState({
      gigs: gigs.map((gig) => {
        gig.title = gig.id === id ? title : gig.title;

        return gig;
      })
    });
  }

  onCatsChange = ({ id = '', cats = [] }) => {
    const { gigs } = this.state;
    console.log(cats);

    this.setState({
      gigs: gigs.map((gig) => {
        gig.cats = gig.id === id ? cats : gig.cats;

        return gig;
      })
    });
  }

  onMoneyChange = ({ id = '', unit = '', price = '' }) => {
    const { gigs } = this.state;

    this.setState({
      gigs: gigs.map((gig) => {
        gig.body.unit = gig.id === id ? unit : gig.body.unit;
        gig.body.price = gig.id === id ? price : gig.body.price;
        gig.body.price = gig.body.unit == moneyData[0].value && gig.body.price < defaultMoneyData.minCase
          ? defaultMoneyData.minCase
          : gig.body.price;
        gig.body.price = gig.body.unit == moneyData[1].value && gig.body.price < defaultMoneyData.minHourRate
          ? defaultMoneyData.minHourRate
          : gig.body.price;

        return gig;
      })
    });
  }

  onExperienceChange = ({ id = '', experience = 0 }) => {
    const { gigs } = this.state;

    this.setState({
      gigs: gigs.map((gig) => {
        gig.body.exp = gig.id === id ? experience : gig.body.exp;

        return gig;
      })
    });
  }

  onAreaChange = ({ id = '', area = [] }) => {
    const { gigs } = this.state;

    this.setState({
      gigs: gigs.map((gig) => {
        gig.body.area = gig.id === id ? area : gig.body.area;

        return gig;
      })
    });
  }

  onMethodChange = ({ id = '', onsiteOpts = [] }) => {
    const { gigs } = this.state;
    this.setState({
      gigs: gigs.map((gig) => {
        gig.body.onsiteOpts = gig.id == id ? onsiteOpts : gig.body.onsiteOpts;

        return gig;
      })
    });
  }

  onTargetChange = ({ id = '', clientCats = [] }) => {
    const { gigs } = this.state;
    this.setState({
      gigs: gigs.map((gig) => {
        gig.body.clientCats = gig.id == id ? clientCats : gig.body.clientCats;

        return gig;
      })
    });
  }

  onTimeSlotChange = ({ id = '', weekdayDescs = [], holidayDescs = [] }) => {
    const selectTimeSlotDescs = [...weekdayDescs, ...holidayDescs];
    const priority = timeValues.filter((time, index) => selectTimeSlotDescs.includes(timeDescs[index]));

    const { gigs } = this.state;
    this.setState({
      gigs: gigs.map((gig) => {
        gig.body.priority = gig.id == id ? priority : gig.body.priority;

        return gig;
      })
    });
  }

  onDescChange = ({ id = '', desc = '' }) => {
    const { gigs } = this.state;

    this.setState({
      gigs: gigs.map((gig) => {
        gig.body.desc = gig.id === id ? desc : gig.body.desc;

        return gig;
      })
    });
  }

  onCatTagChange = ({ id = '', catTag = '' }) => {
    const { gigs } = this.state;

    this.setState({
      gigs: gigs.map((gig) => {
        gig.catTag = gig.id === id ? catTag : gig.catTag;

        return gig;
      })
    });
  }

  onStepPrev = () => {

  }

  isGigValidate = (gigs) => {
    let isValid = true;
    let isDescValid = true;
    gigs.forEach((gig) => {
      gig.title = gig.title.substring(0, 20);
      isValid = gig.title.length == 0 ? false : isValid;
      isValid = gig.cats.length == 0 ? false : isValid; // 服務類型

      if (gig.body.unit == moneyData[0].value) {
        isValid = gig.body.price < defaultMoneyData.minCase ? false : isValid;
      } else if (gig.body.unit == moneyData[1].value) {
        isValid = gig.body.price < defaultMoneyData.minHourRate ? false : isValid;
      } else {
        isValid = false;
      }

      isValid = experienceData.find(exp => exp.id == gig.body.exp) ? isValid : false; // 服務經驗
      isValid = gig.body.area.length == 0 ? false : isValid; // 地區範圍
      isValid = gig.body.onsiteOpts.length == 0 ? false : isValid; // 服務方式
      isValid = isContainTutorCats(gig.cats) && gig.body.clientCats.length == 0 ? false : isValid; // 服務對象
      isValid = gig.body.priority.length == 0 ? false : isValid; // 服務時段
      isDescValid = isDescValid && gig.body && ((gig.body.desc && gig.body.desc.length <= 2500) || (gig.body.desc === ''));// 檢查描述字數
    });

    if (!isValid) {
      sysError('serviceitem-invalid');
    }

    if (!isDescValid) {
      sysError('gig-desc-limit');
    }

    return isValid && isDescValid;
  }

  onStepNext = async () => {
    const { query } = this.props.location;
    const { gigs, oldGigs } = this.state;
    const parsedGigs = JSON.parse(JSON.stringify(gigs));
    const isGigValid = this.isGigValidate(parsedGigs);
    const updatedGigs = gigs.filter((gig) => {
      const oldGig = oldGigs.find(oldgig => oldgig.gigId === gig.gigId);
      const isNewGid = gig.gigId === undefined;
      const isGigUpdate = JSON.stringify(oldGig) !== JSON.stringify(gig);
      return isNewGid || isGigUpdate;
    });
    let queryTypeVal = '';
    if (query.type) {
      queryTypeVal = `?type=${query.type}&memberType=new`;
    }
    if (isGigValid) {
      try {
        await this.props.saveGigs(updatedGigs, this.props.gigs._csrf);
        if (this.props.addGigs.success) {
          this.props.history.push(`/editProfile${queryTypeVal}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  saveAndPublish = async () => {
    const { gigs, oldGigs } = this.state;
    const parsedGigs = JSON.parse(JSON.stringify(gigs));
    const isGigValid = this.isGigValidate(parsedGigs);
    const updatedGigs = gigs.filter((gig) => {
      const oldGig = oldGigs.find(oldgig => oldgig.gigId === gig.gigId);
      const isNewGid = gig.gigId === undefined;
      const isGigUpdate = JSON.stringify(oldGig) !== JSON.stringify(gig);

      return isNewGid || isGigUpdate;
    });

    if (isGigValid) {
      this.setState({ loading: true });
      try {
        await this.props.saveGigs(updatedGigs, this.props.gigs._csrf);
        if (this.props.addGigs.success) {
          this.props.publish().then(() => this.props.history.push('/success?publish=success')); // 儲存後發佈
        } else {
          this.setState({ loading: false });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  renderCard = () => {
    const onGigChange = {
      onCoverPicChange: this.onCoverPicChange,
      onTitleChange: this.onTitleChange,
      onCatsChange: this.onCatsChange,
      onMoneyChange: this.onMoneyChange,
      onExperienceChange: this.onExperienceChange,
      onAreaChange: this.onAreaChange,
      onMethodChange: this.onMethodChange,
      onTargetChange: this.onTargetChange,
      onTimeSlotChange: this.onTimeSlotChange,
      onDescChange: this.onDescChange,
      onCatTagChange: this.onCatTagChange,
    };

    return (
      <Fragment>
        {
          this.state.gigs.map(gig => (
            <Card
              key={gig.id}
              gigsLength={this.state.gigs.length}
              gig={gig}
              coverPic={
                gig.body && gig.body.coverPic && this.state.images[gig.body.coverPic] && this.state.images[gig.body.coverPic][0] // TODO: 沒有封面圖時的處理
                  ? this.state.images[gig.body.coverPic][0]
                  : ''
              }
              areaCats={this.props.area}
              onClickCopy={this.onClickCopy}
              onClickDel={this.onClickDel}
              onGigChange={onGigChange}
            />
          ))
        }
      </Fragment>
    );
  }

  render() {
    const addGigBtn = this.state.gigs.length < GIG_MAX_LENGTH
      ? (
        <div className={styles.setting}>
          <a onClick={this.onClickAdd} href="#"><AddCircleOutline /></a>
        </div>
      )
      : '';
    const isLoading = this.state.loading ? styles.loadBg : '';
    const {
      user, userStatus, testUser, location
    } = this.props;
    let queryTypeVal = '';
    if (location.query.type) {
      queryTypeVal = `?type=${location.query.type}&memberType=new`;
    } else if (location.query.publish) {
      queryTypeVal = '?publish=success';
    }
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <div className={`${styles.wrap} ${isLoading}`}>
          <div className={styles.service}>
            <h3>
              服務項目
              {
                addGigBtn
              }
            </h3>
            <div className={styles.block}>
              {
                this.renderCard()
              }
            </div>
          </div>
        </div>
        {
          user.meta && (
            <div className={styles.step}>
              <Step current={1} stepData={stepIterator(user, testUser, '', location.query.checkOk || '', location)}>
                <Link to={`/editor${queryTypeVal}`}>
                  <Button onClick={this.onStepPrev}>
                    上一步
                  </Button>
                </Link> &nbsp;&nbsp;
                {
                  (userStatus === 2 || location.query.publish) ? (
                    <Button onClick={this.saveAndPublish} type="danger">
                      儲存發佈
                    </Button>
                  )
                    : (
                      <Button onClick={this.onStepNext} type="danger">
                        下一步
                      </Button>
                    )
                }
              </Step>
            </div>
          )
        }

      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  area: state.common.area,
  gigs: state.basic.gigs,
  addGigs: state.basic.saveGigs,
  delGig: state.basic.delGig,
  userStatus: state.user.status,
  getCancel: state.basic.getCancel,
  defaultProfileData: state.basic.profile,
  testUser: state.basic.testUser,
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  loadStaticArea,
  loadDefaultProfile,
  loadGigs,
  saveGigs,
  deleteGig,
  publish,
  loadGetCancel: getCancel,
  putCancel: cancel,
  loadTestUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceItems);
