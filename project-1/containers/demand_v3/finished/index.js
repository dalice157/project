import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { demandOrderTXStatus } from '../../../config/selectData';
import { addDemand } from '../../../components/ui/step/stepData';
import Step from '../../../components/ui/step';
import styles from './FinishDemand.scss';
import Finished from '../../../components/demand_v3/Finished';

class FinishDemand extends PureComponent {
  state = {
    demandId: '',
  }

  async componentDidMount() {
    const { location } = this.props;
    const demandIdFromQuerystring = location.query.demandId;
    this.setState({
      demandId: demandIdFromQuerystring || '無資料',
    });
  }

  render() {
    const { demandId } = this.state;
    const { location } = this.props;
    const casePage = {
      orderTXStatus: 3,
    };
    const originalDemandId = demandId;
    const trimmedDemand = originalDemandId ? originalDemandId.split('-')[1] : '';

    const demandResult = {
      planType: location.query.planType,
      demandId: trimmedDemand,
    };

    return (
      <div className={styles.wrap}>
        {
          casePage.orderTXStatus !== demandOrderTXStatus.PAY
          && <Step current={2} stepData={addDemand} stepModel />
        }
        <Finished demandResult={demandResult} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  area: state.common.area,
  defaultDemanderForm: state.demand.defaultDemanderForm,
});
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FinishDemand);
