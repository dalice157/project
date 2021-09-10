import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { queryChecklistCase } from '../../actions/demand.js';
import DemandVerificationList from '../../components/demand_v3/demandVerificationList.js';


class CheckList extends Component {
    filterBySlot = (slot) => {
      // console.log('slot',slot);
      this.slot = slot;
      this.props.query(slot);
    }

    nextPage = (nextKey) => {
      this.props.query(this.slot || -2, nextKey);
    }

    render() {
      // const dottedLine = <Fragment><hr style={{ border: '1px dashed #DDDDDD' }} /><br /></Fragment>;
      return (
        <Fragment>
          <Breadcrumb style={ { margin: '16px 0' } }>
            <Breadcrumb.Item><a href="/admin/">Home</a></Breadcrumb.Item>
            <Breadcrumb.Item>後審—發佈後案件</Breadcrumb.Item>
          </Breadcrumb>
          <DemandVerificationList data={ this.props.orders } nextKey={ this.props.nextKey } nextPage={ this.nextPage } filterBySlot={ this.filterBySlot } />
        </Fragment>
      );
    }

    componentDidMount() {
      this.props.query(-2);
    }
}

const mapStateToProps = state => ({
  orders: state.demand.checklistCase,
  nextKey: state.demand.next
});

const mapDispatchToProps = {
  query: queryChecklistCase,
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckList);
