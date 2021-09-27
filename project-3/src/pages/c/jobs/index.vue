<script>
import SearchBar from '~/components/searchBar';
import ResultList from '~/components/resultList';
import getStructuredData from '~/common/structuredData';

export default {
  components: {
    SearchBar,
    ResultList
  },
  async asyncData(context) {
    const {
      query: { areaNo, type, page },
      app
    } = context;
    const areaType =
      areaNo && typeof areaNo === 'string' ? areaNo.split(',') : areaNo;
    const areaArr = areaType && areaType.length > 0 ? areaType : [];
    const bodyParams =
      !type || type === '0'
        ? { areas: areaArr, offset: 0, limit: 15 }
        : { areas: areaArr, type, offset: 0, limit: 15 };
    try {
      const { data } = await app.$apis.findJob.postJobSearch(bodyParams);
      const total = data.page.total;
      return {
        dataList: data.data.jobs,
        total,
        rows: total,
        currentPage: page || 1
      };
    } catch (error) {
      console.log('error', error);
    }
  },
  data() {
    return {
      currentPage: 1,
      rows: 100,
      perPage: 15,
      dataList: null,
      total: 0,
      jobTypeOpt: '0',
      areas: [],
      offset: 0
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
      const firstNum = pageNum === 1 ? 0 : this.offset - 15;
      this.offset = pageNum > this.currentPage ? this.offset + 15 : firstNum;
      const isTypeLengthZero = this.jobTypeOpt === '0';
      const areaArr = this.areas && this.areas.length > 0 ? this.areas : [];
      const bodyParams = isTypeLengthZero
        ? { areas: areaArr, offset: this.offset, limit: 15 }
        : { areas: areaArr, type: this.jobTypeOpt, offset: this.offset, limit: 15 };
      const { data } = await this.$apis.findJob.postJobSearch(bodyParams);
      const total = data.page.total;
      this.dataList = data.data.jobs;
      this.total = total;
      this.rows = total;
      this.currentPage = pageNum;
      let queryParams = '';
      if (areaArr.length > 0 && this.jobTypeOpt > 0) {
        queryParams = `&${areaArr}&type=${this.jobTypeOpt}`
      } else if (areaArr.length === 0 && this.jobTypeOpt > 0) {
        queryParams = `&type=${this.jobTypeOpt}`
      }
      const getPageNum = pageNum === 1 ? `?page=1${queryParams}` : `?page=${pageNum}${queryParams}`;
      this.$router.push({ path: `/c/jobs${getPageNum}`, query: {} });
    },
    getChildListData(data) {
      const total = data.page.total;
      this.dataList = data.data.jobs;
      this.total = total;
      this.rows = total;
    }
  },
  head() {
    return {
      title: '找工作：50+人才門市店員就業機會｜104高年級人力銀行',
      meta: [
        {
          property: 'og:title',
          content: '找工作：50+人才門市店員就業機會｜104高年級人力銀行'
        },
        {
          property: 'og:description',
          content:
            '104專為50歲以上求職者精選門市店員職缺，提供中高齡朋友工作機會，有興趣成為門市店員人才，立即前往把握！'
        },
        {
          name: 'description',
          content:
            '104專為50歲以上求職者精選門市店員職缺，提供中高齡朋友工作機會，有興趣成為門市店員人才，立即前往把握！'
        },
        { property: 'og:site_name', content: '104高年級人力銀行' },
        {
          property: 'og:url',
          content: `${process.env.BROWSER_BASE_URL}/50talent${this.$route.path}`
        },
        {
          property: 'og:image',
          content: `${process.env.BROWSER_BASE_URL}/50talent/image/c_jobs_share_banner.jpeg`
        }
      ]
    };
  },
  jsonld() {
    return getStructuredData(this.$route.path);
  }
};
</script>
<template src="./template.html" />
<style lang="scss" src="./style.scss" />
