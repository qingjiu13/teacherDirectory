/**
 * 用户基本信息模块
 * @module store/user/baseInfo
 */

// 导入各个模块
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// 导出完整模块
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 