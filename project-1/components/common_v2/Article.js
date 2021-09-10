import React from 'react';
import { BrowserView } from 'react-device-detect';
import config from '../../config/config';
import Button from '../ui/button';
import arrow from '../../img/index/arrow.png';
import styles from './Article.scss';

const Article = ({
  articles, type
}) => {
  const isJoinPage = type === 'join' ? styles.join : '';
  return (
    <div className={`${styles.articles} ${isJoinPage}`}>
      <h2 className={`${styles.alignCenter} ${styles.mgBM}`}>高手專欄</h2>
      <div className={styles.articleList}>
        { articles.map((article) => {
          return (
            <div
              key={article.title}
              className={styles.article}
              onClick={() => open(article.link, '_blank')}
            >
              <img
                className={styles.mgBS}
                src={article.imgLink}
                alt={article.title}
              />
              <h3 className={`${styles.advanTitle} ${styles.mgBS}`}>
                <span className={styles.category}>{ article.category }</span>
                <a className={styles.title} href={article.link} target="_blank">{ article.title }</a>
              </h3>
              <p className={styles.description}>
                { article.excerpt }
                <a href={article.link} target="_blank">繼續閱讀</a>
              </p>
            </div>
          );
        }) }
      </div>
      {
      type === 'home' && (
      <BrowserView>
        <a
          className={`${styles.more}`}
          href={`${config.contentSite.domain}/`}
          target="_blank"
        >
          <p className={styles.moreTitle}>看更多文章</p>
          <img className={styles.arrow} src={arrow} alt="arrow" />
        </a>
      </BrowserView>
      )
    }
      {
      type === 'join' && (
      <div className={styles.alignCenter}>
        <Button
          type="danger"
          href={`${config.contentSite.domain}/`}
          target="_blank"
          dataGtmMarketing="更多文章"
        >
          更多專欄文章
        </Button>
      </div>
      )
    }
    </div>
  );
};

export default Article;
