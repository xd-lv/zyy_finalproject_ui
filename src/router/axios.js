import axios from 'axios'
import { serialize } from '@/utils/util'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import router from '@/router/index'
import { Message } from 'element-ui'
import 'nprogress/nprogress.css'
import qs from 'qs'
import store from '@/store' // progress bar style
axios.defaults.timeout = 30000
// 返回其他状态吗
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

// HTTPrequest拦截
axios.interceptors.request.use(config => {
  const isToken = (config.headers || {}).isToken === false
  const token = store.getters.access_token
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token// token
  }
  if (config.headers.hasOwnProperty('nprogressDisable')) {
    NProgress.done()
  } else {
    NProgress.start() // start progress bar
  }
  // headers中配置serialize为true开启序列化
  if (config.methods === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }

  // 处理get 请求的数组 springmvc 可以处理
  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
axios.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 401) {
    store.dispatch('FedLogOut').then(() => {
      router.push({ path: '/login' })
    })
    return
  }

  if (status !== 200 || res.data.code === 1) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }

  return res
}, error => {
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default axios
