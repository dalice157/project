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
    async onclickSearch(type) {
      const isTypeLengthZero = type === "0";
      const areaArr =
        this.areas && this.areas.length > 0 ? this.areas.split(",") : [];
      const bodyParams = isTypeLengthZero
        ? { areas: areaArr, offset: 1, limit: 10 }
        : { areas: areaArr, type: type, offset: 1, limit: 10 };
      const path = $nuxt.$route.path;
      const bodyParamData = { area: areaArr, type: type };
      if (path === "/list") {
        this.$router.push({ path: "/list", query: {} });
        const { data } = await this.$apis.findJob.postJobSearch(bodyParams);
        console.log("bodyParams:", bodyParams);
        console.log("child data:", data);
        this.$emit("emit-list-data", data);
        this.$emit("emit-body-params", bodyParamData);
        return false;
      }
      if (isTypeLengthZero && this.areas && this.areas.length > 0) {
        this.$router.push({
          path: "/list",
          query: {}
        });
      } else if (isTypeLengthZero && !(this.areas && this.areas.length > 0)) {
        this.$router.push({
          path: "/list",
          query: { area: this.areas || [] }
        });
      } else {
        this.$router.push({
          path: "/list",
          query: { area: this.areas || [], type: type }
        });
      }
      return false;
    }
  }
};
</script>
<template src="./searchBar.html" />
<style lang="scss" src="./searchBar.scss" scoped />
