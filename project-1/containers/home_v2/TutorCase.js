import React, { Component } from 'react';
import { uaIsMobile, } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { connect } from 'react-redux';
import TutorCard from '../../components/home_v2/TutorCard.js';
import styles from './TutorCase.scss';
import {
  queryBasicTutorDemand, queryExpertTutorDemand, queryBasicCaseDemand, queryExpertCaseDemand
} from '../../actions/common';

class TutorCase extends Component {
  componentDidMount() {
    const isTutor = this.props.type === 'teacher';
    if (isTutor) {
      this.props.queryBasicTutorDemand();
      this.props.queryExpertTutorDemand();
    } else {
      this.props.queryBasicCaseDemand();
      this.props.queryExpertCaseDemand();
    }
  }

  render() {
    const isMobile = uaIsMobile() ? styles.mobile : '';
    const {
      type, basicTutorDemand, expertTutorDemand, basicCaseDemand, expertCaseDemand
    } = this.props;
    const isTutor = type === 'teacher';
    const chooseDataLeft = isTutor ? basicTutorDemand.data : basicCaseDemand.data;
    const chooseDataRight = isTutor ? expertTutorDemand.data : expertCaseDemand.data;
    return (
      <>
        <div className={`${styles.wrap} ${isMobile}`}>
          <TutorCard typeTitle="入門案件：給首次接案的您" data={chooseDataLeft} />
          {
            !uaIsMobile() && (
            <TutorCard typeTitle="高薪案件：給經驗豐富的您" data={chooseDataRight} />
            )
          }
        </div>
        <div className={styles.btnWrap}>
          <Link target="_blank" to="/caseList">
            <Button size="large" type="primary" data-gtm-index={isTutor ? 'more-家教案件' : 'more-外包案件'}>看更多類型</Button>
          </Link>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  basicTutorDemand: state.common.basicTutorDemand,
  expertTutorDemand: state.common.expertTutorDemand,
  basicCaseDemand: state.common.basicCaseDemand,
  expertCaseDemand: state.common.expertCaseDemand,
});

const mapDispatchToProps = {
  queryBasicTutorDemand,
  queryExpertTutorDemand,
  queryBasicCaseDemand,
  queryExpertCaseDemand,
};

export default connect(mapStateToProps, mapDispatchToProps)(TutorCase);
