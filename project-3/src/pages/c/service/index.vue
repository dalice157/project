<script>
// vue-slick-carousel使用方式：https://gs-shop.github.io/vue-slick-carousel/#/api https://github.com/gs-shop/vue-slick-carousel
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import SearchBar from "../../../components/searchBar";
import ArticleCard from "../../../components/articleCard";
export default {
  components: {
    VueSlickCarousel,
    SearchBar,
    ArticleCard
  },
  async asyncData(context) {
    try {
      const data = await context.app.$apis.login.verify();
      return {
        data: data.data
      };
    } catch (e) {
      return { error: e };
    }
  },
  data() {
    return {
      process,
      data: {},
      error: "",
      articleCard: {
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
  mounted() {
    console.log("[[data]]", this.data);
    this.$store.commit("getLoginInfo", this.data);
  },
  methods: {
    clickClose() {
      this.$refs.childComponent.closeSearchBar();
    }
  }
};
</script>
<template src="./template.html" />
<style lang="scss" src="./style.scss" />
