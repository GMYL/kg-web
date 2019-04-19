import $http from '@/api/index';

const enums = {
  state: {
    myenums: {}
  },
  getters: {
    myenums: state => state.myenums
  },
  mutations: {
    set_myenums(state, payload) {
      if (payload && payload.type && payload.data) {
        state.myenums[payload.type] = payload.data;
      }
    },
  },
  actions: {
    get_myenum_modules({commit}, payload) {
      return new Promise((resolve, reject) => {
        $http.get('/dictionary/getEnums', {params: {type: payload}}).then(res => {
          commit('set_myenums', res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    }
  }
};

export default enums;
