import React from 'react';
import { Steps } from 'antd';
import styles from './Step.scss';

const Step = Steps.Step;

const StepArea = ({
  current, stepData, children, stepModel
}) => {
  const isModel = stepModel ? styles.model : '';
  return (
    <div className={`${styles.stepWrap} ${isModel}`}>
      <Steps className={styles.step} size="small" current={current}>
        {
          stepData.map(item => (
            <Step key={item.id} title={item.title} />
          ))
        }
      </Steps>
      {children}
    </div>
  );
};


export default StepArea;
