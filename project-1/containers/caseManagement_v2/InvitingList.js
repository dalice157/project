import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import InvitingCard from '../../components/caseManagement_v2/InvitingCard.js';
import Paginating from '../../components/ui/paginating';
import styles from './List.scss';
import {
  loadInvitingList, checkPublish, agreeToCommunicate, rejectToCommunicate
} from '../../actions/gigManage';
import { loadStaticArea } from '../../actions/common';

class InvitingList extends Component {
  state = {
    nextKey: null,
    minValue: 0,
    maxValue: 10,
    current: 1,
  }

  componentDidMount() {
    this.props.loadStaticArea();
    this.props.loadInvitingList();
    this.props.checkPublish();
  }

  onPagaChange = (pageNumber) => {
    this.setState({
      minValue: (pageNumber * 10) - 10,
      maxValue: pageNumber * 10,
      current: pageNumber
    });
  }

  onRefreshPage = () => {
    const cursor = this.props.invitingList.cursor;
    if (cursor) {
      this.props.loadInvitingList(cursor);
    } else {
      this.props.loadInvitingList();
    }
  }

  render() {
    const {
      isMobile, area, dealLists, isCheckPublish, invitingList
    } = this.props;
    const { data } = invitingList;
    const { minValue, maxValue, current } = this.state;
    const numOfData = data.length;
    const paginatingIsHide = !(data.length > 0);
    const cardObj = {
      area,
      isCheckPublish,
      isMobile,
      dealLists,
    };
    if (isMobile) {
      return (
        <div className={styles.wrap}>
          <div className={styles.hearder}>被邀請案件共 {numOfData} 件</div>
          {
            data.slice(minValue, maxValue).map(item => (
              <InvitingCard
                key={item.demandId}
                item={item}
                cardObj={cardObj}
                onRefreshPage={this.onRefreshPage}
                agreeToCommunicate={this.props.agreeToCommunicate}
                rejectToCommunicate={this.props.rejectToCommunicate}
              />
            ))
          }
          <Paginating
            className={classnames(styles.pagination, { [styles.dNone]: paginatingIsHide })}
            current={current}
            defaultCurrent={1}
            defaultPageSize={10}
            total={data.length}
            onChange={this.onPagaChange}
            nextKey={invitingList.cursor}
            nextPage={this.nextPage}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.wrap}>
          <div className={styles.hearder}>案主主動邀請案件共 {numOfData} 件</div>
          {
            data.slice(minValue, maxValue).map(item => (
              <InvitingCard
                key={item.demandId}
                item={item}
                cardObj={cardObj}
                onRefreshPage={this.onRefreshPage}
                agreeToCommunicate={this.props.agreeToCommunicate}
                rejectToCommunicate={this.props.rejectToCommunicate}
              />
            ))
          }
          <Paginating
            className={classnames(styles.pagination, { [styles.dNone]: paginatingIsHide })}
            current={current}
            defaultCurrent={1}
            defaultPageSize={10}
            total={data.length}
            onChange={this.onPagaChange}
            nextKey={invitingList.cursor}
            nextPage={this.nextPage}
          />
        </div>
      );
    }
  }
}
const mapStateToProps = state => ({
  invitingList: state.gigManage.invitingList,
  area: state.common.area,
  dealLists: state.gigManage.dealLists,
});
const mapDispatchToProps = {
  loadInvitingList,
  loadStaticArea,
  checkPublish,
  agreeToCommunicate,
  rejectToCommunicate,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InvitingList));
