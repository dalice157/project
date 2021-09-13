<script>
export default {
  async asyncData(context) {
    try {
      const data = await context.app.$apis.login.verify()
      return {
        data: data.data
      }
    } catch (e) {
      return { error: e }
    }
  },
  data() {
    return {
      isMobileOpenSearchActive: false,
      process,
      data: {},
      error: '',
    }
  },
  mounted() {
    console.log('[[data]]', this.data)
    this.$store.commit('getLoginInfo', this.data)
  },
  methods: {
    isMobileOpenSearch() {
      this.isMobileOpenSearchActive = !this.isMobileOpenSearchActive;
    },
    closeSearchBar() {
      this.isMobileOpenSearchActive = !this.isMobileOpenSearchActive;
    },
  },
}
</script>
<template src="./index.html" />
<style lang="scss" src="./index.scss" />