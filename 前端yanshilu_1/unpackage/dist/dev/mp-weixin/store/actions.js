"use strict";
const common_vendor = require("../common/vendor.js");
const rootActions = {
  /**
   * @description 初始化应用
   * @param {Object} context - Vuex上下文
   * @returns {Promise<void>}
   */
  async initApp({ dispatch, commit }) {
    try {
      commit("SET_LOADING", true);
      await dispatch("auth/checkLoginStatus", null, { root: true });
      await dispatch("loadAppConfig");
      dispatch("setSystemTheme");
      commit("SET_LOADING", false);
    } catch (error) {
      commit("SET_ERROR", error.message || "应用初始化失败");
      commit("SET_LOADING", false);
    }
  },
  /**
   * @description 加载应用配置
   * @param {Object} context - Vuex上下文
   * @returns {Promise<void>}
   */
  async loadAppConfig({ commit }) {
    try {
      const config = common_vendor.index.getStorageSync("appConfig") || {
        theme: "light",
        fontSize: "medium",
        language: "zh-CN"
      };
      commit("SET_APP_CONFIG", config);
      return { success: true };
    } catch (error) {
      commit("SET_ERROR", error.message || "加载应用配置失败");
      return { success: false, error };
    }
  },
  /**
   * @description 设置系统主题
   * @param {Object} context - Vuex上下文
   * @returns {void}
   */
  setSystemTheme({ commit, state }) {
    const { theme } = state.appConfig;
    if (theme === "dark") {
      common_vendor.index.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#333333"
      });
    } else {
      common_vendor.index.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#ffffff"
      });
    }
  },
  /**
   * @description 更新应用配置
   * @param {Object} context - Vuex上下文
   * @param {Object} config - 新的配置
   * @returns {Promise<Object>} 更新结果
   */
  async updateAppConfig({ commit, dispatch, state }, config) {
    try {
      const newConfig = { ...state.appConfig, ...config };
      commit("SET_APP_CONFIG", newConfig);
      common_vendor.index.setStorageSync("appConfig", newConfig);
      if (config.theme && config.theme !== state.appConfig.theme) {
        dispatch("setSystemTheme");
      }
      return { success: true };
    } catch (error) {
      commit("SET_ERROR", error.message || "更新应用配置失败");
      return { success: false, error };
    }
  }
};
exports.rootActions = rootActions;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/actions.js.map
