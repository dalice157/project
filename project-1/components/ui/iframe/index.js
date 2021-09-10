import React from 'react';


const Iframe = ({ title, src }) => {
  return (
    <iframe title={title} src={src} frameBorder="0" />
  );
};


export default Iframe;
