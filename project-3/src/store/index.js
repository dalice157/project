// Doc: https://nuxtjs.org/guide/vuex-store/
export const state = () => ({
  loginInfo: {},
  loader: 0,
});

export const mutations = {
  getLoginInfo(state, loginInfo) {
    state.loginInfo = loginInfo || {};
  },
  increaseLoader(state) {
    state.loader += 1
  },
  decreaseLoader(state) {
    state.loader -= 1
  },
};
