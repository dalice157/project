import { PAGE } from '../config/constant';

export function generateLinkedData(pageType, payload) {
  // 結構化資料的運作方式: https://developers.google.com/search/docs/guides/intro-structured-data
  const {
    title, description, link, imgLink, gigDetail, blockInfo
  } = payload;

  const PAGE_CATEGORIES = {
    service: 'Product',
    root: 'WebSite',
    default: 'Website',
  };

  const pageCategory = PAGE_CATEGORIES[pageType] || PAGE_CATEGORIES.default;
  let data = {
    '@context': 'http://schema.org/',
    '@type': pageCategory,
    name: title,
    brand: title,
    image: imgLink,
    description: description,
    url: link,
  };
  switch (pageType) {
    case PAGE.service: {
      const gigId = gigDetail && gigDetail.focusGig.gigId;
      const price = gigDetail && gigDetail.focusGig.body.price;
      const reviewAvgScore = blockInfo && blockInfo.reviewAvgScore;
      const dealCount = blockInfo && blockInfo.dealCount;
      const topperName = blockInfo && blockInfo.topperName;
      if (price === null || reviewAvgScore === '0') return;
      data = {
        ...data,
        logo: imgLink,
        sku: 1,
        mpn: gigId,
        // https://schema.org/AggregateRating
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: reviewAvgScore,
          ratingCount: dealCount,
        },
        offers: {
          '@type': 'Offer',
          availability: 'http://schema.org/InStock',
          price: price,
          priceCurrency: 'TWD',
          url: link,
        },
        review: [
          {
            '@type': 'Review',
            author: topperName,
            description: description,
            name: title,
            reviewRating: {
              '@type': 'Rating',
              bestRating: '5',
              ratingValue: reviewAvgScore,
              worstRating: '1'
            },
          }
        ],
      };
      break;
    }
    default: {
      break;
    }
  }
  return JSON.stringify(data);
}
