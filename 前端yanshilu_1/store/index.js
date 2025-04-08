import { createStore } from 'vuex'

// 导入模块
import common from './modules/common'
import user from './modules/user'
import aiChat from './modules/ai-chat'
import teacher from './modules/teacher'

/**
 * @description 创建Vuex存储实例
 * @returns {Object} Vuex存储实例
 */
function createVuexStore() {
  return createStore({
    modules: {
      common,
      user,
      'ai-chat': aiChat,
      teacher
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
 * @returns {Promise<Object>} 初始化结果
 */
export const initializeApp = async () => {
  try {
    await store.dispatch('common/initApp');
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