import React from 'react';
import { uaIsMobile } from 'react-device-detect';
import { Input } from 'antd';
import Button from '../ui/button';
import styles from './Sider.scss';

class CashRange extends React.Component {
  constructor(props) {
    super();
    this.state = {
      cashStart: props.cashStart,
      caseEnd: props.caseEnd,
    };
  }

  componentDidUpdate(prevProps) {
    const { cashStart, caseEnd } = this.props;
    // const { cashStart as preCashStart, caseEnd as preCaseEnd } = prevProps;
    // console.log('cashStart', cashStart);
    // console.log('caseEnd', caseEnd);
    // console.log('preCashStart', prevProps.cashStart);
    // console.log('preCaseEnd', prevProps.caseEnd);
    if ((!cashStart && prevProps.cashStart) || (!caseEnd && prevProps.caseEnd)) {
      this.resetState(cashStart, caseEnd); // clean
    }
  }


  resetState = (cashStart, caseEnd) => {
    this.setState({
      cashStart,
      caseEnd,
    }); // clean
  }


  render() {
    const isMobile = uaIsMobile();
    console.log('this.state.cashStart:', this.state.cashStart);
    return (
      <div className={styles.block}>
        {
          !isMobile && (
          <h3 className={styles.setTitle}>
            {this.props.typeLabel}
            金額
          </h3>
          )
        }
        <Input
          inputMode="tel"
          className={styles.cashRange}
          addonBefore="$"
          onChange={e => this.setState({ cashStart: e.target.value })}
          value={this.state.cashStart}
        />
        {' '}
        ~
        {' '}
        <Input
          inputMode="tel"
          className={styles.cashRange}
          addonBefore="$"
          onChange={e => this.setState({ caseEnd: e.target.value })}
          value={this.state.caseEnd}
        />
        <Button type="danger" onClick={() => this.props.onCashGo(this.state.cashStart, this.state.caseEnd)}>
          Go
        </Button>
      </div>
    );
  }
}

export default CashRange;
