import React from 'react';
import { Row, Col } from 'antd';
import styles from './ServiceItems.scss';

const RowHOC = WrappedComponent => ({ children, ...props }) => (
  <Row className={styles.row}>
    <WrappedComponent {...props}>
      {children}
    </WrappedComponent>
    <Col span={6} pull={18}>
      服務{props.title}：
    </Col>
  </Row>
);

export default RowHOC;
