import Joi from '@hapi/joi';

// take a joi schema and create a validator function for redux form
export default function createValidator(schema) {
  return (values) => {
    const result = Joi.validate(values, schema, { abortEarly: false });
    if (result.error === null) {
      return {};
    }

    const errors = result.error.details.reduce((all, cur) => {
      const allErrors = Object.assign({}, all);
      const path = cur.path[cur.path.length - 1];
      const message = cur.message;

      if (Object.prototype.hasOwnProperty.call(allErrors, path)) {
        console.log('沒顯示的訊息: ', message);
        // allErrors[path] += message;
      } else {
        console.log(message);
        allErrors[path] = message;
      }
      return allErrors;
    }, {});

    return errors;
  };
}
