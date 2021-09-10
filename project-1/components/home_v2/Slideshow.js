import React from 'react';
import Slider from 'react-slick';
import styles from './Slideshow.scss';

const Slideshow = () => {
  const settings = {
    autoplay: true,
    infinite: true,
    arrows: false,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className={styles.container}>
      <Slider {...settings}>
        <div className={`${styles.bg} ${styles.bg1}`}>
          <div className={`${styles.wrap} ${styles.hideText}`}>
            免費刊登 找接案人才 家教老師 <br />24小時內找到合適人選
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Slideshow;
