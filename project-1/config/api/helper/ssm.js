'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-1'});
const ssm = new AWS.SSM();

/**
 * get config from paramter store
 * @param {*} name Parameter Store - Parameter Name
 */
const getParameter = async (name) => {
  console.log(`Getting secret for ${name}`);
  const params = {
    Name: name,
  };

  const result = await ssm.getParameter(params).promise();
  return result; // Parameter.Value
};

/**
 * get credential from paramter store
 * - WARNING: Please DO NOT log the return value
 * @param {*} secretName Parameter Store - Parameter Name
 */
const decryptSecret = async (secretName) => {
  console.log(`Getting secret for ${secretName}`);
  const params = {
    Name: secretName,
    WithDecryption: true
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports = {
  getParameter,
  decryptSecret,
};
