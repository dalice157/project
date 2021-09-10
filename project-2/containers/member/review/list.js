import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Table, Button, Modal, Switch, Input, Radio,
} from 'antd';
import { dateFormat } from '../../../util/formatUtil';
import { delReviewOptions } from '../../../components/member/options';
import {
  deleteReviewItem, sendDisplayToggle, getReviewList,
} from '../../../actions/member';
import './list.scss';

const { info } = Modal;
const { TextArea } = Input;

class Default extends Component {
  columns = [
    {
      title: '評價編號',
      dataIndex: 'reviewId',
    },
    {
      title: '評價時間',
      dataIndex: 'commentDate',
      render: commentDate => dateFormat(commentDate, true),
    },
    {
      title: '原服務名稱/對應高手服務',
      dataIndex: 'gigTitle',
      render: (gigTitle, record) => (
        <>
          {gigTitle}
          <br />
          {record.currentGigTitle && (
          <>
            /
            {' '}
            {record.currentGigTitle}
          </>
          )}
        </>
      ),
    },
    {
      title: '案主名稱/編號',
      dataIndex: 'demander',
      render: (demander, record) => (
        <>
          {demander}
          {
            record.demanderId && (
              <>
                <br />
                <a href={`/admin/member/${record.demanderId}?tabs=basic`} target="_blank" rel="noopener noreferrer">
                  {record.demanderId}
                </a>
              </>
            )
          }
        </>
      ),
    },
    {
      title: '案件標題/編號',
      dataIndex: 'demandTitle',
      render: (demandTitle, record) => (
        <>
          {demandTitle}
          {
            record.demandId && (
              <>
                <br />
                <a href={`/admin/demand/edit/${record.demanderId}?demandId=${record.demandId}`} target="_blank" rel="noopener noreferrer">
                  Demand-
                  {record.demandId}
                </a>
              </>
            )
          }
        </>
      ),
    },
    {
      title: '溝通及處理態度',
      dataIndex: 'ranking1',
    },
    {
      title: '服務品質滿意度',
      dataIndex: 'ranking2',
    },
    {
      title: '推薦給朋友',
      dataIndex: 'ranking3',
    },
    {
      title: '評語',
      dataIndex: 'comment',
    },
    {
      title: '顯示/隱藏',
      dataIndex: 'display',
      render: (display, record) => (
        <Switch
          onChange={checked => this.onDisplayChange(checked, record)}
          checkedChildren="顯示"
          unCheckedChildren="隱藏"
          defaultChecked={display}
        />
      ),
    },
    {
      title: '修改評價',
      dataIndex: 'reviewId',
      render: (reviewId, record) => (
        <Button
          href={`/admin/member/${record.topperId}?tabs=review&reviewId=${reviewId}`}
        >
          修改
        </Button>
      ),
    },
    {
      title: '刪除評價',
      dataIndex: '',
      render: (text, record) => (
        <>
          <Button
            type="danger"
            onClick={(e) => { this.onShowDelete(record, e); }}
          >
            Delete
          </Button>
          <Modal
            title={null}
            footer={null}
            className="model"
            visible={this.state.deleteVisible}
            onCancel={this.onDeleteClose}
          >
            <>
              <p>請選擇刪除項目：</p>
              <Radio.Group
                options={delReviewOptions}
                onChange={this.onDelReviewRadioChange}
                defaultValue={this.state.deleteDealCount}
              />
              <p>請輸入刪除 評價 及成交數 原因備註：</p>
              <TextArea
                onChange={this.onDelTextAreaChange}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  disabled={!this.state.deleteMemo}
                  onClick={() => { this.onDeleteOk(record); }}
                >
                  送出刪出
                </Button>
              </div>
            </>
          </Modal>
        </>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      deleteVisible: false,
      displayMemo: '',
      deleteDealCount: false,
      deleteItem: null,
    };
  }


  componentDidMount() {
    const { basicId } = this.props.match.params;
    this.props.loadReviewListData(basicId);
  }

  onDisplayTextAreaChange = ({ target: { value } }) => {
    this.setState({ displayMemo: value });
  };

  onDelTextAreaChange = ({ target: { value } }) => {
    this.setState({ deleteMemo: value });
  };

  onDisplayChange = (checked, record) => {
    info({
      className: 'model',
      title: null,
      maskClosable: true,
      content: (
        <>
          <p>請輸入調整 顯示 或 隱藏 評價原因備註：</p>
          <TextArea
            onChange={this.onDisplayTextAreaChange}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </>
      ),
      onOk: async () => {
        const { displayMemo } = this.state;
        const { reviewId, topperId } = record;
        const displayForm = {
          display: checked,
          memo: displayMemo,
          reviewId,
          topperId,
        };
        try {
          const action = await this.props.sendDisplayToggle(displayForm);
          if (action.payload && action.payload.success) {
            await this.props.loadReviewListData(topperId);
          }
        } catch (error) {
          console.log();
        }
      },
      okText: '確認備註',
    });
  }

  onDelReviewRadioChange = (e) => {
    this.setState({
      deleteDealCount: e.target.value,
    });
  };


  onDeleteOk = async () => {
    const { deleteMemo, deleteDealCount, deleteItem } = this.state;
    try {
      await this.props.deleteReviewItem(deleteItem.topperId, deleteDealCount, deleteMemo, deleteItem.reviewId);
      await this.props.loadReviewListData(deleteItem.topperId);
      this.onDeleteClose();
    } catch (error) {
      console.log();
      this.onDeleteClose();
    }
  }

  onShowDelete = (record) => {
    this.setState({
      deleteVisible: true,
      deleteItem: record,
    });
  }

  onDeleteClose = () => {
    this.setState({
      deleteVisible: false,
      deleteMemo: '',
      deleteItem: null,
    });
  }

  render() {
    const { reviewListData } = this.props;

    return (
      <Fragment>
        <span>
          資料 共
          {' '}
          <b>{reviewListData.length > 0 ? reviewListData.length : 0}</b>
          {' '}
          筆
        </span>
        {
          reviewListData.length > 0 && <Table rowKey="reviewId" columns={this.columns} dataSource={reviewListData} scroll={{ x: 1000 }} />
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  topperGigs: state.review.topperGigs,
  reviewListData: state.review.reviewListData,
});

const mapDispatchToProps = {
  loadReviewListData: getReviewList,
  deleteReviewItem,
  sendDisplayToggle,
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Default));
