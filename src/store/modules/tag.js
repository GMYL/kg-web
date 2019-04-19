import $http from '@/api/index';

const tag = {
  state: {
    tagroots: [],
    tagmap: {}
  },
  getters: {
    tagroots: state => state.tagroots,
    tagmap: state => state.tagmap,
    tagtree: state => [{
      title: 'root',
      expand: false,
      loading: false,
      children: state.tagroots.map((node) => {
        return {
          title: node.id,
          loading: false,
          parent: node.parent,
          expand: false,
          children: node.childs ? node.childs : [],
          type: node.type
        };
      })
    }],
    tagTax: state => {
      let myTaxTag = state.tagroots.filter(item => item.id === 'tax');
      return myTaxTag && myTaxTag.length > 0 && myTaxTag[0].childs ? myTaxTag[0].childs : [];
      // return state.tagmap && state.tagmap.tax ? state.tagmap.tax.childs : [];
    },
    tagRegion: state => {
      let myRegionTag = state.tagroots.filter(item => item.id === 'region');
      return myRegionTag && myRegionTag.length > 0 && myRegionTag[0].childs ? myRegionTag[0].childs : [];
      // return state.tagmap && state.tagmap.region ? state.tagmap.region.childs : [];
    },
    tagEntrust: state => {
      let myEntrustTag = state.tagroots.filter(item => item.id === 'entrust');
      return myEntrustTag && myEntrustTag.length > 0 && myEntrustTag[0].childs ? myEntrustTag[0].childs : [];
      // return state.tagmap && state.tagmap.region ? state.tagmap.region.childs : [];
    }
  },
  mutations: {
    set_tags (state, payload) {
      if (payload) {
        payload.map((root) => {
          state.tagmap[root.id] = root;
          if (root.childs) {
            root.childs.map((child) => {
              child.title = child.id;
              child.loading = false;
              child.children = [];
              child.expand = true;
              state.tagmap[child.id] = child;
            });
          }
        });
        state.tagroots = payload;
      }
    },
    add_tags (state, payload) {
      state.tags.concat(payload);
    }
  },
  actions: {
    // 获取初始化的tag，主要是root层级的tag
    init_module_tag ({dispatch, commit}) {
      return new Promise((resolve, reject) => {
        $http.get('/tag/init').then(res => {
          commit('set_tags', res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    },
    get_tag_by_parent ({commit}, payload) {
      return new Promise((resolve, reject) => {
        $http.get('/tag', payload).then(res => {
          commit('set_tagList', res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    },
    get_tagList ({commit}, payload) {
      return new Promise((resolve, reject) => {
        $http.get('/tag', payload).then(res => {
          commit('set_tagList', res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    }
  }
};

export default tag;
