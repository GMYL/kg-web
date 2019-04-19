import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import $http from './api/index';
import * as filters from './libs/filters';
import * as directives from './libs/directives';

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
// require styles 引入样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

// 全局引入百度编辑器
import './static/UEditor/ueditor.config.js';
import './static/UEditor/ueditor.all.min.js';
import './static/UEditor/lang/zh-cn/zh-cn.js';
// import '@/static/UEtidor/ueditor.parse.min.js';

Vue.use(VueQuillEditor);

// 引入城市级联
import iviewArea from 'iview-area';

Vue.use(iviewArea);

Vue.use(iView);
Vue.prototype.$http = $http;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: '',
    heartbeatNum: 0
  },
  mounted() {
    // console.log('调用了mounted');
    this.currentPageName = this.$route.name;
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
    // 从sessionStorage恢复vuex的基本数据
    if (sessionStorage.user) {
      this.$store.commit('set_user', JSON.parse(sessionStorage.user));
      // 从服务器调用初始化的数据
      // this.$store.dispatch('init_module_sys');
    }
    // // 从服务器调用初始化的数据
    // this.$store.dispatch('init_module_sys');
    // 其它数据在调取的时候处理
    // this.$store.dispatch('init_module_tag');
    // this.$store.dispatch('init_module_article');
    // this.$store.dispatch("init_user_roles");
    // this.$store.dispatch("init_user_modules");
    // this.$store.dispatch("init_user_groups");
    // this.$store.dispatch('init_user_admins');
    // 和后台访问的定时器
    // console.log('启动和后台连接的心跳机制');
    let heartbeat = () => {
      $http.get('/msg/heartbeat/checklist', {}).then(res => {
        if (res && res.msgs) {
          this.$store.commit('set_msg', res.msgs);
        }
      });
    };
    heartbeat();
    // 每3分钟检查一次
    setInterval(() => {
      heartbeat();
    }, 180000);
    this.$Notice.config({
      duration: 1
    });
  },
  created() {
    // console.log('调用了created');
    let tagsList = [];
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }
});
