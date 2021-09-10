import React, { Component, Fragment } from 'react';
import { Col, Popover } from 'antd';
import RowHOC from './RowHOC';

class Row extends Component {
  render() {
    const {
      title, content, children, isOpen
    } = this.props;

    return (
      <Fragment>
        <Popover
          content={content}
          title={`服務${title}`}
          trigger="click"
          placement="bottomLeft"
          visible={isOpen}
        >
          <Col span={18} push={6}>
            {children}
          </Col>
        </Popover>
      </Fragment>
    );
  }
}
export const RowLayout = RowHOC(Row);
