import React, { Component, Fragment } from 'react';
// import { uaIsMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { Checkbox, Modal } from 'antd';
import Button from '../ui/button';
import styles from './CheckboxGroup.scss';

const topperData = [
  {
    id: '1',
    title: '最新案件配對信',
    des: '依據您設定的高手服務項目類別及服務地區，提供相關最新案件資訊',
    cycle: '每日發送(無合適案件則不寄發)'
  },
  {
    id: '304',
    title: '104高手接案資訊報',
    des: '第一時間掌握104高手提供的精選案件、最新功能、活動情報與優惠好康',
    cycle: '不定期'
  },
];

const demanderData = [
  {
    id: '305',
    title: '104高手發案找人才資訊報',
    des: '不定期提供104高手精選人才推薦、最新功能、活動情報與優惠好康',
    cycle: '不定期'
  },
];

class CheckboxGroup extends Component {
  state = {
    visible: false,
  }

  render() {
    const {
      defaultValue, type, defaultSubscribeForm, name, setFieldTouched, setFieldValue
    } = this.props;

    const topperNewData = () => {
      let visibleOption = [];
      defaultSubscribeForm.topperSubscriptions.forEach(val => visibleOption.push(val.subscribeNumber.toString()));
      let topperCheckbox = [];
      topperData.forEach((val) => { if (visibleOption.includes(val.id)) topperCheckbox.push(val); });

      return topperCheckbox;
    };

    const listTopperData = topperNewData();
    const checkboxs = {
      topperSubscriptions: {
        data: defaultSubscribeForm.topperSubscriptions,
        defaultValue: defaultValue().defaultTopperValue,
        lists: listTopperData
      },
      demanderSubscriptions: {
        data: defaultSubscribeForm.demanderSubscriptions,
        defaultValue: defaultValue().defaultDemanderValue,
        lists: demanderData
      }
    };

    const handleChange = (checkedValues) => {
      if (checkboxs[type].data[0] && !checkboxs[type].data[0].canUse) {
        this.setState({
          visible: true,
        });
        return false;
      }
      this.setState({
        [type]: checkedValues,
      });
      setFieldTouched(name);
      setFieldValue(name, checkedValues);
    };

    return (
      <>
        <Checkbox.Group
          onChange={handleChange}
          defaultValue={checkboxs[type].defaultValue}
        >
          {
          checkboxs[type].lists.map((list) => {
            return (
              <Fragment key={list.id}>
                <Checkbox value={list.id}>
                  { list.title }
                </Checkbox>
                <ul className={styles.itemWrap}>
                  <li>
                    { list.des }
                  </li>
                  <li className={styles.timer}>
                    { list.cycle }
                  </li>
                </ul>
              </Fragment>
            );
          })
        }
          {/* { 暫時註解起來
          uaIsMobile() ? (

            checkboxs[type].lists.map((list) => {
              return (
                <Fragment key={list.id}>
                  <Checkbox value={list.id}>
                    { list.title }
                  </Checkbox>
                  <ul className={styles.itemWrap}>
                    <li>
                      { list.des }
                    </li>
                    <li className={styles.timer}>
                      { list.cycle }
                    </li>
                  </ul>
                </Fragment>
              );
            })
          ) : (
            checkboxs[type].lists.map((list) => {
              return (
                <tr className={styles.tr} key={list.id}>
                  <td className={styles.checkbox}>
                    <Checkbox value={list.id}>
                      { list.title }
                    </Checkbox>
                  </td>
                  <td className={styles.desc}>
                    { list.des }
                  </td>
                  <td className={styles.timer}>
                    { list.cycle }
                  </td>
                </tr>
              );
            })
          )
        } */}
        </Checkbox.Group>
        <Modal
          style={{ top: '20%' }}
          maskClosable={false}
          wrapClassName={styles.topperModel}
          visible={this.state.visible}
          footer={[
            <Link to="/join">
              <Button
                key="1"
                type="primary"
              >成為高手
              </Button>
            </Link>
          ]}
        >
          <p>設定高手服務項目，才可訂閱最新案件報。<br />
            立即成為高手，編輯你的服務吧！
          </p>
        </Modal>
      </>
    );
  }
}

export default CheckboxGroup;
