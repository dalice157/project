import React, { PureComponent } from 'react';
import { uaIsMobile } from 'react-device-detect';
import styles from './Steps.scss';

class Steps extends PureComponent {
  render() {
    const { data } = this.props;
    const isMobile = uaIsMobile() ? styles.mobile : '';
    return (
      <ul className={`${styles.stepWrap} ${isMobile}`}>
        {
          data.map(step => (
            <li key={step.id} className={styles.step}>
              <img src={step.img} alt={`step${step.id}`} />
              <div className={styles.right}>
                <h4 className={styles.title}>{`step${step.id}.`}</h4>
                <div className={styles.text}>{step.desc}。</div>
              </div>
            </li>
          ))
        }
      </ul>
    );
  }
}

export default Steps;
