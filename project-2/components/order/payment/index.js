import React, { Component } from 'react';
import { Breadcrumb, Divider } from 'antd';
import dayjs from 'dayjs';
import SingleSearchForm from '../../../containers/order/payment/SingleSearchForm';
import MultiSearchForm from '../../../containers/order/payment/MultiSearchForm';
import SearchShow from '../../../containers/order/payment/SearchShow';

class OrderSearch extends Component {
  state = {
    type: 'multi',
    multiSearchList: {
      dateType: 0,
      times: {
        yearMonth: dayjs(),
        start: null,
        end: null,
      },
      paymentType: 0,
      paymentStatus: 0,
      orderStatus: 0,
      purchaseProduct: 'all',
    },
    singleSearchList: {
      keyType: null,
      keyBasicId: null,
    },
  }

  updateSearchOptions = (newSearchList, type) => {
    if (type === 'multi') {
      this.setState(prevState => ({
        ...prevState,
        type,
        multiSearchList: newSearchList,
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        type,
        singleSearchList: newSearchList,
      }));
    }
  }

  render() {
    const { multiSearchList, singleSearchList, type } = this.state;
    const showList = type === 'multi' ? multiSearchList : singleSearchList;
    return (
      <>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><a href="/admin/">Home</a></Breadcrumb.Item>
          <Breadcrumb.Item>訂單管理</Breadcrumb.Item>
          <Breadcrumb.Item>付費訂單查詢</Breadcrumb.Item>
        </Breadcrumb>
        <SingleSearchForm updateSearchOptions={this.updateSearchOptions} />
        <Divider />
        <MultiSearchForm searchList={multiSearchList} updateSearchOptions={this.updateSearchOptions} />
        <Divider />
        <SearchShow searchList={showList} type={type} />
      </>
    );
  }
}


export default OrderSearch;
