import React, { PureComponent } from 'react';
import { Breadcrumb, Divider } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import DurationSearch from '../../../components/statistics/sales/DurationSearch';
import SalesTable from '../../../components/statistics/sales/SalesTable';
import { loadSalesStatistics } from '../../../actions/statistics';

class Sales extends PureComponent {
  state = {
    // 預備會員
    prepMember: [],
    // 回流水池
    returnPool: [],
    // 續約水池
    continuousPool: [],
    // 再購水池
    rePayPool: [],
    isCompared: false,
    targetDate: null,
    comparedDate: null,
  }

  onSubmitSearch = async (values, actions) => {
    const { isCompared, targetDate, comparedDate } = values;
    if (isCompared) {
      await this.props.loadSalesStatistics(dayjs(targetDate).format('YYYY/MM/DD'), dayjs(comparedDate).format('YYYY/MM/DD'));
    } else {
      await this.props.loadSalesStatistics(dayjs(targetDate).format('YYYY/MM/DD'));
    }
    this.setState({ targetDate, comparedDate });
    actions.setSubmitting(false);
  }

  render() {
    const { salesTable, isCompared } = this.props;
    const {
      prepMember, returnPool, continuousPool, rePayPool, targetDate, comparedDate
    } = this.state;
    const targetChart = {
      prepMember,
      returnPool,
      continuousPool,
      rePayPool,
    };
    const dates = {
      targetDate,
      comparedDate,
    };
    return (
      <>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item><h1 className="breadcrumb-header">經管業績報表</h1></Breadcrumb.Item>
        </Breadcrumb>
        <DurationSearch onSubmitSearch={ this.onSubmitSearch } />
        <Divider />
        <SalesTable
          targetChart={ targetChart }
          dates={ dates }
          isCompared={ isCompared }
          salesTable={ salesTable }
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  salesTable: state.statistics.sales.table,
  isCompared: state.statistics.sales.isCompared,
});

const mapDispatchToProps = {
  loadSalesStatistics,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sales);
