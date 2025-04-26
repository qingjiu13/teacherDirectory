// Vuex store 主入口文件
import { createApp } from 'vue'
import { createStore } from 'vuex'

// 导入过滤器模块
import filter from './modules/filter'
// 导入用户模块
import user from './user'

// 导入其他模块
// TODO: 按需导入其他现有模块

/**
 * Vuex 存储实例
 * @type {import('vuex').Store}
 */
export default createStore({
  modules: {
    filter,
    user,
    // 加载其他模块
    // TODO: 添加其他现有模块
  }
}) 