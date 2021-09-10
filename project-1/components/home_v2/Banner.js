import React, { Component } from 'react';
import styles from './Banner.scss';

export default class Banner extends Component {
  render() {
    return (
      <div className={styles.banner}>
        <a target="_blank" href="/join" title="接案最低只要$399">
          <span className={styles.hideText} />
        </a>
      </div>
    );
  }
}
