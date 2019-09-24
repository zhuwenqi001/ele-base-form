
import eleBaseForm from './packages/base-form/form.vue'

import directives from './directives/index'

const components = [
  eleBaseForm
]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })
  Object.keys(directives).map(key => {
    Vue.directive(key, {
      bind (el, binding) {
        directives[key](el, binding)
      }
    })
  })
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default {
  install,
  eleBaseForm
}
