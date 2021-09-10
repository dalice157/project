import React, { PureComponent } from 'react';
import { Breadcrumb, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DurationSearch from '../../../components/statistics/marketingSales/DurationSearch';
import SalesTable from '../../../components/statistics/marketingSales/SalesTable';
import IndicatorDefinition from '../../../components/statistics/marketingSales/IndicatorDefinition';
import SalesChart from '../../../components/statistics/marketingSales/SalesChart';
import { loadMarketingSalesStatistics, loadMarketingSalesDailyStatistics } from '../../../actions/statistics';
import { startDateFormat, endDateFormat, dailyOrCurrentFormat } from '../../../util/formatUtil';

const startAndEndDateParams = (targetDate, comparedDate = '') => ({
  targetStartDate: startDateFormat(targetDate),
  targetEndDate: endDateFormat(targetDate),
  comparedStartDate: startDateFormat(comparedDate),
  comparedEndDate: endDateFormat(comparedDate),
});

class Sales extends PureComponent {
  state = {
    targetDate: null,
    comparedDate: null,
    isShowChartWrap: false,
    isLoading: false,
  }

  onSubmitSearch = async (values, actions) => {
    const { isCompared, targetDate, comparedDate } = values;
    const dates = {
      targetMonth: dailyOrCurrentFormat(targetDate, 'YYYY/MM/DD'),
      compareMonth: dailyOrCurrentFormat(comparedDate, 'YYYY/MM/DD'),
    };
    await this.props.loadMarketingSalesStatistics(dates, isCompared).then(() => {
      this.setState({
        isShowChartWrap: false,
      });
    });
    this.setState({ targetDate, comparedDate });
    actions.setSubmitting(false);
  }

  onSubmitChat = async () => {
    const { isCompared } = this.props;
    const { targetDate, comparedDate } = this.state;
    this.setState({
      isLoading: true,
    });
    await this.props.loadMarketingSalesDailyStatistics(startAndEndDateParams(targetDate, comparedDate), isCompared).then(() => {
      this.setState({
        isShowChartWrap: true,
        isLoading: false,
      });
    });
  }

  render() {
    const { salesTable, isCompared, salesDaily } = this.props;
    const {
      targetDate, comparedDate, isShowChartWrap, isLoading,
    } = this.state;
    const {
      targetStartDate, targetEndDate, comparedStartDate, comparedEndDate,
    } = startAndEndDateParams(targetDate, comparedDate);
    const dates = {
      targetDate,
      comparedDate,
    };
    const chatInfo = {
      isCompared,
      isShowChartWrap,
      isLoading,
      onSubmitChat: this.onSubmitChat,
      salesDaily,
      targetStartDate,
      targetEndDate,
      comparedStartDate,
      comparedEndDate,
    };
    return (
      <>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item><h1 className="breadcrumb-header">行銷業績報表</h1></Breadcrumb.Item>
        </Breadcrumb>
        <DurationSearch onSubmitSearch={this.onSubmitSearch} />
        <Divider />
        <SalesTable
          dates={dates}
          isCompared={isCompared}
          salesTable={salesTable}
        />
        <SalesChart
          chatInfo={chatInfo}
        />
        <IndicatorDefinition />
      </>
    );
  }
}
const mapStateToProps = state => ({
  salesTable: state.statistics.sales.table,
  isCompared: state.statistics.sales.isCompared,
  salesDaily: state.statistics.salesDaily,
});

const mapDispatchToProps = {
  loadMarketingSalesStatistics,
  loadMarketingSalesDailyStatistics,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sales);
