import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { loadWordpressDataForHome } from '../../actions/wordpress';
import decoLeft from '../../img/common_v2/white-deco-left.svg';
import decoRight from '../../img/common_v2/white-deco-right.svg';
import ArticleCard from '../../components/home_v2/ArticleCard';
import styles from './Article.scss';

class Article extends Component {
  componentDidMount() {
    this.props.initWordpress();
  }

  render() {
    const { articles } = this.props;
    return (
      <div className={styles.articles}>
        <h2 className={styles.title}>
          <img src={decoLeft} alt="標題" /> 高手專欄 <img src={decoRight} alt="標題" />
        </h2>
        <div className={styles.articleList}>
          <Slider dots={false} slidesToShow={3} slidesToScroll={1}>
            { articles.map((article) => {
              const data = {
                title: article.title,
                img: article.imgLink,
                category: article.category,
                excerpt: article.excerpt,
                link: article.link
              };
              return (
                <ArticleCard key={data.title} data={data} />
              );
            }) }
          </Slider>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    articles: state.wordpress.homeArticles,
  };
};

const mapDispatchToProps = { initWordpress: loadWordpressDataForHome };

export default connect(mapStateToProps, mapDispatchToProps)(Article);
