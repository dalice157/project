import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Divider } from 'antd';
import { dateFormat } from '../../../util/formatUtil.js';
import { mappingStaffName, isGigId } from '../../../util/commonUtil.js';
import { generateMemo } from '../../../util/categoryUtils';
import { writeMemberMemo, writeGigMemo, getMember } from '../../../actions/member.js';
import './gig.scss';

const { TextArea } = Input;

class GigMemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memo: '',
      memoSource: props.pageType === 'dashboard' ? 'Gig-Dashboard' : 'Gig',
      loading: false,
    };
  }

  componentDidMount() {
    const { pageType, gigId, basicId } = this.props;
    const memoType = pageType === 'dashboard' ? 'Gig' : gigId;
    if (basicId) {
      this.props.loadDefaultMemberData(basicId, memoType);
    }
  }

  onChangeMemo = (elememnt) => {
    const { onUpdateGigmemo } = this.props;
    const memo = elememnt.target.value;
    onUpdateGigmemo && onUpdateGigmemo(memo);
    this.setState({
      memo: memo,
    });
  }

  onUpdateLoading = (status) => {
    return new Promise((resolve) => {
      this.setState({
        loading: status,
      }, resolve);
    });
  }

  onInsertMemberMemo = async () => {
    const { gigId, basicId } = this.props;
    const { memo, memoSource } = this.state;
    await this.onUpdateLoading(true);
    try {
      if (memo) {
        const isGigDashboard = memoSource === 'Gig-Dashboard';
        const memoForm = {
          basicId: basicId,
          memo: memo,
          memoSource: isGigDashboard ? memoSource : gigId,
        };
        const insertMemo = await this.props.writeGigMemo(memoForm, memoForm.memoSource);
        if (insertMemo.payload && insertMemo.type === 'WRITE_GIG_MEMO_SUCCESS') {
          // eslint-disable-next-line no-alert
          alert('新增備註成功。');
        }
      }
      await this.onUpdateLoading(false);
      this.setState({ memo: '' });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading, memo } = this.state;
    const { basicId, pageType, defaultMemberData } = this.props;
    const lastMemo = defaultMemberData ? defaultMemberData.lastMemo : '';
    const memoTitle = pageType === 'dashboard' ? '客服備註' : '接案備註';
    const latestMemo = lastMemo ? (
      <div className="field alignTop">
        <label>最新備註</label>
        <div className="rowInput displayBlock">
          { dateFormat(lastMemo.createDate, true) }
          【{ lastMemo.staff ? mappingStaffName(lastMemo.staff) : lastMemo.clerk }】
          <div className="memo">
            { isGigId(lastMemo.memoSource) && '【服務編號】'.concat(lastMemo.memoSource) }
            { isGigId(lastMemo.memoSource) && <br /> }
            {generateMemo(lastMemo.memo)}
          </div>
          <a
            href={ `/admin/member/memo/gig/${basicId}` }
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
    );
    return (
      <>
        <Divider dashed />
        <div className="field alignTop">
          <label>{memoTitle}</label>
          <div className="rowInput displayBlock">
            <TextArea
              value={ memo }
              style={ { width: 580, height: 100, display: 'block' } }
              onChange={ this.onChangeMemo }
            />
            <div className="memoBtn">
              <Button
                type="primary"
                loading={ loading }
                onClick={ this.onInsertMemberMemo }
              >僅新增備註
              </Button>
            </div>
          </div>
        </div>
        { latestMemo }
      </>
    );
  }
}

const mapStateToProps = state => ({
  defaultMemberData: state.member.memberData,
});
const mapDispatchToProps = {
  loadInsertMemberMemo: writeMemberMemo,
  loadDefaultMemberData: getMember,
  writeGigMemo,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigMemo);
