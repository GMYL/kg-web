import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';
import env from '../../build/env';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = env === 'devlocal'
  ? {base: '/', routes: routers}
  : {mode: 'history', base: '/admin', routes: routers};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  Util.title(to.meta.title);
  if (sessionStorage.locking === '1' && to.name !== 'locking') {
    next({
      replace: true,
      name: 'locking'
    });
  } else if (sessionStorage.locking === '0' && to.name === 'locking') {
    next(false);
  } else {
    if (!sessionStorage.hbtoken && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
      // console.log('没有登陆，跳转到登录页');
      next({
        replace: true,
        name: 'login'
      });
    } else if (sessionStorage.hbtoken && sessionStorage.user && to.name === 'login') { // 判断是否已经登录且前往的是登录页
      Util.title();
      next({
        name: 'home_index'
      });
    } else {
      next();
    }
  }
});

router.afterEach((to) => {
  Util.openNewPage(router.app, to.name, to.params, to.query);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
