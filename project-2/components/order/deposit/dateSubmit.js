import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import 'dayjs/locale/zh-tw';
import locale from 'antd/es/date-picker/locale/zh_TW';
import { DatePicker } from '../../ui/days';

const { confirm } = Modal;

class Default extends Component {
  state = {
    date: null
  }

  showConfirm = () => {
    confirm({
      title: '退刷日期',
      content: this.state.date + ' 是否正確',
      okButtonProps: { disabled: this.state.date === null },
      onOk: () => this.props.updateRefound(this.state.date),
      onCancel() {},
    });
  }

  onChange = (v, dateString) => this.setState({
    date: dateString
  });

  render() {
    const { total } = this.props;
    return (
      <div>
        { total && '批次處理共 ' + total + ' 筆,'}
        退刷日期: <DatePicker locale={ locale } onChange={ this.onChange } />
        <Button onClick={ this.showConfirm } type="primary">送出</Button>
      </div>
    );
  }
}

export default Default;
