"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const isUsingMockData = () => {
  const storageSetting = common_vendor.index.getStorageSync("use_mock_api");
  if (storageSetting === "true") {
    common_vendor.index.__f__("log", "at store/modules/common/user.js:18", "用户模块: 本地存储设置使用模拟数据");
    return true;
  }
  return true;
};
const state = {
  profile: {
    avatar: "",
    // 用户头像
    nickname: "",
    // 昵称
    tags: [],
    // 标签
    introduction: "",
    // 个人介绍
    gender: "",
    // 性别，可以是 'male'/'female'
    phone: "",
    // 手机号
    wechat: "",
    // 微信号
    password: "未设置"
    // 密码状态
  },
  role: null,
  // 用户角色: 'teacher' 或 'student'
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  mockMode: isUsingMockData()
  // 添加模拟模式状态
};
const getters = {
  profile: (state2) => state2.profile,
  isProfileLoaded: (state2) => !!state2.profile.nickname,
  // 通过昵称判断资料是否加载
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  updateLoading: (state2) => state2.updateLoading,
  updateError: (state2) => state2.updateError,
  /**
   * @description 判断是否使用模拟数据
   * @param {Object} state - 当前模块状态
   * @returns {Boolean} 是否使用模拟数据
   */
  isMockMode: (state2) => state2.mockMode || isUsingMockData(),
  // 基本信息getters
  avatar: (state2) => state2.profile.avatar || "",
  nickname: (state2) => state2.profile.nickname || "",
  tags: (state2) => state2.profile.tags || [],
  introduction: (state2) => state2.profile.introduction || "",
  gender: (state2) => state2.profile.gender || "",
  phone: (state2) => state2.profile.phone || "",
  wechat: (state2) => state2.profile.wechat || "",
  password: (state2) => state2.profile.password || "未设置",
  /**
   * @description 判断用户是否为老师
   * @param {Object} state - 当前模块状态
   * @param {Object} getters - 当前模块的getters
   * @param {Object} rootState - 根状态
   * @returns {Boolean} 是否为老师
   */
  isTeacher: (state2, getters2, rootState) => {
    var _a;
    return state2.role === "teacher" || ((_a = rootState.auth) == null ? void 0 : _a.role) === "teacher";
  },
  /**
   * @description 判断用户是否为学生（非老师）
   * @param {Object} state - 当前模块状态
   * @param {Object} getters - 当前模块的getters
   * @param {Object} rootState - 根状态
   * @returns {Boolean} 是否为学生
   */
  isStudent: (state2, getters2, rootState) => {
    var _a;
    return state2.role === "student" || ((_a = rootState.auth) == null ? void 0 : _a.role) === "student";
  },
  /**
   * @description 获取用户角色
   * @param {Object} state - 当前模块状态
   * @param {Object} getters - 当前模块的getters
   * @param {Object} rootState - 根状态
   * @returns {String} 用户角色
   */
  userRole: (state2, getters2, rootState) => {
    var _a;
    return state2.role || ((_a = rootState.auth) == null ? void 0 : _a.role) || "";
  }
};
const FETCH_PROFILE_REQUEST = "FETCH_PROFILE_REQUEST";
const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";
const FETCH_PROFILE_FAILURE = "FETCH_PROFILE_FAILURE";
const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";
const CLEAR_PROFILE = "CLEAR_PROFILE";
const SET_USER_ROLE = "SET_USER_ROLE";
const mutations = {
  [FETCH_PROFILE_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_PROFILE_SUCCESS](state2, profile) {
    state2.profile = {
      ...state2.profile,
      avatar: profile.avatar || state2.profile.avatar,
      nickname: profile.nickname || profile.name || state2.profile.nickname,
      tags: profile.tags || state2.profile.tags,
      introduction: profile.introduction || state2.profile.introduction,
      gender: profile.gender || state2.profile.gender,
      phone: profile.phone || state2.profile.phone,
      wechat: profile.wechat || state2.profile.wechat,
      password: profile.hasPassword ? "已设置" : "未设置"
    };
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_PROFILE_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [UPDATE_PROFILE_REQUEST](state2) {
    state2.updateLoading = true;
    state2.updateError = null;
  },
  [UPDATE_PROFILE_SUCCESS](state2, profile) {
    state2.profile = {
      ...state2.profile,
      ...profile,
      password: profile.hasPassword ? "已设置" : "未设置"
    };
    state2.updateLoading = false;
    state2.updateError = null;
  },
  [UPDATE_PROFILE_FAILURE](state2, error) {
    state2.updateLoading = false;
    state2.updateError = error;
  },
  [CLEAR_PROFILE](state2) {
    state2.profile = {
      avatar: "",
      nickname: "",
      tags: [],
      introduction: "",
      gender: "",
      phone: "",
      wechat: "",
      password: "未设置"
    };
    state2.role = null;
  },
  /**
   * @description 设置用户角色
   * @param {Object} state - 当前模块状态
   * @param {String} role - 用户角色
   */
  [SET_USER_ROLE](state2, role) {
    state2.role = role;
  }
};
const actions = {
  /**
   * @description 获取用户个人资料
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 个人资料
   */
  async fetchProfile({ commit, rootState }) {
    var _a, _b, _c;
    commit(FETCH_PROFILE_REQUEST);
    try {
      let role = common_vendor.index.getStorageSync("userRole");
      if (!role) {
        role = ((_a = rootState.auth) == null ? void 0 : _a.role) || "student";
      }
      common_vendor.index.__f__("log", "at store/modules/common/user.js:196", "fetchProfile使用的角色:", role);
      commit(SET_USER_ROLE, role);
      const response = await store_services_index.services.user.getUserProfile(role);
      commit(FETCH_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_PROFILE_FAILURE, ((_c = (_b = error.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "获取个人资料失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新用户个人资料
   * @param {Object} context - Vuex上下文
   * @param {Object} profileData - 个人资料数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateProfile({ commit, rootState }, profileData) {
    var _a, _b, _c;
    commit(UPDATE_PROFILE_REQUEST);
    try {
      let role = common_vendor.index.getStorageSync("userRole");
      if (!role) {
        role = ((_a = rootState.auth) == null ? void 0 : _a.role) || "student";
      }
      common_vendor.index.__f__("log", "at store/modules/common/user.js:228", "updateProfile使用的角色:", role);
      commit(SET_USER_ROLE, role);
      const response = await store_services_index.services.user.updateUserProfile(role, profileData);
      commit(UPDATE_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(UPDATE_PROFILE_FAILURE, ((_c = (_b = error.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "更新个人资料失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 清除用户个人资料（通常在登出时调用）
   * @param {Object} context - Vuex上下文
   */
  clearProfile({ commit }) {
    commit(CLEAR_PROFILE);
  },
  /**
   * @description 设置密码
   * @param {Object} context - Vuex上下文
   * @param {Object} passwordData - 密码数据
   * @returns {Promise<Object>} 设置结果
   */
  async setPassword({ commit, state: state2, rootState }, passwordData) {
    var _a, _b, _c;
    commit(UPDATE_PROFILE_REQUEST);
    try {
      let role = common_vendor.index.getStorageSync("userRole");
      if (!role) {
        role = ((_a = rootState.auth) == null ? void 0 : _a.role) || "student";
      }
      common_vendor.index.__f__("log", "at store/modules/common/user.js:268", "setPassword使用的角色:", role);
      const response = await store_services_index.services.user.setUserPassword(role, passwordData);
      commit(UPDATE_PROFILE_SUCCESS, { hasPassword: true });
      return response.data;
    } catch (error) {
      commit(UPDATE_PROFILE_FAILURE, ((_c = (_b = error.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || "设置密码失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 切换用户角色
   * @param {Object} context - Vuex上下文
   * @param {String} newRole - 新角色
   * @returns {Promise<Object>} 切换结果
   */
  async switchRole({ commit, dispatch, rootState }, newRole) {
    var _a;
    if (newRole !== "teacher" && newRole !== "student") {
      return Promise.reject(new Error("无效的角色"));
    }
    try {
      let currentRole = common_vendor.index.getStorageSync("userRole");
      if (!currentRole) {
        currentRole = ((_a = rootState.auth) == null ? void 0 : _a.role) || "student";
      }
      common_vendor.index.__f__("log", "at store/modules/common/user.js:299", "从当前角色切换:", currentRole, "到:", newRole);
      const useMockData = common_vendor.index.getStorageSync("use_mock_api") === "true";
      common_vendor.index.__f__("log", "at store/modules/common/user.js:303", "当前模拟数据设置:", useMockData ? "启用" : "禁用");
      const response = await store_services_index.services.user.switchUserRole(currentRole, newRole);
      common_vendor.index.setStorageSync("userRole", newRole);
      if (useMockData) {
        common_vendor.index.setStorageSync("use_mock_api", "true");
      }
      commit(SET_USER_ROLE, newRole);
      await dispatch("fetchProfile");
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/user.js:324", "切换角色失败:", error);
      return Promise.reject(error);
    }
  }
};
const user = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.user = user;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/user.js.map
