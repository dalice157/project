import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import AssignmentForm from '../../components/setting/AssignmentForm.js';


import { loadAssignment, saveAssignment } from '../../actions/setting.js';


class Default extends Component {
  componentDidMount() {
    this.props.query();
  }

  saveSetting = (form) => {
    // console.log('form', form);
    const list = form.assignments.map((item) => {
      return {
        type: item.type,
        slots: (item.slot0 && 1) + (item.slot1 && 2) + (item.slot2 && 4) + (item.slot3 && 8),
        robotSwitch: (item.robotSwitch ? 1 : 0)
      };
    });
      // console.log('list', list);
    this.props.save(list);
  }

  render() {
    return (
      <Fragment>
        <Breadcrumb style={ { margin: '16px 0' } }>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>專員分派管理</Breadcrumb.Item>
        </Breadcrumb>
        <AssignmentForm onSubmit={ this.saveSetting } list={ this.props.data } initialValues={ { assignments: this.props.data } } />
      </Fragment>
    );
  }
}


const mapStateToProps = state => ({
  data: state.setting.assignments.map((item) => {
    return {
      type: item.type,
      slot0: (item.slots & 1) > 0,
      slot1: (item.slots & 2) > 0,
      slot2: (item.slots & 4) > 0,
      slot3: (item.slots & 8) > 0,
      robotSwitch: item.robotSwitch > 0
    };
  })
});

const mapDispatchToProps = {
  query: loadAssignment,
  save: saveAssignment
};

export default connect(mapStateToProps, mapDispatchToProps)(Default);
