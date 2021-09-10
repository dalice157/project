import React, { Component, Fragment } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Button, Card } from 'antd';
import { Form, Input, SubmitButton } from 'formik-antd';
import { validateDemandWindowId, validateDemandWindowData } from '../common/Validates';
// import { DisplayFormikState } from '../tools/debug';

class WindowForm extends Component {
    renderDemandIdForm = (props) => {
      const {
        dirty,
        handleReset
      } = props;

      const blockStyle = {
        margin: 'auto 10px',
        width: '170px',
      };

      const errorStyle = {
        color: 'red',
        marginTop: '2px',
        display: 'block',
        position: 'relative'
      };

      return (
        <Form>
          <Input
            name="demandId1"
            placeholder="案件編號"
            style={ blockStyle }
          />
          <Input
            name="demandId2"
            placeholder="案件編號"
            style={ blockStyle }
          />
          <Input
            name="demandId3"
            placeholder="案件編號"
            style={ blockStyle }
          />
          <SubmitButton type="primary" style={ { margin: 'auto 10px' } }>帶入資料編輯</SubmitButton>
          <Button type="button" className="outline" onClick={ handleReset } disabled={ !dirty } style={ { margin: 'auto 10px' } }>重置</Button>
          <ErrorMessage name="demandId1" style={ errorStyle } component="span" />
          <ErrorMessage name="demandId2" style={ errorStyle } component="span" />
          <ErrorMessage name="demandId3" style={ errorStyle } component="span" />
          {/* debug mode */}
          {/* <DisplayFormikState {...props} /> */}
        </Form>
      );
    }

    renderDemandForm = (props) => {
      const {
        values,
        handleReset
      } = props;

      const {
        leftDemand,
        middleDemand,
        rightDemand
      } = values;

      const tab = '\u2003\u2003\u2003\u2003\u2003\u2003\u2003';
      const dottedLine = <Fragment><hr style={ { border: '1px dashed #DDDDDD' } } /><br /></Fragment>;
      const isValid = values.leftDemand.demandId !== '' && values.middleDemand.demandId !== '' && values.rightDemand.demandId !== '';
      const blockStyle = {
        margin: '1px 10px'
      };

      const titleStyle = {
        width: '310px',
      };

      const descStyle = {
        width: '580px',
        height: '160px'
      };

      const errorStyle = {
        color: 'red',
        marginTop: '2px',
        position: 'relative',
        display: 'inline'
      };

      return (
        <Form>
          {/* 顯示標題A */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 顯示標題{tab} </label>
            <Input
              name="leftDemand.title"
              placeholder="請輸入20個字以內"
              style={ titleStyle }
            />
            <ErrorMessage name="leftDemand.title" style={ errorStyle } component="p" />
          </div>
          <br />

          {/* 案件編號A */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 案件編號{tab} </label>
            {
                        leftDemand.demandId === ''
                          ? '尚無資料'
                          : leftDemand.demandId.replace(/Demand-/g, '')
                    }
          </div>
          <br />

          {/* 案件預算A */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 案件預算{tab} </label>
            {
                        leftDemand.price[0] == null || leftDemand.price[1] == null
                          ? <p style={ errorStyle }>收到的金額格式錯誤，如右所示：{leftDemand.price.toString()}</p>
                          : this.props.priceConvertor(leftDemand.price, leftDemand.unit)
                    }
          </div>
          <br />

          {/* 顯示說明A */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 顯示說明{tab} </label>
            <Input.TextArea
              name="leftDemand.desc"
              placeholder="請輸入2000個字以內"
              style={ descStyle }
            />
            <ErrorMessage name="leftDemand.desc" style={ errorStyle } component="p" />
          </div>
          <br />
          { dottedLine }

          {/* 顯示標題B */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 顯示標題{tab} </label>
            <Input
              name="middleDemand.title"
              placeholder="請輸入20個字以內"
              style={ { width: '300px' } }
            />
            <ErrorMessage name="middleDemand.title" style={ errorStyle } component="p" />
          </div>
          <br />

          {/* 案件編號B */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 案件編號{tab} </label>
            {
                        middleDemand.demandId === ''
                          ? '尚無資料'
                          : middleDemand.demandId.replace(/Demand-/g, '')
                    }
          </div>
          <br />

          {/* 案件預算B */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 案件預算{tab} </label>
            {
                        middleDemand.price[0] == null || middleDemand.price[1] == null
                          ? <p style={ errorStyle }>收到的金額格式錯誤，如右所示：{middleDemand.price.toString()}</p>
                          : this.props.priceConvertor(middleDemand.price, middleDemand.unit)
                    }
          </div>
          <br />

          {/* 顯示說明B */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 顯示說明{tab} </label>
            <Input.TextArea
              name="middleDemand.desc"
              placeholder="請輸入2000個字以內"
              style={ descStyle }
            />
            <ErrorMessage name="middleDemand.desc" style={ errorStyle } component="p" />
          </div>
          <br />
          { dottedLine }

          {/* 顯示標題C */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 顯示標題{tab} </label>
            <Input
              name="rightDemand.title"
              placeholder="請輸入20個字以內"
              style={ { width: '300px' } }
            />
            <ErrorMessage name="rightDemand.title" style={ errorStyle } component="p" />
          </div>
          <br />

          {/* 案件編號C */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 案件編號{tab} </label>
            {
                        rightDemand.demandId === ''
                          ? '尚無資料'
                          : rightDemand.demandId.replace(/Demand-/g, '')
                    }
          </div>
          <br />

          {/* 案件預算C */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 案件預算{tab} </label>
            {
                        rightDemand.price[0] == null || rightDemand.price[1] == null
                          ? <p style={ errorStyle }>收到的金額格式錯誤，如右所示：{rightDemand.price.toString()}</p>
                          : this.props.priceConvertor(rightDemand.price, rightDemand.unit)
                    }
          </div>
          <br />

          {/* 顯示說明C */}
          <div style={ blockStyle }>
            <label style={ { float: 'left' } }> 顯示說明{tab} </label>
            <Input.TextArea
              name="rightDemand.desc"
              placeholder="請輸入2000個字以內"
              style={ descStyle }
            />
            <ErrorMessage name="rightDemand.desc" style={ errorStyle } component="p" />
          </div>
          <br />

          <div style={ { textAlign: 'center' } }>
            <SubmitButton type="primary" disabled={ !isValid } style={ blockStyle }>發佈</SubmitButton>
            <Button type="button" className="outline" onClick={ handleReset } style={ blockStyle }> 重置 </Button>
          </div>
          {/* debug mode */}
          {/* <DisplayFormikState {...props} /> */}
        </Form>
      );
    }

    render() {
      const demandIdList = this.props.demandWindowId;
      const demandDataList = this.props.demandWindowData;
      const dottedLine = <Fragment><hr style={ { border: '1px dashed #DDDDDD' } } /><br /></Fragment>;
      return (
        <Fragment>
          <h2> 案件櫥窗 </h2>
          <Card>
            <Formik
              initialValues={ demandIdList }
              onSubmit={
              async (demandIdList, { setSubmitting }) => {
                await this.props.getDemandWindow(demandIdList);
                setSubmitting(false);
              } }
              validationSchema={ validateDemandWindowId }
              enableReinitialize
            >
              { this.renderDemandIdForm }
            </Formik>
            <br />
            { dottedLine }
            <Formik
              initialValues={ demandDataList }
              onSubmit={
              async (demandDataList, { setSubmitting }) => {
                await this.props.saveDemandWindow(demandDataList);
                setSubmitting(false);
              } }
              validationSchema={ validateDemandWindowData }
              enableReinitialize
            >
              { this.renderDemandForm }
            </Formik>
          </Card>
        </Fragment>
      );
    }
}

export default WindowForm;
