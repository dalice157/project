import { RSAA } from 'redux-api-middleware';

export const loadDemandWindowList = () => {
  return {
    [RSAA]: {
      endpoint: '/api/demandWindow/get',
      method: 'GET',
      types: [
        'REQUEST_DEMAND_WINDOW',
        'LOAD_DEMAND_WINDOW_LIST',
        'LOAD_DEMAND_WINDOW_ISSUE'
      ]
    }
  };
};
