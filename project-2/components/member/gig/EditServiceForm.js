import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import './EditServiceForm.scss';
import { Formik, ErrorMessage } from 'formik';
import { Tooltip, Card, InputNumber } from 'antd';
import {
  Input, Checkbox, Select, Form, SubmitButton
} from 'formik-antd';
import {
  methodData,
  targetData,
  timeSlotData,
  gigExperienceData,
  unitData,
  defaultMoneyData
} from '../../../config/selectData';
import TreeSelect from '../../ui/treeSelect';
import { editService } from '../../common/Validates';
import GigTags from '../../ui/tags';
import defaultImg20 from '../../ui/cropUploader/default_20.jpg';
import defaultImg from '../../../img/default.jpg';
import CropUploader from '../../ui/cropUploader/index.js';
import { isContainTutorCats } from '../../../util/lablesUtils';
import GigMemo from '../../../containers/member/gig/GigMemo';
// import { DebugFormik } from '../../tools/DebugFormik';

const timeSlotOptions = [...timeSlotData[0].times, ...timeSlotData[1].times];
class EditServiceForm extends PureComponent {
  state = {
    areaChanged: false,
    area: [],
    areaNo: [],
    areaDesc: '請選擇地區',
    catChanged: false,
    formGigCats: [],
    tagsChanged: false,
    tags: [],
  }

  renderForm = (formProps) => {
    const {
      catChanged, formGigCats, areaChanged, area, areaNo, tagsChanged, tags
    } = this.state;
    const {
      gigId,
      basicId,
      fileId,
      preReceverCropImg,
      receverCropFid,
      receverCropImg,
      oriFile,
      coverPic,
      fileMap,
      onUpdateGigmemo,
    } = this.props;
    const CUploaderProps = {
      aspect: 16 / 9,
      fileId: fileId,
      oriFile: oriFile,
      onBeforeProcessing: preReceverCropImg,
      onStartProcessing: receverCropFid,
      onFinishProcessing: receverCropImg,
      editable: true,
      componentType: 'gallery',
      buttonPosition: 'center',
      basicId: basicId,
    };
    const imageSrc = (coverPic && fileMap) ? (fileMap[coverPic] || coverPic) : defaultImg;
    const { values, setFieldValue } = formProps;
    // 服務類型
    const selectedGig = catChanged ? formGigCats : this.props.gigCats;
    values.gigCats = selectedGig;
    // 服務金額
    const { unit, price } = values;
    const minPrice = unit === unitData[0].value ? defaultMoneyData.minCase : defaultMoneyData.minHourRate;
    const isNotValidMinHourRate = unit === unitData[1].value && price < defaultMoneyData.minHourRate;

    if (isNotValidMinHourRate) {
      setFieldValue('price', defaultMoneyData.minHourRate);
    }
    // 服務地區
    const selectedAreas = areaChanged ? {
      des: area,
      no: areaNo,
    } : {
      des: this.props.assignPlace.des,
      no: this.props.assignPlace.no,
    };
    const areaDesc = selectedAreas.des.length > 0 ? selectedAreas.des.join('、') : '請選擇地區';
    values.assignPlace = selectedAreas;
    // 服務對象
    const { target } = values;
    const isTutor = selectedGig && isContainTutorCats(selectedGig);
    const isTargetInvalid = isTutor && target.length === 0;
    // 服務標籤
    const selectedTags = tagsChanged ? tags : this.props.tags;
    values.tags = selectedTags;
    return (
      <Form>
        <Card>
          <div className="editServiceField">
            <p className="fieldName">圖片預覽</p>
            <div className="fieldContent">
              <CropUploader { ...CUploaderProps }>
                <img
                  src={ imageSrc }
                  onError={ (element) => {
                    element.target.src = defaultImg20;
                  } }
                  alt="預設圖"
                  crossOrigin="anonymous"
                />
              </CropUploader>
              <Checkbox
                className="removePreviewImage"
                name="isImageGettingRemove"
              >
                刪除圖片
              </Checkbox>
            </div>
          </div>
          <div className="editServiceField">
            <p className="fieldName">服務名稱</p>
            <div className="fieldContent">
              <Input name="serviceName" />
            </div>
            <ErrorMessage className="validate" name="serviceName" component="p" />
          </div>
          <div className="editServiceField">
            <p className="fieldName">服務類型</p>
            <div className="fieldContent">
              <TreeSelect
                name="gigCats"
                pathname={ this.props.history.location.pathname }
                cats={ selectedGig }
                onCatsChange={ this.updateGigCats }
                width="100%"
              />
            </div>
            <ErrorMessage className="validate" name="gigCats" component="p" />
          </div>
          <div className="editServiceField">
            <p className="fieldName">服務金額</p>
            <div className="fieldContent">
              <Select name="unit" className="unit">
                {unitData.map(data => (
                  <Select.Option value={ data.value } key={ data.value }>
                    {data.label}
                  </Select.Option>
                ))}
              </Select>
              <InputNumber
                name="price"
                className="price"
                min={ minPrice }
                value={ price }
                onChange={ (value) => {
                  setFieldValue('price', value);
                } }
              />
              <span>元起</span>
            </div>
            <ErrorMessage className="validate" name="price" component="p" />
          </div>
          <div className="editServiceField">
            <p className="fieldName">服務經驗</p>
            <div className="fieldContent">
              <Select name="experience">
                {gigExperienceData.map(data => (
                  <Select.Option value={ data.id } key={ data.id }>
                    {data.title}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="editServiceField">
            <p className="fieldName">服務地區</p>
            <div className="fieldContent">
              <Tooltip title={ areaDesc } trigger="hover">
                <Input
                  name="assignPlace"
                  onClick={ () => this.onAreaClick({ area: selectedAreas.des, areaNo: selectedAreas.no }) }
                  value={ areaDesc }
                />
              </Tooltip>
            </div>
            <ErrorMessage className="validate" name="assignPlace.no" component="p" />
            {!values.assignPlace.no && <p className="validate">請選擇指定地點</p>}
          </div>
          <div className="editServiceField">
            <p className="fieldName">服務方式</p>
            <div className="fieldContent">
              <Select name="serviceWay" mode="multiple">
                {methodData.map(data => (
                  <Select.Option value={ data.id } key={ data.id }>
                    {data.title}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <ErrorMessage className="validate" name="serviceWay" component="p" />
          </div>
          {
          isTutor && (
          <div className="editServiceField">
            <p className="fieldName">服務對象</p>
            <div className="fieldContent">
              <Select name="target" mode="multiple">
                {targetData.map(data => (
                  <Select.Option value={ data.id } key={ data.id }>
                    {data.title}
                  </Select.Option>
                ))}
              </Select>
            </div>
            { isTargetInvalid && <p className="validate">請選擇服務對象</p> }
          </div>
          )
        }

          <div className="editServiceField">
            <p className="fieldName">服務時段</p>
            <div className="fieldContent">
              <Select name="serviceInterval" mode="multiple">
                {timeSlotOptions.map(data => (
                  <Select.Option value={ data.value } key={ data.value }>
                    {data.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <ErrorMessage
              className="validate"
              name="serviceInterval"
              component="p"
            />
          </div>
          <div className="editServiceField">
            <p className="fieldName">服務內容描述</p>
            <div className="fieldContent">
              <Input.TextArea name="description" className="description" />
            </div>
          </div>
          <div className="editServiceField">
            <p className="fieldName">服務標籤</p>
            <div className="fieldContent">
              { selectedTags && <GigTags tags={ selectedTags } setTags={ this.updateTags } /> }
            </div>
          </div>
          <GigMemo basicId={ basicId } gigId={ gigId } pageType="gig" onUpdateGigmemo={ onUpdateGigmemo } />
        </Card>
        <div className="buttonField">
          <SubmitButton type="primary" disabled={ false }>送出</SubmitButton>
        </div>
        {/* <DebugFormik /> */}
      </Form>
    );
  }

  updateGigCats = ({ cats = [] }) => {
    this.setState({
      formGigCats: cats,
      catChanged: true,
    });
  }

  onAreaClick = (areaData) => {
    const selectedArea = areaData.areaNo.map((data) => { return { no: data }; });

    if (window.categoryPicker) {
      window.categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '服務地區',
        maxSelectedNumber: 15,
        selectedItems: selectedArea,
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        onSubmit: ({ selectedItems }) => {
          const areaNos = selectedItems.map(item => item.no);
          const areaDescs = selectedItems.map(item => item.des);

          this.setState({
            areaChanged: true,
            areaNo: areaNos,
            area: areaDescs,
          });
        },
      });
    }
  };

  updateTags = (tags) => {
    this.setState({
      tags: tags,
      tagsChanged: true,
    });
  }

  render() {
    const { initialData, onSubmitGigData, enableUpdateForm } = this.props;
    return (
      <Formik
        enableReinitialize={ enableUpdateForm }
        initialValues={ initialData }
        onSubmit={ async (data, { setSubmitting }) => {
          await onSubmitGigData(data, setSubmitting);
        } }
        validationSchema={ editService }
      >
        { this.renderForm }
      </Formik>
    );
  }
}

export default withRouter(EditServiceForm);
