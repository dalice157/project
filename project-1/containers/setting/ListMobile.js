import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Spin } from 'antd';
import { Formik, Field } from 'formik';
import { loadSubscribeV2, updateSubscribeV2 } from '../../actions/settingV2.js';
import Button from '../../components/ui/button';
import CheckboxGroup from '../../components/setting/CheckboxGroup';
import styles from './ListMobile.scss';


class ListMobile extends Component {
  state = {
    defaultSubscribeForm: {},
    loading: false
  };

  componentDidMount() {
    this.setState({
      loading: true
    });
    this.props.loadSubscribeV2().then(() => {
      this.setState({
        loading: false
      });
    });
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
    const { user, } = this.props;
    const { defaultSubscribeForm } = this.state;
    const { topperSubscriptions, demanderSubscriptions } = defaultSubscribeForm;
    return (
      <Spin size="large" spinning={this.state.loading} tip="Loading...">
        <div className={styles.banner}>
          <div className={styles.breadcrumb}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <Link to="/">首頁</Link>
              </Breadcrumb.Item>
              {/* <Breadcrumb.Item>
              <Link to="/setting">設定</Link>
            </Breadcrumb.Item> */}
              <Breadcrumb.Item>
                訂閱電子報
              </Breadcrumb.Item>
            </Breadcrumb>
            <h2>訂閱電子報</h2>
          </div>
        </div>
        <div className={styles.wrap}>
          {
            (user.pid == null || defaultSubscribeForm && (!topperSubscriptions && !demanderSubscriptions)) && (<p className={styles.noData}>『目前無電子報可訂閱！』</p>)
        }
          {
          user.pid && defaultSubscribeForm && (
          <Formik
            onSubmit={this.onSubmit}
            render={props => (
              <form
                className={styles.form}
                onSubmit={props.handleSubmit}
              >
                {
                  topperSubscriptions && (
                    <>
                      <h2 className={styles.title}>接案電子報</h2>
                      <div className={styles.list}>
                        <Field name="topperSubscriptions">
                          {
                            ({ field: { name }, form: { setFieldTouched, setFieldValue } }) => (
                              <CheckboxGroup
                                type="topperSubscriptions"
                                defaultSubscribeForm={defaultSubscribeForm}
                                defaultValue={this.defaultValue}
                                name={name}
                                setFieldTouched={setFieldTouched}
                                setFieldValue={setFieldValue}
                              />
                            )
                          }
                        </Field>
                      </div>
                    </>
                  )
                }
                {
                  user.pid
                  && demanderSubscriptions
                  && (
                    <>
                      <h2 className={styles.title}>發案電子報</h2>
                      <div className={styles.list}>
                        <Field name="demanderSubscriptions">
                          {
                            ({ field: { name }, form: { setFieldTouched, setFieldValue } }) => (
                              <CheckboxGroup
                                type="demanderSubscriptions"
                                defaultSubscribeForm={defaultSubscribeForm}
                                defaultValue={this.defaultValue}
                                name={name}
                                setFieldTouched={setFieldTouched}
                                setFieldValue={setFieldValue}
                              />
                            )
                          }
                        </Field>
                      </div>
                    </>
                  )
                }
                <div className={styles.btnWrap}>
                  <Button htmlType="submit" type="primary">儲存變更
                  </Button>
                </div>
              </form>
            )}
          />
          )}
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  defaultSubscribeForm: state.setting.defaultSubscribeForm
});

const mapDispatchToProps = {
  loadSubscribeV2,
  updateSubscribeV2
};

export default connect(mapStateToProps, mapDispatchToProps)(ListMobile);
