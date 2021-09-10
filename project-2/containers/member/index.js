import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { FilterFilled } from '@ant-design/icons';
import { Breadcrumb, Divider, Modal } from 'antd';
import dayjs from 'dayjs';
import SingleSearchForm from '../../components/member/singleSearchForm.js';
import MultiSearchForm from '../../components/member/multiSearchForm.js';
import MemberList from '../../components/member/list.js';

import { queryMemberListByKey, getMemberMultiSearch, initiatLoginToken } from '../../actions/member.js';
import config from '../../config/config';


class Member extends Component {
    state = {
      multiSearchList: {
        dateType: 0,
        times: {
          yearMonth: dayjs(),
          start: null,
          end: null,
        },
        onlineStatus: 0,
        serviceStatus: 0,
        blockStatus: 0,
        memberStatus: 0,
        oldSiteType: 0,
      },
      memberList: null,
      isFilter: false,
    }

    getMemberList = () => {
      this.setState({
        memberList: this.props.memberList || [],
        isFilter: false,
      });
    }

    queryAndKeep = async (formValue) => {
      this.formValue = formValue;
      await this.props.getMemberMultiSearch(formValue);
      if (this.props.memberList) {
        this.setState({
          memberList: this.props.memberList,
          isFilter: false,
        });
      }
    }

    nextPage = (key) => {
      this.props.getMemberMultiSearch(this.formValue, key);
    }

    proxyLogin = (pid) => {
      Modal.confirm({
        title: '會員代登',
        content: (
          <>
            <b>請選擇代登範圍？</b>
          </>
        ),
        onOk: async () => {
          this.props.initiatLoginToken(pid).then((json) => {
            window.open(`${config.proxyAPI.proxyLogin}?impersonation_token=${json.payload.data.acToken}&plus=true`);
          });
        },
        onCancel: async () => {
          this.props.initiatLoginToken(pid).then((json) => {
            window.open(`${config.proxyAPI.proxyLogin}?impersonation_token=${json.payload.data.acToken}`);
          });
        },
        okText: '全代登',
        cancelText: '高手only',
      });
    }

    handleFilter = () => {
      const { memberList } = this.props;
      const { memberList: data, isFilter } = this.state;
      const filteredNotPublished = data.filter(value => value.topNickName === '未公開');
      const filteredNotInfo = data.filter(item => item.topNickName === null);
      if (!isFilter) {
        this.setState({
          memberList: [...filteredNotPublished, ...filteredNotInfo],
          isFilter: true,
        });
      } else {
        this.setState({
          memberList,
          isFilter: false,
        });
      }
    };

    showFilter = (currentPageData) => {
      console.log('currentPageData:', currentPageData);
      return (
        <span style={{ color: this.state.isFilter ? '#1890ff' : '' }}>
          <FilterFilled
            onClick={this.handleFilter}
          />
        </span>
      );
    };

    render() {
      const { singleSearchLoading } = this.props;
      const { memberList, isFilter } = this.state;
      return (
        <Fragment>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item><a href="/admin/">Home</a></Breadcrumb.Item>
            <Breadcrumb.Item>會員管理</Breadcrumb.Item>
          </Breadcrumb>
          <SingleSearchForm
            onSubmitKey={this.props.queryMemberListByKey}
            getMemberList={this.getMemberList}
            singleSearchLoading={singleSearchLoading}
          />
          <Divider />
          <MultiSearchForm optionList={this.props.optionList} multiSearchList={this.state.multiSearchList} getMemberMultiSearch={this.queryAndKeep} />
          <Divider />
          <MemberList
            data={memberList}
            isFilter={isFilter}
            nextPage={this.nextPage}
            nextKey={this.props.nextKey}
            proxyLogin={this.proxyLogin}
            handleFilter={this.handleFilter}
          />
        </Fragment>
      );
    }
}

const mapStateToProps = state => ({
  memberList: state.member.memberList,
  nextKey: state.member.next,
  singleSearchLoading: state.member.singleSearchLoading,
});

const mapDispatchToProps = {
  queryMemberListByKey,
  getMemberMultiSearch,
  initiatLoginToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(Member);
