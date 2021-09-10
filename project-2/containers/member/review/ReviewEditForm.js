import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Formik, ErrorMessage, Field,
} from 'formik';
import {
  Select, Input, Switch,
} from 'formik-antd';
import { Card, Button } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import {
  rankingOpts,
} from '../../../components/member/options';
import { dateFormat } from '../../../util/formatUtil.js';
import { generateMemo } from '../../../util/categoryUtils';
import { mappingStaffName, isGigId } from '../../../util/commonUtil.js';
import { validateReviewEditItemForm } from '../../../components/common/Validates';
import {
  updateReviewForm, getReviewList, initReviewForm, getMember,
} from '../../../actions/member';
import './importReviewForm.scss';

const { TextArea } = Input;
const { Option } = Select;
class ReviewEditForm extends Component {
  state = {
    lastMemo: null,
  }

  componentDidMount() {
    const { match, history: { location } } = this.props;
    const { basicId } = match.params;
    this.props.loadDefaultMemberData(basicId, 'review').then(() => {
      const { defaultMemberData } = this.props;
      this.setState({
        lastMemo: defaultMemberData.lastMemo,
      });
    });
    this.props.loadReviewListData(basicId).then(() => {
      const { reviewListData } = this.props;
      const { search } = location;
      const params = new URLSearchParams(search);
      const reviewId = params.get('reviewId');
      this.props.initReviewForm(reviewListData, reviewId);
    });
  }

  componentDidUpdate(prevProps) {
    // 僅新增備註
    if (prevProps.defaultMemberData.lastMemo !== this.props.defaultMemberData.lastMemo) {
      this.onChangeLastMemo();
    }
  }

  onChangeLastMemo = () => {
    this.setState({ lastMemo: this.props.defaultMemberData.lastMemo });
  }

  onReviewSubmit = async (value, actions) => {
    const {
      comment, demandTitle, commentDate,
      ranking1, ranking2, ranking3,
      topperId, display, gigId, memo,
      reviewId,
    } = value;
    const reviewForm = {
      commentDate,
      comment,
      demandTitle,
      display,
      gigId,
      memo,
      ranking1: Number(ranking1),
      ranking2: Number(ranking2),
      ranking3: Number(ranking3),
      reviewId,
      topperId: Number(topperId),
    };

    try {
      console.log('getWriteReviewItem:', reviewForm);
      await this.props.updateReviewForm(reviewForm);
      window.location.href = `/admin${this.props.history.location.pathname}?tabs=review`;
    } catch (error) {
      console.log('error:', error);
    }
    actions.setSubmitting(false);
  }

  onSwitchChange = (checked, setFieldValue) => {
    console.log(`switch to ${checked}`);
    setFieldValue('display', checked);
  }

  renderEditForm = ({ setFieldValue, handleSubmit, values }) => {
    const { topperGigs } = this.props;
    const { lastMemo } = this.state;
    const gigTitleOpts = topperGigs ? Object.entries(topperGigs) : [];
    const {
      commentDate, reviewId, demanderId, demander, demandId, currentGigTitle, display,
    } = values;
    return (
      <form id="importReviewForm" onSubmit={handleSubmit}>
        <Card>
          <h1>評價內容</h1>
          <Field
            name="display"
          >
            { ({ field }) => (
              <Switch
                {...field}
                onChange={checked => this.onSwitchChange(checked, setFieldValue)}
                checkedChildren="顯示"
                unCheckedChildren="隱藏"
                defaultChecked={display}
              />
            )
                }
          </Field>
          <br />
          <br />
          <div className="field">
            <label>評價時間</label>
            {
              dayjs(commentDate).format('YYYY/MM/DD A h:mm:ss')
            }
          </div>
          <div className="field">
            <label>評價編號</label>
            {reviewId}
          </div>
          <div className="field">
            <label>案主編號</label>
            {demanderId}
          </div>
          <div className="field">
            <label>案主姓+稱謂</label>
            {demander}
          </div>
          <div className="field">
            <label>案件編號</label>
            {demandId}
          </div>
          <div className="field">
            <label>案件標題</label>
            <Input name="demandTitle" style={{ width: '200px' }} />
            <ErrorMessage name="demandTitle">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>原服務項目</label>
            {currentGigTitle}
          </div>
          <div className="field">
            <label>對應高手服務項目</label>
            <Select
              name="gigId"
              onChange={value => setFieldValue('gigId', value)}
              placeholder="請選擇服務項目"
              style={{ width: 200 }}
            >
              <Option value="請選擇服務項目">請選擇服務項目</Option>
              {
                this.props.topperGigs && (
                  <>
                    {
                    gigTitleOpts.map(opt => <Option key={opt[0]} value={opt[0]}>{opt[1]}</Option>)
                  }
                  </>
                )
              }
            </Select>
            <ErrorMessage name="gigTitle">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>溝通及處理態度星數</label>
            <Select
              name="ranking1"
              onChange={value => setFieldValue('ranking1', value)}
              placeholder="請選擇分數(5最高)"
              style={{ width: 200 }}
            >
              {
                rankingOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
              }
            </Select>
            <ErrorMessage name="ranking1">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>服務品質滿意度星數</label>
            <Select
              name="ranking2"
              onChange={value => setFieldValue('ranking2', value)}
              placeholder="請選擇分數(5最高)"
              style={{ width: 200 }}
            >
              {
                rankingOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
              }
            </Select>
            <ErrorMessage name="ranking2">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>推薦給朋友星數</label>
            <Select
              name="ranking3"
              onChange={value => setFieldValue('ranking3', value)}
              placeholder="請選擇分數(5最高)"
              style={{ width: 200 }}
            >
              {
                  rankingOpts.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                }
            </Select>
            <ErrorMessage name="ranking3">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field commentTextArea">
            <label>評語</label>
            <TextArea className="comment" name="comment" />
            <ErrorMessage name="comment">{msg => <div className="errorStyle">{msg}</div>}</ErrorMessage>
          </div>
          <div className="field">
            <label>調整評價原因備註</label>
            <TextArea className="comment" name="memo" />
            <ErrorMessage name="memo">{msg => <div className="errorStyle">{msg}</div>}</ErrorMessage>
          </div>
          <div className="button-group">
            <Button type="primary" htmlType="submit">儲存變更</Button>
            <Button href={`/admin${this.props.history.location.pathname}?tabs=review`}>關閉回列表</Button>
          </div>
          <div style={{ width: 700, marginTop: '20px' }}>
            {lastMemo ? (
              <div className="field alignTop">
                <label>最新備註</label>
                <div className="rowInput displayBlock">
                  { dateFormat(lastMemo.createDate, true) }
                  【
                  { lastMemo.staff ? mappingStaffName(lastMemo.staff) : lastMemo.clerk }
                  】
                  <div className="memo">
                    { isGigId(lastMemo.memoSource) && '【服務編號】'.concat(lastMemo.memoSource) }
                    { isGigId(lastMemo.memoSource) && <br /> }
                    {generateMemo(lastMemo.memo)}
                  </div>
                  <a
                    href={`/admin/member/memo/review/${lastMemo.basicId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看全部備註
                  </a>
                </div>
              </div>
            ) : (
              <div className="field">
                <label>最新備註</label>
                <div className="rowInput">無</div>
              </div>
            )}
          </div>
        </Card>
      </form>
    );
  }

  render() {
    const { initValues } = this.props;
    console.log('init:', initValues);
    return (
      <>
        <Formik
          initialValues={initValues}
          setFieldValue
          enableReinitialize
          validationSchema={validateReviewEditItemForm}
          onSubmit={this.onReviewSubmit}
        >
          {this.renderEditForm}
        </Formik>

      </>
    );
  }
}

const mapStateToProps = state => ({
  topperGigs: state.review.topperGigs,
  initValues: state.review.initReviewValues,
  reviewListData: state.review.reviewListData,
  defaultMemberData: state.member.memberData,
});

const mapDispatchToProps = {
  loadReviewListData: getReviewList,
  updateReviewForm,
  initReviewForm,
  loadDefaultMemberData: getMember,
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewEditForm));
