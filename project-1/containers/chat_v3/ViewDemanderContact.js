import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import Button from '../../components/ui/button';
import { loadDemandContactInfo } from '../../actions/chatmeta_v2';
import { sexTitle, tutorTimeList } from '../../config/selectData';
import { optionsToTable } from '../../util/formatUtil';
/**
 * 高手查看案件聯絡資料
 */
class ViewDemanderContact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  displayDemandContactInfo = async (demandId, roomId) => {
    const {
      setDropdownUnVisible,
    } = this.props;

    if (setDropdownUnVisible != null) {
      setDropdownUnVisible();
    }
    this.setState({ loading: true });
    const demandContactResult = await this.props.loadDemandContactInfo(demandId, roomId);
    const { payload } = demandContactResult;
    if (payload && payload.demandContact && payload.isProvide) {
      const { demandContact } = payload;
      const hasContactTime = demandContact.contactTimeBegin !== null && demandContact.contactTimeEnd !== null;
      const sexDesc = sexTitle.find(sex => sex.value == demandContact.sex).label;
      const cellphone = demandContact.displayCellphone
        ? (
          demandContact.cellphone == ''
            ? '未設定'
            : demandContact.cellphone
        ) : '不公開';
      const tel = demandContact.displayTel
        ? (
          demandContact.telArea == '' || demandContact.tel == ''
            ? '未設定'
            : `${demandContact.telArea}-${demandContact.tel}`
        ) : '不公開';
      const other = demandContact.displayOther
        ? (
          demandContact.other == ''
            ? '未設定'
            : demandContact.other
        ) : '不公開';

      Modal.info({
        content: (
          <div>
            需求：
            {demandContact.demandTitle}
            <br />
            <br />
            此需求之聯絡人資料如下：
            <br />
            <br />
            姓名：
            {demandContact.name}
            {' '}
            {sexDesc}
            <br />
            <br />
            e-mail：
            {demandContact.email}
            <br />
            <br />
            { hasContactTime ? (
              <li>
                可聯絡時間：
                {optionsToTable(tutorTimeList)[demandContact.contactTimeBegin]}
                ～
                {optionsToTable(tutorTimeList)[demandContact.contactTimeEnd]}
              </li>
            ) : null }
            行動電話：
            {cellphone}
            <br />
            室內電話：
            {tel}
            <br />
            <br />
            其他聯絡方式：
            <br />
            {other}
            <br />
            <br />
            請注意：
            <br />
            若聯絡後，雙方有確認要合作，請記得主動「回報合作」才會增加您的接案合作數及後續的評價數喔。
          </div>
        ),
        okText: '關閉',
        onOk() {},
      });
    } else {
      // 「已結案」或 聯絡人資料欄位為完全無資料
      Modal.info({
        content: (
          <div>
            此需求案件 無聯絡人資料  或  已結案關閉 無法顯示。
          </div>
        ),
        okText: '關閉',
        onOk() {},
      });
    }
    this.setState({ loading: false });
  }

  render() {
    const {
      loading,
    } = this.state;
    const {
      demandId,
      roomId,
    } = this.props;

    return (
      <>
        <Button
          type="normal"
          onClick={() => this.displayDemandContactInfo(demandId, roomId)}
          loading={loading}
        >
          查看聯絡資料
        </Button>
      </>
    );
  }
}

ViewDemanderContact.propTypes = {
  demandId: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  setDropdownUnVisible: PropTypes.func,
};

ViewDemanderContact.defaultProps = {
  setDropdownUnVisible: null,
};

const mapStateToProps = state => ({
  demandContactInfo: state.chatmeta.demandContactInfo,
});

const mapDispatchToProps = {
  loadDemandContactInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewDemanderContact);
