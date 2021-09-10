import React, { Component } from 'react';
import { ChevronRight } from '@material-ui/icons';
import styles from './ArticleCard.scss';

class ArticleCard extends Component {
  render() {
    const {
      title, img, category, excerpt, link
    } = this.props.data;
    return (
      <div className={styles.wrap}>
        <div className={styles.img}>
          <img src={img} alt={title} />
        </div>
        <div className={styles.category}>/ { category } /</div>
        <h3 className={styles.title}>{ title }</h3>
        <div className={styles.desc}>
          { excerpt }
        </div>
        <div className={styles.link}>
          <a href={link} target="_blank">繼續閱讀 <ChevronRight /></a>
        </div>
        <div className={styles.line} />
      </div>
    );
  }
}

export default ArticleCard;
