import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import { dateFormat } from '../../../util/formatUtil';
import ContactList from '../../../components/member/gig/ContactList';
import ContactSelect from '../../../components/member/gig/ContactSelect';
import { demandContactType } from '../../../config/selectData.js';
import {
  loadTopperName, loadGigContacts, getContactRecords
} from '../../../actions/member';

class GigContact extends PureComponent {
  state = {
    dateList: [],
    orderList: [],
    publishDuration: [],
    paymentDuration: [],
    contactType: 0,
    selectedDuration: '無資料',
    loading: false,
  };

  async componentDidMount() {
    const basicId = this.props.match.params.basicId;
    const query = this.props.history.location.query;
    let typeVal = demandContactType[0].value;
    if (Object.keys(query)[0] === 'orderId') {
      typeVal = demandContactType[1].value;
    }
    this.props.loadTopperName(basicId);
    await this.props.getContactRecords(basicId);
    await this.initDateList(typeVal);
    this.submitContact(this.state.selectedDuration);
  }

  onChangeContactType = async (element) => {
    const contactType = element.target.value;
    const basicId = this.props.match.params.basicId;
    await this.props.getContactRecords(basicId);
    await this.initDateList(contactType);
    this.setState({
      selectedDuration: 0
    });
    this.submitContact(0);
  }

  initDateList = async (contactType) => {
    const { publishRecords, paymentOrders } = this.props;
    // 服務刊登期
    const publishDuration = publishRecords.map((element, key) => {
      const { startDate, endDate, startDateStr } = element;
      return {
        label: `${dateFormat(startDate, false)} - ${endDate ? dateFormat(endDate, false) : '目前'}`,
        value: key,
        startDate: startDate,
        startDateStr: startDateStr,
        endDate: endDate,
      };
    });
    // 付費訂單
    const paymentDuration = paymentOrders.map((element, key) => {
      const { startDate, endDate, orderId } = element;
      return {
        label: `${orderId}（${dateFormat(startDate, false)} - ${endDate ? dateFormat(endDate, false) : '目前'}）`,
        value: key,
        startDate: startDate,
        endDate: endDate,
        orderId: orderId,
      };
    });
    const query = this.props.history.location.query;
    const startDateFromHistory = query.startDate;
    const orderIdFromPayment = query.orderId;
    let currentData = 0;
    if (Object.keys(query)[0] === 'startDate') {
      currentData = this.getDurationNoByDateList(publishDuration, dateFormat(startDateFromHistory, true)).value;
    } else if (Object.keys(query)[0] === 'orderId') {
      currentData = this.getDurationNoByDateList(paymentDuration, orderIdFromPayment).value;
    }

    // 切換刊期選項
    return new Promise((resolve) => {
      this.setState({
        contactType: contactType,
        dateList: publishDuration,
        orderList: paymentDuration,
        publishDuration: publishDuration,
        paymentDuration: paymentDuration,
        selectedDuration: currentData,
      }, resolve);
    });
  }

  getDurationNoByDateList = (list, target) => {
    const query = Object.keys(this.props.history.location.query)[0];
    const listObj = {
      startDate: list.find(element => dateFormat(element.startDateStr, true) === target),
      orderId: list.find(element => element.orderId === target)
    };
    return listObj[query];
  }

  submitContact = (selectedDuration) => {
    const { dateList, orderList, contactType } = this.state;
    const basicId = this.props.match.params.basicId;
    switch (contactType) {
      case demandContactType[0].value: {
        const startDate = dateList[selectedDuration].startDateStr;
        // 服務刊登期
        this.handleLoading(this.props.loadGigContacts(basicId, null, null, startDate));
        break;
      }
      case demandContactType[1].value: {
        const orderId = orderList[selectedDuration].orderId;
        // 付費訂單
        this.handleLoading(this.props.loadGigContacts(basicId, null, orderId, null));
        break;
      }
      default: {
        break;
      }
    }
  };

  updateContactOptions = () => {
    const { publishDuration, paymentDuration, contactType } = this.state;
    switch (contactType) {
      case demandContactType[0].value: {
        this.setState({
          selectedDuration: 0,
          publishDuration: [...publishDuration],
        }, this.updateContactList);
        break;
      }
      case demandContactType[1].value: {
        this.setState({
          selectedDuration: 0,
          publishDuration: [...paymentDuration],
        }, this.updateContactList);
        break;
      }
      default: {
        break;
      }
    }
  }

  handleLoading = (callback) => {
    this.setState({ loading: true }, () => callback.then(() => this.setState({ loading: false })));
  }

  nextPage = (key) => {
    const {
      dateList, orderList, selectedDuration, contactType
    } = this.state;
    const basicId = this.props.match.params.basicId;
    if (contactType === demandContactType[0].value) {
      const startDate = dateList[selectedDuration].startDateStr;
      this.handleLoading(this.props.loadGigContacts(basicId, key, null, startDate));
    } else {
      const orderId = orderList[selectedDuration].orderId;
      this.handleLoading(this.props.loadGigContacts(basicId, key, orderId, null));
    }
  }

  render() {
    const {
      topperName, match, nextKey, gigContactsList
    } = this.props;
    const {
      contactType, selectedDuration, publishDuration, paymentDuration, loading
    } = this.state;
    const durations = contactType === demandContactType[0].value ? publishDuration : paymentDuration;
    const basicId = match.params.basicId;
    return <>
      <Breadcrumb style={ { margin: '16px 0' } }>
        <Breadcrumb.Item>
          <Link to={ `/member/${basicId}?tabs=gig` }>{`${topperName.name}的接案服務管理`}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>查閱案件聯絡資料紀錄</Breadcrumb.Item>
      </Breadcrumb>
      {
        selectedDuration !== '無資料'
          ? (
            <Card>
              <ContactSelect
                durations={ durations }
                contactType={ contactType }
                selectedDuration={ selectedDuration }
                submitContact={ this.submitContact }
                onChangeContactType={ this.onChangeContactType }
              />
              <ContactList data={ gigContactsList } nextPage={ this.nextPage } nextKey={ nextKey } loading={ loading } />
            </Card>
          )
          : (
            <div>
              <LoadingOutlined />
              <span style={ { fontSize: '14px', marginLeft: '10px' } }>頁面載入中</span>
            </div>
          )
      }

    </>;
  }
}
const mapStateToProps = state => ({
  topperName: state.member.topperName,
  publishRecords: state.member.gigContacts.publishRecords,
  paymentOrders: state.member.gigContacts.paymentOrders,
  gigContactsList: state.member.gigContacts.data,
  nextKey: state.member.gigContacts.cursor,
});

const mapDispatchToProps = {
  loadTopperName,
  loadGigContacts,
  getContactRecords,
};

export default connect(mapStateToProps, mapDispatchToProps)(GigContact);
