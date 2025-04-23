"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_baseInfo_config = require("./config.js");
const api = store_user_baseInfo_config.getApiImplementation();
const { getUserInfo, updateUserInfo, updateRole } = api;
const actions = {
  /**
   * @description 获取用户信息
   * @param {Object} context - Vuex上下文对象
   * @returns {Promise} - 返回Promise对象
   */
  async getUserInfo({ commit }) {
    try {
      const response = await getUserInfo();
      if (response.success) {
        commit("SET_USER_INFO", response.data);
        return response.data;
      } else {
        return Promise.reject(response.error || { message: "获取用户信息失败" });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:30", "获取用户信息失败", error);
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新用户信息
   * @param {Object} context - Vuex上下文对象
   * @param {Object} userInfo - 用户信息
   * @returns {Promise} - 返回Promise对象
   */
  async updateUserInfo({ commit }, userInfo) {
    try {
      const response = await updateUserInfo(userInfo);
      if (response.success) {
        commit("UPDATE_USER_INFO", response.data.userInfo || userInfo);
        return response.data;
      } else {
        return Promise.reject(response.error || { message: "更新用户信息失败" });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:53", "更新用户信息失败", error);
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新用户角色
   * @param {Object} context - Vuex上下文对象
   * @param {string} role - 用户角色
   * @returns {Promise} - 返回Promise对象
   */
  async updateRole({ commit }, role) {
    try {
      const response = await updateRole(role);
      if (response.success) {
        commit("updateRole", role);
        common_vendor.index.setStorageSync("userRole", role);
        return { success: true, role };
      } else {
        return Promise.reject(response.error || { message: "更新用户角色失败" });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:81", "更新用户角色失败:", error);
      try {
        commit("updateRole", role);
        common_vendor.index.setStorageSync("userRole", role);
      } catch (e) {
        common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:88", "本地更新角色失败", e);
      }
      return Promise.reject(error);
    }
  },
  /**
   * @description 用户登出
   * @param {Object} context - Vuex上下文对象
   * @returns {Promise} - 返回Promise对象
   */
  async logout({ commit }) {
    try {
      commit("CLEAR_USER_INFO");
      common_vendor.index.removeStorageSync("userId");
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.removeStorageSync("user-token");
      common_vendor.index.removeStorageSync("userBaseInfo");
      return { success: true, message: "退出登录成功" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:117", "退出登录失败:", error);
      return Promise.reject({ message: "退出登录失败" });
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/actions.js.map
