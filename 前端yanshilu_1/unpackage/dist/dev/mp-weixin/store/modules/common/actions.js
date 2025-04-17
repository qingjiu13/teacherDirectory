"use strict";
const common_vendor = require("../../../common/vendor.js");
const actions = {
  /**
   * @description 初始化应用
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 初始化结果
   */
  async initApp({ dispatch, commit }) {
    try {
      commit("SET_LOADING", true);
      await dispatch("loadSystemInfo");
      await dispatch("loadAppConfig");
      dispatch("setSystemTheme");
      await dispatch("user/checkLoginStatus", null, { root: true });
      commit("SET_LOADING", false);
      return { success: true, message: "应用初始化成功" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/actions.js:31", "应用初始化失败:", error);
      commit("SET_ERROR", error.message || "应用初始化失败");
      commit("SET_LOADING", false);
      return { success: false, error };
    }
  },
  /**
   * @description 加载系统信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 系统信息
   */
  loadSystemInfo({ commit }) {
    try {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      commit("SET_SYSTEM_INFO", systemInfo);
      return { success: true, data: systemInfo };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/actions.js:49", "获取系统信息失败:", error);
      return { success: false, error };
    }
  },
  /**
   * @description 加载应用配置
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 加载结果
   */
  loadAppConfig({ commit }) {
    try {
      const config = common_vendor.index.getStorageSync("appConfig") || {
        theme: "light",
        fontSize: "medium",
        language: "zh-CN"
      };
      commit("SET_APP_CONFIG", config);
      return { success: true, data: config };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/actions.js:71", "加载应用配置失败:", error);
      return { success: false, error };
    }
  },
  /**
   * @description 设置系统主题
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 设置结果
   */
  setSystemTheme({ state }) {
    try {
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
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/actions.js:102", "设置系统主题失败:", error);
      return { success: false, error };
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
      commit("SET_APP_CONFIG", config);
      if (config.theme && config.theme !== state.appConfig.theme) {
        await dispatch("setSystemTheme");
      }
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/actions.js:124", "更新应用配置失败:", error);
      return { success: false, error };
    }
  },
  /**
   * @description 添加通知
   * @param {Object} context - Vuex上下文
   * @param {Object} notification - 通知对象
   * @returns {Object} 添加结果
   */
  addNotification({ commit }, notification) {
    try {
      commit("ADD_NOTIFICATION", notification);
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/actions.js:140", "添加通知失败:", error);
      return { success: false, error };
    }
  },
  /**
   * @description 标记通知为已读
   * @param {Object} context - Vuex上下文
   * @param {string} notificationId - 通知ID
   * @returns {Object} 标记结果
   */
  markNotificationRead({ commit }, notificationId) {
    try {
      commit("MARK_NOTIFICATION_READ", notificationId);
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/actions.js:156", "标记通知已读失败:", error);
      return { success: false, error };
    }
  },
  /**
   * @description 清除所有通知
   * @param {Object} context - Vuex上下文
   * @returns {Object} 清除结果
   */
  clearNotifications({ commit }) {
    try {
      commit("CLEAR_NOTIFICATIONS");
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/actions.js:171", "清除通知失败:", error);
      return { success: false, error };
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/actions.js.map
