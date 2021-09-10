import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import { Breadcrumb, Select, Modal } from 'antd';
import classnames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import Paginating from '../../components/ui/paginating';
import { loadUserInfo } from '../../actions/basic';
import { isRoleDemander } from '../../util/demanderUtil';

import {
  loadDemandList,
  filterDemandList,
  evaluateTopper,
  demandCloseSubmit,
  changePhoneDisplay,
} from '../../actions/demand';
import {
  loadStaticArea, chkActiveProcess, confirmCooperate, preConfirmCooperate,
} from '../../actions/common';
import Card from '../../components/demand_v3/Card';
import HiddenOrderForm from '../../components/pay/HiddenOrderForm';
import Button from '../../components/ui/button';
import styles from './Demand.scss';

const { Option } = Select;
const defaultPage = 1;

class Demand extends Component {
  state = {
    selectOpt: 0,
    isFilter: false,
  }

  async componentDidMount() {
    const page = this.props.location.query.page || defaultPage;
    const type = this.props.location.query.type || 'all';
    // 從信件來
    const confirmCooperatePayload = this.props.location.query.payload;
    if (confirmCooperatePayload) {
      this.props.preConfirmCooperate(confirmCooperatePayload)
        .then((result) => {
          const topperName = result.payload.data && result.payload.data.topperName;
          this.onAskCooperateTopper(confirmCooperatePayload, topperName);
        });
    }

    // 已登入流程
    const userResult = await this.props.initUser();
    const user = userResult.payload;
    if (isRoleDemander(user)) {
      this.props.loadStaticArea();
      if (type === 'all') {
        this.props.loadDemandList(page);
      } else {
        this.props.filterDemandList(type, page)
          .then(() => this.setState({ selectOpt: type, isFilter: true }));
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { location, user } = this.props;
    const { page } = location.query;
    const prePage = prevProps.location.query.page;
    if (page !== prePage && isRoleDemander(user)) {
      this.onUpdateDemandList();
    }
  }

  onUpdateDemandList = () => {
    const { selectOpt, isFilter } = this.state;
    const { page } = this.props.location.query;
    if (!isFilter) {
      this.props.loadDemandList(page || defaultPage);
    } else if (isFilter) {
      this.props.filterDemandList(selectOpt, page || defaultPage);
    }
  }

  onAskCooperateTopper = (payload, topperName) => {
    Modal.confirm({
      title: `是否確認與高手 ${topperName} 合作？`,
      okText: '是',
      cancelText: '否',
      onOk: () => this.props.confirmCooperate(payload),
    });
  }

  onFiliterChange = (value) => {
    const { user } = this.props;
    const isDemander = isRoleDemander(user);
    const page = this.props.location.query.page || 1;
    value == null ? (
      this.setState({
        selectOpt: undefined,
        isFilter: false,
      }),
      isDemander && this.props.filterDemandList(undefined, page),
      this.props.history.add('page', 1)

    )
      : (
        this.setState({
          selectOpt: value,
          isFilter: true,
        }),
        isDemander && this.props.filterDemandList(value, page),
        this.props.history.add('page', 1),
        this.props.history.add('type', value)
      );
  }

  onPagaChange = (pageNumber) => {
    this.props.history.add('page', pageNumber);
  }

  render() {
    const params = this.props.location.query;
    const pageNum = params.page == 1 || params.page == undefined ? 1 : Number(params.page);
    const {
      user, lists, area, isLoadingDemandList, history,
    } = this.props;
    const isDemander = isRoleDemander(user);
    const paginatingIsHide = !(lists && lists.data.length > 0);
    const { type } = this.props.location.query;

    return (
      <div className={styles.bg}>
        <BrowserView>
          <div className={styles.wrap}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
              <Breadcrumb.Item>管理我的需求</Breadcrumb.Item>
            </Breadcrumb>
            <h2 className={styles.title}>
              <span className={styles.button}>
                我的需求
                <Button type="primary"><Link to="/caseForm">新增需求</Link></Button>
              </span>
              <Select className={styles.select} defaultValue={type || 'all'} onChange={this.onFiliterChange}>
                <Option value="all">全部需求</Option>
                <Option value="0">編輯中</Option>
                <Option value="0.5">待審中</Option>
                <Option value="1">刊登中</Option>
                <Option value="2">結案</Option>
                <Option value="3">取消未刊登</Option>
              </Select>
            </h2>
            <div className={styles.cardWarp}>
              <Card
                lists={lists}
                area={area}
                isDemander={isDemander}
                demandCloseSubmit={this.props.demandCloseSubmit}
                user={this.props.user}
                loading={isLoadingDemandList}
                chkActiveProcess={this.props.chkActiveProcess}
                history={history}
                onUpdateDemandList={this.onUpdateDemandList}
                changePhoneDisplay={this.props.changePhoneDisplay}
              />
            </div>
            <Paginating
              className={classnames(styles.pagination, { [styles.dNone]: paginatingIsHide })}
              current={pageNum}
              defaultCurrent={1}
              defaultPageSize={10}
              total={lists && lists.total}
              onChange={this.onPagaChange}
            />
            {this.props.paid
              && <HiddenOrderForm formData={this.props.paid} />
            }
          </div>
        </BrowserView>
        <MobileView>
          <div className={styles.mobileWrap}>
            <div className={styles.titleWrap}>
              <Breadcrumb separator=">">
                <Breadcrumb.Item href="/">首頁</Breadcrumb.Item>
                <Breadcrumb.Item>我的需求管理中心</Breadcrumb.Item>
              </Breadcrumb>
              <h2 className={styles.title}>
                我的需求
                <Button type="primary"><Link to="/caseForm">新增需求</Link></Button>
              </h2>
            </div>
            <Select className={styles.select} defaultValue={type || 'all'} onChange={this.onFiliterChange}>
              <Option value="all">全部需求</Option>
              <Option value="0">編輯中</Option>
              <Option value="0.5">待審中</Option>
              <Option value="1">刊登中</Option>
              <Option value="2">結案</Option>
              <Option value="3">取消未刊登</Option>
            </Select>
            <div className={styles.cardWarp}>
              <Card
                lists={lists}
                area={area}
                isDemander={isDemander}
                demandCloseSubmit={this.props.demandCloseSubmit}
                user={this.props.user}
                loading={isLoadingDemandList}
                chkActiveProcess={this.props.chkActiveProcess}
                history={history}
                onUpdateDemandList={this.onUpdateDemandList}
                changePhoneDisplay={this.props.changePhoneDisplay}
              />
            </div>
            <Paginating
              className={classnames(styles.pagination, { [styles.dNone]: paginatingIsHide })}
              current={pageNum}
              defaultCurrent={1}
              defaultPageSize={10}
              total={lists && lists.total}
              onChange={this.onPagaChange}
            />
            {this.props.paid
              && <HiddenOrderForm formData={this.props.paid} />
            }
          </div>
        </MobileView>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  area: state.common.area,
  lists: state.demand.lists,
  saveDemand: state.demand.saveDemand,
  defaultDemanderForm: state.demand.defaultDemanderForm,
  verifySMS: state.common.verifySMS,
  verifyPhone: state.common.verifyPhone,
  activate: state.demand.activate,
  paid: state.demand.paid,
  close: state.demand.close,
  review: state.demand.review,
  isLoadingDemandList: state.demand.isLoadingDemandList,
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  chkActiveProcess,
  loadDemandList,
  filterDemandList,
  loadStaticArea,
  demandCloseSubmit,
  evaluateTopper,
  confirmCooperate,
  preConfirmCooperate,
  changePhoneDisplay,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Demand));
