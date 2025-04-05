import { createSSRApp } from 'vue'
import { createStore } from 'vuex'
// 导入根级别状态管理
import rootGetters from './getters'
import rootMutations from './mutations'
import rootActions from './actions'
// 导入模块
import auth from './modules/auth'
import message from './modules/message'
import course from './modules/course'
import order from './modules/order'

// 不需要显式调用Vue.use(Vuex)，因为我们使用的是组合式API

/**
 * @description Vuex根状态
 */
const state = {
  isLoading: false,
  error: null,
  appVersion: '1.0.0',
  appConfig: {
    theme: uni.getStorageSync('appConfig')?.theme || 'light',
    fontSize: uni.getStorageSync('appConfig')?.fontSize || 'medium',
    language: uni.getStorageSync('appConfig')?.language || 'zh-CN'
  }
}

/**
 * @description 创建Vuex存储实例
 * @returns {Object} Vuex存储实例
 */
function createVuexStore() {
  return createStore({
    state,
    getters: rootGetters,
    mutations: rootMutations,
    actions: rootActions,
    modules: {
      auth,
      message,
      course,
      order
    },
    // 严格模式，防止直接修改状态
    strict: process.env.NODE_ENV !== 'production'
  });
}

/**
 * @description Vuex存储实例
 */
const store = createVuexStore();

/**
 * @description 初始化应用
 * 在app.vue中调用这个方法进行初始化
 * @returns {Promise<void>} 初始化结果
 */
export const initializeApp = async () => {
  try {
    await store.dispatch('initApp');
    console.log('应用初始化成功');
    return { success: true };
  } catch (error) {
    console.error('应用初始化失败:', error);
    return { success: false, error };
  }
}

/**
 * @description 获取当前存储状态
 * @returns {Object} 当前存储状态
 */
export const getStoreState = () => {
  return store.state;
}

export default store