import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import { getPaidRecord } from '../../actions/gigManage';
import PaidRecordList from '../../components/caseManagement_v2/PaidRecordList';

class PaidRecord extends Component {
  async componentDidMount() {
    this.props.getPaidRecord();
  }

  render() {
    const isMobile = uaIsMobile();
    const { paidRecord } = this.props;
    const { data, isLoading } = paidRecord;
    return (
      <PaidRecordList paidData={data} isMobile={isMobile} isLoading={isLoading} />
    );
  }
}

const mapStateToProps = state => ({
  paidRecord: state.gigManage.paidRecord,
});
const mapDispatchToProps = {
  getPaidRecord,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PaidRecord));
