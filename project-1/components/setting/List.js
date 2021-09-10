import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import CheckboxGroup from './CheckboxGroup';
import Button from '../ui/button';
import styles from './List.scss';

class Lists extends Component {
  render() {
    const { onSubmit, defaultSubscribeForm, defaultValue } = this.props;

    return (
      <div className={styles.wrap}>
        {
          defaultSubscribeForm
          && (!defaultSubscribeForm.topperSubscriptions && !defaultSubscribeForm.demanderSubscriptions)
          && <p className={styles.noData}>『目前無電子報可訂閱！』</p>
        }
        {
          defaultSubscribeForm && (
          <Formik
            onSubmit={onSubmit}
            render={props => (
              <form className={styles.form} onSubmit={props.handleSubmit}>
                {
                  defaultSubscribeForm.topperSubscriptions
                  && (
                    <>
                      <h2 className={styles.title}>接案電子報</h2>
                      <div className={styles.list}>
                        <table>
                          <thead>
                            <tr>
                              <th>電子報名稱</th>
                              <th>說明</th>
                              <th>頻率</th>
                            </tr>
                          </thead>
                          <tbody>
                            <Field name="topperSubscriptions">
                              {
                                ({ field: { name }, form: { setFieldTouched, setFieldValue } }) => (
                                  <CheckboxGroup
                                    type="topperSubscriptions"
                                    defaultSubscribeForm={defaultSubscribeForm}
                                    defaultValue={defaultValue}
                                    name={name}
                                    setFieldTouched={setFieldTouched}
                                    setFieldValue={setFieldValue}
                                  />
                                )
                              }
                            </Field>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )
                }
                {
                  defaultSubscribeForm.demanderSubscriptions
                  && (defaultSubscribeForm.demanderSubscriptions.length > 0)
                  && (
                    <>
                      <h2 className={styles.title}>發案電子報</h2>
                      <div className={styles.list}>
                        <table>
                          <thead>
                            <tr>
                              <th>電子報名稱</th>
                              <th>說明</th>
                              <th>頻率</th>
                            </tr>
                          </thead>
                          <tbody>
                            <Field name="demanderSubscriptions">
                              {
                                ({ field: { name }, form: { setFieldTouched, setFieldValue } }) => (
                                  <CheckboxGroup
                                    type="demanderSubscriptions"
                                    defaultSubscribeForm={defaultSubscribeForm}
                                    defaultValue={defaultValue}
                                    name={name}
                                    setFieldTouched={setFieldTouched}
                                    setFieldValue={setFieldValue}
                                  />
                                )
                              }
                            </Field>
                          </tbody>
                        </table>
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
          )
        }
      </div>
    );
  }
}

export default Lists;
