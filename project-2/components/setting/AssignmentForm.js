import React, { Fragment } from 'react';
import { Form, Checkbox, SubmitButton } from "formik-antd";
import { Formik } from "formik";


import { clerkSlotData } from "../../config/selectData.js"
import labels from "./Label.js";

const Default = ({onSubmit, list, initialValues}) => (
  <Fragment>
    <h2>專員分派設定</h2>
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}    
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {          
          onSubmit(values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <table>
              <thead>
                <tr><td class="ant-descriptions-title">分派範圍</td><td class="ant-descriptions-title">負責專員</td></tr>
              </thead>
              <tbody>
                  {                   
                  list.map((item, index) => (
                  <tr key={item.type}  class="ant-descriptions-row">
                      <td class="ant-descriptions-item-label">{labels[item.type]}</td>
                      <td class="ant-descriptions-item-content">
                        <Checkbox name={`assignments[${index}].slot0`}>{clerkSlotData[0].name}</Checkbox>
                        <Checkbox name={`assignments[${index}].slot1`}>{clerkSlotData[1].name}</Checkbox>
                        <Checkbox name={`assignments[${index}].slot2`}>{clerkSlotData[2].name}</Checkbox>
                        <Checkbox name={`assignments[${index}].slot3`}>{clerkSlotData[3].name}</Checkbox>
                        ｜<Checkbox name={`assignments[${index}].robotSwitch`}>機器人先審</Checkbox>
                      </td>
                  </tr>
                  ))
                  }
                  
              </tbody>
          </table>          
          <br />
          <SubmitButton >送出</SubmitButton>
        </Form>
      )}
    </Formik>
  </Fragment>
);

export default Default;