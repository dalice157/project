import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { uaIsMobile } from 'react-device-detect';
import {
  Breadcrumb, Layout, Modal
} from 'antd';
import { sexes } from '../../config/selectData';
import { isNumber } from '../../util/commonUtil';
import { loadStaticArea, getContent, } from '../../actions/common';
import CaseInfoSider from '../../components/caseList_v3/CaseInfoSider';
import Introduction from '../../components/caseList_v3/Introduction';
import ApplyButton from './ApplyButton';

import styles from './CaseInfo.scss';


const { Sider } = Layout;

class CaseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      openImModel: false,
    };
  }

  componentDidMount() {
    const { basicId, demandId } = this.props.location.query;
    const isBasicIdExist = isNumber(basicId);
    if (isBasicIdExist) {
      this.props.loadStaticArea();
      this.props.getContent(basicId, demandId).then(() => {
        const { contentData } = this.props;
        const demandData = contentData && contentData.title && (contentData.demanderFamilyName || contentData.sex);
        if (!demandData) {
          this.error();
        }
      });
    } else {
      console.log('error');
      this.error();
    }
  }

  reload = () => {
    const { basicId, demandId } = this.props.location.query;
    this.props.getContent(basicId, demandId);
  }

  error = () => {
    Modal.error({
      title: '找不到案件資料，此案件可能已經關閉。',
      okText: '回案件列表',
      okButtonProps: {
        type: 'primary',
        href: '/caseList'
      },
    });
  }

  render() {
    const isMobile = uaIsMobile();
    const {
      areaData, contentData
    } = this.props;
    const {
      demanderFamilyName, sex, applied, basicId, demandId,
    } = this.props.contentData;
    const isMobileStyle = isMobile ? styles.mobile : '';
    const sexText = sex === sexes[0].value ? '先生' : '小姐';
    const getAppliedText = applied ? '再次應徵' : '我要應徵';
    return (
      <>
        <div className={styles.bg}>
          <div className={`${styles.wrap} ${isMobileStyle}`}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item><Link to="/">首頁</Link></Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/caseList">案件列表</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {contentData.title}
              </Breadcrumb.Item>
            </Breadcrumb>
            {
              isMobile ? (
                <div className={`${styles.layout} ${styles.mobile}`}>
                  <Introduction
                    data={contentData}
                    areaData={areaData}
                  />
                  <CaseInfoSider
                    data={contentData}
                    reload={this.reload}
                  />
                </div>
              ) : (
                <Layout hasSider>
                  <Sider className={styles.sider}>
                    <CaseInfoSider
                      sex={sexText}
                      data={contentData}
                      getAppliedText={getAppliedText}
                      reload={this.reload}
                    />
                  </Sider>
                  <Layout className={styles.layout}>
                    <Introduction
                      data={contentData}
                      areaData={areaData}
                    />
                  </Layout>
                </Layout>
              )
            }
          </div>
        </div>
        {
          isMobile
          && (
            <div className={styles.contactWrap}>
              <div className={styles.userName}>
                <span className={styles.title}>案主：</span>
                <div className={styles.nameWarp}><span className={styles.name}>{demanderFamilyName}</span><span className={styles.sex}>{sexText}</span></div>
              </div>
              <ApplyButton
                getAppliedText={getAppliedText}
                basicId={basicId}
                demandId={demandId}
                onClose={this.reload}
              />
            </div>
          )
        }

      </>
    );
  }
}

const mapStateToProps = state => ({
  areaData: state.common.area,
  user: state.user,
  contentData: state.common.contentData,
});

const mapDispatchToProps = {
  loadStaticArea,
  getContent
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CaseInfo));
