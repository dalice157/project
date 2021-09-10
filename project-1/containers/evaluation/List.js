import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  loadReviewItemList, loadReviewAvg, loadReviewGig, loadGigList
} from '../../actions/common';
import ListMobile from '../../components/evaluation/ListMobile';
import { isNumber } from '../../util/commonUtil';
import { EVALUATION_TYPE } from '../../config/constant';

const defaultPage = '1';
// Mobile
class List extends Component {
  componentDidMount() {
    const basicId = this.props.location.query.bid;
    const gigId = this.props.location.query.gid || 0;
    const page = Number(this.props.history.location.query.page || defaultPage);
    const type = this.props.history.location.query.type || EVALUATION_TYPE.all;
    if (isNumber(basicId)) {
      this.props.loadReviewAvg(basicId);
      this.props.loadGigList(basicId, gigId, page, type);
    }
  }

  // 參考效能最佳化：https://zh-hant.reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action
  shouldComponentUpdate(nextProps) {
    if (this.props.location.query !== nextProps.location.query) {
      const basicId = nextProps.location.query.bid;
      const gigId = nextProps.location.query.gid || 0;
      const page = Number(nextProps.history.location.query.page || defaultPage);
      const type = nextProps.history.location.query.type || EVALUATION_TYPE.all;
      this.props.loadReviewAvg(basicId);
      this.props.loadGigList(basicId, gigId, page, type);
    }
    // 決定會不會觸發render()
    return true;
  }

  handleClick = (gigId) => {
    this.props.history.add('page', defaultPage);
    this.onTypeChange(EVALUATION_TYPE.all);
    this.onGigChange(gigId);
  }

  handleSelect = (selectedType = EVALUATION_TYPE.all) => {
    this.onTypeChange(selectedType);
    this.onPageChange(defaultPage);
  }

  onTypeChange = (type) => {
    this.props.history.add('type', type);
  }

  onGigChange = (gigId) => {
    this.props.history.add('gid', gigId);
  }

  onPageChange = (page = defaultPage) => {
    this.props.history.add('page', page);
  }

  render() {
    const { itemList, reviewAvg, reviewGig } = this.props;
    const gigId = this.props.location.query.gid;
    const basicId = this.props.location.query.bid;
    const title = this.props.location.query.title;
    const type = this.props.history.location.query.type;
    const page = Number(this.props.history.location.query.page || defaultPage);
    return (
      <>
        {
      reviewAvg
        && (
          <ListMobile
            onPageChange={this.onPageChange}
            page={page}
            itemList={itemList}
            reviewGig={reviewGig}
            handleSelect={this.handleSelect}
            type={type}
            topperName={reviewAvg.topperName}
            gigId={gigId}
            basicId={basicId}
            title={title}
          />
        )
      }
      </>
    );
  }
}

const mapStateToProps = state => ({
  reviewAvg: state.common.reviewAvg,
  reviewGig: state.common.reviewGig,
  itemList: state.common.itemList,
});

const mapDispatchToProps = {
  loadReviewAvg,
  loadReviewGig,
  loadReviewItemList,
  loadGigList,
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
