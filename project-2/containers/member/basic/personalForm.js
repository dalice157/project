import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import { CheckCircleOutlined, CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import {
  Button, Card, Modal, Radio, Checkbox, Input,
} from 'antd';
import {
  Form, Select,
} from 'formik-antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../../components/ui/days';
import { dateFormat, replaceAreaNo } from '../../../util/formatUtil.js';
import { showPersonalData, mappingStaffName } from '../../../util/commonUtil.js';
import {
  roleTypes, sexOpts, identityTypeOpts, chosenRoleOpts, memoTypeOpts, employeeCountOpts, jobTitleOpts,
} from '../../../components/member/options';
import { catSearch } from '../../../util/categoryUtils';
import { edmTypeOpts, mtsTypeOpts, creditOpts } from '../../../config/selectData';
import { validateMember } from '../../../components/common/Validates';
import { error } from '../../../util/messageUtil.js';
import {
  getMember, editMemberData, writeMemberMemo, sendVerifyEmail, staffManualVerify, creditChange, getCancelInfo,
  deleteTop,
  acDeleteProcess,
} from '../../../actions/member';
import { loadStaticArea, loadStaticIndustry, sendVerifySMS } from '../../../actions/common.js';

const { Option } = Select;
const { TextArea } = Input;

// 身分類別選項
const roleTypeDesc = roleTypes.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});

// 員工人數選項
const employeeCountDesc = employeeCountOpts.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});

// 公司職稱選項
const jobTitleDesc = jobTitleOpts.reduce((accumulator, current) => {
  accumulator[current.value] = current.label;
  return accumulator;
}, {});

class PersonalForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originAcCellphone: '',
      originAcIdentity: '',
      prevCellphone: '',
      prevCellCert: false,
      prevTel: '',
      prevTelArea: '',
      prevTelCert: false,
      areaNo: '',
      areaDesc: '',
      industryNo: '',
      industryDesc: '',
      lastMemo: '',
      subscriptionItem: '',
      staffVerifyModalVisible: false,
      staffVerifyField: { phoneVerify: '', cellphoneVerify: '' },
      staffVerifyLockSubmit: false,
      staffVerifySubmitLoading: false,
      subscribeEpaperId: '',
      unSubscribeEpaperId: '',
      credit: '',
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { basicId } = match.params;
    this.props.loadStaticArea().then(() => {
      this.props.loadStaticIndustry().then(() => {
        this.props.loadDefaultMemberData(basicId).then(() => {
          const { defaultMemberData } = this.props;
          const {
            acCellphone, topperVerifyForm, lastMemo, subscriptionItem,
            credit,
          } = defaultMemberData;
          const {
            identity: acIdentity,
            tel: acTel,
            telArea: acTelArea,
            cellphoneRecord,
            telephoneRecord,
            subscribeEpaperId,
            unSubscribeEpaperId,
          } = topperVerifyForm;
          const { tel: topTel, telArea: topTelArea } = telephoneRecord;

          this.initializeMemberData();
          this.setState({
            originAcCellphone: acCellphone,
            originAcIdentity: acIdentity,
            prevCellphone: cellphoneRecord.cellphone,
            prevCellCert: acCellphone === cellphoneRecord.cellphone ? cellphoneRecord.certificate : false,
            prevTel: telephoneRecord.tel,
            prevTelArea: telephoneRecord.telArea,
            prevTelCert: (acTel === topTel && acTelArea === topTelArea) ? telephoneRecord.certificate : false,
            lastMemo,
            subscriptionItem,
            staffVerifyModalVisible: false,
            staffVerifyField: {
              phoneVerify: telephoneRecord.certificate,
              cellphoneVerify: cellphoneRecord.certificate,
            },
            staffVerifyLockSubmit: false,
            staffVerifySubmitLoading: false,
            subscribeEpaperId,
            unSubscribeEpaperId,
            credit,
          });
        });
        this.props.loadCancelInfo(basicId);
      });
    });
    this.alreadyInit = false;
  }

  componentDidUpdate(prevProps) {
    const { defaultMemberData: { lastMemo, topperVerifyForm } } = this.props;
    // 僅新增備註 for re rend
    if (prevProps.defaultMemberData.lastMemo !== lastMemo) {
      this.lastMemoChange();
    }
    // 審核驗證 for re rend
    const { cellphoneRecord: newCellRec, telephoneRecord: newTelRec } = topperVerifyForm;
    const { cellphoneRecord: prevCellRec, telephoneRecord: prevTelRec } = prevProps.defaultMemberData.topperVerifyForm;
    if (prevCellRec !== newCellRec) {
      this.prevCellphoneChange(newCellRec);
    }
    if (prevTelRec !== newTelRec) {
      this.prevTellChange(newTelRec);
    }
  }

  lastMemoChange = () => {
    this.setState({ lastMemo: this.props.defaultMemberData.lastMemo });
  }

  prevCellphoneChange = (newCellRec) => {
    this.setState({
      prevCellphone: newCellRec.cellphone,
      prevCellCert: newCellRec.certificate,
    });
  }

  prevTellChange = (newTelRec) => {
    this.setState({
      prevTel: newTelRec.tel,
      prevTelArea: newTelRec.telArea,
      prevTelCert: newTelRec.certificate,
    });
  }

  initializeMemberData = () => {
    const { defaultMemberData } = this.props;
    const postNum = defaultMemberData.topperVerifyForm.postNum ? defaultMemberData.topperVerifyForm.postNum : 6001000000; // 6001000000
    const { area } = this.props;
    const searchArea = postNum.length > 0 ? catSearch(area, postNum) : null;

    const industryNum = defaultMemberData.topperVerifyForm.invoiceRecord.industry ? defaultMemberData.topperVerifyForm.invoiceRecord.industry : '';
    const { industry } = this.props;
    const searchIndustry = industryNum.length > 0 ? catSearch(industry, industryNum) : null;
    this.setState({
      areaNo: postNum,
      areaDesc: searchArea ? searchArea.des : null,
      industryNo: industryNum,
      industryDesc: searchIndustry ? searchIndustry.des : '',
    });
  }

  defaultSubscribeValue = () => {
    const { subscriptionItem } = this.state;
    const defaultSubscribeValue = Object.keys(subscriptionItem).filter(key => subscriptionItem[key].subscribing);
    return defaultSubscribeValue;
  }

  CheckboxGroup = ({
    field: { name },
    form: { setFieldTouched, setFieldValue },
    options,
  }) => {
    const handleChange = (checkedValues) => {
      const subscribeStatus = {};
      const { subscribeEpaperId, unSubscribeEpaperId } = this.state;
      // 初始訂閱狀態
      subscribeEpaperId.forEach((value) => {
        subscribeStatus[value] = true;
      });
      unSubscribeEpaperId.forEach((value) => {
        subscribeStatus[value] = false;
      });

      // 選擇的訂閱狀態
      const checkedBoxOptions = options.map(item => item.id);
      checkedBoxOptions.forEach((boxOpt) => {
        if (checkedValues.length > 0 && checkedValues.includes(boxOpt)) {
          checkedValues.forEach((checkedVal) => {
            subscribeStatus[checkedVal] = true;
          });
        } else {
          subscribeStatus[boxOpt] = false;
        }
      });

      // 整理給 api 的更新資料狀態
      const updateSubscribe = [];
      const updateUnSubscribe = [];
      Object.keys(subscribeStatus).forEach((key) => {
        if (subscribeStatus[key]) {
          updateSubscribe.push(key);
        } else {
          updateUnSubscribe.push(key);
        }
      });

      this.setState({
        subscribeEpaperId: updateSubscribe,
        unSubscribeEpaperId: updateUnSubscribe,
      });

      setFieldTouched(name);
      setFieldValue(name, checkedValues);
    };
    return (
      <Checkbox.Group
        defaultValue={this.defaultSubscribeValue()}
        onChange={handleChange}
      >
        {
          options.map((item) => {
            const isDisabled = this.state.subscriptionItem && this.state.subscriptionItem[item.id].canUse === false;
            return (
              <Checkbox key={item.id} value={item.id} disabled={isDisabled}>
                {item.title}
              </Checkbox>
            );
          })
        }
      </Checkbox.Group>
    );
  };

  /**
  * 修改會員資料
  * @param {object} values 修改會員資料 Handle function
  */
  handleEditMemberData = async (values, actions) => {
    if (!this.chkForm(values)) {
      return false;
    }
    const {
      areaData: { no: areaNo },
      industryData: { no: industryNo },
      basicId,
      acCellphone,
      topperVerifyForm,
      memo,
      memoSource,
    } = values;

    const { tel: acTel, telArea: acTelArea, invoiceRecord } = topperVerifyForm;

    const editMemberDataForm = {
      ...topperVerifyForm,
      emailInfo: {
        email: topperVerifyForm.emailInfo.email,
      },
      cellphoneRecord: acCellphone ? {
        cellphone: acCellphone,
      } : undefined,
      telephoneRecord: acTel ? {
        tel: acTel,
        telArea: acTelArea,
      } : undefined,
      invoiceRecord: invoiceRecord ? {
        ...topperVerifyForm.invoiceRecord,
        industry: industryNo,
      } : undefined,
      postNum: areaNo,
      tel: topperVerifyForm.tel || '',
      telArea: topperVerifyForm.telArea || '',
      subscribeEpaperId: this.state.subscribeEpaperId,
      unSubscribeEpaperId: this.state.unSubscribeEpaperId,
    };

    console.log(JSON.stringify(topperVerifyForm, null, 4));

    try {
      const updateMember = await this.props.loadUpdateMemberData(basicId, editMemberDataForm);
      if (memo) {
        const memoForm = {
          basicId,
          memo,
          memoSource: memoSource || 'Basic',
        };
        await this.props.loadInsertMemberMemo(memoForm);
      }
      if (updateMember.payload && updateMember.payload.success) {
        // eslint-disable-next-line
        alert('會員資料修改成功。');
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
    actions.setSubmitting(false);
  }

  /**
   * 表單送出前的檢查
   * @param {object} topperVerifyForm
  */
  chkForm = (form) => {
    const {
      acCellphone,
      topperVerifyForm,
    } = form;

    const { industryNo } = this.state;

    const { identity: acIdentity, chosenRole } = topperVerifyForm;

    if (chosenRole === 'company' && industryNo === '1003000000') {
      error('should-choose-industry');
      return false;
    }
    if (chosenRole === 'personal' && !acIdentity) {
      error('should-type-identity');
      return false;
    }
    // AC有手機資料，不可刪除
    if (this.state.originAcCellphone && !acCellphone) {
      error('cellphone-should-not-be-empty');
      return false;
    }
    // AC有身分證/護照資料，不可刪除
    if (this.state.originAcIdentity && !acIdentity) {
      error('identity-should-not-be-empty');
      return false;
    }

    return true;
  }

  onAreaClick = (setFieldValue, currentValue) => {
    if (window.categoryPicker) {
      window.categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '居住地區',
        maxSelectedNumber: 1,
        selectedItems: [{ no: currentValue }],
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        unselectableList: '6[0-9]{6}000',
        onSubmit: ({ selectedItems }) => {
          const item = selectedItems[0];
          const desc = item ? item.des : '';
          const no = item ? item.no : null;
          setFieldValue('areaData', { no, desc });
        },
      });
    }
  };

  onIndustClick = (setFieldValue, currentValue) => {
    if (window.categoryPicker) {
      window.categoryPicker.open({
        dataSource: 'Indust',
        theme: 'customer-theme',
        title: '產業類型',
        maxSelectedNumber: 1,
        selectedItems: [{ no: currentValue }],
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        whitelist: '10[0-9]{2}00[0-9]{1}000',
        unselectableList: '10[0-9]{2}000000',
        onSubmit: ({ selectedItems }) => {
          const item = selectedItems[0];
          const desc = item ? item.des : '';
          const no = item ? item.no : '';
          setFieldValue('industryData', { no, desc });
        },
      });
    }
  };

  onInsertMemberMemo = async (basicId, memoSource, memo, setFieldValue) => {
    try {
      if (memo) {
        const memoForm = {
          basicId,
          memo,
          memoSource: memoSource || 'Basic',
        };
        const insertMemo = await this.props.loadInsertMemberMemo(memoForm);

        if (insertMemo.payload && insertMemo.type === 'INSERT_MEMBER_MEMO_SUCCESS') {
          // eslint-disable-next-line
          alert('新增備註成功。');
        }
        setFieldValue('memo', '');
        setFieldValue('memoSource', '');
      }
    } catch (e) {
      console.log(e);
    }
  }

  onSendSMS = async (basicId, cellphone) => {
    if (!cellphone) {
      error('should-type-cellphone');
      return false;
    }

    const verifySMS = await this.props.loadSendVerifySMS(basicId, cellphone);

    if (verifySMS.payload && verifySMS.payload.success) {
      alert('已發送驗證碼。');
    }
  }

  onSendVerifyEmail = async (basicId, email) => {
    if (!email) {
      error('should-type-email');
      return false;
    }

    Modal.confirm({
      title: '寄送會員驗證信',
      content: (
        <>
          <b>輸入的Email：</b>
          {' '}
          {email}
          <br />
          <br />
          <b>確認寄送會員驗證信嗎？</b>
        </>
      ),
      onOk: async () => this.props.loadSendVerifyEmail(basicId, email),
      okText: '確認',
      cancelText: '取消',
    });
  }

  onOpenStaffVeirfyModal = (telCert, cellphoneCert) => {
    this.setState({
      staffVerifyField: { phoneVerify: telCert, cellphoneVerify: cellphoneCert },
      staffVerifyModalVisible: true,
      staffVerifyLockSubmit: telCert && cellphoneCert,
    });
  }

  handleStaffVerify = async (basicId, acTel, acTelArea, acCellphone, telCertDisabled, cellCertDisabled) => {
    const { phoneVerify, cellphoneVerify } = this.state.staffVerifyField;

    // 兩個都沒勾
    const bothNotChoose = !phoneVerify && !cellphoneVerify;
    // 僅tel可勾但未勾 or 僅cell可勾但未勾
    const telOrCellNotChoose = (cellCertDisabled && (!telCertDisabled && !phoneVerify)) || (telCertDisabled && (!cellCertDisabled && !cellphoneVerify));

    if (bothNotChoose || telOrCellNotChoose) {
      error('should-choose-one-to-verify');
      return false;
    }

    const contactForm = {
      cellphoneRecord: cellCertDisabled || !cellphoneVerify
        ? undefined
        : { cellphone: acCellphone, certificate: cellphoneVerify },
      telephoneRecord: telCertDisabled || !phoneVerify
        ? undefined
        : { tel: acTel, telArea: acTelArea, certificate: phoneVerify },
    };

    this.setState({ staffVerifySubmitLoading: true });
    await this.props.loadStaffManualVerify(basicId, contactForm).then(() => {
      this.setState({
        staffVerifyModalVisible: false,
        staffVerifySubmitLoading: false,
      });
    });
  }

  onCreditChange = (basicId, credit) => {
    if (credit === 1) {
      Modal.info({
        title: '變更信用評等 (beta)',
        content: (
          <div>
            <p>尚不可手動標示優良會員!!</p>
          </div>
        ),
        onOk() {},
      });
    } else {
      Modal.confirm({
        title: '變更信用評等 (beta)',
        content: (
          <>
            <b>若標為信用不良,發案將必將前審!!</b>
            <br />
            <b>確認變更信用評等？</b>
          </>
        ),
        onOk: async () => {
          this.props.creditChange(basicId, credit).then((payload) => {
            if (!payload.error) {
              this.setState({ credit });
            }
          });
        },
        okText: '確認',
        cancelText: '取消',
      });
    }
  }

  renderForm = ({
    setFieldValue, setErrors, values, errors,
  }) => {
    console.log('errors:', errors);
    const errorStyle = {
      color: 'red',
      marginTop: '2px',
      display: 'block',
    };
    const { area } = this.props;
    const {
      basicId,
      pid,
      idNo,
      profileName,
      usingService,
      memberType,
      memberDeleteStatus,
      registerSource,
      acCellphone,
      topperVerifyForm,
      memoSource,
      memo,
      topNickName,
      industryData,
      areaData,
    } = values;
    const { lastMemo } = this.state;
    const deletedDisabled = memberDeleteStatus === 1 ? '' : 'disabled';
    const replacedAreaNoMemo = lastMemo && lastMemo.memo && replaceAreaNo(lastMemo.memo, area);
    const {
      firstName,
      familyName,
      sex,
      birthday,
      address,
      identityType,
      identity,
      emailInfo,
      telArea: acTelArea,
      tel: acTel,
      invoiceRecord,
      roleType,
      chosenRole,
    } = topperVerifyForm;
    const {
      invoiceNum, companyName, employeeCount, jobTitle,
    } = invoiceRecord;
    const {
      email,
      isVerified,
    } = emailInfo;

    const initBirthday = birthday == null ? '1900-01-01' : birthday;
    const dateDisabled = memberDeleteStatus === 3;

    const identityUI = chosenRole === chosenRoleOpts[1].value ? '' : (
      <>
        <b>
          <span>*&nbsp;</span>
          身分證/護照
        </b>
        <div>
          <Field name="topperVerifyForm.identityType">
            { ({ field }) => (
              <Radio.Group
                {...field}
                options={identityTypeOpts}
                defaultValue={identityType}
              />
            ) }
          </Field>
          <Field name="topperVerifyForm.identity">
            { ({ field }) => (
              <Input {...field} id="identity" value={showPersonalData(identity, memberDeleteStatus, 'identityOrPassport')} style={{ width: 200 }} />
            ) }
          </Field>
          {/* <ErrorMessage name="identity">{msg => <span className={styles.error}>{msg}</span>}</ErrorMessage> */}
        </div>
        <br />
        <div>
          <b>
            <span>*&nbsp;</span>
            生日
          </b>
          {' '}
          <DatePicker
            locale={locale}
            name="topperVerifyForm.birthday"
            value={dayjs(initBirthday, 'YYYY-MM-DD')}
            disabledDate={current => current && current >= dayjs().subtract(15, 'year')}
            allowClear={false}
            disabled={dateDisabled}
            onChange={(value, dateString) => {
              setFieldValue('topperVerifyForm.birthday', dateString);
            }}
          />
          <ErrorMessage name="topperVerifyForm.birthday">
            {msg => <span style={errorStyle}>{msg}</span>}
          </ErrorMessage>
        </div>
        <br />
        <div>
          <b>
            <span>*&nbsp;</span>
            身分類別
          </b>
          {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
          <Select
            name="topperVerifyForm.roleType"
            onChange={value => setFieldValue('topperVerifyForm.roleType', value)}
            defaultValue={roleTypeDesc[roleType]}
            placeholder="請選擇身分類別"
            style={{ width: 200 }}
          >
            {
                  roleTypes.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                }
          </Select>
          <ErrorMessage name="topperVerifyForm.roleType">
            {msg => <span style={errorStyle}>{msg}</span>}
          </ErrorMessage>
        </div>
      </>
    );
    const invoiceUI = (
      <>
        <div>
          <div>
            <b>
              <span>*&nbsp;</span>
              公司名稱
            </b>
&emsp;&emsp;&emsp;
            <Field name="topperVerifyForm.invoiceRecord.companyName">
              { ({ field }) => (
                <Input {...field} id="companyName" value={companyName} style={{ width: 200 }} />
              ) }
            </Field>
          </div>
          <ErrorMessage name="topperVerifyForm.invoiceRecord.companyName">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
        </div>
        <br />
        <div>
          <div>
            <b>
              <span>*&nbsp;</span>
              統一編號
            </b>
&emsp;&emsp;&emsp;
            <Field name="topperVerifyForm.invoiceRecord.invoiceNum">
              { ({ field }) => (
                <Input {...field} id="invoiceNum" value={invoiceNum} style={{ width: 200 }} />
              ) }
            </Field>
          </div>
          <ErrorMessage name="topperVerifyForm.invoiceRecord.invoiceNum">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
        </div>
        <br />
        <div>
          <b>
            <span>*&nbsp;</span>
            公司產業別
          </b>
          {' '}
&emsp;&emsp;
          <Field
            name="industryData"
          >
            {({ field }) => (
              <div
                {...field}
                style={{
                  width: '180px', border: '1px solid #d9d9d9', color: 'rgba(0,0,0,.85)', padding: '4px 8px', display: 'inline-flex', marginRight: '4px', justifyContent: 'space-between', alignItems: 'center',
                }}
                onClick={() => this.onIndustClick(setFieldValue, industryData.no, 'industryData')}
              >
                { industryData.desc || '請選擇產業類別'}
                <DownOutlined style={{ color: '#b9b9b9' }} />
              </div>
            )}
          </Field>
          <ErrorMessage name="industryData.no">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
          <ErrorMessage name="topperVerifyForm.invoiceRecord.industry">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
        </div>
        <br />
        <div>
          <b>
            <span>*&nbsp;</span>
            公司員工人數
          </b>
          {' '}
&emsp;
          <Select
            name="topperVerifyForm.invoiceRecord.employeeCount"
            onChange={value => setFieldValue('topperVerifyForm.invoiceRecord.employeeCount', value)}
            defaultValue={employeeCountDesc[employeeCount]}
            placeholder="請選擇員工人數"
            style={{ width: 200 }}
          >
            {
                  employeeCountOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                }
          </Select>
          <ErrorMessage name="topperVerifyForm.invoiceRecord.employeeCount">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
        </div>
        <br />
        <div>
          <b>
            <span>*&nbsp;</span>
            公司職稱
          </b>
&emsp;&emsp;&emsp;
          <Select
            name="topperVerifyForm.invoiceRecord.jobTitle"
            onChange={value => setFieldValue('topperVerifyForm.invoiceRecord.jobTitle', value)}
            defaultValue={jobTitleDesc[jobTitle]}
            placeholder="請選擇職稱"
            style={{ width: 200 }}
          >
            {
                  jobTitleOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                }
          </Select>
          <ErrorMessage name="topperVerifyForm.invoiceRecord.jobTitle">{msg => <span style={errorStyle}>{msg}</span>}</ErrorMessage>
        </div>
        <br />
      </>
    );
    const personalInfoUI = chosenRole === chosenRoleOpts[0].value ? identityUI : invoiceUI;

    const emailUI = isVerified === 'true'
      ? (
        <div>
          {showPersonalData(email, memberDeleteStatus, 'email')}
&emsp;&emsp;
          <CheckCircleOutlined />
        </div>
      )
      : (
        <div>
          <Field name="topperVerifyForm.emailInfo.email">
            { ({ field }) => (
              <Input {...field} value={showPersonalData(email, memberDeleteStatus, 'email')} style={{ width: 200 }} />
            ) }
          </Field>
&emsp;&emsp;
          <Button type="primary" onClick={() => this.onSendVerifyEmail(basicId, email)} disabled={deletedDisabled}>發送驗證信</Button>
          <ErrorMessage name="topperVerifyForm.emailInfo.email">
            {msg => <span style={errorStyle}>{msg}</span>}
          </ErrorMessage>
        </div>
      );
    const isCellphoneCertificate = (acCellphone === this.state.prevCellphone && this.state.prevCellCert);
    const isTelephoneCertificate = (acTel === this.state.prevTel && acTelArea === this.state.prevTelArea && this.state.prevTelCert);
    const telVerifyDisabled = isTelephoneCertificate || !acTel;
    const cellVerifyDisabled = isCellphoneCertificate || !acCellphone;

    return (
      <Form>
        <Card>
          <div>
            <p>
              <b>高手會員</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              {memberDeleteStatus === 1 ? '會員' : memberDeleteStatus === 2 ? '非會員(刪高手)' : '非會員(刪AC)'}
            </p>
            <Radio.Group
              value={this.state.credit}
              onChange={e => this.onCreditChange(basicId, e.target.value)}
              buttonStyle="solid"
            >
              {
                creditOpts.map(item => (<Radio.Button key={`creditOpts_${item.value}`} value={item.value}>{item.label}</Radio.Button>))
              }
            </Radio.Group>
          </div>
          <div>
            <p>
              <b>會員角色</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              {usingService.join(' / ')}
            </p>
          </div>
          <div>
            <p>
              <b>舊站接案會員(曾是VIP)</b>
              {' '}
&nbsp;
              {memberType.join(' / ')}
            </p>
          </div>
          <div>
            <p>
              <b>註冊方式</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              {registerSource}
            </p>
          </div>
          <div>
            <p>
              <b>PID</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
              {memberDeleteStatus === 3 ? '' : pid}
            </p>
          </div>
          <div>
            <p>
              <b>IDNO</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
              {idNo}
            </p>
          </div>
          <div>
            <p>
              <b>會員編號</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              {basicId}
            </p>
          </div>
          <div>
            <p>
              <b>AC 姓 / 名</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
              {familyName}
              {' '}
              /
              {' '}
              {memberDeleteStatus === 3 ? '' : showPersonalData(firstName, memberDeleteStatus, 'firstName')}
            </p>
          </div>
          <div>
            <p>
              <b>Profile 姓名</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
              {profileName}
            </p>
          </div>
          <div>
            <p>
              <b>暱稱</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {topNickName}
            </p>
          </div>
          <div>
            <div>
              <b>
                <span>*&nbsp;</span>
                性別
              </b>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
              <Field name="topperVerifyForm.sex">
                { ({ field }) => (
                  <Radio.Group {...field} options={sexOpts} defaultValue={`${sex}`} />
                ) }
              </Field>
              <ErrorMessage name="topperVerifyForm.sex">
                {msg => <span style={errorStyle}>{msg}</span>}
              </ErrorMessage>
            </div>
          </div>
          <br />
          <div>
            <b>
              <span>*&nbsp;</span>
              啟用服務身分
            </b>
            {' '}
&emsp;&emsp;&emsp;&emsp;
            <Field name="topperVerifyForm.chosenRole">
              { ({ field }) => (
                <Radio.Group
                  {...field}
                  options={chosenRoleOpts}
                  onChange={(e) => {
                    setFieldValue(e.target.name, e.target.value);
                    setErrors({});
                  }}
                />
              ) }
            </Field>
            <br />
            <br />
            {personalInfoUI}
          </div>
          <br />
          <div>
            <b>
              <span>*&nbsp;</span>
              主要e-mail
            </b>
            {' '}
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            {emailUI}
          </div>
          <br />
          <div>
            <b>
              <span>*&nbsp;</span>
              連絡電話 (室話和手機可擇一填寫)
            </b>
&emsp;&emsp;
            <Button type="default" onClick={() => this.onOpenStaffVeirfyModal(isTelephoneCertificate, isCellphoneCertificate, telVerifyDisabled, cellVerifyDisabled)} disabled={deletedDisabled}>審核驗證</Button>
          </div>
          <br />
          <div>
            <p>
              <b>室內電話</b>
              {' '}
&emsp;&emsp;&emsp;
              <Field name="topperVerifyForm.telArea">
                { ({ field }) => (
                  <Input {...field} value={acTelArea} style={{ width: 100 }} />
                ) }
              </Field>
&emsp;
              <Field name="topperVerifyForm.tel">
                { ({ field }) => (
                  <Input {...field} value={showPersonalData(acTel, memberDeleteStatus, 'phone')} style={{ width: 200 }} />
                ) }
              </Field>
&emsp;
              {isTelephoneCertificate ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              <ErrorMessage name="topperVerifyForm.telArea">
                {msg => <span style={errorStyle}>{msg}</span>}
              </ErrorMessage>
              <ErrorMessage name="topperVerifyForm.tel">
                {msg => <span style={errorStyle}>{msg}</span>}
              </ErrorMessage>
            </p>
          </div>
          <div>
            <b>行動電話</b>
            {' '}
&emsp;&emsp;&emsp;
            <Field name="acCellphone">
              { ({ field }) => (
                <Input {...field} value={showPersonalData(acCellphone, memberDeleteStatus, 'cellphone')} style={{ width: 200 }} />
              ) }
            </Field>
&emsp;
            {!isCellphoneCertificate
              && <Button type="primary" onClick={() => this.onSendSMS(basicId, acCellphone)} disabled={deletedDisabled}>發送驗證碼</Button>
            }
&emsp;
            {isCellphoneCertificate ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            <ErrorMessage name="acCellphone">
              {msg => <span style={errorStyle}>{msg}</span>}
            </ErrorMessage>
          </div>
          <br />
          <div>
            <b>
              <span>*&nbsp;</span>
              通訊地址
            </b>
            {' '}
&emsp;&emsp;
            <Field
              name="areaData"
            >
              {({ field }) => (
                <div
                  {...field}
                  style={{
                    width: '180px', border: '1px solid #d9d9d9', color: 'rgba(0,0,0,.85)', padding: '4px 8px', display: 'inline-flex', marginRight: '4px', justifyContent: 'space-between', alignItems: 'center',
                  }}
                  onClick={() => this.onAreaClick(setFieldValue, areaData.no || null)}
                >
                  { areaData.desc || '請選擇地區' }
                  <DownOutlined style={{ color: '#b9b9b9' }} />
                </div>
              )}
            </Field>
            <Field name="topperVerifyForm.address">
              { ({ field }) => (
                <Input {...field} value={showPersonalData(address, memberDeleteStatus, 'address')} style={{ width: 300 }} />
              ) }
            </Field>
            <ErrorMessage name="areaData.no">
              {msg => <span style={errorStyle}>{msg}</span>}
            </ErrorMessage>
            <ErrorMessage name="topperVerifyForm.address">
              {msg => <span style={errorStyle}>{msg}</span>}
            </ErrorMessage>
          </div>
          <br />
          <hr style={{ border: '1px dashed #DDDDDD' }} />
          {
            this.state.subscriptionItem && (
              <>
                <b>系統配對信</b>
                {' '}
&emsp;&emsp;&emsp;&emsp;
                <Field name="topperVerifyForm.topperEdm" component={this.CheckboxGroup} options={edmTypeOpts} />
              </>
            )
          }
          <br />
          <br />
          <div>
            <b>MTS行銷電子報</b>
            {' '}
&emsp;&emsp;
            <Field
              name="topperVerifyForm.mtsEdm"
              component={this.CheckboxGroup}
              options={mtsTypeOpts}
            />
          </div>
          <hr style={{ border: '1px dashed #DDDDDD' }} />
          <div style={{ width: 700, height: 150 }}>
            <div>
              <b>客服備註</b>
              {' '}
&emsp;&emsp;&emsp;&emsp;
              <Select
                name="memoSource"
                style={{ width: 200 }}
                onChange={value => setFieldValue('memoSource', value)}
                placeholder="備註類別"
              >
                {
                  memoTypeOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                }
              </Select>
            </div>
            <br />
            <div style={{ float: 'right' }}>
              <Field name="memo">
                { ({ field }) => (
                  <TextArea {...field} style={{ width: 580, height: 100 }} />
                ) }
              </Field>
              <br />
              {' '}
              <br />
              <div style={{ float: 'right' }}>
                <Button type="primary" onClick={() => this.onInsertMemberMemo(basicId, memoSource, memo, setFieldValue)} disabled={deletedDisabled}>僅新增備註</Button>
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <div style={{ width: 700 }}>
            {lastMemo
              ? (
                <div>
                  <p>
                    <b>最新備註</b>
                    {' '}
&emsp;&emsp;&emsp;&emsp;
                    {dateFormat(lastMemo.createDate, true)}
&nbsp;【
                    {lastMemo.staff ? mappingStaffName(lastMemo.staff) : lastMemo.clerk}
                    】
                  </p>
                  <div style={{ width: 580, float: 'right' }}>
                    {replacedAreaNoMemo}
                    <br />
                    <br />
                    <br />
                    <br />
                    <a href={`/admin/member/memo/basic/${basicId}`} target="_blank" rel="noopener noreferrer">查看會員備註</a>
                  </div>
                </div>
              )
              : (
                <p>
                  <b>最新備註</b>
                  {' '}
&emsp;&emsp;&emsp;&emsp;無
                </p>
              )
            }
          </div>
        </Card>
        <br />
        <div>
          <Button type="primary" htmlType="submit" disabled={deletedDisabled}>送出修改</Button>
        </div>
        <Modal
          title="請選擇審核驗證通過的電話"
          visible={this.state.staffVerifyModalVisible}
          onCancel={() => this.setState({ staffVerifyModalVisible: false })}
          maskClosable
          footer={[
            <Button
              key="cancel"
              onClick={() => { this.setState({ staffVerifyModalVisible: false }); }}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={this.state.staffVerifyLockSubmit}
              loading={this.state.staffVerifySubmitLoading}
              onClick={() => this.handleStaffVerify(basicId, acTel, acTelArea, acCellphone, isTelephoneCertificate, isCellphoneCertificate)}
            >
              送出
            </Button>,
          ]}
        >
          <Checkbox onChange={(e) => { this.setState({ staffVerifyField: { ...this.state.staffVerifyField, phoneVerify: e.target.checked } }); }} checked={this.state.staffVerifyField.phoneVerify} disabled={telVerifyDisabled}>
            室內電話：
            {acTelArea}
&nbsp;
            {acTel}
          </Checkbox>
          <br />
          <br />
          <Checkbox onChange={(e) => { this.setState({ staffVerifyField: { ...this.state.staffVerifyField, cellphoneVerify: e.target.checked } }); }} checked={this.state.staffVerifyField.cellphoneVerify} disabled={cellVerifyDisabled}>
            手機：
            {acCellphone}
          </Checkbox>
          <br />
        </Modal>
      </Form>
    );
  }

  render() {
    const {
      defaultMemberData,
      area,
    } = this.props;
    const { acCellphone } = defaultMemberData;
    defaultMemberData.topperVerifyForm.chosenRole = 'personal';
    if (!defaultMemberData.topperVerifyForm.cellphoneRecord.cellphone) {
      defaultMemberData.topperVerifyForm.cellphoneRecord.cellphone = acCellphone;
    }
    if (defaultMemberData.topperSubscriptions) {
      const subscriptList = defaultMemberData.topperSubscriptions.map(item => item.subscribeNumber.toString());
      defaultMemberData.topperVerifyForm.subscriptions = subscriptList;
    }
    const areaData = {
      no: this.state.areaNo,
      desc: this.state.areaDesc,
    };
    const industryData = {
      no: this.state.industryNo,
      desc: this.state.industryDesc,
    };
    return (
      <div>
        <Formik
          initialValues={{ ...defaultMemberData, areaData, industryData }}
          setFieldValue
          setErrors
          enableReinitialize
          onSubmit={this.handleEditMemberData}
          validationSchema={validateMember}
        >
          { props => this.renderForm(props, area) }
        </Formik>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  area: state.common.area,
  industry: state.common.industry,
  cancelInfo: state.member.cancelInfo,
  defaultMemberData: state.member.memberData,
});

const mapDispatchToProps = {
  loadDefaultMemberData: getMember,
  loadUpdateMemberData: editMemberData,
  loadInsertMemberMemo: writeMemberMemo,
  loadSendVerifySMS: sendVerifySMS,
  loadSendVerifyEmail: sendVerifyEmail,
  loadStaffManualVerify: staffManualVerify,
  creditChange,
  loadStaticArea,
  loadAcDeleteProcess: acDeleteProcess,
  loadDeleteTop: deleteTop,
  loadCancelInfo: getCancelInfo,
  loadStaticIndustry,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PersonalForm));
