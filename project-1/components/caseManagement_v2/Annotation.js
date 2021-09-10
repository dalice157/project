import React, { Component } from 'react';
import styles from './Annotation.scss';
import annotation1 from '../../img/case/annotation1.svg';

class Annotation extends Component {
  render() {
    const { isMobile, img } = this.props;
    const isImg = img || annotation1;
    if (isMobile) {
      return (
        <div className={styles.wrap}>
          {this.props.children}
        </div>
      );
    } else {
      return (
        <div className={styles.wrap}>
          <img className={styles.img} src={isImg} alt="註解" />
          {this.props.children}
        </div>
      );
    }
  }
}

export default Annotation;
