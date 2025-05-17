/**
 * service_newbuilt 模块的主入口
 */

import state from './state'
import mutations from './mutation'
import actions from './avtion'
import getters from './getter'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
