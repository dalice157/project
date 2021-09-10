import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Formik, ErrorMessage,
} from 'formik';
import {
  Select, Input, Checkbox, Radio,
} from 'formik-antd';
import { Card, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../../components/ui/days';
import {
  sexTitleOpts, rankingOpts, EVALUATION_COMMENT_TYPE, EVALUATION_COMMENT,
} from '../../../components/member/options';
import { validateReviewItemForm } from '../../../components/common/Validates';
import {
  loadReviewDemandTitle, loadReviewNameTitle, getReviewList, addReviewForm,
} from '../../../actions/member';
import './importReviewForm.scss';

const { TextArea } = Input;
const { Option } = Select;

class ReviewAddForm extends Component {
  state= {
    visibleChange: false,
    visibleTitle: false,
  }

  onDemandTitleChange = (e, setFieldValue) => {
    const titleName = String(e.target.value);
    const titleNameLength = titleName.split('').length;
    this.setState({
      visibleTitle: true,
    });

    if (titleNameLength === 16) {
      this.props.loadReviewDemandTitle(titleName).then(() => {
        this.setState({
          visibleTitle: false,
        });
        const { titleNames } = this.props;
        const { demandTitle } = titleNames;
        setFieldValue('demandTitle', demandTitle);
      });
    }
  }

  onDemanderNameChange = (e, setFieldValue) => {
    const titleName = String(e.target.value);
    const titleNameLength = titleName.split('').length;
    this.setState({
      visibleChange: true,
    });

    if (titleNameLength === 16) {
      this.props.loadReviewNameTitle(titleName).then(() => {
        this.setState({
          visibleChange: false,
        });
        const { titleNames } = this.props;
        const { nameTitle } = titleNames;
        setFieldValue('demanderName', nameTitle);
      });
    }
  }

  onReviewReset=() => {
    this.props.onHideForm();
  }

  onReviewSubmit = async (value, actions) => {
    const { topperGigs, history } = this.props;
    const topperId = history.location.pathname.split('/')[2];
    const {
      comment, commentDate, demandTitle, demanderId,
      demanderName, demanderSex, ranking1, ranking2, ranking3,
      demandId, gigTitle: gigId, oldSiteImport,
    } = value;

    const reviewForm = {
      comment,
      commentDate,
      demandId: `Demand-${demandId}`,
      demandTitle,
      demanderId: Number(demanderId),
      demanderName,
      demanderSex,
      display: true,
      gigId: gigId === '請選擇服務項目' ? 'Gig-Other' : gigId,
      gigTitle: topperGigs[gigId],
      oldSiteImport,
      ranking1: Number(ranking1),
      ranking2: Number(ranking2),
      ranking3: Number(ranking3),
      topperId: Number(topperId),
    };

    const oldReviewForm = {
      comment,
      commentDate,
      demandTitle,
      demanderName,
      demanderSex,
      display: true,
      gigId: gigId === '請選擇服務項目' ? 'Gig-Other' : gigId,
      gigTitle: topperGigs[gigId],
      oldSiteImport,
      ranking1: Number(ranking1),
      ranking2: Number(ranking2),
      ranking3: Number(ranking3),
      topperId: Number(topperId),
    };

    const reviewFormData = oldSiteImport ? oldReviewForm : reviewForm;

    try {
      this.props.addReviewForm(reviewFormData).then(() => {
        this.props.loadReviewListData(topperId);
        this.props.onHideForm();
        const initValues = {
          oldSiteImport: false,
          display: '',
          demandId: '',
          commentDate: dayjs().format(),
          demanderName: '',
          demanderSex: '1',
          demanderId: '',
          demandTitle: '',
          gigId: '',
          gigTitle: '請選擇服務項目',
          ranking1: '',
          ranking2: '',
          ranking3: '',
          comment: '',
          commentType: 0,
        };
        actions.resetForm(initValues);
      });
    } catch (error) {
      console.log('error:', error);
    }
    actions.setSubmitting(false);
  }

  renderAddForm = ({
    handleReset, setFieldValue, values, handleSubmit,
  }) => {
    const { topperGigs } = this.props;
    const {
      commentDate, oldReview, commentType, demanderId, demandId, oldSiteImport,
    } = values;

    const gigTitleOpts = topperGigs ? Object.entries(topperGigs) : [];
    return (
      <form id="importReviewForm" onSubmit={handleSubmit}>
        <Card>
          <h1>
            新增評價內容
            {' '}
            <Checkbox name="oldSiteImport" className="oldReview">本次為建立舊站(外包、家教)評價</Checkbox>
          </h1>
          <div className="field">
            <label>評價時間</label>
            <DatePicker
              name="commentDate"
              locale={locale}
              style={{ width: '200px' }}
              defaultValue={dayjs(commentDate)}
              disabledDate={currentDate => currentDate > dayjs()}
              allowClear={false}
              value={dayjs(commentDate)}
              onChange={(date, dateString) => {
                const time = dayjs().format('HH:mm:ss');
                const formatDate = `${dateString} ${time}`;
                setFieldValue('commentDate', dayjs(formatDate).format());
              }}
            />
            <ErrorMessage name="commentDate">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>案主編號</label>
            <Input
              disabled={oldSiteImport}
              value={oldReview ? '' : demanderId}
              name="demanderId"
              style={{ width: '200px' }}
              onChange={e => this.onDemanderNameChange(e, setFieldValue)}
              maxLength={16}
            />
            <ErrorMessage name="demanderId">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>案主姓+稱謂</label>
            {
              this.state.visibleChange ? <LoadingOutlined /> : (
                <Input
                  name="demanderName"
                  style={{ width: '130px' }}
                />
              )
            }

            <Radio.Group name="demanderSex" options={sexTitleOpts} />
            <ErrorMessage name="demanderName">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
            <ErrorMessage name="demanderSex">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>案件編號</label>
            <Input
              disabled={oldSiteImport}
              value={oldReview ? '' : demandId}
              name="demandId"
              onChange={e => this.onDemandTitleChange(e, setFieldValue)}
              maxLength={16}
              style={{ width: '200px' }}
            />
            <ErrorMessage name="demandId">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>案件標題</label>
            {
              this.state.visibleTitle ? <LoadingOutlined /> : (
                <Input
                  name="demandTitle"
                  style={{ width: '200px' }}
                />
              )
            }
            <ErrorMessage name="demandTitle">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
          </div>
          <div className="field">
            <label>對應高手服務項目</label>
            <Select
              name="gigTitle"
              onChange={value => setFieldValue('gigTitle', value)}
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
          <div className="field">
            <label>評語</label>
            <Radio.Group className="commentType" name="commentType" options={EVALUATION_COMMENT_TYPE} />
          </div>
          <div className="field commentTextArea">
            {
              (commentType === 0) && (
                <>
                  <Select
                    name="comment"
                    className="commentSelect"
                    onChange={value => setFieldValue('comment', value)}
                    placeholder="請選出符合您的簡評"
                    style={{ width: 300 }}
                  >
                    {
                      EVALUATION_COMMENT
                        .map(comment => <Option key={comment.value} value={comment.value}>{comment.label}</Option>)
                    }
                  </Select>
                  <ErrorMessage name="comment">{msg => <span className="errorStyle">{msg}</span>}</ErrorMessage>
                </>
              )
            }
            {
              (commentType === 1) && (
              <>
                <TextArea className="comment" name="comment" />
                <ErrorMessage name="comment">{msg => <div className="errorStyle">{msg}</div>}</ErrorMessage>
              </>
              )
            }
          </div>
          <div className="button-group">
            <Button type="primary" htmlType="submit">送出</Button>
            <Button htmlType="reset" onClick={handleReset}>清除</Button>
          </div>
        </Card>
      </form>
    );
  }

  render() {
    const initValues = {
      oldSiteImport: false,
      display: '',
      demandId: '',
      commentDate: dayjs().format(),
      demanderName: '',
      demanderSex: '1',
      demanderId: '',
      demandTitle: '',
      gigId: '',
      gigTitle: '請選擇服務項目',
      ranking1: '',
      ranking2: '',
      ranking3: '',
      comment: '',
      commentType: 0,
    };
    return (
      <Formik
        initialValues={initValues}
        setFieldValue
        validationSchema={validateReviewItemForm}
        onSubmit={this.onReviewSubmit}
        onReset={this.onReviewReset}
      >
        {
          this.renderAddForm
        }
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  topperGigs: state.review.topperGigs,
  titleNames: state.review.titleNames,
});

const mapDispatchToProps = {
  loadReviewDemandTitle,
  loadReviewNameTitle,
  loadReviewListData: getReviewList,
  addReviewForm,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewAddForm));
