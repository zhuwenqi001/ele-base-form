const asyncRouter = []

const requireModule = require.context('.', false, /^((?!index).)+\.js$/)
requireModule.keys().forEach(fileName => {
  asyncRouter.push(requireModule(fileName).default)
})

// asyncRouter.push({ path: '*', redirect: '/404', meta: { hidden: true }})
export default asyncRouter
