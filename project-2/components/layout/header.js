import React, { Component } from 'react';

import {
  Link, withRouter
} from 'react-router-dom';
import { Layout } from 'antd';

const { Header } = Layout;


class Headers extends Component {
  render() {
    const { user } = this.props;
    // const { pathname } = this.props.location;
    return (
      <>
        <Header style={ { background: '#fff', padding: 0 } }>
          <div style={ { paddingRight: '16px', float: 'right' } }>104 高手後台 - {user.id ? user.name : (<Link to="/">請登入</Link>)}</div>
        </Header>
      </>
    );
  }
}

export default withRouter(Headers);
