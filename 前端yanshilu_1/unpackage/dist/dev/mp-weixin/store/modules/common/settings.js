"use strict";
const common_vendor = require("../../../common/vendor.js");
const state = {
  theme: "light",
  // 主题设置
  notifications: true,
  // 通知开关
  fontSize: "medium",
  // 字体大小
  language: "zh-CN",
  // 语言设置
  autoSave: true,
  // 自动保存
  preferences: {}
  // 用户偏好设置
};
const getters = {
  /**
   * @description 获取主题设置
   * @param {Object} state - 状态对象
   * @returns {string} 当前主题
   */
  currentTheme: (state2) => state2.theme,
  /**
   * @description 获取通知状态
   * @param {Object} state - 状态对象
   * @returns {boolean} 通知是否开启
   */
  isNotificationsEnabled: (state2) => state2.notifications
};
const mutations = {
  /**
   * @description 更新主题
   * @param {Object} state - 状态对象
   * @param {string} theme - 新主题
   */
  SET_THEME(state2, theme) {
    state2.theme = theme;
  },
  /**
   * @description 切换通知开关
   * @param {Object} state - 状态对象
   * @param {boolean} enabled - 是否启用通知
   */
  SET_NOTIFICATIONS(state2, enabled) {
    state2.notifications = enabled;
  },
  /**
   * @description 更新用户偏好设置
   * @param {Object} state - 状态对象
   * @param {Object} preferences - 用户偏好设置
   */
  UPDATE_PREFERENCES(state2, preferences) {
    state2.preferences = { ...state2.preferences, ...preferences };
  }
};
const actions = {
  /**
   * @description 保存设置
   * @param {Object} context - Vuex上下文
   * @param {Object} settings - 要保存的设置
   * @returns {Promise<Object>} 保存结果
   */
  async saveSettings({ commit }, settings2) {
    try {
      commit("UPDATE_PREFERENCES", settings2);
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/settings.js:89", "保存设置失败:", error);
      return { success: false, error };
    }
  },
  /**
   * @description 切换主题
   * @param {Object} context - Vuex上下文
   * @param {string} theme - 主题名称
   */
  changeTheme({ commit }, theme) {
    commit("SET_THEME", theme);
  }
};
const settings = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
exports.settings = settings;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/settings.js.map
