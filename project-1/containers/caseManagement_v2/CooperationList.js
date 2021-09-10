import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Select, Drawer, Radio } from 'antd';
import filterIcon from '../../img/common_v2/icon-filter.svg';
import CooperationCard from '../../components/caseManagement_v2/CooperationCard.js';
import Paginating from '../../components/ui/paginating';
import Button from '../../components/ui/button_v2';
import { cooperationOpts } from '../../config/selectData.js';
import { getListCooperating, checkPublish } from '../../actions/gigManage';
import { loadStaticArea } from '../../actions/common';
import styles from './List.scss';

const { Option } = Select;

class CooperationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opt: 0,
      list: [],
      nextKey: null,
      visible: false,
      minValue: 0,
      maxValue: 10,
      current: 1,
    };
  }

  componentDidMount() {
    this.props.getListCooperating();
    this.props.loadStaticArea();
    this.props.checkPublish();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listCooperating !== this.props.listCooperating) {
      this.getListData(this.props.listCooperating.data, this.props.listCooperating);
    }
  }

  getListData = (data, list) => {
    this.setState({
      list: data,
      nextKey: list.cursor
    });
  }

  nextPage = (key) => {
    console.log('key:', key);
    this.props.getListCooperating(key).then(() => {
      this.setState({
        list: this.props.listCooperating.data,
        opt: 0
      });
    });
  }

  handleChange =(val) => {
    const isChooseMP = this.props.isMobile ? val.target.value : val;
    console.log(`selected ${isChooseMP}`);
    this.setState({
      opt: isChooseMP,
    });
    const { data } = this.props.listCooperating;
    let filterData;
    const listType = {
      0: () => {
        filterData = data;
        return filterData;
      },
      1: () => { // 尚未評價
        filterData = data.filter((item) => {
          return item.reviewDate === null;
        });
        return filterData;
      },
      2: () => { // 已邀請評價
        filterData = data.filter((item) => {
          return item.requireReviewDate && item.reviewDate === null;
        });
        return filterData;
      },
      3: () => { // 已評價
        filterData = data.filter((item) => {
          return item.reviewDate;
        });
        return filterData;
      },
    };
    this.setState({
      list: listType[isChooseMP]()
    });
  }

  onPagaChange = (pageNumber) => {
    this.setState({
      minValue: (pageNumber * 10) - 10,
      maxValue: pageNumber * 10,
      current: pageNumber
    });
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      isMobile, area, isCheckPublish, dealLists
    } = this.props;
    const {
      list, nextKey, minValue, maxValue, current
    } = this.state;
    const paginatingIsHide = list && !(list.length > 0);
    const cardObj = {
      area,
      isCheckPublish,
      isMobile,
      dealLists,
      getListCooperating: this.props.getListCooperating
    };
    if (isMobile) {
      return (
        <div className={styles.wrap}>
          <div className={styles.hearder}>
            {list && (`合作中案件共 ${list.length} 件`)}
            <div onClick={this.showDrawer}>
              <img src={filterIcon} alt="篩選" />
            </div>
          </div>
          <Drawer
            className={styles.drawerMP}
            width="100%"
            title="進階篩選"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <h3 className={styles.title}>案件狀態</h3>
            <Radio.Group className={styles.listOpt} value={this.state.opt} onChange={this.handleChange} buttonStyle="solid">
              {
                cooperationOpts.map(opt => (
                  <Radio.Button key={opt.label} value={opt.value}>{opt.label}</Radio.Button>
                ))
              }
            </Radio.Group>
            <div className={styles.footer}>
              <Button onClick={this.onClose} type="danger">
                確定
              </Button>
            </div>
          </Drawer>
          {
            list && list.slice(minValue, maxValue).map(item => (
              <CooperationCard
                key={item.demandId}
                item={item}
                cardObj={cardObj}
              />
            ))
          }
          <Paginating
            className={classnames(styles.pagination, { [styles.dNone]: paginatingIsHide })}
            current={current}
            defaultCurrent={1}
            defaultPageSize={10}
            total={list.length}
            onChange={this.onPagaChange}
            nextKey={nextKey}
            nextPage={this.nextPage}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.wrap}>
          <div className={styles.hearder}>
            {list && (`合作中案件共 ${list.length} 件`)}
            <div className={styles.filter}>
              <Select value={this.state.opt} onChange={this.handleChange}>
                {
                  cooperationOpts.map(opt => (
                    <Option key={opt.label} value={opt.value}>{opt.label}</Option>
                  ))
                }
              </Select>
            </div>
          </div>
          {
            list && list.slice(minValue, maxValue).map(item => (
              <CooperationCard
                key={item.demandId}
                item={item}
                cardObj={cardObj}
              />
            ))
          }
          <Paginating
            className={classnames(styles.pagination, { [styles.dNone]: paginatingIsHide })}
            current={current}
            defaultCurrent={1}
            defaultPageSize={10}
            total={list.length}
            onChange={this.onPagaChange}
            nextKey={nextKey}
            nextPage={this.nextPage}
          />
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  listCooperating: state.gigManage.listCooperating,
  area: state.common.area,
  isCheckPublish: state.gigManage.isCheckPublish,
  dealLists: state.gigManage.dealLists,
});
const mapDispatchToProps = {
  getListCooperating,
  loadStaticArea,
  checkPublish,
};

export default connect(mapStateToProps, mapDispatchToProps)(CooperationList);
