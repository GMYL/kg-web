import $http from '@/api/index';

const state = {
  controlCategoryList: [],
  controlCategoryMap: {}
};
const getters = {
  controlInited: state => state.controlCategoryList && state.controlCategoryList.length > 1, // 大于1是因为有可能只有一个root
  controlCategoryList: state => state.controlCategoryList,
  controlCategoryMap: state => state.controlCategoryMap,
  controlCategoryRoot: state => state.controlCategoryMap.root,
  controlCategoryLevel: state => level => {
    let lastLevel = [state.controlCategoryMap.root], thisLevel = [];
    if (state.controlCategoryMap.root) {
      for (let j = 0; j < level; j++) {
        for (let item in lastLevel) {
          if (item.children) {
            for (let i in item.children) {
              thisLevel.push(item.children[i]);
            }
          }
        }
        lastLevel = thisLevel;
        thisLevel = [];
      }
    }
  }
};
const mutations = {
  set_control_category(state, payload) {
    state.controlCategoryMap = payload;
    state.controlCategoryList = [];
    for (let i in payload) {
      let item = payload[i];
      item.title = item.id;
      item.expand = true;
      state.controlCategoryList.push(item);
    }
    let diguiReflectList = (theObj) => {
      if (theObj) {
        if (theObj.children) {
          theObj.children = theObj.children.map(item => diguiReflectList(item));
        }
        if (theObj['$ref']) {
          let str = theObj['$ref'].replace('\$.data', 'state.controlCategoryMap');
          if (/[\u4e00-\u9fa5-]/.test(str)) {
            str = str.replace(/[\u4e00-\u9fa5-]+/g, '[\'$&\']').replace(/\.\[/g, '[');
          }
          let rsObj;
          try {
            rsObj = eval(str);
          } catch (err) {
            console.log(str);
            console.log(err);
          }
          return rsObj;
        } else {
          theObj.title = theObj.id;
          theObj.expand = false;
          state.controlCategoryMap[theObj.id] = theObj;
          return theObj;
        }
      } else {
        return theObj;
      }
    };
    state.controlCategoryList = state.controlCategoryList.map(item => diguiReflectList(item));
  }
};
const actions = {
  get_control_category({commit}, payload) {
    return new Promise((resolve, reject) => {
      $http.get('/riskControlCategory/initAll').then(res => {
        commit('set_control_category', res);
        resolve(res);
      }).catch(err => [
        reject(err)
      ]);
    });
  },
  init_module_control({dispatch, commit}) {
    return dispatch('get_control_category');
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
