import baseForm from './packages/base-form/index.js'

const components = [
  baseForm
]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install,
  baseForm
}
