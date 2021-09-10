import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Spin
} from 'antd';
import {
  loadUserInfo, getCancel, cancel, yolkMemberBeenToEdit, loadDefaultProfile, loadTestUser
} from '../../actions/basic';
import config from '../../config/config';
import styles from './Editor.scss';
import Step from '../../components/ui/step';
import Iframe from '../../components/ui/iframe';
import Button from '../../components/ui/button';
import { stepIterator } from '../../util/editStepUtil';


class Editor extends Component {
  state = {
    loading: false,
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    this.props.loadTestUser();
    this.props.initUser().then((json) => {
      console.log(json);
      this.props.loadDefaultProfile().then(() => {
        this.setState({
          loading: false
        });
      });
      if (json.payload.freeToDeposit && json.payload.meta.importTopperSource) {
        this.props.yolkMemberBeenToEdit().then((jsonYolk) => {
          console.log(jsonYolk);
          this.props.initUser();
        });
      }
    });
  }

  render() {
    const { user, testUser, location } = this.props;
    let queryTypeVal = '';
    if (location.query.type) {
      queryTypeVal = `?type=${location.query.type}&memberType=new`;
    } else if (location.query.publish) {
      queryTypeVal = '?publish=success';
    }
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <div className={styles.wrap}>
          <Iframe title="編輯頁" src={`${config.profileSite.domain}/editor/commonMode`} />
          {
          user.meta && (
            <div className={styles.step}>
              <Step current={0} stepData={stepIterator(user, testUser, '', location.query.checkOk || '', location)}>
                <Link to={`/serviceItems${queryTypeVal}`}>
                  <Button type="danger">
                    下一步
                  </Button>
                </Link>
              </Step>
            </div>
          )
        }
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  userStatus: state.user.status,
  getCancel: state.basic.getCancel,
  yolk: state.basic.yolkMember,
  defaultProfileData: state.basic.profile,
  testUser: state.basic.testUser,
});

const mapDispatchToProps = {
  initUser: loadUserInfo,
  loadDefaultProfile,
  loadGetCancel: getCancel,
  putCancel: cancel,
  yolkMemberBeenToEdit,
  loadTestUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
