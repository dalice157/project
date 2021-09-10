import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddDemandForm from '../../../components/demand_v3/form/AddForm';
import { loadStaticArea } from '../../../actions/common';
import {
  getDemand, closeDemand, writeDemandMemo, getDemanderDefaultInfo, saveDemandv2, updateDemandv2, passCheck, updateDemandExpire,
} from '../../../actions/demand';
import { getDemanderInfo } from '../../../actions/member';
import { catSearch } from '../../../util/categoryUtils';
import { demandTypeList, onlineStatusOptsOfAddDemand } from '../../../config/demandOptions';
import { error } from '../../../util/messageUtil';

class demandForm extends Component {
  state = {
    isLoadedDemandData: false,
    demandType: null,
  }

  async componentDidMount() {
    const { match, history } = this.props;
    const { basicId } = match.params;
    const demandId = history.location.query.reOpenDemandId;
    const isPublishSameDemand = demandId;
    const actions = [
      this.props.loadStaticArea(),
      // 取得使用者資料 from member
      this.props.getDemanderInfo(basicId),
      // 案主聯絡方式
      this.props.getDemanderDefaultInfo(basicId),
    ];
    // 載入現有案件
    if (isPublishSameDemand) {
      actions.push(
        this.props.getDemand(basicId, `Demand-${demandId}`)
          .then((res) => {
            const { character, demandTutorInfo } = res.payload.demandDAO;
            let demandType = '';
            // 舊案件過濾
            if (character === null) {
              demandType = demandTutorInfo ? demandTypeList[0].value : demandTypeList[1].value;
            } else {
              demandType = character;
            }
            this.setState({ demandType });
          }),
      );
    }
    await Promise.all(actions);
    this.initializeDemandData();
  }

  componentDidUpdate(prevprops) {
    if (this.props.defaultDemandData !== prevprops.defaultDemandData) {
      this.initializeDemandData();
    }
  }

  submitDemand = async (values, actions) => {
    const { demandType } = this.state;
    const submitDemandData = {};
    const assignPlace = [];
    const { match, demanderInfo } = this.props;
    const { basicId } = match.params;
    const {
      demandDAO, contactTimeBegin, contactTimeEnd, name, sex, cellphone, telArea, tel, email, other, hideCellphone, hideTel, hideOther, areaData, memo,
    } = values;
    const {
      onlineStatusOption, designatedPlace, demandBody, demandCategory, educationalStage, oldSiteCaseNo, demandTutorInfo, demandOutsourceInfo, expireDate,
    } = demandDAO;
    const isTutorSkill = demandCategory.some(cat => (Math.floor(cat / 1000000) === 1));
    const expireDateFormats = expireDate === '-' && `ExpireDemand-${expireDate.replace(/[-]/g, '')}`;

    if (designatedPlace) {
      assignPlace.push(areaData.areaNo);
    }

    if (designatedPlace && !areaData.areaDesc) {
      error('should-choose-area');
      actions.setSubmitting(false);
      return false;
    }

    Object.assign(submitDemandData, {
      basicId: demanderInfo.basicId,
      character: demandType,
      demandCategory,
      demandBody: {
        ...demandBody,
        // assignPlace不可傳空陣列到後端
        assignPlace: Array.isArray(assignPlace) && assignPlace.length > 0 ? assignPlace : null,
      },
      demandContactDTO: {
        name, sex, cellphone, telArea, tel, email, other, contactTimeBegin, contactTimeEnd, displayCellphone: !hideCellphone, displayTel: !hideTel, displayOther: !hideOther,
      },
      demandTutorInfo: demandType === demandTypeList[0].value ? { ...demandTutorInfo } : null,
      demandOutsourceInfo: demandType === demandTypeList[1].value ? { ...demandOutsourceInfo } : null,
      educationalStage: isTutorSkill ? educationalStage : null,
      onlineStatus: (onlineStatusOption === 1 || onlineStatusOption === 2) ? onlineStatusOption : null,
      oldSiteCaseNo: oldSiteCaseNo && oldSiteCaseNo.length > 1 ? oldSiteCaseNo : null,
    });

    if (expireDateFormats) {
      Object.assign(submitDemandData, { expireDate: expireDateFormats });
    }

    // 案件備註
    const memoForm = {
      basicId,
      memo,
    };

    try {
      const submitActions = [];
      // 送出案件
      submitActions.push(this.props.saveDemandv2(submitDemandData));
      await Promise.all(submitActions)
        .then((resList) => {
          const demandRes = resList[0];
          if (demandRes.payload && demandRes.payload.success) {
            const newDemandId = demandRes.payload.data.demandId;
            if (memo) {
              this.props.loadInsertDemandMemo(newDemandId, memoForm);
            }
            alert(`案件資料新增成功! ${newDemandId}`);
            window.location.href = `/admin/demand/edit/${basicId}?demandId=${newDemandId.split('-')[1]}`;
          }
        });
    } catch (err) {
      console.log(err);
    }
    actions.setSubmitting(false);
  }

  initializeDemandData = () => {
    const { defaultDemandData, area } = this.props;
    const { demandDAO: demand } = defaultDemandData;
    const isPlaceExist = demand.demandBody.assignPlace && Array.isArray(demand.demandBody.assignPlace) && demand.demandBody.assignPlace.length > 0;
    const isAreaLoaded = Array.isArray(area) && area.length > 0;
    if (isPlaceExist && isAreaLoaded) {
      const postNum = demand.demandBody.assignPlace[0];
      const search = catSearch(area, postNum);
      this.setState({
        areaNo: postNum,
        areaDesc: search ? search.des : '',
        isLoadedDemandData: true,
      });
    } else {
      this.setState({
        isLoadedDemandData: true,
      });
    }
  }

  onChangeDemandType = (demandType) => {
    this.setState({ demandType });
  }

  render() {
    const {
      history, match, demanderInfo, demanderDefaultInfo, defaultDemandData, onPassCheck, loadInsertDemandMemo, location,
    } = this.props;
    const {
      isLoadedDemandData, areaNo, areaDesc, demandType,
    } = this.state;
    const initialData = {};
    const { reOpenDemandId } = history.location.query;
    const { basicId } = match.params;
    const isReOpenDemandPage = Boolean(reOpenDemandId);
    const areaData = {
      areaNo,
      areaDesc,
    };
    const { demandContactDTO, demandDAO } = defaultDemandData;
    const designatedPlace = !!(demandDAO.demandBody.assignPlace && demandDAO.demandBody.assignPlace.length > 0);
    const hasExpireDate = (isReOpenDemandPage) && demandDAO.expireDate !== null;
    const expireDate = hasExpireDate && demandDAO.expireDate ? demandDAO.expireDate.split('-')[1] : '-';
    // 修改/同需求刊登才載入聯絡人資料
    if (isReOpenDemandPage) {
      if (demandContactDTO !== undefined && demandContactDTO !== null) {
        const {
          name, email, cellphone, sex, telArea, tel, other, displayCellphone, displayTel, displayOther, contactTimeBegin, contactTimeEnd,
        } = demandContactDTO;
        Object.assign(initialData, {
          ...defaultDemandData,
          areaData: {
            areaDesc: areaData ? areaData.areaDesc : '',
            areaNo: areaData ? areaData.areaNo : '',
          },
          demandDAO: {
            ...demandDAO,
            designatedPlace,
            offReason: demandDAO.offReason !== null && demandDAO.offReason !== -1 ? demandDAO.offReason : -1,
            educationalStage: demandDAO.educationalStage ? demandDAO.educationalStage : 0,
            onlineStatusOption: location.query && location.query.reOpenDemandId ? onlineStatusOptsOfAddDemand.phoneVerified[0].value : demandDAO.onlineStatusOption,
            demandTutorInfo: {
              ...defaultDemandData.demandDAO.demandTutorInfo,
            },
            expireDate: hasExpireDate ? dayjs(`${expireDate.slice(0, 4)}-${expireDate.slice(4, 6)}-${expireDate.slice(6, 8)}`) : '-',
          },
          lastMemo: defaultDemandData.lastMemo,
          name,
          sex,
          cellphone,
          telArea,
          tel,
          email,
          other,
          contactTimeBegin,
          contactTimeEnd,
          hideCellphone: !displayCellphone,
          hideTel: !displayTel,
          hideOther: !displayOther,
        });
      }
    } else {
      // 案件新增頁
      Object.assign(initialData, {
        ...defaultDemandData,
        areaData: {
          areaDesc: areaData ? areaData.areaDesc : '',
          areaNo: areaData ? areaData.areaNo : '',
        },
        demandDAO: {
          ...demandDAO,
          designatedPlace,
          offReason: demandDAO.offReason !== null && demandDAO.offReason !== -1 ? demandDAO.offReason : -1,
          educationalStage: demandDAO.educationalStage ? demandDAO.educationalStage : 0,
          onlineStatusOption: demandDAO.usageStage === '3' && location.query.reOpenDemandId ? onlineStatusOptsOfAddDemand.phoneVerified[0].value : demandDAO.onlineStatusOption,
          demandTutorInfo: {
            ...defaultDemandData.demandDAO.demandTutorInfo,
            classPlace: null,
          },
        },
        lastMemo: defaultDemandData.lastMemo,
        name: '',
        sex: '',
        cellphone: '',
        telArea: '',
        tel: '',
        email: '',
        contactTimeBegin: '',
        contactTimeEnd: '',
      });
    }

    return (
      <>
        <h1 style={{ margin: '20px auto' }}>案件新增頁</h1>
        {
        isLoadedDemandData
          ? (
            <AddDemandForm
              initialData={initialData}
              demanderInfo={demanderInfo}
              defaultDemandData={defaultDemandData}
              demanderDefaultInfo={demanderDefaultInfo}
              areaData={areaData}
              demandType={demandType}
              onChangeDemandType={this.onChangeDemandType}
              loadInsertDemandMemo={loadInsertDemandMemo}
              submitDemand={this.submitDemand}
              onPassCheck={onPassCheck}
              location={history.location}
              reOpenDemandId={reOpenDemandId}
              basicId={basicId}
              updateDemandExpire={this.props.updateDemandExpire}
            />
          )
          : (
            <>
              <LoadingOutlined />
              <span style={{ marginLeft: '10px' }}>資料載入中</span>
            </>
          )
      }
      </>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
  area: state.common.area,
  demanderInfo: state.member.demanderInfo,
  defaultDemandData: state.demand.demandData,
  demanderDefaultInfo: state.demand.demanderDefaultInfo,
  expireDateInfo: state.demand.expireDateInfo,
});

const mapDispatchToProps = {
  loadStaticArea,
  closeDemand,
  getDemand,
  getDemanderInfo,
  getDemanderDefaultInfo,
  loadInsertDemandMemo: writeDemandMemo,
  saveDemandv2,
  updateDemandv2,
  onPassCheck: passCheck,
  updateDemandExpire,
};

export default connect(mapStateToProps, mapDispatchToProps)(demandForm);
