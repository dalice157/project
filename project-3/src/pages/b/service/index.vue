<script>
// vue-slick-carousel使用方式：https://gs-shop.github.io/vue-slick-carousel/#/api https://github.com/gs-shop/vue-slick-carousel
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
import Card from '../../../components/card';
import ArticleCard from '../../../components/articleCard';
import getStructuredData from '~/common/structuredData'

export default {
  name: 'FindTalent',
  components: {
    Card,
    ArticleCard,
    VueSlickCarousel
  },
  asyncData(context) {},
  data() {
    return {
      slickOptions: {
        centerMode: true,
        centerPadding: '0',
        variableWidth: true,
        arrows: false,
        dots: true,
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      },
      articleCard: {
        centerMode: true,
        centerPadding: '0',
        variableWidth: true,
        arrows: true,
        dots: false,
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    };
  },
  head() {
    return {
      title: '找人才：嚴選人才解決企業缺工問題｜104高年級人力銀行',
      meta: [
        { property: 'og:title', content: '找工作：50+人才門市店員就業機會｜104高年級人力銀行' },
        { property: 'og:description', content: '104為缺工產業雇主提供50歲人才任用方案，提供雇主短期免費人才試做，以及留任保證，人才通過留任才收費。' },
        { name: 'description', content: '104為缺工產業雇主提供50歲人才任用方案，提供雇主短期免費人才試做，以及留任保證，人才通過留任才收費。' },
        { property: 'og:site_name', content: '104高年級人力銀行' },
        { property: 'og:url', content: `${process.env.BROWSER_BASE_URL}/50talent${this.$route.path}` },
        { property: 'og:image', content: `${process.env.BROWSER_BASE_URL}/50talent/image/b_service_share_banner.jpeg` },
      ]
    }
  },
  jsonld () {
    return getStructuredData(this.$route.path)
  }
};
</script>
<template src="./template.html" />
<style lang="scss" src="./style.scss" scoped />
