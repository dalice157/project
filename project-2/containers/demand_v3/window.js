import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import WindowForm from '../../components/demand_v3/windowForm.js';
import { getDemandWindow, saveDemandWindow } from '../../actions/demand.js';

class Content extends Component {
    priceConvertor = (price, unit) => {
      const priceStatus = unit === 1 ? '時薪' : '論件計酬';
      const minPrice = price[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      const maxPrice = price[1].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      if (price[0] === price[1]) return priceStatus.concat('\t$'.concat(minPrice));
      else { return priceStatus.concat('\t$'.concat(minPrice)).concat('~').concat('$'.concat(maxPrice)); }
    }

    render() {
      return (
        <Fragment>
          <Breadcrumb style={ { margin: '16px 0' } }>
            <Breadcrumb.Item><a href="/admin/">Home</a></Breadcrumb.Item>
            <Breadcrumb.Item>案件櫥窗</Breadcrumb.Item>
          </Breadcrumb>
          <WindowForm
            demandWindowId={ this.props.demandWindowId }
            demandWindowData={ this.props.demandWindowData }
            getDemandWindow={ this.props.getDemandWindow }
            saveDemandWindow={ this.props.saveDemandWindow }
            priceConvertor={ this.priceConvertor }
          />
        </Fragment>
      );
    }
}
const mapStateToProps = state => ({
  demandWindowId: state.demand.demandWindowId,
  demandWindowData: state.demand.demandWindowData
});

const mapDispatchToProps = {
  getDemandWindow,
  saveDemandWindow
};
export default connect(mapStateToProps, mapDispatchToProps)(Content);
