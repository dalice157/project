import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { syncTutorInfo, getOldSiteInfo } from '../../../actions/member';
import './gig.scss';

class SyncOldSite extends Component {
  componentDidMount() {
    const { basicId } = this.props;
    this.props.getOldSiteInfo(basicId);
  }

  syncOldSiteInfo = async () => {
    const { basicId } = this.props;
    const syncResult = await this.props.syncTutorInfo(basicId);

    if (syncResult.payload && syncResult.type === 'SUCCESS_SYNC_TUTOR_INFO') {
      window.alert('家教點數 已同步完成!');
      window.location.reload();
    }
  }

  render() {
    const { oldSiteInfo } = this.props;

    return (
      <>
        { oldSiteInfo.tutorRemainCount > 0
          ? (<Button type="primary" onClick={ this.syncOldSiteInfo }>同步家教點數</Button>)
          : <></>
      }
      </>
    );
  }
}

const mapStateToProps = state => ({
  oldSiteInfo: state.member.oldSiteInfo,
});

const mapDispatchToProps = {
  syncTutorInfo,
  getOldSiteInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncOldSite);
