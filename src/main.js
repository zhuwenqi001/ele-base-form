import Vue from 'vue'
import Element from 'element-ui' // 引入element ui
import 'element-ui/lib/theme-chalk/index.css' // 引入 element ui 样式
import App from './App.vue'
import Base from './index.js'
Vue.use(Base)

Vue.use(Element)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
