// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入 element ui 样式

import EleBaseForm from 'ele-base-form'

import '@/scss/index.scss'
Vue.use(Element, {
  size: 'mini'
})

// Vue.use(EleBaseForm)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app2',
  router,
  components: { App },
  template: '<App/>'
})
