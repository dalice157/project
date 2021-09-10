/* eslint-disable for-direction */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { Select, Drawer, Radio } from 'antd';
import filterIcon from '../../img/common_v2/icon-filter.svg';
import { pastSixMonthsFormat } from '../../util/commonUtil.js';
import { contactOpts } from '../../config/selectData.js';
import { getListContact, checkPublish } from '../../actions/gigManage';
import { loadStaticArea } from '../../actions/common';
import ContactCard from '../../components/caseManagement_v2/ContactCard.js';
import Paginating from '../../components/ui/paginating';
import Button from '../../components/ui/button_v2';
import styles from './List.scss';

const { Option } = Select;


class ContactList extends Component {
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
    this.props.getListContact('', currentMonth);
    this.props.loadStaticArea();
    this.props.checkPublish();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listContact !== this.props.listContact) {
      this.getListData(this.props.listContact.data, this.props.listContact);
    }
  }

  getListData = (data, list) => {
    this.setState({
      list: data,
      nextKey: list.cursor
    });
  }

  handleChange =(val) => {
    const isChooseMP = this.props.isMobile ? val.target.value : val;
    console.log(`selected ${isChooseMP}`);
    this.setState({
      opt: isChooseMP,
    });
    const { data } = this.props.listContact;
    let filterData;

    const listType = {
      0: () => {
        filterData = data;
        return filterData;
      },
      1: () => { // 未回報合作
        filterData = data.filter((item) => {
          return item.partARequestCooperationDate === null && item.partBRequestCooperationDate === null && item.cooperatedDate === null && item.rejectDate === null;
        });
        return filterData;
      },
      2: () => { // 已回報待確認合作
        filterData = data.filter((item) => {
          return (item.partARequestCooperationDate || item.partBRequestCooperationDate) && item.cooperatedDate === null && item.rejectDate === null;
        });
        return filterData;
      },
      3: () => { // 已合作未評價
        filterData = data.filter((item) => {
          return item.cooperatedDate && item.reviewDate === null;
        });
        return filterData;
      },
      4: () => { // 已合作已評價
        filterData = data.filter((item) => {
          return item.cooperatedDate && item.reviewDate;
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
      minValue: 0,
      maxValue: 10,
    });
    this.props.getListContact('', isChooseMP);
  }

  onPagaChange = (pageNumber) => {
    this.setState({
      minValue: (pageNumber * 10) - 10,
      maxValue: pageNumber * 10,
      current: pageNumber
    });
  }

  nextPage = (key) => {
    console.log('key:', key);
    const year = this.state.dateOpt;
    const currentMonth = dayjs().format('YYYY-MM');
    this.props.getListContact(key, year).then(() => {
      this.setState({
        list: this.props.listContact.data,
        dateOpt: currentMonth,
        opt: 0
      });
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
      list, nextKey, dateOpt, minValue, maxValue, current
    } = this.state;
    const dateData = pastSixMonthsFormat();
    const paginatingIsHide = list && !(list.length > 0);
    const cardObj = {
      area,
      isCheckPublish,
      isMobile,
      getListContact: this.props.getListContact,
      dateOpt
    };


    if (isMobile) {
      return (
        <div className={styles.wrap}>
          <div className={styles.hearder}>
            {list && (`查閱案件共 ${list.length} 件`)}
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
                contactOpts.map(opt => (
                  <Radio.Button key={opt.label} value={opt.value}>{opt.label}</Radio.Button>
                ))
              }
            </Radio.Group>
            <h3 className={styles.title}>查閱聯絡資料日期</h3>
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
              <ContactCard
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
            <div className={styles.filter}>
              <Select value={this.state.dateOpt} onChange={this.handleDateChange}>
                {
                  dateData.map(opt => (
                    <Option key={opt} value={opt}>{opt}</Option>
                  ))
                }
              </Select>

              {list && (`查閱案件共 ${list.length} 件`)}
            </div>
            <Select className={styles.dateFilter} value={this.state.opt} onChange={this.handleChange}>
              {
                  contactOpts.map(opt => (
                    <Option key={opt.label} value={opt.value}>{opt.label}</Option>
                  ))
                }
            </Select>
          </div>
          {
            list && list.slice(minValue, maxValue).map(item => (
              <ContactCard
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
  listContact: state.gigManage.listContact,
  area: state.common.area,
  isCheckPublish: state.gigManage.isCheckPublish
});
const mapDispatchToProps = {
  getListContact,
  checkPublish,
  loadStaticArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactList);
