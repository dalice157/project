import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Tabs, Modal } from 'antd';
import { generateTopBasic } from '../../actions/member.js';
import ImportOutsourceTopperForm from '../../components/member/basic/import/importOutsourceTopperForm.js';
import ImportTutorTopperForm from '../../components/member/basic/import/importTutorTopperForm.js';

const { TabPane } = Tabs;

class OldSiteImport extends Component {
    handleFormSubmit = async (form) => {
      try {
        const importTopperBasic = await this.props.generateTopperBasic(form);
        let alertContent = this.handlePidListDesc(importTopperBasic.payload);

        Modal.warning({
          title: '建立預備會員',
          content: alertContent,
        });
      } catch (error) {
        console.log(error);
      }
    }

    // 後端回傳篩選後的pid Map，組合訊息顯示
    handlePidListDesc = (checkedPidList) => {
      const {
        errorPid, hasBeenTopper, oldSiteNoData, genBasicSuccess, genBasicError
      } = checkedPidList;
      let alertContent = (
        <Fragment>
          {errorPid.length > 0
                    && <p><b>會員PID格式錯誤，請確認：</b>{errorPid.join(',')}</p>
                }
          {hasBeenTopper.length > 0
                    && <p><b>已開啟高手品牌頁，不可建立接案預備會員：</b>{hasBeenTopper.join(',')} (PID號碼)</p>
                }
          {
                    oldSiteNoData.length > 0
                    && <p><b>沒有外包/家教接案檔案，不可建立接案預備會員：</b>{oldSiteNoData.join(',')} (PID號碼)</p>
                }
          {
                    genBasicError.length > 0
                    && <p><b>會員資料處理錯誤，請洽工程：</b>{genBasicError.join(',')}</p>
                }
          {
                    genBasicSuccess.length > 0
                    && <p><b>本次已成功匯入：</b><b style={ { color: 'red' } }>{genBasicSuccess.length} 筆</b> 接案預備會員</p>
                }
        </Fragment>
      );
      return alertContent;
    }

    render() {
      const outsourceInitData = { importSource: 'outsource' };
      const tutorInitData = { importSource: 'tutor' };
      return (
        <Fragment>
          <div style={ { position: 'relative' } }>
            <Tabs defaultActiveKey="outsource">
              <TabPane tab="外包網" key="outsource">
                <ImportOutsourceTopperForm
                  importSource="outsource"
                  onSubmit={ this.handleFormSubmit }
                  initialValues={ outsourceInitData }
                  handleFormSubmit={ this.handleFormSubmit }
                />
              </TabPane>
              <TabPane tab="家教網" key="tutor">
                <ImportTutorTopperForm
                  importSource="tutor"
                  onSubmit={ this.handleFormSubmit }
                  initialValues={ tutorInitData }
                  handleFormSubmit={ this.handleFormSubmit }
                />
              </TabPane>
            </Tabs>
          </div>
        </Fragment>
      );
    }
}

const mapDispatchToProps = {
  generateTopperBasic: generateTopBasic,
};
export default connect(null, mapDispatchToProps)(OldSiteImport);
