/**
 * @description 根级别的actions
 */

export default {
  /**
   * @description 初始化应用
   * @param {Object} context - Vuex上下文
   * @returns {Promise<void>}
   */
  async initApp({ dispatch }) {
    // 验证登录状态
    await dispatch('auth/checkLoginStatus', null, { root: true });
  }
};
