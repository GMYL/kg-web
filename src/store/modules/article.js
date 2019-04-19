import $http from '@/api/index';

const state = {
  articleStateList: [{
    name: '草稿箱',
    value: 0,
    type: 'primary'
  }, {
    name: '待审核',
    value: 1,
    type: 'warning'
  }, {
    name: '已发布',
    value: 2,
    type: 'success'
  }, {
    name: '已删除',
    value: 3,
    type: 'error'
  }],
  articleStatePickList: [{
    value: '上线',
    label: 2
  }, {
    value: '等待复审',
    label: 1
  }, {
    value: '草稿',
    label: 0
  }],
  articleCategoryList: [],
  articleCategoryMap: {}
};
const getters = {
  articleStateList: state => state.articleStateList,
  articleStateMap: state => {
    let rsMap = {};
    state.articleStateList.forEach(item => {
      rsMap[item.name] = item.value;
    });
    return rsMap;
  },
  articleStateListSelector: state => {
    return state.articleStateList.map(item => {
      return {
        value: item.name,
        label: item.value
      };
    });
  },
  articleStateMapRevert: state => {
    let rsMap = {};
    state.articleStateList.forEach(item => {
      rsMap[item.value] = item.name;
    });
    return rsMap;
  },
  articleStatePickList: state => state.articleStatePickList,
  articleCategoryMap: state => state.articleCategoryMap,
  articleCategoryList: state => state.articleCategoryList,
  articleCategoryRoot: state => state.articleCategoryMap.root,
  articleCategoryLevel: state => level => {
    let lastLevel = [state.articleCategoryMap.root], thisLevel = [];
    if (state.articleCategoryMap.root) {
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
  set_article_init(state, payload) {
    state.article = payload;
  },
  set_articleCategory(state, payload) {
    state.articleCategoryMap = payload;
    state.articleCategoryList = [];
    for (let i in payload) {
      let item = payload[i];
      item.title = item.id;
      item.expand = true;
      state.articleCategoryList.push(item);
    }
    let diguiReflectList = (theObj) => {
      if (theObj) {
        if (theObj.children) {
          theObj.children = theObj.children.map(item => diguiReflectList(item));
        }
        if (theObj['$ref']) {
          let str = theObj['$ref'].replace('\$.data', 'state.articleCategoryMap');
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
          // return eval(theObj["$ref"].replace("\$.data", "state.articleCategoryMap"));
        } else {
          theObj.title = theObj.id;
          theObj.expand = false;
          state.articleCategoryMap[theObj.id] = theObj;
          return theObj;
        }
      } else {
        return theObj;
      }
    };
    state.articleCategoryList = state.articleCategoryList.map(item => diguiReflectList(item));
    // state.articleCategoryMap.root = diguiReflectList(state.articleCategoryMap.root);
    // state.articleCategoryList.map(val => {
    //   if (val.children) {
    //     val.children = val.children.map(item => {
    //       if (item["$ref"]) {
    //         console.log(item["$ref"].replace("\$.data", "state.articleCategoryMap"));
    //         // console.log(eval(item["$ref"].replace("\$.data","state.articleCategoryMap")));
    //         return eval(item["$ref"].replace("\$.data", "state.articleCategoryMap"));
    //       } else {
    //         item.title = item.id;
    //         item.expand = true;
    //         state.articleCategoryMap[item.id] = item;
    //         return item;
    //       }
    //     });
    //   }
    // console.log(val.children);
    // });
    // console.log(state.articleCategoryList);
  }
};
const actions = {
  get_articleCategory({commit}, payload) {
    return new Promise((resolve, reject) => {
      $http.get('/articlecategory/init').then(res => {
        commit('set_articleCategory', res);
        resolve(res);
      }).catch(err => [
        reject(err)
      ]);
    });
  },
  init_module_article({dispatch, commit}) {
    return dispatch('get_articleCategory');
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
