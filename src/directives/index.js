const directives = {}

const requireModules = require.context('.', false, /^((?!index).)+\.js$/)
requireModules.keys().forEach(filename => {
  Object.assign(directives, requireModules(filename).default)
})

export default directives
