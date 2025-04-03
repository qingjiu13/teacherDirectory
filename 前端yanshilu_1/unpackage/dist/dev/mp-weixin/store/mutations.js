"use strict";
const rootMutations = {
  /**
   * @description 设置应用加载状态
   * @param {Object} state - Vuex状态
   * @param {boolean} isLoading - 是否加载中
   */
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  /**
   * @description 设置错误信息
   * @param {Object} state - Vuex状态
   * @param {string|Object} error - 错误信息
   */
  SET_ERROR(state, error) {
    state.error = error;
  }
};
exports.rootMutations = rootMutations;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/mutations.js.map
