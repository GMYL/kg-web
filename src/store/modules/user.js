import $http from '@/api/index';
// import Cookies from 'js-cookie';

const user = {
  state: {
    user: {},
    usermsgs: {},
    allroles: [],
    getRoles: false,
    allrolesArray: {},
    allmodules: [],
    getModules: false,
    allgroups: [],
    getGroup: false,
    allgroupsArray: {},
    alladmins: [],
    getAdmins: false,
  },
  getters: {
    user: state => state.user,
    role: state => state.user.roles,
    usermsgs: state => state.usermsgs,
    allroles: state => state.allroles,
    allrolesArray: state => state.allrolesArray,
    allmodules: state => state.allmodules,
    allgroups: state => state.allgroups,
    allgroupsArray: state => state.allgroupsArray,
    alladmins: state => state.alladmins,
    staffGroup: state => state.allgroups.filter(group => group.roles.includes('role_staff')),
    groupMap: state => {
      let theMap = {};
      state.allgroups.forEach(group => {
        group.users = group.users ? group.users : [];
        theMap[group.id] = group;
        state.alladmins.forEach(admin => {
          if (admin.group) {
            admin.group.forEach(adminG => {
              if (adminG === group.id) {
                group.users.push(admin);
              }
            });
          }
        });
      });
      return theMap;
    },
    groupTree: state => state.allgroups.filter(group => group.roles.includes('role_staff')).map(group => {
      return {
        id: group.id,
        title: group.title,
        leader: group.leader,
        viceLeaders: group.viceLeaders,
        expand: true,
        children: state.alladmins.filter(admin => {
          return admin.group && admin.group.indexOf(group.id) > -1;
        }).map(item => {
          return {
            id: item.id,
            userName: item.userName,
            title: item.trueName ? item.trueName : item.userName
          };
        })
      };
    })
  },
  mutations: {
    set_user(state, payload) {
      state.user = payload;
      sessionStorage.userModules = payload.modules;
    },
    set_msg(state, payload) {
      state.usermsgs = payload;
    },
    set_all_roles(state, payload) {
      state.getRoles = true;
      state.allroles = payload;
      console.log("payload",payload)
      var result = {}
      state.allroles.forEach(element => {
        result[element.id] = element.name
      });
      state.allrolesArray = result
    },
    set_all_modules(state, payload) {
      state.getModules = true;
      state.allmodules = payload;
    },
    set_all_groups(state, payload) {
      state.getGroup = true;
      state.allgroups = payload.map(group => {
        group.title = group.name;
        return group;
      });

      var result = {}
      state.allgroups.forEach(element => {
        result[element.id] = element.name
      });
      state.allgroupsArray = result
    },
    set_all_admins(state, payload) {
      state.getAdmins = true;
      state.alladmins = payload;
    }
  },
  actions: {
    login({dispatch, commit}, payload) {
      return new Promise((resolve, reject) => {
        $http.post('/auth/token/login', payload).then(res => {
          // sessionStorage.token = res.jwtToken;
          // localStorage.user = JSON.stringify(res);
          if (res != null && res.roles != null && res.roles.indexOf('role_system') !== -1) {
            sessionStorage.hbtoken = res.jwtToken;
            sessionStorage.user = JSON.stringify(res);
            commit('set_user', res);
            // 从服务器调用初始化的数据
            // dispatch('init_module_sys');
            resolve(res);
          }
        }).catch(err => [
          console.log(err)
        ]);
      });
    },
    logout({commit}, payload) {
      // sessionStorage.clear();
      // localStorage.clear();
      sessionStorage.removeItem('hbtoken');
      sessionStorage.removeItem('user');
      commit('set_user', {});
    },
    get_basic_user({commit}, payload) {
      // console.log(payload);
      return new Promise((resolve, reject) => {
        $http.get('/user/edit/basic/' + payload).then(res => {
          // console.log(res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    },
    init_user_roles({dispatch, commit, state}) {
      return new Promise((resolve, reject) => {
        $http.get('/role/init').then(res => {
          commit('set_all_roles', res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    },
    init_user_modules({dispatch, commit, state}) {
      return new Promise((resolve, reject) => {
        $http.get('/module/init').then(res => {
          commit('set_all_modules', res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    },
    init_user_groups({dispatch, commit, state}) {
      return new Promise((resolve, reject) => {
        $http.get('/usergroup/init').then(res => {
          commit('set_all_groups', res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    },
    init_user_admins({dispatch, commit}) {
      return new Promise((resolve, reject) => {
        $http.get('/user/edit/alladmins').then(res => {
          commit('set_all_admins', res);
          resolve(res);
        }).catch(err => [
          reject(err)
        ]);
      });
    }
  }
};

export default user;
