"use strict";
const rootGetters = {
  /**
   * @description 获取应用加载状态
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否正在加载
   */
  isLoading: (state) => state.isLoading,
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {string|Object|null} 错误信息
   */
  error: (state) => state.error,
  /**
   * @description 判断用户是否已登录
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {boolean} 登录状态
   */
  isLoggedIn: (state, getters, rootState) => rootState.auth.isLoggedIn,
  /**
   * @description 获取当前用户角色
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {string|null} 用户角色
   */
  currentRole: (state, getters, rootState) => rootState.auth.role
};
exports.rootGetters = rootGetters;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/getters.js.map
