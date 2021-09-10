import React, { PureComponent } from 'react';
import { Breadcrumb, Divider, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import DurationSearch from '../../../components/statistics/marketingPlans/DurationSearch';
import { loadMarketingPlanStatisticsTable } from '../../../actions/statistics';
import PlansTable from '../../../components/statistics/marketingPlans/PlansTable';
import PlansChart from '../../../components/statistics/marketingPlans/PlansChart';

class Plans extends PureComponent {
  state = {
    targetStartDate: null,
    targetEndDate: null,
    comparedStartDate: null,
    comparedEndDate: null,
  };

  async componentDidMount() {
    const {
      targetStartDate, targetEndDate, comparedStartDate, comparedEndDate,
    } = this.props.history.location.query;
    if (targetStartDate && targetEndDate && comparedStartDate && comparedEndDate) {
      message.loading('報表資料載入中');
      await this.props.loadMarketingPlanStatisticsTable(dayjs(targetStartDate).format('YYYY/MM/DD'), dayjs(targetEndDate).format('YYYY/MM/DD'), dayjs(comparedStartDate).format('YYYY/MM/DD'), dayjs(comparedEndDate).format('YYYY/MM/DD'));
      this.setState({
        targetStartDate, targetEndDate, comparedStartDate, comparedEndDate,
      });
    } else if (targetStartDate && targetEndDate) {
      message.loading('報表資料載入中');
      await this.props.loadMarketingPlanStatisticsTable(dayjs(targetStartDate).format('YYYY/MM/DD'), dayjs(targetEndDate).format('YYYY/MM/DD'));
      this.setState({ targetStartDate, targetEndDate });
    }
  }

  onSubmitSearch = async (values, actions) => {
    const {
      targetStartDate, targetEndDate, comparedStartDate, comparedEndDate, isCompared,
    } = values;
    console.log('onsub:', values);
    if (isCompared) {
      await this.props.loadMarketingPlanStatisticsTable(dayjs(targetStartDate).format('YYYY/MM/DD'), dayjs(targetEndDate).format('YYYY/MM/DD'), dayjs(comparedStartDate).format('YYYY/MM/DD'), dayjs(comparedEndDate).format('YYYY/MM/DD'));
    } else {
      await this.props.loadMarketingPlanStatisticsTable(dayjs(targetStartDate).format('YYYY/MM/DD'), dayjs(targetEndDate).format('YYYY/MM/DD'));
    }
    this.setState({
      targetStartDate, targetEndDate, comparedStartDate, comparedEndDate,
    });
    actions.setSubmitting(false);
  }

  render() {
    const { plansTable, isCompared } = this.props;
    const {
      targetStartDate, targetEndDate, comparedStartDate, comparedEndDate,
    } = this.state;

    const dates = {
      targetStartDate,
      targetEndDate,
      comparedStartDate,
      comparedEndDate,
    };

    return (
      <>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item><h1 className="breadcrumb-header">行銷付費方案統計表</h1></Breadcrumb.Item>
        </Breadcrumb>
        <DurationSearch onSubmitSearch={this.onSubmitSearch} />
        <Divider />
        <PlansTable
          dates={dates}
          plansTable={plansTable}
          isCompared={isCompared}
        />
        <PlansChart
          dates={dates}
          plansTable={plansTable}
          isCompared={isCompared}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  plansTable: state.statistics.plans.table,
  isCompared: state.statistics.plans.isCompared,
});

const mapDispatchToProps = {
  loadMarketingPlanStatisticsTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Plans));
