import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import GigMsg from '../../../containers/member/gig/GigMsg.js';
import GigMemo from '../../../containers/member/gig/GigMemo.js';
import './gig.scss';

class GigMeta extends PureComponent {
  render() {
    const { isTopper, match } = this.props;
    const { basicId } = match.params;
    return (
      <div className="wrap">
        <>
          <GigMsg basicId={basicId} isTopper={isTopper} />
          { isTopper && <GigMemo pageType="dashboard" basicId={basicId} /> }
        </>
      </div>
    );
  }
}

export default withRouter(GigMeta);
