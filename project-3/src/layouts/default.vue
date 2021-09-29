<template>
  <div>
    <loading
      :active="$store.state.loader > 0"
      :can-cancel="false"
      :is-full-page="true"
    />
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import Header from '../components/header';
import Footer from '../components/footer';
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  components: {
    Header,
    Footer,
    Loading
  }
};
</script>
