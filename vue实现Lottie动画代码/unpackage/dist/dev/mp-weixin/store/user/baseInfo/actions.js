"use strict";
const common_vendor = require("../../../common/vendor.js");
const { getUserInfo, updateUserInfo, updateRole } = {
  // 这里可以替换为真实API实现
  getUserInfo: () => Promise.resolve({
    success: true,
    data: {
      id: "1566454",
      avatar: "/static/image/tab-bar/default_avatar.png",
      name: "张三",
      gender: "男",
      selfIntroduction: "我是一个热爱学习的人",
      wechatNumber: "1234567890",
      phoneNumber: "1234567890",
      password: "123456",
      isRegistered: 0,
      userInfo: {
        certificate: 0,
        role: "学生",
        school: "天津大学",
        major: "计算机科学与技术",
        targetSchool: "清华大学",
        targetMajor: "计算机科学与技术",
        studentGrade: "大三",
        teacherGrade: "研一",
        teacherScore: 0
      }
    }
  }),
  updateUserInfo: (userInfo) => Promise.resolve({ success: true, data: { userInfo } }),
  updateRole: () => Promise.resolve({ success: true })
};
const actions = {
  /**
   * @description 获取用户信息
   * @param {Object} context - Vuex上下文对象
   * @returns {Promise} - 返回Promise对象
   */
  async getUserInfo({ commit, state }) {
    common_vendor.index.__f__("log", "at store/user/baseInfo/actions.js:45", "getUserInfo action开始执行, 当前state:", {
      id: state.id,
      name: state.name
    });
    try {
      if (state.name && state.name !== "") {
        common_vendor.index.__f__("log", "at store/user/baseInfo/actions.js:53", "本地已有数据，直接返回state");
        return {
          id: state.id,
          avatar: state.avatar,
          name: state.name,
          gender: state.gender,
          selfIntroduction: state.selfIntroduction,
          wechatNumber: state.wechatNumber,
          phoneNumber: state.phoneNumber,
          userInfo: state.userInfo
        };
      }
      common_vendor.index.__f__("log", "at store/user/baseInfo/actions.js:66", "本地无数据，请求API");
      const response = await getUserInfo();
      common_vendor.index.__f__("log", "at store/user/baseInfo/actions.js:68", "API返回结果:", response);
      if (response.success) {
        commit("SET_USER_INFO", response.data);
        common_vendor.index.__f__("log", "at store/user/baseInfo/actions.js:73", "提交SET_USER_INFO后，state变为:", {
          id: state.id,
          name: state.name
        });
        return response.data;
      } else {
        common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:80", "API返回失败:", response.error);
        return Promise.reject(response.error || { message: "获取用户信息失败" });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:84", "获取用户信息失败", error);
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
        commit("UPDATE_USER_INFO", userInfo);
        return { success: true };
      } else {
        return Promise.reject(response.error || { message: "更新用户信息失败" });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:108", "更新用户信息失败", error);
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新用户扩展信息
   * @param {Object} context - Vuex上下文对象
   * @param {Object} userInfoData - 用户扩展信息
   * @returns {Promise} - 返回Promise对象
   */
  async updateUserInfoData({ commit }, userInfoData) {
    try {
      const response = await updateUserInfo({ userInfo: userInfoData });
      if (response.success) {
        commit("UPDATE_USER_INFO_DATA", userInfoData);
        return { success: true };
      } else {
        return Promise.reject(response.error || { message: "更新用户扩展信息失败" });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:132", "更新用户扩展信息失败", error);
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新用户角色
   * @param {Object} context - Vuex上下文对象
   * @param {string} role - 用户角色
   * @returns {Promise} - 返回Promise对象
   */
  async updateRole({ commit, state }, role) {
    common_vendor.index.__f__("log", "at store/user/baseInfo/actions.js:144", "updateRole action开始执行, 角色:", role, "当前role:", state.userInfo.role);
    try {
      const response = await updateRole(role);
      if (response.success) {
        commit("updateRole", role);
        common_vendor.index.__f__("log", "at store/user/baseInfo/actions.js:153", "角色更新成功，新角色:", state.userInfo.role);
        common_vendor.index.setStorageSync("userRole", role);
        return { success: true, role };
      } else {
        return Promise.reject(response.error || { message: "更新用户角色失败" });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:163", "更新用户角色失败:", error);
      try {
        commit("updateRole", role);
        common_vendor.index.setStorageSync("userRole", role);
      } catch (e) {
        common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:170", "本地更新角色失败", e);
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
      common_vendor.index.removeStorageSync("userInfoData");
      common_vendor.index.removeStorageSync("userRole");
      return { success: true, message: "退出登录成功" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/baseInfo/actions.js:198", "退出登录失败:", error);
      return Promise.reject({ message: "退出登录失败" });
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/actions.js.map
