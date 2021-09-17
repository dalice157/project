<script>
import SearchBar from "../../../components/searchBar";
import ResultList from "../../../components/resultList";
export default {
  components: {
    SearchBar,
    ResultList
  },
  async asyncData(context) {
    const {
      query: { area, type, page },
      app
    } = context;
    console.log("context:", context);
    const areaArr = area && area.length > 0 ? area.split(",") : [];
    const bodyParams =
      type === "0"
        ? { areas: areaArr, offset: 1, limit: 15 }
        : { areas: areaArr, type: type, offset: 1, limit: 15 };
    try {
      const { data } = await app.$apis.findJob.postJobSearch(bodyParams);
      const total = data.page.total - 1;
      return {
        dataList: data.data.jobs,
        total: total,
        rows: total,
        currentPage: page || 1
      };
    } catch (error) {
      console.log("error", error);
    }
  },
  data() {
    return {
      currentPage: 1,
      rows: 100,
      perPage: 15,
      dataList: null,
      total: 0,
      jobTypeOpt: "0",
      areas: [],
      offset: 1
    };
  },
  methods: {
    clickClose() {
      this.$refs.childComponent.closeSearchBar();
    },
    getBodyParamData(data) {
      this.areas = data.area;
      this.jobTypeOpt = data.type;
    },
    async handlePageChange(pageNum) {
      const firstNum = pageNum === 1 ? 1 : this.offset - 15;
      this.offset = pageNum > this.currentPage ? this.offset + 15 : firstNum;
      const isTypeLengthZero = this.jobTypeOpt === "0";
      const areaArr = this.areas && this.areas.length > 0 ? this.areas : [];
      const bodyParams = isTypeLengthZero
        ? { areas: areaArr, offset: this.offset, limit: 15 }
        : { areas: areaArr, type: type, offset: this.offset, limit: 15 };
      const { data } = await this.$apis.findJob.postJobSearch(bodyParams);
      const total = data.page.total - 1;
      this.dataList = data.data.jobs;
      this.total = total;
      this.rows = total;
      this.currentPage = pageNum;
      const getPageNum = pageNum === 1 ? "?page=1" : `?page=${pageNum}`;
      this.$router.push({ path: `/c/jobs${getPageNum}`, query: {} });
    },
    getChildListData(data) {
      const total = data.page.total - 1;
      this.dataList = data.data.jobs;
      this.total = total;
      this.rows = total;
    }
  },
  mounted() {}
};
</script>
<template src="./template.html" />
<style lang="scss" src="./style.scss" />
