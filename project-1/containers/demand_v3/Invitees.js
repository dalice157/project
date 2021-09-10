import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { loadInviteesList } from '../../actions/demand';
import InviteesTable from './InviteesTable';
import { inviteesOpts } from '../../config/selectData';
import styles from './Candidate.scss';

const { Option } = Select;
class Invitees extends PureComponent {
    state = {
      filterKey: inviteesOpts[0].value,
    };

    async componentDidMount() {
      const demandId = this.props.location.query.demandId;
      this.props.loadInviteesList(demandId, inviteesOpts[0].value, null);
    }

    onChangeFilterKey = target => this.setState({ filterKey: Number(target.key) });

    onChangeFilter = (target) => {
      const key = target.key;
      const demandId = this.props.location.query.demandId;
      this.onChangeFilterKey(target);
      this.props.loadInviteesList(demandId, key, null);
    }

    onLoadMoreList = () => {
      const { filterKey } = this.state;
      const { cursor } = this.props;
      const demandId = this.props.location.query.demandId;
      this.props.loadInviteesList(demandId, filterKey, cursor, true);
    }

    render() {
      const { filterKey } = this.state;
      const { inviteesList, user, demandTitle } = this.props;
      const size = inviteesList.length;
      return (
        <>
          <div className={styles.content}>
            <div className={styles.note}>
              {
                size !== 0
                  ? <span>以下為您已主動邀請的高手列表(邀請高手，限最多50位)</span>
                  : <span>尚無邀請者</span>
              }
              <div className={styles.field}>
                <span className={styles.numField}>
                  <span>共 <span className={styles.num}>{size || '-'}</span> 位</span>
                </span>
                <Select className={styles.dropdown} value={filterKey}>
                  {
                inviteesOpts.map(option => (
                  <Option key={option.value} value={option.value} onClick={this.onChangeFilter}>{option.label}</Option>
                ))
              }
                </Select>
              </div>
            </div>
            <InviteesTable
              user={user}
              demandTitle={demandTitle}
              onLoadMoreList={this.onLoadMoreList}
            />
          </div>
        </>
      );
    }
}

const mapStateToProps = state => ({
  inviteesList: state.demand.tableList.data,
  cursor: state.demand.tableList.cursor,
  user: state.user,
});
const mapDispatchToProps = {
  loadInviteesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Invitees));
