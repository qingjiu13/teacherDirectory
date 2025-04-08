"use strict";
const common_vendor = require("../../../common/vendor.js");
const state = {
  loading: false,
  firstLaunch: false,
  appVersion: "1.0.0",
  appInitialized: false,
  appError: null,
  sidebarCollapsed: common_vendor.index.getStorageSync("sidebarCollapsed") === "true",
  darkMode: common_vendor.index.getStorageSync("darkMode") === "true",
  currentRoute: null
};
const getters = {
  loading: (state2) => state2.loading,
  isDarkMode: (state2) => state2.darkMode,
  isSidebarCollapsed: (state2) => state2.sidebarCollapsed,
  appVersion: (state2) => state2.appVersion,
  currentRoute: (state2) => state2.currentRoute,
  isAppInitialized: (state2) => state2.appInitialized
};
const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE";
const APP_INIT_START = "APP_INIT_START";
const APP_INIT_SUCCESS = "APP_INIT_SUCCESS";
const APP_INIT_FAILURE = "APP_INIT_FAILURE";
const SET_CURRENT_ROUTE = "SET_CURRENT_ROUTE";
const mutations = {
  [TOGGLE_SIDEBAR](state2) {
    state2.sidebarCollapsed = !state2.sidebarCollapsed;
    common_vendor.index.setStorageSync("sidebarCollapsed", state2.sidebarCollapsed.toString());
  },
  [TOGGLE_DARK_MODE](state2) {
    state2.darkMode = !state2.darkMode;
    common_vendor.index.setStorageSync("darkMode", state2.darkMode.toString());
  },
  [APP_INIT_START](state2) {
    state2.loading = true;
    state2.appError = null;
  },
  [APP_INIT_SUCCESS](state2) {
    state2.loading = false;
    state2.appInitialized = true;
  },
  [APP_INIT_FAILURE](state2, error) {
    state2.loading = false;
    state2.appError = error;
  },
  [SET_CURRENT_ROUTE](state2, route) {
    state2.currentRoute = route;
  }
};
const actions = {
  /**
   * @description 切换侧边栏展开/收起状态
   */
  toggleSidebar({ commit }) {
    commit(TOGGLE_SIDEBAR);
  },
  /**
   * @description 切换深色/浅色模式
   */
  toggleDarkMode({ commit }) {
    commit(TOGGLE_DARK_MODE);
  },
  /**
   * @description 应用初始化
   * @returns {Promise<boolean>} 初始化结果
   */
  async initializeApp({ commit }) {
    commit(APP_INIT_START);
    try {
      commit(APP_INIT_SUCCESS);
      return true;
    } catch (error) {
      commit(APP_INIT_FAILURE, error);
      return false;
    }
  },
  /**
   * @description 设置当前路由
   * @param {Object} context - Vuex上下文
   * @param {Object} route - 路由对象
   */
  setCurrentRoute({ commit }, route) {
    commit(SET_CURRENT_ROUTE, route);
  }
};
const app = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.app = app;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/app.js.map
