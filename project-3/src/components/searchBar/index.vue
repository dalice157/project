<script>
import AreaBox from '../areaBox';
import MainPaths from '~/common/LinkPath';
import { cJobsListPerPage } from '~/common/const'

export default {
  components: {
    AreaBox
  },
  data() {
    const { query } = this.$route;
    const hasQuery = JSON.stringify(query) === '{}';
    return {
      MainPaths,
      isMobileOpenSearchActive: false,
      jobTypeOpt: hasQuery || !query.type ? '0' : query.type,
      areas: {
        des: hasQuery || !query.areaDesc ? '地區' : query.areaDesc,
        no: hasQuery || !query.areaNo ? '' : query.areaNo.split(',')
      }
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
      if (isType && area.no && area.no.length > 0) {
        return {
          areaNo: this.areas.no || [],
          areaDesc: this.areas.des || '地區'
        };
      } else if (isType && !(area.no && area.no.length > 0)) {
        return {};
      } else {
        return {
          areaNo: this.areas.no || [],
          areaDesc: this.areas.des || [],
          type
        };
      }
    },

    async onclickSearch(type) {
      const isTypeLengthZero = type === '0';
      const getAreaArr =
        this.areas.no && typeof this.areas.no === 'string'
          ? this.areas.no.split(',')
          : this.areas.no;
      const areaArr = getAreaArr.length > 0 ? getAreaArr : [];
      const bodyParams = isTypeLengthZero
        ? { areas: areaArr, offset: 0, limit: cJobsListPerPage }
        : { areas: areaArr, type, offset: 0, limit: cJobsListPerPage };
      const queryParam = this.getQuery(isTypeLengthZero, this.areas, type);
      this.$router.push({
        path: '/c/jobs',
        query: queryParam
      });
      const { data } = await this.$apis.findJob.postJobSearch(bodyParams);
      this.$emit('emit-list-data', data);
    }
  }
};
</script>
<template src="./searchBar.html" />
<style lang="scss" src="./searchBar.scss" scoped />
