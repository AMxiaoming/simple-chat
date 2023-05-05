import axios from 'axios'
import { Notify } from 'vant';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 对应国际化资源文件后缀
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'

let VUE_APP_BASE_API = process.env.VUE_APP_BASE_API

const service = axios.create({
  baseURL: VUE_APP_BASE_API,
  // 超时
  timeout: 15000
})


// 请求拦截器
service.interceptors.request.use(function (config) {

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);

});

// 响应拦截器
service.interceptors.response.use(function (response) {
  if(response.data.code!==200){
    Notify({ type: 'warning', message: 'API-KEY填写有误，请重新填写' })
    localStorage.removeItem('OPEN-API-KEY')
    setTimeout(()=>{
      location.reload()
    },3000)
  }
  // 对响应数据做点什么
  return response.data
}, function (error) {
  // 对响应错误做点什么
  const msg = error.response || '请求失败'
  console.log(msg,'msg');
  return Promise.reject(error);
});

export default service

