/**
 * 用户基本信息Vuex模块
 * @module store/user/baseInfo/index
 */

import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

// 确保模块有命名空间
const baseInfoModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default baseInfoModule; 