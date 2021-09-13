<script>
import Card from "../../components/findTalent/card";
import HrCard from "../../components/findTalent/hrCard";

export default {
  name: "findTalent",
  components: {
    Card,
    HrCard,
    VueSlickCarousel
  },
  data() {
    return {
      settings: {
        arrows: true,
        dots: true,
        focusOnSelect: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        touchThreshold: 5
      }
    };
  }
};
</script>
<template src="./findTalent.html" />
<style lang="scss" src="./findTalent.scss" scoped />
