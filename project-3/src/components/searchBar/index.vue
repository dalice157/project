<script>
import AreaBox from "../areaBox";
export default {
  components: {
    AreaBox
  },
  data() {
    return {
      isMobileOpenSearchActive: false,
      jobTypeOpt: "0",
      areas: []
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
    getQuery(isType, area, type) {
      if (isType && area && area > 0) {
        return { area: this.areas || [] };
      } else if (isType && !(area && area > 0)) {
        return {};
      } else {
        return { area: this.areas || [], type: type };
      }
    },

    async onclickSearch(type) {
      const isTypeLengthZero = type === "0";
      const areaArr =
        this.areas && this.areas.length > 0 ? this.areas.split(",") : [];
      const bodyParams = isTypeLengthZero
        ? { areas: areaArr, offset: 1, limit: 15 }
        : { areas: areaArr, type: type, offset: 1, limit: 15 };
      const path = $nuxt.$route.path;
      const bodyParamData = { area: areaArr, type: type };
      const queryParam = this.getQuery(isTypeLengthZero, this.areas, type);
      this.$router.push({
        path: "/c/jobs",
        query: queryParam
      });
      const { data } = await this.$apis.findJob.postJobSearch(bodyParams);
      this.$emit("emit-list-data", data);
      this.$emit("emit-body-params", bodyParamData);
      return false;
    }
  }
};
</script>
<template src="./searchBar.html" />
<style lang="scss" src="./searchBar.scss" scoped />
