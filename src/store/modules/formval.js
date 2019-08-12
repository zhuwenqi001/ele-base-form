
const state = {
  formsVal: {}
}
const getters = {
  getFormsVal: state => state.formsVal
}

const mutations = {
  SET_FORMS_VAL (state, opt) {
    state.formsVal = {
      ...state.formsVal, ...opt
    }
  }
}

const actions = {
  SetFormsVal ({ commit }, opt) {
    commit('SET_FORMS_VAL', opt)
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
