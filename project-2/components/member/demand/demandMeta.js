import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';

class DemandMeta extends Component {
  addDemand = () => {
    const { match } = this.props;
    const { basicId } = match.params;
    window.location.href = `/admin/demand/add/${basicId}`;
  }

  render() {
    return (
      <Fragment>
        <div>Demand Meta Here!</div>
        <Button type="primary" onClick={this.addDemand}>新增案件</Button>
      </Fragment>
    );
  }
}

export default withRouter(DemandMeta);
