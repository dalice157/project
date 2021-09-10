import React, { Fragment } from 'react';
/**
 * /n轉換<br/>
 */
const CreateMarkup = ({ text }) => {
  return (text.split('\n').map((item, key) => {
    return (
      <Fragment key={key}>
        { item }
        <br />
      </Fragment>
    );
  }));
};

export default CreateMarkup;
