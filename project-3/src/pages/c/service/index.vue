<script>
// vue-slick-carousel使用方式：https://gs-shop.github.io/vue-slick-carousel/#/api https://github.com/gs-shop/vue-slick-carousel
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import SearchBar from '../../../components/searchBar'
import ArticleCard from '../../../components/articleCard'
import getStructuredData from '~/common/structuredData'

export default {
  components: {
    VueSlickCarousel,
    SearchBar,
    ArticleCard
  },
  async asyncData (context) {
    console.log('PROCESS.env', process.env.BROWSER_BASE_URL)
    try {
      const data = await context.app.$apis.login.verify()
      return {
        data: data.data
      }
    } catch (e) {
      return { error: e }
    }
  },
  data () {
    return {
      process,
      data: {},
      error: '',
      articleCard: {
        centerMode: true,
        centerPadding: "0",
        variableWidth: true,
        arrows: true,
        dots: false,
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  },
  mounted () {
    console.log('[[data]]', this.data)
    this.$store.commit('getLoginInfo', this.data)
  },
  methods: {
    clickClose () {
      this.$refs.childComponent.closeSearchBar()
    }
  },
  head() {
    return {
      title: '找工作：職場計畫幫50+人才媒合工作｜104高年級人力銀行',
      meta: [
        { property: 'og:title', content: '找工作：職場計畫幫50+人才媒合工作｜104高年級人力銀行' },
        { property: 'og:description', content: '104嚴選人才職場計畫透過適切的培訓，邀請50歲以上的朋友們，用專業與敬業的就業心態，重返職場，為缺工產業雇主提供補充人力方案，幫高年級人才同時賺取收入與成就。' },
        { name: 'description', content: '104嚴選人才職場計畫透過適切的培訓，邀請50歲以上的朋友們，用專業與敬業的就業心態，重返職場，為缺工產業雇主提供補充人力方案，幫高年級人才同時賺取收入與成就。' },
        { property: 'og:site_name', content: '104高年級人力銀行' },
        { property: 'og:url', content: `${process.env.BROWSER_BASE_URL}/50talent${this.$route.path}` },
        { property: 'og:image', content: `${process.env.BROWSER_BASE_URL}/50talent/image/c_service_share_banner.jpeg` },
      ]
    }
  },
  jsonld () {
    return getStructuredData(this.$route.path)
  }
}
</script>
<template src="./template.html" />
<style lang="scss" src="./style.scss" />
