import { createSSRApp } from 'vue'
import { createStore } from 'vuex'
// 导入根级别状态管理
import rootGetters from './getters'
import rootMutations from './mutations'
import rootActions from './actions'
// 导入模块
import auth from './modules/auth'

// 不需要显式调用Vue.use(Vuex)，因为我们使用的是组合式API

/**
 * @description Vuex根状态
 */
const state = {
  isLoading: false,
  error: null,
  appVersion: '1.0.0'
}

/**
 * @description Vuex存储实例
 */
const store = createStore({
  state,
  getters: rootGetters,
  mutations: rootMutations,
  actions: rootActions,
  modules: {
    auth // 用户认证模块
  },
  // 严格模式，防止直接修改状态
  strict: process.env.NODE_ENV !== 'production'
})

/**
 * @description 初始化应用
 * 在app.vue中调用这个方法进行初始化
 */
export const initializeApp = async () => {
  await store.dispatch('initApp')
}

export default store