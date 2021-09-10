import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { stepIterator } from '../../util/editStepUtil';
import { dayFormat } from '../../util/formatUtil';
import {
  loadTestUser,
} from '../../actions/basic';
import girlPic from '../../img/editProfile/girl.svg';
import Step from '../../components/ui/step';
import decoLeft from '../../img/common_v2/blue-deco-left.svg';
import decoRight from '../../img/common_v2/blue-deco-right.svg';
import config from '../../config/config';
import styles from './UpgradeSuccess.scss';

class UpgradeSuccess extends Component {
  state= {
    loading: false,
  }

  componentDidMount() {
    this.props.loadTestUser();
  }

  render() {
    const {
      location, testUser, payOrderInfo,
    } = this.props;
    const {
      planType, productNo, estimateStartDate, estimateEndDate,
    } = payOrderInfo;
    const productMap = config.products.json;
    const productType = productMap[planType][productNo];
    const estimatePublishDate = `${dayFormat(estimateStartDate)} ~ ${dayFormat(estimateEndDate)}`;
    const periodDay = (dayjs(estimateEndDate).diff(estimateStartDate, 'day')) + 1;
    return (
      <>
        <div className={styles.wrap}>
          <div className={styles.block}>
            <h2 className={styles.title}>
              <img src={decoLeft} alt="icon" />
              你已完成方案升級
              <img src={decoRight} alt="icon" />
            </h2>
            <div className={styles.proposal}>
              方案：
              {' '}
              <span className={styles.plan}>{productType.categoryName}</span>
            </div>
            <div className={styles.proposal}>
              預計刊登日期
              {' '}
              {estimatePublishDate}
              止，共
              {' '}
              {periodDay}
              {' '}
              天
            </div>
            <div className={styles.btnWrap}>
              <Link to="/topper-dashboard/home">
                <Button>
                  前往接案管理查看
                </Button>
              </Link>
              <Link to="/caseList">
                <Button type="primary">
                  立即查看案件
                </Button>
              </Link>
            </div>
            <img className={styles.img} src={girlPic} alt="讓更多人知道你" />
          </div>
        </div>
        <div className={styles.step}>
          <Step current={2} stepData={stepIterator('', testUser, '', '', location)} />
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  testUser: state.basic.testUser,
  payOrderInfo: state.basic.payOrderInfo,
});

const mapDispatchToProps = {
  loadTestUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeSuccess);
