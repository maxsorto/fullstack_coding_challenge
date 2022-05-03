export default {
  namespaced: true,
  state: {
    login: '',
  },
  mutations: {
    change(state, data) {
      state.login = data;
      localStorage.setItem('mt_lgdata', JSON.stringify(data));
    },
  },
  actions: {
    GET_LOGIN({ commit }) {
      let data = {};
      try {
        data = JSON.parse(localStorage.getItem('mt_lgdata') || '{}');
      } catch (e) {
        data = '';
      }
      commit('change', data);
      return data;
    },
  },
  getters: {
    login: (state) => state.login,
    isLogin: (state) =>
      state.login != null && state.login.name && state.login.name != null,
  },
};
