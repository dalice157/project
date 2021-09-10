import React, { Component } from 'react';
import classnames from 'classnames';
import {
  Select, Drawer, Radio, Button
} from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import filterIcon from '../../img/common_v2/icon-filter.svg';
import CommunicationCard from '../../components/caseManagement_v2/CommunicationCard.js';
import Paginating from '../../components/ui/paginating';
import { communicationOpts } from '../../config/selectData.js';
import styles from './List.scss';
import { loadCommunicatingList, checkPublish } from '../../actions/gigManage';
import { loadStaticArea } from '../../actions/common';
import { makeUpChatMeta } from '../../actions/cases';

const { Option } = Select;

class CommunicationList extends Component {
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
    this.props.loadCommunicatingList();
    this.props.checkPublish();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.communicatingList !== this.props.communicatingList) {
      this.getListData(this.props.communicatingList.data, this.props.communicatingList);
    }
  }

  getListData = (data, list) => {
    this.setState({
      list: data,
      nextKey: list.cursor
    });
  }

  onChangeFilter =(val) => {
    const isChooseMP = this.props.isMobile ? val.target.value : val;
    console.log(`selected ${isChooseMP}`);
    const { data } = this.props.communicatingList;
    let filterData;

    const listType = {
      0: () => {
        filterData = data;
        return filterData;
      },
      1: () => { // 待確認合作
        filterData = data.filter((item) => {
          return item.partARequestCooperationDate && item.partBRequestCooperationDate === null && item.rejectDate === null;
        });
        return filterData;
      },
      2: () => { // 已先回報合作
        filterData = data.filter((item) => {
          return item.partBRequestCooperationDate && item.partARequestCooperationDate === null && item.rejectDate === null;
        });
        return filterData;
      },
      3: () => { // 尚未回報合作
        filterData = data.filter((item) => {
          return item.partARequestCooperationDate === null && item.partBRequestCooperationDate === null && item.rejectDate === null;
        });
        return filterData;
      },
      4: () => { // 回絕未合作
        filterData = data.filter((item) => {
          return item.rejectDate;
        });
        return filterData;
      },
    };
    this.setState({
      list: listType[isChooseMP](),
      opt: isChooseMP,
    });
  }

  onPagaChange = (pageNumber) => {
    this.setState({
      minValue: (pageNumber * 10) - 10,
      maxValue: pageNumber * 10,
      current: pageNumber
    });
  }

  nextPage = (key) => {
    this.props.communicatingList(key).then(() => {
      this.setState({
        list: this.props.communicatingList.data,
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
      isMobile, area, isCheckPublish, dealLists
    } = this.props;
    const {
      list, nextKey, dateOpt, minValue, maxValue, current
    } = this.state;
    const paginatingIsHide = list && !(list.length > 0);
    const numOfData = list.length;
    const cardObj = {
      area,
      isCheckPublish,
      isMobile,
      loadCommunicatingList: this.props.loadCommunicatingList,
      dealLists,
      dateOpt,
      makeUpChatMeta: this.props.makeUpChatMeta
    };
    if (isMobile) {
      return (
        <div className={styles.wrap}>
          <div className={styles.hearder}>
            溝通中案件共 {numOfData} 件
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
            <Radio.Group className={styles.listOpt} value={this.state.opt} onChange={this.onChangeFilter} buttonStyle="solid">
              {
                communicationOpts.map(opt => (
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
            list.slice(minValue, maxValue).map(item => (
              <CommunicationCard key={item.demandId} item={item} isMobile={isMobile} cardObj={cardObj} />
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
            溝通中案件共 {numOfData} 件
            <div className={styles.filter}>
              <Select value={this.state.opt} onChange={this.onChangeFilter}>
                {
                  communicationOpts.map(opt => (
                    <Option key={opt.label} value={opt.value}>{opt.label}</Option>
                  ))
                }
              </Select>
            </div>
          </div>
          {
            list.slice(minValue, maxValue).map(item => (
              <CommunicationCard key={item.demandId} item={item} cardObj={cardObj} />
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
  communicatingList: state.gigManage.communicatingList,
  area: state.common.area,
  isCheckPublish: state.gigManage.isCheckPublish,
  dealLists: state.gigManage.dealLists,
});
const mapDispatchToProps = {
  loadCommunicatingList,
  loadStaticArea,
  checkPublish,
  makeUpChatMeta
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommunicationList));
