import { categories } from '../config/wordpress';

const contentIndex = 0;
const initState = {
  homeArticles: [
    {
      title: '3個技巧，教你輕鬆找到適合的高手',
      category: '高手技巧',
      imgLink: 'https://blog.top.104.com.tw/wp-content/uploads/2019/07/bulb-drawing-with-crumpled-paper-as-light_23-2147965737.jpg',
      link: 'http://blog.top.104.com.tw/?p=317',
      excerpt: '俗話說隔行如隔山，在面對外包需求時，無論是老闆、主管還是專案負責人，難免有不熟悉的部分，可能無法在快...'
    },
    {
      title: '家教老師怎麼找最適合',
      category: '高手技巧',
      imgLink: 'https://blog.top.104.com.tw/wp-content/uploads/2019/07/img_01.png',
      link: 'http://blog.top.104.com.tw/?p=104',
      excerpt: '在找家教老師之前，首先要先自我評估，了解孩子的需求、程度，以及預期的上課方式。而家教老師的鐘點費，建...'
    },
    {
      title: '網站架設和程式開發設計報價行情參考',
      category: '市場趨勢',
      imgLink: 'https://blog.top.104.com.tw/wp-content/uploads/2019/07/Informatique-472x355.png',
      link: 'http://blog.top.104.com.tw/?p=280',
      excerpt: '你知道做一個有基本的網頁設計，可以換首頁圖片和發表文章，再加上購物車和線上付款功能的網站需要花多少錢...'
    }
  ],
  marketingArticles: [
    {
      title: '書籍排版、封面內頁設計報價參考',
      category: '市場趨勢',
      imgLink: 'https://blog.top.104.com.tw/wp-content/uploads/2019/11/minimal-work-space-creative-flat-lay-photo-workspace-desk-with-sketchbook-wooden-pencil-copy-space-white-background-top-view-flat-lay-photography_1253-978.jpg',
      link: 'https://blog.top.104.com.tw/?p=2455',
      excerpt: '創作者們孵化出的心血，無論是小說、散文、雜誌、插畫還是漫畫，良好的排版和封面設計，可以為作品大大加分...'
    },
    {
      title: '案主如何找到我？提高接案機會的小撇步',
      category: '高手技巧',
      imgLink: 'https://blog.top.104.com.tw/wp-content/uploads/2019/10/search-concept-landing-page_52683-20158.jpg',
      link: 'http://blog.top.104.com.tw/?p=1900',
      excerpt: '案主將透過瀏覽高手服務列表，進一步篩選出需要的服務，您也可以在這裡找到自己上架的項目。'
    },
    {
      title: '名片及LOGO設計報價參考與注意事項',
      category: '市場趨勢',
      imgLink: 'https://blog.top.104.com.tw/wp-content/uploads/2019/07/multiple-lightbulb-designs_53876-16171.jpg',
      link: 'http://blog.top.104.com.tw/?p=673',
      excerpt: '無論是新手還是經驗豐富的接案族，最常碰上的就是報價的問題，該如何報價，開出的價格是否合理，是否釐清雙...'
    }
  ],
  announcement: {
    title: '無最新公告',
    isPublished: false,
    link: 'https://blog.top.104.com.tw/'
  }
};

const wordpressReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_WORDPRESS_DATA_FOR_HOME': {
      const wordpressData = action.payload;
      const articles = wordpressData.map((article) => {
        const domParser = new DOMParser();
        const contentDOM = article.content.rendered;
        const contentHTMLColletion = domParser.parseFromString(contentDOM, 'text/html');
        let excerpt = contentHTMLColletion.getElementsByTagName('p')[contentIndex].textContent;

        return {
          title: article.title.rendered,
          category: categories[article.categories[contentIndex]],
          imgLink: article.jetpack_featured_media_url,
          link: article.guid.rendered,
          excerpt: excerpt
        };
      });

      return {
        ...state,
        homeArticles: articles
      };
    }
    case 'LOAD_WORDPRESS_DATA_FOR_MARKETING': {
      const wordpressData = action.payload;
      const articles = wordpressData.map((article) => {
        const domParser = new DOMParser();
        const contentDOM = article.content.rendered;
        const contentHTMLColletion = domParser.parseFromString(contentDOM, 'text/html');
        let excerpt = contentHTMLColletion.getElementsByTagName('p')[contentIndex].textContent;

        if (excerpt.length >= 50) {
          excerpt = excerpt.substring(0, 50) + '...';
        }

        return {
          title: article.title.rendered,
          category: categories[article.categories[contentIndex]],
          imgLink: article.jetpack_featured_media_url,
          link: article.guid.rendered,
          excerpt: excerpt,
          publishedDate: article.date,
          modifiedDate: article.modified,
        };
      });

      return {
        ...state,
        marketingArticles: articles
      };
    }
    case 'LOAD_WORDPRESS_ANNOUNCEMENT_TITLE': {
      const data = action.payload[0];
      if (data == undefined) {
        return state;
      } else {
        const title = data.title.rendered;
        const link = data.guid.rendered;
        return {
          ...state,
          announcement: {
            title: title,
            isPublished: true,
            link: link
          }
        };
      }
    }
    default: {
      return state;
    }
  }
};

export default wordpressReducer;
