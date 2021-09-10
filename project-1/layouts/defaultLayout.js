import React from 'react';
import { Route } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import HeaderV2 from '../containers/header_v2';
import styles from './dafault.scss';
import routePath from '../config/routePath';
import Routes from '../Routes';
import LayoutSEO from '../components/seo';

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

  showSearch = (sw) => {
    this.setState({
      activeClass: sw
    });
  }


  render() {
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <LayoutSEO />
        <Layout className={styles.layoutWrap}>
          <HeaderV2
            activeClass={this.state.activeClass}
            styles={styles}
          />
          {
            Routes.map(({
              path, exact, component: Component, getInitialData, ...rest
            }) => {
              if (path === routePath.root) {
                return <Route key={path} path={path} exact={exact} render={props => (<Component {...props} {...rest} activeClass={this.state.activeClass} showSearch={this.showSearch} />)} />;
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
