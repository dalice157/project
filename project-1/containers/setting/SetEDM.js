import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import { loadSubscribeV2, updateSubscribeV2 } from '../../actions/settingV2.js';
import SideBar from '../../components/setting/SideBar';
import Lists from '../../components/setting/List';
import styles from './SetEDM.scss';

const { Content, Sider } = Layout;
const sideBarList = [
  // {
  //   id: '1',
  //   title: '個人帳號/公司資料',
  //   link: '#',
  // },
  {
    id: '2',
    title: '訂閱電子報',
    link: '/settingEdm',
  },
  // {
  //   id: '3',
  //   title: '設定帳務資料',
  //   link: '#',
  // },
];


class SetEDM extends Component {
  state= {
    defaultSubscribeForm: {},
  }

  componentDidMount() {
    this.props.loadSubscribeV2();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultSubscribeForm !== this.props.defaultSubscribeForm) {
      this.setState({
        defaultSubscribeForm: this.props.defaultSubscribeForm
      });
    }
  }

  defaultValue = () => {
    const { topperSubscriptions, demanderSubscriptions } = this.props.defaultSubscribeForm;
    const isDefaultCheckTopper = topperSubscriptions ? topperSubscriptions.filter((item) => {
      return item.subscribing == true;
    }) : [];
    const defaultTopperValue = isDefaultCheckTopper.map(item => Object.values(item)[0].toString());
    const isDefaultCheckDemander = demanderSubscriptions ? demanderSubscriptions.filter((item) => {
      return item.subscribing == true;
    }) : [];
    const defaultDemanderValue = isDefaultCheckDemander.map(item => Object.values(item)[0].toString());
    return { defaultTopperValue, defaultDemanderValue };
  }

  onSubmit = async (values, actions) => {
    const { basicId } = this.props.defaultSubscribeForm;
    const demanderSubscriptionArrV2 = () => {
      const checkedBoxOptions = ['305'];
      let subscriptionData = [];
      if (values.demanderSubscriptions !== undefined && values.demanderSubscriptions !== null) {
        subscriptionData = checkedBoxOptions.map((sub) => {
          let data = {
            subscribeNumber: Number(sub),
            subscribing: values.demanderSubscriptions.includes(sub)
          };
          return data;
        });
      }
      return subscriptionData;
    };

    const topperSubscriptionsArrV2 = () => {
      const checkedBoxOptions = ['1', '304'];
      let subscriptionData = [];
      if (values.topperSubscriptions !== undefined && values.topperSubscriptions !== null) {
        subscriptionData = checkedBoxOptions.map((sub) => {
          let data = {
            subscribeNumber: Number(sub),
            subscribing: values.topperSubscriptions.includes(sub)
          };
          return data;
        });
      }
      return subscriptionData;
    };

    const subscribeData = {
      basicId: basicId,
      demanderSubscriptions: demanderSubscriptionArrV2(),
      topperSubscriptions: topperSubscriptionsArrV2()
    };

    try {
      await this.props.updateSubscribeV2(subscribeData).then(() => {
        this.props.loadSubscribeV2();
      });
      actions.setSubmitting(false);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { defaultSubscribeForm } = this.state;
    return (
      <>
        <div className={styles.wrap}>
          <div className={styles.breadcrumb}>
            <div className={styles.breadWrap}>
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Link to="/">首頁</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  設定
                </Breadcrumb.Item>
              </Breadcrumb>
              <h2>設定</h2>
            </div>
          </div>
          <Layout hasSider className={styles.layout}>
            <Sider breakpoint="lg" collapsedWidth="0">
              <SideBar sideBarList={sideBarList} />
            </Sider>
            <Layout className={styles.content}>
              <Content>
                <Lists
                  onSubmit={this.onSubmit}
                  defaultValue={this.defaultValue}
                  defaultSubscribeForm={defaultSubscribeForm}
                />
              </Content>
            </Layout>
          </Layout>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  defaultSubscribeForm: state.setting.defaultSubscribeForm
});

const mapDispatchToProps = {
  loadSubscribeV2,
  updateSubscribeV2
};

export default connect(mapStateToProps, mapDispatchToProps)(SetEDM);
