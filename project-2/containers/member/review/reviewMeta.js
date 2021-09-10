import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import { loadReviewTopperGigs } from '../../../actions/member';
import config from '../../../config/config';
import ReviewList from './list';
import ReviewEditForm from './ReviewEditForm';
import ReviewAddForm from './ReviewAddForm';

class ReviewMeta extends Component {
  state = {
    visibleReviewForm: false,
  }

  componentDidMount() {
    const { basicId } = this.props.match.params;
    this.props.loadReviewTopperGigs(basicId);
  }


  onShowForm = () => {
    this.setState({
      visibleReviewForm: true,
    });
  }

  onHideForm = () => {
    this.setState({
      visibleReviewForm: false,
    });
  }


  render() {
    const { location: { search }, match } = this.props;
    const { basicId } = match.params;
    const params = new URLSearchParams(search);
    const { visibleReviewForm } = this.state;
    const topperEvaluationUrl = `${config.topSite.domain}/evaluation/${basicId}`;
    const isEditPage = params.get('reviewId');

    return (
      <Fragment>
        <span>
          會員編號:
          {' '}
          {basicId}
          {' '}
          ==&gt;
          {' '}
        </span>
        <a href={topperEvaluationUrl} target="_blank" rel="noopener noreferrer">前台會員評價頁</a>
        <br />
        {
          !isEditPage && <Button style={{ marginTop: '15px' }} onClick={this.onShowForm}>新增評價</Button>
        }
        <br />
        {
          (visibleReviewForm && !isEditPage) && (
          <ReviewAddForm
            onHideForm={this.onHideForm}
          />
          )
        }
        {
          isEditPage && <ReviewEditForm />
        }
        {
          !isEditPage && (
            <>
              <br />
              <ReviewList />
            </>
          )
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  topperGigs: state.review.topperGigs,
  titleNames: state.review.titleNames,
});

const mapDispatchToProps = {
  loadReviewTopperGigs,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewMeta));
