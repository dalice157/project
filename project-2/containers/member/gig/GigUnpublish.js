import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import {
  Form, Select, SubmitButton, Input
} from 'formik-antd';
import { Formik, Field } from 'formik';
import { unpublish } from '../../../config/selectData.js';
import './gig.scss';

const Option = Select.Option;
const { TextArea } = Input;

class GigUnpublish extends Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  checkCancelPublish = async () => {
    const action = await this.props.checkCancelGigPublish(this.props.basicId);
    if (action.payload) {
      this.showModal();
    } else {
      Modal.warning({
        title: '無法取消刊登',
        content: '此高手有違規紀錄或正在合作中的案件，無法取消刊登。',
      });
    }
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handelSubmit = async (values, { setSubmitting }) => {
    const { basicId, cancelGigPublish } = this.props;
    const { type, memo } = values;
    const offContent = type === 200 ? memo : unpublish.find(item => item.value === type).label;
    this.setState({
      visible: false,
    });
    await cancelGigPublish(basicId, offContent, type);
    window.location.reload();
    setSubmitting(false);
  }

  render() {
    const { disabled } = this.props;
    const initVal = {
      type: 200
    };
    return (
      <>
        <Button type="primary" onClick={ this.checkCancelPublish } disabled={ disabled }>取消刊登</Button>
        <Modal
          title="取消刊登理由"
          visible={ this.state.visible }
          onCancel={ this.handleCancel }
          footer={ null }
        >

          <Formik
            initialValues={ initVal }
            // validationSchema={ formSchema }
            onSubmit={ this.handelSubmit }
          >
            { props => (
              <Form>
                <Select name="type" style={ { marginBottom: 10 } }>
                  {
                    unpublish.map(item => (
                      <Option key={ item.value } value={ item.value }>
                        {item.label}
                      </Option>
                    ))}
                </Select>
                {
                  props.values.type === 200
                    ? (
                      <>
                        <p>其他理由說明：</p>
                        <Field name="memo">
                          { ({ field }) => (
                            <TextArea { ...field } style={ { width: 580, height: 100 } } />
                          ) }
                        </Field>
                      </>
                    ) : <></>
                }

                <div className="btnWrap">
                  <Button onClick={ this.handleCancel }>取消</Button>
                  <SubmitButton>送出</SubmitButton>
                </div>
              </Form>
            ) }
          </Formik>
        </Modal>
      </>
    );
  }
}

export default GigUnpublish;
