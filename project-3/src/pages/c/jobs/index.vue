<script>
import SearchBar from '~/components/searchBar';
import ResultList from '~/components/resultList';
import getStructuredData from '~/common/structuredData';
import MainPaths from '~/common/LinkPath'
import { cJobsListPerPage } from '~/common/const'

const LIMIT = cJobsListPerPage

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
    const offsetNum = LIMIT * (page - 1);
    const bodyParams =
      !type || type === '0'
        ? { areas: areaArr, offset: offsetNum, limit: LIMIT }
        : { areas: areaArr, type, offset: offsetNum, limit: LIMIT };
    try {
      const { data } = await app.$apis.findJob.postJobSearch(bodyParams);
      const total = data.page.total;
      return {
        dataList: data.data.jobs,
        total,
        rows: total,
        offset: data.page.offset,
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
      perPage: LIMIT,
      dataList: null,
      total: 0,
      jobTypeOpt: '0',
      areas: [],
      offset: 0
    };
  },
  watch: {
    '$route.query'() {
      window.scrollTo(0, 0)
      this.postJobSearch()
    }
  },
  methods: {
    clickClose() {
      this.$refs.childComponent.closeSearchBar();
    },
    async postJobSearch() {
      const { areaNo, type, page } = this.$route.query;
      const areaType =
        areaNo && typeof areaNo === 'string' ? areaNo.split(',') : areaNo;
      const areaArr = areaType && areaType.length > 0 ? areaType : [];
      const offsetNum = LIMIT * (page - 1);
      const bodyParams =
        !type || type === '0'
          ? { areas: areaArr, offset: offsetNum, limit: LIMIT }
          : { areas: areaArr, type, offset: offsetNum, limit: LIMIT };
      const { data } = await this.$apis.findJob.postJobSearch(bodyParams);
      const total = data.page.total;
      this.dataList = data.data.jobs;
      this.total = total;
      this.rows = total;
      this.offset = data.page.offset
      this.currentPage = page || 1
    },
    handlePageChange(pageNum) {
      console.log('pageNum:', pageNum);

      this.$router.push({
        path: MainPaths.cJobs,
        query: {
          ...this.$route.query,
          page: pageNum,
        }
      });
    },
    getChildListData(data) {
      window.scrollTo(0, 0)
      const total = data.page.total;
      this.dataList = data.data.jobs;
      this.total = total;
      this.rows = total;
      this.currentPage = 1;
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
