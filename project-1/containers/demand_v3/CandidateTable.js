import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import { withRouter } from 'react-router-dom';
import { Modal, Table, Button } from 'antd';
import dayjs from 'dayjs';
import { Star } from '@material-ui/icons';
import { dateFormat, usageStageTypes } from '../../config/constant';
import { moneyData, experienceData, evaluateCommentType } from '../../config/selectData';
import { optionsToTable } from '../../util/formatUtil';
import CandidateCardList from '../../components/demand_v3/CandidateCardList';
import EvaluationModal from '../../components/demand_v3/modal/EvaluationModal';
import {
  agreeCommunication, reportCooperation, confirmCooperation, evaluateTopper, makeUpChatMeta, getGigTitleList
} from '../../actions/demand';
import styles from './Table.scss';

class Candidate extends PureComponent {
  state = {
    gig: [],
    visibleEvaluation: false,
    evaluationInfo: {
      demandTitle: '',
      topperName: '',
      gigTitle: '',
      gig: {
        gigId: null,
        gigTitle: null
      }
    },
  }

  onCheckChatMeta = async (dealMeta, topperId, usageStage) => {
    const demandId = this.props.location.query.demandId;
    const isDemandClosed = dealMeta && dealMeta.step === 4;
    const demandIdQuery = !isDemandClosed ? `demandId=${demandId}` : '';
    const queryString = `${demandIdQuery}&topperId=${topperId}`;
    if (usageStage === usageStageTypes.publishing) {
      // 案件刊登中
      if (dealMeta && !dealMeta.chatMetaId && dealMeta.reviewDate) {
        Modal.info({
          content: '此高手為電話或e-mail聯絡溝通，無建立聊天室，且已完成評價，無法重新建立及開啟聊天室！',
          okText: '確認',
        });
      } else {
        const result = await this.props.makeUpChatMeta(demandId, topperId);
        if (result.payload && result.payload.success) {
          this.props.history.push(`/chat?${queryString}`);
        }
      }
    } else if (usageStage === usageStageTypes.closed || usageStage === usageStageTypes.closedWithoutPublishing) {
      // 案件已關閉/未上刊關閉
      if (!dealMeta.chatMetaId) {
        // 退出聊天室
        Modal.info({
          content: '案件已結案，此高手為電話或e-mail聯絡溝通，無建立聊天室，無法重新建立及開啟聊天室！',
          okText: '確認',
        });
      } else {
        this.props.history.push(`/chat?${queryString}`);
      }
    } else {
      this.props.history.push(`/chat?${queryString}`);
    }
  }

  onAskAgreeCommunication = (topperId) => {
    Modal.confirm({
      title: '請確認',
      content: '高手主動應徵此案件，您確認想與高手溝通？',
      okText: '確認溝通',
      cancelText: '取消',
      onOk: () => {
        const demandId = this.props.location.query.demandId;
        this.props.agreeCommunication(demandId, topperId).then((result) => {
          if (result && result.payload && result.payload.success) {
            const payloadDealMeta = result.payload && result.payload.data && result.payload.data.dealMeta;
            this.onCheckChatMeta(payloadDealMeta, topperId);
          }
        });
      },
    });
  }

  onAskReportCooperation = (topperId, partARequestCooperationDate) => {
    const targetDate = partARequestCooperationDate ? dayjs(partARequestCooperationDate).format('YYYY/MM/DD') : null;
    const today = dayjs().format('YYYY/MM/DD');

    if (targetDate === today) {
      Modal.info({
        content: <b>本日已邀請過，每日限邀請 1 次</b>,
        okText: '確認',
      });
    } else {
      Modal.confirm({
        title: '請確認',
        content: '您是否確認想邀請高手此案件？確認後，將同步發送邀請合作通知給高手，合作需待高手確認回覆同意合作。',
        okText: '確認邀請',
        cancelText: '取消',
        onOk: () => {
          const demandId = this.props.location.query.demandId;
          this.props.reportCooperation(demandId, topperId);
        },
      });
    }
  }

  onAskConfirmCooperation = (topperId) => {
    Modal.confirm({
      title: '請確認',
      content: '高手主動邀請您合作此案件，您是否確認要與此高手合作？確認後，將同步回覆高手您確認合作通知。',
      okText: '確認合作',
      cancelText: '取消',
      onOk: () => {
        const demandId = this.props.location.query.demandId;
        this.props.confirmCooperation(demandId, topperId);
      },
    });
  }

  onEvaluateTopper = async (record) => {
    const { demandTitle } = this.props;
    const { profileName, topperId, gigInfo } = record;
    const gigInfoData = {
      gigId: gigInfo !== null ? gigInfo.gigId : null,
      gigTitle: gigInfo !== null ? gigInfo.title : null,
    };
    const evaluationInfo = {
      demandTitle,
      topperId,
      topperName: profileName,
      gigInfo,
      gig: gigInfoData
    };
    this.props.getGigTitleList(topperId).then((result) => {
      if (result.payload && result.payload.success) {
        this.setState({ visibleEvaluation: true, evaluationInfo });
      }
    });
  }

  onChangeGig = (val) => {
    console.log('select:', val);
    const { gigTitleList } = this.props;
    const gig = gigTitleList.find((item) => {
      return item.gigId === val;
    });
    this.setState({
      ...this.state,
      evaluationInfo: {
        ...this.state.evaluationInfo,
        gig
      }
    });
  }

  onSubmitEvaluation = async (values, actions) => {
    const { demandTitle, user } = this.props;
    const { gigId, gigTitle } = this.state.evaluationInfo.gig;
    const {
      communicationScore, qualityScore, recommandationScore, commentType, comment, commentOption, topperId,
    } = values;
    const demandId = this.props.location.query.demandId;
    const demandBody = {
      demandId: demandId,
      demanderName: user.userName,
      comment: commentType === evaluateCommentType[0].value ? commentOption : comment,
      demandTitle: demandTitle,
      gigTitle: gigTitle,
      ranking1: communicationScore,
      ranking2: qualityScore,
      ranking3: recommandationScore,
    };
    console.log('demandBody:', demandBody);
    console.log('gigId:', gigId);
    console.log('topperId:', topperId);
    const result = await this.props.evaluateTopper(topperId, gigId, demandBody);
    if (result.payload && result.payload.success) {
      this.setState({ visibleEvaluation: false });
    }
    actions.setSubmitting(false);
  }

  renderDateField = (lastApplyDate, record) => {
    const { dealMeta } = record;
    if (dealMeta && dealMeta.rejector) {
      return <><p>{dayjs(dealMeta.rejectDate).format(dateFormat)}</p><p>{dealMeta.rejector === 1 ? '案主' : '高手'}婉拒合作</p></>;
    } else if (lastApplyDate && dealMeta === null) {
      return <><p>{dayjs(lastApplyDate).format(dateFormat)}</p><p>再次應徵</p></>;
    } else if (dealMeta && (dealMeta.partARequestCooperationDate && dealMeta.cooperatedDate === null)) {
      return <><p>{dayjs(dealMeta.partARequestCooperationDate).format(dateFormat)}</p><p>回報合作</p></>;
    } else if (dealMeta && (dealMeta.partBRequestCooperationDate && dealMeta.cooperatedDate === null)) {
      return <><p>{dayjs(dealMeta.partBRequestCooperationDate).format(dateFormat)}</p><p>高手回報合作</p></>;
    } else if (dealMeta && (dealMeta.cooperatedDate && dealMeta.reviewDate === null)) {
      return <><p>{dayjs(dealMeta.cooperatedDate).format(dateFormat)}</p><p>確認合作</p></>;
    } else if (dealMeta && dealMeta.reviewDate) {
      return <><p>{dayjs(dealMeta.reviewDate).format(dateFormat)}</p><p>已完成評價</p></>;
    } else if (dealMeta && (dealMeta.communicateDate && dealMeta.cooperatedDate === null)) {
      return <><p>{dayjs(dealMeta.communicateDate).format(dateFormat)}</p><p>開始溝通</p></>;
    }
  }

  renderButtonField = (record) => {
    const { topperId, dealMeta } = record;
    const {
      isLoadingAgreeCommunication, isLoadingReportCooperation, isLoadingConfirmCooperation, isLoadingGigTitle
    } = this.props.loading;
    const { usageStage } = this.props;
    if (dealMeta && dealMeta.rejector == null) {
      return (
        <div className={styles.btnWrap}>
          <Button onClick={() => this.onCheckChatMeta(dealMeta, topperId, usageStage)}>開啟聊天室</Button>
          {
            dealMeta.communicateDate && dealMeta.partARequestCooperationDate === null && dealMeta.cooperatedDate === null && dealMeta.partBRequestCooperationDate === null && <Button onClick={() => this.onAskReportCooperation(topperId)} loading={topperId === isLoadingReportCooperation}>回報合作</Button>
          }
          {
            dealMeta.communicateDate && dealMeta.partARequestCooperationDate && dealMeta.cooperatedDate === null && dealMeta.partBRequestCooperationDate === null && <Button onClick={() => this.onAskReportCooperation(topperId, dealMeta.partARequestCooperationDate)} loading={topperId === isLoadingReportCooperation}>再次回報合作</Button>
          }
          {
            dealMeta.partBRequestCooperationDate && dealMeta.cooperatedDate === null && <Button onClick={() => this.onAskConfirmCooperation(topperId)} loading={topperId === isLoadingConfirmCooperation}>確認合作</Button>
          }
          {
            dealMeta.cooperatedDate && dealMeta.reviewDate === null && <Button onClick={() => this.onEvaluateTopper(record)} loading={topperId === isLoadingGigTitle}>立即評價</Button>
          }
        </div>
      );
    } else if (!dealMeta) {
      return (
        <>
          {
              usageStage === usageStageTypes.publishing && <Button type="primary" onClick={() => this.onAskAgreeCommunication(topperId)} loading={topperId === isLoadingAgreeCommunication}>同意溝通</Button>
            }
        </>
      );
    }
  }

  render() {
    const isMobile = uaIsMobile();
    const {
      loading, candidateList, onLoadMoreList, cursor, gigTitleList
    } = this.props;
    const hasMoreList = cursor;
    const { isLoadingList, isLoadingMoreList } = loading;
    const { evaluationInfo, visibleEvaluation } = this.state;
    const columns = [
      {
        title: '應徵日',
        dataIndex: 'firstApplyDate',
        render: firstApplyDate => (firstApplyDate ? dayjs(firstApplyDate).format(dateFormat) : '-'),
      },
      {
        title: '高手名稱 / 編號',
        dataIndex: 'profileName',
        render: (profileName, record) => {
          const content = (
            <>
              <a href={`/service/${record.topperId}`} target="_blank">{profileName}</a>
              <br />
              {record.topperPid}
            </>
          );
          return record && record.nowMember ? content : '高手已刪除下架';
        },
      },
      {
        title: '服務項目',
        dataIndex: 'gigInfo.title',
        render: (title, record) => (title !== null && title !== undefined ? <a href={`/service/${record.topperId}?gigId=${record.gigInfo && record.gigInfo.gigId}`} target="_blank">{title}</a> : '服務已刪除')
      },
      {
        title: '服務報價',
        dataIndex: 'gigInfo',
        render: gigInfo => (gigInfo ? `${optionsToTable(moneyData)[gigInfo.unit]} NT$${gigInfo.price}元起` : '-')
      },
      {
        title: '經驗',
        dataIndex: 'gigInfo.expCat',
        render: exp => ((exp !== null && exp !== undefined) ? optionsToTable(experienceData)[exp] : '-'),
      },
      {
        title: '合作數 / 評價',
        dataIndex: 'dealCount',
        render: (dealCount, record) => (
          <div className={styles.dealCount}>
            {(dealCount !== null && dealCount !== undefined) ? dealCount : '-'} /
            <Star />
            <span className={styles.score}>{record.reviewScore !== null ? record.reviewScore : '-'}</span>
          </div>
        )
      },
      {
        title: '備註',
        dataIndex: 'lastApplyDate',
        render: (lastApplyDate, record) => this.renderDateField(lastApplyDate, record)
      },
      {
        className: styles.candidateBtnWrap,
        render: record => this.renderButtonField(record)
      },
    ];

    return (
      <>
        {
          isMobile
            ? (
              <CandidateCardList
                list={candidateList}
                renderDateField={this.renderDateField}
                renderButtonField={this.renderButtonField}
                loading={loading}
              />
            )
            : (
              <Table
                className={styles.table}
                rowKey={record => record.topperId}
                columns={columns}
                dataSource={candidateList}
                scroll={{ x: '100%' }}
                loading={isLoadingList}
                size={20}
                pagination={false}
              />
            )
        }
        {
          hasMoreList && (
            <div className={styles.paging}>
              <Button type="primary" onClick={onLoadMoreList} loading={isLoadingMoreList}>更多高手紀錄</Button>
            </div>
          )
        }
        <EvaluationModal
          titleList={gigTitleList}
          evaluationInfo={evaluationInfo}
          visibleEvaluation={visibleEvaluation}
          onChangeGig={this.onChangeGig}
          onSubmitEvaluation={this.onSubmitEvaluation}
          onCancel={() => this.setState({ visibleEvaluation: false })}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  candidateList: state.demand.tableList.data,
  cursor: state.demand.tableList.cursor,
  loading: state.demand.tableList.loading,
  gigTitleList: state.demand.tableList.gigTitleList,
  usageStage: state.demand.demandTitle.usageStage,
});

const mapDispatchToProps = {
  agreeCommunication,
  reportCooperation,
  confirmCooperation,
  getGigTitleList,
  evaluateTopper,
  makeUpChatMeta,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Candidate));
