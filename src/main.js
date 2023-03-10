import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { locale } from 'element-ui/lib/locale/lang/en' // lang i18n

// import axios from './router/axios'
// import VueAxios from 'vue-axios'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router/index'

import '@/icons' // icon
import '@/permission' // permission control

import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'
import AvueFormDesign from '@sscfaith/avue-form-design'

// window.axios = axios
// Vue.use(VueAxios, axios)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.use(Avue, {
  size: 'small',
  menuType: 'text'
})

Vue.use(AvueFormDesign)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
