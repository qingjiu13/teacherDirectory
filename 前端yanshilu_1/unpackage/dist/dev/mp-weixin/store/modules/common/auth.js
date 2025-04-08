"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const state = {
  token: common_vendor.index.getStorageSync("token") || "",
  userId: common_vendor.index.getStorageSync("userId") || "",
  role: common_vendor.index.getStorageSync("role") || "",
  isAuthenticated: !!common_vendor.index.getStorageSync("token"),
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null
};
const getters = {
  isAuthenticated: (state2) => state2.isAuthenticated,
  currentRole: (state2) => state2.role,
  isTeacher: (state2) => state2.role === "teacher",
  isStudent: (state2) => state2.role === "student",
  userId: (state2) => state2.userId,
  authToken: (state2) => state2.token,
  loginLoading: (state2) => state2.loginLoading,
  loginError: (state2) => state2.loginError,
  registerLoading: (state2) => state2.registerLoading,
  registerError: (state2) => state2.registerError
};
const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const REGISTER_REQUEST = "REGISTER_REQUEST";
const REGISTER_SUCCESS = "REGISTER_SUCCESS";
const REGISTER_FAILURE = "REGISTER_FAILURE";
const LOGOUT = "LOGOUT";
const CHECK_AUTH_SUCCESS = "CHECK_AUTH_SUCCESS";
const mutations = {
  [LOGIN_REQUEST](state2) {
    state2.loginLoading = true;
    state2.loginError = null;
  },
  [LOGIN_SUCCESS](state2, { token, userId, role }) {
    state2.isAuthenticated = true;
    state2.token = token;
    state2.userId = userId;
    state2.role = role;
    state2.loginLoading = false;
    state2.loginError = null;
    common_vendor.index.setStorageSync("token", token);
    common_vendor.index.setStorageSync("userId", userId);
    common_vendor.index.setStorageSync("role", role);
  },
  [LOGIN_FAILURE](state2, error) {
    state2.loginLoading = false;
    state2.loginError = error;
    state2.isAuthenticated = false;
  },
  [REGISTER_REQUEST](state2) {
    state2.registerLoading = true;
    state2.registerError = null;
  },
  [REGISTER_SUCCESS](state2) {
    state2.registerLoading = false;
    state2.registerError = null;
  },
  [REGISTER_FAILURE](state2, error) {
    state2.registerLoading = false;
    state2.registerError = error;
  },
  [LOGOUT](state2) {
    state2.isAuthenticated = false;
    state2.token = "";
    state2.userId = "";
    state2.role = "";
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("userId");
    common_vendor.index.removeStorageSync("role");
  },
  [CHECK_AUTH_SUCCESS](state2, { userId, role }) {
    state2.userId = userId;
    state2.role = role;
    state2.isAuthenticated = true;
  }
};
const actions = {
  /**
   * @description 用户登录
   * @param {Object} context - Vuex上下文
   * @param {Object} credentials - 登录凭证
   * @returns {Promise<Object>} 登录结果
   */
  async login({ commit }, credentials) {
    var _a, _b;
    commit(LOGIN_REQUEST);
    try {
      const response = await store_services_index.services.auth.login(credentials);
      const { token, userId, role } = response.data;
      commit(LOGIN_SUCCESS, { token, userId, role });
      return { success: true, data: response.data };
    } catch (error) {
      commit(LOGIN_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "登录失败");
      return { success: false, error };
    }
  },
  /**
   * @description 用户注册
   * @param {Object} context - Vuex上下文
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 注册结果
   */
  async register({ commit }, userData) {
    var _a, _b;
    commit(REGISTER_REQUEST);
    try {
      const response = await store_services_index.services.auth.register(userData);
      commit(REGISTER_SUCCESS);
      return { success: true, data: response.data };
    } catch (error) {
      commit(REGISTER_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "注册失败");
      return { success: false, error };
    }
  },
  /**
   * @description 用户登出
   * @param {Object} context - Vuex上下文
   */
  logout({ commit }) {
    commit(LOGOUT);
  },
  /**
   * @description 检查认证状态
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object|null>} 用户信息或null
   */
  async checkAuthStatus({ commit, state: state2 }) {
    if (!state2.token)
      return null;
    try {
      const response = await store_services_index.services.auth.getUserInfo();
      const { userId, role } = response.data;
      commit(CHECK_AUTH_SUCCESS, { userId, role });
      return response.data;
    } catch (error) {
      commit(LOGOUT);
      return null;
    }
  }
};
const auth = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.auth = auth;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/auth.js.map
