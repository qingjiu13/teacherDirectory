"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const isUsingMockData = () => {
  return common_vendor.index.getStorageSync("use_mock_api") === "true" || true;
};
const state = {
  profile: {
    avatar: "",
    // 用户头像
    nickname: "",
    // 昵称
    tags: [],
    // 标签
    certTag: "",
    // 教师认证标签
    otherTags: [],
    // 教师其他标签
    introduction: "",
    // 个人介绍
    gender: "",
    // 性别
    phone: "",
    // 手机号
    wechat: "",
    // 微信号
    password: "未设置"
    // 密码状态
  },
  role: null,
  // 用户角色
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  mockMode: isUsingMockData()
};
const getters = {
  profile: (state2) => state2.profile,
  isProfileLoaded: (state2) => !!state2.profile.nickname,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  updateLoading: (state2) => state2.updateLoading,
  updateError: (state2) => state2.updateError,
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
  // 标签相关getters
  teacherCertTag: (state2, getters2) => {
    if (getters2.isTeacher) {
      return state2.profile.certTag || (state2.profile.tags && state2.profile.tags.length > 0 ? state2.profile.tags[0] : "");
    }
    return "";
  },
  teacherOtherTags: (state2, getters2) => {
    if (getters2.isTeacher) {
      return state2.profile.otherTags && state2.profile.otherTags.length > 0 ? state2.profile.otherTags : state2.profile.tags && state2.profile.tags.length > 1 ? state2.profile.tags.slice(1) : [];
    }
    return [];
  },
  studentTags: (state2, getters2) => {
    if (getters2.isStudent && state2.profile.tags) {
      return state2.profile.tags;
    }
    return [];
  },
  // 角色相关getters
  isTeacher: (state2, getters2, rootState) => {
    var _a;
    return state2.role === "teacher" || ((_a = rootState.auth) == null ? void 0 : _a.role) === "teacher";
  },
  isStudent: (state2, getters2, rootState) => {
    var _a;
    return state2.role === "student" || ((_a = rootState.auth) == null ? void 0 : _a.role) === "student";
  },
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
    let certTag = "";
    let otherTags = [];
    if (state2.role === "teacher" && profile.tags && profile.tags.length > 0) {
      certTag = profile.certTag || profile.tags[0];
      otherTags = profile.otherTags || (profile.tags.length > 1 ? profile.tags.slice(1) : []);
    }
    state2.profile = {
      ...state2.profile,
      avatar: profile.avatar || state2.profile.avatar,
      nickname: profile.nickname || profile.name || state2.profile.nickname,
      tags: profile.tags || state2.profile.tags,
      certTag,
      otherTags,
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
  [SET_USER_ROLE](state2, role) {
    state2.role = role;
  }
};
const getUserRole = (state2, rootState) => {
  var _a;
  let role = common_vendor.index.getStorageSync("userRole");
  if (!role) {
    role = ((_a = rootState.auth) == null ? void 0 : _a.role) || "student";
  }
  return role;
};
const actions = {
  /**
   * @description 获取用户个人资料
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 个人资料
   */
  async fetchProfile({ commit, rootState }) {
    var _a, _b;
    commit(FETCH_PROFILE_REQUEST);
    try {
      const role = getUserRole(null, rootState);
      commit(SET_USER_ROLE, role);
      const response = await store_services_index.services.user.getUserProfile(role);
      commit(FETCH_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_PROFILE_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取个人资料失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新用户个人资料
   * @param {Object} context - Vuex上下文
   * @param {Object} profileData - 个人资料数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateProfile({ commit, state: state2, rootState }, profileData) {
    var _a, _b;
    commit(UPDATE_PROFILE_REQUEST);
    try {
      const role = getUserRole(state2, rootState);
      commit(SET_USER_ROLE, role);
      const response = await store_services_index.services.user.updateUserProfile(role, profileData);
      commit(UPDATE_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(UPDATE_PROFILE_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "更新个人资料失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 清除用户个人资料
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
    var _a, _b;
    commit(UPDATE_PROFILE_REQUEST);
    try {
      const role = getUserRole(state2, rootState);
      const response = await store_services_index.services.user.setUserPassword(role, passwordData);
      commit(UPDATE_PROFILE_SUCCESS, { hasPassword: true });
      return response.data;
    } catch (error) {
      commit(UPDATE_PROFILE_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "设置密码失败");
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
    if (newRole !== "teacher" && newRole !== "student") {
      return Promise.reject(new Error("无效的角色"));
    }
    try {
      const currentRole = getUserRole(null, rootState);
      const response = await store_services_index.services.user.switchUserRole(currentRole, newRole);
      common_vendor.index.setStorageSync("userRole", newRole);
      commit(SET_USER_ROLE, newRole);
      await dispatch("fetchProfile");
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新教师认证标签
   * @param {Object} context - Vuex上下文
   * @param {String} certTag - 认证标签
   * @returns {Promise<Object>} 更新结果
   */
  async updateTeacherCertTag({ state: state2, dispatch }, certTag) {
    if (state2.role !== "teacher") {
      return Promise.reject(new Error("只有教师可以设置认证标签"));
    }
    try {
      const profileData = {
        certTag,
        otherTags: state2.profile.otherTags || (state2.profile.tags && state2.profile.tags.length > 1 ? state2.profile.tags.slice(1) : [])
      };
      return await dispatch("updateProfile", profileData);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新教师其他标签
   * @param {Object} context - Vuex上下文
   * @param {Array} otherTags - 其他标签数组
   * @returns {Promise<Object>} 更新结果
   */
  async updateTeacherOtherTags({ state: state2, dispatch }, otherTags) {
    if (state2.role !== "teacher") {
      return Promise.reject(new Error("只有教师可以设置其他标签"));
    }
    try {
      const profileData = {
        certTag: state2.profile.certTag || (state2.profile.tags && state2.profile.tags.length > 0 ? state2.profile.tags[0] : ""),
        otherTags
      };
      return await dispatch("updateProfile", profileData);
    } catch (error) {
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
