
import eleBaseForm from './packages/base-form/index.js'

import selectScroll from './directives/selectScroll'
const components = [
  eleBaseForm
]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })
  Vue.use(selectScroll)
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default {
  install,
  eleBaseForm,
  selectScroll
}
