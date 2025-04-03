"use strict";
const rootActions = {
  /**
   * @description 初始化应用
   * @param {Object} context - Vuex上下文
   * @returns {Promise<void>}
   */
  async initApp({ dispatch }) {
    await dispatch("auth/checkLoginStatus", null, { root: true });
  }
};
exports.rootActions = rootActions;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/actions.js.map
