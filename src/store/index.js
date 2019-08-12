import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from './modules'
class Modules {
  constructor () {
    this.modules = {}
  }

  addModules (obj) {
    const self = this
    Object.keys(obj).forEach(key => {
      self.modules[key] = obj[key]
    })
  }

  getModules () {
    return this.modules
  }
}

const modules = new Modules()
modules.addModules(auth)

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

// console.log( 'modules', modules.getModules() );
export default new Vuex.Store({
  modules: modules.getModules(),
  strict: debug
  //  plugins: debug ? [createLogger()] : []
})
