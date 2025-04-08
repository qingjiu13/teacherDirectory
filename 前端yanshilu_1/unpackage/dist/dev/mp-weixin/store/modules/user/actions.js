"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_auth_api = require("../../services/auth.api.js");
const actions = {
  /**
   * @description 用户登录
   * @param {Object} context - Vuex上下文
   * @param {Object} credentials - 登录凭证
   * @returns {Promise<Object>} 登录结果
   */
  async login({ commit }, credentials) {
    try {
      const response = await store_services_auth_api.login(credentials);
      if (response.success) {
        const { token, refreshToken, expiresIn, userInfo, role } = response.data;
        commit("SET_AUTH", { token, refreshToken, expiresIn });
        commit("SET_LOGGED_IN", true);
        commit("SET_ROLE", role);
        commit("SET_USER_INFO", userInfo);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || "登录失败" };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/user/actions.js:32", "登录失败:", error);
      return { success: false, message: error.message || "登录过程中发生错误" };
    }
  },
  /**
   * @description 获取用户信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 用户信息
   */
  async getUserInfo({ commit, state, dispatch }) {
    try {
      if (!state.auth.token) {
        const refreshResult = await dispatch("refreshToken");
        if (!refreshResult.success) {
          return { success: false, message: "获取用户信息失败: 无有效令牌" };
        }
      }
      const response = await store_services_auth_api.getUserInfo(state.auth.token);
      if (response.success) {
        commit("SET_USER_INFO", response.data);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || "获取用户信息失败" };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/user/actions.js:61", "获取用户信息失败:", error);
      return { success: false, message: error.message || "获取用户信息过程中发生错误" };
    }
  },
  /**
   * @description 刷新令牌
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 刷新结果
   */
  async refreshToken({ commit, state }) {
    try {
      if (!state.auth.refreshToken) {
        return { success: false, message: "没有可用的刷新令牌" };
      }
      const response = await store_services_auth_api.refreshToken(state.auth.refreshToken);
      if (response.success) {
        const { token, refreshToken, expiresIn } = response.data;
        commit("SET_AUTH", { token, refreshToken, expiresIn });
        return { success: true };
      } else {
        commit("CLEAR_AUTH");
        return { success: false, message: response.message || "刷新令牌失败" };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/user/actions.js:88", "刷新令牌失败:", error);
      commit("CLEAR_AUTH");
      return { success: false, message: error.message || "刷新令牌过程中发生错误" };
    }
  },
  /**
   * @description 用户登出
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 登出结果
   */
  logout({ commit }) {
    commit("CLEAR_AUTH");
    return { success: true, message: "登出成功" };
  },
  /**
   * @description 检查登录状态
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 登录状态
   */
  async checkLoginStatus({ state, commit, dispatch }) {
    try {
      if (!state.isLoggedIn) {
        return { success: false, message: "未登录" };
      }
      const token = state.auth.token;
      const tokenExpireTime = state.auth.tokenExpireTime;
      if (!token || !tokenExpireTime || tokenExpireTime <= Date.now()) {
        const refreshResult = await dispatch("refreshToken");
        if (!refreshResult.success) {
          commit("CLEAR_AUTH");
          return { success: false, message: "登录已过期" };
        }
      }
      const userInfoResult = await dispatch("getUserInfo");
      if (!userInfoResult.success) {
        commit("CLEAR_AUTH");
        return { success: false, message: "获取用户信息失败，请重新登录" };
      }
      return { success: true, message: "已登录" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/user/actions.js:141", "检查登录状态失败:", error);
      commit("CLEAR_AUTH");
      return { success: false, message: error.message || "检查登录状态过程中发生错误" };
    }
  },
  /**
   * @description 更新用户信息
   * @param {Object} context - Vuex上下文
   * @param {Object} userInfo - 用户信息
   * @returns {Promise<Object>} 更新结果
   */
  async updateUserInfo({ commit, state }, userInfo) {
    try {
      setTimeout(() => {
      }, 300);
      commit("UPDATE_USER_INFO", userInfo);
      return { success: true, message: "用户信息已更新" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/user/actions.js:162", "更新用户信息失败:", error);
      return { success: false, message: error.message || "更新用户信息过程中发生错误" };
    }
  },
  /**
   * @description 更新注册状态
   * @param {Object} context - Vuex上下文
   * @param {Object} registrationData - 注册数据
   * @returns {Promise<Object>} 更新结果
   */
  updateRegistration({ commit }, registrationData) {
    commit("SET_REGISTRATION", registrationData);
    return { success: true };
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/user/actions.js.map
