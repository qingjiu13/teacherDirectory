/**
 * @description AI聊天模块入口文件
 */

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 