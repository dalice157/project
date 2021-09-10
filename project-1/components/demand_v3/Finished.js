import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/button';
import styles from './Finished.scss';

class Finished extends PureComponent {
  render() {
    const { planType, demandId } = this.props.demandResult;
    return (
      <div className={styles.form}>
        <h2 className={styles.title}>感謝您的使用，您的需求已完成送審</h2>
        <div className={styles.demandField}>
          <div className={`${styles.field} ${styles.flex}`}>
            <label>刊登方案：</label>
            <div className={styles.valueData}>{planType === '0' ? '基本方案' : '進階方案'}</div>
          </div>
          <div className={`${styles.field} ${styles.flex}`}>
            <label>案件編號：</label>
            <div className={`${styles.valueData}`}>{demandId}</div>
          </div>
        </div>
        <div className={styles.text}>
          案件已進入審核中，若您的聯絡資料已完成驗證，我們會於1-3個工作天完成審核。若選擇mail或室話驗證，可主動電洽客服02-29126104分機8333。加速您的需求刊登。
        </div>
        <div className={styles.btnWrap}>
          <Button><Link to="/search">查看服務人才</Link></Button>
          <Button type="primary"><Link to="/demand">回發案管理</Link></Button>
        </div>
      </div>
    );
  }
}

export default Finished;
