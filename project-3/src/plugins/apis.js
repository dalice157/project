import apis from '~/apis/index'
export default ({ $axios, store }, inject) => {
  $axios.onRequest((config) => {
    if (config.url.includes('/_api/center') ||
      config.url.includes('/_api/mixer') ||
      config.url.includes('/_api/consultant')
    ) {
      store.commit('increaseLoader')
    }
  })

  $axios.onResponse(({ config }) => {
    if (config.url.includes('/_api/center') ||
      config.url.includes('/_api/mixer') ||
      config.url.includes('/_api/consultant')
    ) {
      store.commit('decreaseLoader')
    }
  })

  $axios.onError((error) => {
    const { config } = error.response
    if (config.url.includes('/_api/center') ||
      config.url.includes('/_api/mixer') ||
      config.url.includes('/_api/consultant')
    ) {
      console.log('ERR!!!', config.url)
      store.commit('decreaseLoader')
    }
  })

  inject('apis', apis($axios))
}
