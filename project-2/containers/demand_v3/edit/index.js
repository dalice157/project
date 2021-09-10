import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import EditDemandForm from '../../../components/demand_v3/form/EditForm';
import { loadStaticArea } from '../../../actions/common';
import {
  getDemand, closeDemand, writeDemandMemo, getDemanderDefaultInfo, saveDemandv2, updateDemandv2, passCheck, updateDemandExpire,
} from '../../../actions/demand';
import { getDemanderInfo } from '../../../actions/member';
import { catSearch } from '../../../util/categoryUtils';
import { demandTypeList } from '../../../config/demandOptions';
import { error } from '../../../util/messageUtil';

class demandForm extends Component {
  state = {
    isLoadedDemandData: false,
    demandType: null,
  }

  async componentDidMount() {
    const { match, history } = this.props;
    const { basicId } = match.params;
    const isEditPage = history.location.pathname.includes('edit');
    const actions = [
      this.props.loadStaticArea(),
      // 取得使用者資料 from member
      this.props.getDemanderInfo(basicId),
      // 案主聯絡方式
      this.props.getDemanderDefaultInfo(basicId),
    ];
    // 載入現有案件
    if (history.location.query.reOpenDemandId || isEditPage) {
      actions.push(
        this.props.getDemand(basicId, `Demand-${this.queryDemandId()}`)
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

  queryDemandId = () => {
    const { history } = this.props;
    let demandId;
    if (history.location.query.demandId) {
      demandId = history.location.query.demandId;
      return demandId;
    } else if (history.location.query.reOpenDemandId) {
      demandId = history.location.query.reOpenDemandId;
      return demandId;
    }
    demandId = undefined;
    return demandId;
  };

  initializeDemandData = () => {
    const { defaultDemandData, area } = this.props;
    const { demandDAO: demand } = defaultDemandData;
    const assignPlaceExist = !!(demand.demandBody.assignPlace && demand.demandBody.assignPlace.length > 0);
    const postNum = assignPlaceExist ? demand.demandBody.assignPlace[0] : ''; // 6001000000
    const search = postNum.length > 0 ? Array.isArray(area) && area.length > 0 && catSearch(area, postNum) : null;
    this.setState({
      areaNo: postNum,
      areaDesc: search ? search.des : '',
      isLoadedDemandData: true,
    });
  }

  onChangeDemandType = (demandType) => {
    this.setState({ demandType });
  }

  submitDemand = async (values, actions) => {
    const { history, match, demanderInfo } = this.props;
    const { basicId } = match.params;
    const isDemandEditPage = history.location.pathname.includes('edit');
    const isReOpenDemand = history.location.query.reOpenDemandId;
    const {
      demandDAO, contactTimeBegin, contactTimeEnd, name, sex, cellphone, telArea, tel, email, other, hideCellphone, hideTel, hideOther, areaData, memo,
    } = values;
    const {
      demandId, onlineStatusOption, designatedPlace, demandBody, demandCategory, offReason, educationalStage, oldSiteCaseNo, demandTutorInfo, demandOutsourceInfo, expireDate,
    } = demandDAO;
    const { demandType } = this.state;

    let assignPlace = [];
    if (designatedPlace) {
      assignPlace.push(areaData.areaNo);
    } else {
      assignPlace = null;
    }

    if (designatedPlace && !areaData.areaDesc) {
      error('should-choose-area');
      actions.setSubmitting(false);
      return false;
    }

    let isTutorSkill = false;
    demandCategory.map((cat) => {
      if (Math.floor(cat / 1000000) === 1) {
        isTutorSkill = true;
      }
      return isTutorSkill;
    });

    let editDemandData;
    if (isReOpenDemand) {
      editDemandData = {
        basicId: demanderInfo.basicId,
        character: demandType,
        demandBody: {
          ...demandBody,
          assignPlace,
        },
        demandCategory,
        demandContactDTO: {
          name, sex, cellphone, telArea, tel, email, other, contactTimeBegin, contactTimeEnd, displayCellphone: !hideCellphone, displayTel: !hideTel, displayOther: !hideOther,
        },
        demandTutorInfo: demandType === demandTypeList[0].value ? { ...demandTutorInfo } : null,
        demandOutsourceInfo: demandType === demandTypeList[1].value ? { ...demandOutsourceInfo } : null,
        educationalStage: isTutorSkill ? educationalStage : null,
        onlineStatus: (onlineStatusOption === 1 || onlineStatusOption === 2) ? onlineStatusOption : null,
        oldSiteCaseNo: oldSiteCaseNo && oldSiteCaseNo.length > 1 ? oldSiteCaseNo : null,
      };
    } else {
      editDemandData = {
        ...values.demandDAO,
        basicId: demanderInfo.basicId,
        character: demandType,
        demandId: isDemandEditPage ? demandId : null,
        usageStage: (onlineStatusOption === 1 || onlineStatusOption === 2) ? '1' : values.demandDAO.usageStage,
        onlineStatus: (onlineStatusOption === 1 || onlineStatusOption === 2) ? onlineStatusOption : null,
        demandBody: {
          ...demandBody,
          assignPlace,
        },
        offReason: onlineStatusOption === 3 ? offReason : null,
        educationalStage: isTutorSkill ? educationalStage : null,
        oldSiteCaseNo: oldSiteCaseNo && oldSiteCaseNo.length > 1 ? oldSiteCaseNo : null,
        demandContactDTO: {
          name, sex, cellphone, telArea, tel, email, other, contactTimeBegin, contactTimeEnd, displayCellphone: !hideCellphone, displayTel: !hideTel, displayOther: !hideOther,
        },
        demandTutorInfo: demandType === demandTypeList[0].value ? { ...demandTutorInfo } : null,
        demandOutsourceInfo: demandType === demandTypeList[1].value ? { ...demandOutsourceInfo } : null,
      };
    }

    const expireDateFormats = expireDate === '-' && `ExpireDemand-${expireDate.replace(/[-]/g, '')}`;
    if (expireDateFormats) {
      editDemandData = {
        ...editDemandData,
        expireDate: expireDateFormats,
      };
    }

    // 案件備註
    const memoForm = {
      basicId,
      memo,
    };

    try {
      const submitActions = [];
      // 送出案件
      if (isDemandEditPage) {
        if (onlineStatusOption === 3) {
          submitActions.push(this.props.closeDemand(editDemandData));
        } else {
          submitActions.push(this.props.updateDemandv2(editDemandData));
        }
      } else {
        submitActions.push(this.props.saveDemandv2(editDemandData));
      }

      await Promise.all(submitActions)
        .then((resList) => {
          const demandRes = resList[0];
          if (demandRes.payload && demandRes.payload.success) {
            const newDemandId = demandRes.payload.data.demandId;
            if (memo) {
              this.props.loadInsertDemandMemo(newDemandId, memoForm);
            }
            alert(`案件資料${isDemandEditPage ? '修改' : '新增'}成功! ${newDemandId}`);
            window.location.href = `/admin/demand/edit/${basicId}?demandId=${newDemandId.split('-')[1]}`;
          }
        });
    } catch (err) {
      console.log(err);
    }
    actions.setSubmitting(false);
  }

  render() {
    const {
      history, match, demanderInfo, demanderDefaultInfo, defaultDemandData, onPassCheck, loadInsertDemandMemo,
    } = this.props;
    const {
      isLoadedDemandData, areaNo, areaDesc, demandType,
    } = this.state;
    const { reOpenDemandId } = history.location.query;
    const { basicId } = match.params;
    const isDemandEditPage = history.location.pathname.includes('edit');
    const areaData = {
      areaNo,
      areaDesc,
    };
    return (
      <>
        <h1 style={{ margin: '20px auto' }}>{isDemandEditPage ? '案件修改頁' : '案件新增頁'}</h1>
        {
        isLoadedDemandData
          ? (
            <EditDemandForm
              demanderInfo={demanderInfo}
              defaultDemandData={defaultDemandData}
              demanderDefaultInfo={demanderDefaultInfo}
              areaData={areaData}
              demandType={demandType}
              onChangeDemandType={this.onChangeDemandType}
              loadInsertDemandMemo={loadInsertDemandMemo}
              submitDemand={this.submitDemand}
              onPassCheck={onPassCheck}
              location={this.props.history.location}
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
