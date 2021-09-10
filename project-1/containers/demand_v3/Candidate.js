import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select } from 'antd';
import {
  loadCandidateList
} from '../../actions/demand';
import CandidateTable from './CandidateTable';
import { candidateData } from '../../config/selectData';
import styles from './Candidate.scss';

const { Option } = Select;
class Candidate extends PureComponent {
    state = {
      filterKey: candidateData[0].value,
    };

    async componentDidMount() {
      const demandId = this.props.location.query.demandId;
      this.props.loadCandidateList(demandId, candidateData[0].value, null);
    }

    onChangeFilterKey = target => this.setState({ filterKey: Number(target.key) });

    onChangeFilter = (target) => {
      const key = target.key;
      const demandId = this.props.location.query.demandId;
      this.onChangeFilterKey(target);
      this.props.loadCandidateList(demandId, key, null);
    }

    onLoadMoreList = () => {
      const { filterKey } = this.state;
      const { cursor } = this.props;
      const demandId = this.props.location.query.demandId;
      this.props.loadCandidateList(demandId, filterKey, cursor, true);
    }

    render() {
      const { filterKey } = this.state;
      const { candidateList, user, demandTitle } = this.props;
      const size = candidateList.length;
      return (
        <>
          <div className={styles.content}>
            <div className={styles.note}>
              {
                size !== 0
                  ? <span>以下為對此案件有興趣，且已主動應徵的高手列表</span>
                  : <span>尚無應徵者</span>
              }
              <div className={styles.field}>
                <span className={styles.numField}>
                  <span>共 <span className={styles.num}>{size || '-'}</span> 位</span>
                </span>
                <Select className={styles.dropdown} value={filterKey}>
                  { candidateData.map(option => (
                    <Option
                      key={option.value}
                      value={option.value}
                      onClick={this.onChangeFilter}
                    >
                      {option.label}
                    </Option>
                  )) }
                </Select>
              </div>
            </div>
            <CandidateTable
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
  candidateList: state.demand.tableList.data,
  cursor: state.demand.tableList.cursor,
  user: state.user,
});
const mapDispatchToProps = {
  loadCandidateList,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Candidate));
