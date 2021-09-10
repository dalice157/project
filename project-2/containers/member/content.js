import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import {
  getMember,
  getCancelInfo,
  acDeleteProcess,
  deleteTop,
} from '../../actions/member';
import MemberTab from '../../components/member/memberTabs.js';


class Content extends Component {
  state = {
    memberFullName: '',
  }


  componentDidMount() {
    const { match } = this.props;
    const { basicId } = match.params;
    // eslint-disable-next-line react/destructuring-assignment
    this.props.loadCancelInfo(basicId);
    // eslint-disable-next-line react/destructuring-assignment
    this.props.loadDefaultMemberData(basicId).then(() => {
      this.initializeMemberData();
    });
  }

  initializeMemberData = () => {
    const { defaultMemberData: { topperVerifyForm } } = this.props;
    this.setState({
      memberFullName: topperVerifyForm.familyName + topperVerifyForm.firstName,
    });
  }


  render() {
    const {
      defaultMemberData,
      cancelInfo,
      loadAcDeleteProcess,
      loadDeleteTop,
    } = this.props;
    return (
      <>
        <h1>
          {this.state.memberFullName}
          會員資料
        </h1>
        {
        // 等API資料回來，將地區轉換後才render底下的Component
        this.props.defaultMemberData
          ? (
            <MemberTab
              defaultMemberData={defaultMemberData}
              cancelInfo={cancelInfo}
              loadAcDeleteProcess={loadAcDeleteProcess}
              loadDeleteTop={loadDeleteTop}
            />
          )
          : <LoadingOutlined />
      }
      </>
    );
  }
}

const mapStateToProps = state => ({
  defaultMemberData: state.member.memberData,
  cancelInfo: state.member.cancelInfo,
});


const mapDispatchToProps = {
  loadDefaultMemberData: getMember,
  loadCancelInfo: getCancelInfo,
  loadAcDeleteProcess: acDeleteProcess,
  loadDeleteTop: deleteTop,
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
