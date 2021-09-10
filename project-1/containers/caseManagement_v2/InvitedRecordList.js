import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { Select, Drawer, Radio } from 'antd';
import filterIcon from '../../img/common_v2/icon-filter.svg';
import { pastSixMonthsFormat } from '../../util/commonUtil.js';
// import { invitedRecordOpts } from '../../config/selectData.js'; // TODO 已讀、未讀篩選先註解
import { getListQuotation } from '../../actions/gigManage';
import { loadStaticArea } from '../../actions/common';
import InvitedRecordCard from '../../components/caseManagement_v2/InvitedRecordCard.js';
import Paginating from '../../components/ui/paginating';
import Button from '../../components/ui/button_v2';
import styles from './List.scss';
import { dateFormat } from '../../config/constant';

const { Option } = Select;

class InvitedRecordList extends Component {
  constructor(props) {
    super(props);
    const currentMonth = dayjs().format('YYYY-MM');
    this.state = {
      opt: 0,
      dateOpt: currentMonth,
      list: [],
      nextKey: null,
      visible: false,
      minValue: 0,
      maxValue: 10,
      current: 1,
    };
  }

  componentDidMount() {
    const currentMonth = dayjs().format('YYYY-MM');
    this.props.getListQuotation('', currentMonth);
    this.props.loadStaticArea();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listQuotation !== this.props.listQuotation) {
      this.getListData(this.props.listQuotation.data, this.props.listQuotation);
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
    const year = this.state.dateOpt;
    const currentMonth = dayjs().format('YYYY-MM');
    this.props.getListQuotation(key, year).then(() => {
      this.setState({
        dateOpt: currentMonth,
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
    const { data } = this.props.listQuotation;
    let filterData;
    const listType = {
      0: () => {
        filterData = data;
        return filterData;
      },
      1: () => {
        filterData = data.filter((item) => {
          return item.viewed === false;
        });
        return filterData;
      },
      2: () => {
        filterData = data.filter((item) => {
          return item.viewed === true;
        });
        return filterData;
      },
    };
    this.setState({
      list: listType[isChooseMP]()
    });
  }

  handleDateChange = (val) => {
    const isChooseMP = this.props.isMobile ? val.target.value : val;
    console.log(`selected ${isChooseMP}`);
    this.setState({
      dateOpt: isChooseMP,
      opt: 0,
      current: 1,
      minValue: 0,
      maxValue: 10
    });
    this.props.getListQuotation('', isChooseMP);
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
      isMobile, area, isCheckPublish,
    } = this.props;
    const {
      list, nextKey, minValue, maxValue, current
    } = this.state;
    const dateData = pastSixMonthsFormat();
    const paginatingIsHide = list && !(list.length > 0);
    const cardObj = {
      area,
      isCheckPublish,
      isMobile,
    };
    if (isMobile) {
      return (
        <div className={styles.wrap}>
          <div className={styles.hearder}>
            {list && (`應徵案件共 ${list.length} 件`)}
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
            {/* TODO 已讀、未讀篩選先註解 */}
            {/* <h3 className={styles.title}>案件狀態</h3>
            <Radio.Group className={styles.listOpt} value={this.state.opt} onChange={this.handleChange} buttonStyle="solid">
              {
                invitedRecordOpts.map(opt => (
                  <Radio.Button key={opt.label} value={opt.value}>{opt.label}</Radio.Button>
                ))
              }
            </Radio.Group> */}
            <h3 className={styles.title}>案件應徵日期</h3>
            <Radio.Group className={styles.listOpt} value={this.state.dateOpt} onChange={this.handleDateChange} buttonStyle="solid">
              {
                dateData.map(opt => (
                  <Radio.Button key={opt} value={opt}>{opt}</Radio.Button>
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
              <InvitedRecordCard
                key={`${item.demandId}${item.applyDate ? dayjs(item.applyDate).format(dateFormat) : ''}`}
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
            <div className={styles.filter}>
              <Select value={this.state.dateOpt} onChange={this.handleDateChange}>
                {
                  dateData.map(opt => (
                    <Option key={opt} value={opt}>{opt}</Option>
                  ))
                }
              </Select>

              {list && (`應徵案件共 ${list.length} 件`)}
            </div>
            {/* 已讀、未讀篩選先註解
            <Select className={styles.dateFilter} value={this.state.opt} onChange={this.handleChange}>
              {
                  invitedRecordOpts.map(opt => (
                    <Option key={opt.label} value={opt.value}>{opt.label}</Option>
                  ))
                }
            </Select> */}
          </div>
          {
            list && list.slice(minValue, maxValue).map(item => (
              <InvitedRecordCard
                key={`${item.demandId}${item.applyDate ? dayjs(item.applyDate).format(dateFormat) : ''}`}

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
  listQuotation: state.gigManage.listQuotation,
  area: state.common.area,
});
const mapDispatchToProps = {
  getListQuotation,
  loadStaticArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(InvitedRecordList);
