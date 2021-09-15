<script>
// vue-slick-carousel使用方式：https://gs-shop.github.io/vue-slick-carousel/#/api https://github.com/gs-shop/vue-slick-carousel
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import Card from "../../components/card";
import HrCard from "../../components/hrCard";

export default {
  name: "findTalent",
  components: {
    Card,
    HrCard,
    VueSlickCarousel
  },
  async asyncData(context) {
    try {
      const { data } = await context.app.$apis.findJob.postJobSearch({
        areas: ["6001001002"],
        type: "1",
        offset: 1,
        limit: 15
      });
      console.log("XXX", data);
    } catch (error) {
      console.log("error", error);
    }
  },
  data() {
    return {
      slickOptions: {
        arrows: false,
        dots: true,
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      },
      hrOptions: {
        arrows: true,
        dots: false,
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    };
  }
};
</script>
<template src="./findTalent.html" />
<style lang="scss" src="./findTalent.scss" scoped />
