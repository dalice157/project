import { RSAA } from 'redux-api-middleware';


export const payFormSubmit = (payData) => {
  return {
    [RSAA]: {
      endpoint: '/api/basic/promise',
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payData),
      types: [
        'REQUEST',
        'PAY_FORM_SUBMIT',
        'FAILURE'
      ]
    }
  };
};
