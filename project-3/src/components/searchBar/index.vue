<script>
import AreaBox from "../areaBox";
export default {
  components: {
    AreaBox
  },
  data() {
    return {
      isMobileOpenSearchActive: false,
      jobTypeOpt: null,
      areas: null
    };
  },
  methods: {
    isMobileOpenSearch() {
      this.isMobileOpenSearchActive = !this.isMobileOpenSearchActive;
    },
    closeSearchBar() {
      this.isMobileOpenSearchActive = false;
    },
    getAreas(val) {
      this.areas = val;
    },
    onclickSearch(areas, type) {
      const areaArr = areas ? areas.split(",") : null;
      const typeVal = type;
      this.$apis.findJob.postJobSearch({
        areas: areaArr,
        type: type,
        offset: 1,
        limit: 15
      });
    }
  }
};
</script>
<template src="./searchBar.html" />
<style lang="scss" src="./searchBar.scss" scoped />
