<script>
// vue-slick-carousel使用方式：https://gs-shop.github.io/vue-slick-carousel/#/api https://github.com/gs-shop/vue-slick-carousel
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import SearchBar from "../components/searchBar";
import ArticleCard from "../components/articleCard";
export default {
  components: {
    VueSlickCarousel,
    SearchBar,
    ArticleCard
  },
  async asyncData(context) {
    try {
      const data = await context.app.$apis.login.verify();
      console.log("data:", data);
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
      settings: {
        arrows: true,
        dots: true
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
<template src="./index.html" />
<style lang="scss" src="./index.scss" />
