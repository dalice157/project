import { RSAA } from 'redux-api-middleware';
import jsonp from '../util/jsonp';


// const homeCollectionLink = 'https://blog.top.104.com.tw/wp-json/wp/v2/posts?per_page=3&tags=224';
const homeCollectionLinkSwitch = 'https://blog.top.104.com.tw/wp-json/wp/v2/posts';
const marketingCollectionLink = 'https://blog.top.104.com.tw/wp-json/wp/v2/posts?per_page=3&tags=222';
const announcementTitleLink = 'https://blog.top.104.com.tw//wp-json/wp/v2/pages?slug=announcement';

// const isSwitch = config.featureSwitch.VL9317 ? homeCollectionLinkSwitch : homeCollectionLink;

export const loadWordpressDataForHome = () => {
  return {
    [RSAA]: {
      endpoint: jsonp(homeCollectionLinkSwitch, response => callback(JSON.parse(response.data))),
      method: 'GET',
      headers: {
        'Content-Type': 'text/javascript; charset=utf-8'
      },
      types: [
        'REQUEST_WORDPRESS',
        'LOAD_WORDPRESS_DATA_FOR_HOME',
        'LOAD_WORDPRESS_ISSUE'
      ]
    }
  };
};

export const loadWordpressDataForMarketing = () => {
  return {
    [RSAA]: {
      endpoint: jsonp(marketingCollectionLink, response => callback(JSON.parse(response.data))),
      method: 'GET',
      headers: {
        'Content-Type': 'text/javascript; charset=utf-8'
      },
      types: [
        'REQUEST_WORDPRESS',
        'LOAD_WORDPRESS_DATA_FOR_MARKETING',
        'LOAD_WORDPRESS_ISSUE'
      ]
    }
  };
};

export const loadWordpressAnnouncementTitle = () => {
  return {
    [RSAA]: {
      endpoint: jsonp(announcementTitleLink, response => callback(JSON.parse(response.data))),
      method: 'GET',
      headers: {
        'Content-Type': 'text/javascript; charset=utf-8'
      },
      types: [
        'REQUEST_WORDPRESS',
        'LOAD_WORDPRESS_ANNOUNCEMENT_TITLE',
        'LOAD_WORDPRESS_ISSUE'
      ]
    }
  };
};
