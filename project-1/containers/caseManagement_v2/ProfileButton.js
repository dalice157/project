import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { sexes, tutorTimeList } from '../../config/selectData';
import { optionsToTable } from '../../util/formatUtil';
import Button from '../../components/ui/button_v2';
import { getContact } from '../../actions/gigManage';
import styles from './ProfileButton.scss';

class ProfileButton extends PureComponent {
  handleProfile = () => {
    this.props.getContact(this.props.profileDataObj.demandId).then(() => {
      const {
        name, cellphone, email, other, sex, tel, telArea, contactTimeBegin, contactTimeEnd,
      } = this.props.profileData;
      const sexText = sex === sexes[0].value ? '先生' : '小姐';
      const isOther = other || '無';
      const hasContactTime = contactTimeBegin !== null && contactTimeEnd !== null;
      const telNumber = telArea && tel ? `${telArea}-${tel}` : tel;
      const telNote = typeof telNumber === 'string' && telNumber.includes('*') && '案主暫不開放電話聯繫';
      const cellphoneNote = typeof cellphone === 'string' && cellphone.includes('*') && '案主暫不開放電話聯繫';
      console.log('telNote ', telNote);
      console.log('cellphoneNote ', cellphoneNote);
      Modal.info({
        className: styles.info,
        icon: null,
        title: '聯絡人資料',
        okText: '關閉',
        okType: 'default',
        content: (
          <>
            <h3 className={styles.title}>{this.props.title}</h3>
            <ul className={styles.list}>
              <li>
                姓名：
                {name}
                {sexText}
              </li>
              <li>
                Email：
                <a href={`mailto:${email}?subject=主旨`}>{email}</a>
              </li>
              { hasContactTime ? (
                <li>
                  可聯絡時間：
                  {optionsToTable(tutorTimeList)[contactTimeBegin]}
                  ～
                  {optionsToTable(tutorTimeList)[contactTimeEnd]}
                </li>
              ) : null }
              <li>
                室內電話：
                <span>{telNumber || '無'}</span>
                <span className={styles.note}>{telNote}</span>
              </li>
              <li>
                行動電話：
                <span>{cellphone || '無'}</span>
                <span className={styles.note}>{cellphoneNote}</span>
              </li>
              <li>
                其他聯絡方式：
                {isOther}
              </li>
            </ul>
          </>
        ),
      });
    });
  }


  render() {
    const { getContacts, step } = this.props.profileDataObj;
    const isDisabled = step == 4 ? 'disabled' : '';
    return (
      <>
        {
          getContacts && (
            <Button type={isDisabled} onClick={this.handleProfile}>聯絡人資料</Button>
          )
        }
      </>
    );
  }
}

const mapStateToProps = state => ({
  profileData: state.gigManage.profileData,
});
const mapDispatchToProps = {
  getContact,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileButton);
