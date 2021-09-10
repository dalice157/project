import { RSAA } from 'redux-api-middleware';

export const addGigFromCollection = (gigId) => {
  return {
    [RSAA]: {
      endpoint: '/api/favorite/add/' + gigId,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST_ADD_GIG_FROM_COLLECTION',
        'ADD_GIG_FROM_COLLECTION',
        'FAILURE'
      ]
    }
  };
};

export const removeGigFromCollection = (favoriteId) => {
  return {
    [RSAA]: {
      endpoint: '/api/favorite/delete/' + encodeURIComponent(favoriteId),
      method: 'DELETE',
      credentials: 'include',
      types: [
        'REQUEST_REMOVE_GIG_FROM_COLLECTION',
        'REMOVE_GIG_FROM_COLLECTION',
        'FAILURE'
      ]
    }
  };
};

// 取得指定頁面的Gigs
export const loadGigsCollection = (pageNumber) => {
  return {
    [RSAA]: {
      endpoint: '/api/favorite/show/' + pageNumber,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_GIGLIST_COLLECTION',
        'LOAD_GIGLIST_COLLECTION_SUCCESS',
        'LOAD_GIGLIST_COLLECTION_ISSUES'
      ]
    }
  };
};
