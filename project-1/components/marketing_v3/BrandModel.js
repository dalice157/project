/* eslint-disable jsx-a11y/anchor-has-content */
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom'; // Redirect
import { Checkbox, Spin, Modal } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import { validateBrand, validateBrandWithoutResume } from '../common_v2/Validates';
import Button from '../ui/button';
import config from '../../config/config';
import styles from './BrandModel.scss';

class BrandModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      loading: false,
      redirect: false,
      checkboxVal: false,
    };
  }

  onClick = () => {
    this.props.chkActiveProcess().then((resp) => {
      if (resp.payload.success) {
        this.setState({
          visible: true,
          redirect: false
        });
      }
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  }

  /**
   * 建立新品牌 or 使用個人檔案繼續
   */
  onAddBrandSubmit = (errors, setFieldTouched) => {
    const {
      redirectToProfile,
    } = this.props;
    const {
      importSource,
    } = this.props.brandForm;
    const formErrorLength = Object.keys(errors).length;
    const hasImportSource = importSource.sourceList.length > 0;
    const isSelectResumeErrorOnly = hasImportSource && errors.selectResume && formErrorLength == 1;
    const isFormValidate = formErrorLength == 0 || isSelectResumeErrorOnly;
    const isPluser = importSource.plusList.length > 0;
    const source = isPluser ? 'plus' : 'new'; // 有 plus, 有履歷，要先匯入外部履歷到CProfile: plus

    if (isFormValidate) {
      this.props.brandForm.importTopperProfile(source).then(
        redirectToProfile()
      );
      // this.onClose();
    } else {
      // if (hasImportSource) {
      //   setFieldTouched('selectResume', true);
      // }
      setFieldTouched('spec', true);
      setFieldTouched('specProfile', true);
    }
  }

  onBrandSubmit = async (values, actions) => {
    const {
      initUser,
      brandForm,
      redirectToProfile,
    } = this.props;
    const {
      importSource
    } = brandForm;
    const isPluser = importSource.plusList.length > 0;
    const hasImportSource = importSource.sourceList.length > 0;
    const source = hasImportSource
      ? values.selectResume
      : isPluser ? 'plus' : 'new'; // 有 plus, 有履歷，要先匯入外部履歷到CProfile: plus

    this.setState({
      loading: true,
    });

    try {
      if (hasImportSource) {
        await this.props.brandForm.importTopperProfile(source); // 匯入履歷
        await initUser();
      } else {
        await this.props.brandForm.importTopperProfile(source); // 建立全新品牌
        await initUser();
      }
      // this.setState({
      //   visible: false,
      //   loading: false,
      //   redirect: true,
      // });
      actions.setSubmitting(false);
      redirectToProfile();
    } catch (error) {
      console.error(error);

      this.setState({
        loading: false,
      });
    }
  }

  renderForm = (props) => {
    // console.log(props);
    // console.log(props.errors);
    // console.log(props.touched);
    const {
      brandForm,
    } = this.props;
    const {
      importSource
    } = brandForm;
    const isPluser = importSource.plusList.length > 0;
    const hasImportSource = importSource.sourceList.length > 0;

    console.log(`啟用 plus: ${isPluser}, 有履歷: ${hasImportSource}`);

    let importFragment = '';
    let actionButton = '';
    let specCheckBoxForPluser = '';
    let specCheckBoxForNonPluser = (
      <Field
        name="spec"
        render={({ field }) => (
          <Checkbox {...field}>
            已詳細閱讀並接受 <a target="_blank" href="https://static.104.com.tw/bigc/c_wap/html/statute/">104個人檔案服務條款</a>
          </Checkbox>
        )}
      />
    );
    let specCheckBox = specCheckBoxForPluser;
    const importResume = (
      <Fragment>
        {isPluser
          ? (
            <div>
              <p className={styles.text}>你有104其他服務履歷和104個人檔案內容，請選擇單一履歷匯入，或使用104個人檔案內容繼續編輯！</p>
              <p className={styles.text}>提醒你，選擇匯入104其他服務履歷，將覆蓋你在<a target="_blank" href={`${config.profileSite.domain}`}>104個人檔案</a>的內容！</p>
            </div>
          )
          : (
            <p className={styles.text}>你已有104會員履歷，可直接匯入編輯，並增加專案成就與作品集！</p>
          )
        }
        <div className={`${styles.block} ${styles.selectWrap}`}>
          <Field
            name="selectResume"
            component="select"
            className={styles.select}
          >
            <option defaultValue value="">請選擇履歷</option>
            {
              importSource.sourceList.map(option => (
                <option key={option.label} value={option.source}>
                  {option.label}
                </option>
              ))
            }
          </Field>
          <ErrorMessage name="selectResume">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
      </Fragment>
    );
    const importButton = (
      <div className={styles.btnWrap}>
        <Button type="primary" htmlType="submit">匯入履歷</Button>
      </div>
    );

    if (isPluser && hasImportSource) {
      importFragment = importResume;
      actionButton = (
        <div>
          {importButton}
          <div className={styles.btnWrap}>
            <Button
              onClick={() => props.validateForm().then(
                errors => this.onAddBrandSubmit(errors, props.setFieldTouched)
              )}
            >使用104個人檔案內容繼續編輯
            </Button>
          </div>
        </div>
      );
    } else if (isPluser && !hasImportSource) {
      importFragment = (
        <div className={styles.text}>你在104個人檔案網站已有資料，內容將帶入104高手繼續編輯。
          <br />提醒你，編輯高手品牌頁，將連動修改<a target="_blank" href={`${config.profileSite.domain}`}>104個人檔案</a>內容！
        </div>
      );
      actionButton = (
        <div className={styles.btnWrap}>
          <Button type="primary" htmlType="submit">編輯104高手品牌頁</Button>
        </div>
      );
    } else if (!isPluser && hasImportSource) {
      specCheckBox = specCheckBoxForNonPluser;
      importFragment = importResume;
      actionButton = (
        <div>
          {importButton}
          <div className={styles.btnWrap}>
            <Button
              onClick={() => props.validateForm().then(
                errors => this.onAddBrandSubmit(errors, props.setFieldTouched)
              )}
            >不匯入，建立全新品牌頁
            </Button>
          </div>
        </div>
      );
    } else if (!isPluser && !hasImportSource) {
      specCheckBox = specCheckBoxForNonPluser;
      importFragment = (
        <div className={styles.text}>發揮創意巧思，
          <br />將你最優秀的經歷和各種作品集展現出來吧！
          <br /><b>※ 本網站部分資料將使用104個人檔案網站內容，請勾選接受以下服務條款並同意公開內容。</b>
        </div>
      );
      actionButton = (
        <div className={styles.btnWrap}>
          <Button type="primary" htmlType="submit">建立高手品牌頁</Button>
        </div>
      );
    }

    return (
      <form className={styles.brand} onSubmit={props.handleSubmit}>
        {importFragment}
        <div className={`${styles.block} ${styles.checkboxWrap}`}>
          {specCheckBox}
          <ErrorMessage name="spec">
            {msg => <span className={styles.error}>{msg}</span>}
          </ErrorMessage>
        </div>
        <div className={`${styles.block} ${styles.checkboxWrap}`}>
          <Field
            name="specProfile"
            render={({ field }) => (
              <Checkbox {...field}>
                同意公開104個人檔案內容，以利案主完整瀏覽高手檔案
              </Checkbox>
            )}
          />
          <ErrorMessage name="specProfile">
            {msg => <span className={styles.error}>{`${msg}`}</span>}
          </ErrorMessage>
        </div>
        {actionButton}
      </form>
    );
  }

  render() {
    const {
      loading,
    } = this.state;
    const {
      brandForm,
      dataGtmMarketing,
      dataGtmJoin,
      dataGtmPlan,
    } = this.props;
    const {
      btnText, btnType, importSource, isBanner
    } = brandForm;
    const hasImportSource = importSource.sourceList.length > 0;
    const initialValues = hasImportSource
      ? {
        selectResume: '',
        spec: false,
        specProfile: false,
      } : {
        spec: false,
        specProfile: false,
      };
    const validationSchema = hasImportSource ? validateBrand : validateBrandWithoutResume;
    const popModalChild = loading
      ? (
        <div className={styles.loading}>
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={this.onBrandSubmit}
          validationSchema={validationSchema}
          render={this.renderForm}
        />
      );

    const linkToLoginCheck = isBanner ? (
      <a
        title={btnText}
        onClick={this.onClick}
        dataGtmMarketing={dataGtmMarketing}
        dataGtmJoin={dataGtmJoin}
        dataGtmPlan={dataGtmPlan}
      />
    ) : (
      <Button
        onClick={this.onClick}
        type={btnType}
        dataGtmMarketing={dataGtmMarketing}
        dataGtmJoin={dataGtmJoin}
        dataGtmPlan={dataGtmPlan}
        disabled
      >
        {btnText}
      </Button>
    );

    return (
      <>
        {linkToLoginCheck}
        <Modal
          maskClosable={false}
          onCancel={this.onClose}
          visible={this.state.visible}
          title="開啟斜槓人生，第一步建立專業個人檔案"
          centered={true}
          footer={null}
          dataGtmMarketing={dataGtmMarketing}
          dataGtmJoin={dataGtmJoin}
          dataGtmPlan={dataGtmPlan}
        >
          {popModalChild}
        </Modal>
      </>
    );
  }
}
// export default BrandModel;
export default withRouter(BrandModel);
