import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Divider } from 'antd';

import dayjs from 'dayjs';
import { queryDemandListByKey, getDemandMultiSearch } from '../../actions/demand.js';
import SingleSearchForm from '../../components/demand_v3/singleSearchForm.js';
import MultiSearchForm from '../../components/demand_v3/multiSearchForm.js';
import DemandList from '../../components/demand_v3/demandList.js';

class Demand extends Component {
    state = {
      multiSearchList: {
        dateType: 'createDate',
        times: {
          yearMonth: dayjs(),
          start: null,
          end: null,
        },
        demandOptions: {
          allOptions: '全部',
          tutorOptions: '請選擇中項',
          partnerOptions: '',
          demandType: '0',
        },
        onlineStatus: 0,
        depositStatus: 0,
        violationStatus: 0,
      },
    }

    // async for button loading
    queryAndKeep = async (formValue) => {
      this.formValue = formValue;
      await this.props.getDemandMultiSearch(formValue, null, false);
    }

    nextPage = (key) => {
      this.props.getDemandMultiSearch(this.formValue, key, true);
    }

    render() {
      return (
        <>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item><a href="/admin/">Home</a></Breadcrumb.Item>
            <Breadcrumb.Item>案件查詢</Breadcrumb.Item>
          </Breadcrumb>
          <SingleSearchForm onSubmitKey={this.props.queryDemandListByKey} />
          <Divider />
          <MultiSearchForm multiSearchList={this.state.multiSearchList} getDemandMultiSearch={this.queryAndKeep} optionList={this.props.optionList} nextKey={this.props.nextKey} />
          <Divider />
          <DemandList data={this.props.demandList} nextPage={this.nextPage} nextKey={this.props.nextKey} />
        </>
      );
    }
}

const mapStateToProps = state => ({
  demandList: state.demand.demandList,
  nextKey: state.demand.cursor,
});

const mapDispatchToProps = {
  queryDemandListByKey,
  getDemandMultiSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Demand);
