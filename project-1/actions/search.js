import { RSAA } from 'redux-api-middleware';

export const addGigFromGigSearch = (gigId) => {
  return {
    [RSAA]: {
      endpoint: '/api/favorite/add/' + gigId,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST_ADD_GIG_FROM_GIGSEARCH',
        'ADD_GIG_FROM_GIGSEARCH',
        'FAILURE'
      ]
    }
  };
};

export const removeGigFromGigSearch = (favoriteId) => {
  return {
    [RSAA]: {
      endpoint: '/api/favorite/delete/' + encodeURIComponent(favoriteId),
      method: 'DELETE',
      credentials: 'include',
      types: [
        'REQUEST_REMOVE_GIG_FROM_GIGSEARCH',
        'REMOVE_GIG_FROM_GIGSEARCH',
        'FAILURE'
      ]
    }
  };
};
