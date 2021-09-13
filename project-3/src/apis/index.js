import loginAPI from './loginAPI'

export default $axios => ({
  login: loginAPI($axios),
})
