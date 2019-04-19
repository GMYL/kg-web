import $http from '@/api/index';

const state = {
  authStateList: [],
  authStateMap: {},
  authCategoryList: [],
  authCategoryMap: {}
};
const getters = {
  authInited: state => state.authCategoryList && state.authCategoryList.length > 1, // 大于1是因为有可能只有一个root
  authCategoryList: state => state.authCategoryList,
  authCategoryMap: state => state.authCategoryMap,
  authCategoryRoot: state => state.authCategoryMap.root,
  authCategoryLevel: state => level => {
    let lastLevel = [state.authCategoryMap.root], thisLevel = [];
    if (state.authCategoryMap.root) {
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
  set_auth_category (state, payload) {
    // 补充root
    if (!payload.root) {
      payload['root'] = {
        id: 'root',
        name: 'root'
      };
    }
    state.authCategoryMap = payload;
    state.authCategoryList = [];
    for (let i in payload) {
      let item = payload[i];
      if (item.id) {
        item.title = item.id.split("-")[item.id.split("-").length - 1];
      }
      item.expand = true;
      state.authCategoryList.push(item);
    }
    let diguiReflectList = (theObj) => {
      if (theObj) {
        if (theObj.children) {
          theObj.children = theObj.children.map(item => diguiReflectList(item));
        } else {
          theObj.children = []
        }
        theObj.loading = false;
        if (theObj['$ref']) {
          let str = theObj['$ref'].replace('\$.data', 'state.authCategoryMap');
          if (/[\u4e00-\u9fa5-]/.test(str)) {
            str = str.replace(/[\u4e00-\u9fa5-]+/g, '[\'$&\']').replace(/\.\[/g, '[');
          }
          let rsObj;
          try {
            rsObj = eval(str);
          } catch (err) {
          }
          return rsObj;
          // return eval(theObj["$ref"].replace("\$.data", "state.articleCategoryMap"));
        } else {
          theObj.title = theObj.id.split("-")[theObj.id.split("-").length - 1];
          theObj.expand = false;
          state.authCategoryMap[theObj.id] = theObj;
          return theObj;
        }
      } else {
        return theObj;
      }
    };
    state.authCategoryList = state.authCategoryList.map(item => diguiReflectList(item));
  }
};
const actions = {
  get_auth_category ({commit}, payload) {
    return new Promise((resolve, reject) => {
      $http.get('/modulecategory/init').then(res => {
        commit('set_auth_category', res);
        resolve(res);
      }).catch(err => [
        reject(err)
      ]);
    });
  },
  init_module_auth ({dispatch, commit}) {
    return dispatch('get_auth_category');
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
