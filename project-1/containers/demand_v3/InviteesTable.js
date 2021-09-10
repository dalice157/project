import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import { withRouter } from 'react-router-dom';
import { Modal, Table, Button } from 'antd';
import dayjs from 'dayjs';
import { Star } from '@material-ui/icons';
import { dateFormat } from '../../config/constant';
import { evaluateCommentType } from '../../config/selectData';
import {
  reportCooperation, confirmCooperation, evaluateTopper, makeUpChatMeta, getGigTitleList
} from '../../actions/demand';
import InviteesCardList from '../../components/demand_v3/InviteesCardList';
import EvaluationModal from '../../components/demand_v3/modal/EvaluationModal';
import styles from './Table.scss';

class InviteesTable extends PureComponent {
  state = {
    visibleEvaluation: false,
    gig: [],
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

  onCheckChatMeta = async (dealMeta, topperId) => {
    const demandId = this.props.location.query.demandId;
    const isDemandClosed = dealMeta && dealMeta.step === 4;
    if (isDemandClosed && !dealMeta.chatMetaId) {
      Modal.info({
        content: '此案件已關閉，且您已退出聊天室，無法重新開啟。',
        okText: '確認',
      });
    } else {
      const result = await this.props.makeUpChatMeta(demandId, topperId);
      if (result.payload && result.payload.success) {
        const demandIdQuery = !isDemandClosed ? `demandId=${demandId}` : '';
        const queryString = `${demandIdQuery}&topperId=${topperId}`;
        this.props.history.push(`/chat?${queryString}`);
      }
    }
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

  onEvaluateTopper = async (topperName, topperId) => {
    const { demandTitle } = this.props;
    const evaluationInfo = {
      demandTitle, topperName, topperId
    };
    this.props.getGigTitleList(topperId).then((result) => {
      if (result.payload && result.payload.success) {
        this.setState({ visibleEvaluation: true, evaluationInfo });
      }
    });
  }

  onChangeGig = (val) => {
    console.log('val:', val);
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

  renderDateField = (dealMeta, record) => {
    if (!record.nowMember) {
      return <p className={styles.error}>此高手已刪除下架! 無法溝通與合作!</p>;
    } else if (dealMeta && dealMeta.rejectDate) {
      if (dealMeta.rejector === 1) {
        return <><p>{dayjs(dealMeta.rejectDate).format(dateFormat)}</p><p>你已婉拒合作</p></>;
      } else if (dealMeta && dealMeta.rejector === 2) {
        return <><p>{dayjs(dealMeta.rejectDate).format(dateFormat)}</p><p>高手已婉拒合作</p></>;
      }
    } else if (dealMeta && !dealMeta.communicateDate) {
      return <p>等待高手回覆</p>;
    } else if (dealMeta && dealMeta.communicateDate && !dealMeta.cooperatedDate && dealMeta.partARequestCooperationDate === null && dealMeta.partBRequestCooperationDate === null) {
      return <><p>{dayjs(dealMeta.communicateDate).format(dateFormat)}</p><p>已同意邀請</p></>;
    } else if (dealMeta && dealMeta.communicateDate && !dealMeta.cooperatedDate && dealMeta.partARequestCooperationDate && dealMeta.partBRequestCooperationDate === null) {
      return <><p>{dayjs(dealMeta.partARequestCooperationDate).format(dateFormat)}</p><p>已回報合作</p></>;
    } else if (dealMeta && dealMeta.communicateDate && !dealMeta.cooperatedDate && dealMeta.partBRequestCooperationDate && dealMeta.partARequestCooperationDate === null) {
      return <><p>{dayjs(dealMeta.partBRequestCooperationDate).format(dateFormat)}</p><p>高手回報合作</p></>;
    } else if (dealMeta && dealMeta.cooperatedDate && dealMeta.reviewDate === null) {
      return <><p>{dayjs(dealMeta.cooperatedDate).format(dateFormat)}</p><p>已確認合作</p></>;
    } else if (dealMeta && dealMeta.reviewDate) {
      return <><p>{dayjs(dealMeta.reviewDate).format(dateFormat)}</p><p>已完成評價</p></>;
    }
  }

  renderButtonField = (record) => {
    const { topperId, dealMeta } = record;
    const {
      isLoadingReportCooperation, isLoadingConfirmCooperation, isLoadingGigTitle
    } = this.props.loading;
    const { usageStage } = this.props;
    if (dealMeta && dealMeta.rejectDate === null) {
      return (
        <>
          <Button onClick={() => this.onCheckChatMeta(dealMeta, topperId, usageStage)}>開啟聊天室</Button>
          {
            dealMeta.communicateDate && !dealMeta.cooperatedDate && dealMeta.partARequestCooperationDate === null && dealMeta.partBRequestCooperationDate === null && (
              <Button ghost type="primary" onClick={() => this.onAskReportCooperation(topperId)} loading={topperId === isLoadingReportCooperation}>回報合作</Button>
            )
          }
          {
            dealMeta.communicateDate && !dealMeta.cooperatedDate && dealMeta.partARequestCooperationDate && dealMeta.partBRequestCooperationDate === null && (
              <Button ghost type="primary" onClick={() => this.onAskReportCooperation(topperId, dealMeta.partARequestCooperationDate)} loading={topperId === isLoadingReportCooperation}>再次回報合作</Button>
            )
          }
          {
            dealMeta.communicateDate && !dealMeta.cooperatedDate && dealMeta.partBRequestCooperationDate && dealMeta.partARequestCooperationDate === null && (
              <Button type="primary" onClick={() => this.onAskConfirmCooperation(topperId)} loading={topperId === isLoadingConfirmCooperation}>確認合作</Button>
            )
          }
          {
            dealMeta.cooperatedDate && dealMeta.reviewDate === null && (
              <Button ghost type="primary" onClick={() => this.onEvaluateTopper(record.profileName, record.topperId,)} loading={topperId === isLoadingGigTitle}>立即評價</Button>
            )
          }
        </>
      );
    }
  }

  render() {
    const isMobile = uaIsMobile();
    const {
      loading, inviteesList, onLoadMoreList, cursor, gigTitleList
    } = this.props;
    const hasMoreList = cursor;
    const { isLoadingList, isLoadingMoreList } = loading;
    const { evaluationInfo, visibleEvaluation } = this.state;
    const columns = [
      {
        title: '邀請溝通日',
        dataIndex: 'dealMeta.inviteDate',
        render: inviteDate => (inviteDate ? dayjs(inviteDate).format(dateFormat) : '-'),
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
          return record && record.nowMember ? content : '已刪除高手服務';
        },
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
        dataIndex: 'dealMeta',
        render: (dealMeta, record) => this.renderDateField(dealMeta, record)
      },
      {
        render: record => (
          <div className={styles.btnWrap}>
            {this.renderButtonField(record)}
          </div>
        )
      },
    ];

    return (
      <>
        {
          isMobile
            ? (
              <InviteesCardList
                list={inviteesList}
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
                dataSource={inviteesList}
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
  inviteesList: state.demand.tableList.data,
  cursor: state.demand.tableList.cursor,
  loading: state.demand.tableList.loading,
  gigTitleList: state.demand.tableList.gigTitleList,
  usageStage: state.demand.demandTitle.usageStage,
});

const mapDispatchToProps = {
  reportCooperation,
  confirmCooperation,
  getGigTitleList,
  evaluateTopper,
  makeUpChatMeta,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InviteesTable));
