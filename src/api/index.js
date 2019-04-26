import axios from 'axios';
import env from '../../build/env';

const ajaxUrl = env === 'development'
  ? 'http://192.168.1.71:18070/kg/v1/b'
  : env === 'production'
    ? 'http://www.aqielu.cn/kg/v1/b'
    : env === 'devlocal'
      ? 'http://localhost:18070/kg/v1/b'
      : 'http://192.168.1.71:18070/kg/v1/b';

let http = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
});

if (env === 'production') {
  // request拦截器
  http.interceptors.request.use(config => {
    config.headers['X-Powered-By'] = 'iViewAdmin';
    if (sessionStorage.hbtoken) {
      config.headers['hbtoken'] = sessionStorage.hbtoken;
    }
    return config;
  },
  err => Promise.reject(err)
  );
  // response拦截器
  http.interceptors.response.use(
    response => response.data.code && response.data.code !== 'A001' ? Promise.reject(response.data) : Promise.resolve(response.data.data),
    error => Promise.reject(error)
  );
} else {
  // request拦截器
  http.interceptors.request.use(config => {
    config.headers['X-Powered-By'] = 'iViewAdmin';
    if (sessionStorage.hbtoken) {
      config.headers['hbtoken'] = sessionStorage.hbtoken;
    }
    return config;
  }, err => {
    return Promise.reject(err);
  });
  // response拦截器
  http.interceptors.response.use(
    response => {
      if (response.data.code && response.data.code !== 'A001') {
        console.log('%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>', 'color: #e74c3c', 'color: #e67e22', 'color: #f1c40f', 'color: #2ecc71', 'color: #1abc9c', 'color: #3498db', 'color: #9b59b6');
        console.log('出错了哦，' + response.data.errmsg);
        return Promise.reject(response.data);
      } else {
        console.log(response.config.url + '\nresponse data:');
        console.log(response.data.data);
        return Promise.resolve(response.data.data);
      }
    },
    error => {
      console.log('%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>', 'color: #e74c3c', 'color: #e67e22', 'color: #f1c40f', 'color: #2ecc71', 'color: #1abc9c', 'color: #3498db', 'color: #9b59b6');
      console.log(error);
      return Promise.reject(error);
    }
  );
}
// 导出各模块合并后的对象
export default http;
