import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Divider } from 'antd';
import dayjs from 'dayjs';
import MultiSearchForm from './MultiSearchForm';
import { loadCategoryPool } from '../../../actions/statistics';
import ChartResult from './ChartResult';
import SearchShowV2 from './SearchShowV2';

class Manage extends Component {
  state = {
    queryParams: {
      startDate: null,
      endDate: null,
    },
  };

  onSubmitSearch = async (values, actions) => {
    this.setState({ queryParams: { startDate: null, endDate: null } });
    const {
      reportType, comparedStartDate, comparedEndDate, targetStartDate, targetEndDate, segmentType, sourceType, targetType, dimensionType,
    } = values;
    let startDate;
    let endDate;
    if (reportType === 0 && targetStartDate && targetEndDate) {
      // By月
      startDate = dayjs(targetStartDate).startOf('month').format('YYYY/MM/DD');
      endDate = dayjs(targetEndDate).endOf('month').format('YYYY/MM/DD');
    } else if (reportType === 1 && comparedStartDate && comparedEndDate) {
      // By日
      startDate = dayjs(comparedStartDate).format('YYYY/MM/DD');
      endDate = dayjs(comparedEndDate).format('YYYY/MM/DD');
    }

    const queryParams = {
      startDate,
      endDate,
      reportType, // 報表類型
      segmentType, // 顯示區隔
      sourceType, // 資料來源
      targetType, // 顯示指標
      dimensionType, // 其他維度
    };

    await this.props.loadCategoryPool(queryParams);
    this.setState({ queryParams });
    actions.setSubmitting(false);
  }


  render() {
    const { categoryPool } = this.props;
    const { queryParams, dateFilterType } = this.state;

    return (
      <>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item><h1 className="breadcrumb-header">經營概況報表</h1></Breadcrumb.Item>
        </Breadcrumb>
        <MultiSearchForm onSubmitSearch={this.onSubmitSearch} />
        <Divider />
        <SearchShowV2
          categoryPool={categoryPool}
          queryParams={queryParams}
          dateFilterType={dateFilterType}

        />
        <ChartResult
          categoryPool={categoryPool}
          queryParams={queryParams}
          dateFilterType={dateFilterType}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  categoryPool: state.statistics.categoryPool,
});

const mapDispatchToProps = {
  loadCategoryPool,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Manage));
