import React from 'react';
import { Route } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import styles from './dafault.scss';
import routePath from '../config/routePath';
import Routes from '../Routes';

class Default extends React.Component {
  state = {
    activeClass: false,
    loading: false
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
    }
  }


  render() {
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <Layout className={styles.layoutWrap}>
          {
            Routes.map(({
              path, exact, component: Component, getInitialData, ...rest
            }) => {
              if (path === routePath.root) {
                return <Route key={path} path={path} exact={exact} render={props => (<Component {...props} {...rest} activeClass={this.state.activeClass} showSearch={this.showSearch} />)} />;
              } else if (path === routePath.chat) {
                return <Route key={path} path={path} exact={exact} render={props => (<Component {...props} {...rest} />)} />;
              } else {
                return <Route key={path} path={path} exact={exact} render={props => <Component getInitialData={getInitialData} {...props} {...rest} />} />;
              }
            })
          }
        </Layout>
      </Spin>
    );
  }
}
export default Default;
