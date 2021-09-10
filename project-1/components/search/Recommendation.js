import React, { Component, Fragment } from 'react';
import {
  Checkbox, Card, Row, Col
} from 'antd';
import { Clear } from '@material-ui/icons';
import { BrowserView, MobileView } from 'react-device-detect';
import styles from './Recommendation.scss';
import tutorFilter from '../../img/search/tutorFilter.png';
import cramschoolFilter from '../../img/search/cramschoolFilter.png';
import onlinecourseFilter from '../../img/search/onlinecourseFilter.png';
import { TUTOR_RECOMMENDATION } from '../../config/constant.js';
import { setCookie } from '../../util/cookieUtil.js';

class Recommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: props.showModal,
      saveCookieStatus: false
    };
  }

  componentDidMount() {
    // console.log('showModal', this.props.showModal);
    this.setState({ showModal: this.props.showModal });
  }

  changeSaveCookieStatus = (value) => {
    this.setState({
      saveCookieStatus: value.target.checked
    });
  }

  onClickOption = (optionNo) => {
    if (this.state.saveCookieStatus) {
      setCookie(TUTOR_RECOMMENDATION.cookieStamp, optionNo);
    }
    if (optionNo !== TUTOR_RECOMMENDATION.tutorNoList.all) {
      this.props.handletMethodChange(optionNo);
    }
    // 作動後都不顥示
    this.cancelModal();
  }

  cancelModal= () => {
    this.setState({ showModal: false });
  }

  render() {
    const { tutorNoList } = TUTOR_RECOMMENDATION;
    const { showModal, saveCookieStatus } = this.state;
    return (
      <Fragment>
        <BrowserView>
          {
            showModal
              ? (
                <div className={`${styles.modal}`}>
                  <div className={`${styles.top}`}>
                    <p className={`${styles.title}`}>選擇偏好的服務方式，讓我們為您搜尋更適合您的服務！</p>
                    <div className={`${styles.clear}`}>
                      <Clear onClick={() => this.cancelModal()} />
                    </div>
                  </div>
                  <hr className={`${styles.line}`} />
                  <div className={`${styles.content}`}>
                    <Checkbox
                      className={`${styles.checkbox}`}
                      checked={saveCookieStatus}
                      onChange={value => this.changeSaveCookieStatus(value)}
                    >
                      記住本次點選之服務方式偏好，之後將不再顯示。
                    </Checkbox>
                    <div className={styles.cardList}>
                      <Card
                        hoverable
                        bordered={false}
                        className={`${styles.card}`}
                        onClick={() => this.onClickOption(tutorNoList.tutor)}
                      >
                        <img className={`${styles.img}`} src={tutorFilter} alt="" />
                        <p className={`${styles.subtitle}`}>到客戶指定地點</p>
                        <p className={`${styles.subtitleEmphasized}`}>（家教）</p>
                      </Card>
                      <Card
                        hoverable
                        bordered={false}
                        className={`${styles.card}`}
                        onClick={() => this.onClickOption(tutorNoList.cramSchool)}
                      >
                        <img className={`${styles.img}`} src={cramschoolFilter} alt="" />
                        <p className={`${styles.subtitle}`}>到高手的工作室</p>
                        <p className={`${styles.subtitleEmphasized}`}>（補習班）</p>
                      </Card>
                      <Card
                        hoverable
                        bordered={false}
                        className={`${styles.card}`}
                        onClick={() => this.onClickOption(tutorNoList.onlineCourse)}
                      >
                        <img className={`${styles.img}`} src={onlinecourseFilter} alt="" />
                        <p className={`${styles.subtitle}`}>透過網路/電話</p>
                        <p className={`${styles.subtitleEmphasized}`}>（線上教學）</p>
                      </Card>
                      <Card
                        hoverable
                        bordered={false}
                        className={`${styles.card}`}
                        onClick={() => this.onClickOption(tutorNoList.all)}
                      >
                        <p className={`${styles.subtitle}`}>不拘</p>
                      </Card>
                    </div>
                  </div>
                </div>
              ) : <></>
          }
        </BrowserView>
        <MobileView>
          {
            showModal
              ? (
                <div className={`${styles.modal}`}>
                  <div className={`${styles.top}`}>
                    <p className={`${styles.title}`}>選擇偏好的服務方式，為您搜尋更適合您的服務！</p>
                    <div className={`${styles.clear}`}>
                      <Clear onClick={() => this.cancelModal()} />
                    </div>
                  </div>
                  <hr className={`${styles.line}`} />
                  <div className={`${styles.content}`}>
                    <Checkbox
                      className={`${styles.checkbox}`}
                      checked={saveCookieStatus}
                      onChange={value => this.changeSaveCookieStatus(value)}
                    >
                      記住本次點選之服務偏好，之後將不再顯示。
                    </Checkbox>
                    <div className={styles.cardList}>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <li className={styles.cardElement}>
                            <Card
                              hoverable
                              bordered={false}
                              className={`${styles.card}`}
                              onClick={() => this.onClickOption(tutorNoList.tutor)}
                            >
                              <img className={`${styles.img}`} src={tutorFilter} alt="" />
                              <p className={`${styles.subtitle}`}>到客戶指定地點</p>
                              <p className={`${styles.subtitleEmphasized}`}>（家教）</p>
                            </Card>
                          </li>

                        </Col>
                        <Col span={12}>
                          <li className={styles.cardElement}>
                            <Card
                              hoverable
                              bordered={false}
                              className={`${styles.card}`}
                              onClick={() => this.onClickOption(tutorNoList.cramSchool)}
                            >
                              <img className={`${styles.img}`} src={cramschoolFilter} alt="" />
                              <p className={`${styles.subtitle}`}>到高手的工作室</p>
                              <p className={`${styles.subtitleEmphasized}`}>（補習班）</p>
                            </Card>
                          </li>
                        </Col>
                      </Row>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <li className={styles.cardElement}>
                            <Card
                              hoverable
                              bordered={false}
                              className={`${styles.card}`}
                              onClick={() => this.onClickOption(tutorNoList.onlineCourse)}
                            >
                              <img className={`${styles.img}`} src={onlinecourseFilter} alt="" />
                              <p className={`${styles.subtitle}`}>透過網路/電話</p>
                              <p className={`${styles.subtitleEmphasized}`}>（線上教學）</p>
                            </Card>
                          </li>
                        </Col>
                        <Col span={12}>
                          <li className={styles.cardElement}>
                            <Card
                              hoverable
                              bordered={false}
                              className={`${styles.card}`}
                              onClick={() => this.onClickOption(tutorNoList.all)}
                            >
                              <p className={`${styles.subtitle}`}>不拘</p>
                            </Card>
                          </li>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              ) : <></>
          }
        </MobileView>
      </Fragment>
    );
  }
}
export default Recommendation;
