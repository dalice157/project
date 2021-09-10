import React, { Component, Fragment } from 'react';
import { Checkbox } from 'formik-antd';
import { Formik, ErrorMessage } from 'formik';
import PopModal from '../common_v2/PopModal';
import Avatar from '../ui/avatar';
import Button from '../ui/button';
import config from '../../config/config';
import { validateDemands } from '../common_v2/Validates';
import { alreadyIMLabel } from '../../config/selectData';
import styles from './ChooseModel.scss';

class ChooseModel extends Component {
  state = {
    visible: false,
    pay: null,
  }

  onIMSubmit = async (values, actions) => {
    // console.log(JSON.stringify(values, null, 2));
    const checkFilter = this.props.invitableDemands.filter(item => values.roles.includes(item.demandId));
    const { topperBasicId } = this.props;
    try {
      this.setState({
        visible: false
      });
      await this.props.chooseForm.handleChooseLink(checkFilter, topperBasicId);
      actions.setSubmitting(false);
    } catch (error) {
      console.error(error);
    }
  }

  onClick = () => {
    // 打開聯繫表單前，先檢查是否要到啟用頁
    this.props.chkActiveProcess().then((resp) => {
      if (resp.payload.success) {
        this.props.demandAction.loadInvitableDemands();
        this.setState({
          visible: true,
        });
      }
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  }

  contactTopper = () => {
    const { btnType, btnText, isAvatar, } = this.props.chooseForm;
    const { userBasicId } = this.props;
    return (
      <PopModal
        btnType={btnType}
        btnText={btnText}
        isAvatar={isAvatar}
        title="聯絡高手"
        onClick={this.onClick}
        onClose={this.onClose}
        visible={this.state.visible}
        dataGtmProfile="contact"
      >
        <div className={styles.choose}>
          <p className={styles.text}>請選擇想與高手溝通的案件，若無需求，請先新增需求!</p>
          <p className={styles.text}>注意：若案件尚在審核中，邀請後不會立即通知高手，待審核上線刊登時，才會發送邀請訊息通知給高手。 </p>
          <p className={styles.text}>已上線刊登案件將會同步發送邀請通知給高手。 </p>
          <Formik
            validationSchema={validateDemands}
            initialValues={{ roles: [] }}
            onSubmit={this.onIMSubmit}
            render={formik => (
              <Fragment>
                <div className={styles.checkboxWrap}>
                  <Checkbox.Group name="roles">
                    {
                      this.props.invitableDemands.map((item) => {
                        return (
                          <Checkbox
                            key={item.demandId}
                            value={item.demandId}
                            disabled={item.alreadyIM != 0 || item.inviteCount >= config.INVITING_LIMIT}
                          >
                            <>
                              {item.demandTitle}
                              {
                                item.orderTXStatus === '0.5' && (
                                <span className={`${styles.error} ${styles.errorMg}`}>
                                  (審核中)
                                </span>
                                )
                              }
                              {
                                (item.alreadyIM !== 0 && item.inviteCount < config.INVITING_LIMIT) && (
                                  <span className={`${styles.aready}`}>
                                    ({alreadyIMLabel[item.alreadyIM]})
                                  </span>
                                )
                              }
                              {
                                item.inviteCount >= config.INVITING_LIMIT && (
                                  <span className={`${styles.aready}`}>
                                    (已達邀請上限{config.INVITING_LIMIT}人)
                                  </span>
                                )
                              }
                            </>
                          </Checkbox>
                        );
                      })
                    }
                  </Checkbox.Group>
                </div>
                <ErrorMessage name="roles">
                  {msg => <span className={styles.error}>{msg}</span>}
                </ErrorMessage>
                <div className={styles.btnWrap}>
                  {
                    <Button
                      onClick={this.onClose}
                    >
                      {
                            userBasicId
                              ? <a href="/caseForm" target="_blank">新增需求</a>
                              : <a href="/enableCaseUser" target="_blank">新增需求</a>
                          }
                    </Button>
                  }
                  {/* <AddFormModel
                    addDemandForm={this.props.addDemandForm}
                    demandAction={this.props.demandAction}
                    onChooseClose={this.onClose}
                  /> */}
                  {
                    this.props.invitableDemands.length > 0
                    && <Button type="primary" onClick={formik.submitForm}>聯絡高手</Button>
                  }
                </div>
              </Fragment>
            )}
          />
        </div>
      </PopModal>
    );
  }

  requireLogin = () => {
    const { btnType, btnText, isAvatar } = this.props.chooseForm;

    return (
      <Button href="/api/login" type={btnType} dataGtmProfile="contact">
        {isAvatar ? <Avatar size={21} /> : ''}
        {btnText}
      </Button>
    );
  }

  render() {
    const {
      user,
    } = this.props;
    return user.pid
      ? this.contactTopper()
      : this.requireLogin();
  }
}

export default ChooseModel;
