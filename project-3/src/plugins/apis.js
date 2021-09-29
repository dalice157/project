import apis from '~/apis/index'
export default ({ $axios, store }, inject) => {
  $axios.onRequest((config) => {
    if (config.url.includes('/_api')) {
      store.commit('increaseLoader')
    }
  })

  $axios.onResponse(({ config }) => {
    if (config.url.includes('/_api')) {
      store.commit('decreaseLoader')
    }
  })

  $axios.onError((error) => {
    const { config } = error.response
    if (config.url.includes('/_api')) {
      console.log('ERR!!!', config.url)
      store.commit('decreaseLoader')
    }
  })

  inject('apis', apis($axios))
}
