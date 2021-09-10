import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import { Modal } from 'antd';
import { demandExtendSubmit } from '../../actions/demand';
import Button from '../../components/ui/button';
import styles from './Extend.scss';


class Extend extends Component {
  componentDidMount() {
    const demandId = this.props.location.query.demandId;
    this.props.demandExtendSubmit(demandId).then((res) => {
      const isExtendSuccess = res.payload.success;
      if (!isExtendSuccess) {
        this.warning();
      }
    });
  }

  warning = () => {
    Modal.warning({
      title: '此案件已展延過了!!',
      content: '注意：每個件僅可展延一次。不可重覆。案件將於到期日自動結案。',
      okText: '前往需求管理',
      style: { top: '20%' },
      onOk() {
        location.href = '/demand';
      },
    });
  }


  render() {
    const isMobile = uaIsMobile();
    const isMobileStyle = isMobile ? styles.mobile : '';
    const isExtendSuccess = this.props.extend.success;
    const { demandTitle, expireDate } = this.props.extend.data;
    return (
      <div className={`${styles.wrap} ${isMobileStyle}`}>
        {
          isExtendSuccess && (
            <div className={styles.wrapMessage}>
              <p>案件 <strong>{demandTitle}</strong>  展延30天結案已完成!!</p>
              <p>**提醒您，於 <strong>{expireDate}</strong>  案件到期前，您都能透過即時通繼續與高手溝通。後續若完成需求，請協助於發案管理回報，給予高手評價以玆鼓勵！</p>
              <div className={styles.btnWrap}>
                <Button type="primary" href="/demand">管理需求</Button>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  extend: state.demand.extend
});
const mapDispatchToProps = {
  demandExtendSubmit,
};

export default connect(mapStateToProps, mapDispatchToProps)(Extend);
