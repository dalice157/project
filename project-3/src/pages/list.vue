<script>
import SearchBar from "../components/searchBar";
import ResultList from "../components/resultList";
export default {
  components: {
    SearchBar,
    ResultList
  },
  async asyncData(context) {
    const {
      query: { area, type },
      app,
      route
    } = context;
    const areaArr =
      Object.keys(route.query).length === 0 ? null : area.split(",");
    try {
      const { data } = await app.$apis.findJob.postJobSearch({
        areas: areaArr,
        type: type,
        offset: 1,
        limit: 15
      });
      console.log("XXX", data);
      return {
        dataList: data
      };
    } catch (error) {
      console.log("error", error);
    }
  },
  data() {
    return {
      rows: 100,
      currentPage: 1,
      dataList: null
    };
  },
  methods: {
    clickClose() {
      this.$refs.childComponent.closeSearchBar();
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page=${pageNum}`;
    }
  },
  mounted() {}
};
</script>
<template src="./list.html" />
<style lang="scss" src="./list.scss" />
