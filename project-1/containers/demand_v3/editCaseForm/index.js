import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Modal, Breadcrumb } from 'antd';
import { demandTypes } from '../../../config/selectData';
import { loadStaticArea, checkMemberPublishDemand } from '../../../actions/common';
import styles from './EditCaseForm.scss';
import {
  addDemandv2,
  modifyDemandv2,
  getDefaultDemanderForm,
  getSavedDemand,
  unmountCaseFormData,
} from '../../../actions/demand';
import { isContainTutorCats } from '../../../util/lablesUtils.js';
import EditPublishTutorForm from './EditPublishTutorForm';
import EditPublishCaseForm from './EditPublishCaseForm';

class EditCaseForm extends PureComponent {
  constructor(props) {
    super(props);
    this.pageRef = React.createRef();
    this.formRef = React.createRef();
  }

    state = {
      isLoadingDemandForm: false,
      isInitializeForm: true,
    }

    componentDidMount = async () => {
      this.props.loadStaticArea();
      const demandId = this.props.location.query.demandId;
      const demandType = this.props.location.query.demandType;
      // 無家教/外包類型的舊案件
      const isEditOldDemand = !demandType;
      this.setState({ isLoadingDemandForm: true });
      const result = await Promise.all([
        this.props.getDefaultDemanderForm(),
        this.props.getSavedDemand(demandId),
      ]);
      if (result[1].payload) {
        // 回新增頁編輯案件
        if (isEditOldDemand) {
          // 舊案件不會有caracter
          const { demandCategory } = this.props.initialCaseForm;
          const isTutor = isContainTutorCats(demandCategory);
          this.onChangeDemandType(isTutor ? demandTypes.tutor : demandTypes.case);
        }
      }
      this.setState({ isLoadingDemandForm: false, isInitializeForm: false });
    }

    componentWillUnmount = () => {
      this.props.unmountCaseFormData();
    }

    renderForm = (demandType, formRef, area) => {
      const { isLoadingDemandForm, isInitializeForm } = this.state;
      if (demandType === demandTypes.tutor) {
        return (
          <EditPublishTutorForm
            formRef={formRef}
            isLoadingDemandForm={isLoadingDemandForm}
            area={area}
            isInitializeForm={isInitializeForm}
          />
        );
      } else if (demandType === demandTypes.case) {
        return (
          <EditPublishCaseForm
            formRef={formRef}
            isLoadingDemandForm={isLoadingDemandForm}
            area={area}
            isInitializeForm={isInitializeForm}
          />
        );
      } else {
        return <></>;
      }
    }

  // 使用者點選回上一步時，詢問是否取消
  onPrev = () => {
    const onCancel = () => this.props.history.push('/demand');
    Modal.confirm({
      title: '確認取消需求資料編輯',
      content: '是否確認取消需求資料編輯？點選【確認】將不會儲存所填寫之所有內容。',
      okText: '確認',
      cancelText: '取消',
      onOk() {
        onCancel();
      },
    });
  }

  render() {
    const { area } = this.props;
    const demandType = this.props.location.query.demandType;
    return (
      <div className={styles.wrap}>
        {/* 三步驟的展示 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to="/">首頁</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/demand">管理我的需求</Link></Breadcrumb.Item>
          <Breadcrumb.Item>編輯需求內容</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.block} />
        <div className={styles.pageRef} ref={this.pageRef} />
        {this.renderForm(demandType, this.formRef, area)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  area: state.common.area,
  defaultDemanderForm: state.demand.defaultDemanderForm,
  saveDemand: state.demand.saveDemand,
  initialCaseForm: state.demand.initialCaseForm,
});
const mapDispatchToProps = {
  loadStaticArea,
  getDefaultDemanderForm,
  onSaveDemand: addDemandv2,
  onModifyDemand: modifyDemandv2,
  getSavedDemand,
  checkMemberPublishDemand,
  unmountCaseFormData,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditCaseForm));
